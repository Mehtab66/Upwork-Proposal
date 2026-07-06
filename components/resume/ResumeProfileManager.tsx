"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { ExtractedResumeView } from "@/components/resume/ExtractedResumeView";
import { cn } from "@/lib/utils";
import type { ResumeProfile } from "@/types/resume";

type UploadState = "idle" | "processing" | "complete";

interface ResumeProfileManagerProps {
  compact?: boolean;
  showHeading?: boolean;
}

export function ResumeProfileManager({
  compact = false,
  showHeading = true,
}: ResumeProfileManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [resume, setResume] = useState<ResumeProfile | null>(null);
  const [loadingResume, setLoadingResume] = useState(true);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");

  const loadResume = useCallback(async () => {
    try {
      const response = await fetch("/api/resume");
      const data = (await response.json()) as {
        resume?: ResumeProfile | null;
        error?: string;
      };

      if (response.ok && data.resume) {
        setResume(data.resume);
        setUploadState("complete");
      }
    } catch {
      setError("Failed to load resume profile.");
    } finally {
      setLoadingResume(false);
    }
  }, []);

  useEffect(() => {
    void loadResume();
  }, [loadResume]);

  const uploadFile = async (file: File) => {
    setError("");
    setUploadState("processing");

    const lowerName = file.name.toLowerCase();
    if (!lowerName.endsWith(".pdf") && !lowerName.endsWith(".docx")) {
      setError("Only PDF and DOCX files are supported.");
      setUploadState(resume ? "complete" : "idle");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Resume file must be 5MB or smaller.");
      setUploadState(resume ? "complete" : "idle");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/resume", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as {
        resume?: ResumeProfile;
        error?: string;
      };

      if (!response.ok || !data.resume) {
        setError(data.error || "Failed to process resume.");
        setUploadState(resume ? "complete" : "idle");
        return;
      }

      setResume(data.resume);
      setUploadState("complete");
    } catch {
      setError("Something went wrong while uploading your resume.");
      setUploadState(resume ? "complete" : "idle");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      void uploadFile(file);
    }
    event.target.value = "";
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      void uploadFile(file);
    }
  };

  if (loadingResume) {
    return <Loading message="Loading resume profile..." className="py-12" />;
  }

  return (
    <div className="space-y-6">
      {showHeading && (
        <div>
          <h2 className="text-xl font-bold text-foreground">
            Upload Your Resume
          </h2>
          <p className="text-sm text-muted mt-1">
            AI will extract your skills, experience, education, and portfolio links automatically.
          </p>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        onChange={handleFileChange}
      />

      <AnimatePresence mode="wait">
        {uploadState === "idle" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div
              onDragOver={(event) => {
                event.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "glass rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-all duration-300",
                compact && "p-8",
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
                Extracting skills, experience, education, and portfolio links...
              </p>
            </Card>
          </motion.div>
        )}

        {uploadState === "complete" && resume && (
          <motion.div
            key="complete"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted">
                Last uploaded:{" "}
                {new Date(resume.uploadedAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-4 w-4" />
                Upload New Resume
              </Button>
            </div>

            <ExtractedResumeView resume={resume} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
