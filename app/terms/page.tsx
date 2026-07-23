import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import {
  LEGAL_CONTACT_EMAIL,
  LEGAL_ENTITY_NAME,
  LEGAL_SITE_NAME,
  LEGAL_WEBSITE_URL,
} from "@/lib/legal/site";

export const metadata: Metadata = {
  title: `Terms of Service — ${LEGAL_SITE_NAME}`,
  description: `Terms and conditions for using ${LEGAL_SITE_NAME}.`,
};

export default function TermsOfServicePage() {
  return (
    <LegalPageLayout title="Terms of Service">
      <section>
        <h2>1. Agreement</h2>
        <p>
          These Terms of Service (&quot;Terms&quot;) govern your access to and use
          of {LEGAL_SITE_NAME} (the &quot;Service&quot;) operated by{" "}
          {LEGAL_ENTITY_NAME} (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;)
          at{" "}
          <a href={LEGAL_WEBSITE_URL} className="text-primary hover:underline">
            {LEGAL_WEBSITE_URL}
          </a>
          . By creating an account or using the Service, you agree to these Terms
          and our{" "}
          <a href="/privacy" className="text-primary hover:underline">
            Privacy Policy
          </a>
          . If you do not agree, do not use the Service.
        </p>
      </section>

      <section>
        <h2>2. Description of the Service</h2>
        <p>
          {LEGAL_SITE_NAME} helps freelancers create Upwork proposals and related
          content using AI, including resume parsing, job analysis, and proposal
          generation. Features and limits may change over time. We may offer free
          and paid plans.
        </p>
      </section>

      <section>
        <h2>3. Eligibility</h2>
        <p>
          You must be at least 16 years old (or the age of majority in your
          jurisdiction) and able to form a binding contract. You are responsible
          for ensuring your use complies with Upwork&apos;s terms and applicable
          laws.
        </p>
      </section>

      <section>
        <h2>4. Accounts</h2>
        <p>
          You must provide accurate registration information and keep your
          credentials secure. You are responsible for activity under your account.
          Notify us promptly at{" "}
          <a
            href={`mailto:${LEGAL_CONTACT_EMAIL}`}
            className="text-primary hover:underline"
          >
            {LEGAL_CONTACT_EMAIL}
          </a>{" "}
          if you suspect unauthorized access.
        </p>
      </section>

      <section>
        <h2>5. Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the Service for unlawful, fraudulent, or harmful purposes;</li>
          <li>Upload malware or content you do not have rights to use;</li>
          <li>Attempt to bypass usage limits, rate limits, or security measures;</li>
          <li>Scrape, reverse engineer, or overload our systems without permission;</li>
          <li>Resell or sublicense the Service without our written consent;</li>
          <li>Misrepresent AI-generated content as guaranteed to win jobs or contracts.</li>
        </ul>
      </section>

      <section>
        <h2>6. Your content</h2>
        <p>
          You retain ownership of resumes, job text, and proposals you submit. You
          grant us a limited license to host, process, and transmit your content
          solely to operate and improve the Service (including AI processing as
          described in our Privacy Policy). You represent that you have the
          rights to submit such content.
        </p>
      </section>

      <section>
        <h2>7. AI-generated output</h2>
        <p>
          Outputs are generated automatically and may be inaccurate, incomplete,
          or unsuitable for a specific client. You are solely responsible for
          reviewing, editing, and submitting proposals on Upwork or elsewhere. We
          do not guarantee interviews, hires, or income. The Service is a writing
          assistant, not legal, tax, or professional advice.
        </p>
      </section>

      <section>
        <h2>8. Free and paid plans</h2>
        <p>
          Free plans include usage limits (for example, a monthly proposal quota).
          Paid subscriptions, when offered, are billed through our authorized
          payment provider. Prices, features, and limits will be shown at
          checkout. Unless stated otherwise at purchase, subscriptions renew
          automatically until canceled through your billing portal or as instructed
          in your receipt email.
        </p>
      </section>

      <section>
        <h2>9. Refunds and cancellations</h2>
        <p>
          Refund and cancellation rules follow the policy displayed at checkout
          and the payment provider&apos;s terms. Where required by law, you may
          have a right to withdraw from a digital service within a cooling-off
          period. Contact{" "}
          <a
            href={`mailto:${LEGAL_CONTACT_EMAIL}`}
            className="text-primary hover:underline"
          >
            {LEGAL_CONTACT_EMAIL}
          </a>{" "}
          for billing support; payment disputes may also be handled by the payment
          provider listed on your invoice.
        </p>
      </section>

      <section>
        <h2>10. Intellectual property</h2>
        <p>
          The Service, including software, branding, and design, is owned by us
          or our licensors. These Terms do not grant you any rights to our
          trademarks or code except as needed to use the Service.
        </p>
      </section>

      <section>
        <h2>11. Termination</h2>
        <p>
          You may stop using the Service and delete your account at any time. We
          may suspend or terminate access if you violate these Terms or if
          continued service poses risk to us or others. Upon termination, your
          right to use the Service ends; provisions that should survive (such as
          disclaimers and limitations of liability) remain in effect.
        </p>
      </section>

      <section>
        <h2>12. Disclaimers</h2>
        <p>
          THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot;
          WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING
          IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
          PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT UNINTERRUPTED OR
          ERROR-FREE OPERATION.
        </p>
      </section>

      <section>
        <h2>13. Limitation of liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE AND OUR SUPPLIERS WILL NOT
          BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
          PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, OR GOODWILL, ARISING
          FROM YOUR USE OF THE SERVICE. OUR TOTAL LIABILITY FOR ANY CLAIM RELATING
          TO THE SERVICE SHALL NOT EXCEED THE GREATER OF (A) THE AMOUNT YOU PAID
          US IN THE TWELVE MONTHS BEFORE THE CLAIM OR (B) USD $50.
        </p>
      </section>

      <section>
        <h2>14. Indemnification</h2>
        <p>
          You will defend and indemnify us against claims arising from your
          content, your use of the Service, or your violation of these Terms or
          third-party rights.
        </p>
      </section>

      <section>
        <h2>15. Governing law and disputes</h2>
        <p>
          These Terms are governed by the laws applicable to {LEGAL_ENTITY_NAME}{" "}
          as the operator of the Service, without regard to conflict-of-law
          rules. Courts in the operator&apos;s principal place of business have
          exclusive jurisdiction, except where mandatory consumer protection
          laws in your country require otherwise.
        </p>
      </section>

      <section>
        <h2>16. Changes</h2>
        <p>
          We may modify these Terms. We will post updates on this page and update
          the &quot;Last updated&quot; date. Material changes may be notified by
          email or in-app notice. Continued use after changes constitutes
          acceptance.
        </p>
      </section>

      <section>
        <h2>17. Contact</h2>
        <p>
          Questions about these Terms:{" "}
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
