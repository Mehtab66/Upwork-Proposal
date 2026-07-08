import type {
  ExtractedResume,
  ResumeCertification,
  ResumeEducation,
  ResumeExperience,
  ResumeLanguage,
  ResumeLink,
  ResumeProject,
  ResumeSkillCategories,
} from "@/types/resume";
import { emptyExtractedResume } from "@/types/resume";

function toStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(Boolean)
    .map((item) => String(item).trim())
    .filter(Boolean);
}

function normalizeContact(value: unknown) {
  const contact =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};

  return {
    fullName: String(contact.fullName || "").trim(),
    email: String(contact.email || "").trim(),
    phone: String(contact.phone || "").trim(),
    location: String(contact.location || "").trim(),
    headline: String(contact.headline || "").trim(),
  };
}

function normalizeSkillCategories(value: unknown): ResumeSkillCategories {
  const categories =
    value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};

  return {
    technical: toStringArray(categories.technical),
    soft: toStringArray(categories.soft),
    tools: toStringArray(categories.tools),
    other: toStringArray(categories.other),
  };
}

function normalizeExperience(value: unknown): ResumeExperience[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => {
    const entry = item as Record<string, unknown>;
    return {
      title: String(entry.title || "").trim(),
      company: String(entry.company || "").trim(),
      period: String(entry.period || "").trim(),
      location: String(entry.location || "").trim(),
      description: String(entry.description || "").trim(),
      highlights: toStringArray(entry.highlights),
    };
  });
}

function normalizeProjects(value: unknown): ResumeProject[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => {
    const entry = item as Record<string, unknown>;
    return {
      name: String(entry.name || "").trim(),
      tech: String(entry.tech || "").trim(),
      period: String(entry.period || "").trim(),
      description: String(entry.description || "").trim(),
      highlights: toStringArray(entry.highlights),
    };
  });
}

function normalizeEducation(value: unknown): ResumeEducation[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => {
    const entry = item as Record<string, unknown>;
    return {
      degree: String(entry.degree || "").trim(),
      institution: String(entry.institution || "").trim(),
      period: String(entry.period || "").trim(),
      location: String(entry.location || "").trim(),
      details: String(entry.details || "").trim(),
    };
  });
}

function normalizeCertifications(value: unknown): ResumeCertification[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => {
    const entry = item as Record<string, unknown>;
    return {
      name: String(entry.name || "").trim(),
      issuer: String(entry.issuer || "").trim(),
      date: String(entry.date || "").trim(),
    };
  });
}

function normalizeLanguages(value: unknown): ResumeLanguage[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => {
    const entry = item as Record<string, unknown>;
    return {
      language: String(entry.language || "").trim(),
      proficiency: String(entry.proficiency || "").trim(),
    };
  });
}

function normalizeLinks(value: unknown): ResumeLink[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.map((item) => {
    const entry = item as Record<string, unknown>;
    return {
      label: String(entry.label || "").trim(),
      url: String(entry.url || "").trim(),
    };
  });
}

function mergeSkills(
  skills: string[],
  skillCategories: ResumeSkillCategories
) {
  const merged = new Set<string>([
    ...skills,
    ...skillCategories.technical,
    ...skillCategories.soft,
    ...skillCategories.tools,
    ...skillCategories.other,
  ]);

  return Array.from(merged);
}

export function normalizeExtractedResume(
  parsed: Partial<ExtractedResume> | Record<string, unknown>
): ExtractedResume {
  const data = parsed as Partial<ExtractedResume>;
  const skillCategories = normalizeSkillCategories(data.skillCategories);
  const skills = mergeSkills(toStringArray(data.skills), skillCategories);

  return {
    contact: normalizeContact(data.contact),
    summary: String(data.summary || "").trim(),
    skills,
    skillCategories,
    experience: normalizeExperience(data.experience),
    projects: normalizeProjects(data.projects),
    education: normalizeEducation(data.education),
    certifications: normalizeCertifications(data.certifications),
    languages: normalizeLanguages(data.languages),
    achievements: toStringArray(data.achievements),
    links: normalizeLinks(data.links),
  };
}

export function coerceStoredExtractedResume(
  value: unknown
): ExtractedResume {
  if (!value || typeof value !== "object") {
    return emptyExtractedResume;
  }

  const stored = value as Record<string, unknown>;

  if (stored.contact || stored.skillCategories || stored.certifications) {
    return normalizeExtractedResume(stored as Partial<ExtractedResume>);
  }

  return normalizeExtractedResume({
    summary: stored.summary,
    skills: stored.skills,
    experience: stored.experience,
    projects: stored.projects,
    education: stored.education,
    links: stored.links,
  });
}
