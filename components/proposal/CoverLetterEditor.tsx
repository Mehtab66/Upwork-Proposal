"use client";

import { useRef } from "react";
import { Bold, X } from "lucide-react";
import { Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CoverLetterPreview } from "@/components/proposal/CoverLetterPreview";
import {
  mergeBoldPhrase,
  removeBoldPhrase,
  sanitizeCoverLetter,
} from "@/lib/proposal/format-cover-letter";

interface CoverLetterEditorProps {
  value: string;
  boldPhrases: string[];
  onChange: (value: string) => void;
  onBoldPhrasesChange: (phrases: string[]) => void;
}

export function CoverLetterEditor({
  value,
  boldPhrases,
  onChange,
  onBoldPhrasesChange,
}: CoverLetterEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const selectionRef = useRef<{ start: number; end: number } | null>(null);

  const captureSelection = () => {
    const element = textareaRef.current;
    if (!element) {
      return;
    }

    selectionRef.current = {
      start: element.selectionStart,
      end: element.selectionEnd,
    };
  };

  const boldSelection = () => {
    const element = textareaRef.current;
    if (!element) {
      return;
    }

    const stored = selectionRef.current;
    const start = stored?.start ?? element.selectionStart;
    const end = stored?.end ?? element.selectionEnd;

    if (start === end) {
      return;
    }

    const selected = value.slice(start, end);
    if (!selected.trim()) {
      return;
    }

    const next = mergeBoldPhrase(boldPhrases, selected, value);
    onBoldPhrasesChange(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onMouseDown={(event) => event.preventDefault()}
          onClick={boldSelection}
        >
          <Bold className="h-3.5 w-3.5" />
          Bold Selection
        </Button>
        <p className="self-center text-xs text-muted">
          Select text in the box, then click Bold Selection. Check the live preview
          below.
        </p>
      </div>

      <Textarea
        ref={textareaRef}
        value={value}
        onSelect={captureSelection}
        onMouseUp={captureSelection}
        onKeyUp={captureSelection}
        onChange={(event) => {
          onChange(sanitizeCoverLetter(event.target.value));
          captureSelection();
        }}
        className="min-h-[280px] font-sans text-sm leading-relaxed"
      />

      {boldPhrases.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {boldPhrases.map((phrase) => (
            <Badge key={phrase} variant="outline" className="gap-1 pr-1">
              {phrase.length > 48 ? `${phrase.slice(0, 48)}…` : phrase}
              <button
                type="button"
                className="rounded p-0.5 hover:bg-muted"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() =>
                  onBoldPhrasesChange(
                    removeBoldPhrase(boldPhrases, phrase, value)
                  )
                }
                aria-label={`Remove bold from ${phrase}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      ) : null}

      <div className="rounded-xl border border-border bg-muted/20 p-4">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
          Live preview
        </p>
        <CoverLetterPreview
          text={value}
          boldPhrases={boldPhrases}
          className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-foreground"
        />
      </div>
    </div>
  );
}
