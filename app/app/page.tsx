import type { Metadata } from "next";
import { LegalShell, LegalSection } from "@/components/legal-shell";

export const metadata: Metadata = {
  title: "About the Hall Legacy Group Application",
  description:
    "Overview of the Hall Legacy Group internal CRM application, how staff sign in with Google, and how it uses Google Calendar.",
  robots: { index: true, follow: true },
};

export default function AppInfoPage() {
  return (
    <LegalShell title="Hall Legacy Group — Staff CRM Application" updated="July 2026">
      <LegalSection heading="What this application is">
        <p>
          Hall Legacy Group operates a private, web-based CRM (customer
          relationship management) application that our team uses to run our
          insurance-restoration business. Staff use it to manage inspection
          requests submitted on our website, customer records, restoration jobs,
          and appointments. The application is hosted at{" "}
          <strong>admin.thehalllegacygrp.com</strong> and is restricted to
          authorized Hall Legacy Group staff.
        </p>
      </LegalSection>

      <LegalSection heading="Signing in with Google">
        <p>
          Authorized staff may sign in to the application using their Google
          account. When they do, the application receives basic profile
          information (name and email address) to identify the user and grant
          access. Only email addresses that have been added to our internal
          admin allowlist can access any data.
        </p>
      </LegalSection>

      <LegalSection heading="How the application uses Google Calendar">
        <p>
          When a staff member schedules an appointment (such as a property
          inspection or walkthrough) inside the application, and has granted
          permission, the application uses the Google Calendar API
          (<code>calendar.events</code>) to add that appointment to{" "}
          <em>that staff member&rsquo;s own</em> Google Calendar, and to remove
          the event if the appointment is deleted.
        </p>
        <p>
          Calendar access is used only for this purpose. Our use of information
          received from Google APIs adheres to the{" "}
          <a
            href="https://developers.google.com/terms/api-services-user-data-policy"
            className="text-brand-700 underline"
            target="_blank"
            rel="noreferrer"
          >
            Google API Services User Data Policy
          </a>
          , including the Limited Use requirements. We do not use Google user
          data for advertising, we do not sell it, and we do not share it with
          third parties except as needed to provide this feature.
        </p>
      </LegalSection>

      <LegalSection heading="Learn more">
        <p>
          See our{" "}
          <a href="/privacy" className="text-brand-700 underline">Privacy Policy</a>{" "}
          and{" "}
          <a href="/terms" className="text-brand-700 underline">Terms of Service</a>.
          Questions? Contact us at{" "}
          <a href="mailto:Ferrakohn@thehalllegacygrp.com" className="text-brand-700 underline">
            Ferrakohn@thehalllegacygrp.com
          </a>{" "}
          or (901) 659-3612.
        </p>
      </LegalSection>
    </LegalShell>
  );
}
