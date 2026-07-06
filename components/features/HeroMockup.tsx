"use client";

import { motion } from "framer-motion";
import { Sparkles, FileText, CheckCircle2, ArrowRight } from "lucide-react";

export function HeroMockup() {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="glass rounded-2xl p-6 shadow-2xl"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">AI Proposal Generator</p>
            <p className="text-xs text-muted">Analyzing job requirements...</p>
          </div>
          <div className="ml-auto flex gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-primary"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>
        </div>

        <div className="space-y-3 mb-5">
          <div className="glass rounded-xl p-3 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-foreground">Job Description</span>
            </div>
            <div className="space-y-1.5">
              <div className="h-2 rounded-full bg-primary/20 w-full" />
              <div className="h-2 rounded-full bg-primary/15 w-4/5" />
              <div className="h-2 rounded-full bg-primary/10 w-3/5" />
            </div>
          </div>

          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex items-center justify-center py-2"
          >
            <ArrowRight className="h-5 w-5 text-primary rotate-90" />
          </motion.div>

          <div className="glass rounded-xl p-3 border border-primary/20 bg-primary-light/30">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-primary">Generated Proposal</span>
            </div>
            <div className="space-y-1.5">
              <div className="h-2 rounded-full bg-primary/30 w-full" />
              <div className="h-2 rounded-full bg-primary/25 w-full" />
              <div className="h-2 rounded-full bg-primary/20 w-4/5" />
              <div className="h-2 rounded-full bg-primary/15 w-3/5" />
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {["React", "Node.js", "TypeScript"].map((skill) => (
            <span
              key={skill}
              className="text-xs px-2.5 py-1 rounded-full bg-primary-light text-primary font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-4 -right-4 glass rounded-xl px-3 py-2 shadow-lg"
      >
        <p className="text-xs font-semibold text-primary">98% Match</p>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute -bottom-4 -left-4 glass rounded-xl px-3 py-2 shadow-lg"
      >
        <p className="text-xs font-semibold text-foreground">12 skills matched</p>
      </motion.div>
    </div>
  );
}
