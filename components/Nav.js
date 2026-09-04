'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function Nav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <nav className="site-nav">
      <Link className="nav-logo" href="/">
        <Image
          src="/logo.jpeg"
          alt="Strange In — Connecting"
          width={40}
          height={40}
          className="nav-logo-img"
          priority
        />
        <span className="nav-logo-text">
          Strange <em>In</em>
        </span>
      </Link>

      <button
        className="nav-toggle"
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? '✕' : '☰'}
      </button>

      <div className={`nav-links ${open ? 'open' : ''}`}>
        <Link href="/features" onClick={close}>Features</Link>
        <Link href="/blogs" onClick={close}>Blogs</Link>
        <Link href="/stories" onClick={close}>Stories</Link>
        <Link href="/download" className="nav-cta" onClick={close}>Get the app</Link>
      </div>
    </nav>
  );
}