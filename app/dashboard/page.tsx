"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  FolderOpen,
  Code2,
  FileText,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ResumeCard } from "@/components/dashboard/ResumeCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFirstName } from "@/lib/utils";
import {
  calculateProfileCompletion,
  getTotalSkillsCount,
  type ResumeProfile,
  type ResumeResponse,
} from "@/types/resume";

export default function DashboardPage() {
  const { data: session } = useSession();
  const firstName = getFirstName(session?.user?.name);
  const [resume, setResume] = useState<ResumeProfile | null>(null);

  useEffect(() => {
    async function loadResume() {
      try {
        const response = await fetch("/api/resume");
        const data = (await response.json()) as ResumeResponse;

        if (response.ok) {
          setResume(data.resume || null);
        }
      } catch {
        setResume(null);
      }
    }

    void loadResume();
  }, []);

  const extracted = resume?.extracted;
  const projectsCount = extracted?.projects.length ?? 0;
  const skillsCount = extracted ? getTotalSkillsCount(extracted) : 0;
  const experienceCount = extracted?.experience.length ?? 0;
  const completionPercent = extracted
    ? calculateProfileCompletion(extracted)
    : 0;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Create your next winning proposal
          </h1>
          <p className="text-muted mt-1">
            Welcome back, {firstName}. Here&apos;s an overview of your profile.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatsCard
            title="Projects Extracted"
            value={projectsCount}
            icon={FolderOpen}
            subtitle={
              resume
                ? "From your uploaded resume"
                : "Upload a resume to extract projects"
            }
          />
          <StatsCard
            title="Skills Detected"
            value={skillsCount}
            icon={Code2}
            subtitle={
              resume
                ? `${experienceCount} experience entries found`
                : "No resume uploaded yet"
            }
          />
          <StatsCard
            title="Profile Completion"
            value={`${completionPercent}%`}
            icon={FileText}
            subtitle={
              resume
                ? "Based on extracted resume data"
                : "Upload your resume to get started"
            }
            className="sm:col-span-2 lg:col-span-1"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ResumeCard />
          </div>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link href="/generate">
                  <div className="glass rounded-xl p-5 border border-border hover:border-primary/30 transition-all cursor-pointer group glass-hover">
                    <div className="h-10 w-10 rounded-xl bg-primary-light flex items-center justify-center mb-3 group-hover:bg-primary transition-colors">
                      <Sparkles className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Generate Proposal
                    </h3>
                    <p className="text-xs text-muted">
                      Paste a job description and create a winning proposal
                    </p>
                  </div>
                </Link>
                <Link href="/create-profile">
                  <div className="glass rounded-xl p-5 border border-border hover:border-primary/30 transition-all cursor-pointer group glass-hover">
                    <div className="h-10 w-10 rounded-xl bg-primary-light flex items-center justify-center mb-3 group-hover:bg-primary transition-colors">
                      <FolderOpen className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Update Resume
                    </h3>
                    <p className="text-xs text-muted">
                      Re-upload or update your resume profile
                    </p>
                  </div>
                </Link>
              </div>

              <div className="mt-6 flex items-center justify-between p-4 rounded-xl bg-primary-light/50 border border-primary/10">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {resume ? "Your resume profile is ready" : "Upload your resume first"}
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    {resume
                      ? `${skillsCount} skills and ${projectsCount} projects extracted from your resume`
                      : "Upload your resume to unlock personalized proposals"}
                  </p>
                </div>
                <Link href={resume ? "/generate" : "/create-profile"}>
                  <Button size="sm">
                    {resume ? "Start Now" : "Upload Resume"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
