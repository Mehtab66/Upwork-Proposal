"use client";

import { type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
  className,
}: FeatureCardProps) {
  return (
    <Card hover className={cn("group", className)}>
      <CardContent>
        <div className="h-12 w-12 rounded-2xl bg-primary-light flex items-center justify-center mb-4 group-hover:bg-primary group-hover:shadow-md group-hover:shadow-primary/30 transition-all duration-300">
          <Icon className="h-6 w-6 text-primary group-hover:text-white transition-colors duration-300" />
        </div>
        <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}
