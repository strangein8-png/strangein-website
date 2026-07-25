import Link from 'next/link';
import Reveal from '@/components/Reveal';
import BlogsSection from '@/components/BlogsSection';

const FEATURES = [
  {
    title: 'Swipe with intent',
    text: 'Full-bleed profile cards with prompts, interest tags, and distance — so every like means something more than a photo.',
    icon: (
      <path d="M12 21C7 16.5 3 12.8 3 8.9 3 6 5.2 4 7.6 4c1.6 0 3.2.8 4.4 2.6C13.2 4.8 14.8 4 16.4 4 18.8 4 21 6 21 8.9c0 3.9-4 7.6-9 12.1z" />
    ),
  },
  {
    title: 'Chats that flow',
    text: 'See who\u2019s online, pick up where you left off, and keep every conversation in one clean, distraction-free space.',
    icon: (
      <>
        <path d="M4 5h16v11H8l-4 4V5z" />
        <path d="M8 9h8M8 12h5" />
      </>
    ),
  },
  {
    title: 'Blogs, your way',
    text: 'Write about your travels, your food obsessions, your life. Your blogs live on your profile — the best conversation starters you\u2019ll ever have.',
    icon: (
      <>
        <path d="M5 4h14v16H5z" />
        <path d="M8 8h8M8 11h8M8 14h5" />
      </>
    ),
  },
  {
    title: 'Verified profiles',
    text: 'Photo verification and community reporting keep the space genuine, so the person you match is the person you meet.',
    icon: (
      <path d="M12 2l2.9 6.3 6.6.8-4.9 4.6 1.3 6.5L12 16.9 6.1 20.2l1.3-6.5L2.5 9.1l6.6-.8z" />
    ),
  },
  {
    title: 'Near you, for real',
    text: 'Discover people in your city and beyond — from Hyderabad to Vizag — with distance you can actually plan a chai around.',
    icon: (
      <>
        <circle cx="12" cy="10" r="3" />
        <path d="M12 2a8 8 0 0 1 8 8c0 5.3-8 12-8 12S4 15.3 4 10a8 8 0 0 1 8-8z" />
      </>
    ),
  },
  {
    title: 'Private by design',
    text: 'You control what you share and who sees it. Block, report, and manage your visibility in two taps.',
    icon: (
      <>
        <rect x="4" y="10" width="16" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    ),
  },
];

