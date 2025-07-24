// src/middleware.ts
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: true
});

export const config = {
  matcher: [
    // 匹配根路径和所有需要国际化的路径
    '/',
    '/(en|zh)/:path*',
    // 或者使用更通用的匹配器（推荐）
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};