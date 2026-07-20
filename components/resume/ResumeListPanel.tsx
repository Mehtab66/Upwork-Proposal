"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Eye,
  FileText,
  PenLine,
  Star,
  Trash2,
  Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { calculateProfileCompletion, type ResumeProfile } from "@/types/resume";

interface ResumeListPanelProps {
  resumes: ResumeProfile[];
  activeResumeId: string | null;
  loading?: boolean;
  onSetActive: (resumeId: string) => Promise<void>;
  onDelete: (resumeId: string) => Promise<void>;
  onRename: (resumeId: string, label: string) => Promise<void>;
  onView: (resumeId: string) => void;
}

function formatUploadedAt(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function ResumeListPanel({
  resumes,
  activeResumeId,
  loading = false,
  onSetActive,
  onDelete,
  onRename,
  onView,
}: ResumeListPanelProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftLabel, setDraftLabel] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  if (resumes.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light">
          <FileText className="h-7 w-7 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">No resumes yet</h3>
        <p className="mt-2 text-sm text-muted">
          Upload a PDF/DOCX file or build a resume manually to get started.
        </p>
      </Card>
    );
  }

  const startRename = (resume: ResumeProfile) => {
    setEditingId(resume.id);
    setDraftLabel(resume.label);
  };

  const saveRename = async (resumeId: string) => {
    if (!draftLabel.trim()) {
      return;
    }

    setBusyId(resumeId);
    try {
      await onRename(resumeId, draftLabel.trim());
      setEditingId(null);
      setDraftLabel("");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-foreground">My Resumes</h3>
          <p className="text-sm text-muted">
            {resumes.length} resume{resumes.length === 1 ? "" : "s"} saved. The
            active resume is used for proposals.
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        {resumes.map((resume) => {
          const isActive = resume.id === activeResumeId;
          const completion = calculateProfileCompletion(resume.extracted);
          const SourceIcon = resume.source === "manual" ? PenLine : Upload;

          return (
            <Card key={resume.id} className={isActive ? "border-primary/40" : ""}>
              <CardContent className="p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light">
                        <SourceIcon className="h-5 w-5 text-primary" />
                      </div>
                      {editingId === resume.id ? (
                        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row">
                          <Input
                            value={draftLabel}
                            onChange={(event) => setDraftLabel(event.target.value)}
                            disabled={loading || busyId === resume.id}
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              disabled={loading || busyId === resume.id}
                              onClick={() => void saveRename(resume.id)}
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={loading || busyId === resume.id}
                              onClick={() => {
                                setEditingId(null);
                                setDraftLabel("");
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-foreground">
                              {resume.label}
                            </p>
                            <p className="truncate text-xs text-muted">
                              {resume.source === "manual"
                                ? "Built manually"
                                : resume.fileName}{" "}
                              · {formatUploadedAt(resume.uploadedAt)}
                            </p>
                          </div>
                          {isActive ? (
                            <Badge variant="success">Active</Badge>
                          ) : null}
                        </>
                      )}
                    </div>

                    <div>
                      <div className="mb-2 flex justify-between text-xs">
                        <span className="text-muted">Profile completion</span>
                        <span className="font-semibold text-primary">
                          {completion}%
                        </span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-border">
                        <div
                          className="h-full rounded-full bg-primary transition-all duration-500"
                          style={{ width: `${completion}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={loading || busyId === resume.id}
                      onClick={() => onView(resume.id)}
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </Button>
                    {!isActive ? (
                      <Button
                        size="sm"
                        variant="secondary"
                        disabled={loading || busyId === resume.id}
                        onClick={async () => {
                          setBusyId(resume.id);
                          try {
                            await onSetActive(resume.id);
                          } finally {
                            setBusyId(null);
                          }
                        }}
                      >
                        <Star className="h-4 w-4" />
                        Set Active
                      </Button>
                    ) : (
                      <Button size="sm" variant="secondary" disabled>
                        <CheckCircle2 className="h-4 w-4" />
                        In Use
                      </Button>
                    )}
                    {editingId !== resume.id ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={loading || busyId === resume.id}
                        onClick={() => startRename(resume)}
                      >
                        Rename
                      </Button>
                    ) : null}
                    <Button
                      size="sm"
                      variant="danger"
                      disabled={loading || busyId === resume.id}
                      onClick={async () => {
                        if (
                          !window.confirm(
                            `Delete "${resume.label}"? This cannot be undone.`
                          )
                        ) {
                          return;
                        }

                        setBusyId(resume.id);
                        try {
                          await onDelete(resume.id);
                        } finally {
                          setBusyId(null);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
