export const JOB_ANALYSIS_STORAGE_KEY = "proposalai_job_analysis";

export interface StoredJobAnalysisPayload {
  jobDescription: string;
  clientName?: string;
  analysis: import("@/types/job-analysis").JobAnalysisResult;
}

export function readStoredJobAnalysis(): StoredJobAnalysisPayload | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(JOB_ANALYSIS_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredJobAnalysisPayload;
  } catch {
    return null;
  }
}
