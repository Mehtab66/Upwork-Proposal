import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  LEGAL_CONTACT_EMAIL,
  LEGAL_LAST_UPDATED,
  LEGAL_SITE_NAME,
} from "@/lib/legal/site";

interface LegalPageLayoutProps {
  title: string;
  children: React.ReactNode;
}

export function LegalPageLayout({ title, children }: LegalPageLayoutProps) {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-28 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-muted mb-2">
            <Link href="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span>{title}</span>
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
            {title}
          </h1>
          <p className="text-sm text-muted mb-10">
            Last updated: {LEGAL_LAST_UPDATED} · {LEGAL_SITE_NAME}
          </p>
          <article className="legal-prose">{children}</article>
          <p className="mt-12 text-sm text-muted border-t border-border pt-8">
            Questions? Contact{" "}
            <a
              href={`mailto:${LEGAL_CONTACT_EMAIL}`}
              className="text-primary hover:underline"
            >
              {LEGAL_CONTACT_EMAIL}
            </a>
            .
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
