"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, RefreshCw, Sparkles, Check } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AILoading } from "@/components/ui/loading";

const sampleProposal = `Hi there,

I came across your job posting for a Full-Stack Developer to build a SaaS dashboard, and I'm excited about the opportunity. With over 7 years of experience in React, Node.js, and TypeScript, I've built similar platforms that serve thousands of users.

In my recent project at TechCorp, I led the development of an analytics dashboard using Next.js and PostgreSQL, achieving 99.9% uptime and reducing load times by 40%. I also built an e-commerce platform handling 10k+ products with Stripe integration.

I'm particularly drawn to your emphasis on real-time data visualization — this aligns perfectly with my SaaS Dashboard project where I implemented live charts using D3.js and WebSockets.

I'd love to discuss your requirements in more detail. I'm available to start immediately and can commit 30+ hours per week.

Looking forward to hearing from you!

Best regards,
John Doe`;

type GenerateState = "idle" | "generating" | "complete";

export default function GeneratePage() {
  const [jobDescription, setJobDescription] = useState("");
  const [generateState, setGenerateState] = useState<GenerateState>("idle");
  const [proposal, setProposal] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = () => {
    if (!jobDescription.trim()) return;
    setGenerateState("generating");
    setProposal("");
    setTimeout(() => {
      setProposal(sampleProposal);
      setGenerateState("complete");
    }, 3000);
  };

  const handleRegenerate = () => {
    setGenerateState("generating");
    setTimeout(() => {
      setProposal(sampleProposal);
      setGenerateState("complete");
    }, 2500);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(proposal);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLayout title="Generate Proposal">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-6 h-[calc(100vh-8rem)]">
          {/* Left - Input */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col flex-1 gap-4">
              <Textarea
                placeholder="Paste the Upwork job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="flex-1 min-h-[300px] lg:min-h-0"
              />
              <Button
                onClick={handleGenerate}
                disabled={!jobDescription.trim() || generateState === "generating"}
                loading={generateState === "generating"}
                className="w-full"
                size="lg"
              >
                <Sparkles className="h-4 w-4" />
                Generate Proposal
              </Button>
            </CardContent>
          </Card>

          {/* Right - Preview */}
          <Card className="flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Generated Proposal</CardTitle>
                {generateState === "complete" && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRegenerate}
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Regenerate
                    </Button>
                    <Button variant="secondary" size="sm" onClick={handleCopy}>
                      {copied ? (
                        <Check className="h-3.5 w-3.5" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                  </div>
                )}
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
                    className="flex flex-col items-center justify-center h-full min-h-[300px] text-center"
                  >
                    <div className="h-16 w-16 rounded-2xl bg-primary-light flex items-center justify-center mb-4">
                      <Sparkles className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-base font-semibold text-foreground mb-2">
                      No proposal yet
                    </h3>
                    <p className="text-sm text-muted max-w-xs">
                      Paste a job description and click Generate to create your
                      personalized proposal.
                    </p>
                  </motion.div>
                )}

                {generateState === "generating" && (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <AILoading />
                  </motion.div>
                )}

                {generateState === "complete" && (
                  <motion.div
                    key="proposal"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-sm text-foreground leading-relaxed bg-transparent p-0 m-0 border-0">
                        {proposal}
                      </pre>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
