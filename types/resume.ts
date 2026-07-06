export interface ResumeExperience {
  title: string;
  company: string;
  period: string;
  description: string;
}

export interface ResumeProject {
  name: string;
  tech: string;
  description: string;
}

export interface ResumeEducation {
  degree: string;
  institution: string;
  period: string;
}

export interface ResumeLink {
  label: string;
  url: string;
}

export interface ExtractedResume {
  summary: string;
  skills: string[];
  experience: ResumeExperience[];
  projects: ResumeProject[];
  education: ResumeEducation[];
  links: ResumeLink[];
}

export interface ResumeProfile {
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
  extracted: ExtractedResume;
}

export interface ResumeResponse {
  resume: ResumeProfile | null;
}

export function calculateProfileCompletion(extracted: ExtractedResume) {
  let score = 0;

  if (extracted.summary?.trim()) score += 15;
  if (extracted.skills.length > 0) score += 25;
  if (extracted.experience.length > 0) score += 25;
  if (extracted.projects.length > 0) score += 20;
  if (extracted.education.length > 0) score += 10;
  if (extracted.links.length > 0) score += 5;

  return Math.min(score, 100);
}
