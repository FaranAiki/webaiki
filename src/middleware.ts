import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'id', 'zh', 'jp', 'ru', 'fr', 'ar'];
const defaultLocale = 'id';

const base_cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-placeholder' 'strict-dynamic' https: 'unsafe-inline' 'wasm-unsafe-eval' ${
      process.env.NODE_ENV === 'development' ? "'unsafe-eval'" : ''
    };
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://static.wikia.nocookie.net https://i.ytimg.com https://placehold.co https://*.wikimedia.org https://webaiki.vercel.app https://faranaiki.id https://faranaiki.site https://storage.googleapis.com https://cloud.umami.is https://api-gateway.umami.dev;
    font-src 'self' https://fonts.gstatic.com;
    object-src 'none';
    base-uri 'none';
    form-action 'self';
    frame-ancestors 'none';
    frame-src 'self' https://analitica-graph.web.app https://open.spotify.com https://w.soundcloud.com;
    connect-src 'self' https://cdn.jsdelivr.net https://faranaiki.id https://fonts.gstatic.com https://www.gstatic.com https://fonts.googleapis.com https://cloud.umami.is https://api-gateway.umami.dev/api/send;
    worker-src 'self' blob:;
    ${process.env.NODE_ENV === 'production' ? 'upgrade-insecure-requests;' : ''}
  `.replace(/\s{2,}/g, ' ').trim()

// This is for security shits
// I understand, but too lazy to implement it myself
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Get the language from the cookie
  const cookieLang = request.cookies.get('language')?.value;
  
  // 2. Validate the cookie or fallback to default
  const locale = locales.includes(cookieLang as string) ? cookieLang : defaultLocale;

  // 3. Check if the current URL already has a language prefix
  const pathnameHasLocale = locales.some(
    (loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`
  );

  // 4. If it doesn't have a prefix, redirect to the URL WITH the prefix
  if (!pathnameHasLocale) {
    request.nextUrl.pathname = `/${locale}${pathname}`;
    // E.g. incoming request is /about -> redirects to /en/about
    return NextResponse.redirect(request.nextUrl);
  }

  // randomized shit and make base64 so that it looks cool lol
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  const cspHeader = base_cspHeader.replace("nonce-placeholder", `nonce-${nonce}`)

  const requestHeaders = new Headers(request.headers);
  // send to header
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', cspHeader);

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set('Content-Security-Policy', cspHeader);

  return response;
}

// Ensure middleware runs on all routes except static assets
export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico|icon.ico|images|documents).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
