"use client";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { ResumeProfileManager } from "@/components/resume/ResumeProfileManager";

export default function CreateProfilePage() {
  return (
    <DashboardLayout title="Resume Profile">
      <div className="max-w-4xl mx-auto">
        <ResumeProfileManager />
      </div>
    </DashboardLayout>
  );
}
