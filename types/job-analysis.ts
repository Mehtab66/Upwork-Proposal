import type { ProfileMatchAnalysis } from "@/types/proposal";

export interface MatchedPortfolioItem {
  type: "project" | "experience";
  name: string;
  subtitle: string;
  reason: string;
  relevanceScore: number;
}

export interface AdvancedJobMatch extends ProfileMatchAnalysis {
  overlappingSkills: string[];
  missingSkills: string[];
  partialSkills: string[];
  experienceAlignment: string;
}

export interface JobAnalysisResult {
  jobTitle: string;
  jobCategory: string;
  clientProblem: string;
  requiredSkills: string[];
  niceToHaveSkills: string[];
  deliverables: string[];
  clientTone: string;
  budgetTimelineSignals: string;
  proposalAngle: string;
  advancedMatch: AdvancedJobMatch | null;
  matchedPortfolio: MatchedPortfolioItem[];
}
