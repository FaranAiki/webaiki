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

// Security implementation for Content Security Policy and Nonce
export async function middleware(request: NextRequest) {
  // 1. Update Supabase session
  const supabaseResponse = await updateSession(request);
  
  const { pathname, searchParams } = request.nextUrl;

  // Capture settings from URL query parameters
  const settingsParams = [
    'theme',
    'color',
    'presentation_mode',
    'presentation_slide_format',
    'settings-font',
    'settings-align',
    'settings-scale',
    'settings-spacing',
    'settings-lineheight'
  ];

  const foundSettings: Record<string, string> = {};
  settingsParams.forEach(param => {
    const value = searchParams.get(param);
    if (value !== null) {
      foundSettings[param] = value;
    }
  });

  // 2. Handle Language Detection
  const cookieLang = request.cookies.get('language')?.value;
  
  let locale = defaultLocale;
  if (cookieLang && locales.includes(cookieLang)) {
    locale = cookieLang;
  } else {
    // Detect browser language
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

  // 3. Check if the current URL already has a language prefix
  const pathnameHasLocale = locales.some(
    (loc) => pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`
  );

  const applySettingsCookies = (res: NextResponse) => {
    Object.entries(foundSettings).forEach(([name, value]) => {
      res.cookies.set(`__set_${name}`, value, { 
        maxAge: 60, 
        path: '/', 
        httpOnly: false,
        sameSite: 'lax'
      });
    });
  };

  // 4. If it doesn't have a prefix, redirect to the URL WITH the prefix
  if (!pathnameHasLocale) {
    request.nextUrl.pathname = `/${locale}${pathname}`;
    const redirectResponse = NextResponse.redirect(request.nextUrl);
    
    // Merge Supabase cookies into redirect response
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
    });

    applySettingsCookies(redirectResponse);

    const isPythonRedirect = request.nextUrl.pathname.includes('/project/script');
    if (isPythonRedirect) {
      redirectResponse.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
      redirectResponse.headers.set('Cross-Origin-Embedder-Policy', 'credentialless');
    } else {
      redirectResponse.headers.set('Cross-Origin-Opener-Policy', 'unsafe-none');
      redirectResponse.headers.set('Cross-Origin-Embedder-Policy', 'unsafe-none');
    }
    
    redirectResponse.headers.set('Cross-Origin-Resource-Policy', 'cross-origin');
    return redirectResponse;
  }

  // Generate a random nonce and encode it as base64
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const cspHeader = base_cspHeader.replace("nonce-placeholder", `nonce-${nonce}`)

  // Clone headers and set security headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', cspHeader);
  requestHeaders.set('x-locale', locale);

  const isUasProject = pathname.includes('/project/uas_matematika_dasar');
  const isPythonProject = pathname.includes('/project/script');

  // Use the response from updateSession to preserve Supabase cookies
  const response = supabaseResponse;
  
  // Apply our custom headers to the response
  response.headers.set('x-nonce', nonce);
  response.headers.set('x-locale', locale);

  // Set cookies for found settings
  applySettingsCookies(response);

  let finalCspHeader = cspHeader;
  if (isUasProject) {
    finalCspHeader = finalCspHeader.replace("frame-ancestors 'none'", "frame-ancestors *");
  }

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

  return response;
}

// Ensure middleware runs on all routes except static assets
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images, documents, locales (public assets)
     * - any path with a dot (file extensions)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|documents|locales|.*\\..*).*)',
  ],
};
