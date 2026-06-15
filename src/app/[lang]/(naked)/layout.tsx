import '../../globals.css';

import Script from 'next/script';
import { headers } from 'next/headers';

export default async function NakedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const nonce = (await headers()).get('x-nonce') || undefined;
  
  return (
    <>
        {children}
        <Script
          strategy="lazyOnload"
          src="https://cloud.umami.is/script.js" 
          data-website-id="a418298f-fdca-4df0-a3bf-be453b48eeaf"
          nonce={nonce}
        />
    </>
  );
}
