"use client";

import { buildSegmentsFromPhrases } from "@/lib/proposal/format-cover-letter";

interface CoverLetterPreviewProps {
  text: string;
  boldPhrases?: string[];
  className?: string;
}

export function CoverLetterPreview({
  text,
  boldPhrases = [],
  className,
}: CoverLetterPreviewProps) {
  const segments = buildSegmentsFromPhrases(text, boldPhrases);

  return (
    <div className={className}>
      {segments.map((segment, index) =>
        segment.type === "bold" ? (
          <strong
            key={`${index}-${segment.value.slice(0, 12)}`}
            className="font-semibold text-foreground"
          >
            {segment.value}
          </strong>
        ) : (
          <span key={`${index}-${segment.value.slice(0, 12)}`}>{segment.value}</span>
        )
      )}
    </div>
  );
}
