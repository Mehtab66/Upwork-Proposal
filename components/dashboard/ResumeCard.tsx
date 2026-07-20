"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileUser, Upload, CheckCircle2, Files } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  calculateProfileCompletion,
  type ResumeProfile,
  type ResumeResponse,
} from "@/types/resume";

export function ResumeCard() {
  const [resumes, setResumes] = useState<ResumeProfile[]>([]);
  const [activeResume, setActiveResume] = useState<ResumeProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResume() {
      try {
        const response = await fetch("/api/resume");
        const data = (await response.json()) as ResumeResponse;

        if (response.ok) {
          setResumes(data.resumes || []);
          setActiveResume(data.resume || null);
        }
      } finally {
        setLoading(false);
      }
    }

    void loadResume();
  }, []);

  const completionPercent = activeResume
    ? calculateProfileCompletion(activeResume.extracted)
    : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Resume Status</CardTitle>
          {loading ? null : activeResume ? (
            <Badge variant="success">Active</Badge>
          ) : (
            <Badge variant="warning">Not uploaded</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted">Loading resume status...</p>
        ) : activeResume ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {activeResume.label}
                </p>
                <p className="truncate text-xs text-muted">
                  {activeResume.source === "manual"
                    ? "Manual profile"
                    : activeResume.fileName}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted">
              <Files className="h-4 w-4" />
              {resumes.length} resume{resumes.length === 1 ? "" : "s"} saved
            </div>

            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span className="text-muted">Profile completion</span>
                <span className="font-semibold text-primary">
                  {completionPercent}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
            </div>

            <Link href="/create-profile">
              <Button size="sm" variant="outline" className="w-full">
                Manage Resumes
              </Button>
            </Link>
          </div>
        ) : (
          <div className="py-4 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <p className="mb-4 text-sm text-muted">
              Upload your first resume to get started
            </p>
            <Link href="/create-profile">
              <Button size="sm">
                <FileUser className="h-4 w-4" />
                Upload Resume
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
