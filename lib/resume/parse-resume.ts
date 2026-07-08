import OpenAI from "openai";
import { normalizeExtractedResume } from "@/lib/resume/normalize-extracted";

const RESUME_EXTRACTION_PROMPT = `You are a resume parser. Read the entire resume text carefully and extract ALL real information from it.

Rules:
- Extract every item that appears in the resume.
- Put each item in the most appropriate category.
- Preserve bullet points as separate highlight strings where possible.
- Do not invent, guess, or add placeholder/example data.
- If a section is missing from the resume, return empty strings or empty arrays.
- Include technical skills, soft skills, tools, frameworks, platforms, and domain skills.
- Work history goes in experience. Personal/portfolio/academic builds go in projects when appropriate.
- Certifications, languages, awards, and achievements must be captured if present.

Return valid JSON with this exact shape:
{
  "contact": {
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "headline": "string"
  },
  "summary": "string",
  "skills": ["string"],
  "skillCategories": {
    "technical": ["string"],
    "soft": ["string"],
    "tools": ["string"],
    "other": ["string"]
  },
  "experience": [
    {
      "title": "string",
      "company": "string",
      "period": "string",
      "location": "string",
      "description": "string",
      "highlights": ["string"]
    }
  ],
  "projects": [
    {
      "name": "string",
      "tech": "string",
      "period": "string",
      "description": "string",
      "highlights": ["string"]
    }
  ],
  "education": [
    {
      "degree": "string",
      "institution": "string",
      "period": "string",
      "location": "string",
      "details": "string"
    }
  ],
  "certifications": [
    {
      "name": "string",
      "issuer": "string",
      "date": "string"
    }
  ],
  "languages": [
    {
      "language": "string",
      "proficiency": "string"
    }
  ],
  "achievements": ["string"],
  "links": [
    {
      "label": "string",
      "url": "string"
    }
  ]
}`;

function getGroqApiKey() {
  return process.env.GROQ_API_KEY || process.env.GROK_API_KEY;
}

export async function parseResumeWithAI(resumeText: string) {
  const apiKey = getGroqApiKey();

  if (!apiKey) {
    throw new Error(
      "GROQ_API_KEY is not configured. Add your Groq key from https://console.groq.com/keys to .env.local."
    );
  }

  const groq = new OpenAI({
    apiKey,
    baseURL: "https://api.groq.com/openai/v1",
  });

  const completion = await groq.chat.completions.create({
    model:
      process.env.GROQ_MODEL ||
      process.env.GROK_MODEL ||
      "llama-3.3-70b-versatile",
    temperature: 0.1,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: RESUME_EXTRACTION_PROMPT,
      },
      {
        role: "user",
        content: `Parse this resume and extract all information:\n\n${resumeText}`,
      },
    ],
  });

  const content = completion.choices[0]?.message?.content;

  if (!content) {
    throw new Error("AI did not return resume data.");
  }

  const parsed = JSON.parse(content) as Record<string, unknown>;
  return normalizeExtractedResume(parsed);
}
