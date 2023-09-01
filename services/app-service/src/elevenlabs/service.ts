import got from "got";
import { createWriteStream } from "fs";
import { pipeline as streamPipeline } from "node:stream/promises";

const VOICE_ID = "r4jhTQh1KQnypPGqh3dc"; // Valley Girl
const API_KEY = process.env.ELEVENLABS_API_KEY || "";
export const createAudioFile = async (text: string, filePath: string) => {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream`;
  await streamPipeline(
    got.stream(url, {
      method: "post",
      body: JSON.stringify({ text }),
      headers: {
        Accept: "audio/mpeg",
        "xi-api-key": API_KEY,
        "Content-Type": "application/json",
      },
    }),
    createWriteStream(filePath)
  );
  return filePath;
};
