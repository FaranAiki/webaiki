import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'id', 'zh', 'jp', 'ru', 'fr', 'ar'];
const defaultLocale = 'id';

const base_cspHeader = `
    default-src 'self';
    script-src 'nonce-placeholder' 'strict-dynamic' 'wasm-unsafe-eval' ${
      process.env.NODE_ENV === 'development' ? "'unsafe-eval'" : ''
    };
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://static.wikia.nocookie.net https://i.ytimg.com https://placehold.co https://*.wikimedia.org https://webaiki.vercel.app https://faranaiki.id https://faranaiki.site https://storage.googleapis.com https://cloud.umami.is https://api-gateway.umami.dev;
    font-src 'self' https://fonts.gstatic.com;
    object-src 'none';
    base-uri 'none';
    form-action 'self';
    frame-ancestors 'none';
    frame-src 'self' https://analitica-graph.web.app https://analitica-graph.firebaseapp.com https://open.spotify.com https://w.soundcloud.com;
    connect-src 'self' https://generativelanguage.googleapis.com https://cdn.jsdelivr.net https://faranaiki.id https://fonts.gstatic.com https://www.gstatic.com https://fonts.googleapis.com https://cloud.umami.is https://api-gateway.umami.dev/api/send;
    worker-src 'self' blob:;
    ${process.env.NODE_ENV === 'production' ? 'upgrade-insecure-requests;' : ''}
  `.replace(/\s{2,}/g, ' ').trim()

// Security implementation for Content Security Policy and Nonce
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
    const redirectResponse = NextResponse.redirect(request.nextUrl);
    const isPythonRedirect = request.nextUrl.pathname.includes('/project/script');

    if (isPythonRedirect) {
      redirectResponse.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
    } else {
      redirectResponse.headers.set('Cross-Origin-Opener-Policy', 'unsafe-none');
    }
    
    redirectResponse.headers.set('Cross-Origin-Embedder-Policy', 'credentialless');
    redirectResponse.headers.set('Cross-Origin-Resource-Policy', 'cross-origin');
    return redirectResponse;
  }

  // Generate a random nonce and encode it as base64
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  const cspHeader = base_cspHeader.replace("nonce-placeholder", `nonce-${nonce}`)

  const requestHeaders = new Headers(request.headers);
  // Pass the nonce and CSP to the request headers
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', cspHeader);

  const isUasProject = pathname.includes('/project/uas_matematika_dasar');
  const isPythonProject = pathname.includes('/project/script');

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  let finalCspHeader = cspHeader;
  if (isUasProject) {
    // Specifically allow this project to be iframed by any origin
    finalCspHeader = finalCspHeader.replace("frame-ancestors 'none'", "frame-ancestors *");
  }

  response.headers.set('Content-Security-Policy', finalCspHeader);
  
  if (isPythonProject) {
    // Strict isolation ONLY for the route that needs SharedArrayBuffer (Python CLI)
    response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  } else {
    // Use unsafe-none for the rest of the site to avoid "security configuration mismatch" errors in Firefox
    // and to allow the UAS project to be iframed.
    response.headers.set('Cross-Origin-Opener-Policy', 'unsafe-none');
  }

  // Keep credentialless globally as it is the most compatible way to enable isolation when COOP is present,
  // and doesn't interfere when COOP is unsafe-none.
  response.headers.set('Cross-Origin-Embedder-Policy', 'credentialless');
  response.headers.set('Cross-Origin-Resource-Policy', 'cross-origin');

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
