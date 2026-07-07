import type { Metadata } from "next";
import { LegalShell, LegalSection } from "@/components/legal-shell";

export const metadata: Metadata = {
  title: "Terms of Service | Hall Legacy Group",
  description: "The terms governing use of the Hall Legacy Group website and services.",
  robots: { index: true, follow: true },
};

export default function TermsPage() {
  return (
    <LegalShell title="Terms of Service" updated="July 2026">
      <p>
        These Terms of Service (&ldquo;Terms&rdquo;) govern your use of the Hall
        Legacy Group website at thehalllegacygrp.com and any related services. By
        using our website or submitting a request, you agree to these Terms.
      </p>

      <LegalSection heading="Our Services">
        <p>
          Hall Legacy Group provides insurance restoration services, including
          inspections, claim coordination, and property restoration. Information
          on our website is for general purposes and does not constitute a
          binding offer or a guarantee of any specific outcome with your
          insurance carrier.
        </p>
      </LegalSection>

      <LegalSection heading="Requests &amp; Communications">
        <p>
          When you submit an inspection request, you authorize us to contact you
          using the phone number or email you provide. Any estimates or scopes of
          work are subject to inspection, your insurance carrier&rsquo;s
          approval, and a separate written agreement.
        </p>
      </LegalSection>

      <LegalSection heading="Intellectual Property">
        <p>
          The content, branding, and materials on this website are owned by Hall
          Legacy Group and may not be copied or reused without permission.
        </p>
      </LegalSection>

      <LegalSection heading="Disclaimers &amp; Limitation of Liability">
        <p>
          The website is provided &ldquo;as is&rdquo; without warranties of any
          kind. To the fullest extent permitted by law, Hall Legacy Group is not
          liable for any indirect or consequential damages arising from your use
          of the website.
        </p>
      </LegalSection>

      <LegalSection heading="Changes">
        <p>
          We may update these Terms from time to time. Continued use of the
          website after changes take effect constitutes acceptance of the updated
          Terms.
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
