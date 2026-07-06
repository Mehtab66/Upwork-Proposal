"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileUser, Upload, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { calculateProfileCompletion, type ResumeProfile } from "@/types/resume";

export function ResumeCard() {
  const [resume, setResume] = useState<ResumeProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadResume() {
      try {
        const response = await fetch("/api/resume");
        const data = (await response.json()) as { resume?: ResumeProfile | null };

        if (response.ok) {
          setResume(data.resume || null);
        }
      } finally {
        setLoading(false);
      }
    }

    void loadResume();
  }, []);

  const completionPercent = resume
    ? calculateProfileCompletion(resume.extracted)
    : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Resume Status</CardTitle>
          {loading ? null : resume ? (
            <Badge variant="success">Uploaded</Badge>
          ) : (
            <Badge variant="warning">Not uploaded</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted">Loading resume status...</p>
        ) : resume ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary-light flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  Resume uploaded
                </p>
                <p className="text-xs text-muted">{resume.fileName}</p>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted">Profile completion</span>
                <span className="font-semibold text-primary">
                  {completionPercent}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="h-12 w-12 rounded-2xl bg-primary-light flex items-center justify-center mx-auto mb-3">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            <p className="text-sm text-muted mb-4">
              Upload your resume to get started
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
