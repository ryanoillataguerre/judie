import { createWorker } from "tesseract.js";
import fs from "fs";
import InternalError from "../utils/errors/InternalError.js";

const worker = await createWorker({
  logger: (m) => console.log(m),
});

export const extractTextFromPdf = async (file: Express.Multer.File) => {
  try {
    await worker.loadLanguage("eng");
    await worker.initialize("eng");
    const {
      data: { text },
    } = await worker.recognize(file.buffer);
    console.log(text);
    await worker.terminate();
    return text;
  } catch (err) {
    console.error("PDF parsing error: ", err);
    throw new InternalError("Could not process PDF");
  }
};