export default function Home() {
  return (
    <main>
      {/* ===== HERO ===== */}
      <header className="hero" id="top">
        <div>
          <div className="hero-eyebrow">A dating &amp; social app</div>
          <h1>
            Strangers,
            <br />
            until they <em>aren&rsquo;t.</em>
          </h1>
          <p className="lead">
            Strange In is where a swipe becomes a conversation, and a
            conversation becomes something you didn&rsquo;t see coming. Match,
            chat, and share your world through blogs — all in one place.
          </p>
          <div className="hero-actions">
            <Link className="btn-primary" href="/#download">
              Download Strange In
            </Link>
            <Link className="btn-ghost" href="/#blogs">
              Read the blogs
            </Link>
          </div>
          <div className="hero-meta">
            <div>
              <strong>50K+</strong>
              <span>Matches made</span>
            </div>
            <div>
              <strong>12K+</strong>
              <span>Blogs shared</span>
            </div>
            <div>
              <strong>4.8★</strong>
              <span>App rating</span>
            </div>
          </div>
        </div>

        <div className="hero-visual">
          <div className="float-chip chip-1">
            💌 <strong>Saisri liked you</strong> — say hello?
          </div>
          <div className="float-chip chip-2">
            ✨ <strong>It&rsquo;s a match!</strong> You &amp; Priya
          </div>
          <div className="phone">
            <div className="phone-screen">
              <div className="phone-top">
                <div className="phone-brand">
                  Strange <em>In</em>
                </div>
                <div className="phone-avatar">
                  <div>👤</div>
                </div>
              </div>
              <div className="swipe-card">
                <div className="glow" />
                <div className="swipe-quote">
                  &ldquo;Looking for someone to get lost in old city lanes
                  with…&rdquo;
                </div>
                <div className="swipe-info">
                  <div className="swipe-name">
                    Saisri <small>25</small>
                  </div>
                  <div className="swipe-dist">📍 3 km away · Hyderabad</div>
                  <div className="swipe-tags">
                    <span>☕ Chai</span>
                    <span>🎬 Cinema</span>
                    <span>✈️ Travel</span>
                  </div>
                </div>
              </div>
              <div className="phone-actions">
                <div className="pa">✕</div>
                <div className="pa like">❤</div>
                <div className="pa">⭐</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ===== FEATURES ===== */}
      <section className="features" id="features">
        <Reveal>
          <div className="section-eyebrow">Why Strange In</div>
          <h2>
            More than a swipe.
            <br />
            It&rsquo;s a <em>story</em> waiting to start.
          </h2>
          <p className="section-sub">
            Every feature is built to help you show who you really are — not
            just what you look like.
          </p>
        </Reveal>
        <div className="features-grid">
          {FEATURES.map((f) => (
            <Reveal className="feature-card" key={f.title}>
              <div className="feature-icon">
                <svg viewBox="0 0 24 24">{f.icon}</svg>
              </div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== BLOGS ===== */}
      <BlogsSection />

      {/* ===== STORY BAND ===== */}
      <section className="band" id="stories">
        <Reveal>
          <blockquote>
            &ldquo;We matched over a blog about street food. Six months later,
            we&rsquo;re still <em>arguing</em> about the best dosa in the
            city.&rdquo;
          </blockquote>
          <cite>— Meghana &amp; Vikram, matched on Strange In</cite>
        </Reveal>
      </section>

      {/* ===== DOWNLOAD ===== */}
      <section className="download" id="download">
        <Reveal>
          <div className="section-eyebrow">Get started</div>
          <h2>
            Your next <em>favourite person</em>
            <br />
            is one download away.
          </h2>
          <p className="section-sub">
            Free to join. Takes two minutes to set up. Takes one match to
            change everything.
          </p>
          <div className="store-btns">
            <a className="store-btn" href="#" aria-label="Get it on Google Play">
              <svg viewBox="0 0 24 24">
                <path d="M3.6 1.8L13.7 12 3.6 22.2c-.4-.2-.6-.6-.6-1.2V3c0-.6.2-1 .6-1.2zM14.8 13.1l2.6 2.6-11 6.2 8.4-8.8zM17.4 8.3l-2.6 2.6-8.4-8.8 11 6.2zM18.8 9.1l2.7 1.5c.9.5.9 1.7 0 2.2l-2.7 1.5-2.9-2.6 2.9-2.6z" />
              </svg>
              <span className="txt">
                <small>GET IT ON</small>
                <strong>Google Play</strong>
              </span>
            </a>
            <a
              className="store-btn"
              href="#"
              aria-label="Download on the App Store"
            >
              <svg viewBox="0 0 24 24">
                <path d="M17.1 12.6c0-2.4 2-3.6 2.1-3.7-1.1-1.7-2.9-1.9-3.5-1.9-1.5-.2-2.9.9-3.7.9-.8 0-2-.9-3.2-.9-1.7 0-3.2 1-4 2.4-1.7 3-.4 7.4 1.2 9.8.8 1.2 1.8 2.5 3 2.5 1.2 0 1.7-.8 3.1-.8s1.9.8 3.2.8c1.3 0 2.2-1.2 3-2.4.9-1.4 1.3-2.7 1.3-2.8-.1 0-2.5-1-2.5-3.9zM14.7 5.2c.7-.8 1.1-1.9 1-3-1 0-2.1.7-2.8 1.5-.6.7-1.2 1.9-1 2.9 1.1.1 2.2-.6 2.8-1.4z" />
              </svg>
              <span className="txt">
                <small>DOWNLOAD ON THE</small>
                <strong>App Store</strong>
              </span>
            </a>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
