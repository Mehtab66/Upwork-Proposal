"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Loading } from "@/components/ui/loading";
import { splitFullName } from "@/lib/utils";

const readOnlyClassName =
  "bg-muted/30 cursor-not-allowed text-muted focus:ring-0 focus:border-border";

export function ProfileSection() {
  const { data: session } = useSession();
  const [upworkProfileUrl, setUpworkProfileUrl] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const displayName = session?.user?.name || "User";
  const email = session?.user?.email || "";
  const image = session?.user?.image || undefined;
  const { firstName, lastName } = splitFullName(session?.user?.name);

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch("/api/account/profile");
        const data = (await response.json()) as {
          upworkProfileUrl?: string;
          error?: string;
        };

        if (response.ok) {
          setUpworkProfileUrl(data.upworkProfileUrl || "");
        }
      } catch {
        setError("Failed to load profile.");
      } finally {
        setLoadingProfile(false);
      }
    }

    void loadProfile();
  }, []);

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const response = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ upworkProfileUrl }),
      });

      const data = (await response.json()) as {
        error?: string;
        message?: string;
        upworkProfileUrl?: string;
      };

      if (!response.ok) {
        setError(data.error || "Failed to save Upwork profile URL.");
        return;
      }

      setUpworkProfileUrl(data.upworkProfileUrl || "");
      setSuccess(data.message || "Upwork profile URL saved successfully.");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-primary-light flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Your account details are read-only. You can add or update your Upwork profile link.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar name={displayName} src={image} size="xl" />
          <div>
            <p className="text-sm font-medium text-foreground">{displayName}</p>
            <p className="text-xs text-muted">{email}</p>
            {image && (
              <p className="text-xs text-muted mt-1">
                Profile photo synced from your sign-in provider
              </p>
            )}
          </div>
        </div>

        {loadingProfile ? (
          <Loading message="Loading profile..." size="sm" className="py-8" />
        ) : (
          <form className="space-y-4" onSubmit={handleSave}>
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}
            {success && (
              <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {success}
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={firstName}
                readOnly
                className={readOnlyClassName}
              />
              <Input
                label="Last Name"
                value={lastName}
                readOnly
                className={readOnlyClassName}
              />
            </div>

            <Input
              label="Email"
              type="email"
              value={email}
              readOnly
              className={readOnlyClassName}
            />

            <Input
              label="Upwork Profile URL"
              type="url"
              placeholder="https://www.upwork.com/freelancers/..."
              value={upworkProfileUrl}
              onChange={(e) => setUpworkProfileUrl(e.target.value)}
              hint="Only your Upwork profile link can be updated here."
              disabled={saving}
            />

            <Button type="submit" size="sm" loading={saving}>
              Save Upwork Link
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
