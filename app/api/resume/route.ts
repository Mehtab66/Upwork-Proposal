export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import { extractTextFromResume } from "@/lib/resume/extract-text";
import { parseResumeWithAI } from "@/lib/resume/parse-resume";
import {
  buildResumeListResponse,
  buildStoredResume,
  getUserResumeState,
  persistUserResumeState,
} from "@/lib/resume/user-resumes";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const allowedMimeTypes = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const state = await getUserResumeState(user.id);
    return NextResponse.json(buildResumeListResponse(state));
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
    const labelInput = formData.get("label");

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

    const newResume = buildStoredResume({
      label:
        typeof labelInput === "string" && labelInput.trim()
          ? labelInput.trim()
          : undefined,
      fileName: file.name,
      fileSize: file.size,
      mimeType:
        file.type ||
        (isPdf
          ? "application/pdf"
          : "application/vnd.openxmlformats-officedocument.wordprocessingml.document"),
      source: "upload",
      extracted,
    });

    const state = await getUserResumeState(user.id);
    const resumes = [...state.resumes, newResume];

    await persistUserResumeState(user.id, resumes, newResume.id);

    return NextResponse.json({
      message: "Resume uploaded and processed successfully.",
      ...buildResumeListResponse({
        resumes,
        activeResumeId: newResume.id,
        activeResume: newResume,
      }),
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

export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = (await request.json()) as {
      activeResumeId?: string;
      resumeId?: string;
      label?: string;
    };

    const state = await getUserResumeState(user.id);

    if (body.activeResumeId) {
      const exists = state.resumes.some(
        (resume) => resume.id === body.activeResumeId
      );

      if (!exists) {
        return NextResponse.json({ error: "Resume not found." }, { status: 404 });
      }

      await persistUserResumeState(
        user.id,
        state.resumes,
        body.activeResumeId
      );

      const activeResume =
        state.resumes.find((resume) => resume.id === body.activeResumeId) ||
        null;

      return NextResponse.json({
        message: "Active resume updated.",
        ...buildResumeListResponse({
          resumes: state.resumes,
          activeResumeId: body.activeResumeId,
          activeResume,
        }),
      });
    }

    if (body.resumeId && body.label?.trim()) {
      const resumes = state.resumes.map((resume) =>
        resume.id === body.resumeId
          ? { ...resume, label: body.label!.trim() }
          : resume
      );

      if (!resumes.some((resume) => resume.id === body.resumeId)) {
        return NextResponse.json({ error: "Resume not found." }, { status: 404 });
      }

      await persistUserResumeState(
        user.id,
        resumes,
        state.activeResumeId
      );

      const activeResume =
        resumes.find((resume) => resume.id === state.activeResumeId) || null;

      return NextResponse.json({
        message: "Resume renamed.",
        ...buildResumeListResponse({
          resumes,
          activeResumeId: state.activeResumeId,
          activeResume,
        }),
      });
    }

    return NextResponse.json(
      { error: "Provide activeResumeId or resumeId with label." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Update resume error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const resumeId = new URL(request.url).searchParams.get("resumeId");

    if (!resumeId) {
      return NextResponse.json(
        { error: "Resume ID is required." },
        { status: 400 }
      );
    }

    const state = await getUserResumeState(user.id);
    const resumes = state.resumes.filter((resume) => resume.id !== resumeId);

    if (resumes.length === state.resumes.length) {
      return NextResponse.json({ error: "Resume not found." }, { status: 404 });
    }

    const activeResumeId =
      state.activeResumeId === resumeId
        ? resumes[resumes.length - 1]?.id || null
        : state.activeResumeId;

    await persistUserResumeState(user.id, resumes, activeResumeId);

    const activeResume =
      resumes.find((resume) => resume.id === activeResumeId) || null;

    return NextResponse.json({
      message: "Resume deleted.",
      ...buildResumeListResponse({
        resumes,
        activeResumeId,
        activeResume,
      }),
    });
  } catch (error) {
    console.error("Delete resume error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
