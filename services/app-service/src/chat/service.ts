import { InternalError, NotFoundError } from "../utils/errors/index.js";
import { PineconeClient, QueryRequest } from "@pinecone-database/pinecone";
import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from "openai";
import dbClient from "../utils/prisma.js";
import { Chat, Message, MessageType, Prisma } from "@prisma/client";
import { ChatAndMessageResponse } from "./types.js";
import { subjectToNamespaceMap, subjectToPromptMap } from "./consts.js";
import { IncomingMessage } from "http";
import { Response } from "express";

// Chat Service
export const createChat = async (params: Prisma.ChatCreateInput) => {
  const newChat = await dbClient.chat.create({
    data: {
      ...params,
    },
    include: {
      messages: true,
    },
  });
  return newChat;
};

export const deleteChat = async (chatId: string) => {
  if (!chatId) {
    throw new InternalError("Chat ID not provided");
  }

  const chat = await dbClient.chat.update({
    where: {
      id: chatId,
    },
    data: {
      deletedAt: new Date(),
    },
  });
  return chat;
};

export const deleteChatsForUser = async (userId: string) => {
  if (!userId) {
    throw new InternalError("User ID not provided");
  }
  await dbClient.chat.updateMany({
    where: {
      userId,
    },
    data: {
      deletedAt: new Date(),
    },
  });
};

export const updateChat = async (
  chatId: string,
  params: Prisma.ChatUpdateInput
) => {
  const newChat = await dbClient.chat.update({
    where: {
      id: chatId,
    },
    data: params,
    include: {
      messages: {
        orderBy: {
          createdAt: "desc",
        },
        where: {
          type: {
            not: MessageType.SYSTEM,
          },
        },
      },
    },
  });
  return newChat;
};

export const getChat = async (params: Prisma.ChatWhereUniqueInput) => {
  const chat = await dbClient.chat.findFirst({
    where: {
      ...params,
      deletedAt: null,
    },
    include: {
      messages: {
        orderBy: {
          updatedAt: "desc",
        },
        where: {
          type: {
            not: MessageType.SYSTEM,
          },
        },
      },
    },
  });
  return chat;
};

