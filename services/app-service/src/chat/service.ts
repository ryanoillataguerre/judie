import { InternalError, UnauthorizedError } from "../utils/errors/index.js";
import { PineconeClient } from "@pinecone-database/pinecone";
import { Configuration, OpenAIApi, ChatCompletionRequestMessage } from "openai";
import * as openai from "openai";
import dbClient from "../utils/prisma.js";
import { Chat, Message, MessageType, Prisma } from "@prisma/client";
import { ChatAndMessageResponse } from "./types.js";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY || "",
});
const openaiClient = new OpenAIApi(configuration);

const pinecone = new PineconeClient();
await pinecone.init({
  environment: process.env.PINECONE_ENVIRONMENT || "us-east1-gcp",
  apiKey: process.env.PINECONE_API_KEY || "",
});

const OPENAI_PROMPT_CHAR_LIMIT = 6000;
const OPENAI_COMPLETION_MODEL = "gpt-4-0314";

const transformMessageToChatCompletionMessage = (
  message: Message
): ChatCompletionRequestMessage => {
  const { content, type } = message;
  return {
    role: type === MessageType.USER ? "user" : "system",
    content: content,
  };
};

const createChat = async (params: Prisma.ChatCreateInput) => {
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

const updateChat = async (chatId: string, params: Prisma.ChatUpdateInput) => {
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
      },
    },
  });
  return newChat;
};

/**
 *
 * @remarks
 * This method retrieves a currently active chat and its messages for a user.
 * If no chat is found, one is created.
 *
 * @param userId - ID of the user
 * @returns ChatAndMessageResponse
 *
 * @beta
 */
export const getChatAndMessagesForUser = async (
  userId: string | undefined,
  newChat: boolean = false
): Promise<ChatAndMessageResponse> => {
  if (!userId) {
    throw new UnauthorizedError("User not found");
  }
  if (newChat) {
    return await createChat({ user: { connect: { id: userId } } });
  }
  const chat = await dbClient.chat.findFirst({
    where: {
      userId,
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: 1,
  });
  // If chat exists
  if (chat) {
    // And if it's been updated in the last 5 minutes
    // Or created in the past 5 minutes
    const FIVE_MINUTES_MS = 5 * 60 * 1000;
    const chatUpdatedWithin5Minutes = chat.updatedAt
      ? new Date().getTime() - new Date(chat.updatedAt).getTime() <
        FIVE_MINUTES_MS
      : new Date().getTime() - new Date(chat.createdAt).getTime() <
        FIVE_MINUTES_MS;
    // If so, use this current chat and messages
    if (chatUpdatedWithin5Minutes) {
      return chat;
    } else {
      // If not, create a new chat and return it with no messages
      return await createChat({ user: { connect: { id: userId } } });
    }
  } else {
    // If user has no chats, create a new chat and return it with no messages
    return await createChat({ user: { connect: { id: userId } } });
  }
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
 *
 * @beta
 */
export const createGPTRequestFromPrompt = async ({
  userId,
  prompt,
  chat,
}: {
  userId: string | undefined;
  prompt: string;
  chat: ChatAndMessageResponse;
}): Promise<ChatAndMessageResponse> => {
  try {
    if (!userId) {
      throw new UnauthorizedError("User Not Found");
    }

    // Build messages array
    const existingMessages = chat.messages;
    const newMessages = [];
    let messages = existingMessages || [];
    // If we haven't given a system prompt yet, give one
    if (messages.length === 0) {
      const promptStart =
        "You are a tutor named Judie that always responds in the Socratic style.\n\
         You *never* give the student the answer, but always try to ask just the right question to help them learn to think for themselves.\n\
         You should always tune your question to the interest & knowledge of the student, breaking down the problem into simpler parts until it's at just the right level for them.\n\n\
        ";

      newMessages.push({
        content: promptStart,
        type: MessageType.SYSTEM,
        createdAt: new Date(),
        readableContent: promptStart,
      });
    }

    // Get embedding vector from OpenAI
    const embeddingResponse = await openaiClient.createEmbedding({
      input: prompt,
      model: "text-embedding-ada-002",
    });
    const embeddingVector = embeddingResponse.data?.data?.[0]?.embedding;
    // Get matching vectors from Pinecone
    const pcIndex = pinecone.Index("apmvp");
    const pineconeResponse = await pcIndex.query({
      queryRequest: {
        vector: embeddingVector,
        topK: 3,
        includeValues: false,
        includeMetadata: true,
      },
    });
    const matches = pineconeResponse.matches;
    // Get metadata from each matching vector
    const matchMetadatas =
      matches
        ?.filter(
          (match) =>
            match &&
            !!(match.metadata as { [key: string]: string }).Sentence &&
            (match?.score || 0) > 0.8
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
          // Using 'as' because we technically have a partial above
          // but we know content is defined, which is the only concern here
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
 *
 * @beta
 */
export const getChatGPTCompletion = async (
  chat: Chat & { messages: Message[] }
): Promise<(Chat & { messages: Message[] }) | undefined> => {
  try {
    const transformedMessages = chat.messages.map((message: Message) =>
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
            currentMessagesContentLength + val.content.length >
            OPENAI_PROMPT_CHAR_LIMIT
          ) {
            return acc;
          } else {
            currentMessagesContentLength += val.content.length;
            return [...acc, val];
          }
        },
        []
      );
    const completion = await openaiClient.createChatCompletion({
      model: OPENAI_COMPLETION_MODEL,
      messages: maxLengthLimitedMessages,
      user: chat.userId,
      temperature: 1.0,
      max_tokens: 800,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    const completionMessageContent =
      completion.data.choices[0].message?.content;

    if (completionMessageContent) {
      const newMessage = {
        content: completionMessageContent,
        type: MessageType.BOT,
        createdAt: new Date(),
        readableContent: completionMessageContent,
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
  } catch (err) {
    console.error("OpenAI error", err);
    throw err;
  }
};
