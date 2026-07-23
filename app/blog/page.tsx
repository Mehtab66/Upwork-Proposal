import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BlogCard } from "@/components/blog/BlogCard";
import { Button } from "@/components/ui/button";
import { getAllBlogPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog — Upwork Proposal Tips, Templates & Examples | ProposalAI",
  description:
    "SEO-focused guides on Upwork proposals, cover letters, Connects strategy, niche examples, and AI proposal writing.",
  openGraph: {
    title: "ProposalAI Blog — Win More Upwork Jobs",
    description:
      "Practical Upwork proposal guides, templates, and examples for freelancers.",
    type: "website",
  },
};

export default function BlogIndexPage() {
  const posts = getAllBlogPosts();

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <p className="text-sm font-semibold text-primary mb-3">Blog</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4">
              Upwork proposal guides that help you get replies
            </h1>
            <p className="text-lg text-muted leading-relaxed">
              Templates, niche examples, Connects strategy, and AI writing tips —
              written to help freelancers win more jobs (and rank for the
              searches that matter).
            </p>
            <div className="mt-6">
              <Link href="/signup">
                <Button>
                  Generate your next proposal
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
