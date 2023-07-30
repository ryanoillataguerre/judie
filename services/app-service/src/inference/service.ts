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
};
