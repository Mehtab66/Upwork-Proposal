"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  Menu,
  X,
  Moon,
  Sun,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { useTheme } from "@/providers/theme-provider";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#pricing", label: "Pricing" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <nav className="glass mx-4 mt-4 rounded-2xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center shadow-md shadow-primary/30 group-hover:scale-105 transition-transform">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              Proposal<span className="text-primary">AI</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted hover:text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="h-9 w-9 rounded-xl flex items-center justify-center hover:bg-primary-light transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-primary" />
              ) : (
                <Moon className="h-4 w-4 text-muted" />
              )}
            </button>
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="h-9 w-9 rounded-xl flex items-center justify-center hover:bg-primary-light transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4 text-primary" />
              ) : (
                <Moon className="h-4 w-4 text-muted" />
              )}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="h-9 w-9 rounded-xl flex items-center justify-center hover:bg-primary-light transition-colors"
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t border-border"
            >
              <div className="py-4 space-y-1">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-2 py-2.5 text-sm font-medium text-muted hover:text-primary rounded-xl hover:bg-primary-light transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="pt-3 flex flex-col gap-2">
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Log in
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full">Get Started</Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}

interface DashboardNavbarProps {
  title?: string;
  onMenuClick?: () => void;
}

export function DashboardNavbar({ title, onMenuClick }: DashboardNavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { data: session } = useSession();
  const userName = session?.user?.name || "User";
  const userImage = session?.user?.image || undefined;

  return (
    <header className="sticky top-0 z-30 glass border-b border-border rounded-none mx-0 mt-0">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden h-9 w-9 rounded-xl flex items-center justify-center hover:bg-primary-light transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          {title && (
            <h1 className="text-lg font-bold text-foreground">{title}</h1>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="h-9 w-9 rounded-xl flex items-center justify-center hover:bg-primary-light transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-primary" />
            ) : (
              <Moon className="h-4 w-4 text-muted" />
            )}
          </button>
          <button className="relative h-9 w-9 rounded-xl flex items-center justify-center hover:bg-primary-light transition-colors">
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary" />
            <svg className="h-4 w-4 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <Link href="/settings">
            <Avatar
              name={userName}
              src={userImage}
              size="sm"
              className="cursor-pointer hover:ring-primary/40 transition-all"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
