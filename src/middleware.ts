// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

// 定义所有已知的、需要国际化处理的页面路径
const PUBLIC_PAGES = [
  '/',
  '/login',
  '/register',
  '/features/branded-domains',
  '/features/custom-links',
  '/features/how-it-works',
  '/features/link-analytics',
  '/analytics',
  '/my-urls',
  '/test',
];

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: true,
});

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 检查请求路径是否匹配任何一个公共页面（包括有 locale 前缀的情况）
  const isPublicPage = PUBLIC_PAGES.some(page => {
    if (page === '/') return pathname === '/' || locales.some(l => pathname === `/${l}`);
    return pathname === page || locales.some(l => pathname === `/${l}${page}`);
  });

  // 如果是公共页面，直接交给 next-intl 处理
  if (isPublicPage) {
    return intlMiddleware(request);
  }
  
  // 对于其他所有请求（我们假定它们是短链接）
  // 提取 shortCode
  const shortCode = pathname.substring(1);

  // 如果 shortCode 为空（这通常不应该发生，因为 / 已经被处理了）
  if (!shortCode) {
    return intlMiddleware(request);
  }

  // 构建重定向查询的 URL
  const fetchUrl = `${request.nextUrl.origin}/api/redirect/${shortCode}`;

  try {
    const response = await fetch(fetchUrl);

    if (response.ok) {
      const data = await response.json();
      if (data.url) {
        return NextResponse.redirect(new URL(data.url));
      }
    }
  } catch (error) {
    console.error(`Middleware redirect error for ${shortCode}:`, error);
  }

  // 如果短链接无效或查找失败，也交给 next-intl 处理，它会最终导向 404 页面
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // 匹配所有路径，除了 API、Next.js 内部路径、Vercel 路径和包含点的文件路径
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};