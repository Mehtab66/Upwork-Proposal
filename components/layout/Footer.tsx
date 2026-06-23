import Link from "next/link";
import { Sparkles, Share2, Globe, Mail } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Dashboard", href: "/dashboard" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "#" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/30">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight">
                Proposal<span className="text-primary">AI</span>
              </span>
            </Link>
            <p className="text-sm text-muted leading-relaxed max-w-xs">
              Generate winning Upwork proposals with AI. Upload your resume,
              analyze jobs, and create personalized proposals that win clients.
            </p>
            <div className="flex gap-3 mt-6">
              {[Share2, Globe, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="h-9 w-9 rounded-xl glass flex items-center justify-center text-muted hover:text-primary hover:border-primary/30 transition-all glass-hover"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-sm text-foreground mb-4">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} ProposalAI. All rights reserved.
          </p>
          <p className="text-sm text-muted">
            Built for freelancers who want to win more Upwork jobs.
          </p>
        </div>
      </div>
    </footer>
  );
}
