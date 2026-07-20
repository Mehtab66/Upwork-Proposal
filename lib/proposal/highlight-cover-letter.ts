import { createGroqClient, getGroqModel } from "@/lib/groq/client";

function normalizePhrases(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => String(item).trim())
    .filter(Boolean)
    .slice(0, 8);
}

export async function highlightCoverLetterPhrases(coverLetter: string) {
  const groq = createGroqClient();

  const completion = await groq.chat.completions.create({
    model: getGroqModel(),
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `Pick 4-8 exact phrases from the cover letter that should be emphasized for the client (hooks, results, skills, questions, CTA).
Return JSON: { "boldPhrases": ["exact phrase from letter", "..."] }
Rules:
- Each phrase MUST appear verbatim in the letter.
- Do not rewrite the letter.
- Prefer short, high-impact phrases.`,
      },
      {
        role: "user",
        content: coverLetter,
      },
    ],
  });

  const content = completion.choices[0]?.message?.content;

  if (!content) {
    throw new Error("AI did not return highlight suggestions.");
  }

  const parsed = JSON.parse(content) as { boldPhrases?: unknown };
  return normalizePhrases(parsed.boldPhrases);
}
