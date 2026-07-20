"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  KeyRound,
  Link2Off,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type AuthErrorKey =
  | "Configuration"
  | "AccessDenied"
  | "Verification"
  | "OAuthSignin"
  | "OAuthCallback"
  | "OAuthCreateAccount"
  | "EmailCreateAccount"
  | "Callback"
  | "OAuthAccountNotLinked"
  | "EmailSignin"
  | "CredentialsSignin"
  | "SessionRequired"
  | "Default";

interface AuthErrorDetails {
  title: string;
  description: string;
  hint?: string;
  icon: typeof AlertCircle;
}

const AUTH_ERRORS: Record<AuthErrorKey, AuthErrorDetails> = {
  Configuration: {
    title: "Authentication is not configured",
    description:
      "There is a problem with the server authentication setup. Please try again later or contact support.",
    icon: ShieldAlert,
  },
  AccessDenied: {
    title: "Access denied",
    description:
      "You do not have permission to sign in, or you cancelled the sign-in request.",
    hint: "If you closed the Google sign-in window, try again when you are ready.",
    icon: ShieldAlert,
  },
  Verification: {
    title: "Verification link expired",
    description:
      "This sign-in link is no longer valid. It may have expired or already been used.",
    icon: AlertCircle,
  },
  OAuthSignin: {
    title: "Could not start Google sign-in",
    description:
      "Something went wrong while connecting to Google. Please try again in a moment.",
    icon: AlertCircle,
  },
  OAuthCallback: {
    title: "Google sign-in failed",
    description:
      "We could not complete sign-in with Google. This can happen if the session timed out or the callback was interrupted.",
    hint: "Make sure third-party cookies are allowed, then try signing in again.",
    icon: AlertCircle,
  },
  OAuthCreateAccount: {
    title: "Could not create your account",
    description:
      "Sign-in succeeded with Google, but we could not finish creating your account.",
    icon: AlertCircle,
  },
  EmailCreateAccount: {
    title: "Could not create your account",
    description:
      "We could not create an account with that email address. It may already be in use.",
    icon: AlertCircle,
  },
  Callback: {
    title: "Sign-in callback failed",
    description:
      "Something went wrong while finishing sign-in. Please start over from the login page.",
    icon: AlertCircle,
  },
  OAuthAccountNotLinked: {
    title: "This email is already registered",
    description:
      "An account with this email already exists using email and password sign-in.",
    hint: "Sign in with your email and password instead of Google, or use the same provider you originally signed up with.",
    icon: Link2Off,
  },
  EmailSignin: {
    title: "Check your email",
    description:
      "A sign-in link was sent to your email address. Open that link to continue.",
    icon: KeyRound,
  },
  CredentialsSignin: {
    title: "Invalid email or password",
    description:
      "The email or password you entered is incorrect. Please check your details and try again.",
    icon: KeyRound,
  },
  SessionRequired: {
    title: "Sign in required",
    description:
      "You need to be signed in to view that page. Please log in to continue.",
    icon: KeyRound,
  },
  Default: {
    title: "Something went wrong",
    description:
      "An unexpected authentication error occurred. Please try signing in again.",
    icon: AlertCircle,
  },
};

function resolveAuthError(error: string | null): AuthErrorDetails {
  if (error && error in AUTH_ERRORS) {
    return AUTH_ERRORS[error as AuthErrorKey];
  }

  return AUTH_ERRORS.Default;
}

export function AuthErrorContent() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error");
  const details = resolveAuthError(errorCode);
  const Icon = details.icon;

  return (
    <Card glass padding="lg" className="w-full max-w-md">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
          <Icon className="h-7 w-7" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">{details.title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {details.description}
        </p>
        {details.hint ? (
          <p className="mt-3 rounded-xl border border-border bg-background/60 px-4 py-3 text-sm text-muted">
            {details.hint}
          </p>
        ) : null}
        {errorCode ? (
          <p className="mt-4 text-xs uppercase tracking-wide text-muted/70">
            Error code: {errorCode}
          </p>
        ) : null}
      </div>

      <div className="flex flex-col gap-3">
        <Link href="/login">
          <Button className="w-full" size="lg">
            Back to login
          </Button>
        </Link>
        <Link href="/">
          <Button variant="outline" className="w-full" size="lg">
            <ArrowLeft className="h-4 w-4" />
            Go to homepage
          </Button>
        </Link>
      </div>

      <p className="mt-6 text-center text-sm text-muted">
        Need a new account?{" "}
        <Link
          href="/signup"
          className="font-semibold text-primary transition-colors hover:text-primary-hover"
        >
          Create one here
        </Link>
      </p>
    </Card>
  );
}

export function AuthErrorShell({ children }: { children: React.ReactNode }) {
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

        <div>
          <h2 className="mb-4 text-4xl font-bold leading-tight text-foreground xl:text-5xl">
            We hit a snag with{" "}
            <span className="gradient-text">sign-in</span>
          </h2>
          <p className="max-w-md text-lg leading-relaxed text-muted">
            Authentication errors are usually quick to fix. Use the suggestions
            on the right and try signing in again.
          </p>
        </div>

        <ul className="space-y-3 text-sm text-muted">
          {[
            "Double-check your email and password",
            "Use the same sign-in method you registered with",
            "Allow pop-ups and cookies for Google sign-in",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary">
                ✓
              </span>
              {item}
            </li>
          ))}
        </ul>

        <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -top-10 -left-10 h-60 w-60 rounded-full bg-primary/5 blur-3xl" />
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
        {children}
      </div>
    </div>
  );
}
