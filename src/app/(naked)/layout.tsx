import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { currentLanguage } from '@/components/Translator';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const current_lang = await currentLanguage();

  return (
    <html lang={current_lang} suppressHydrationWarning={true}>
      <head>
        <meta name="google-site-verification" content="xZMulZsvn0xj7TrxhEN8O9KLWSmNIfx6tqFtOpbgOV4" />
      </head>
      <body
      >
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
