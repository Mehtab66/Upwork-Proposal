"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MatchedPortfolioItem } from "@/types/job-analysis";

interface MatchedPortfolioPanelProps {
  items: MatchedPortfolioItem[];
}

export function MatchedPortfolioPanel({ items }: MatchedPortfolioPanelProps) {
  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Portfolio matching</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted">
            Upload a resume and set an active profile to see matched projects and
            experience for this job.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Matched portfolio & experience</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div
            key={`${item.type}-${item.name}`}
            className="rounded-xl border border-border p-4"
          >
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="capitalize">
                {item.type}
              </Badge>
              <Badge variant="primary">{item.relevanceScore}% match</Badge>
            </div>
            <p className="font-semibold text-foreground">{item.name}</p>
            {item.subtitle ? (
              <p className="text-xs text-muted">{item.subtitle}</p>
            ) : null}
            <p className="mt-2 text-sm text-muted">{item.reason}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
