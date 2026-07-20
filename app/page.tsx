"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileUser,
  Search,
  Sparkles,
  FolderOpen,
  ArrowRight,
  LayoutTemplate,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/features/FeatureCard";
import { PricingCard } from "@/components/features/PricingCard";
import { HeroMockup } from "@/components/features/HeroMockup";
import { HowItWorksStep } from "@/components/features/HowItWorksStep";

const features = [
  {
    icon: FileUser,
    title: "Resume Intelligence",
    description:
      "Upload multiple resumes, pick an active profile, and let AI extract skills, experience, and projects.",
  },
  {
    icon: Search,
    title: "Job Analysis",
    description:
      "Dedicated job analysis with required skills, client problem, advanced profile match, and gap insights.",
  },
  {
    icon: LayoutTemplate,
    title: "Proposal Templates",
    description:
      "Choose from standard Upwork-style templates (classic, result-led, problem-first, question-led).",
  },
  {
    icon: Sparkles,
    title: "Personalized Proposals",
    description:
      "Generate tailored cover letters with match warnings, edit mode, and Upwork-safe plain-text copy.",
  },
  {
    icon: FolderOpen,
    title: "Portfolio Matching",
    description:
      "See AI-picked projects and experience ranked for each job before you write the proposal.",
  },
];

const steps = [
  {
    step: 1,
    title: "Upload Resume",
    description: "Add one or more resumes and set which profile is active.",
  },
  {
    step: 2,
    title: "Analyze the Job",
    description: "Paste the post on Job Analysis for skills, gaps, and portfolio picks.",
  },
  {
    step: 3,
    title: "Pick a Template",
    description: "Select a proposal template that fits the client and job type.",
  },
  {
    step: 4,
    title: "Generate & Edit",
    description: "Create your letter, tweak bold highlights, and copy plain text to Upwork.",
  },
];

const pricingPlans = [
  {
    name: "Free",
    price: "Free",
    description: "Everything you need to start winning jobs",
    features: [
      "3 AI proposals per month",
      "Multi-resume profiles",
      "Job analysis & advanced matching",
      "Portfolio matching UI",
      "Standard proposal templates",
      "Proposal history, edit & regenerate",
    ],
    highlighted: true,
    badge: "Current plan",
    cta: "Get Started Free",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5 },
};

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="hero-gradient pt-32 pb-20 lg:pt-40 lg:pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-light border border-primary/20 text-primary text-xs font-semibold mb-6">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI-Powered Proposal Generator
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
                  Generate Winning{" "}
                  <span className="gradient-text">Upwork Proposals</span> With
                  AI
                </h1>
                <p className="text-lg text-muted leading-relaxed mb-8 max-w-lg">
                  Upload your resume, analyze jobs, match your portfolio, and
                  generate personalized proposals with built-in templates.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/signup">
                    <Button size="lg" className="w-full sm:w-auto">
                      Get Started Free
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/analyze">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      Analyze a Job
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-6 mt-8 text-sm text-muted">
                  <span>✓ No credit card required</span>
                  <span>✓ 3 proposals/month on Free</span>
                </div>
              </motion.div>

              <HeroMockup />
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp} className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Everything you need to win jobs
              </h2>
              <p className="text-lg text-muted max-w-2xl mx-auto">
                Built for Upwork freelancers — analyze first, then generate with
                templates and portfolio-aware AI.
              </p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  {...fadeUp}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                >
                  <FeatureCard {...feature} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 lg:py-28 bg-primary-light/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp} className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                How it works
              </h2>
              <p className="text-lg text-muted max-w-2xl mx-auto">
                From resume to analyzed job to a polished proposal in four steps.
              </p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
              {steps.map((step, i) => (
                <motion.div
                  key={step.step}
                  {...fadeUp}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <HowItWorksStep {...step} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-20 lg:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp} className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Simple pricing
              </h2>
              <p className="text-lg text-muted max-w-2xl mx-auto">
                One free plan with the core workflow — no paid tiers or upsells yet.
              </p>
            </motion.div>
            <div className="grid gap-6 max-w-md mx-auto pt-4">
              {pricingPlans.map((plan, i) => (
                <motion.div
                  key={plan.name}
                  {...fadeUp}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <PricingCard {...plan} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 lg:py-28 bg-primary-light/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              {...fadeUp}
              className="glass rounded-3xl p-10 lg:p-16 text-center"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Ready to win more Upwork jobs?
              </h2>
              <p className="text-lg text-muted mb-8 max-w-xl mx-auto">
                Create your account, analyze your next job post, and generate a
                proposal in minutes.
              </p>
              <Link href="/signup">
                <Button size="lg">
                  Get Started for Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
