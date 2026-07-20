"use client";

import {
  Award,
  Briefcase,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Languages,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getTotalSkillsCount,
  type ExtractedResume,
  type ResumeProfile,
} from "@/types/resume";

interface ExtractedResumeViewProps {
  resume: ResumeProfile;
}

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function HighlightList({ items }: { items: string[] }) {
  if (items.length === 0) {
    return null;
  }

  return (
    <ul className="mt-2 space-y-1">
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className="text-xs text-muted leading-relaxed">
          • {item}
        </li>
      ))}
    </ul>
  );
}

function SkillGroup({
  label,
  items,
}: {
  label: string;
  items: string[];
}) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div>
      <p className="text-xs font-semibold text-foreground mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Badge key={`${label}-${item}`} variant="primary">
            {item}
          </Badge>
        ))}
      </div>
    </div>
  );
}

function getExtractionStats(extracted: ExtractedResume) {
  return {
    skills: getTotalSkillsCount(extracted),
    experience: extracted.experience.length,
    projects: extracted.projects.length,
    education: extracted.education.length,
    certifications: extracted.certifications.length,
    languages: extracted.languages.length,
    achievements: extracted.achievements.length,
    links: extracted.links.length,
  };
}

export function ExtractedResumeView({ resume }: ExtractedResumeViewProps) {
  const { extracted } = resume;
  const stats = getExtractionStats(extracted);
  const hasContact =
    extracted.contact.fullName ||
    extracted.contact.email ||
    extracted.contact.phone ||
    extracted.contact.location ||
    extracted.contact.headline;
  const hasSkills =
    stats.skills > 0 ||
    extracted.skillCategories.technical.length > 0 ||
    extracted.skillCategories.soft.length > 0 ||
    extracted.skillCategories.tools.length > 0 ||
    extracted.skillCategories.other.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 p-4 rounded-xl bg-primary-light/50 border border-primary/20">
        <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
        <div>
          <p className="text-sm font-semibold text-foreground">
            Resume processed successfully
          </p>
          <p className="text-xs text-muted">
            {resume.label} ·{" "}
            {resume.source === "manual" ? "Manual profile" : resume.fileName} ·
            Extracted {stats.skills} skills, {stats.experience} jobs,{" "}
            {stats.projects} projects, {stats.education} education entries,{" "}
            {stats.certifications} certifications, and {stats.languages} languages
          </p>
        </div>
      </div>

      {hasContact && (
        <SectionCard title="Contact Information">
          <div className="grid sm:grid-cols-2 gap-4">
            {extracted.contact.fullName && (
              <div className="flex items-start gap-3">
                <User className="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <p className="text-xs text-muted">Full Name</p>
                  <p className="text-sm font-medium text-foreground">
                    {extracted.contact.fullName}
                  </p>
                </div>
              </div>
            )}
            {extracted.contact.email && (
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <p className="text-xs text-muted">Email</p>
                  <p className="text-sm font-medium text-foreground">
                    {extracted.contact.email}
                  </p>
                </div>
              </div>
            )}
            {extracted.contact.phone && (
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <p className="text-xs text-muted">Phone</p>
                  <p className="text-sm font-medium text-foreground">
                    {extracted.contact.phone}
                  </p>
                </div>
              </div>
            )}
            {extracted.contact.location && (
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <p className="text-xs text-muted">Location</p>
                  <p className="text-sm font-medium text-foreground">
                    {extracted.contact.location}
                  </p>
                </div>
              </div>
            )}
          </div>
          {extracted.contact.headline && (
            <p className="text-sm text-muted mt-4 leading-relaxed">
              {extracted.contact.headline}
            </p>
          )}
        </SectionCard>
      )}

      {extracted.summary && (
        <SectionCard title="Professional Summary">
          <p className="text-sm text-muted leading-relaxed">{extracted.summary}</p>
        </SectionCard>
      )}

      {hasSkills && (
        <SectionCard title="Skills">
          <div className="space-y-4">
            <SkillGroup label="Technical Skills" items={extracted.skillCategories.technical} />
            <SkillGroup label="Tools & Platforms" items={extracted.skillCategories.tools} />
            <SkillGroup label="Soft Skills" items={extracted.skillCategories.soft} />
            <SkillGroup label="Other Skills" items={extracted.skillCategories.other} />
            {extracted.skills.length > 0 && (
              <SkillGroup label="All Detected Skills" items={extracted.skills} />
            )}
          </div>
        </SectionCard>
      )}

      {extracted.experience.length > 0 && (
        <SectionCard title="Work Experience">
          <div className="space-y-4">
            {extracted.experience.map((exp, index) => (
              <div
                key={`${exp.title}-${exp.company}-${index}`}
                className="flex gap-4 p-4 rounded-xl border border-border"
              >
                <div className="h-10 w-10 rounded-xl bg-primary-light flex items-center justify-center shrink-0">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <h4 className="text-sm font-semibold text-foreground">{exp.title}</h4>
                  <p className="text-xs text-primary font-medium">
                    {exp.company}
                    {exp.period ? ` · ${exp.period}` : ""}
                    {exp.location ? ` · ${exp.location}` : ""}
                  </p>
                  {exp.description && (
                    <p className="text-xs text-muted mt-1 leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                  <HighlightList items={exp.highlights} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {extracted.projects.length > 0 && (
        <SectionCard title="Projects">
          <div className="grid sm:grid-cols-2 gap-4">
            {extracted.projects.map((project, index) => (
              <div
                key={`${project.name}-${index}`}
                className="p-4 rounded-xl border border-border"
              >
                <h4 className="text-sm font-semibold text-foreground">{project.name}</h4>
                {project.tech && (
                  <p className="text-xs text-primary mt-1">{project.tech}</p>
                )}
                {project.period && (
                  <p className="text-xs text-muted mt-1">{project.period}</p>
                )}
                {project.description && (
                  <p className="text-xs text-muted mt-2 leading-relaxed">
                    {project.description}
                  </p>
                )}
                <HighlightList items={project.highlights} />
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {extracted.education.length > 0 && (
        <SectionCard title="Education">
          <div className="space-y-4">
            {extracted.education.map((item, index) => (
              <div
                key={`${item.degree}-${item.institution}-${index}`}
                className="flex gap-4 p-4 rounded-xl border border-border"
              >
                <div className="h-10 w-10 rounded-xl bg-primary-light flex items-center justify-center shrink-0">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">{item.degree}</h4>
                  <p className="text-xs text-primary font-medium">
                    {item.institution}
                    {item.period ? ` · ${item.period}` : ""}
                    {item.location ? ` · ${item.location}` : ""}
                  </p>
                  {item.details && (
                    <p className="text-xs text-muted mt-1 leading-relaxed">{item.details}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {extracted.certifications.length > 0 && (
        <SectionCard title="Certifications">
          <div className="space-y-3">
            {extracted.certifications.map((cert, index) => (
              <div
                key={`${cert.name}-${index}`}
                className="p-4 rounded-xl border border-border"
              >
                <h4 className="text-sm font-semibold text-foreground">{cert.name}</h4>
                <p className="text-xs text-muted mt-1">
                  {cert.issuer}
                  {cert.date ? ` · ${cert.date}` : ""}
                </p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {extracted.languages.length > 0 && (
        <SectionCard title="Languages">
          <div className="grid sm:grid-cols-2 gap-3">
            {extracted.languages.map((item, index) => (
              <div
                key={`${item.language}-${index}`}
                className="flex items-center gap-3 p-3 rounded-xl border border-border"
              >
                <Languages className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">{item.language}</p>
                  {item.proficiency && (
                    <p className="text-xs text-muted">{item.proficiency}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {extracted.achievements.length > 0 && (
        <SectionCard title="Achievements & Awards">
          <div className="space-y-3">
            {extracted.achievements.map((item, index) => (
              <div
                key={`${item}-${index}`}
                className="flex items-start gap-3 p-3 rounded-xl border border-border"
              >
                <Award className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <p className="text-sm text-muted leading-relaxed">{item}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {extracted.links.length > 0 && (
        <SectionCard title="Links & Profiles">
          <div className="space-y-2">
            {extracted.links.map((link, index) => (
              <a
                key={`${link.url}-${index}`}
                href={link.url.startsWith("http") ? link.url : `https://${link.url}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/30 hover:bg-primary-light/30 transition-all group"
              >
                <ExternalLink className="h-4 w-4 text-muted group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium text-foreground">
                  {link.label || "Link"}
                </span>
                <span className="text-xs text-muted ml-auto truncate max-w-[50%]">
                  {link.url}
                </span>
              </a>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}
