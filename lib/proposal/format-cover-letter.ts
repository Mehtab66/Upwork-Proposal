export function sanitizeCoverLetter(text: string) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/(^|\n)\*(\s)/g, "$1$2")
    .replace(/\*/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export type CoverLetterSegment =
  | { type: "text"; value: string }
  | { type: "bold"; value: string };

function resolvePhraseInPlain(plain: string, phrase: string) {
  if (!phrase.trim()) {
    return null;
  }

  if (plain.includes(phrase)) {
    return phrase;
  }

  const trimmed = phrase.trim();
  if (plain.includes(trimmed)) {
    return trimmed;
  }

  return null;
}

export function normalizeBoldPhrases(text: string, phrases: string[]) {
  const plain = sanitizeCoverLetter(text);
  const resolved: string[] = [];

  for (const phrase of phrases) {
    const match = resolvePhraseInPlain(plain, phrase);
    if (match) {
      resolved.push(match);
    }
  }

  return [...new Set(resolved)]
    .sort((a, b) => b.length - a.length)
    .slice(0, 12);
}

export function buildSegmentsFromPhrases(
  text: string,
  phrases: string[]
): CoverLetterSegment[] {
  const plain = sanitizeCoverLetter(text);
  const validPhrases = normalizeBoldPhrases(plain, phrases);

  const ranges: { start: number; end: number }[] = [];

  for (const phrase of validPhrases) {
    const index = plain.indexOf(phrase);
    if (index === -1) {
      continue;
    }

    const start = index;
    const end = index + phrase.length;
    const overlaps = ranges.some(
      (range) => !(end <= range.start || start >= range.end)
    );

    if (!overlaps) {
      ranges.push({ start, end });
    }
  }

  ranges.sort((a, b) => a.start - b.start);

  const segments: CoverLetterSegment[] = [];
  let cursor = 0;

  for (const range of ranges) {
    if (range.start > cursor) {
      segments.push({ type: "text", value: plain.slice(cursor, range.start) });
    }

    segments.push({
      type: "bold",
      value: plain.slice(range.start, range.end),
    });
    cursor = range.end;
  }

  if (cursor < plain.length) {
    segments.push({ type: "text", value: plain.slice(cursor) });
  }

  if (segments.length === 0) {
    segments.push({ type: "text", value: plain });
  }

  return segments;
}

export function plainTextForUpwork(text: string) {
  return sanitizeCoverLetter(text);
}

export function mergeBoldPhrase(
  existing: string[],
  addition: string,
  text: string
) {
  const plain = sanitizeCoverLetter(text);
  const resolved = resolvePhraseInPlain(plain, addition);

  if (!resolved) {
    return normalizeBoldPhrases(plain, existing);
  }

  return normalizeBoldPhrases(plain, [...existing, resolved]);
}

export function removeBoldPhrase(
  existing: string[],
  phrase: string,
  text: string
) {
  const plain = sanitizeCoverLetter(text);
  return normalizeBoldPhrases(
    plain,
    existing.filter((item) => item !== phrase)
  );
}

export function ensureProposalGreeting(
  coverLetter: string,
  clientName?: string
) {
  const plain = sanitizeCoverLetter(coverLetter);
  if (/^hi[\s,]/i.test(plain)) {
    return plain;
  }

  const greeting = clientName?.trim()
    ? `Hi ${clientName.trim()},`
    : "Hi,";

  return `${greeting}\n\n${plain}`;
}

export function countQuestionsInLetter(text: string) {
  return (sanitizeCoverLetter(text).match(/\?/g) || []).length;
}
