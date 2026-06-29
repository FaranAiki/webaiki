import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

const locales = ['en', 'id', 'zh', 'jp', 'ru', 'fr', 'ar', 'es', 'ko', 'de', 'nl', 'ha', 'he', 'el', 'hi', 'pt', 'bn', 'vi'];
const defaultLocale = 'id';

const base_cspHeader = `
    default-src 'self' https://ndutyvnkhavzchhjmzfm.supabase.co;
    script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://platform.twitter.com https://platform.x.com https://cloud.umami.is ${
      process.env.NODE_ENV === 'development' ? "'unsafe-eval'" : ''
    };
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://platform.twitter.com;
    img-src 'self' blob: data: https://static.wikia.nocookie.net https://i.ytimg.com https://placehold.co https://*.wikimedia.org https://webaiki.vercel.app https://faranaiki.id https://faranaiki.site https://storage.googleapis.com https://cloud.umami.is https://api-gateway.umami.dev https://gateway.umami.is https://ndutyvnkhavzchhjmzfm.supabase.co https://*.twitter.com https://*.twimg.com https://*.instagram.com https://*.tiktokcdn.com https://*.tiktok.com https://*.fbcdn.net https://github-readme-stats.vercel.app https://github-readme-activity-graph.vercel.app;
    font-src 'self' blob: data: https://fonts.gstatic.com https://unpkg.com;
    object-src 'none';
    base-uri 'none';
    form-action 'self';
    frame-ancestors 'self';
    frame-src 'self' https://analitica-graph.web.app https://analitica-graph.firebaseapp.com https://open.spotify.com https://w.soundcloud.com https://www.google.com/recaptcha/ https://recaptcha.google.com/ https://platform.twitter.com https://syndication.twitter.com https://*.instagram.com https://www.instagram.com https://*.tiktok.com https://www.tiktok.com https://www.youtube.com;
    connect-src 'self' https://generativelanguage.googleapis.com https://cdn.jsdelivr.net https://faranaiki.id https://fonts.gstatic.com https://www.gstatic.com https://fonts.googleapis.com https://cloud.umami.is https://api-gateway.umami.dev https://gateway.umami.is https://unpkg.com https://ndutyvnkhavzchhjmzfm.supabase.co https://www.google.com/recaptcha/ https://www.google.com https://*.twitter.com https://*.instagram.com https://*.tiktok.com;
    worker-src 'self' blob:;
    ${process.env.NODE_ENV === 'production' ? 'upgrade-insecure-requests;' : ''}
  `.replace(/\s{2,}/g, ' ').trim()

/**
 * Intercepts incoming HTTP requests to handle internationalization (i18n) routing, 
 * session state updates, and dynamic security headers.
 *
 * I.S.: An incoming HTTP request is received. The request may lack a localized URL prefix, 
 *       an updated authentication session, or necessary security headers.
 * F.S.: The request is either redirected to a properly localized URL prefix, or it is passed 
 *       to the application router with injected Content-Security-Policy headers and updated 
 *       Supabase session cookies.
 *
 * @param request The incoming Next.js request object.
 * @returns The resulting Next.js response, potentially containing redirection or modified headers.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Check if the current URL already has a language prefix
  const pathnameHasLocale = locales.some(
    (loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`
  );

  // 2. Optimized Redirection Logic
  if (!pathnameHasLocale) {
    // Detect Language
    const cookieLang = request.cookies.get('language')?.value;
    let locale = defaultLocale;
    
    if (cookieLang && locales.includes(cookieLang)) {
      locale = cookieLang;
    } else {
      const acceptLanguage = request.headers.get('accept-language');
      if (acceptLanguage) {
        const preferredLocales = acceptLanguage.split(',').map(lang => {
          const [code] = lang.split(';')[0].split('-');
          return code.trim().toLowerCase();
        });
        for (const code of preferredLocales) {
          if (locales.includes(code)) {
            locale = code;
            break;
          }
        }
      }
    }

    request.nextUrl.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
    return NextResponse.redirect(request.nextUrl);
  }

  // 3. For non-redirected requests, handle session and security
  // Optimasi: Hanya update session jika ada cookie supabase (mengurangi latensi untuk guest)
  const hasAuthCookie = request.cookies.getAll().some(c => c.name.startsWith('sb-'));
  
  // Optimasi Algoritma: Skip updateSession untuk navigasi client-side (RSC)
  // karena Next.js memanggil middleware pada setiap klik link (RSC request).
  // Memanggil Supabase API di setiap klik akan membuat transisi halaman lemot (+300ms).
  const isClientNavigation = request.headers.get('rsc') === '1' || request.headers.get('next-router-prefetch') === '1';
  
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  request.headers.set('x-nonce', nonce);

  let response = NextResponse.next({ request });
  if (hasAuthCookie && !isClientNavigation) {
    response = await updateSession(request);
  }

  // Security headers (CSP)
  let finalCspHeader = base_cspHeader;
  
  if (pathname.includes('/project/uas_matematika_dasar')) {
    finalCspHeader = finalCspHeader.replace("frame-ancestors 'self';", "frame-ancestors *;");
  }

  const isPythonProject = pathname.includes('/project/script');
  
  response.headers.set('Content-Security-Policy', finalCspHeader);
  
  if (isPythonProject) {
    response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
    response.headers.set('Cross-Origin-Embedder-Policy', 'credentialless');
  } else {
    response.headers.set('Cross-Origin-Opener-Policy', 'unsafe-none');
    response.headers.set('Cross-Origin-Embedder-Policy', 'unsafe-none');
  }

  return response;
}

export const config = {
  matcher: [
    // Optimization: Exclude more static paths, api routes, and common extensions
    '/((?!api|_next/static|_next/image|favicon.ico|images|documents|locales|fonts|icons|svg|site.webmanifest|.*\\..*).*)',
  ],
};
