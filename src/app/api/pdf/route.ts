import { NextRequest, NextResponse } from 'next/server';

/**
 * SULTAN PRINT API (Server-side Puppeteer) - OPTIMIZED VERSION
 */

interface SultanRequest {
  url: string;
  theme: 'light' | 'dark';
  slideFormat: string;
}

// Interface to satisfy TypeScript for @sparticuz/chromium
interface ChromiumProvider {
  args: string[];
  executablePath: () => Promise<string>;
  headless: boolean | "new" | "shell";
  defaultViewport: { width: number; height: number; deviceScaleFactor?: number };
}

// Interface to satisfy TypeScript for puppeteer-core
interface PuppeteerLaunchOptions {
  args?: string[];
  defaultViewport?: { width: number; height: number; deviceScaleFactor?: number } | null;
  executablePath?: string;
  headless?: boolean | "new" | "shell";
}

interface PuppeteerProvider {
  launch: (options: PuppeteerLaunchOptions) => Promise<PuppeteerBrowser>;
}

interface PuppeteerBrowser {
  newPage: () => Promise<PuppeteerPage>;
  close: () => Promise<void>;
}

interface PuppeteerPage {
  setViewport: (options: { width: number; height: number; deviceScaleFactor?: number }) => Promise<void>;
  setRequestInterception: (value: boolean) => Promise<void>;
  on: (event: string, handler: (req: PuppeteerRequest) => void) => void;
  evaluateOnNewDocument: (fn: (...args: unknown[]) => void, ...args: unknown[]) => Promise<void>;
  goto: (url: string, options: { waitUntil: string; timeout: number }) => Promise<unknown>;
  evaluate: (fn: (...args: unknown[]) => unknown, ...args: unknown[]) => Promise<unknown>;
  evaluateHandle: (fn: string) => Promise<unknown>;
  pdf: (options: {
    format?: string;
    landscape?: boolean;
    printBackground?: boolean;
    preferCSSPageSize?: boolean;
    margin?: { top?: string; right?: string; bottom?: string; left?: string };
  }) => Promise<Buffer>;
}

interface PuppeteerRequest {
  url: () => string;
  resourceType: () => string;
  abort: () => Promise<void>;
  continue: () => Promise<void>;
}

export async function POST(req: NextRequest) {
  try {
    const { url, theme, slideFormat } = (await req.json()) as SultanRequest;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Dynamic import to handle external packages correctly in Next.js
    const chromium = ((await import('@sparticuz/chromium')).default as unknown) as ChromiumProvider;
    const puppeteer = ((await import('puppeteer-core')).default as unknown) as PuppeteerProvider;

    const browser = await puppeteer.launch({
      args: [...chromium.args, '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 1.5 },
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    
    // ACCELERATION: Block unnecessary resources
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      const requestUrl = request.url();
      if (
        requestUrl.includes('umami.is') || 
        requestUrl.includes('analytics') || 
        requestUrl.includes('doubleclick') ||
        (request.resourceType() === 'font' && !requestUrl.includes('geist'))
      ) {
        request.abort();
      } else {
        request.continue();
      }
    });

    // 1. Pre-inject state
    await page.evaluateOnNewDocument((t: unknown, f: unknown) => {
      localStorage.setItem('presentation_mode', 'true');
      localStorage.setItem('presentation_slide_format', (f as string) || 'binary');
      localStorage.setItem('theme', (t as string));
    }, theme, slideFormat);

    // 2. Faster Navigation
    await page.goto(url, { waitUntil: 'load', timeout: 30000 });
    
    // 3. Forced Layout (Immediate)
    await page.evaluate((t: unknown) => {
      const themeName = t as string;
      const isDark = themeName === 'dark';
      const bgColor = isDark ? '#0a0a0a' : '#f9fafb';
      const textColor = isDark ? '#ededed' : '#000000';

      document.documentElement.className = themeName;
      document.body.classList.add('presentation-mode');
      
      const style = document.createElement('style');
      style.textContent = `
        * { transition: none !important; animation: none !important; scroll-behavior: auto !important; }
        nav, header, footer, .no-print, #ask-me-popup-container, .cookie-initializer { display: none !important; }
        body.presentation-mode main { display: block !important; height: auto !important; background-color: ${bgColor} !important; }
        .presentation-section { display: flex !important; height: 100vh !important; page-break-after: always !important; color: ${textColor} !important; }
      `;
      document.head.appendChild(style);
    }, theme);

    // 4. TURBO SCROLL (Parallelized image trigger)
    await page.evaluate(async () => {
      const sections = document.querySelectorAll('.presentation-section');
      for (let i = 0; i < sections.length; i++) {
        (sections[i] as HTMLElement).scrollIntoView();
        if (i % 3 === 0) await new Promise(r => setTimeout(r, 50));
      }
      window.scrollTo(0, 0);
    });

    // 5. Minimal wait for fonts
    await page.evaluateHandle('document.fonts.ready');
    await new Promise(resolve => setTimeout(resolve, 300));

    const pdfBuffer = await page.pdf({
      format: 'A4',
      landscape: true,
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });

    await browser.close();

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="faran-aiki-sultan-${Date.now()}.pdf"`,
      },
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
