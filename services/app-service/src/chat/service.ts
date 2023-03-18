import bcrypt from "bcryptjs";
import validator from "validator";
import { BadRequestError, InternalError } from "../utils/errors/index.js";
import { PineconeClient } from "@pinecone-database/pinecone";
import { JudieSession } from "../utils/express.js";
import {
  Configuration,
  OpenAIApi,
  ChatCompletionRequestMessage,
  ChatCompletionResponseMessage,
} from "openai";
import * as openai from "openai";
import dbClient from "../utils/prisma.js";
import { Chat, Message, MessageType } from "@prisma/client";

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

const getChatCompletionRequestMessageRoleEnumFromMessageType = (
  messageType: MessageType
): openai.ChatCompletionRequestMessageRoleEnum => {
  switch (messageType) {
    case MessageType.USER:
      return "user";
    case MessageType.BOT:
      return "system";
    default:
      throw new InternalError("Invalid message type");
  }
};

const transformMessageToChatCompletionMessage = (
  message: Message
): ChatCompletionRequestMessage => {
  const { content, type } = message;
  return {
    role: type === MessageType.USER ? "user" : "system",
    content: content,
  };
};

export const createGPTRequestFromPrompt = async (
  userId: string,
  prompt: string
): Promise<ChatCompletionRequestMessage[]> => {
  try {
    // Chat object we will be working with
    let chat: Chat | (Chat & { messages: Message[] }) | null = null;
    // Find the most recently updated chat for this user
    let existingChat = await dbClient.chat.findFirst({
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
    chat = existingChat;

    // Test if:
    // 1. existingChat exists
    // 2. existingChat has been updated in the past 5 minutes
    const chatUpdatedWithin5Minutes =
      existingChat &&
      existingChat.updatedAt &&
      new Date().getTime() - new Date(existingChat.updatedAt).getTime() <
        5 * 60 * 1000;
    // If not, create a new chat
    if (!chatUpdatedWithin5Minutes) {
      const newChat = await dbClient.chat.create({
        data: {
          userId,
        },
      });
      chat = newChat;
    }

    const chatMessages = existingChat?.messages || [];

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
        includeValues: true,
        includeMetadata: true,
        filter: {
          range: {
            score: {
              min: 0.8,
            },
          },
        },
      },
    });
    const matches = pineconeResponse.matches;

    // Get metadata from each matching vector
    const matchMetadatas =
      matches?.map(
        (match) => (match.metadata as { [key: string]: string }).text
      ) || [];

    // Build messages array
    let messages: ChatCompletionRequestMessage[] = [];
    // If we haven't given a system prompt yet, give one
    if (chatMessages.length === 0) {
      const promptStart =
        "You are an advanced AI Tutor named Judie that always responds in the Socratic style, and students are asking you questions.\n\
      You will get the user question as well as relevant context to answer that question.\n\
      I want you to provide an in-depth answer to the question and guide students to the appropriate answer.\n\
      Your tone is informal, and didactic, and you want to explain things so the largest audience can understand them. \n\
      You should always tune your question to the interest & knowledge of the student, breaking down the problem into simpler parts until it's just the right level for them. \n\n";
      messages.push({
        content: promptStart,
        role: "system",
      });
    }

    // Build latest prompt object
    let promptChunks = [];
    promptChunks.push("Context: \n");
    for (const matchMetadata of matchMetadatas) {
      promptChunks.push(`${matchMetadata}\n`);
    }
    promptChunks.push("Question: \n");
    promptChunks.push(`${prompt}\n`);

    const currentPrompt = promptChunks.join("");

    // Add user prompt and previous messages up to limit
    let charCountAllMessages = currentPrompt.length;
    // Loop over previous messages in reverse order (going up in the chat log)
    for (const existingMessage of chatMessages) {
      // Check if adding it to the existing arr of messages will exceed char limit
      const existingMessageLen = existingMessage.content.length;
      // If it will, break
      if (
        charCountAllMessages + existingMessageLen >
        OPENAI_PROMPT_CHAR_LIMIT
      ) {
        break;
      }
      // If it won't, add it to the arr of messages
      // And add its length to the total char count
      messages.push(transformMessageToChatCompletionMessage(existingMessage));
      charCountAllMessages += existingMessageLen;
    }

    // Push this prompt to messages arr
    messages.push({
      content: currentPrompt,
      role: "user",
    });

    return messages;
  } catch (err) {
    console.error("Error building prompt: ", err);
    throw err;
  }
};

export const getChatGPTCompletion = async (
  messages: ChatCompletionRequestMessage[]
): Promise<ChatCompletionResponseMessage | undefined> => {
  try {
    const completion = await openaiClient.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages,
      temperature: 1.0,
      max_tokens: 1200,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    // console.log("Completion", completion.data.choices[0].message?.content);
    if (completion.data.choices[0].message?.content) {
      // Save new completion to DB

      return completion.data.choices[0].message;
    } else {
      throw new InternalError("Could not get completion from OpenAI");
    }
  } catch (err) {
    console.error("OpenAI error", err);
    throw err;
  }
};
