import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://urlshorter.cc'),
  title: {
    default: 'URL Shortener - Shorten Long URLs | urlshorter.cc',
    template: `%s | urlshorter.cc`,
  },
  description: "A fast and efficient URL shortener service, also known as TinyURL or bitly. Shorten, customize, and track your links with AI-powered insights. Best for creating short links for social media, email campaigns, and more.",
  keywords: ['url shortener', 'tiny url', 'TinyURL', 'bitly', 'rebrandly', 'short url', 'short link', 'link shortener', 'custom url', 'branded links', 'free url shortener'],
  openGraph: {
    title: 'URL Shortener - urlshorter.cc',
    description: 'The easiest way to shorten, track, and manage your links.',
    url: 'https://urlshorter.cc',
    siteName: 'urlshorter.cc',
    images: [
      {
        url: '/og-image.png', // To be created
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
    title: 'URL Shortener - urlshorter.cc',
    description: 'Shorten and manage your links with the best URL shortener.',
    // creator: '@yourtwitterhandle',
    images: ['/twitter-image.png'], // To be created
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientBody>
          {children}
        </ClientBody>
      </body>
    </html>
  );
}
