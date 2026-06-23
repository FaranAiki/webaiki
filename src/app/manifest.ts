import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Faran Aiki Portfolio',
    short_name: 'Faran Aiki',
    description: 'Personal portfolio, resume, and blog of Muhammad Faran Aiki, an STI ITB student and Software Engineer.',
    start_url: '/',
    display: 'standalone',
    background_color: '#020617', // Match dark theme default
    theme_color: '#0ea5e9', // Match blue theme default
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/images/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/images/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
