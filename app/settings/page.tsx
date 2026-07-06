"use client";

import { motion } from "framer-motion";
import {
  FileUser,
  CreditCard,
  Upload,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loading } from "@/components/ui/loading";
import { AccountSection } from "@/components/settings/AccountSection";
import { ProfileSection } from "@/components/settings/ProfileSection";

export default function SettingsPage() {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <DashboardLayout title="Settings">
        <Loading message="Loading your profile..." className="py-24" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Settings">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Profile Section */}
        <motion.section
          id="profile"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ProfileSection />
        </motion.section>

        {/* Resume Section */}
        <motion.section
          id="resume"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-primary-light flex items-center justify-center">
                  <FileUser className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle>Resume</CardTitle>
                  <CardDescription>Manage your uploaded resume</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-8 text-center">
                <div className="h-12 w-12 rounded-xl bg-primary-light flex items-center justify-center mb-3">
                  <FileUser className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  No resume uploaded yet
                </p>
                <p className="text-xs text-muted mt-1 max-w-sm">
                  Upload your resume to personalize proposals with your skills and experience.
                </p>
              </div>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4" />
                Upload Resume
              </Button>
            </CardContent>
          </Card>
        </motion.section>

        {/* Subscription Section */}
        <motion.section
          id="subscription"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-primary-light flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle>Subscription</CardTitle>
                  <CardDescription>Manage your plan and billing</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-primary-light/50 border border-primary/20">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground">
                      Free Plan
                    </p>
                    <Badge variant="primary">Active</Badge>
                  </div>
                  <p className="text-xs text-muted mt-0.5">
                    3 proposals/month
                  </p>
                </div>
                <p className="text-lg font-bold text-foreground">$0/mo</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Upgrade Plan
                </Button>
                <Button variant="ghost" size="sm">
                  Billing History
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Account Section */}
        <motion.section
          id="account"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <AccountSection />
        </motion.section>
      </div>
    </DashboardLayout>
  );
}
