"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, FolderOpen, PenLine, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loading } from "@/components/ui/loading";
import { ExtractedResumeView } from "@/components/resume/ExtractedResumeView";
import { ManualResumeForm } from "@/components/resume/ManualResumeForm";
import { ResumeListPanel } from "@/components/resume/ResumeListPanel";
import { cn } from "@/lib/utils";
import type { ExtractedResume, ResumeProfile, ResumeResponse } from "@/types/resume";

type UploadState = "idle" | "processing" | "complete";
type TabId = "upload" | "manual" | "resumes" | "profile";

interface ResumeProfileManagerProps {
  compact?: boolean;
  showHeading?: boolean;
}

export function ResumeProfileManager({
  compact = false,
  showHeading = true,
}: ResumeProfileManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [resumes, setResumes] = useState<ResumeProfile[]>([]);
  const [activeResumeId, setActiveResumeId] = useState<string | null>(null);
  const [viewResumeId, setViewResumeId] = useState<string | null>(null);
  const [loadingResume, setLoadingResume] = useState(true);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [activeTab, setActiveTab] = useState<TabId>("upload");
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [savingManual, setSavingManual] = useState(false);
  const [uploadLabel, setUploadLabel] = useState("");

  const applyResumeResponse = useCallback((data: ResumeResponse) => {
    setResumes(data.resumes);
    setActiveResumeId(data.activeResumeId);
    if (data.activeResumeId) {
      setViewResumeId(data.activeResumeId);
    }
    if (data.resumes.length > 0) {
      setUploadState("complete");
    }
  }, []);

  const loadResumes = useCallback(async () => {
    try {
      const response = await fetch("/api/resume");
      const data = (await response.json()) as ResumeResponse & { error?: string };

      if (response.ok) {
        applyResumeResponse(data);
        if (data.resumes.length > 0) {
          setActiveTab("resumes");
        }
      }
    } catch {
      setError("Failed to load resume profiles.");
    } finally {
      setLoadingResume(false);
    }
  }, [applyResumeResponse]);

  useEffect(() => {
    void loadResumes();
  }, [loadResumes]);

  const viewedResume =
    resumes.find((resume) => resume.id === viewResumeId) ||
    resumes.find((resume) => resume.id === activeResumeId) ||
    null;

  const uploadFile = async (file: File) => {
    setError("");
    setUploadState("processing");

    const lowerName = file.name.toLowerCase();
    if (!lowerName.endsWith(".pdf") && !lowerName.endsWith(".docx")) {
      setError("Only PDF and DOCX files are supported.");
      setUploadState(resumes.length > 0 ? "complete" : "idle");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Resume file must be 5MB or smaller.");
      setUploadState(resumes.length > 0 ? "complete" : "idle");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (uploadLabel.trim()) {
        formData.append("label", uploadLabel.trim());
      }

      const response = await fetch("/api/resume", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as ResumeResponse & { error?: string };

      if (!response.ok) {
        setError(data.error || "Failed to process resume.");
        setUploadState(resumes.length > 0 ? "complete" : "idle");
        return;
      }

      applyResumeResponse(data);
      setUploadLabel("");
      setActiveTab("profile");
    } catch {
      setError("Something went wrong while uploading your resume.");
      setUploadState(resumes.length > 0 ? "complete" : "idle");
    }
  };

  const saveManualResume = async (extracted: ExtractedResume) => {
    setSavingManual(true);
    setError("");

    try {
      const response = await fetch("/api/resume/manual", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          extracted,
          resumeId: viewedResume?.source === "manual" ? viewedResume.id : undefined,
        }),
      });

      const data = (await response.json()) as ResumeResponse & { error?: string };

      if (!response.ok) {
        setError(data.error || "Failed to save manual resume.");
        return;
      }

      applyResumeResponse(data);
      setActiveTab("profile");
    } catch {
      setError("Something went wrong while saving your resume.");
    } finally {
      setSavingManual(false);
    }
  };

  const setActiveResume = async (resumeId: string) => {
    const response = await fetch("/api/resume", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activeResumeId: resumeId }),
    });

    const data = (await response.json()) as ResumeResponse & { error?: string };

    if (!response.ok) {
      setError(data.error || "Failed to update active resume.");
      return;
    }

    applyResumeResponse(data);
  };

  const renameResume = async (resumeId: string, label: string) => {
    const response = await fetch("/api/resume", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeId, label }),
    });

    const data = (await response.json()) as ResumeResponse & { error?: string };

    if (!response.ok) {
      setError(data.error || "Failed to rename resume.");
      return;
    }

    applyResumeResponse(data);
  };

  const deleteResume = async (resumeId: string) => {
    const response = await fetch(`/api/resume?resumeId=${resumeId}`, {
      method: "DELETE",
    });

    const data = (await response.json()) as ResumeResponse & { error?: string };

    if (!response.ok) {
      setError(data.error || "Failed to delete resume.");
      return;
    }

    applyResumeResponse(data);

    if (data.resumes.length === 0) {
      setUploadState("idle");
      setActiveTab("upload");
    }
  };

  const tabs: { id: TabId; label: string; icon: typeof Upload }[] = [
    { id: "upload", label: "Upload", icon: Upload },
    { id: "manual", label: "Build Manually", icon: PenLine },
    { id: "resumes", label: "My Resumes", icon: FolderOpen },
    { id: "profile", label: "View Profile", icon: FileText },
  ];

  if (loadingResume) {
    return <Loading message="Loading resume profiles..." className="py-12" />;
  }

  return (
    <div className="space-y-6">
      {showHeading && (
        <div>
          <h2 className="text-xl font-bold text-foreground">Resume Profiles</h2>
          <p className="mt-1 text-sm text-muted">
            Save multiple resumes, switch between them, and choose which one is
            active for proposal generation.
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              type="button"
              size="sm"
              variant={activeTab === tab.id ? "primary" : "outline"}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
              {tab.id === "resumes" && resumes.length > 0 ? (
                <Badge variant="outline">{resumes.length}</Badge>
              ) : null}
            </Button>
          );
        })}
      </div>

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
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) void uploadFile(file);
          event.target.value = "";
        }}
      />

      {activeTab === "upload" && (
        <AnimatePresence mode="wait">
          {uploadState === "processing" ? (
            <Card className="py-16">
              <Loading message="AI is analyzing your resume..." size="lg" />
            </Card>
          ) : (
            <div className="space-y-4">
              <Input
                label="Resume name (optional)"
                placeholder="e.g. Frontend Developer CV"
                value={uploadLabel}
                onChange={(event) => setUploadLabel(event.target.value)}
              />
              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setDragOver(false);
                  const file = event.dataTransfer.files?.[0];
                  if (file) void uploadFile(file);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "glass cursor-pointer rounded-2xl border-2 border-dashed p-12 text-center transition-all duration-300",
                  compact && "p-8",
                  dragOver
                    ? "scale-[1.01] border-primary bg-primary-light/50"
                    : "border-border hover:border-primary/40 hover:bg-primary-light/20"
                )}
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary-light">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-foreground">
                  Drag and drop your resume
                </h3>
                <p className="mb-4 text-sm text-muted">
                  Each upload is saved as a separate resume profile
                </p>
                <div className="flex items-center justify-center gap-3">
                  <Badge variant="outline">PDF</Badge>
                  <Badge variant="outline">DOCX</Badge>
                </div>
              </div>
            </div>
          )}
        </AnimatePresence>
      )}

      {activeTab === "manual" && (
        <ManualResumeForm
          key={viewedResume?.source === "manual" ? viewedResume.id : "new-manual"}
          initialData={
            viewedResume?.source === "manual"
              ? viewedResume.extracted
              : undefined
          }
          loading={savingManual}
          onSave={saveManualResume}
        />
      )}

      {activeTab === "resumes" && (
        <ResumeListPanel
          resumes={resumes}
          activeResumeId={activeResumeId}
          onSetActive={setActiveResume}
          onDelete={deleteResume}
          onRename={renameResume}
          onView={(resumeId) => {
            setViewResumeId(resumeId);
            setActiveTab("profile");
          }}
        />
      )}

      {activeTab === "profile" && (
        <>
          {!viewedResume ? (
            <Card className="p-8 text-center">
              <p className="text-sm text-muted">
                No resume profile yet. Upload a file or build one manually.
              </p>
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {viewedResume.label}
                  </p>
                  <p className="text-sm text-muted">
                    Source:{" "}
                    {viewedResume.source === "manual"
                      ? "Manual profile"
                      : viewedResume.fileName}
                    {viewedResume.id === activeResumeId ? " · Active for proposals" : ""}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {viewedResume.id !== activeResumeId ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => void setActiveResume(viewedResume.id)}
                    >
                      Set Active
                    </Button>
                  ) : null}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-4 w-4" />
                    Upload Another
                  </Button>
                </div>
              </div>
              <ExtractedResumeView resume={viewedResume} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
