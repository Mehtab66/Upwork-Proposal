import { createGroqClient, getGroqModel } from "@/lib/groq/client";
import { compactResumeForPrompt } from "@/lib/proposal/build-context";
import {
  ensureProposalGreeting,
  normalizeBoldPhrases,
  sanitizeCoverLetter,
} from "@/lib/proposal/format-cover-letter";
import type {
  GeneratedProposalContent,
  GenericProposalProfile,
  ProfileMatchAnalysis,
} from "@/types/proposal";
import { getProposalTemplate } from "@/lib/proposal/templates";
import type { ResumeProfile } from "@/types/resume";
import type { MatchedPortfolioItem } from "@/types/job-analysis";

export interface ProposalGenerationOptions {
  templateId?: string;
  jobAnalysisContext?: {
    proposalAngle?: string;
    matchedPortfolio?: Pick<MatchedPortfolioItem, "name" | "reason">[];
  };
}

function buildPromptExtras(options?: ProposalGenerationOptions) {
  const template = getProposalTemplate(options?.templateId);
  let extra = `\nPROPOSAL TEMPLATE (${template.name}):\n${template.promptAddon}\n`;

  const angle = options?.jobAnalysisContext?.proposalAngle?.trim();
  if (angle) {
    extra += `\nJOB ANALYSIS — USE THIS ANGLE:\n${angle}\n`;
  }

  const picks = options?.jobAnalysisContext?.matchedPortfolio;
  if (picks?.length) {
    extra += `\nPORTFOLIO ITEMS TO LEAD WITH (only if accurate):\n`;
    for (const item of picks) {
      extra += `- ${item.name}: ${item.reason}\n`;
    }
  }

  return extra;
}

const SHARED_JSON_SHAPE = `Return valid JSON with this exact shape:
{
  "jobTitle": "string",
  "jobCategory": "string",
  "coverLetter": "string",
  "clientNeedsSummary": "string",
  "matchedHighlights": ["string"],
  "suggestedQuestions": ["string"],
  "boldPhrases": ["string"],
  "profileMatch": {
    "matchScore": 0,
    "matchLevel": "high|medium|low",
    "resumeFocus": "string",
    "jobFocus": "string",
    "isMismatch": false,
    "warningMessage": "string",
    "recommendation": "string"
  }
}`;

const PROPOSAL_RULES = `You write high-converting Upwork cover letters that clients skim in seconds.

TARGET LENGTH: 100-170 words total. Short beats long.

GREETING (required):
- coverLetter MUST start with "Hi," OR "Hi {ClientName}," on the first line when client name is provided.
- Blank line after greeting, then the hook paragraph.

STRUCTURE — use separate paragraphs separated by a blank line (\\n\\n). Never one wall of text.
Block 1 — GREETING: Hi, / Hi Name,
Block 2 — HOOK (one line): Something SPECIFIC from their job post OR one sharp relevant result. Not generic.
Block 3 — RELEVANCE (2-3 short lines): Tie your fit to their problem/goal.
Block 4 — MICRO-PROOF (1-2 short lines): Concrete outcome, similar work, or insight.
Block 5 — CTA + QUESTIONS: Include at least TWO full questions inside this paragraph (sentences ending with ?). Questions must appear in the coverLetter text itself — not only in suggestedQuestions. They should be thoughtful (scope, timeline, success metrics, workflow, constraints). For complex jobs, use 2-4 questions. Then add a clear Upwork CTA (reply here, review profile, quick chat on Messages).

HOOK RULES:
- Forbidden: "I am a hardworking freelancer", "I came across your job", "I have read your job description", vague enthusiasm.
- Good hooks reference THEIR deliverable, stack, pain, or timeline.

CONTENT RULES:
- Address the client's actual problem, not just the job title.
- Match the client's tone from their post.
- No email, phone, LinkedIn, WhatsApp, or off-platform contact.
- Do not invent experience not in the provided profile data.
- Plain text only: NO asterisks, NO markdown.
- Sign off with the freelancer's name on its own line after one blank line.

suggestedQuestions: copy the exact question sentences from coverLetter (minimum 2 entries).
boldPhrases: 3-6 exact substrings from coverLetter (hook fragment, result, skill match, question lines, CTA). UI highlight only.`;

function normalizeStringArray(value: unknown, max = 6) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => String(item).trim())
    .filter(Boolean)
    .slice(0, max);
}

