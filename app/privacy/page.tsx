import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import {
  LEGAL_CONTACT_EMAIL,
  LEGAL_ENTITY_NAME,
  LEGAL_SITE_NAME,
  LEGAL_WEBSITE_URL,
} from "@/lib/legal/site";

export const metadata: Metadata = {
  title: `Privacy Policy — ${LEGAL_SITE_NAME}`,
  description: `How ${LEGAL_SITE_NAME} collects, uses, and protects your data.`,
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPageLayout title="Privacy Policy">
      <section>
        <h2>1. Introduction</h2>
        <p>
          This Privacy Policy describes how {LEGAL_ENTITY_NAME} (&quot;we,&quot;
          &quot;us,&quot; or &quot;our&quot;) collects, uses, and shares
          information when you use {LEGAL_SITE_NAME} (the &quot;Service&quot;)
          at{" "}
          <a href={LEGAL_WEBSITE_URL} className="text-primary hover:underline">
            {LEGAL_WEBSITE_URL}
          </a>
          . By using the Service, you agree to this Policy. If you do not agree,
          please do not use the Service.
        </p>
      </section>

      <section>
        <h2>2. Information we collect</h2>
        <h3>Account information</h3>
        <p>
          When you register, we collect your name, email address, and password
          (stored in hashed form). If you sign in with Google, we receive profile
          information from Google according to your Google account settings.
        </p>
        <h3>Resume and profile data</h3>
        <p>
          If you upload a resume or enter profile details manually, we store the
          file metadata and extracted text (skills, experience, projects, contact
          details you provide) to power proposal generation and job matching.
        </p>
        <h3>Job and proposal content</h3>
        <p>
          Job descriptions you paste, generated proposals, edits, and related
          analysis (for example match scores) are stored in your account history.
        </p>
        <h3>Usage and technical data</h3>
        <p>
          We collect information about how you use the Service (such as feature
          usage and proposal counts), IP address, browser type, device
          information, and cookies or similar technologies used for authentication
          and security.
        </p>
        <h3>Payment information</h3>
        <p>
          If you purchase a paid plan, payment is processed by our payment
          provider (merchant of record). We do not store full credit card numbers
          on our servers. We may receive billing status, subscription tier,
          transaction identifiers, and limited billing contact details from the
          payment provider.
        </p>
      </section>

      <section>
        <h2>3. How we use information</h2>
        <p>We use your information to:</p>
        <ul>
          <li>Provide, maintain, and improve the Service;</li>
          <li>Authenticate you and secure your account;</li>
          <li>Generate and store AI-assisted proposals and job analysis;</li>
          <li>Send transactional emails (verification codes, password reset, service notices);</li>
          <li>Enforce usage limits and prevent abuse;</li>
          <li>Process subscriptions and comply with payment provider requirements;</li>
          <li>Comply with legal obligations and respond to lawful requests.</li>
        </ul>
      </section>

      <section>
        <h2>4. AI processing</h2>
        <p>
          To generate proposals and analyze jobs, we send relevant portions of
          your resume text, job descriptions, and prompts to third-party AI
          providers (such as Groq). Those providers process data according to
          their own policies. We instruct processing only for providing the
          Service, not for training public models where we can control such
          settings.
        </p>
      </section>

      <section>
        <h2>5. How we share information</h2>
        <p>We may share information with:</p>
        <ul>
          <li>
            <strong>Infrastructure providers</strong> (for example hosting on
            Vercel and database services such as MongoDB Atlas) to run the
            Service;
          </li>
          <li>
            <strong>Authentication providers</strong> (Google OAuth) when you
            choose Google sign-in;
          </li>
          <li>
            <strong>Email delivery providers</strong> to send OTP and account
            emails;
          </li>
          <li>
            <strong>AI providers</strong> to perform text generation and analysis;
          </li>
          <li>
            <strong>Payment processors</strong> when you subscribe to paid plans;
          </li>
          <li>
            <strong>Legal and safety</strong> when required by law or to protect
            rights, safety, and integrity of the Service.
          </li>
        </ul>
        <p>We do not sell your personal information.</p>
      </section>

      <section>
        <h2>6. Cookies and session data</h2>
        <p>
          We use cookies and similar technologies for login sessions (NextAuth),
          security, and preferences (such as theme). You can control cookies
          through your browser; disabling them may limit sign-in functionality.
        </p>
      </section>

      <section>
        <h2>7. Data retention</h2>
        <p>
          We retain your account data while your account is active. You may delete
          your account from Settings, after which we delete or anonymize personal
          data within a reasonable period, except where we must retain data for
          legal, security, or backup purposes.
        </p>
      </section>

      <section>
        <h2>8. International transfers</h2>
        <p>
          Your data may be processed in countries other than your own (including
          the United States and regions where our providers operate). We use
          appropriate safeguards where required by applicable law.
        </p>
      </section>

      <section>
        <h2>9. Your rights</h2>
        <p>
          Depending on your location, you may have rights to access, correct,
          delete, or export your personal data, or to object to or restrict
          certain processing. To exercise these rights, contact us at{" "}
          <a
            href={`mailto:${LEGAL_CONTACT_EMAIL}`}
            className="text-primary hover:underline"
          >
            {LEGAL_CONTACT_EMAIL}
          </a>
          . You may also delete your account in the app Settings.
        </p>
      </section>

      <section>
        <h2>10. Children</h2>
        <p>
          The Service is not intended for users under 16 (or the minimum age in
          your jurisdiction). We do not knowingly collect data from children.
        </p>
      </section>

      <section>
        <h2>11. Changes</h2>
        <p>
          We may update this Privacy Policy from time to time. We will post the
          updated version on this page and update the &quot;Last updated&quot;
          date. Continued use after changes means you accept the updated Policy.
        </p>
      </section>

      <section>
        <h2>12. Contact</h2>
        <p>
          For privacy questions or requests, contact{" "}
          <a
            href={`mailto:${LEGAL_CONTACT_EMAIL}`}
            className="text-primary hover:underline"
          >
            {LEGAL_CONTACT_EMAIL}
          </a>
          .
        </p>
      </section>
    </LegalPageLayout>
  );
}
