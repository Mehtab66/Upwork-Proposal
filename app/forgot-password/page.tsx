"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden hero-gradient p-12 lg:flex">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-md shadow-primary/30">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">
            Proposal<span className="text-primary">AI</span>
          </span>
        </Link>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="mb-6 text-4xl font-bold leading-tight text-foreground xl:text-5xl">
            Secure password reset with{" "}
            <span className="gradient-text">email verification</span>
          </h1>
          <p className="max-w-md text-lg leading-relaxed text-muted">
            We send a one-time code to your inbox so only you can reset your
            account password.
          </p>
        </motion.div>

        <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="flex flex-col items-center justify-center bg-background p-6 sm:p-12">
        <div className="mb-8 text-center lg:hidden">
          <Link href="/" className="mb-4 inline-flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold">
              Proposal<span className="text-primary">AI</span>
            </span>
          </Link>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex w-full justify-center"
        >
          <ForgotPasswordForm />
        </motion.div>
      </div>
    </div>
  );
}