function parseProfileMatch(value: unknown): ProfileMatchAnalysis | null {
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

function parseGeneratedProposal(
  raw: string,
  clientName?: string
): GeneratedProposalContent {
  let parsed: Record<string, unknown>;

  try {
    parsed = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    throw new Error("AI returned an invalid proposal format. Please try again.");
  }

  const coverLetter = ensureProposalGreeting(
    sanitizeCoverLetter(String(parsed.coverLetter || "")),
    clientName
  );

  if (!coverLetter) {
    throw new Error("AI did not return a proposal cover letter.");
  }

  const boldPhrases = normalizeBoldPhrases(
    coverLetter,
    normalizeStringArray(parsed.boldPhrases, 8)
  );

  return {
    jobTitle: String(parsed.jobTitle || "Upwork Job Proposal").trim(),
    jobCategory: String(parsed.jobCategory || "General").trim(),
    coverLetter,
    clientNeedsSummary: String(parsed.clientNeedsSummary || "").trim(),
    matchedHighlights: normalizeStringArray(parsed.matchedHighlights, 5),
    suggestedQuestions: normalizeStringArray(parsed.suggestedQuestions, 6),
    boldPhrases,
    profileMatch: parseProfileMatch(parsed.profileMatch),
  };
}

async function callProposalModel(
  systemPrompt: string,
  userPrompt: string,
  clientName?: string
) {
  const groq = createGroqClient();

  const completion = await groq.chat.completions.create({
    model: getGroqModel(),
    temperature: 0.55,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  const content = completion.choices[0]?.message?.content;

  if (!content) {
    throw new Error("AI did not return a proposal.");
  }

  return parseGeneratedProposal(content, clientName);
}

export async function generateUpworkProposalFromResume(input: {
  jobDescription: string;
  resume: ResumeProfile;
  freelancerName: string;
  upworkProfileUrl: string;
  clientName?: string;
  jobTitleHint?: string;
  options?: ProposalGenerationOptions;
}) {
  const resumeJson = compactResumeForPrompt(input.resume.extracted);

  const systemPrompt = `You are an expert Upwork proposal writer.
${PROPOSAL_RULES}

Compare freelancer profile vs job:
- If resume focus differs from job (e.g. video editing vs software dev), set isMismatch=true, matchScore below 40, matchLevel=low, clear warningMessage.
- If partially aligned, matchLevel=medium.
- If strong fit, matchLevel=high, isMismatch=false.

${SHARED_JSON_SHAPE}`;

  const userPrompt = `Write the cover letter using the freelancer's resume profile.

JOB DESCRIPTION:
${input.jobDescription.trim()}

OPTIONAL CLIENT NAME:
${input.clientName?.trim() || "Not provided"}

OPTIONAL JOB TITLE HINT:
${input.jobTitleHint?.trim() || "Infer from job description"}

FREELANCER DISPLAY NAME:
${input.freelancerName}

UPWORK PROFILE URL:
${input.upworkProfileUrl || "Not provided"}

FREELANCER RESUME PROFILE (only use facts from here):
${resumeJson}
${buildPromptExtras(input.options)}`;

  return callProposalModel(systemPrompt, userPrompt, input.clientName);
}

export async function generateGenericUpworkProposal(input: {
  jobDescription: string;
  profile: GenericProposalProfile;
  upworkProfileUrl: string;
  clientName?: string;
  jobTitleHint?: string;
  options?: ProposalGenerationOptions;
}) {
  const systemPrompt = `You are an expert Upwork proposal writer.
${PROPOSAL_RULES}

GENERIC MODE: use only freelancer details below. Do not invent employers or metrics.

Compare stated background vs job for profileMatch (resumeFocus = their stated background).

${SHARED_JSON_SHAPE}`;

  const userPrompt = `Write the cover letter in GENERIC MODE.

JOB DESCRIPTION:
${input.jobDescription.trim()}

OPTIONAL CLIENT NAME:
${input.clientName?.trim() || "Not provided"}

OPTIONAL JOB TITLE HINT:
${input.jobTitleHint?.trim() || "Infer from job description"}

FREELANCER DETAILS:
Name: ${input.profile.freelancerName}
Headline: ${input.profile.professionalHeadline || "Not provided"}
Skills: ${input.profile.skillsSummary || "Not provided"}
Background: ${input.profile.experienceSummary || "Not provided"}

UPWORK PROFILE URL:
${input.upworkProfileUrl || "Not provided"}
${buildPromptExtras(input.options)}`;

  return callProposalModel(systemPrompt, userPrompt, input.clientName);
}
