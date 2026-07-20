"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  RefreshCw,
  Sparkles,
  Check,
  AlertCircle,
  Lightbulb,
  Target,
  MessageCircleQuestion,
  Pencil,
  Save,
  Bold,
  TriangleAlert,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { CoverLetterEditor } from "@/components/proposal/CoverLetterEditor";
import { CoverLetterPreview } from "@/components/proposal/CoverLetterPreview";
import { MatchedPortfolioPanel } from "@/components/jobs/MatchedPortfolioPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea, Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AILoading } from "@/components/ui/loading";
import {
  normalizeBoldPhrases,
  plainTextForUpwork,
  sanitizeCoverLetter,
} from "@/lib/proposal/format-cover-letter";
import { PROPOSAL_TEMPLATES } from "@/lib/proposal/templates";
import { readStoredJobAnalysis } from "@/lib/jobs/session";
import type { MatchedPortfolioItem } from "@/types/job-analysis";
import type { ResumeProfile, ResumeResponse } from "@/types/resume";
import type {
  ProfileMatchAnalysis,
  ProposalMode,
  StoredProposal,
} from "@/types/proposal";

type GenerateState = "idle" | "generating" | "complete";

interface ProposalAnalysis {
  clientNeedsSummary: string;
  matchedHighlights: string[];
  suggestedQuestions: string[];
  boldPhrases: string[];
  profileMatch: ProfileMatchAnalysis | null;
}

