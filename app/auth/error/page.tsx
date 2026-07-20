import { Suspense } from "react";
import {
  AuthErrorContent,
  AuthErrorShell,
} from "@/components/auth/AuthErrorContent";
import { Loading } from "@/components/ui/loading";

export const metadata = {
  title: "Sign-in Error — ProposalAI",
  description: "Something went wrong during sign-in. Try again or return to login.",
};

export default function AuthErrorPage() {
  return (
    <AuthErrorShell>
      <Suspense
        fallback={
          <Loading message="Loading error details..." className="py-12" />
        }
      >
        <AuthErrorContent />
      </Suspense>
    </AuthErrorShell>
  );
}
