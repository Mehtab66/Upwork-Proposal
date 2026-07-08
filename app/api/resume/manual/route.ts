export const runtime = "nodejs";

import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import clientPromise from "@/lib/mongodb";
import { coerceStoredExtractedResume } from "@/lib/resume/normalize-extracted";
import type { ExtractedResume, ResumeProfile } from "@/types/resume";

function serializeResume(
  resume: Record<string, unknown> | null | undefined
): ResumeProfile | null {
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

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = (await request.json()) as { extracted?: ExtractedResume };
    if (!body.extracted) {
      return NextResponse.json(
        { error: "Resume data is required." },
        { status: 400 }
      );
    }

    const extracted = coerceStoredExtractedResume(body.extracted);

    const resumeProfile = {
      fileName: "Manual Resume Profile",
      fileSize: 0,
      mimeType: "manual",
      uploadedAt: new Date(),
      source: "manual" as const,
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
      message: "Manual resume saved successfully.",
      resume: serializeResume(resumeProfile),
    });
  } catch (error) {
    console.error("Save manual resume error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
