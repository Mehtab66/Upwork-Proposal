"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  emptyExtractedResume,
  type ExtractedResume,
  type ResumeExperience,
} from "@/types/resume";

interface ManualResumeFormProps {
  initialData?: ExtractedResume;
  loading?: boolean;
  onSave: (data: ExtractedResume) => Promise<void>;
}

function parseList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

const emptyExperience = (): ResumeExperience => ({
  title: "",
  company: "",
  period: "",
  location: "",
  description: "",
  highlights: [],
});

export function ManualResumeForm({
  initialData,
  loading = false,
  onSave,
}: ManualResumeFormProps) {
  const [form, setForm] = useState<ExtractedResume>(
    initialData || emptyExtractedResume
  );
  const [technicalSkills, setTechnicalSkills] = useState(
    initialData?.skillCategories.technical.join(", ") || ""
  );
  const [toolSkills, setToolSkills] = useState(
    initialData?.skillCategories.tools.join(", ") || ""
  );
  const [softSkills, setSoftSkills] = useState(
    initialData?.skillCategories.soft.join(", ") || ""
  );
  const [achievementsText, setAchievementsText] = useState(
    initialData?.achievements.join("\n") || ""
  );
  const [error, setError] = useState("");

  const updateExperience = (
    index: number,
    field: keyof ResumeExperience,
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      experience: current.experience.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]:
                field === "highlights" ? parseLines(value) : value,
            }
          : item
      ),
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!form.contact.fullName.trim() || !form.contact.email.trim()) {
      setError("Full name and email are required.");
      return;
    }

    const skillCategories = {
      technical: parseList(technicalSkills),
      soft: parseList(softSkills),
      tools: parseList(toolSkills),
      other: form.skillCategories.other,
    };

    const payload: ExtractedResume = {
      ...form,
      skillCategories,
      skills: Array.from(
        new Set([
          ...skillCategories.technical,
          ...skillCategories.soft,
          ...skillCategories.tools,
          ...skillCategories.other,
        ])
      ),
      achievements: parseLines(achievementsText),
    };

    await onSave(payload);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Contact</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            value={form.contact.fullName}
            onChange={(e) =>
              setForm((current) => ({
                ...current,
                contact: { ...current.contact, fullName: e.target.value },
              }))
            }
            required
          />
          <Input
            label="Email"
            type="email"
            value={form.contact.email}
            onChange={(e) =>
              setForm((current) => ({
                ...current,
                contact: { ...current.contact, email: e.target.value },
              }))
            }
            required
          />
          <Input
            label="Phone"
            value={form.contact.phone}
            onChange={(e) =>
              setForm((current) => ({
                ...current,
                contact: { ...current.contact, phone: e.target.value },
              }))
            }
          />
          <Input
            label="Location"
            value={form.contact.location}
            onChange={(e) =>
              setForm((current) => ({
                ...current,
                contact: { ...current.contact, location: e.target.value },
              }))
            }
          />
          <Input
            label="Headline / Target Role"
            value={form.contact.headline}
            onChange={(e) =>
              setForm((current) => ({
                ...current,
                contact: { ...current.contact, headline: e.target.value },
              }))
            }
            className="sm:col-span-2"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Summary & Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            label="Professional Summary"
            value={form.summary}
            onChange={(e) => setForm((current) => ({ ...current, summary: e.target.value }))}
          />
          <Input
            label="Technical Skills"
            placeholder="React, Node.js, Python"
            value={technicalSkills}
            onChange={(e) => setTechnicalSkills(e.target.value)}
            hint="Separate skills with commas"
          />
          <Input
            label="Tools & Platforms"
            placeholder="Git, Docker, AWS"
            value={toolSkills}
            onChange={(e) => setToolSkills(e.target.value)}
            hint="Separate tools with commas"
          />
          <Input
            label="Soft Skills"
            placeholder="Communication, Leadership"
            value={softSkills}
            onChange={(e) => setSoftSkills(e.target.value)}
            hint="Separate skills with commas"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <CardTitle>Experience</CardTitle>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() =>
                setForm((current) => ({
                  ...current,
                  experience: [...current.experience, emptyExperience()],
                }))
              }
            >
              <Plus className="h-4 w-4" />
              Add Job
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {form.experience.length === 0 && (
            <p className="text-sm text-muted">Add at least one job to strengthen your profile.</p>
          )}
          {form.experience.map((job, index) => (
            <div key={`job-${index}`} className="rounded-xl border border-border p-4 space-y-3">
              <div className="flex justify-end">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      experience: current.experience.filter((_, i) => i !== index),
                    }))
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <Input
                  label="Job Title"
                  value={job.title}
                  onChange={(e) => updateExperience(index, "title", e.target.value)}
                />
                <Input
                  label="Company"
                  value={job.company}
                  onChange={(e) => updateExperience(index, "company", e.target.value)}
                />
                <Input
                  label="Period"
                  placeholder="Jan 2022 – Present"
                  value={job.period}
                  onChange={(e) => updateExperience(index, "period", e.target.value)}
                />
                <Input
                  label="Location"
                  value={job.location}
                  onChange={(e) => updateExperience(index, "location", e.target.value)}
                />
              </div>
              <Textarea
                label="Description"
                value={job.description}
                onChange={(e) => updateExperience(index, "description", e.target.value)}
              />
              <Textarea
                label="Highlights"
                hint="One bullet per line"
                value={job.highlights.join("\n")}
                onChange={(e) => updateExperience(index, "highlights", e.target.value)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Education & Achievements</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4">
          <Input
            label="Degree"
            value={form.education[0]?.degree || ""}
            onChange={(e) =>
              setForm((current) => ({
                ...current,
                education: [
                  {
                    degree: e.target.value,
                    institution: current.education[0]?.institution || "",
                    period: current.education[0]?.period || "",
                    location: current.education[0]?.location || "",
                    details: current.education[0]?.details || "",
                  },
                ],
              }))
            }
          />
          <Input
            label="Institution"
            value={form.education[0]?.institution || ""}
            onChange={(e) =>
              setForm((current) => ({
                ...current,
                education: [
                  {
                    degree: current.education[0]?.degree || "",
                    institution: e.target.value,
                    period: current.education[0]?.period || "",
                    location: current.education[0]?.location || "",
                    details: current.education[0]?.details || "",
                  },
                ],
              }))
            }
          />
          <Input
            label="LinkedIn / Portfolio URL"
            value={form.links[0]?.url || ""}
            onChange={(e) =>
              setForm((current) => ({
                ...current,
                links: e.target.value
                  ? [{ label: "Profile", url: e.target.value }]
                  : [],
              }))
            }
            className="sm:col-span-2"
          />
          <Textarea
            label="Achievements"
            hint="One achievement per line"
            value={achievementsText}
            onChange={(e) => setAchievementsText(e.target.value)}
            className="sm:col-span-2"
          />
        </CardContent>
      </Card>

      <Button type="submit" loading={loading}>
        Save Manual Resume
      </Button>
    </form>
  );
}
