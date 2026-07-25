import './globals.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import OneSignalInit from '@/components/OneSignalInit';

export const metadata = {
  title: 'Strange In — Strangers, until they aren\u2019t',
  description:
    'Strange In is a dating and social app where a swipe becomes a conversation. Match, chat, and share your world through blogs — all in one place.',
  keywords: ['dating app', 'social app', 'Strange In', 'match', 'chat', 'blogs'],
  openGraph: {
    title: 'Strange In — Strangers, until they aren\u2019t',
    description:
      'Match, chat, and share your world through blogs — all in one place.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Outfit:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <OneSignalInit />
        <Nav />
        {children}
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}