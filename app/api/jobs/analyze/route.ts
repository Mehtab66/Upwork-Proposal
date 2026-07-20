export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { analyzeUpworkJob } from "@/lib/jobs/analyze-job";
import { getUserResumeState } from "@/lib/resume/user-resumes";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = (await request.json()) as {
      jobDescription?: string;
      clientName?: string;
    };

    const jobDescription = body.jobDescription?.trim() || "";

    if (jobDescription.length < 40) {
      return NextResponse.json(
        { error: "Please paste a complete job description (at least 40 characters)." },
        { status: 400 }
      );
    }

    const resumeState = await getUserResumeState(user.id);

    const analysis = await analyzeUpworkJob({
      jobDescription,
      clientName: body.clientName,
      activeResume: resumeState.activeResume,
    });

    return NextResponse.json({
      analysis,
      activeResume: resumeState.activeResume
        ? {
            id: resumeState.activeResume.id,
            label: resumeState.activeResume.label,
          }
        : null,
    });
  } catch (error) {
    console.error("Job analyze error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}
