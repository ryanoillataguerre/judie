import { Response } from "express";
import inferenceServiceClient from "../utils/grpc/inferenceClient.js";
import { ChatDetails } from "../proto/inference_service.js";
import InternalError from "../utils/errors/InternalError.js";
import { deleteMostRecentChatMessage } from "../chats/service.js";

export const getChatCompletion = async ({
  chatId,
  response,
}: {
  chatId: string;
  response: Response;
}) => {
  const chatRequest: ChatDetails = {
    chatId,
  };
  // Retry if return is not hit
  let triesCounter = 0;
  while (triesCounter < 2) {
    console.log(`try #${triesCounter}`);
    try {
      const result = inferenceServiceClient.getChatResponse(chatRequest);
      const fullResponse = [];
      for await (const chunk of result) {
        if (chunk.responsePart) {
          fullResponse.push(chunk.responsePart);
          response.write(chunk.responsePart);
        }
        // Else do nothing (for now)
      }
      const fullText = fullResponse.join("");

      // TODO: Create verbose response here for the web to consume
      // Add flags, notices, quizzes, etc.
      return fullText;
    } catch (err) {
      console.error(err);
      await deleteMostRecentChatMessage({ chatId });
      // throw new InternalError(
      //   "Could not get chat completion. Please try again later."
      // );
    }
    triesCounter++;
  }
};
