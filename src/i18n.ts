// src/i18n.ts
import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';
import en from './messages/en.json';
import zh from './messages/zh.json';

export const locales = ['en', 'zh'];
export const defaultLocale = 'en';

const messages: {[key: string]: any} = {
  en,
  zh
};

export default getRequestConfig(async ({locale}) => {
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: messages[locale]
  };
});
