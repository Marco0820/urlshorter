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
  matcher: ['/', '/(zh|en)/:path*']
}; 