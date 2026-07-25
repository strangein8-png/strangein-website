'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Nav() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <nav className="site-nav">
      <Link className="nav-logo" href="/">
        Strange <em>In</em>
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
        <Link href="/#features" onClick={close}>Features</Link>
        <Link href="/#blogs" onClick={close}>Blogs</Link>
        <Link href="/#stories" onClick={close}>Stories</Link>
        {/* <Link href="/admin/blogs" onClick={close}>Write a blog</Link> */}
        <Link href="/#download" className="nav-cta" onClick={close}>Get the app</Link>
      </div>
    </nav>
  );
}