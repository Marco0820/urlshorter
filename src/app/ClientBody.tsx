"use client";

import { SessionProvider } from 'next-auth/react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ["latin"] });

export default function ClientBody({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <body className={`${inter.className} bg-blue-800`}>
      {children}
    </body>
  );
}
