export interface ResumeContact {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  headline: string;
}

export interface ResumeExperience {
  title: string;
  company: string;
  period: string;
  location: string;
  description: string;
  highlights: string[];
}

export interface ResumeProject {
  name: string;
  tech: string;
  period: string;
  description: string;
  highlights: string[];
}

export interface ResumeEducation {
  degree: string;
  institution: string;
  period: string;
  location: string;
  details: string;
}

export interface ResumeCertification {
  name: string;
  issuer: string;
  date: string;
}

export interface ResumeLanguage {
  language: string;
  proficiency: string;
}

export interface ResumeLink {
  label: string;
  url: string;
}

export interface ResumeSkillCategories {
  technical: string[];
  soft: string[];
  tools: string[];
  other: string[];
}

export interface ExtractedResume {
  contact: ResumeContact;
  summary: string;
  skills: string[];
  skillCategories: ResumeSkillCategories;
  experience: ResumeExperience[];
  projects: ResumeProject[];
  education: ResumeEducation[];
  certifications: ResumeCertification[];
  languages: ResumeLanguage[];
  achievements: string[];
  links: ResumeLink[];
}

export interface ResumeProfile {
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  source: "upload" | "manual";
  extracted: ExtractedResume;
}

export interface ResumeResponse {
  resume: ResumeProfile | null;
}

export function getTotalSkillsCount(extracted: ExtractedResume) {
  if (extracted.skills.length > 0) {
    return extracted.skills.length;
  }

  const categories = extracted.skillCategories;
  return (
    categories.technical.length +
    categories.soft.length +
    categories.tools.length +
    categories.other.length
  );
}

export function calculateProfileCompletion(extracted: ExtractedResume) {
  let score = 0;

  if (extracted.contact.fullName || extracted.contact.email) score += 10;
  if (extracted.summary?.trim()) score += 10;
  if (getTotalSkillsCount(extracted) > 0) score += 20;
  if (extracted.experience.length > 0) score += 20;
  if (extracted.projects.length > 0) score += 15;
  if (extracted.education.length > 0) score += 10;
  if (extracted.certifications.length > 0) score += 5;
  if (extracted.languages.length > 0) score += 5;
  if (extracted.achievements.length > 0) score += 5;
  if (extracted.links.length > 0) score += 5;

  return Math.min(score, 100);
}

export const emptyExtractedResume: ExtractedResume = {
  contact: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    headline: "",
  },
  summary: "",
  skills: [],
  skillCategories: {
    technical: [],
    soft: [],
    tools: [],
    other: [],
  },
  experience: [],
  projects: [],
  education: [],
  certifications: [],
  languages: [],
  achievements: [],
  links: [],
};
