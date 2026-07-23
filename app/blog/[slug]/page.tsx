import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BlogContent } from "@/components/blog/BlogContent";
import { BlogCard } from "@/components/blog/BlogCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getAllBlogPosts,
  getBlogPostBySlug,
  getRelatedPosts,
} from "@/lib/blog";
import { CATEGORY_LABELS } from "@/lib/blog/types";
import {
  LEGAL_SITE_NAME,
  LEGAL_WEBSITE_URL,
} from "@/lib/legal/site";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    return { title: "Post not found" };
  }

  const url = `${LEGAL_WEBSITE_URL}/blog/${post.slug}`;

  return {
    title: `${post.title} | ${LEGAL_SITE_NAME}`,
    description: post.description,
    keywords: [post.keyword, "upwork proposal", "upwork cover letter"],
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url,
      publishedTime: post.publishedAt,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const related = getRelatedPosts(slug, 3);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    author: {
      "@type": "Organization",
      name: LEGAL_SITE_NAME,
    },
    mainEntityOfPage: `${LEGAL_WEBSITE_URL}/blog/${post.slug}`,
    ...(post.faqs.length
      ? {
          // FAQPage companion via mainEntity on a separate script below
        }
      : {}),
  };

  const faqLd =
    post.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {faqLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      ) : null}

      <Navbar />
      <main className="flex-1 pt-28 pb-20">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            All articles
          </Link>

          <div className="mb-4 flex flex-wrap items-center gap-2">
            <Badge variant="outline">{CATEGORY_LABELS[post.category]}</Badge>
            <span className="text-xs text-muted">{post.readingTime} read</span>
            <span className="text-xs text-muted">
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-lg text-muted leading-relaxed mb-10">
            {post.description}
          </p>

          <BlogContent content={post.content} />

          {post.faqs.length > 0 ? (
            <section className="mt-12 border-t border-border pt-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">
                Frequently asked questions
              </h2>
              <div className="space-y-5">
                {post.faqs.map((faq) => (
                  <div key={faq.question}>
                    <h3 className="font-semibold text-foreground">
                      {faq.question}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          <div className="mt-12 rounded-2xl border border-primary/20 bg-primary-light/40 p-6 sm:p-8 text-center">
            <h2 className="text-xl font-bold text-foreground mb-2">
              Ready to write a stronger proposal?
            </h2>
            <p className="text-sm text-muted mb-5 max-w-md mx-auto">
              Analyze the job, match your portfolio, and generate a structured
              Upwork cover letter in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup">
                <Button>
                  Get started free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/analyze">
                <Button variant="outline">Analyze a job</Button>
              </Link>
            </div>
          </div>
        </article>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
          <h2 className="text-xl font-bold text-foreground mb-6">
            Related articles
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <BlogCard key={item.slug} post={item} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
