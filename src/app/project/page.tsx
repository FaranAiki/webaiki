import type { Metadata } from "next";
import PythonCLI from "@/components/PythonCLI"; // Adjust this import path
import "../globals.css"; // Make sure this path is correct from your app root

export const metadata: Metadata = {
  metadataBase: new URL("https://faranaiki.id/project"),

  title: "Faran Aiki's Project",
  description: "Faran Aiki's project history and others",

  openGraph: {
    title: "Faran Aiki's Project",
    description: "Faran Aiki's project history and others",
    url: "https://faranaiki.id/project",
    siteName: "Faran Aiki's Project",
    type: "website",
  },

  icons: {
    icon: "/icon.ico",
    shortcut: "/icon.ico",
    apple: "/icon.ico",
  },

  alternates: {
    canonical: "/",
  },
};

// Next.js 15: searchParams adalah Promise
type ProjectPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

/**
 * This is the Next.js Page (a Server Component).
 * It receives searchParams from the URL and passes them
 * down to the client component.
 */
// Tambahkan 'async' di sini
export default async function ProjectPage({ searchParams }: ProjectPageProps) {
  // Next.js 15: Kita harus 'await' searchParams sebelum menggunakannya
  const resolvedParams = await searchParams;

  // Konversi tipe agar aman untuk dikirim ke komponen klien
  const serializedParams = {
    type: typeof resolvedParams?.type === 'string' ? resolvedParams.type : undefined,
    source: typeof resolvedParams?.source === 'string' ? resolvedParams.source : undefined,
  };

  // Render the Client Component and pass the resolved params to it
  return <PythonCLI searchParams={serializedParams} />;
}
