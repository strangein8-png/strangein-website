import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="foot-grid">
        <div>
          <div className="foot-brand">
            Strange <em>In</em>
          </div>
          <p>
            Connecting hearts, one story at a time. Match, chat, and blog your
            way to something real.
          </p>
        </div>
        <div className="foot-col">
          <h4>App</h4>
          <Link href="/#features">Features</Link>
          <Link href="/#blogs">Blogs</Link>
          <Link href="/#download">Download</Link>
        </div>
        <div className="foot-col">
          <h4>Company</h4>
          <Link href="/">About us</Link>
          <Link href="/">Careers</Link>
          <Link href="/">Contact</Link>
        </div>
        <div className="foot-col">
          <h4>Legal</h4>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
          <Link href="/community-guidelines">Community Guidelines</Link>
        </div>
      </div>
      <div className="foot-base">
        <span>© {new Date().getFullYear()} Strange In. All rights reserved.</span>
        <span>
          Made with <span style={{ color: 'var(--rose)' }}>♥</span> for the curious.
        </span>
      </div>
    </footer>
  );
}
