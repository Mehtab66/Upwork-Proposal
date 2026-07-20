import type { ExtractedResume, ResumeProfile } from "@/types/resume";

export function buildFreelancerContext(input: {
  resume: ResumeProfile;
  freelancerName: string;
  upworkProfileUrl: string;
}) {
  const { extracted } = input.resume;

  return {
    freelancerName: input.freelancerName || extracted.contact.fullName || "Freelancer",
    headline: extracted.contact.headline,
    summary: extracted.summary,
    location: extracted.contact.location,
    upworkProfileUrl: input.upworkProfileUrl,
    skills: extracted.skills,
    skillCategories: extracted.skillCategories,
    experience: extracted.experience.slice(0, 6),
    projects: extracted.projects.slice(0, 6),
    education: extracted.education.slice(0, 3),
    certifications: extracted.certifications.slice(0, 5),
    achievements: extracted.achievements.slice(0, 8),
    links: extracted.links.filter((link) => link.url).slice(0, 6),
  };
}

export function compactResumeForPrompt(extracted: ExtractedResume) {
  return JSON.stringify(
    {
      contact: {
        fullName: extracted.contact.fullName,
        headline: extracted.contact.headline,
        location: extracted.contact.location,
      },
      summary: extracted.summary,
      skills: extracted.skills.slice(0, 40),
      skillCategories: extracted.skillCategories,
      experience: extracted.experience.slice(0, 5).map((item) => ({
        title: item.title,
        company: item.company,
        period: item.period,
        highlights: item.highlights.slice(0, 4),
      })),
      projects: extracted.projects.slice(0, 5).map((item) => ({
        name: item.name,
        tech: item.tech,
        description: item.description,
        highlights: item.highlights.slice(0, 3),
      })),
      certifications: extracted.certifications.slice(0, 5),
      achievements: extracted.achievements.slice(0, 6),
      links: extracted.links.slice(0, 5),
    },
    null,
    2
  );
}
