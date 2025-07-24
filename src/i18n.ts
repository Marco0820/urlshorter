// src/i18n.ts
import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';
import path from 'path';
import fs from 'fs';

export const locales = ['en', 'zh'] as const;
export const defaultLocale = 'en' as const;

export default getRequestConfig(async ({ locale }) => {
  
  if (!locales.includes(locale as any)) notFound();

  const filePath = path.join(process.cwd(), 'src', 'messages', `${locale}.json`);
  const messages = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  console.log("Loading locale:", locale);
  console.log("Resolved path:", filePath);
  
  return { messages };
});
