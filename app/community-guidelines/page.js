import Link from 'next/link';

export const metadata = {
  title: 'Community Guidelines — Strange In',
  description:
    'The rules that keep Strange In safe, genuine, and kind — aligned with Indian law.',
};

export default function CommunityGuidelines() {
  return (
    <main className="legal-page">
      <div className="section-eyebrow">Legal</div>
      <h1>
        Community <em>Guidelines</em>
      </h1>
      <p className="legal-updated">Last updated: 13 July 2026</p>

      <div className="legal-note">
        ⚖️ This document is a template prepared for Strange In. Before you go
        live, have it reviewed by a qualified lawyer and replace every
        [bracketed placeholder] with your real company details.
      </div>

      <p>
        Strange In exists so that strangers can become something more — safely.
        These Guidelines apply to everything you do on the platform: your
        profile, photos, blogs, comments, and chats. They work together with
        our <Link href="/terms">Terms of Service</Link> and{' '}
        <Link href="/privacy">Privacy Policy</Link>, and reflect our due
        diligence obligations under Rule 3(1)(b) of the Information Technology
        (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021.
      </p>
      <p>
        Breaking these rules can lead to content removal, warnings, feature
        restrictions, or a permanent ban — and where the law requires it,
        reporting to the authorities.
      </p>

      <h2>1. Be yourself — really</h2>
      <ul>
        <li>Use your own recent photos and your real first name and age.</li>
        <li>
          No impersonation of any person, celebrity, brand, or organisation.
        </li>
        <li>
          One account per person. Accounts created to evade a ban will be
          removed.
        </li>
      </ul>

      <h2>2. Adults only — zero tolerance on minors</h2>
      <ul>
        <li>
          You must be 18 or older. Profiles of, or photos featuring,
          unaccompanied minors are removed.
        </li>
        <li>
          Any content that sexualises, exploits, or endangers a child — or is
          paedophilic in nature — is removed immediately, the account is
          permanently banned, and the matter is reported to law enforcement as
          required under the POCSO Act, 2012 and Section 67B of the IT Act.
        </li>
      </ul>

      <h2>3. No harassment or hate</h2>
      <ul>
        <li>
          No stalking, threats, intimidation, bullying, or unwanted sexual
          messages. &ldquo;No&rdquo; means no — respect it the first time.
        </li>
        <li>
          No content that promotes hatred or violence against people on the
          basis of religion, caste, ethnicity, gender, sexual orientation,
          disability, or place of birth, or that threatens the unity,
          integrity, sovereignty, or security of India or public order.
        </li>
        <li>No doxxing: never share someone else&rsquo;s personal information
          (phone number, address, photos, chats) without their consent.</li>
      </ul>

      <h2>4. No sexual or obscene content</h2>
      <ul>
        <li>
          No nudity, pornography, or sexually explicit photos, blogs, or
          messages — publishing or transmitting obscene material is an offence
          under Sections 67 and 67A of the IT Act.
        </li>
        <li>
          Never share intimate images of another person without consent. This
          is a criminal offence under Section 66E of the IT Act and the
          Bharatiya Nyaya Sanhita, and results in an immediate permanent ban
          and reporting to authorities.
        </li>
        <li>No solicitation, escort services, or commercial sexual content.</li>
      </ul>

      <h2>5. No scams, spam, or commercial misuse</h2>
      <ul>
        <li>
          Never ask other users for money, gifts, financial details, or OTPs —
          romance scams lead to an instant permanent ban.
        </li>
        <li>
          No advertising, promotions, affiliate links, pyramid schemes,
          gambling or betting content, or repeated unsolicited messages —
          whether in chats or in blogs.
        </li>
        <li>
          No links to malware, phishing pages, or software designed to disrupt
          or gain unauthorised access to any system.
        </li>
      </ul>

      <h2>6. No illegal content or activity</h2>
      <ul>
        <li>
          No content that facilitates the sale of drugs, weapons, or other
          contraband, or that promotes terrorism, money laundering, or any
          activity illegal in India.
        </li>
        <li>
          No misinformation: do not knowingly share information that is
          patently false or misleading, or deceptive synthetic media
          (deepfakes) presented as real.
        </li>
        <li>
          No content that infringes copyright, trademarks, or other
          intellectual-property rights — post only what is yours to post.
        </li>
        <li>
          No content that insults or threatens another nation or violates any
          law for the time being in force in India.
        </li>
      </ul>

      <h2>7. Blogs: share stories, not spam</h2>
      <p>
        The Blogs section is for genuine writing — your travels, food,
        experiences, and creativity. In addition to everything above:
      </p>
      <ul>
        <li>Write original content or content you have the right to share.</li>
        <li>
          No clickbait, engagement farming, or reposting the same blog
          repeatedly.
        </li>
        <li>
          Keep it respectful — blogs about other users require their consent.
        </li>
      </ul>

      <h2>8. Reporting and enforcement</h2>
      <ul>
        <li>
          Use the in-app <strong>Report</strong> and <strong>Block</strong>{' '}
          buttons on any profile, blog, or chat. Reports are confidential.
        </li>
        <li>
          Our moderation team reviews reports and may remove content, restrict
          features, or ban accounts. We act on unlawful content upon actual
          knowledge as provided under the IT Act and IT Rules 2021.
        </li>
        <li>
          If you believe we made a mistake, you can appeal through the
          Grievance Officer below. If you are not satisfied with our
          resolution, you may appeal to the{' '}
          <strong>Grievance Appellate Committee (GAC)</strong> constituted by
          the Central Government within 30 days of our decision, at{' '}
          <a
            href="https://gac.gov.in"
            target="_blank"
            rel="noopener noreferrer"
          >
            gac.gov.in
          </a>
          .
        </li>
        <li>
          In an emergency or if you are in danger, contact your local police
          (dial <strong>112</strong>) first. Cybercrimes can also be reported
          on the National Cyber Crime Reporting Portal at{' '}
          <a
            href="https://cybercrime.gov.in"
            target="_blank"
            rel="noopener noreferrer"
          >
            cybercrime.gov.in
          </a>{' '}
          or helpline <strong>1930</strong>.
        </li>
      </ul>

      <h2>9. Grievance Officer</h2>
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
          resolved within <strong>15 days</strong>. Complaints relating to
          non-consensual intimate imagery or content exposing private parts are
          actioned within <strong>24 hours</strong> of the complaint, as
          required by the IT Rules 2021.
        </p>
      </div>

      <p style={{ marginTop: '40px' }}>
        Thank you for keeping Strange In a place where strangers can safely
        become something more. 💗
      </p>
    </main>
  );
}
