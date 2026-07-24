"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Megaphone } from "lucide-react";
import { AdUnit } from "@/components/ads/AdUnit";
import { Button } from "@/components/ui/button";

const AD_WAIT_SECONDS = 5;

interface ProposalAdGateProps {
  onContinue: () => void;
}

export function ProposalAdGate({ onContinue }: ProposalAdGateProps) {
  const [secondsLeft, setSecondsLeft] = useState(AD_WAIT_SECONDS);

  useEffect(() => {
    if (secondsLeft <= 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setSecondsLeft((value) => value - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [secondsLeft]);

  const canContinue = secondsLeft <= 0;

  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center gap-5 px-2 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-light">
        <Megaphone className="h-6 w-6 text-primary" />
      </div>

      <div className="space-y-2">
        <h3 className="text-base font-semibold text-foreground">
          Your proposal is ready
        </h3>
        <p className="max-w-sm text-sm text-muted">
          A short sponsored message helps keep ProposalAI free. Continue to view
          your cover letter.
        </p>
      </div>

      <AdUnit className="w-full max-w-md overflow-hidden rounded-xl" />

      <Button
        size="lg"
        className="w-full max-w-sm"
        disabled={!canContinue}
        onClick={onContinue}
      >
        {canContinue ? (
          <>
            View my proposal
            <ArrowRight className="h-4 w-4" />
          </>
        ) : (
          `Continue in ${secondsLeft}s`
        )}
      </Button>

      <p className="text-xs text-muted">
        Please support us by viewing the ad — then unlock your proposal.
      </p>
    </div>
  );
}
