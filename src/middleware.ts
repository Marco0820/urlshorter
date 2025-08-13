// src/middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

// A list of all known pages in the app.
// This is used to distinguish between a page request and a short URL request.
const APP_PAGES = [
  '/',
  '/tos',
  '/privacy',
  '/cookies',
  '/login',
  '/register',
  '/features',
  '/analytics',
  '/my-urls',
  '/test', // From src/app/test/page.tsx
];

// Create the next-intl middleware for handling internationalization.
const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'as-needed'
});

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for API routes.
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  const hasLocale = locales.some(loc => pathname === `/${loc}` || pathname.startsWith(`/${loc}/`));
  const strippedPathname = hasLocale
    ? (() => {
        for (const loc of locales) {
          if (pathname === `/${loc}`) return '/';
          if (pathname.startsWith(`/${loc}/`)) return pathname.slice(loc.length + 1); // remove /{loc}
        }
        return pathname;
      })()
    : pathname;
  
  // A path is considered a page if it has a locale or if it's in our list of known pages.
  // The check for pages needs to be `startsWith` for sub-pages like /features/custom-links
  const isAppPage = hasLocale || APP_PAGES.some(page => {
    // Exact match for root page or pages without sub-routes
    if (pathname === page) return true;
    // Starts with check for pages that have sub-routes (e.g., /features/...)
    if (page !== '/') return pathname.startsWith(`${page}/`);
    return false;
  });

  // If it's not an app page and not the root, we assume it's a short URL.
  if (!isAppPage && strippedPathname !== '/') {
    // This is likely a short URL. Rewrite to the redirect API.
    const shortCode = strippedPathname.slice(1); // Remove leading '/'
    const url = request.nextUrl.clone();
    url.pathname = `/api/redirect/${shortCode}`;
    return NextResponse.rewrite(url);
  }

  // If it's an app page, let the i18n middleware handle it.
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - assets like images
     */
    '/((?!_next/static|_next/image|favicon.ico|logo.png|og.png|ads.txt|robots.txt).*)',
  ],
};
