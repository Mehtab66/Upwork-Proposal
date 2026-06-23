"use client";

import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
  cta: string;
}

export function PricingCard({
  name,
  price,
  period = "/month",
  description,
  features,
  highlighted = false,
  badge,
  cta,
}: PricingCardProps) {
  return (
    <Card
      hover
      className={cn(
        "relative flex flex-col",
        highlighted && "border-primary/40 ring-2 ring-primary/20 scale-[1.02]"
      )}
    >
      {badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <Badge variant="primary">{badge}</Badge>
        </div>
      )}
      <CardContent className="flex flex-col flex-1">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-foreground">{name}</h3>
          <p className="text-sm text-muted mt-1">{description}</p>
          <div className="mt-4 flex items-baseline gap-1">
            <span className="text-4xl font-bold text-foreground">{price}</span>
            {price !== "Free" && (
              <span className="text-sm text-muted">{period}</span>
            )}
          </div>
        </div>

        <ul className="space-y-3 flex-1 mb-6">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-sm">
              <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span className="text-muted">{feature}</span>
            </li>
          ))}
        </ul>

        <Button
          variant={highlighted ? "primary" : "outline"}
          className="w-full"
        >
          {cta}
        </Button>
      </CardContent>
    </Card>
  );
}
