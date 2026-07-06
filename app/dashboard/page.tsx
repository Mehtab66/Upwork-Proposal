"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  FolderOpen,
  Code2,
  FileText,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { ResumeCard } from "@/components/dashboard/ResumeCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getFirstName } from "@/lib/utils";

export default function DashboardPage() {
  const { data: session } = useSession();
  const firstName = getFirstName(session?.user?.name);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Create your next winning proposal
          </h1>
          <p className="text-muted mt-1">
            Welcome back, {firstName}. Here&apos;s an overview of your profile.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatsCard
            title="Projects Extracted"
            value={12}
            icon={FolderOpen}
            trend="+3 from last upload"
          />
          <StatsCard
            title="Skills Detected"
            value={24}
            icon={Code2}
            subtitle="Across all categories"
          />
          <StatsCard
            title="Proposals Generated"
            value={8}
            icon={FileText}
            trend="+2 this week"
            className="sm:col-span-2 lg:col-span-1"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ResumeCard />
          </div>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link href="/generate">
                  <div className="glass rounded-xl p-5 border border-border hover:border-primary/30 transition-all cursor-pointer group glass-hover">
                    <div className="h-10 w-10 rounded-xl bg-primary-light flex items-center justify-center mb-3 group-hover:bg-primary transition-colors">
                      <Sparkles className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Generate Proposal
                    </h3>
                    <p className="text-xs text-muted">
                      Paste a job description and create a winning proposal
                    </p>
                  </div>
                </Link>
                <Link href="/create-profile">
                  <div className="glass rounded-xl p-5 border border-border hover:border-primary/30 transition-all cursor-pointer group glass-hover">
                    <div className="h-10 w-10 rounded-xl bg-primary-light flex items-center justify-center mb-3 group-hover:bg-primary transition-colors">
                      <FolderOpen className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">
                      Update Resume
                    </h3>
                    <p className="text-xs text-muted">
                      Re-upload or update your resume profile
                    </p>
                  </div>
                </Link>
              </div>

              <div className="mt-6 flex items-center justify-between p-4 rounded-xl bg-primary-light/50 border border-primary/10">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Ready to apply for a new job?
                  </p>
                  <p className="text-xs text-muted mt-0.5">
                    Upload your resume to unlock personalized proposals
                  </p>
                </div>
                <Link href="/generate">
                  <Button size="sm">
                    Start Now
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
