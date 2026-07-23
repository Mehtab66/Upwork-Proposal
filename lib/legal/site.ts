export const LEGAL_SITE_NAME = "ProposalAI";

/** Shown on Terms & Privacy pages and for payment-provider compliance. */
export const LEGAL_ENTITY_NAME =
  process.env.NEXT_PUBLIC_LEGAL_ENTITY_NAME?.trim() || "ProposalAI";

export const LEGAL_CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_LEGAL_CONTACT_EMAIL?.trim() ||
  process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim() ||
  "support@proposalai.app";

export const LEGAL_WEBSITE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.trim() ||
  "https://upwork-proposal-two.vercel.app";

export const LEGAL_LAST_UPDATED = "July 21, 2026";
