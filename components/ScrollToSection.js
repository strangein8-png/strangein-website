'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const SECTION_MAP = {
  '/features': 'features',
  '/blogs': 'blogs',
  '/stories': 'stories',
  '/download': 'download',
};

export default function ScrollToSection() {
  const pathname = usePathname();

  useEffect(() => {
    const id = SECTION_MAP[pathname];

    if (id) {
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 60);
      }
    } else if (pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname]);

  return null;
}