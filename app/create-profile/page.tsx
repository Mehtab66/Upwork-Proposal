"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  Briefcase,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loading } from "@/components/ui/loading";
import { cn } from "@/lib/utils";

const mockSkills = [
  "React", "TypeScript", "Node.js", "Next.js", "PostgreSQL",
  "Tailwind CSS", "GraphQL", "AWS", "Docker", "Python",
];

const mockExperience = [
  {
    title: "Senior Full-Stack Developer",
    company: "TechCorp Inc.",
    period: "2021 – Present",
    description: "Led development of SaaS platform serving 50k+ users.",
  },
  {
    title: "Full-Stack Developer",
    company: "StartupXYZ",
    period: "2018 – 2021",
    description: "Built and maintained multiple client-facing web applications.",
  },
  {
    title: "Frontend Developer",
    company: "Digital Agency",
    period: "2016 – 2018",
    description: "Developed responsive websites and web apps for diverse clients.",
  },
];

const mockProjects = [
  {
    name: "E-Commerce Platform",
    tech: "React, Node.js, Stripe",
    description: "Full-stack marketplace with 10k+ products and payment integration.",
  },
  {
    name: "SaaS Dashboard",
    tech: "Next.js, TypeScript, PostgreSQL",
    description: "Analytics dashboard with real-time data visualization.",
  },
  {
    name: "Mobile Banking App",
    tech: "React Native, Firebase",
    description: "Cross-platform banking app with biometric authentication.",
  },
];

const mockLinks = [
  { label: "GitHub", url: "github.com/johndoe" },
  { label: "Portfolio", url: "johndoe.dev" },
  { label: "LinkedIn", url: "linkedin.com/in/johndoe" },
];

type UploadState = "idle" | "processing" | "complete";

export default function CreateProfilePage() {
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [dragOver, setDragOver] = useState(false);

  const handleUpload = useCallback(() => {
    setUploadState("processing");
    setTimeout(() => setUploadState("complete"), 2500);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      handleUpload();
    },
    [handleUpload]
  );

  return (
    <DashboardLayout title="Resume Profile">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Upload Your Resume
          </h2>
          <p className="text-sm text-muted mt-1">
            AI will extract your skills, experience, and portfolio automatically.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {uploadState === "idle" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                onClick={handleUpload}
                className={cn(
                  "glass rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-all duration-300",
                  dragOver
                    ? "border-primary bg-primary-light/50 scale-[1.01]"
                    : "border-border hover:border-primary/40 hover:bg-primary-light/20"
                )}
              >
                <div className="h-16 w-16 rounded-2xl bg-primary-light flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Drag and drop your resume
                </h3>
                <p className="text-sm text-muted mb-4">
                  or click to browse files
                </p>
                <div className="flex items-center justify-center gap-3">
                  <Badge variant="outline">
                    <FileText className="h-3 w-3 mr-1" />
                    PDF
                  </Badge>
                  <Badge variant="outline">
                    <FileText className="h-3 w-3 mr-1" />
                    DOCX
                  </Badge>
                </div>
              </div>
            </motion.div>
          )}

          {uploadState === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Card className="py-16">
                <Loading message="AI is analyzing your resume..." size="lg" />
                <p className="text-center text-xs text-muted mt-4">
                  Extracting skills, experience, and portfolio links...
                </p>
              </Card>
            </motion.div>
          )}

          {uploadState === "complete" && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 p-4 rounded-xl bg-primary-light/50 border border-primary/20">
                <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Resume processed successfully
                  </p>
                  <p className="text-xs text-muted">
                    Found {mockSkills.length} skills, {mockExperience.length} experiences, and {mockProjects.length} projects
                  </p>
                </div>
              </div>

              {/* Skills */}
              <Card>
                <CardHeader>
                  <CardTitle>Skills Detected</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {mockSkills.map((skill) => (
                      <Badge key={skill} variant="primary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Experience */}
              <Card>
                <CardHeader>
                  <CardTitle>Experience</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mockExperience.map((exp) => (
                    <div
                      key={exp.title}
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
                          {exp.company} · {exp.period}
                        </p>
                        <p className="text-xs text-muted mt-1 leading-relaxed">
                          {exp.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Projects */}
              <Card>
                <CardHeader>
                  <CardTitle>Projects</CardTitle>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockProjects.map((project) => (
                    <div
                      key={project.name}
                      className="p-4 rounded-xl border border-border hover:border-primary/20 transition-colors"
                    >
                      <h4 className="text-sm font-semibold text-foreground mb-1">
                        {project.name}
                      </h4>
                      <p className="text-xs text-primary mb-2">{project.tech}</p>
                      <p className="text-xs text-muted leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Portfolio Links */}
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {mockLinks.map((link) => (
                    <a
                      key={link.label}
                      href="#"
                      className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/30 hover:bg-primary-light/30 transition-all group"
                    >
                      <ExternalLink className="h-4 w-4 text-muted group-hover:text-primary transition-colors" />
                      <span className="text-sm font-medium text-foreground">
                        {link.label}
                      </span>
                      <span className="text-xs text-muted ml-auto">
                        {link.url}
                      </span>
                    </a>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}
