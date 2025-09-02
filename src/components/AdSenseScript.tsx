
'use client';

import Script from 'next/script';
import { useAdSense } from '@/lib/AdSenseContext';

export default function AdSenseScript() {
  const { showAdsense } = useAdSense();

  if (!showAdsense) {
    return null;
  }

  return (
    <Script
      id="adsbygoogle-init"
      strategy="afterInteractive"
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4690050292021329"
      crossOrigin="anonymous"
    />
  );
}
