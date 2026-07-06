"use client";

import { motion } from "framer-motion";
import { CreditCard } from "lucide-react";
import { useSession } from "next-auth/react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loading } from "@/components/ui/loading";
import { AccountSection } from "@/components/settings/AccountSection";
import { ProfileSection } from "@/components/settings/ProfileSection";
import { ResumeProfileManager } from "@/components/resume/ResumeProfileManager";

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
        <motion.section
          id="profile"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ProfileSection />
        </motion.section>

        <motion.section
          id="resume"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Resume</CardTitle>
              <CardDescription>
                Upload your resume and let AI extract your skills and experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResumeProfileManager compact showHeading={false} />
            </CardContent>
          </Card>
        </motion.section>

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
