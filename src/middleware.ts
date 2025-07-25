import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { locales, defaultLocale } from './i18n';

// A list of all known public-facing page paths.
// The middleware will check if a request path corresponds to one of these.
// If it does, it's treated as a normal page for internationalization.
// Otherwise, it's assumed to be a short link.
const publicPaths = [
  '/',
  '/login',
  '/register',
  '/features/branded-domains',
  '/features/custom-links',
  '/features/how-it-works',
  '/features/link-analytics',
  '/my-urls',
  '/test',
  // Note: /analytics/[shortCode] is dynamic, so we just check for the prefix.
  '/analytics'
];

const intlMiddleware = createIntlMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: true,
});

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // A request is for a public page if:
  // 1. It's the root path (`/` or `/en`, `/zh`, etc.).
  // 2. The path includes a known public path prefix.
  const isPublicPage =
    pathname === '/' ||
    locales.some(l => pathname === `/${l}`) ||
    publicPaths.some(path => {
      if (path === '/') return false; // Already handled
      // Use .includes() for paths that have dynamic sub-routes like /analytics/xyz
      if (path === '/analytics') return pathname.includes(path);
      // Use .endsWith() for other paths for more exact matching.
      return pathname.endsWith(path);
    });

  if (isPublicPage) {
    // It's a page, so let the i18n middleware handle it.
    return intlMiddleware(request);
  }

  // It's not a known page, so treat it as a short link.
  // Rewrite the request internally to the API handler.
  const rewriteUrl = new URL(`/api/redirect${pathname}`, request.url);
  return NextResponse.rewrite(rewriteUrl);
}

export const config = {
  // This matcher is crucial: it runs on all paths except for
  // internal Next.js assets and API routes.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};