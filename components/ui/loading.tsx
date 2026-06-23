"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  message?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-16 w-16",
};

export function Loading({ message = "Processing...", size = "md", className }: LoadingProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      <div className="relative">
        <motion.div
          className={cn("rounded-full border-2 border-primary/20", sizes[size])}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className={cn(
            "absolute inset-0 rounded-full border-2 border-transparent border-t-primary",
            sizes[size]
          )}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <Sparkles className="absolute inset-0 m-auto h-5 w-5 text-primary ai-pulse" />
      </div>
      <motion.p
        className="text-sm text-muted font-medium"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {message}
      </motion.p>
    </div>
  );
}

export function AILoading({ message = "AI is generating your proposal..." }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12">
      <div className="relative">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute inset-0 rounded-full border border-primary/30"
            style={{ width: 80 + i * 24, height: 80 + i * 24, top: -(i * 12), left: -(i * 12) }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
          />
        ))}
        <div className="relative h-20 w-20 rounded-2xl bg-primary-light flex items-center justify-center">
          <Sparkles className="h-8 w-8 text-primary ai-pulse" />
        </div>
      </div>
      <div className="text-center space-y-2">
        <p className="text-base font-semibold text-foreground">{message}</p>
        <div className="flex gap-1 justify-center">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-primary"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
