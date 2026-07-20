export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import {
  deleteUserProposal,
  updateProposalCoverLetter,
  updateProposalStatus,
} from "@/lib/proposal/storage";
import type { ProposalStatus } from "@/types/proposal";

const allowedStatuses = new Set<ProposalStatus>([
  "draft",
  "sent",
  "accepted",
  "rejected",
]);

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await context.params;
    const body = (await request.json()) as {
      status?: ProposalStatus;
      coverLetter?: string;
      boldPhrases?: string[];
    };

    if (body.coverLetter !== undefined) {
      const proposal = await updateProposalCoverLetter(user.id, id, {
        coverLetter: body.coverLetter,
        boldPhrases: body.boldPhrases,
      });

      if (!proposal) {
        return NextResponse.json({ error: "Proposal not found." }, { status: 404 });
      }

      return NextResponse.json({ proposal });
    }

    if (!body.status || !allowedStatuses.has(body.status)) {
      return NextResponse.json({ error: "Invalid update payload." }, { status: 400 });
    }

    const proposal = await updateProposalStatus(user.id, id, body.status);

    if (!proposal) {
      return NextResponse.json({ error: "Proposal not found." }, { status: 404 });
    }

    return NextResponse.json({ proposal });
  } catch (error) {
    console.error("Update proposal error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await context.params;
    const deleted = await deleteUserProposal(user.id, id);

    if (!deleted) {
      return NextResponse.json({ error: "Proposal not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Proposal deleted." });
  } catch (error) {
    console.error("Delete proposal error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
