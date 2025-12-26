import { withSentryConfig } from '@sentry/nextjs';
import type { NextConfig } from "next";
import type { Configuration as WebpackConfiguration } from 'webpack';

const path = require('path');
// import TerserPlugin from 'terser-webpack-plugin';

// duplicates of img-src
// FUCK YOU UNSAFE-INLINEEEE
const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://faranaiki.id https://cdn.jsdelivr.net https://storage.googleapis.com https://www.gstatic.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;;
    img-src 'self' blob: data: https://static.wikia.nocookie.net https://i.ytimg.com https://placehold.co https://upload.wikimedia.org https://webaiki.vercel.app https://faranaiki.id https://faranaiki.site https://storage.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    object-src 'self';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'self';
    frame-src 'self' analitica-graph.web.app https://analitica-graph.web.app open.spotify.com  https://open.spotify.com https://w.soundcloud.com w.soundcloud.com;
    connect-src 'self' https://cdn.jsdelivr.net https://faranaiki.id https://fonts.gstatic.com  https://www.gstatic.com https://fonts.googleapis.com;
    worker-src 'self' blob:;
`;

const nextConfig = {
  output: "standalone",
  poweredByHeader: false,

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  webpack: (
    config: WebpackConfiguration,
    { dev, isServer }: { dev: boolean; isServer: boolean }
  ) => {
    if (!dev && !isServer && config.optimization?.minimizer) {
      // Temporarily cast the minimizer to 'any' to access its properties
      const minimizer = config.optimization.minimizer[0] as any;
      
      if (minimizer.options.terserOptions) {
        minimizer.options.terserOptions.format = {
          ...minimizer.options.terserOptions.format,
          comments: false,
        };
      }
    }
    return config;
  },

  async headers() {
    return [
      {
        source: '/(.*)', // Apply this header to all routes
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN', // Or 'DENY' if you never need to frame your site
          },
          {
            key: 'Content-Security-Policy',
            value: cspHeader.replace(/\s{2,}/g, ' ').trim(),
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Cache-Control',
            value: 'private, no-cache, no-store, must-revalidate',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'credentialless', // ini agak bahaya tapi oke 
          }
        ],
      },
    ];
  },

  images: {
    qualities: [75, 80, 90, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.wikia.nocookie.net',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        port: '',
        pathname: '/vi/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co', 
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'webaiki.vercel.app',
        port: '',
      },
    ],
  },

  turbopack: {
    root: __dirname
  }
};

// module.exports = nextConfig()
export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "faran-aiki",

  project: "javascript-nextjs",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // This reduces the overhead by not uploading source maps for every build
  hideSourceMaps: true, 
  // Disable automatic instrumentation for components/logic you don't need
  disableServerWebpackPlugin: true,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: false,

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: "/monitoring",

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      // Automatically tree-shake Sentry logger statements to reduce bundle size
      removeDebugLogging: true,
    },
  },
});
