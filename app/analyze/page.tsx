"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Search, Sparkles, TriangleAlert } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { MatchedPortfolioPanel } from "@/components/jobs/MatchedPortfolioPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea, Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AILoading } from "@/components/ui/loading";
import type { JobAnalysisResult } from "@/types/job-analysis";
import { JOB_ANALYSIS_STORAGE_KEY } from "@/lib/jobs/session";

export default function AnalyzeJobPage() {
  const [jobDescription, setJobDescription] = useState("");
  const [clientName, setClientName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState<JobAnalysisResult | null>(null);
  const [activeResumeLabel, setActiveResumeLabel] = useState<string | null>(
    null
  );

  const runAnalysis = async () => {
    setError("");
    setLoading(true);
    setAnalysis(null);

    try {
      const response = await fetch("/api/jobs/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription, clientName }),
      });

      const data = (await response.json()) as {
        error?: string;
        analysis?: JobAnalysisResult;
        activeResume?: { label: string } | null;
      };

      if (!response.ok || !data.analysis) {
        setError(data.error || "Failed to analyze job.");
        return;
      }

      setAnalysis(data.analysis);
      setActiveResumeLabel(data.activeResume?.label || null);

      sessionStorage.setItem(
        JOB_ANALYSIS_STORAGE_KEY,
        JSON.stringify({
          jobDescription,
          clientName,
          analysis: data.analysis,
        })
      );
    } catch {
      setError("Something went wrong while analyzing the job.");
    } finally {
      setLoading(false);
    }
  };

  const match = analysis?.advancedMatch;

  return (
    <DashboardLayout title="Job Analysis">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Analyze Upwork job</h2>
          <p className="mt-1 text-sm text-muted">
            Understand client needs, skill gaps, and which portfolio items to
            lead with before writing your proposal.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Job post</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Client name (optional)"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
              <Textarea
                label="Job description"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[280px]"
                placeholder="Paste the full Upwork job description..."
              />
              <Button
                className="w-full"
                size="lg"
                loading={loading}
                disabled={jobDescription.trim().length < 40 || loading}
                onClick={() => void runAnalysis()}
              >
                <Search className="h-4 w-4" />
                Analyze Job
              </Button>
              {error ? (
                <p className="text-sm text-red-600">{error}</p>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analysis results</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <AILoading message="Analyzing job requirements..." />
              ) : !analysis ? (
                <p className="text-sm text-muted">
                  Run analysis to see required skills, client problem, advanced
                  profile match, and portfolio picks.
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{analysis.jobCategory}</Badge>
                    {activeResumeLabel ? (
                      <Badge variant="outline">Resume: {activeResumeLabel}</Badge>
                    ) : null}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {analysis.jobTitle}
                    </p>
                    <p className="mt-2 text-sm text-muted">{analysis.clientProblem}</p>
                  </div>

                  {match ? (
                    <div
                      className={`rounded-xl border p-4 text-sm ${
                        match.isMismatch
                          ? "border-amber-300 bg-amber-50 text-amber-900"
                          : "border-primary/20 bg-primary-light/30"
                      }`}
                    >
                      <div className="mb-2 flex items-center gap-2 font-semibold">
                        {match.isMismatch ? (
                          <TriangleAlert className="h-4 w-4" />
                        ) : null}
                        Advanced match: {match.matchScore}/100 ({match.matchLevel})
                      </div>
                      <p>
                        Your focus: {match.resumeFocus || "—"} · Job focus:{" "}
                        {match.jobFocus || "—"}
                      </p>
                      {match.experienceAlignment ? (
                        <p className="mt-2">{match.experienceAlignment}</p>
                      ) : null}
                      {match.warningMessage ? (
                        <p className="mt-2">{match.warningMessage}</p>
                      ) : null}
                      {match.recommendation ? (
                        <p className="mt-2 font-medium">{match.recommendation}</p>
                      ) : null}
                    </div>
                  ) : null}

                  <SkillList title="Required skills" items={analysis.requiredSkills} />
                  <SkillList
                    title="Nice to have"
                    items={analysis.niceToHaveSkills}
                  />

                  {match ? (
                    <>
                      <SkillList
                        title="Overlapping skills"
                        items={match.overlappingSkills}
                      />
                      <SkillList title="Missing skills" items={match.missingSkills} />
                      <SkillList title="Partial overlap" items={match.partialSkills} />
                    </>
                  ) : null}

                  {analysis.proposalAngle ? (
                    <div className="rounded-xl bg-muted/30 p-4">
                      <p className="text-xs font-semibold uppercase text-muted">
                        Proposal angle
                      </p>
                      <p className="mt-1 text-sm text-foreground">
                        {analysis.proposalAngle}
                      </p>
                    </div>
                  ) : null}

                  <Link href="/generate">
                    <Button className="w-full">
                      <Sparkles className="h-4 w-4" />
                      Generate proposal from this analysis
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {analysis ? (
          <MatchedPortfolioPanel items={analysis.matchedPortfolio} />
        ) : null}
      </div>
    </DashboardLayout>
  );
}

function SkillList({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;

  return (
    <div>
      <p className="mb-2 text-sm font-semibold text-foreground">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Badge key={item} variant="outline">
            {item}
          </Badge>
        ))}
      </div>
    </div>
  );
}
