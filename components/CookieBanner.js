'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const CONSENT_KEY = 'strangein-cookie-consent';

/**
 * Read the stored consent value: 'accepted' | 'declined' | null.
 * Other parts of the app can import this to decide whether to load
 * analytics / non-essential scripts.
 */
export function getCookieConsent() {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage.getItem(CONSENT_KEY);
  } catch {
    return null;
  }
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show if the visitor hasn't made a choice yet
    if (!getCookieConsent()) setVisible(true);
  }, []);

  const decide = (value) => {
    try {
      window.localStorage.setItem(CONSENT_KEY, value);
    } catch {
      // Storage unavailable (private mode etc.) — just hide for this session
    }
    setVisible(false);

    if (value === 'accepted') {
      // Load your non-essential scripts (analytics, marketing pixels) here.
      // Example:
      // loadGoogleAnalytics();
      window.dispatchEvent(new CustomEvent('cookie-consent', { detail: 'accepted' }));
    } else {
      window.dispatchEvent(new CustomEvent('cookie-consent', { detail: 'declined' }));
    }
  };

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-label="Cookie consent">
      <h4>
        A quick word about <span>cookies</span>
      </h4>
      <p>
        We use essential cookies to make Strange In work, and optional cookies
        to understand how the site is used and improve your experience. You can
        change your mind anytime. Read our{' '}
        <Link href="/privacy">Privacy Policy</Link> to learn more.
      </p>
      <div className="cookie-actions">
        <button className="cookie-btn accept" onClick={() => decide('accepted')}>
          Accept all
        </button>
        <button className="cookie-btn decline" onClick={() => decide('declined')}>
          Essential only
        </button>
      </div>
    </div>
  );
}
