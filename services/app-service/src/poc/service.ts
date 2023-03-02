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

export const createGPTRequestFromPrompt = async (
  prompt: string,
  session: JudieSession
): Promise<ChatCompletionRequestMessage[]> => {
  try {
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
      },
    });
    const matches = pineconeResponse.matches;

    // Get metadata from each matching vector
    const matchMetadatas =
      matches
        ?.filter((match) => (match?.score || 0) > 0.8)
        ?.map((match) => (match.metadata as { [key: string]: string }).text) ||
      [];

    // Build messages array
    const existingSessionChatMessages = session.chatSessionMessages || [];
    let messages: ChatCompletionRequestMessage[] = [];
    // If we haven't given a system prompt yet, give one
    if (existingSessionChatMessages.length === 0) {
      const promptStart =
        "You are an advanced AI Tutor named Judie, and students are asking you questions.\n\
      You will get the user question as well as relevant context to answer that question.\n\
      I want you to provide an in-depth answer to the question and guide students to the appropriate answer.\n\
      Your tone is informal, and didactic, and you want to explain things so the largest audience can understand them. \n\n";
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
    let reversedExistingMessages = session.chatSessionMessages?.reverse() || [];
    for (const existingMessage of reversedExistingMessages) {
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
      charCountAllMessages += existingMessageLen;
      messages.push(existingMessage);
    }

    // Push this prompt to messages arr
    messages.push({
      content: currentPrompt,
      role: "user",
    });

    // Add new data to session
    session.chatSessionMessages = messages;
    session.chatSessionCharCount = charCountAllMessages;

    return messages;
  } catch (err) {
    console.error("Error building prompt: ", err);
    throw err;
  }
};

export const getChatGPTCompletion = async (
  messages: ChatCompletionRequestMessage[],
  session: JudieSession
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
      session.chatSessionMessages?.push({
        content: completion.data.choices[0].message?.content,
        role: "system",
      });
      return completion.data.choices[0].message;
    } else {
      throw new InternalError("Could not get completion from OpenAI");
    }
  } catch (err) {
    console.error("openai error", err);
    throw err;
  }
};
