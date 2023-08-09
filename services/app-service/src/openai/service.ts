import { Configuration, OpenAIApi } from "openai";
import { Readable } from "stream";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY || "",
});
const openaiClient = new OpenAIApi(configuration);

// Transcribe audio
export const transcribeAudio = async (file: Readable) => {
  const transcript = await openaiClient.createTranscription(file, "whisper-1");
  return transcript.data.text;
};
