"use client";

import { Card } from "@/components/ui/card";

interface HowItWorksStepProps {
  step: number;
  title: string;
  description: string;
}

export function HowItWorksStep({ step, title, description }: HowItWorksStepProps) {
  return (
    <Card hover className="text-center relative">
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold text-sm flex items-center justify-center shadow-md shadow-primary/30">
        {step}
      </div>
      <div className="pt-4">
        <h3 className="text-base font-bold text-foreground mb-2 mt-2">{title}</h3>
        <p className="text-sm text-muted leading-relaxed">{description}</p>
      </div>
    </Card>
  );
}
