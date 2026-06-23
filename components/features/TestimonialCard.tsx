"use client";

import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  rating?: number;
}

export function TestimonialCard({
  quote,
  name,
  role,
  rating = 5,
}: TestimonialCardProps) {
  return (
    <Card hover className="h-full">
      <CardContent className="flex flex-col h-full">
        <div className="flex gap-0.5 mb-4">
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-primary text-primary" />
          ))}
        </div>
        <p className="text-sm text-muted leading-relaxed flex-1 mb-6">
          &ldquo;{quote}&rdquo;
        </p>
        <div className="flex items-center gap-3">
          <Avatar name={name} size="md" />
          <div>
            <p className="text-sm font-semibold text-foreground">{name}</p>
            <p className="text-xs text-muted">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
