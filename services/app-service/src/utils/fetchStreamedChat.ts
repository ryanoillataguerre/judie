import { Chat, Message } from "@prisma/client";
import { OPENAI_COMPLETION_MODEL, OPENAI_PROMPT_CHAR_LIMIT, transformMessageToChatCompletionMessage } from "../chat/service.js";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY || "",
  });
  const openaiClient = new OpenAIApi(configuration);

export async function fetchStreamedChat(chat: Chat & { messages: Message[] }, onChunkReceived: ()) {
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
  
  const startTime = Date.now();

  function totalTimeTimeout() {
    return new Promise((_, reject) => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = totalTime - elapsedTime;

      if (remainingTime <= 0) {
        reject(new Error("Total timeout reached"));
      } else {
        setTimeout(
          () => reject(new Error("Total timeout reached")),
          remainingTime
        );
      }
    });
  }

  // A function to process the response stream and invoke the onChunkReceived callback
  // for each valid line in the stream
  async function processStream(reader, decoder, onChunkReceived) {
    try {
      // Wait for either the next chunk or a timeout
      const result = await Promise.race([
        reader.read().then((res) => ({ type: "data", value: res })),
        timeout(readTimeout).then(() => ({
          type: "error",
          value: new Error("Timeout"),
        })),
        totalTimeTimeout().then(() => ({
          type: "error",
          value: new Error("Total timeout reached"),
        })),
      ]);

      // Check if the result is an error
      if (result.type === "error") {
        throw result.value;
      }

      // Destructure the result
      const { done, value } = result.value;

      // If the stream is done, return
      if (done) {
        return;
      }

      // Decode the chunk and split it into lines
      const chunk = decoder.decode(value);
      const lines = chunk.split("\n").filter((line) => line.trim() !== "");

      // Process each line
      for (const line of lines) {
        // Remove the "data: " prefix from the line
        const message = line.replace(/^data: /, "");

        // If the message indicates the end of the stream, return
        if (message === "[DONE]") {
          return;
        }

        // Otherwise, invoke the onChunkReceived callback with the message
        onChunkReceived(message);
      }

      // Continue processing the stream recursively
      await processStream(reader, decoder, onChunkReceived);
    } catch (error) {
      console.error("Error reading stream:", error);
    }
  }

  // A function to fetch the chat response with retries and timeouts
  async function fetchChatResponseWithRetry(apiKey, options, retryCount) {
    for (let i = 0; i < retryCount; i++) {
      try {
        const response = await Promise.race([
          fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: options.body,
          }),
          timeout(options.fetchTimeout),
          totalTimeTimeout(),
        ]);

        if (response.ok) {
          return response;
        }
      } catch (error) {
        console.error("Error fetching chat:", error);
        if (i === retryCount - 1) {
          throw new Error(
            `Failed to fetch chat after ${retryCount} retry attempts`
          );
        }
      }
      await new Promise((resolve) =>
        setTimeout(resolve, options.retryInterval)
      );
    }
    throw new Error("Unable to fetch chat");
  }

//   const response = await fetchChatResponseWithRetry(
//     apiKey,
//     requestOptions,
//     retryCount
//   );

const completion = await openaiClient.createChatCompletion({
    model: OPENAI_COMPLETION_MODEL,
    messages: maxLengthLimitedMessages,
    user: chat.userId,
    temperature: 0.7,
    max_tokens: 800,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
  });

  

  // Initialize the reader and decoder
  const reader = response..body.getReader();
  const decoder = new TextDecoder("utf-8");

  // Process the response stream
  await processStream(reader, decoder, onChunkReceived);
}
