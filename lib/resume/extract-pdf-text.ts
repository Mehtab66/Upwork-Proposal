const PDF_READ_ERROR =
  "We couldn't read this PDF. Re-save it (Word: Save As PDF, or Print to PDF) or upload a DOCX instead.";

function isPdfStructureError(error: unknown) {
  const message =
    error instanceof Error ? error.message : String(error ?? "Unknown error");

  return /xref|XRef|Invalid PDF|corrupt|bad PDF|PDF structure/i.test(message);
}

function toUserFacingPdfError(error: unknown) {
  if (isPdfStructureError(error)) {
    return new Error(PDF_READ_ERROR);
  }

  if (error instanceof Error && error.message.trim()) {
    return error;
  }

  return new Error(PDF_READ_ERROR);
}

async function extractWithUnpdf(buffer: Buffer) {
  const { extractText, getDocumentProxy } = await import("unpdf");
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const result = await extractText(pdf, { mergePages: true });
  return result.text;
}

async function extractWithPdfParse(buffer: Buffer) {
  const pdfParse = (await import("pdf-parse")).default as (
    data: Buffer
  ) => Promise<{ text: string }>;
  const result = await pdfParse(buffer);
  return result.text;
}

export async function extractPdfText(buffer: Buffer) {
  const parsers = [extractWithUnpdf, extractWithPdfParse];
  let lastError: unknown;

  for (const parse of parsers) {
    try {
      const text = await parse(buffer);
      if (text?.trim()) {
        return text;
      }
    } catch (error) {
      lastError = error;
      console.warn("PDF parser failed, trying fallback:", error);
    }
  }

  throw toUserFacingPdfError(lastError);
}
