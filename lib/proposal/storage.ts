import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import {
  normalizeBoldPhrases,
  sanitizeCoverLetter,
} from "@/lib/proposal/format-cover-letter";
import type {
  ProfileMatchAnalysis,
  ProposalMode,
  ProposalStatus,
  StoredProposal,
} from "@/types/proposal";

export const FREE_MONTHLY_PROPOSAL_LIMIT = 3;

function serializeProfileMatch(
  value: unknown
): ProfileMatchAnalysis | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const record = value as Record<string, unknown>;
  const matchLevel = String(record.matchLevel || "medium");

  return {
    matchScore: Math.max(0, Math.min(100, Number(record.matchScore || 0))),
    matchLevel:
      matchLevel === "high" || matchLevel === "low" ? matchLevel : "medium",
    resumeFocus: String(record.resumeFocus || "").trim(),
    jobFocus: String(record.jobFocus || "").trim(),
    isMismatch: Boolean(record.isMismatch),
    warningMessage: String(record.warningMessage || "").trim(),
    recommendation: String(record.recommendation || "").trim(),
  };
}

function serializeProposal(doc: Record<string, unknown>): StoredProposal {
  return {
    id: String(doc._id),
    jobTitle: String(doc.jobTitle || "Untitled Proposal"),
    jobCategory: String(doc.jobCategory || "General"),
    jobDescription: String(doc.jobDescription || ""),
    clientName: doc.clientName ? String(doc.clientName) : null,
    coverLetter: sanitizeCoverLetter(String(doc.coverLetter || "")),
    clientNeedsSummary: String(doc.clientNeedsSummary || ""),
    matchedHighlights: Array.isArray(doc.matchedHighlights)
      ? doc.matchedHighlights.map((item) => String(item))
      : [],
    suggestedQuestions: Array.isArray(doc.suggestedQuestions)
      ? doc.suggestedQuestions.map((item) => String(item))
      : [],
    boldPhrases: normalizeBoldPhrases(
      sanitizeCoverLetter(String(doc.coverLetter || "")),
      Array.isArray(doc.boldPhrases)
        ? doc.boldPhrases.map((item) => String(item))
        : []
    ),
    profileMatch: serializeProfileMatch(doc.profileMatch),
    proposalMode: doc.proposalMode === "generic" ? "generic" : "resume",
    resumeId: doc.resumeId ? String(doc.resumeId) : null,
    resumeLabel: doc.resumeLabel ? String(doc.resumeLabel) : null,
    status: (doc.status as ProposalStatus) || "draft",
    createdAt: new Date(doc.createdAt as string | Date).toISOString(),
    updatedAt: new Date(doc.updatedAt as string | Date).toISOString(),
  };
}

function getMonthStart() {
  const date = new Date();
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date;
}

export async function getProposalUsage(userId: string) {
  const client = await clientPromise;
  const usedThisMonth = await client
    .db()
    .collection("proposals")
    .countDocuments({
      userId: new ObjectId(userId),
      createdAt: { $gte: getMonthStart() },
    });

  const remaining = Math.max(0, FREE_MONTHLY_PROPOSAL_LIMIT - usedThisMonth);

  return {
    usedThisMonth,
    monthlyLimit: FREE_MONTHLY_PROPOSAL_LIMIT,
    remaining,
  };
}

export async function listUserProposals(userId: string) {
  const client = await clientPromise;
  const docs = await client
    .db()
    .collection("proposals")
    .find({ userId: new ObjectId(userId) })
    .sort({ createdAt: -1 })
    .limit(100)
    .toArray();

  const usage = await getProposalUsage(userId);

  return {
    proposals: docs.map((doc) =>
      serializeProposal(doc as Record<string, unknown>)
    ),
    usage,
  };
}

