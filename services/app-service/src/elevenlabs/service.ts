import fetch from "node-fetch";
import got from "got";
import { createWriteStream } from "fs";
import { pipeline as streamPipeline } from "node:stream/promises";

const VOICE_ID = "r4jhTQh1KQnypPGqh3dc"; // Valley Girl
const API_KEY = process.env.ELEVENLABS_API_KEY || "";
export const createAudioFile = async (text: string, filePath: string) => {
  const url = `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/stream`;
  console.log("making request to ", url);
  console.log("text: ", text);
  console.log("API_KEY: ", API_KEY);
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
  // got
  //   .stream(url, {
  //     method: "post",
  //     body: JSON.stringify({ text }),
  //     headers: {
  //       Accept: "audio/mpeg",
  //       "xi-api-key": API_KEY,
  //       "Content-Type": "application/json",
  //     },
  //   })
  //   .pipe(createWriteStream(filePath));

  console.log("finished writing file to ", filePath);
  return filePath;
};
