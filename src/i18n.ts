// src/i18n.ts
import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';
 
// Can be imported from a shared config
export const locales = ['en', 'zh'];
export const defaultLocale = 'en';
 
export default getRequestConfig(async () => {
  // Validate that the incoming `locale` parameter is valid
  const locale = 'en';
 
  if (!locales.includes(locale as any)) notFound();
 
  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});