import type { NextConfig } from "next";
import type { Configuration as WebpackConfiguration } from 'webpack';
import path from 'path';
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  fallbacks: {
    document: "/~offline",
  },
  workboxOptions: {
    // Disable dev logs to prevent noise
    disableDevLogs: true,
    ignoreURLParametersMatching: [/^utm_/, /^fbclid$/, /^_rsc$/],
    runtimeCaching: [
      {
        // Don't intercept next-image requests with Service Worker in production
        // to prevent unexpected errors due to opaque responses.
        urlPattern: /^\/_next\/image\?/,
        handler: 'NetworkOnly',
      },
      {
        // Don't intercept vercel.app requests to prevent async generator errors
        urlPattern: /^https:\/\/.*\.vercel\.app\/.*/,
        handler: 'NetworkOnly',
      },
      {
        // Don't intercept RSC payload requests
        urlPattern: /.*_rsc=1.*/,
        handler: 'NetworkOnly',
      },
      {
        // Don't intercept API routes
        urlPattern: /^\/api\//,
        handler: 'NetworkOnly',
      },
      {
        // Don't intercept fonts
        urlPattern: /^\/_next\/static\/media\//,
        handler: 'NetworkOnly',
      },
      {
        // Catch-all for navigations (pages) to prevent no-response error
        urlPattern: /.*/,
        handler: 'NetworkFirst',
        options: {
          cacheName: 'pages',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 86400, // 24 hours
          },
          networkTimeoutSeconds: 10,
        },
      }
    ],
  },
});

const nextConfig: NextConfig = {
  // Turbopack configuration to resolve root directory issues
  turbopack: {
    root: path.resolve('.'),
  },

  // Set output to standalone for optimized production builds
  output: "standalone",

  // Security: Remove the X-Powered-By header to hide the tech stack
  poweredByHeader: false,

  compiler: {
    // Remove console logs in production for security and performance
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
    // Remove React testing attributes from the production DOM
    reactRemoveProperties: process.env.NODE_ENV === 'production' ? { properties: ['^data-testid$'] } : false,
  },

  // Optimization: Enable gzip/brotli compression for server responses
  compress: true,

  typescript: {
    ignoreBuildErrors: true,
  },

  productionBrowserSourceMaps: true,

  // Vercel OOM Fixes: Limit workers to prevent memory spikes during static generation
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@base-ui/react',
      'react-force-graph-2d',
      'force-graph',
      'framer-motion'
    ],
    optimizeCss: true, // Keep it if it helps, but inlineCss is for App Router
    inlineCss: true,
    cssChunking: false,
  },

    webpack: (
      config: WebpackConfiguration,
      { dev, isServer }: { dev: boolean; isServer: boolean }
    ) => {
      // Remove custom minimizer mutation which corrupts Next.js SWC minifier
      return config;
    },
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          // Security: Enforce HTTPS for a year, including subdomains
          key: 'Strict-Transport-Security',
          value: 'max-age=31536000; includeSubDomains; preload',
        },
        {
          // Security: Prevent browsers from MIME-sniffing a response away from the declared content-type
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          // Security: Prevent site from being embedded in iframes
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          // Security: Control how much referrer information is passed
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
        {
          // Security: Control which origins can read the resource
          key: 'Cross-Origin-Resource-Policy',
          value: 'cross-origin',
        }
      ],
    },
    {
      // Optimization: Cache static assets heavily
      source: '/images/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
    {
      // Optimization: Cache documents heavily
      source: '/documents/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
    {
      // Optimization: Cache projects heavily
      source: '/projects/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
    {
      // Optimization: Cache signatures heavily
      source: '/signature/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    }
  ];
},

  images: {
  // Optimization: Support modern image formats
  formats: ['image/avif', 'image/webp'],
  // Add allowed qualities array for Next 16+
  qualities: [25, 35, 50, 60, 70, 75, 80, 85, 90, 100],
  // Add intermediate sizes to prevent rounding up from 400px -> 640px
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 300, 350, 384],
  deviceSizes: [400, 450, 500, 550, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  // Optimization: Cache optimized images at the edge for a week
  minimumCacheTTL: 604800,
  remotePatterns: [
      { protocol: 'https', hostname: 'static.wikia.nocookie.net' },
      { protocol: 'https', hostname: 'i.ytimg.com', pathname: '/vi/**' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'faranaiki.id' },
      { protocol: 'https', hostname: 'raw.githubusercontent.com' },
      { protocol: 'https', hostname: 'github.com' },
      { protocol: 'https', hostname: 'imgur.com' },
      { protocol: 'https', hostname: 'i.imgur.com' },
      { protocol: 'https', hostname: 'drive.google.com' },
      { protocol: 'https', hostname: 'cloud.umami.is' },
      { protocol: 'https', hostname: 'api-gateway.umami.dev' },
      { protocol: 'https', hostname: 'gateway.umami.is' },
      { protocol: 'https', hostname: 'ndutyvnkhavzchhjmzfm.supabase.co' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
  },

  async redirects() {
    const socials = [
      { slug: 'github', url: 'https://github.com/FaranAiki' },
      { slug: 'linkedin', url: 'https://www.linkedin.com/in/faranaiki/' },
      { slug: 'instagram', url: 'https://www.instagram.com/mfaranaiki/' },
      { slug: 'twitter', url: 'https://x.com/FaranAiki' },
      { slug: 'x', url: 'https://x.com/FaranAiki' },
      { slug: 'linktree', url: 'https://linktr.ee/FaranAiki' },
      { slug: 'youtube', url: 'https://www.youtube.com/@FaranAiki' },
      { slug: 'tiktok', url: 'https://www.tiktok.com/@faranaiki07' },
      { slug: 'mal', url: 'https://myanimelist.net/profile/FaranAiki' },
      { slug: 'myanimelist', url: 'https://myanimelist.net/profile/FaranAiki' },
      { slug: 'lichess', url: 'https://lichess.org/@/FaranAiki' },
      { slug: 'quora', url: 'https://id.quora.com/profile/Muhammad-Faran-Aiki-4' },
      { slug: 'reddit', url: 'https://www.reddit.com/user/FaranAiki/' },
      { slug: 'slideshare', url: 'https://www.slideshare.net/MuhammadFaranAiki' },
      { slug: 'scribd', url: 'https://id.scribd.com/user/530310522/Muhammad-Faran-Aiki' },
      { slug: 'line', url: 'https://line.me/ti/p/8ZF2kENUEj' },
      { slug: 'telegram', url: 'https://t.me/FaranAiki' },
      { slug: 'email', url: 'mailto:faran.aiki.business@gmail.com' },
    ];

    const langPattern = '(en|id|zh|jp|ru|fr|ar|es|ko|de|nl|ha|he|el|hi|pt|bn|vi)';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const redirectList: any[] = [
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'www.faranaiki.id',
          },
        ],
        destination: 'https://faranaiki.id/:path*',
        permanent: true,
      },
    ];

    socials.forEach(({ slug, url }) => {
      // Root-level redirect: /slug
      redirectList.push({
        source: `/${slug}`,
        destination: url,
        permanent: false,
      });

      // Localized redirect: /[lang]/slug
      redirectList.push({
        source: `/:lang${langPattern}/${slug}`,
        destination: url,
        permanent: false,
      });
    });

    return redirectList;
  },
};

export default withPWA(nextConfig);
