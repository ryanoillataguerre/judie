import { Response } from "express";
import inferenceServiceClient from "../utils/grpc/inferenceClient.js";
import { ChatDetails } from "../proto/inference_service.js";
import InternalError from "../utils/errors/InternalError.js";
import { deleteMostRecentChatMessage } from "../chats/service.js";

const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

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
  while (triesCounter < 3) {
    console.log(`try #${triesCounter}`);
    try {
      const result = inferenceServiceClient.getChatResponse(chatRequest);
      const fullResponse = [];
      const killOnHang = () => {
        if (!fullResponse.length) {
          triesCounter++;
          throw new InternalError("No response yet. Trying again...");
        }
      };
      setTimeout(killOnHang, 15000);
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
      // throw new InternalError(
      //   "Could not get chat completion. Please try again later."
      // );
    }
    triesCounter++;
    await sleep(500);
  }
  // If it failed 3 times:
  await deleteMostRecentChatMessage({ chatId });
  throw new InternalError(
    "Could not get chat completion. Please try again later."
  );
};
