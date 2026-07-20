export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { coerceStoredExtractedResume } from "@/lib/resume/normalize-extracted";
import {
  buildResumeListResponse,
  buildStoredResume,
  getUserResumeState,
  persistUserResumeState,
} from "@/lib/resume/user-resumes";
import type { ExtractedResume } from "@/types/resume";

export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = (await request.json()) as {
      extracted?: ExtractedResume;
      resumeId?: string;
      label?: string;
    };

    if (!body.extracted) {
      return NextResponse.json(
        { error: "Resume data is required." },
        { status: 400 }
      );
    }

    const extracted = coerceStoredExtractedResume(body.extracted);
    const state = await getUserResumeState(user.id);

    if (body.resumeId) {
      const existing = state.resumes.find(
        (resume) => resume.id === body.resumeId
      );

      if (!existing) {
        return NextResponse.json({ error: "Resume not found." }, { status: 404 });
      }

      const resumes = state.resumes.map((resume) =>
        resume.id === body.resumeId
          ? {
              ...resume,
              label: body.label?.trim() || resume.label,
              extracted,
              uploadedAt: new Date().toISOString(),
            }
          : resume
      );

      await persistUserResumeState(
        user.id,
        resumes,
        state.activeResumeId
      );

      const activeResume =
        resumes.find((resume) => resume.id === state.activeResumeId) || null;

      return NextResponse.json({
        message: "Manual resume updated successfully.",
        ...buildResumeListResponse({
          resumes,
          activeResumeId: state.activeResumeId,
          activeResume,
        }),
      });
    }

    const newResume = buildStoredResume({
      label: body.label?.trim() || undefined,
      fileName: "Manual Resume Profile",
      fileSize: 0,
      mimeType: "manual",
      source: "manual",
      extracted,
    });

    const resumes = [...state.resumes, newResume];
    await persistUserResumeState(user.id, resumes, newResume.id);

    return NextResponse.json({
      message: "Manual resume saved successfully.",
      ...buildResumeListResponse({
        resumes,
        activeResumeId: newResume.id,
        activeResume: newResume,
      }),
    });
  } catch (error) {
    console.error("Save manual resume error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
