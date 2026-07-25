'use client';

import { useEffect } from 'react';

export default function OneSignalInit() {
  useEffect(() => {
    const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;

    if (!appId) {
      console.warn(
        '[OneSignal] NEXT_PUBLIC_ONESIGNAL_APP_ID is not set — push notifications are disabled.'
      );
      return;
    }

    let cancelled = false;

    import('react-onesignal').then((mod) => {
      if (cancelled) return;
      const OneSignal = mod.default;

      OneSignal.init({
        appId,
        allowLocalhostAsSecureOrigin: true,
        notifyButton: { enable: true },
        serviceWorkerParam: { scope: '/' },
        serviceWorkerPath: 'OneSignalSDKWorker.js',
      }).catch((err) => console.error('[OneSignal] init failed', err));
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}