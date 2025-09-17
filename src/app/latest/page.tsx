import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Faran Aiki's Latest Information",
  description: "Faran Aiki's yapping",
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
