"use client";

import {
  Briefcase,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ExtractedResume, ResumeProfile } from "@/types/resume";

interface ExtractedResumeViewProps {
  resume: ResumeProfile;
}

export function ExtractedResumeView({ resume }: ExtractedResumeViewProps) {
  const { extracted } = resume;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 p-4 rounded-xl bg-primary-light/50 border border-primary/20">
        <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
        <div>
          <p className="text-sm font-semibold text-foreground">
            Resume processed successfully
          </p>
          <p className="text-xs text-muted">
            {resume.fileName} · Found {extracted.skills.length} skills,{" "}
            {extracted.experience.length} experiences, and{" "}
            {extracted.projects.length} projects
          </p>
        </div>
      </div>

      {extracted.summary && (
        <Card>
          <CardHeader>
            <CardTitle>Professional Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted leading-relaxed">
              {extracted.summary}
            </p>
          </CardContent>
        </Card>
      )}

      {extracted.skills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Skills Detected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {extracted.skills.map((skill) => (
                <Badge key={skill} variant="primary">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {extracted.experience.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Experience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {extracted.experience.map((exp, index) => (
              <div
                key={`${exp.title}-${exp.company}-${index}`}
                className="flex gap-4 p-4 rounded-xl border border-border hover:border-primary/20 transition-colors"
              >
                <div className="h-10 w-10 rounded-xl bg-primary-light flex items-center justify-center shrink-0">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    {exp.title}
                  </h4>
                  <p className="text-xs text-primary font-medium">
                    {exp.company}
                    {exp.period ? ` · ${exp.period}` : ""}
                  </p>
                  {exp.description && (
                    <p className="text-xs text-muted mt-1 leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {extracted.projects.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Projects</CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {extracted.projects.map((project, index) => (
              <div
                key={`${project.name}-${index}`}
                className="p-4 rounded-xl border border-border hover:border-primary/20 transition-colors"
              >
                <h4 className="text-sm font-semibold text-foreground mb-1">
                  {project.name}
                </h4>
                {project.tech && (
                  <p className="text-xs text-primary mb-2">{project.tech}</p>
                )}
                {project.description && (
                  <p className="text-xs text-muted leading-relaxed">
                    {project.description}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {extracted.education.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Education</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {extracted.education.map((item, index) => (
              <div
                key={`${item.degree}-${item.institution}-${index}`}
                className="flex gap-4 p-4 rounded-xl border border-border"
              >
                <div className="h-10 w-10 rounded-xl bg-primary-light flex items-center justify-center shrink-0">
                  <GraduationCap className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground">
                    {item.degree}
                  </h4>
                  <p className="text-xs text-primary font-medium">
                    {item.institution}
                    {item.period ? ` · ${item.period}` : ""}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {extracted.links.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
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
          </CardContent>
        </Card>
      )}
    </div>
  );
}
