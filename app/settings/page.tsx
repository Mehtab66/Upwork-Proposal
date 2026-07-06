"use client";

import { motion } from "framer-motion";
import {
  User,
  FileUser,
  CreditCard,
  Shield,
  Upload,
  Check,
} from "lucide-react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";

export default function SettingsPage() {
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
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-primary-light flex items-center justify-center">
                  <User className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle>Profile</CardTitle>
                  <CardDescription>Manage your personal information</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar name="John Doe" size="xl" />
                <div>
                  <Button variant="outline" size="sm">
                    Change Avatar
                  </Button>
                  <p className="text-xs text-muted mt-1">
                    JPG, PNG or GIF. Max 2MB.
                  </p>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="First Name" defaultValue="John" />
                <Input label="Last Name" defaultValue="Doe" />
              </div>
              <Input
                label="Email"
                type="email"
                defaultValue="john.doe@example.com"
              />
              <Input label="Upwork Profile URL" placeholder="https://upwork.com/..." />
              <Button size="sm">Save Changes</Button>
            </CardContent>
          </Card>
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
              <div className="flex items-center justify-between p-4 rounded-xl border border-border">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary-light flex items-center justify-center">
                    <FileUser className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      resume_john_doe.pdf
                    </p>
                    <p className="text-xs text-muted">
                      Uploaded on Jun 15, 2026 · 245 KB
                    </p>
                  </div>
                </div>
                <Badge variant="success">
                  <Check className="h-3 w-3 mr-1" />
                  Active
                </Badge>
              </div>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4" />
                Upload New Resume
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
                      Pro Plan
                    </p>
                    <Badge variant="primary">Active</Badge>
                  </div>
                  <p className="text-xs text-muted mt-0.5">
                    50 proposals/month · Renews Jul 15, 2026
                  </p>
                </div>
                <p className="text-lg font-bold text-foreground">$19/mo</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Change Plan
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
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-primary-light flex items-center justify-center">
                  <Shield className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <CardTitle>Account</CardTitle>
                  <CardDescription>Security and account management</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                placeholder="••••••••"
              />
              <Input
                label="New Password"
                type="password"
                placeholder="••••••••"
              />
              <Input
                label="Confirm New Password"
                type="password"
                placeholder="••••••••"
              />
              <Button size="sm">Update Password</Button>

              <div className="pt-4 mt-4 border-t border-border">
                <h4 className="text-sm font-semibold text-red-500 mb-2">
                  Danger Zone
                </h4>
                <p className="text-xs text-muted mb-3">
                  Permanently delete your account and all associated data.
                </p>
                <Button variant="danger" size="sm">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </DashboardLayout>
  );
}
