"use client";

import { Copy, Eye, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProposalCardProps {
  title: string;
  jobType: string;
  date: string;
  status: "draft" | "sent" | "accepted" | "rejected";
  onView?: () => void;
  onCopy?: () => void;
  onDelete?: () => void;
}

const statusVariants = {
  draft: "default" as const,
  sent: "primary" as const,
  accepted: "success" as const,
  rejected: "danger" as const,
};

export function ProposalCard({
  title,
  jobType,
  date,
  status,
  onView,
  onCopy,
  onDelete,
}: ProposalCardProps) {
  return (
    <Card hover>
      <CardContent>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-semibold text-foreground truncate">
                {title}
              </h3>
              <Badge variant={statusVariants[status]} className="shrink-0 capitalize">
                {status}
              </Badge>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted">
              <span>{jobType}</span>
              <span>•</span>
              <span>{date}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="ghost" size="sm" onClick={onView} className="h-8 w-8 p-0">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={onCopy} className="h-8 w-8 p-0">
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDelete}
              className="h-8 w-8 p-0 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
