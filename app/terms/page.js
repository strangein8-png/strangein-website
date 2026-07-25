import Link from 'next/link';

export const metadata = {
  title: 'Terms of Service — Strange In',
  description:
    'The terms that govern your use of the Strange In app and website.',
};

export default function TermsOfService() {
  return (
    <main className="legal-page">
      <div className="section-eyebrow">Legal</div>
      <h1>
        Terms of <em>Service</em>
      </h1>
      <p className="legal-updated">Last updated: 13 July 2026</p>

      <div className="legal-note">
        ⚖️ This document is a template prepared for Strange In. Before you go
        live, have it reviewed by a qualified lawyer and replace every
        [bracketed placeholder] with your real company details.
      </div>

      <p>
        These Terms of Service (&ldquo;Terms&rdquo;) are an electronic record
        under the Information Technology Act, 2000 and the rules made
        thereunder. They form a legally binding agreement between you and{' '}
        <strong>[Company Legal Name]</strong> (&ldquo;Strange In&rdquo;,
        &ldquo;we&rdquo;, &ldquo;us&rdquo;) and govern your access to and use
        of the Strange In mobile application, website, and related services
        (the &ldquo;Services&rdquo;). This document does not require a physical
        or digital signature.
      </p>
      <p>
        By creating an account or using the Services, you accept these Terms,
        our <Link href="/privacy">Privacy Policy</Link>, and our{' '}
        <Link href="/community-guidelines">Community Guidelines</Link>. If you
        do not agree, do not use the Services.
      </p>

      <h2>1. Eligibility</h2>
      <ul>
        <li>
          You must be <strong>at least 18 years old</strong> and competent to
          contract under the Indian Contract Act, 1872.
        </li>
        <li>
          You must not have been previously banned from the Services or
          convicted of an offence involving violence, harassment, or sexual
          misconduct.
        </li>
        <li>
          You may create only one account, for yourself, using accurate
          information.
        </li>
      </ul>

      <h2>2. Your account</h2>
      <ul>
        <li>
          You are responsible for keeping your login credentials and OTPs
          confidential and for all activity under your account.
        </li>
        <li>
          You agree to provide truthful, current information, including your
          real age and genuine photos of yourself.
        </li>
        <li>
          Notify us immediately at{' '}
          <a href="mailto:support@strangein.example">
            support@strangein.example
          </a>{' '}
          if you suspect unauthorised use of your account.
        </li>
      </ul>

      <h2>3. Licence to use the Services</h2>
      <p>
        We grant you a personal, limited, non-exclusive, non-transferable,
        revocable licence to use the Services for their intended purpose:
        meeting, chatting, and sharing content with other genuine users. You
        may not use the Services for any commercial, promotional, or unlawful
        purpose without our written consent.
      </p>

      <h2>4. Your content</h2>
      <ul>
        <li>
          You retain ownership of the content you post — including profile
          photos, blogs, and messages (&ldquo;User Content&rdquo;).
        </li>
        <li>
          By posting User Content, you grant us a worldwide, royalty-free,
          non-exclusive licence to host, store, display, reproduce, and
          distribute it solely to operate, promote, and improve the Services.
          This licence ends when your content is deleted from our systems.
        </li>
        <li>
          You represent that you own or have the rights to everything you post
          and that it does not infringe anyone else&rsquo;s rights.
        </li>
        <li>
          User Content must comply with our{' '}
          <Link href="/community-guidelines">Community Guidelines</Link> and
          Rule 3(1)(b) of the IT Rules 2021. We may remove content or restrict
          accounts that violate them.
        </li>
      </ul>

      <h2>5. Prohibited conduct</h2>
      <p>You agree not to:</p>
      <ul>
        <li>
          Misrepresent your identity, age, or affiliation, or impersonate any
          person;
        </li>
        <li>
          Harass, stalk, threaten, defame, or abuse any user, or solicit money
          or financial information from users;
        </li>
        <li>
          Post content that is obscene, pornographic, paedophilic, invasive of
          another&rsquo;s privacy, hateful, or otherwise prohibited under the
          IT Act and IT Rules 2021;
        </li>
        <li>
          Use bots, scrapers, or automated means to access the Services, or
          attempt to probe, hack, or disrupt our systems (punishable under
          Sections 43 and 66 of the IT Act);
        </li>
        <li>
          Upload viruses or malicious code, or interfere with other
          users&rsquo; enjoyment of the Services;
        </li>
        <li>
          Advertise, spam, or promote third-party products or services without
          our permission.
        </li>
      </ul>

      <h2>6. Safety</h2>
      <p>
        We verify photos and moderate reported content, but{' '}
        <strong>
          we do not conduct criminal background checks on users
        </strong>{' '}
        and cannot guarantee the identity, intentions, or conduct of any user.
        You are solely responsible for your interactions. Exercise caution when
        sharing personal information and when meeting anyone in person — meet
        in public places and tell someone you trust.
      </p>

      <h2>7. Purchases and subscriptions</h2>
      <p>
        If we offer paid features, prices will be shown before purchase in
        Indian Rupees (inclusive of applicable GST). Payments made through app
        stores are also governed by the respective store&rsquo;s terms. Except
        where required by law, payments are non-refundable once the paid
        feature has been delivered. Subscription auto-renewal, if offered, can
        be cancelled anytime from your store account settings before the
        renewal date.
      </p>

      <h2>8. Termination</h2>
      <ul>
        <li>
          You may delete your account at any time from the app settings.
        </li>
        <li>
          We may suspend or terminate your account, with or without notice, if
          you breach these Terms, the Community Guidelines, or applicable law,
          or if required by a lawful order.
        </li>
        <li>
          Sections that by their nature should survive termination (including
          content licences for backup copies, disclaimers, limitation of
          liability, and dispute resolution) will survive.
        </li>
      </ul>

      <h2>9. Intermediary status and content takedown</h2>
      <p>
        Strange In is an &ldquo;intermediary&rdquo; under Section 2(1)(w) of
        the IT Act with respect to User Content, and claims safe harbour under
        Section 79 subject to due diligence under the IT Rules 2021. We do not
        pre-screen all User Content, but we act on reports and remove unlawful
        content upon receiving actual knowledge through a court order or
        notification from an appropriate government agency, and in response to
        valid user grievances.
      </p>

      <h2>10. Disclaimers</h2>
      <p>
        The Services are provided on an &ldquo;as is&rdquo; and &ldquo;as
        available&rdquo; basis. To the maximum extent permitted by law, we
        disclaim all warranties, express or implied, including fitness for a
        particular purpose and non-infringement. We do not warrant that you
        will find a match, that the Services will be uninterrupted or
        error-free, or that content posted by users is accurate.
      </p>

      <h2>11. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by applicable law, [Company Legal Name]
        and its directors, employees, and partners will not be liable for any
        indirect, incidental, special, consequential, or punitive damages, or
        for the conduct of any user, whether online or offline. Our total
        aggregate liability for any claim arising from the Services will not
        exceed the greater of ₹5,000 or the amount you paid us in the 12 months
        preceding the claim. Nothing in these Terms limits liability that
        cannot be limited under Indian law.
      </p>

      <h2>12. Indemnity</h2>
      <p>
        You agree to indemnify and hold harmless [Company Legal Name] from
        claims, losses, and expenses (including reasonable legal fees) arising
        from your User Content, your use of the Services, or your breach of
        these Terms or applicable law.
      </p>

      <h2>13. Governing law and dispute resolution</h2>
      <p>
        These Terms are governed by the laws of India. Subject to any
        mandatory consumer-protection rights you may have, the courts at{' '}
        <strong>[City, State]</strong> will have exclusive jurisdiction over
        disputes arising out of or relating to these Terms or the Services.
      </p>

      <h2>14. Changes to these Terms</h2>
      <p>
        We may revise these Terms from time to time. Material changes will be
        notified through the app or by email at least [15] days before they
        take effect. Your continued use after the effective date constitutes
        acceptance.
      </p>

      <h2>15. Grievance Officer</h2>
      <p>
        In accordance with the IT Act and the IT Rules 2021, complaints about
        these Terms, the Services, or content on the platform may be addressed
        to:
      </p>
      <div className="contact-card">
        <h3>Grievance Officer</h3>
        <p>
          <strong>Name:</strong> [Full name of Grievance Officer]
        </p>
        <p>
          <strong>Email:</strong>{' '}
          <a href="mailto:grievance@strangein.example">
            grievance@strangein.example
          </a>
        </p>
        <p>
          <strong>Address:</strong> [Office address, India]
        </p>
        <p style={{ marginTop: '12px' }}>
          Complaints are acknowledged within <strong>24 hours</strong> and
          resolved within <strong>15 days</strong>, as required by the IT Rules
          2021.
        </p>
      </div>
    </main>
  );
}