export async function saveProposal(
  userId: string,
  input: {
    jobTitle: string;
    jobCategory: string;
    jobDescription: string;
    clientName?: string | null;
    coverLetter: string;
    clientNeedsSummary: string;
    matchedHighlights: string[];
    suggestedQuestions: string[];
    boldPhrases: string[];
    profileMatch: ProfileMatchAnalysis | null;
    proposalMode: ProposalMode;
    resumeId?: string | null;
    resumeLabel?: string | null;
    status?: ProposalStatus;
  }
) {
  const now = new Date();
  const client = await clientPromise;

  const doc = {
    userId: new ObjectId(userId),
    jobTitle: input.jobTitle,
    jobCategory: input.jobCategory,
    jobDescription: input.jobDescription,
    clientName: input.clientName || null,
    coverLetter: sanitizeCoverLetter(input.coverLetter),
    clientNeedsSummary: input.clientNeedsSummary,
    matchedHighlights: input.matchedHighlights,
    suggestedQuestions: input.suggestedQuestions,
    boldPhrases: normalizeBoldPhrases(
      sanitizeCoverLetter(input.coverLetter),
      input.boldPhrases
    ),
    profileMatch: input.profileMatch,
    proposalMode: input.proposalMode,
    resumeId: input.resumeId || null,
    resumeLabel: input.resumeLabel || null,
    status: input.status || "draft",
    createdAt: now,
    updatedAt: now,
  };

  const result = await client.db().collection("proposals").insertOne(doc);

  return serializeProposal({
    ...doc,
    _id: result.insertedId,
  } as Record<string, unknown>);
}

export async function updateProposalContent(
  userId: string,
  proposalId: string,
  input: {
    jobTitle: string;
    jobCategory: string;
    coverLetter: string;
    clientNeedsSummary: string;
    matchedHighlights: string[];
    suggestedQuestions: string[];
    boldPhrases: string[];
    profileMatch: ProfileMatchAnalysis | null;
    proposalMode?: ProposalMode;
    resumeId?: string | null;
    resumeLabel?: string | null;
  }
) {
  const client = await clientPromise;
  const objectId = new ObjectId(proposalId);

  const result = await client.db().collection("proposals").findOneAndUpdate(
    { _id: objectId, userId: new ObjectId(userId) },
    {
      $set: {
        jobTitle: input.jobTitle,
        jobCategory: input.jobCategory,
        coverLetter: sanitizeCoverLetter(input.coverLetter),
        clientNeedsSummary: input.clientNeedsSummary,
        matchedHighlights: input.matchedHighlights,
        suggestedQuestions: input.suggestedQuestions,
        boldPhrases: normalizeBoldPhrases(
          sanitizeCoverLetter(input.coverLetter),
          input.boldPhrases
        ),
        profileMatch: input.profileMatch,
        proposalMode: input.proposalMode,
        resumeId: input.resumeId ?? null,
        resumeLabel: input.resumeLabel ?? null,
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" }
  );

  if (!result) {
    return null;
  }

  return serializeProposal(result as Record<string, unknown>);
}

export async function updateProposalCoverLetter(
  userId: string,
  proposalId: string,
  input: { coverLetter: string; boldPhrases?: string[] }
) {
  const client = await clientPromise;

  const result = await client.db().collection("proposals").findOneAndUpdate(
    { _id: new ObjectId(proposalId), userId: new ObjectId(userId) },
    {
      $set: {
        coverLetter: sanitizeCoverLetter(input.coverLetter),
        ...(input.boldPhrases ? { boldPhrases: input.boldPhrases } : {}),
        updatedAt: new Date(),
      },
    },
    { returnDocument: "after" }
  );

  if (!result) {
    return null;
  }

  return serializeProposal(result as Record<string, unknown>);
}

export async function updateProposalStatus(
  userId: string,
  proposalId: string,
  status: ProposalStatus
) {
  const client = await clientPromise;

  const result = await client.db().collection("proposals").findOneAndUpdate(
    { _id: new ObjectId(proposalId), userId: new ObjectId(userId) },
    { $set: { status, updatedAt: new Date() } },
    { returnDocument: "after" }
  );

  if (!result) {
    return null;
  }

  return serializeProposal(result as Record<string, unknown>);
}

export async function deleteUserProposal(userId: string, proposalId: string) {
  const client = await clientPromise;

  const result = await client.db().collection("proposals").deleteOne({
    _id: new ObjectId(proposalId),
    userId: new ObjectId(userId),
  });

  return result.deletedCount === 1;
}
