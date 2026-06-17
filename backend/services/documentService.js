import pdfParse from "pdf-parse";
import mammoth from "mammoth";

export async function extractDocumentTextFromUpload(file) {
  if (!file) {
    return "";
  }

  if (file.mimetype === "text/plain") {
    return file.buffer.toString("utf8");
  }

  if (file.mimetype === "application/pdf") {
    const result = await pdfParse(file.buffer);
    return result.text || "";
  }

  if (file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    const result = await mammoth.extractRawText({ buffer: file.buffer });
    return result.value || "";
  }

  throw new Error("Unsupported file type.");
}