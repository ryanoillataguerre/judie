import { Response } from "express";
import inferenceServiceClient from "../utils/grpc/inferenceClient.js";
import { ChatDetails } from "../proto/inference_service.js";

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
  const result = inferenceServiceClient.getChatResponse(chatRequest);
  for await (const chunk of result) {
    console.log("chunk", chunk);
    if (chunk.responsePart) {
      response.write(chunk.responsePart);
    }
    // Else do nothing (for now)
  }
  // TODO: Create verbose response here for the web to consume
  // Add flags, notices, quizzes, etc.
  return {
    success: true,
  };
};
