export type ProposalStatus = "draft" | "sent" | "accepted" | "rejected";
export type ProposalMode = "resume" | "generic";
export type ProfileMatchLevel = "high" | "medium" | "low";

export interface ProfileMatchAnalysis {
  matchScore: number;
  matchLevel: ProfileMatchLevel;
  resumeFocus: string;
  jobFocus: string;
  isMismatch: boolean;
  warningMessage: string;
  recommendation: string;
}

export interface GeneratedProposalContent {
  jobTitle: string;
  jobCategory: string;
  coverLetter: string;
  clientNeedsSummary: string;
  matchedHighlights: string[];
  suggestedQuestions: string[];
  boldPhrases: string[];
  profileMatch: ProfileMatchAnalysis | null;
}

export interface StoredProposal {
  id: string;
  jobTitle: string;
  jobCategory: string;
  jobDescription: string;
  clientName: string | null;
  coverLetter: string;
  clientNeedsSummary: string;
  matchedHighlights: string[];
  suggestedQuestions: string[];
  boldPhrases: string[];
  profileMatch: ProfileMatchAnalysis | null;
  proposalMode: ProposalMode;
  resumeId: string | null;
  resumeLabel: string | null;
  status: ProposalStatus;
  createdAt: string;
  updatedAt: string;
}

export interface GenericProposalProfile {
  freelancerName: string;
  professionalHeadline: string;
  skillsSummary: string;
  experienceSummary: string;
}

export interface ProposalListResponse {
  proposals: StoredProposal[];
  usage: {
    usedThisMonth: number;
    monthlyLimit: number;
    remaining: number;
  };
}

export interface GenerateProposalResponse {
  proposal: StoredProposal;
  usage: ProposalListResponse["usage"];
}

export interface ProposalAnalysisResponse {
  clientNeedsSummary: string;
  matchedHighlights: string[];
  suggestedQuestions: string[];
  boldPhrases: string[];
  profileMatch: ProfileMatchAnalysis | null;
}
