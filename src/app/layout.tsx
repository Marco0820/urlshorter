import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://urltiny.cc'),
  title: {
    default: 'Free URL Shortener - Create Short & Tiny URLs | urltiny.cc',
    template: `%s | urltiny.cc`,
  },
  description: "A free and easy-to-use URL shortener to change long URLs into short, tiny, and memorable links. Create custom URLs with our powerful link management platform.",
  openGraph: {
    title: 'Free URL Shortener - urltiny.cc',
    description: 'The easiest way to shorten, create, and share tiny URLs.',
    url: 'https://urltiny.cc',
    siteName: 'urltiny.cc',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free URL Shortener - urltiny.cc',
    description: 'Change long URLs into tiny, shareable links in seconds.',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/logo.png',
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Script
        id="adsbygoogle-init"
        strategy="afterInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4690050292021329"
        crossOrigin="anonymous"
      />
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-SM3H8HK2TP"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
        
          gtag('config', 'G-SM3H8HK2TP');
        `}
      </Script>
      <ClientBody>
        {children}
      </ClientBody>
    </html>
  );
}
