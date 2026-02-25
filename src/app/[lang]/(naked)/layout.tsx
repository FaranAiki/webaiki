import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import Script from 'next/script';
import { headers } from 'next/headers';

export default async function NakedLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const nonce = (await headers()).get('x-nonce') || undefined;
  
  // Use the url parameter directly
  const { lang } = await params;

  return (
    <html lang={lang} suppressHydrationWarning={true} nonce={nonce}>
      <head>
        <meta name="google-site-verification" content="xZMulZsvn0xj7TrxhEN8O9KLWSmNIfx6tqFtOpbgOV4" />
      </head>
      <body>
        {children}
        <Script
          defer
          src="https://cloud.umami.is/script.js" 
          data-website-id="a418298f-fdca-4df0-a3bf-be453b48eeaf"
        />
      </body>
    </html>
  );
}
