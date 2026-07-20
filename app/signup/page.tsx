"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { SignupForm } from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left - Marketing */}
      <div className="hidden lg:flex flex-col justify-between hero-gradient p-12 relative overflow-hidden">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/30">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">
            Proposal<span className="text-primary">AI</span>
          </span>
        </Link>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl xl:text-5xl font-bold text-foreground leading-tight mb-6">
            Start winning more{" "}
            <span className="gradient-text">Upwork contracts</span>
          </h1>
          <p className="text-lg text-muted leading-relaxed max-w-md">
            Create your free account and generate your first AI-powered proposal
            in under 2 minutes.
          </p>
        </motion.div>

        <ul className="space-y-3 text-sm text-muted">
          {[
            "Free tier with 3 proposals/month",
            "Job analysis & portfolio matching",
            "Standard proposal templates",
            "No credit card required",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="h-5 w-5 rounded-full bg-primary-light text-primary flex items-center justify-center text-xs font-bold">
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>

        <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      </div>

      {/* Right - Form */}
      <div className="flex flex-col items-center justify-center p-6 sm:p-12 bg-background">
        <div className="lg:hidden mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg">
              Proposal<span className="text-primary">AI</span>
            </span>
          </Link>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full flex justify-center"
        >
          <SignupForm />
        </motion.div>
      </div>
    </div>
  );
}
