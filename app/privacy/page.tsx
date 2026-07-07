import type { Metadata } from "next";
import { LegalShell, LegalSection } from "@/components/legal-shell";

export const metadata: Metadata = {
  title: "Privacy Policy | Hall Legacy Group",
  description: "How Hall Legacy Group collects, uses, and protects your information.",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy" updated="July 2026">
      <p>
        This Privacy Policy explains how Hall Legacy Group (&ldquo;Hall Legacy
        Group,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;)
        collects, uses, and protects information in connection with our website
        at thehalllegacygrp.com and our internal customer-management tools.
      </p>

      <LegalSection heading="Information We Collect">
        <p>
          When you submit an inspection request or otherwise contact us through
          our website, we collect the information you provide, which may include
          your name, phone number, email address, property or damage details,
          insurance carrier, and any message you send us.
        </p>
        <p>
          For our staff who sign in to our internal tools using Google, we
          receive basic Google account profile information (name and email
          address) for authentication, and, where the staff member grants it,
          access to their Google Calendar to create and manage appointment
          events they schedule in our tools.
        </p>
      </LegalSection>

      <LegalSection heading="How We Use Information">
        <p>We use the information we collect to:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>Respond to inquiries and schedule inspections;</li>
          <li>Provide insurance restoration services and coordinate your claim;</li>
          <li>Create and manage appointments on our staff&rsquo;s calendars;</li>
          <li>Operate, maintain, and improve our services.</li>
        </ul>
      </LegalSection>

      <LegalSection heading="Google User Data &amp; Limited Use">
        <p>
          Our use of information received from Google APIs adheres to the{" "}
          <a
            href="https://developers.google.com/terms/api-services-user-data-policy"
            className="text-brand-700 underline"
            target="_blank"
            rel="noreferrer"
          >
            Google API Services User Data Policy
          </a>
          , including the Limited Use requirements. Specifically, Google Calendar
          access is used solely to create and manage calendar events for
          appointments scheduled by the signed-in staff member. We do not use
          Google user data for advertising, we do not sell it, and we do not
          share it with third parties except as necessary to provide this
          feature or as required by law.
        </p>
      </LegalSection>

      <LegalSection heading="How We Share Information">
        <p>
          We do not sell your personal information. We share information only
          with service providers that help us operate our website and tools
          (such as our hosting, database, and email providers) under
          confidentiality obligations, or when required by law.
        </p>
      </LegalSection>

      <LegalSection heading="Data Retention &amp; Security">
        <p>
          We retain information for as long as needed to provide our services
          and meet legal obligations, and we use reasonable administrative and
          technical safeguards to protect it. No method of transmission or
          storage is completely secure.
        </p>
      </LegalSection>

      <LegalSection heading="Your Choices">
        <p>
          You may request access to, correction of, or deletion of the personal
          information you have provided by contacting us using the details
          below. Staff may revoke our access to their Google account at any time
          via their Google account settings.
        </p>
      </LegalSection>

      <LegalSection heading="Contact Us">
        <p>
          Hall Legacy Group<br />
          Email:{" "}
          <a href="mailto:Ferrakohn@thehalllegacygrp.com" className="text-brand-700 underline">
            Ferrakohn@thehalllegacygrp.com
          </a>
          <br />
          Phone: (901) 659-3612
        </p>
      </LegalSection>
    </LegalShell>
  );
}
