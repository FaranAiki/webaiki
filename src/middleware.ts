import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

const locales = ['en', 'id', 'zh', 'jp', 'ru', 'fr', 'ar', 'es', 'ko', 'de', 'nl', 'ha', 'he', 'el', 'hi', 'pt', 'bn', 'vi'];
const defaultLocale = 'id';

const base_cspHeader = `
    default-src 'self' https://ndutyvnkhavzchhjmzfm.supabase.co;
    script-src 'nonce-placeholder' 'strict-dynamic' 'wasm-unsafe-eval' 'sha256-rbbnijHn7DZ6ps39myQ3cVQF1H+U/PJfHh5ei/Q2kb8=' 'sha256-n46vPwSWuMC0W703pBofImv82Z26xo4LXymv0E9caPk=' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://cloud.umami.is ${
      process.env.NODE_ENV === 'development' ? "'unsafe-eval'" : ''
    };
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://static.wikia.nocookie.net https://i.ytimg.com https://placehold.co https://*.wikimedia.org https://webaiki.vercel.app https://faranaiki.id https://faranaiki.site https://storage.googleapis.com https://cloud.umami.is https://api-gateway.umami.dev https://gateway.umami.is https://ndutyvnkhavzchhjmzfm.supabase.co;
    font-src 'self' blob: data: https://fonts.gstatic.com https://unpkg.com;
    object-src 'none';
    base-uri 'none';
    form-action 'self';
    frame-ancestors 'none';
    frame-src 'self' https://analitica-graph.web.app https://analitica-graph.firebaseapp.com https://open.spotify.com https://w.soundcloud.com https://www.google.com/recaptcha/ https://recaptcha.google.com/;
    connect-src 'self' https://generativelanguage.googleapis.com https://cdn.jsdelivr.net https://faranaiki.id https://fonts.gstatic.com https://www.gstatic.com https://fonts.googleapis.com https://cloud.umami.is https://api-gateway.umami.dev https://gateway.umami.is https://unpkg.com https://ndutyvnkhavzchhjmzfm.supabase.co https://www.google.com/recaptcha/ https://www.google.com;
    worker-src 'self' blob:;
    ${process.env.NODE_ENV === 'production' ? 'upgrade-insecure-requests;' : ''}
  `.replace(/\s{2,}/g, ' ').trim()

export async function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

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

    request.nextUrl.pathname = `/${locale}${pathname}`;
    const redirectResponse = NextResponse.redirect(request.nextUrl);
    
    // Minimal cookie handling for redirect
    const settingsParams = ['theme', 'color', 'presentation_mode', 'presentation_slide_format', 'settings-font', 'settings-align', 'settings-scale', 'settings-spacing', 'settings-lineheight'];
    settingsParams.forEach(param => {
      const value = searchParams.get(param);
      if (value !== null) {
        redirectResponse.cookies.set(`__set_${param}`, value, { maxAge: 60, path: '/', sameSite: 'lax' });
      }
    });

    return redirectResponse;
  }

  // 3. For non-redirected requests, handle session and security
  // Optimasi: Hanya update session jika ada cookie supabase (mengurangi latensi untuk guest)
  const hasAuthCookie = request.cookies.getAll().some(c => c.name.startsWith('sb-'));
  
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  request.headers.set('x-nonce', nonce);

  let response = NextResponse.next({ request });
  if (hasAuthCookie) {
    response = await updateSession(request);
  }

  // Security headers (CSP, Nonce)
  let finalCspHeader = base_cspHeader.replace("nonce-placeholder", `nonce-${nonce}`);
  
  if (pathname.includes('/project/uas_matematika_dasar')) {
    finalCspHeader = finalCspHeader.replace("frame-ancestors 'none'", "frame-ancestors *");
  }

  const isPythonProject = pathname.includes('/project/script');
  
  response.headers.set('Content-Security-Policy', finalCspHeader);
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  
  if (isPythonProject) {
    response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
    response.headers.set('Cross-Origin-Embedder-Policy', 'credentialless');
  } else {
    response.headers.set('Cross-Origin-Opener-Policy', 'unsafe-none');
    response.headers.set('Cross-Origin-Embedder-Policy', 'unsafe-none');
  }
  response.headers.set('Cross-Origin-Resource-Policy', 'cross-origin');

  // Sync settings from URL to cookies
  const settingsParams = ['theme', 'color', 'presentation_mode', 'presentation_slide_format', 'settings-font', 'settings-align', 'settings-scale', 'settings-spacing', 'settings-lineheight'];
  settingsParams.forEach(param => {
    const value = searchParams.get(param);
    if (value !== null) {
      response.cookies.set(`__set_${param}`, value, { maxAge: 60, path: '/', sameSite: 'lax' });
    }
  });

  return response;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|documents|locales|.*\\..*).*)',
  ],
};
