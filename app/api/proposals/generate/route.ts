export const runtime = "nodejs";

import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import clientPromise from "@/lib/mongodb";
import {
  generateGenericUpworkProposal,
  generateUpworkProposalFromResume,
} from "@/lib/proposal/generate-proposal";
import {
  getProposalUsage,
  saveProposal,
  updateProposalContent,
} from "@/lib/proposal/storage";
import { getUserResumeState } from "@/lib/resume/user-resumes";
import type { GenericProposalProfile, ProposalMode } from "@/types/proposal";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = (await request.json()) as {
      jobDescription?: string;
      clientName?: string;
      jobTitle?: string;
      regenerateProposalId?: string;
      mode?: ProposalMode;
      genericProfile?: Partial<GenericProposalProfile>;
    };

    const jobDescription = body.jobDescription?.trim() || "";
    const mode: ProposalMode = body.mode === "generic" ? "generic" : "resume";

    if (jobDescription.length < 40) {
      return NextResponse.json(
        {
          error:
            "Please paste a complete job description (at least 40 characters).",
        },
        { status: 400 }
      );
    }

    const usage = await getProposalUsage(user.id);

    if (!body.regenerateProposalId && usage.remaining <= 0) {
      return NextResponse.json(
        {
          error: `You've used all ${usage.monthlyLimit} free proposals for this month.`,
          usage,
        },
        { status: 429 }
      );
    }

    const client = await clientPromise;
    const dbUser = await client
      .db()
      .collection("users")
      .findOne(
        { _id: new ObjectId(user.id) },
        { projection: { upworkProfileUrl: 1 } }
      );

    const upworkProfileUrl = String(dbUser?.upworkProfileUrl || "");
    let generated;
    let resumeId: string | null = null;
    let resumeLabel: string | null = null;

    if (mode === "generic") {
      const profile: GenericProposalProfile = {
        freelancerName:
          body.genericProfile?.freelancerName?.trim() ||
          user.name ||
          "Freelancer",
        professionalHeadline:
          body.genericProfile?.professionalHeadline?.trim() || "",
        skillsSummary: body.genericProfile?.skillsSummary?.trim() || "",
        experienceSummary:
          body.genericProfile?.experienceSummary?.trim() || "",
      };

      if (
        !profile.professionalHeadline &&
        !profile.skillsSummary &&
        !profile.experienceSummary
      ) {
        return NextResponse.json(
          {
            error:
              "Generic mode requires at least a headline, skills, or background summary.",
          },
          { status: 400 }
        );
      }

      generated = await generateGenericUpworkProposal({
        jobDescription,
        profile,
        upworkProfileUrl,
        clientName: body.clientName,
        jobTitleHint: body.jobTitle,
      });
    } else {
      const resumeState = await getUserResumeState(user.id);

      if (!resumeState.activeResume) {
        return NextResponse.json(
          {
            error:
              "Upload a resume and set an active profile, or switch to Generic mode.",
          },
          { status: 400 }
        );
      }

      resumeId = resumeState.activeResume.id;
      resumeLabel = resumeState.activeResume.label;

      generated = await generateUpworkProposalFromResume({
        jobDescription,
        resume: resumeState.activeResume,
        freelancerName:
          resumeState.activeResume.extracted.contact.fullName ||
          user.name ||
          "Freelancer",
        upworkProfileUrl,
        clientName: body.clientName,
        jobTitleHint: body.jobTitle,
      });
    }

    const proposalPayload = {
      jobTitle: body.jobTitle?.trim() || generated.jobTitle,
      jobCategory: generated.jobCategory,
      coverLetter: generated.coverLetter,
      clientNeedsSummary: generated.clientNeedsSummary,
      matchedHighlights: generated.matchedHighlights,
      suggestedQuestions: generated.suggestedQuestions,
      boldPhrases: generated.boldPhrases,
      profileMatch: generated.profileMatch,
      proposalMode: mode,
      resumeId,
      resumeLabel,
    };

    let proposal;

    if (body.regenerateProposalId) {
      proposal = await updateProposalContent(
        user.id,
        body.regenerateProposalId,
        proposalPayload
      );

      if (!proposal) {
        return NextResponse.json({ error: "Proposal not found." }, { status: 404 });
      }
    } else {
      proposal = await saveProposal(user.id, {
        ...proposalPayload,
        jobDescription,
        clientName: body.clientName?.trim() || null,
        status: "draft",
      });
    }

    const updatedUsage = await getProposalUsage(user.id);

    return NextResponse.json({
      proposal,
      analysis: {
        clientNeedsSummary: generated.clientNeedsSummary,
        matchedHighlights: generated.matchedHighlights,
        suggestedQuestions: generated.suggestedQuestions,
        boldPhrases: generated.boldPhrases,
        profileMatch: generated.profileMatch,
      },
      usage: updatedUsage,
    });
  } catch (error) {
    console.error("Generate proposal error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Something went wrong. Please try again.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
