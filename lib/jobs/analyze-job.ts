import { createGroqClient, getGroqModel } from "@/lib/groq/client";
import { compactResumeForPrompt } from "@/lib/proposal/build-context";
import type {
  AdvancedJobMatch,
  JobAnalysisResult,
  MatchedPortfolioItem,
} from "@/types/job-analysis";
import type { ResumeProfile } from "@/types/resume";

const ANALYSIS_PROMPT = `You are an Upwork job analyst and talent matcher.

Analyze the job post deeply:
- Client's real problem (not just title)
- Required vs nice-to-have skills
- Deliverables, tone, budget/timeline signals
- Best proposal angle

If freelancer profile data is provided, perform ADVANCED MATCHING:
- matchScore 0-100, matchLevel high|medium|low
- overlappingSkills, missingSkills, partialSkills
- experienceAlignment narrative
- isMismatch if profile focus differs strongly from job
- warningMessage and recommendation (switch resume, address gaps, etc.)
- matchedPortfolio: pick up to 5 items from their projects/experience with relevanceScore 0-100 and reason

Return JSON:
{
  "jobTitle": "string",
  "jobCategory": "string",
  "clientProblem": "string",
  "requiredSkills": ["string"],
  "niceToHaveSkills": ["string"],
  "deliverables": ["string"],
  "clientTone": "string",
  "budgetTimelineSignals": "string",
  "proposalAngle": "string",
  "advancedMatch": {
    "matchScore": 0,
    "matchLevel": "high|medium|low",
    "resumeFocus": "string",
    "jobFocus": "string",
    "isMismatch": false,
    "warningMessage": "string",
    "recommendation": "string",
    "overlappingSkills": ["string"],
    "missingSkills": ["string"],
    "partialSkills": ["string"],
    "experienceAlignment": "string"
  },
  "matchedPortfolio": [
    {
      "type": "project|experience",
      "name": "string",
      "subtitle": "string",
      "reason": "string",
      "relevanceScore": 0
    }
  ]
}

If no profile provided, set advancedMatch to null and matchedPortfolio to [].`;

function normalizeStringArray(value: unknown, max = 12) {
  if (!Array.isArray(value)) return [];
  return value.map((item) => String(item).trim()).filter(Boolean).slice(0, max);
}

function parseMatchedPortfolio(value: unknown): MatchedPortfolioItem[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;
      return {
        type: record.type === "experience" ? "experience" : "project",
        name: String(record.name || "").trim(),
        subtitle: String(record.subtitle || "").trim(),
        reason: String(record.reason || "").trim(),
        relevanceScore: Math.max(
          0,
          Math.min(100, Number(record.relevanceScore || 0))
        ),
      } satisfies MatchedPortfolioItem;
    })
    .filter(
      (item): item is MatchedPortfolioItem =>
        Boolean(item && item.name && item.reason)
    )
    .slice(0, 5);
}

function parseAdvancedMatch(value: unknown): AdvancedJobMatch | null {
  if (!value || typeof value !== "object") return null;

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
    overlappingSkills: normalizeStringArray(record.overlappingSkills, 15),
    missingSkills: normalizeStringArray(record.missingSkills, 15),
    partialSkills: normalizeStringArray(record.partialSkills, 10),
    experienceAlignment: String(record.experienceAlignment || "").trim(),
  };
}

export async function analyzeUpworkJob(input: {
  jobDescription: string;
  clientName?: string;
  activeResume?: ResumeProfile | null;
}) {
  const groq = createGroqClient();

  const profileSection = input.activeResume
    ? compactResumeForPrompt(input.activeResume.extracted)
    : "No resume profile provided.";

  const completion = await groq.chat.completions.create({
    model: getGroqModel(),
    temperature: 0.35,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: ANALYSIS_PROMPT },
      {
        role: "user",
        content: `JOB DESCRIPTION:
${input.jobDescription.trim()}

CLIENT NAME (optional):
${input.clientName?.trim() || "Not provided"}

ACTIVE RESUME PROFILE:
${profileSection}`,
      },
    ],
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    throw new Error("AI did not return job analysis.");
  }

  const parsed = JSON.parse(content) as Record<string, unknown>;

  return {
    jobTitle: String(parsed.jobTitle || "Upwork Job").trim(),
    jobCategory: String(parsed.jobCategory || "General").trim(),
    clientProblem: String(parsed.clientProblem || "").trim(),
    requiredSkills: normalizeStringArray(parsed.requiredSkills, 15),
    niceToHaveSkills: normalizeStringArray(parsed.niceToHaveSkills, 12),
    deliverables: normalizeStringArray(parsed.deliverables, 10),
    clientTone: String(parsed.clientTone || "").trim(),
    budgetTimelineSignals: String(parsed.budgetTimelineSignals || "").trim(),
    proposalAngle: String(parsed.proposalAngle || "").trim(),
    advancedMatch: parseAdvancedMatch(parsed.advancedMatch),
    matchedPortfolio: parseMatchedPortfolio(parsed.matchedPortfolio),
  } satisfies JobAnalysisResult;
}
