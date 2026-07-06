import mammoth from "mammoth";

const MAX_TEXT_LENGTH = 12000;

export async function extractTextFromResume(
  buffer: Buffer,
  mimeType: string,
  fileName: string
) {
  const lowerName = fileName.toLowerCase();

  if (
    mimeType === "application/pdf" ||
    lowerName.endsWith(".pdf")
  ) {
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    await parser.destroy();
    return normalizeText(result.text);
  }

  if (
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    lowerName.endsWith(".docx")
  ) {
    const parsed = await mammoth.extractRawText({ buffer });
    return normalizeText(parsed.value);
  }

  throw new Error("Unsupported file type. Please upload a PDF or DOCX resume.");
}

function normalizeText(text: string) {
  const cleaned = text.replace(/\u0000/g, "").replace(/\s+\n/g, "\n").trim();

  if (!cleaned) {
    throw new Error("Could not extract any text from this resume.");
  }

  if (cleaned.length > MAX_TEXT_LENGTH) {
    return cleaned.slice(0, MAX_TEXT_LENGTH);
  }

  return cleaned;
}
