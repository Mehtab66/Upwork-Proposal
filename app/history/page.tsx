"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Search } from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ProposalCard } from "@/components/dashboard/ProposalCard";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

const mockProposals = [
  {
    id: 1,
    title: "Full-Stack Developer for SaaS Dashboard",
    jobType: "Web Development",
    date: "Jun 20, 2026",
    status: "sent" as const,
    content:
      "Hi there, I came across your job posting for a Full-Stack Developer...",
  },
  {
    id: 2,
    title: "React Native Mobile App Developer",
    jobType: "Mobile Development",
    date: "Jun 18, 2026",
    status: "accepted" as const,
    content: "Hello! I'm excited about your mobile app project...",
  },
  {
    id: 3,
    title: "WordPress Theme Customization",
    jobType: "WordPress",
    date: "Jun 15, 2026",
    status: "draft" as const,
    content: "Dear client, I have extensive experience with WordPress...",
  },
  {
    id: 4,
    title: "Python Data Scraping Script",
    jobType: "Data Science",
    date: "Jun 12, 2026",
    status: "sent" as const,
    content: "Hi, I'd love to help with your data scraping project...",
  },
  {
    id: 5,
    title: "UI/UX Design for E-Commerce",
    jobType: "Design",
    date: "Jun 8, 2026",
    status: "rejected" as const,
    content: "Hello! Your e-commerce design project caught my attention...",
  },
];

export default function HistoryPage() {
  const [search, setSearch] = useState("");
  const [proposals, setProposals] = useState(mockProposals);
  const [viewProposal, setViewProposal] = useState<
    (typeof mockProposals)[0] | null
  >(null);

  const filtered = proposals.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.jobType.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: number) => {
    setProposals((prev) => prev.filter((p) => p.id !== id));
  };

  const handleCopy = async (content: string) => {
    await navigator.clipboard.writeText(content);
  };

  return (
    <DashboardLayout title="Proposal History">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              Your Proposals
            </h2>
            <p className="text-sm text-muted mt-0.5">
              {proposals.length} proposals total
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
            <input
              type="text"
              placeholder="Search proposals..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full rounded-xl border border-border bg-card pl-9 pr-4 text-sm outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-12 text-center"
          >
            <div className="h-16 w-16 rounded-2xl bg-primary-light flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-2">
              {search ? "No proposals found" : "No proposals yet"}
            </h3>
            <p className="text-sm text-muted max-w-xs mx-auto">
              {search
                ? "Try a different search term."
                : "Generate your first proposal to see it here."}
            </p>
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
                  title={proposal.title}
                  jobType={proposal.jobType}
                  date={proposal.date}
                  status={proposal.status}
                  onView={() => setViewProposal(proposal)}
                  onCopy={() => handleCopy(proposal.content)}
                  onDelete={() => handleDelete(proposal.id)}
                />
              </motion.div>
            ))}
          </div>
        )}

        <Modal
          open={!!viewProposal}
          onClose={() => setViewProposal(null)}
          title={viewProposal?.title}
          description={`${viewProposal?.jobType} · ${viewProposal?.date}`}
          size="lg"
        >
          {viewProposal && (
            <div>
              <pre className="whitespace-pre-wrap font-sans text-sm text-muted leading-relaxed">
                {viewProposal.content}
              </pre>
              <div className="flex gap-2 mt-6">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleCopy(viewProposal.content)}
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
