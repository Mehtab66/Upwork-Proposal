"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  FileUser,
  Search,
  Sparkles,
  FolderOpen,
  ArrowRight,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { FeatureCard } from "@/components/features/FeatureCard";
import { PricingCard } from "@/components/features/PricingCard";
import { TestimonialCard } from "@/components/features/TestimonialCard";
import { HeroMockup } from "@/components/features/HeroMockup";
import { HowItWorksStep } from "@/components/features/HowItWorksStep";

const features = [
  {
    icon: FileUser,
    title: "Resume Intelligence",
    description:
      "Upload your resume and AI extracts skills, experience, and portfolio highlights automatically.",
  },
  {
    icon: Search,
    title: "Job Analysis",
    description:
      "AI understands Upwork job requirements and identifies the key skills clients are looking for.",
  },
  {
    icon: Sparkles,
    title: "Personalized Proposals",
    description:
      "Generate tailored proposals based on your experience that speak directly to each job posting.",
  },
  {
    icon: FolderOpen,
    title: "Portfolio Matching",
    description:
      "Automatically select and highlight your most relevant projects for each proposal.",
  },
];

const steps = [
  {
    step: 1,
    title: "Upload Resume",
    description: "Drop your PDF or DOCX resume and let AI do the rest.",
  },
  {
    step: 2,
    title: "AI Extracts Profile",
    description: "Skills, experience, and projects are parsed automatically.",
  },
  {
    step: 3,
    title: "Paste Job Description",
    description: "Copy the Upwork job post and paste it into the generator.",
  },
  {
    step: 4,
    title: "Generate Proposal",
    description: "Get a personalized, winning proposal in seconds.",
  },
];

const pricingPlans = [
  {
    name: "Free",
    price: "Free",
    description: "Perfect for getting started",
    features: [
      "3 proposals per month",
      "Basic resume parsing",
      "Standard templates",
      "Email support",
    ],
    cta: "Get Started Free",
  },
  {
    name: "Pro",
    price: "$19",
    description: "For active freelancers",
    features: [
      "50 proposals per month",
      "Advanced AI matching",
      "Portfolio auto-selection",
      "Priority support",
      "Proposal history",
    ],
    highlighted: true,
    badge: "Most Popular",
    cta: "Start Pro Trial",
  },
  {
    name: "Premium",
    price: "$49",
    description: "For power users & agencies",
    features: [
      "Unlimited proposals",
      "Custom AI tone & style",
      "Multi-resume profiles",
      "Analytics dashboard",
      "Dedicated support",
      "Team collaboration",
    ],
    cta: "Go Premium",
  },
];

const testimonials = [
  {
    quote:
      "ProposalAI helped me land 3 new clients in my first month. The proposals feel genuinely personal, not generic AI output.",
    name: "Sarah Mitchell",
    role: "Full-Stack Developer",
  },
  {
    quote:
      "I used to spend 30 minutes per proposal. Now I generate quality drafts in under 2 minutes and customize from there.",
    name: "James Chen",
    role: "UI/UX Designer",
  },
  {
    quote:
      "The portfolio matching feature is a game changer. It automatically picks my best projects for each job type.",
    name: "Maria Rodriguez",
    role: "Mobile App Developer",
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
                  Upload your resume, analyze jobs, and generate personalized
                  proposals using AI. Win more freelance contracts with less
                  effort.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link href="/generate">
                    <Button size="lg" className="w-full sm:w-auto">
                      Start Writing Proposal
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/create-profile">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      Upload Resume
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-6 mt-8 text-sm text-muted">
                  <span>✓ No credit card required</span>
                  <span>✓ Free tier available</span>
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
                Powerful AI tools designed specifically for Upwork freelancers
                who want to stand out from the competition.
              </p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  {...fadeUp}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
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
                From resume upload to winning proposal in four simple steps.
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
                Simple, transparent pricing
              </h2>
              <p className="text-lg text-muted max-w-2xl mx-auto">
                Start free and upgrade as you grow your freelance business.
              </p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto pt-4">
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

        {/* Testimonials */}
        <section id="testimonials" className="py-20 lg:py-28 bg-primary-light/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeUp} className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Loved by freelancers
              </h2>
              <p className="text-lg text-muted max-w-2xl mx-auto">
                See what freelancers are saying about ProposalAI.
              </p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.div
                  key={t.name}
                  {...fadeUp}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <TestimonialCard {...t} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 lg:py-28">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              {...fadeUp}
              className="glass rounded-3xl p-10 lg:p-16 text-center"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Ready to win more Upwork jobs?
              </h2>
              <p className="text-lg text-muted mb-8 max-w-xl mx-auto">
                Join thousands of freelancers using AI to create proposals that
                get responses.
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
