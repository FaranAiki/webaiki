import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://faranaiki.id/latest'),

  title: "Faran Aiki's Latest Information",
  description: "Faran Aiki's Latest Information",
  
  openGraph: {
    title: "Faran Aiki's Latest Information",
    description: "Faran Aiki's Latest Information",
    url: 'https://faranaiki.id/latest',
    siteName: 'Faran Aiki\'s Latest Information', 
    type: 'website',
  },

  icons: {
    icon: '/icon.ico',
    shortcut: '/icon.ico',
    apple: '/icon.ico',
  },
  
  alternates: {
    canonical: '/',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="container mx-auto px-8 pt-24 pb-16">
      {children}
    </main>
  );
}