export const getChatInternal = async (params: Prisma.ChatWhereUniqueInput) => {
  const chat = await dbClient.chat.findUnique({
    where: params,
    include: {
      messages: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
  return chat;
};

export const getUserChats = async (userId: string) => {
  const chats = await dbClient.chat.findMany({
    where: {
      userId,
      deletedAt: null,
    },
    include: {
      messages: {
        take: 1,
        orderBy: {
          updatedAt: "desc",
        },
        where: {
          type: {
            not: MessageType.SYSTEM,
          },
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });
  return chats;
};

export const getCompletion = async ({
  chatId,
  query,
  userId,
  response,
}: {
  chatId?: string;
  query: string;
  userId: string;
  response: Response;
}) => {
  let chat: Chat & { messages: Message[] };
  if (!chatId) {
    chat = await createChat({
      user: { connect: { id: userId } },
    });
  } else {
    const existingChat = await getChat({
      id: chatId as string,
    });
    if (existingChat) {
      chat = existingChat;
    } else {
      throw new NotFoundError("Could not find chat");
    }
  }
  console.time("createRequest");
  // Create GPT request from prompt
  await createGPTRequestFromPrompt({
    prompt: query,
    chat,
  });
  console.timeEnd("createRequest");

  const newChat = await getChatInternal({
    id: chat.id,
  });
  if (!newChat) {
    throw new InternalError("Could not get chat");
  }
  // Get response from ChatGPT
  console.time("getChatGPTCompletion");
  const latestChat = await getChatGPTCompletion(newChat, (chunk: string) => {
    response.write(chunk);
  });
  console.timeEnd("getChatGPTCompletion");
  if (!latestChat) {
    throw new InternalError("Could not get response from ChatGPT");
  }
  return latestChat;
};

// OpenAI-relevant methods

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY || "",
});
const openaiClient = new OpenAIApi(configuration);

const pinecone = new PineconeClient();
await pinecone.init({
  environment: process.env.PINECONE_ENVIRONMENT || "us-east1-gcp",
  apiKey: process.env.PINECONE_API_KEY || "",
});

export const OPENAI_PROMPT_TOKEN_LIMIT = 6000;
export const OPENAI_COMPLETION_MODEL = "gpt-4-0314";

export const transformMessageToChatCompletionMessage = (
  message: Message
): ChatCompletionRequestMessage => {
  const { content, type } = message;
  return {
    role: type === MessageType.USER ? "user" : "system",
    content: content,
  };
};

/**
 *
 * @remarks
 * This method takes an existing chat and its messages,
 * Generates a new prompt from the existing chat and its messages
 * and then saves that prompt to the DB.
 *
 * @param userId - ID of the user
 * @param prompt - The prompt the user just supplied
 * @param chat - ChatAndMessageResponse
 * @returns ChatAndMessageResponse
 */
export const createGPTRequestFromPrompt = async ({
  prompt,
  chat,
}: {
  prompt: string;
  chat: ChatAndMessageResponse;
}): Promise<ChatAndMessageResponse> => {
  try {
    // Build messages array
    const existingMessages = chat.messages;
    const newMessages = [];
    let messages = existingMessages || [];
    // If we haven't given a system prompt yet, give one
    if (messages.length === 0) {
      // Default prompt
      let defaultPrompt =
        "You are a tutor designed to help students learn.\n\
        You use the socratic method to teach, but you balance that with other teaching methods to make sure the student can learn.\n\
        You will ask questions upfront to assess the students level with the topic, but if they do not know anything about the topic you will teach them.\n\
        You are very careful with your math calculations.\n\
        Use examples from their interests to keep learning engaging.\n\
        You prefer to ask questions to guide the student to the correct answer.\n\
        You will answer the question using the given context, if any.\n\
        ";

      // If subject, mutate prompt
      if (chat.subject) {
        defaultPrompt = subjectToPromptMap[chat.subject] || prompt;
      } else {
        // Set subject = default on chat
        await updateChat(chat.id, { subject: "default" });
      }
      let defaultMessage = {
        content: defaultPrompt,
        type: MessageType.SYSTEM,
        createdAt: new Date(),
        readableContent: prompt,
      };
      newMessages.push(defaultMessage);
    }

    // Get embedding vector from OpenAI
    const embeddingResponse = await openaiClient.createEmbedding({
      input: prompt,
      model: "text-embedding-ada-002",
    });
    const embeddingVector = embeddingResponse.data?.data?.[0]?.embedding;
    // Get matching vectors from Pinecone
    const pcIndex = pinecone.Index("judieai");
    let queryRequest: QueryRequest = {
      vector: embeddingVector,
      topK: 3,
      includeValues: false,
      includeMetadata: true,
    };
    if (chat.subject && subjectToNamespaceMap[chat.subject]) {
      queryRequest.namespace = subjectToNamespaceMap[chat.subject] || "default";
    }
    const pineconeResponse = await pcIndex.query({
      queryRequest,
    });
    const matches = pineconeResponse.matches;
    // Get metadata from each matching vector
    const matchMetadatas =
      matches
        ?.filter(
          (match) =>
            match &&
            !!(match.metadata as { [key: string]: string }).Sentence &&
            (match?.score || 0) > 0.9
        )
        ?.map(
          (match) => (match.metadata as { [key: string]: string }).Sentence
        ) || [];
    // Build latest prompt object
    let promptChunks = [];
    if (matchMetadatas.length > 0) {
      promptChunks.push("Context: \n");
      for (const matchMetadata of matchMetadatas) {
        promptChunks.push(`${matchMetadata}\n`);
      }
    }

    promptChunks.push("Question: \n");
    promptChunks.push(`${prompt}\n`);
    const currentPrompt = promptChunks.join("");

    // Push this prompt to messages arr
    newMessages.push({
      content: currentPrompt,
      type: MessageType.USER,
      readableContent: prompt,
      createdAt: new Date(),
    });

    // Update chat with new messages
    const newMessagesMapped: Prisma.MessageCreateManyChatInput[] =
      newMessages.map((m) => ({
        content: m.content,
        type: m.type,
        createdAt: m.createdAt,
        readableContent: m.readableContent,
      }));

    const newChat = await updateChat(chat.id, {
      messages: {
        createMany: {
          data: newMessagesMapped,
        },
      },
    });
    return newChat;
  } catch (err) {
    console.error("Error building prompt: ", err);
    throw err;
  }
};

/**
 * @remarks
 * This method takes an existing chat and its messages,
 * Generates a new prompt from the existing chat and its messages
 * sends the prompt to OpenAI to get a completion
 * and then saves that completion to the DB.
 * @param userId - ID of the user
 * @param chat - ChatAndMessageResponse
 * @returns ChatAndMessageResponse
 */
export const getChatGPTCompletion = async (
  chat: Chat & { messages: Message[] },
  onChunkReceived: (chunk: string) => void
): Promise<(Chat & { messages: Message[] }) | undefined> => {
  try {
    const transformedMessages = chat.messages
      .reverse()
      .map((message: Message) =>
        transformMessageToChatCompletionMessage(message)
      );

    let currentMessagesContentLength = 0;
    const maxLengthLimitedMessages: ChatCompletionRequestMessage[] =
      transformedMessages.reduce(
        (
          acc: ChatCompletionRequestMessage[],
          val: ChatCompletionRequestMessage
        ) => {
          if (
            currentMessagesContentLength + val.content.split(" ").length >
            OPENAI_PROMPT_TOKEN_LIMIT
          ) {
            return acc;
          } else {
            currentMessagesContentLength += val.content.split(" ").length;
            return [...acc, val];
          }
        },
        []
      );

    let fullContent = "";
    await new Promise(async (resolve, reject) => {
      const response = await openaiClient.createChatCompletion(
        {
          model: OPENAI_COMPLETION_MODEL,
          messages: maxLengthLimitedMessages,
          user: chat.userId,
          temperature: 0.7,
          max_tokens: 600,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
          stream: true,
        },
        { responseType: "stream" }
      );

      const stream = response.data as unknown as IncomingMessage;

      stream.on("data", (chunk: Buffer) => {
        // Messages in the event stream are separated by a pair of newline characters.
        const payloads = chunk.toString().split("\n\n");
        for (const payload of payloads) {
          if (payload.includes("[DONE]")) {
            return;
          }
          if (payload.startsWith("data:")) {
            const data = payload.replaceAll(/(\n)?^data:\s*/g, ""); // in case there's multiline data event
            try {
              const delta = JSON.parse(data.trim());
              const content = delta.choices[0].delta?.content;
              const filteredContent = content?.replace("undefined", "");
              if (filteredContent) {
                fullContent += filteredContent;
                onChunkReceived(filteredContent);
              }
            } catch (error) {
              throw new InternalError("Error parsing OpenAI stream");
            }
          }
        }
      });

      stream.on("end", () => {
        resolve(fullContent);
      });
      stream.on("error", (e: Error) => {
        console.error("Stream error: ", e);
        reject(e);
      });
    });

    if (fullContent) {
      const newMessage = {
        content: fullContent,
        type: MessageType.BOT,
        createdAt: new Date(),
        readableContent: fullContent,
      };
      // Save new completion to DB
      const newChat = await updateChat(chat.id, {
        updatedAt: new Date(),
        messages: {
          create: newMessage,
        },
      });

      // TODO: Make this a background job (or send to inference-service?)
      // TODO: Save to Pinecone as vector
      // Get vector from OpenAI
      // Send vector to Pinecone
      // const index = pinecone.Index("example-index");
      // const upsertRequest = {
      //   vectors: [
      //     {
      //       id: "vec1",
      //       values: [0.1, 0.2, 0.3, 0.4],
      //       metadata: {
      //         genre: "drama",
      //       },
      //     },
      //     {
      //       id: "vec2",
      //       values: [0.2, 0.3, 0.4, 0.5],
      //       metadata: {
      //         genre: "action",
      //       },
      //     },
      //   ],
      //   namespace: "example-namespace",
      // };
      // const upsertResponse = await index.upsert({ upsertRequest });
      return newChat;
    } else {
      throw new InternalError("Could not get completion from OpenAI");
    }
    return;
  } catch (err) {
    console.error("OpenAI error", err);
    throw err;
  }
};
