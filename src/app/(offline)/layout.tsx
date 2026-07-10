import "../globals.css";
export default function OfflineLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-serif antialiased bg-theme-bg text-theme-foreground">
        {children}
      </body>
    </html>
  );
}
