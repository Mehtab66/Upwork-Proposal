export interface ProposalTemplate {
  id: string;
  name: string;
  description: string;
  promptAddon: string;
}

export const PROPOSAL_TEMPLATES: ProposalTemplate[] = [
  {
    id: "classic-upwork",
    name: "Classic Upwork",
    description: "Hi + hook, relevance, proof, questions & CTA.",
    promptAddon:
      "Use the Classic Upwork structure: greeting, specific hook, relevance, micro-proof, then CTA paragraph with at least 2 questions.",
  },
  {
    id: "result-hook",
    name: "Result-Led Hook",
    description: "Open with a measurable outcome tied to this job.",
    promptAddon:
      "Open the hook with one concrete result or metric relevant to this job, then immediately tie it to the client's stated need.",
  },
  {
    id: "problem-first",
    name: "Problem-First",
    description: "Mirror the client's pain, then your solution.",
    promptAddon:
      "Hook must restate the client's core problem in your own words before mentioning your fit.",
  },
  {
    id: "question-led",
    name: "Question-Led Close",
    description: "Strong discovery questions in the final block.",
    promptAddon:
      "Use 3 thoughtful questions in the final paragraph about scope, success criteria, and timeline constraints.",
  },
];

export function getProposalTemplate(templateId?: string) {
  return (
    PROPOSAL_TEMPLATES.find((template) => template.id === templateId) ||
    PROPOSAL_TEMPLATES[0]
  );
}
