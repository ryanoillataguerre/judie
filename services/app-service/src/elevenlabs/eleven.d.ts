// TODO: Sort out Elevenlabs library's types (or just revert to REST)
declare module "elevenlabs-node";

interface Elevenlabs {
  textToSpeech: (
    apiKey: string,
    voiceId: string,
    filePath: string,
    text: string
  ) => Promise<void>;
}

declare const eleven: Elevenlabs;

export default eleven;
