import type { NextConfig } from "next";
import type { Configuration as WebpackConfiguration } from 'webpack';
import path from 'path';

const nextConfig: NextConfig = {
  // Opt-out of bundling for packages that don't play well with it (like Puppeteer)
  serverExternalPackages: ["puppeteer-core", "@sparticuz/chromium"],

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
    removeConsole: process.env.NODE_ENV === 'production',
  },

    webpack: (
      config: WebpackConfiguration,
      { dev, isServer }: { dev: boolean; isServer: boolean }
    ) => {
      // Optimization: Remove comments from the minified output in production
      if (!dev && !isServer && config.optimization?.minimizer) {
        const minimizer = config.optimization.minimizer[0];
        if (minimizer && typeof minimizer === 'object' && 'options' in minimizer) {
          const options = minimizer.options as { terserOptions?: { format?: { comments?: boolean } } };
          if (options.terserOptions?.format) {
            options.terserOptions.format.comments = false;
          }
        }
      }

      // Explicitly externalize chromium to prevent bundling its binaries
      if (isServer) {
        config.externals = [...(Array.isArray(config.externals) ? config.externals : []), '@sparticuz/chromium'];
      }

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
            // Security: Control which origins can read the resource
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin',
          }
          // Note: Content-Security-Policy is omitted here because it is 
          // generated dynamically with a Nonce in middleware.ts
        ],
      },
    ];
  },

  images: {
    // Configure allowed image sources for next/image
    formats: ['image/avif', 'image/webp'],
    qualities: [75, 80, 85, 90, 100],
    remotePatterns: [
      { protocol: 'https', hostname: 'static.wikia.nocookie.net' },
      { protocol: 'https', hostname: 'i.ytimg.com', pathname: '/vi/**' },
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'webaiki.vercel.app' },
    ],
  },
};

export default nextConfig;
