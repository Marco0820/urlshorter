// src/app/[locale]/layout.tsx
import { Inter } from "next/font/google";
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, setRequestLocale} from 'next-intl/server';
import ClientBody from "../ClientBody";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer"; // Import the Footer
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
  params: {locale: string};
}) {
  // Using the locale parameter from the URL, we can set the language for the request.
  setRequestLocale(params.locale);
  const messages = await getMessages();

  return (
    <>
      <head>
        <link rel="icon" href={`/favicon.ico?v=${new Date().getTime()}`} />
      </head>
      <body className={`${inter.className} bg-blue-800`}>
        <NextIntlClientProvider locale={params.locale} messages={messages}>
          <Providers>
            <ClientBody>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">
                  {children}
                </main>
                <Footer />
              </div>
            </ClientBody>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </>
  );
}
