import OpenAI from "openai";
import type { ExtractedResume } from "@/types/resume";

const emptyResume: ExtractedResume = {
  summary: "",
  skills: [],
  experience: [],
  projects: [],
  education: [],
  links: [],
};

const RESUME_EXTRACTION_PROMPT = `You extract structured resume data from raw resume text.
Return valid JSON with this exact shape:
{
  "summary": "string",
  "skills": ["string"],
  "experience": [
    {
      "title": "string",
      "company": "string",
      "period": "string",
      "description": "string"
    }
  ],
  "projects": [
    {
      "name": "string",
      "tech": "string",
      "description": "string"
    }
  ],
  "education": [
    {
      "degree": "string",
      "institution": "string",
      "period": "string"
    }
  ],
  "links": [
    {
      "label": "string",
      "url": "string"
    }
  ]
}
Use empty strings or empty arrays when data is missing. Do not invent information.`;

export async function parseResumeWithAI(resumeText: string): Promise<ExtractedResume> {
  if (!process.env.GROK_API_KEY) {
    throw new Error(
      "GROK_API_KEY is not configured. Add it to your .env.local file."
    );
  }

  const grok = new OpenAI({
    apiKey: process.env.GROK_API_KEY,
    baseURL: "https://api.x.ai/v1",
  });

  const completion = await grok.chat.completions.create({
    model: process.env.GROK_MODEL || "grok-2-latest",
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: RESUME_EXTRACTION_PROMPT,
      },
      {
        role: "user",
        content: resumeText,
      },
    ],
  });

  const content = completion.choices[0]?.message?.content;

  if (!content) {
    throw new Error("Grok did not return resume data.");
  }

  const parsed = JSON.parse(content) as Partial<ExtractedResume>;

  return {
    summary: parsed.summary?.trim() || "",
    skills: Array.isArray(parsed.skills)
      ? parsed.skills.filter(Boolean).map((skill) => String(skill).trim())
      : [],
    experience: Array.isArray(parsed.experience)
      ? parsed.experience.map((item) => ({
          title: item.title?.trim() || "",
          company: item.company?.trim() || "",
          period: item.period?.trim() || "",
          description: item.description?.trim() || "",
        }))
      : [],
    projects: Array.isArray(parsed.projects)
      ? parsed.projects.map((item) => ({
          name: item.name?.trim() || "",
          tech: item.tech?.trim() || "",
          description: item.description?.trim() || "",
        }))
      : [],
    education: Array.isArray(parsed.education)
      ? parsed.education.map((item) => ({
          degree: item.degree?.trim() || "",
          institution: item.institution?.trim() || "",
          period: item.period?.trim() || "",
        }))
      : [],
    links: Array.isArray(parsed.links)
      ? parsed.links.map((item) => ({
          label: item.label?.trim() || "",
          url: item.url?.trim() || "",
        }))
      : emptyResume.links,
  };
}
