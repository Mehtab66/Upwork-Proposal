export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/session";
import {
  normalizeBoldPhrases,
  sanitizeCoverLetter,
} from "@/lib/proposal/format-cover-letter";
import { highlightCoverLetterPhrases } from "@/lib/proposal/highlight-cover-letter";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user?.id) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = (await request.json()) as { coverLetter?: string };
    const coverLetter = sanitizeCoverLetter(body.coverLetter || "");

    if (coverLetter.length < 20) {
      return NextResponse.json(
        { error: "Cover letter text is too short to highlight." },
        { status: 400 }
      );
    }

    const suggested = await highlightCoverLetterPhrases(coverLetter);
    const boldPhrases = normalizeBoldPhrases(coverLetter, suggested);

    return NextResponse.json({
      boldPhrases,
      coverLetter,
    });
  } catch (error) {
    console.error("Highlight proposal error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
