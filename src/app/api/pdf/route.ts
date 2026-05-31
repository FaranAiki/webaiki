import { NextRequest, NextResponse } from 'next/server';

/**
 * SULTAN PRINT API (Server-side Puppeteer) - HIGH FIDELITY VERSION
 * Forces eager loading and exact layout replication.
 */

interface SultanRequest {
  url: string;
  theme: 'light' | 'dark';
  slideFormat: string;
  settings?: {
    font: string;
    textAlign: string;
    textScale: number;
    letterSpacing: number;
    lineHeight: number;
  };
}

interface ChromiumProvider {
  args: string[];
  executablePath: () => Promise<string>;
  headless: boolean | "new" | "shell";
  defaultViewport: { width: number; height: number; deviceScaleFactor?: number };
}

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
  goto: (url: string, options: { waitUntil: string | string[]; timeout: number }) => Promise<unknown>;
  evaluate: (fn: (...args: unknown[]) => unknown, ...args: unknown[]) => Promise<unknown>;
  evaluateHandle: (fn: string) => Promise<unknown>;
  pdf: (options: {
    format?: string;
    landscape?: boolean;
    printBackground?: boolean;
    preferCSSPageSize?: boolean;
    margin?: { top?: string; right?: string; bottom?: string; left?: string };
    timeout?: number;
    scale?: number;
  }) => Promise<Buffer>;
}

interface PuppeteerRequest {
  url: () => string;
  resourceType: () => string;
  abort: () => Promise<void>;
  continue: () => Promise<void>;
}

export async function POST(req: NextRequest) {
  let browser: PuppeteerBrowser | null = null;
  try {
    const { url, theme, slideFormat, settings } = (await req.json()) as SultanRequest;

    if (!url) return NextResponse.json({ error: 'URL is required' }, { status: 400 });

    let chromium;
    try {
      chromium = ((await import('@sparticuz/chromium')).default as unknown) as ChromiumProvider;
    } catch {
      return NextResponse.json({ error: "Chromium load failure" }, { status: 500 });
    }

    const puppeteer = ((await import('puppeteer-core')).default as unknown) as PuppeteerProvider;

    browser = await puppeteer.launch({
      args: [...chromium.args, '--disable-gpu', '--disable-dev-shm-usage', '--single-process'],
      defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 1.5 }, 
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    
    // 1. Force state & Disable all lazy logic at source
    await page.evaluateOnNewDocument((t: unknown, f: unknown, s: unknown) => {
      const theme = t as string;
      const receivedSlideFormat = f as string;
      const settings = s as SultanRequest['settings'];
      localStorage.setItem('presentation_mode', 'true');
      localStorage.setItem('theme', theme);
      if (receivedSlideFormat) {
        localStorage.setItem('presentation_slide_format', receivedSlideFormat);
      }
      if (settings) {
        localStorage.setItem('settings-scale', settings.textScale.toString());
        localStorage.setItem('settings-font', settings.font);
        localStorage.setItem('settings-lineheight', settings.lineHeight.toString());
        localStorage.setItem('settings-spacing', settings.letterSpacing.toString());
        localStorage.setItem('settings-align', settings.textAlign);
      }
    }, theme, slideFormat, settings);

    // 2. Exact Navigation - wait for EVERYTHING
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 45000 });
    
    // 3. Final Layout Force
    await page.evaluate((t: unknown) => {
      const theme = t as string;
      document.documentElement.classList.add(theme, 'is-printing-sultan');
      document.body.classList.add('presentation-mode');
      
      const style = document.createElement('style');
      style.textContent = `
        * { transition: none !important; animation: none !important; scroll-behavior: auto !important; }
        .fixed, header, nav, footer, .no-print, .presentation-switcher { display: none !important; }
        body.presentation-mode main { display: block !important; height: auto !important; }
        .presentation-section { display: flex !important; height: 100vh !important; opacity: 1 !important; visibility: visible !important; }
        img { opacity: 1 !important; visibility: visible !important; display: block !important; }
      `;
      document.head.appendChild(style);
    }, theme);

    // 4. Robust Image Wait
    await page.evaluate(async () => {
      const imgs = Array.from(document.querySelectorAll('img'));
      await Promise.all(imgs.map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => { img.onload = resolve; img.onerror = resolve; });
      }));
      await new Promise(r => setTimeout(r, 1000)); // Final stability buffer
    });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      landscape: true,
      printBackground: true,
      scale: 1, // Exact scale
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
      timeout: 30000
    });

    await browser.close();
    browser = null;

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="faran-aiki-sultan-${Date.now()}.pdf"`,
      },
    });

  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'An unknown error occurred';
    console.error("Sultan API Error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  } finally {
    if (browser) await browser.close();
  }
}
