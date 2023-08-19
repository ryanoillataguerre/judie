import { createWorker } from "tesseract.js";
import { fromBuffer } from "pdf2pic";
import InternalError from "../utils/errors/InternalError.js";
import { temporaryDirectory, temporaryFile } from "tempy";
import { PDFDocument } from "pdf-lib";
import { readFileSync, writeFileSync } from "fs";
import { readFile, writeFile } from "fs/promises";

const worker = await createWorker({
  logger: (m) => console.log(m),
});

export const extractTextFromPdf = async (file: Express.Multer.File) => {
  try {
    const tempPdfPath = temporaryFile();
    const tempPngPath = temporaryDirectory();
    // Write PDF to disk
    await writeFile(tempPdfPath, file.buffer);
    // TODO: Go with Adobe - this shit sucks
    // https://developer.adobe.com/document-services/docs/overview/pdf-services-api/howtos/ocr-pdf/
    // const numPages = (await PDFDocument.load(file.buffer)).getPageCount();
    // console.log("page count", numPages);
    // const pngFileName = (Math.random() * 100000000000000).toString();
    // const options = {
    //   density: 300,
    //   saveFilename: pngFileName,
    //   savePath: tempPngPath,
    //   format: "png",
    // };
    // console.log("converting");
    // const convert = fromBuffer(file.buffer, options);
    // const response = await convert(numPages, { responseType: "image" });
    // console.log("converted", response);
    // const imgPath = response.path;

    // const image = await readFile(imgPath);
    // await worker.loadLanguage("eng");
    // await worker.initialize("eng");
    // const {
    //   data: { text },
    // } = await worker.recognize(image);
    // console.log("text", text);
    // await worker.terminate();
    // return text;
  } catch (err) {
    console.error("PDF parsing error: ", err);
    throw new InternalError("Could not process PDF");
  }
};
