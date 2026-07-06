"use client";

import { forwardRef, type HTMLAttributes } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glass?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const paddings = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      hover = false,
      glass = true,
      padding = "md",
      children,
      ...props
    },
    ref
  ) => {
    if (hover) {
      return (
        <motion.div
          ref={ref}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className={cn(
            "rounded-2xl glass glass-hover cursor-default",
            paddings[padding],
            className
          )}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl",
          glass && "glass",
          paddings[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export function CardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex flex-col gap-1.5 mb-4", className)} {...props} />
  );
}

export function CardTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("text-lg font-bold tracking-tight text-foreground", className)}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn("text-sm text-muted leading-relaxed", className)} {...props} />
  );
}

export function CardContent({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("", className)} {...props} />;
}

export function CardFooter({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center gap-3 mt-4 pt-4 border-t border-border", className)}
      {...props}
    />
  );
}
