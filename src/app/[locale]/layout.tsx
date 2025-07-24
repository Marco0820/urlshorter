// src/app/[locale]/layout.tsx
import { Inter } from "next/font/google";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, setRequestLocale} from 'next-intl/server';
import ClientBody from "../ClientBody";
import { Header } from "@/components/layout/Header";
import Providers from "../Providers";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export async function generateStaticParams() {
  return ['en', 'zh'].map((locale) => ({locale}));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const { locale } = await params;
  
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Providers> {/* Providers 组件应该包含 SessionProvider */}
            <ClientBody>
              <Header />
              {children}
            </ClientBody>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}