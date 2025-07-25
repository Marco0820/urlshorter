// src/middleware.ts
import { NextRequest } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

export default createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: true,
});

export const config = {
  // 只匹配需要国际化处理的路径
  // 这将跳过所有看起来像短链接的路径，以及 API 调用和静态文件
  matcher: [
    // 明确匹配根路径
    '/',
    // 匹配所有带有语言前缀的页面
    '/(zh|en)/:path*',
  ]
};