export default function GeneratePage() {
  const { data: session } = useSession();
  const [mode, setMode] = useState<ProposalMode>("resume");
  const [jobDescription, setJobDescription] = useState("");
  const [clientName, setClientName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [genericHeadline, setGenericHeadline] = useState("");
  const [genericSkills, setGenericSkills] = useState("");
  const [genericBackground, setGenericBackground] = useState("");
  const [generateState, setGenerateState] = useState<GenerateState>("idle");
  const [proposal, setProposal] = useState("");
  const [draftProposal, setDraftProposal] = useState("");
  const [boldPhrases, setBoldPhrases] = useState<string[]>([]);
  const [draftBoldPhrases, setDraftBoldPhrases] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProposal, setCurrentProposal] = useState<StoredProposal | null>(
    null
  );
  const [analysis, setAnalysis] = useState<ProposalAnalysis | null>(null);
  const [activeResume, setActiveResume] = useState<ResumeProfile | null>(null);
  const [usageRemaining, setUsageRemaining] = useState<number | null>(null);
  const [usageLimit, setUsageLimit] = useState(3);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copied, setCopied] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingEdit, setSavingEdit] = useState(false);
  const [highlighting, setHighlighting] = useState(false);
  const [templateId, setTemplateId] = useState(PROPOSAL_TEMPLATES[0].id);
  const [jobAnalysisAngle, setJobAnalysisAngle] = useState<string | null>(null);
  const [matchedPortfolio, setMatchedPortfolio] = useState<
    MatchedPortfolioItem[]
  >([]);
  const [fromJobAnalysis, setFromJobAnalysis] = useState(false);

  useEffect(() => {
    const stored = readStoredJobAnalysis();
    if (!stored?.analysis) return;

    setJobDescription(stored.jobDescription);
    if (stored.clientName) setClientName(stored.clientName);
    setJobAnalysisAngle(stored.analysis.proposalAngle || null);
    setMatchedPortfolio(stored.analysis.matchedPortfolio || []);
    setFromJobAnalysis(true);
  }, []);

  useEffect(() => {
    async function loadContext() {
      try {
        const [resumeRes, proposalsRes] = await Promise.all([
          fetch("/api/resume"),
          fetch("/api/proposals"),
        ]);

        const resumeData = (await resumeRes.json()) as ResumeResponse;
        const proposalsData = (await proposalsRes.json()) as {
          usage?: { remaining: number; monthlyLimit: number };
        };

        if (resumeRes.ok) {
          setActiveResume(resumeData.resume || null);
        }

        if (proposalsRes.ok && proposalsData.usage) {
          setUsageRemaining(proposalsData.usage.remaining);
          setUsageLimit(proposalsData.usage.monthlyLimit);
        }
      } finally {
        setLoadingProfile(false);
      }
    }

    void loadContext();
  }, []);

  const runGenerate = async (regenerateProposalId?: string) => {
    if (!jobDescription.trim()) {
      return;
    }

    setError("");
    setSuccess("");
    setGenerateState("generating");
    setProposal("");
    setDraftProposal("");
    setAnalysis(null);
    setIsEditing(false);

    try {
      const response = await fetch("/api/proposals/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription,
          clientName: clientName.trim() || undefined,
          jobTitle: jobTitle.trim() || undefined,
          regenerateProposalId,
          mode,
          genericProfile:
            mode === "generic"
              ? {
                  freelancerName: session?.user?.name || "Freelancer",
                  professionalHeadline: genericHeadline,
                  skillsSummary: genericSkills,
                  experienceSummary: genericBackground,
                }
              : undefined,
          templateId,
          jobAnalysisContext:
            jobAnalysisAngle || matchedPortfolio.length
              ? {
                  proposalAngle: jobAnalysisAngle || undefined,
                  matchedPortfolio: matchedPortfolio.map((item) => ({
                    name: item.name,
                    reason: item.reason,
                  })),
                }
              : undefined,
        }),
      });

      const data = (await response.json()) as {
        error?: string;
        proposal?: StoredProposal;
        analysis?: ProposalAnalysis;
        usage?: { remaining: number; monthlyLimit: number };
      };

      if (!response.ok || !data.proposal) {
        setError(data.error || "Failed to generate proposal.");
        setGenerateState(currentProposal ? "complete" : "idle");
        return;
      }

      const letter = sanitizeCoverLetter(data.proposal.coverLetter);
      const phrases = normalizeBoldPhrases(
        letter,
        data.proposal.boldPhrases?.length
          ? data.proposal.boldPhrases
          : data.analysis?.boldPhrases || []
      );

      setProposal(letter);
      setDraftProposal(letter);
      setBoldPhrases(phrases);
      setDraftBoldPhrases(phrases);
      setCurrentProposal({
        ...data.proposal,
        coverLetter: letter,
        boldPhrases: phrases,
      });
      setAnalysis(data.analysis || null);
      setGenerateState("complete");

      if (data.usage) {
        setUsageRemaining(data.usage.remaining);
        setUsageLimit(data.usage.monthlyLimit);
      }
    } catch {
      setError("Something went wrong while generating your proposal.");
      setGenerateState(currentProposal ? "complete" : "idle");
    }
  };

  const handleCopy = async () => {
    const text = isEditing ? draftProposal : proposal;
    await navigator.clipboard.writeText(plainTextForUpwork(text));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveEdits = async () => {
    if (!currentProposal) {
      return;
    }

    setSavingEdit(true);
    setError("");
    setSuccess("");

    try {
      const letter = sanitizeCoverLetter(draftProposal);
      const phrases = normalizeBoldPhrases(letter, draftBoldPhrases);

      const response = await fetch(`/api/proposals/${currentProposal.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coverLetter: letter,
          boldPhrases: phrases,
        }),
      });

      const data = (await response.json()) as {
        error?: string;
        proposal?: StoredProposal;
      };

      if (!response.ok || !data.proposal) {
        setError(data.error || "Failed to save edits.");
        return;
      }

      const savedLetter = sanitizeCoverLetter(data.proposal.coverLetter);
      const savedPhrases = normalizeBoldPhrases(
        savedLetter,
        data.proposal.boldPhrases || phrases
      );

      setProposal(savedLetter);
      setDraftProposal(savedLetter);
      setBoldPhrases(savedPhrases);
      setDraftBoldPhrases(savedPhrases);
      setCurrentProposal({
        ...data.proposal,
        coverLetter: savedLetter,
        boldPhrases: savedPhrases,
      });
      setIsEditing(false);
      setSuccess("Proposal saved.");
    } catch {
      setError("Something went wrong while saving.");
    } finally {
      setSavingEdit(false);
    }
  };

  const highlightKeyPoints = async () => {
    const source = sanitizeCoverLetter(isEditing ? draftProposal : proposal);

    if (!source.trim()) {
      return;
    }

    setHighlighting(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/proposals/highlight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coverLetter: source }),
      });

      const data = (await response.json()) as {
        error?: string;
        coverLetter?: string;
        boldPhrases?: string[];
      };

      if (!response.ok || !data.boldPhrases) {
        setError(data.error || "Failed to highlight key points.");
        return;
      }

      const letter = sanitizeCoverLetter(data.coverLetter || source);
      const phrases = normalizeBoldPhrases(letter, data.boldPhrases);

      setProposal(letter);
      setDraftProposal(letter);
      setBoldPhrases(phrases);
      setDraftBoldPhrases(phrases);

      if (currentProposal) {
        const saveRes = await fetch(`/api/proposals/${currentProposal.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            coverLetter: letter,
            boldPhrases: phrases,
          }),
        });

        if (saveRes.ok) {
          const saved = (await saveRes.json()) as { proposal?: StoredProposal };
          if (saved.proposal) {
            setCurrentProposal(saved.proposal);
          }
        }
      }

      setSuccess("Key points highlighted in preview.");
    } catch {
      setError("Something went wrong while highlighting.");
    } finally {
      setHighlighting(false);
    }
  };

  const markAsSent = async () => {
    if (!currentProposal) {
      return;
    }

    const response = await fetch(`/api/proposals/${currentProposal.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "sent" }),
    });

    if (response.ok) {
      const data = (await response.json()) as { proposal?: StoredProposal };
      if (data.proposal) {
        setCurrentProposal(data.proposal);
      }
    }
  };

  const genericReady =
    genericHeadline.trim() ||
    genericSkills.trim() ||
    genericBackground.trim();

  const canGenerate =
    jobDescription.trim().length >= 40 &&
    generateState !== "generating" &&
    (usageRemaining === null || usageRemaining > 0 || Boolean(currentProposal)) &&
    (mode === "generic" ? genericReady : Boolean(activeResume));

  const profileMatch = analysis?.profileMatch || currentProposal?.profileMatch;

  return (
    <DashboardLayout title="Generate Proposal">
      <div className="mx-auto max-w-7xl space-y-4">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            size="sm"
            variant={mode === "resume" ? "primary" : "outline"}
            onClick={() => setMode("resume")}
          >
            Use Active Resume
          </Button>
          <Button
            type="button"
            size="sm"
            variant={mode === "generic" ? "primary" : "outline"}
            onClick={() => setMode("generic")}
          >
            Generic Proposal (No CV)
          </Button>
        </div>

        {!loadingProfile && mode === "resume" && !activeResume ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span>
                No active resume found. Upload one or switch to Generic mode.
              </span>
              <Link href="/create-profile">
                <Button size="sm" variant="secondary">
                  Set Up Resume
                </Button>
              </Link>
            </div>
          </div>
        ) : null}

        {activeResume && mode === "resume" ? (
          <Badge variant="outline">Active resume: {activeResume.label}</Badge>
        ) : null}

        {fromJobAnalysis ? (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/20 bg-primary-light/30 px-4 py-3 text-sm">
            <span>
              Job analysis loaded — portfolio picks and proposal angle will guide
              generation.
            </span>
            <Link href="/analyze">
              <Button size="sm" variant="outline">
                Re-analyze
              </Button>
            </Link>
          </div>
        ) : (
          <div className="text-sm text-muted">
            Tip:{" "}
            <Link href="/analyze" className="font-medium text-primary hover:underline">
              Analyze the job first
            </Link>{" "}
            for advanced matching and portfolio picks.
          </div>
        )}

        {usageRemaining !== null ? (
          <Badge variant="primary">
            {usageRemaining} of {usageLimit} proposals left this month
          </Badge>
        ) : null}

        {profileMatch?.isMismatch && profileMatch.warningMessage ? (
          <div className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <div className="flex items-start gap-2">
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <p className="font-semibold">Profile mismatch detected</p>
                <p className="mt-1">{profileMatch.warningMessage}</p>
                {profileMatch.recommendation ? (
                  <p className="mt-2 text-amber-800">{profileMatch.recommendation}</p>
                ) : null}
                <p className="mt-2 text-xs text-amber-800/90">
                  Match score: {profileMatch.matchScore}/100 · Your focus:{" "}
                  {profileMatch.resumeFocus || "—"} · Job focus:{" "}
                  {profileMatch.jobFocus || "—"}
                </p>
              </div>
            </div>
          </div>
        ) : null}

        {error ? (
          <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        ) : null}

        {success ? (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        ) : null}

        <div className="grid min-h-[640px] gap-6 lg:grid-cols-2">
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Job Details</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-4 overflow-auto">
              {mode === "generic" ? (
                <>
                  <Input
                    label="Professional headline"
                    placeholder="e.g. Video Editor & Motion Designer"
                    value={genericHeadline}
                    onChange={(e) => setGenericHeadline(e.target.value)}
                  />
                  <Textarea
                    label="Skills summary"
                    placeholder="Premiere Pro, After Effects, color grading, short-form ads..."
                    value={genericSkills}
                    onChange={(e) => setGenericSkills(e.target.value)}
                    className="min-h-[100px]"
                  />
                  <Textarea
                    label="Background & results"
                    placeholder="Briefly describe experience and outcomes relevant to this job..."
                    value={genericBackground}
                    onChange={(e) => setGenericBackground(e.target.value)}
                    className="min-h-[120px]"
                  />
                </>
              ) : null}

              <Input
                label="Client name (optional)"
                placeholder="Use if mentioned in the job post"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
              <Input
                label="Job title (optional)"
                placeholder="e.g. Full-Stack Developer for SaaS Dashboard"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
              />
              <div>
                <label className="mb-2 block text-sm font-medium text-foreground">
                  Proposal template
                </label>
                <select
                  value={templateId}
                  onChange={(e) => setTemplateId(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {PROPOSAL_TEMPLATES.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name} — {template.description}
                    </option>
                  ))}
                </select>
              </div>
              <Textarea
                label="Job description"
                placeholder="Paste the full Upwork job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[220px] flex-1"
              />
              <p className="text-xs text-muted">
                Starts with Hi, then Hook → Relevance → Proof → CTA with at
                least 2 questions inside the letter.
              </p>
              <Button
                onClick={() => void runGenerate()}
                disabled={!canGenerate}
                loading={generateState === "generating"}
                className="w-full"
                size="lg"
              >
                <Sparkles className="h-4 w-4" />
                Generate Winning Proposal
              </Button>
            </CardContent>
          </Card>

          <Card className="flex flex-col">
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle>Cover Letter</CardTitle>
                {generateState === "complete" && currentProposal ? (
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="capitalize">
                      {currentProposal.status}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsEditing((value) => !value);
                        setDraftProposal(proposal);
                        setDraftBoldPhrases(boldPhrases);
                      }}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                      {isEditing ? "Preview" : "Edit"}
                    </Button>
                    {isEditing ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => void highlightKeyPoints()}
                          loading={highlighting}
                        >
                          <Bold className="h-3.5 w-3.5" />
                          AI Bold
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => void saveEdits()}
                          loading={savingEdit}
                        >
                          <Save className="h-3.5 w-3.5" />
                          Save
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => void highlightKeyPoints()}
                          loading={highlighting}
                        >
                          <Bold className="h-3.5 w-3.5" />
                          Bold Key Points
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => void runGenerate(currentProposal.id)}
                        >
                          <RefreshCw className="h-3.5 w-3.5" />
                          Regenerate
                        </Button>
                      </>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => void markAsSent()}>
                      Mark Sent
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => void handleCopy()}>
                      {copied ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      {copied ? "Copied!" : "Copy Plain Text"}
                    </Button>
                  </div>
                ) : null}
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              <AnimatePresence mode="wait">
                {generateState === "idle" && (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex min-h-[300px] flex-col items-center justify-center text-center"
                  >
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light">
                      <Sparkles className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="mb-2 text-base font-semibold text-foreground">
                      Ready when you are
                    </h3>
                    <p className="max-w-xs text-sm text-muted">
                      {mode === "generic"
                        ? "Describe your background manually and generate a tailored Upwork cover letter."
                        : "Paste a job post and generate from your active resume profile."}
                    </p>
                  </motion.div>
                )}

                {generateState === "generating" && (
                  <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <AILoading message="Crafting your Upwork cover letter..." />
                  </motion.div>
                )}

                {generateState === "complete" && (
                  <motion.div
                    key="proposal"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    {isEditing ? (
                      <CoverLetterEditor
                        value={draftProposal}
                        boldPhrases={draftBoldPhrases}
                        onChange={setDraftProposal}
                        onBoldPhrasesChange={(phrases) => {
                          setDraftBoldPhrases(phrases);
                          setBoldPhrases(phrases);
                        }}
                      />
                    ) : (
                      <CoverLetterPreview
                        text={proposal}
                        boldPhrases={boldPhrases}
                        className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground"
                      />
                    )}

                    {!isEditing && analysis ? (
                      <div className="space-y-4 border-t border-border pt-4">
                        {analysis.clientNeedsSummary ? (
                          <div className="rounded-xl bg-primary-light/40 p-4">
                            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                              <Target className="h-4 w-4 text-primary" />
                              Job analysis
                            </div>
                            <p className="text-sm text-muted">
                              {analysis.clientNeedsSummary}
                            </p>
                          </div>
                        ) : null}

                        {analysis.matchedHighlights.length > 0 ? (
                          <div>
                            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                              <Lightbulb className="h-4 w-4 text-primary" />
                              Why you fit
                            </div>
                            <ul className="space-y-1 text-sm text-muted">
                              {analysis.matchedHighlights.map((item) => (
                                <li key={item}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                        ) : null}

                        {analysis.suggestedQuestions.length > 0 ? (
                          <div>
                            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground">
                              <MessageCircleQuestion className="h-4 w-4 text-primary" />
                              Questions in your pitch
                            </div>
                            <ul className="space-y-1 text-sm text-muted">
                              {analysis.suggestedQuestions.map((item) => (
                                <li key={item}>• {item}</li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                      </div>
                    ) : null}
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>

        {matchedPortfolio.length > 0 ? (
          <MatchedPortfolioPanel items={matchedPortfolio} />
        ) : null}
      </div>
    </DashboardLayout>
  );
}
