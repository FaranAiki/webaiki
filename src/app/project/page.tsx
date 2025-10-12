import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://faranaiki.id/project'),

  title: "Faran Aiki's Project",
  description: "Faran Aiki's project history and others",
  
  openGraph: {
    title: "Faran Aiki's Project",
    description: "Faran Aiki's project history and others",
    url: 'https://faranaiki.id/project',
    siteName: 'Faran Aiki\'s Project', 
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
