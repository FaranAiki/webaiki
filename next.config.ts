import type { NextConfig } from "next";

// duplicates of img-src
const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline';
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: static.wikia.nocookie.net i.ytimg.com placehold.co upload.wikimedia.org webaiki.vercel.app;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    frame-src 'self' open.spotify.com w.soundcloud.com;
`;

const nextConfig = {
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
