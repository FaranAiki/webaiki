import type { NextConfig } from "next";
import type { Configuration as WebpackConfiguration } from 'webpack';
// import TerserPlugin from 'terser-webpack-plugin';

// duplicates of img-src
// FUCK YOU UNSAFE-INLINEEEE
const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://faranaiki.id https://cdn.jsdelivr.net;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://static.wikia.nocookie.net https://i.ytimg.com https://placehold.co https://upload.wikimedia.org https://webaiki.vercel.app https://faranaiki.id https://faranaiki.site;
    font-src 'self';
    object-src 'self';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    frame-src 'self' open.spotify.com  https://open.spotify.com https://w.soundcloud.com w.soundcloud.com;
    connect-src 'self' https://cdn.jsdelivr.net https://faranaiki.id;
    worker-src 'self' blob:;
`;

const nextConfig = {
  output: "standalone",
  poweredByHeader: false,
  experimental: {
    turbo: {
    },
  },
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
};

// module.exports = nextConfig()
export default nextConfig;
