import fetch from "node-fetch";
import fs from "fs";
import { pipeline } from "node:stream";
import { promisify } from "node:util";

const streamPipeline = promisify(pipeline);

const VOICE_ID = "r4jhTQh1KQnypPGqh3dc"; // Valley Girl
const API_KEY = process.env.ELEVENLABS_API_KEY || "";
export const createAudioFile = async (text: string, filePath: string) => {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream`;
  const response = await fetch(url, {
    method: "post",
    body: { text },
    headers: {
      Accept: "audio/mp3",
      "xi-api-key": API_KEY,
      "Content-Type": "application/json",
    },
  });
  console.log("response", response);
  if (!response.ok)
    throw new Error(`unexpected response ${response.statusText}`);
  await streamPipeline(response.body as any, fs.createWriteStream(filePath));
  console.log("finished writing file to ", filePath);
  return filePath;
};
