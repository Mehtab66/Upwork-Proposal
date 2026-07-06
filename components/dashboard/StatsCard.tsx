"use client";

import { type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  className?: string;
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className,
}: StatsCardProps) {
  return (
    <Card hover className={cn("", className)}>
      <CardContent>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted font-medium">{title}</p>
            <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted mt-1">{subtitle}</p>
            )}
            {trend && (
              <p className="text-xs text-primary font-medium mt-1">{trend}</p>
            )}
          </div>
          <div className="h-11 w-11 rounded-xl bg-primary-light flex items-center justify-center">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
