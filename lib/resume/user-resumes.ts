import { randomUUID } from "crypto";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { coerceStoredExtractedResume } from "@/lib/resume/normalize-extracted";
import type { ExtractedResume, ResumeProfile } from "@/types/resume";

export function createResumeId() {
  return randomUUID();
}

export function labelFromFileName(fileName: string) {
  return fileName.replace(/\.(pdf|docx)$/i, "").trim() || fileName;
}

export function serializeResume(
  resume: Record<string, unknown> | null | undefined
): ResumeProfile | null {
  if (!resume || typeof resume !== "object") {
    return null;
  }

  const fileName = String(resume.fileName || "");
  const source = resume.source === "manual" ? "manual" : "upload";

  return {
    id: String(resume.id || createResumeId()),
    label: String(resume.label || (source === "manual" ? "Manual Resume" : labelFromFileName(fileName))),
    fileName,
    fileSize: Number(resume.fileSize || 0),
    mimeType: String(resume.mimeType || ""),
    uploadedAt: new Date(resume.uploadedAt as string | Date).toISOString(),
    source,
    extracted: coerceStoredExtractedResume(resume.extracted),
  };
}

export function buildStoredResume(input: {
  id?: string;
  label?: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  source: "upload" | "manual";
  extracted: ExtractedResume;
}): ResumeProfile {
  const uploadedAt = new Date().toISOString();

  return {
    id: input.id || createResumeId(),
    label:
      input.label?.trim() ||
      (input.source === "manual"
        ? "Manual Resume"
        : labelFromFileName(input.fileName)),
    fileName: input.fileName,
    fileSize: input.fileSize,
    mimeType: input.mimeType,
    uploadedAt,
    source: input.source,
    extracted: input.extracted,
  };
}

export interface UserResumeState {
  resumes: ResumeProfile[];
  activeResumeId: string | null;
  activeResume: ResumeProfile | null;
}

export function resolveUserResumeState(
  dbUser: Record<string, unknown> | null | undefined
): UserResumeState {
  const storedResumes = Array.isArray(dbUser?.resumes)
    ? dbUser.resumes
        .map((item) => serializeResume(item as Record<string, unknown>))
        .filter((item): item is ResumeProfile => Boolean(item))
    : [];

  if (storedResumes.length > 0) {
    const activeResumeId =
      typeof dbUser?.activeResumeId === "string" &&
      storedResumes.some((resume) => resume.id === dbUser.activeResumeId)
        ? dbUser.activeResumeId
        : storedResumes[0]?.id || null;

    const activeResume =
      storedResumes.find((resume) => resume.id === activeResumeId) || null;

    return { resumes: storedResumes, activeResumeId, activeResume };
  }

  const legacyResume = serializeResume(
    dbUser?.resumeProfile as Record<string, unknown>
  );

  if (!legacyResume) {
    return { resumes: [], activeResumeId: null, activeResume: null };
  }

  return {
    resumes: [legacyResume],
    activeResumeId: legacyResume.id,
    activeResume: legacyResume,
  };
}

export async function getUserResumeState(userId: string) {
  const client = await clientPromise;
  const dbUser = await client
    .db()
    .collection("users")
    .findOne(
      { _id: new ObjectId(userId) },
      { projection: { resumes: 1, activeResumeId: 1, resumeProfile: 1 } }
    );

  const state = resolveUserResumeState(
    dbUser as Record<string, unknown> | null
  );

  const hasLegacyOnly =
    Boolean(dbUser?.resumeProfile) &&
    (!Array.isArray(dbUser?.resumes) || dbUser.resumes.length === 0);

  if (hasLegacyOnly && state.resumes.length > 0) {
    await persistUserResumeState(userId, state.resumes, state.activeResumeId);
  }

  return state;
}

export async function persistUserResumeState(
  userId: string,
  resumes: ResumeProfile[],
  activeResumeId: string | null
) {
  const client = await clientPromise;

  await client
    .db()
    .collection("users")
    .updateOne(
      { _id: new ObjectId(userId) },
      {
        $set: {
          resumes: resumes.map((resume) => ({
            id: resume.id,
            label: resume.label,
            fileName: resume.fileName,
            fileSize: resume.fileSize,
            mimeType: resume.mimeType,
            uploadedAt: new Date(resume.uploadedAt),
            source: resume.source,
            extracted: resume.extracted,
          })),
          activeResumeId,
          updatedAt: new Date(),
        },
        $unset: {
          resumeProfile: "",
        },
      }
    );
}

export function buildResumeListResponse(state: UserResumeState) {
  return {
    resumes: state.resumes,
    activeResumeId: state.activeResumeId,
    resume: state.activeResume,
  };
}
