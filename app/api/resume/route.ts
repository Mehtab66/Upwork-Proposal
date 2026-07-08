export const runtime = "nodejs";

import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import clientPromise from "@/lib/mongodb";
import { extractTextFromResume } from "@/lib/resume/extract-text";
import { parseResumeWithAI } from "@/lib/resume/parse-resume";
import { coerceStoredExtractedResume } from "@/lib/resume/normalize-extracted";
import type { ResumeProfile } from "@/types/resume";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const allowedMimeTypes = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

function serializeResume(resume: Record<string, unknown> | null | undefined): ResumeProfile | null {
  if (!resume || typeof resume !== "object") {
    return null;
  }

  return {
    fileName: String(resume.fileName || ""),
    fileSize: Number(resume.fileSize || 0),
    mimeType: String(resume.mimeType || ""),
    uploadedAt: new Date(resume.uploadedAt as string | Date).toISOString(),
    source: resume.source === "upload" ? "upload" : "manual",
    extracted: coerceStoredExtractedResume(resume.extracted),
  };
}

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const client = await clientPromise;
    const dbUser = await client
      .db()
      .collection("users")
      .findOne(
        { _id: new ObjectId(user.id) },
        { projection: { resumeProfile: 1 } }
      );

    return NextResponse.json({
      resume: serializeResume(dbUser?.resumeProfile as Record<string, unknown>),
    });
  } catch (error) {
    console.error("Get resume error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Please upload a resume file." },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Resume file must be 5MB or smaller." },
        { status: 400 }
      );
    }

    const lowerName = file.name.toLowerCase();
    const isPdf = lowerName.endsWith(".pdf");
    const isDocx = lowerName.endsWith(".docx");

    if (!isPdf && !isDocx) {
      return NextResponse.json(
        { error: "Only PDF and DOCX files are supported." },
        { status: 400 }
      );
    }

    if (!allowedMimeTypes.has(file.type) && file.type !== "") {
      return NextResponse.json(
        { error: "Invalid file type. Upload a PDF or DOCX resume." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const resumeText = await extractTextFromResume(
      buffer,
      file.type,
      file.name
    );
    const extracted = await parseResumeWithAI(resumeText);

    const resumeProfile = {
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type || (isPdf ? "application/pdf" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document"),
      uploadedAt: new Date(),
      source: "upload" as const,
      extracted,
    };

    const client = await clientPromise;

    await client
      .db()
      .collection("users")
      .updateOne(
        { _id: new ObjectId(user.id) },
        {
          $set: {
            resumeProfile,
            updatedAt: new Date(),
          },
        }
      );

    return NextResponse.json({
      message: "Resume uploaded and processed successfully.",
      resume: serializeResume(resumeProfile),
    });
  } catch (error) {
    console.error("Upload resume error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong. Please try again.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
