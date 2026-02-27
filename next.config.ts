import type { NextConfig } from "next";
import type { Configuration as WebpackConfiguration } from 'webpack';

const nextConfig: NextConfig = {
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
        source: '/(.*)',
        headers: [
          {
            // Security: Prevent clickjacking by denying framing from other origins
            key: 'X-Frame-Options',
            value: 'DENY',
          },
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
            // Security: Standard cache control for sensitive data
            key: 'Cache-Control',
            value: 'private, no-cache, no-store, must-revalidate',
          },
          {
            // Security: Isolate the browsing context to prevent cross-origin data leaks
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            // Security: Required for certain shared buffer features used by Pyodide
            key: 'Cross-Origin-Embedder-Policy',
            value: 'credentialless',
          }
          // Note: Content-Security-Policy is omitted here because it is 
          // generated dynamically with a Nonce in middleware.ts
        ],
      },
    ];
  },

  images: {
    // Configure allowed image sources for next/image
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
