import InternalError from "../utils/errors/InternalError.js";
import { temporaryFile } from "tempy";
import { writeFile } from "fs/promises";
import PDFServicesSdk from "@adobe/pdfservices-node-sdk";
import AdmZip from "adm-zip";

export const extractTextFromPdf = async (file: Express.Multer.File) => {
  try {
    const tempPdfPath = temporaryFile();
    const tempOutputZip = temporaryFile({ extension: "zip" });
    await writeFile(tempPdfPath, file.buffer);
    const credentials = (PDFServicesSdk.Credentials as any)
      .servicePrincipalCredentialsBuilder()
      .withClientId(process.env.PDF_SERVICES_CLIENT_ID || "")
      .withClientSecret(process.env.PDF_SERVICES_CLIENT_SECRET || "")
      .build();
    const executionContext =
      PDFServicesSdk.ExecutionContext.create(credentials);

    // Build extractPDF options
    const options =
      new PDFServicesSdk.ExtractPDF.options.ExtractPdfOptions.Builder()
        .addElementsToExtract(
          PDFServicesSdk.ExtractPDF.options.ExtractElementType.TEXT
        )
        .build();
    const extractPDFOperation = PDFServicesSdk.ExtractPDF.Operation.createNew();
    const input = PDFServicesSdk.FileRef.createFromLocalFile(
      tempPdfPath,
      PDFServicesSdk.ExtractPDF.SupportedSourceFormat.pdf
    );
    extractPDFOperation.setInput(input);
    // Set options
    extractPDFOperation.setOptions(options);

    // Generating a file name
    await extractPDFOperation
      .execute(executionContext)
      .then((result) => result.saveAsFile(tempOutputZip));

    let zip = new AdmZip(tempOutputZip);
    let jsondata = zip.readAsText("structuredData.json");
    let data = JSON.parse(jsondata);
    const text = data.elements.reduce(
      (acc: string, element: any) =>
        element?.Text?.length ? `${acc}\n${element.Text}` : acc,
      ""
    );
    return text;
  } catch (err) {
    console.error("PDF parsing error: ", err);
    throw new InternalError("Could not process PDF");
  }
};
