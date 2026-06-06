import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['en', 'id', 'zh', 'jp', 'ru', 'fr', 'ar', 'es', 'ko', 'de', 'nl', 'ha', 'he', 'el'];
const defaultLocale = 'id';

const base_cspHeader = `
    default-src 'self';
    script-src 'nonce-placeholder' 'strict-dynamic' 'wasm-unsafe-eval' ${
      process.env.NODE_ENV === 'development' ? "'unsafe-eval'" : ''
    };
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    img-src 'self' blob: data: https://static.wikia.nocookie.net https://i.ytimg.com https://placehold.co https://*.wikimedia.org https://webaiki.vercel.app https://faranaiki.id https://faranaiki.site https://storage.googleapis.com https://cloud.umami.is https://api-gateway.umami.dev https://gateway.umami.is;
    font-src 'self' blob: data: https://fonts.gstatic.com https://unpkg.com;
    object-src 'none';
    base-uri 'none';
    form-action 'self';
    frame-ancestors 'none';
    frame-src 'self' https://analitica-graph.web.app https://analitica-graph.firebaseapp.com https://open.spotify.com https://w.soundcloud.com;
    connect-src 'self' https://generativelanguage.googleapis.com https://cdn.jsdelivr.net https://faranaiki.id https://fonts.gstatic.com https://www.gstatic.com https://fonts.googleapis.com https://cloud.umami.is https://api-gateway.umami.dev/api/send https://gateway.umami.is https://unpkg.com;
    worker-src 'self' blob:;
    ${process.env.NODE_ENV === 'production' ? 'upgrade-insecure-requests;' : ''}
  `.replace(/\s{2,}/g, ' ').trim()

// Security implementation for Content Security Policy and Nonce
export function middleware(request: NextRequest) {
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

  // 1. Get the language from the cookie or Accept-Language header
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

  // Generate a random nonce and encode it as base64
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  const cspHeader = base_cspHeader.replace("nonce-placeholder", `nonce-${nonce}`)

  const applySettingsCookies = (res: NextResponse) => {
    Object.entries(foundSettings).forEach(([name, value]) => {
      // Use a special prefix to indicate these are "commands" from the URL
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
    // E.g. incoming request is /about -> redirects to /en/about
    const redirectResponse = NextResponse.redirect(request.nextUrl);
    
    // Apply settings cookies to redirect response too!
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

  const requestHeaders = new Headers(request.headers);
  // Pass the nonce and CSP to the request headers
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', cspHeader);
  requestHeaders.set('x-locale', locale);

  const isUasProject = pathname.includes('/project/uas_matematika_dasar');
  const isPythonProject = pathname.includes('/project/script');

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Set cookies for found settings
  applySettingsCookies(response);

  let finalCspHeader = cspHeader;
  if (isUasProject) {
    // Specifically allow this project to be iframed by any origin
    finalCspHeader = finalCspHeader.replace("frame-ancestors 'none'", "frame-ancestors *");
  }

  response.headers.set('Content-Security-Policy', finalCspHeader);
  
  if (isPythonProject) {
    // Strict isolation ONLY for the route that needs SharedArrayBuffer (Python CLI)
    response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
    response.headers.set('Cross-Origin-Embedder-Policy', 'credentialless');
  } else {
    // Use unsafe-none for the rest of the site to avoid "security configuration mismatch" errors in Firefox
    // and to allow the UAS project to load its cross-origin iframe (which doesn't have COEP/CORP).
    response.headers.set('Cross-Origin-Opener-Policy', 'unsafe-none');
    response.headers.set('Cross-Origin-Embedder-Policy', 'unsafe-none');
  }

  response.headers.set('Cross-Origin-Resource-Policy', 'cross-origin');

  return response;
}

// Ensure middleware runs on all routes except static assets
export const config = {
  matcher: [
    {
      /*
       * Match all request paths except for the ones starting with:
       * - api (API routes)
       * - _next (internal Next.js paths)
       * - any path with a dot (e.g. favicon.ico, pdf.worker.min.mjs, etc.)
       * - images (public images)
       * - documents (public documents)
       */
      source: '/((?!api|_next|.*\\..*|images|documents).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
};
