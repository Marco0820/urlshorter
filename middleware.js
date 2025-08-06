const createMiddleware = require('next-intl/middleware');

const locales = ['en', 'zh'];
const defaultLocale = 'zh';

module.exports = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always',
  localeDetection: false
});

module.exports.config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|ads.txt|robots.txt).*)', '/(zh|en)/:path*']
}; 