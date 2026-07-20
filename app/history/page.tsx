"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, Search } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProposalCard } from "@/components/dashboard/ProposalCard";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { plainTextForUpwork } from "@/lib/proposal/format-cover-letter";
import type { StoredProposal } from "@/types/proposal";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export default function HistoryPage() {
  const [search, setSearch] = useState("");
  const [proposals, setProposals] = useState<StoredProposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewProposal, setViewProposal] = useState<StoredProposal | null>(null);

  const loadProposals = async () => {
    try {
      const response = await fetch("/api/proposals");
      const data = (await response.json()) as {
        proposals?: StoredProposal[];
      };

      if (response.ok) {
        setProposals(data.proposals || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProposals();
  }, []);

  const filtered = proposals.filter(
    (proposal) =>
      proposal.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
      proposal.jobCategory.toLowerCase().includes(search.toLowerCase()) ||
      proposal.coverLetter.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    const response = await fetch(`/api/proposals/${id}`, { method: "DELETE" });

    if (response.ok) {
      setProposals((prev) => prev.filter((proposal) => proposal.id !== id));
      if (viewProposal?.id === id) {
        setViewProposal(null);
      }
    }
  };

  const handleCopy = async (content: string) => {
    await navigator.clipboard.writeText(plainTextForUpwork(content));
  };

  if (loading) {
    return (
      <DashboardLayout title="Proposal History">
        <Loading message="Loading proposals..." className="py-24" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Proposal History">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-bold text-foreground">Your Proposals</h2>
            <p className="mt-0.5 text-sm text-muted">
              {proposals.length} proposal{proposals.length === 1 ? "" : "s"} saved
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search proposals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-xl border border-border bg-card pl-9 pr-4 text-sm outline-none transition-all focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-12 text-center"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-2 text-base font-semibold text-foreground">
              {search ? "No proposals found" : "No proposals yet"}
            </h3>
            <p className="mx-auto mb-4 max-w-xs text-sm text-muted">
              {search
                ? "Try a different search term."
                : "Generate your first proposal to see it here."}
            </p>
            {!search ? (
              <Link href="/generate">
                <Button size="sm">Generate Proposal</Button>
              </Link>
            ) : null}
          </motion.div>
        ) : (
          <div className="space-y-3">
            {filtered.map((proposal, i) => (
              <motion.div
                key={proposal.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <ProposalCard
                  title={proposal.jobTitle}
                  jobType={proposal.jobCategory}
                  date={formatDate(proposal.createdAt)}
                  status={proposal.status}
                  onView={() => setViewProposal(proposal)}
                  onCopy={() => void handleCopy(proposal.coverLetter)}
                  onDelete={() => void handleDelete(proposal.id)}
                />
              </motion.div>
            ))}
          </div>
        )}

        <Modal
          open={!!viewProposal}
          onClose={() => setViewProposal(null)}
          title={viewProposal?.jobTitle}
          description={`${viewProposal?.jobCategory} · ${viewProposal ? formatDate(viewProposal.createdAt) : ""}`}
          size="lg"
        >
          {viewProposal && (
            <div>
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-muted">
                {viewProposal.coverLetter}
              </pre>
              <div className="mt-6 flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => void handleCopy(viewProposal.coverLetter)}
                >
                  Copy Proposal
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewProposal(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
}
