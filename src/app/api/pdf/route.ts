import { NextRequest, NextResponse } from 'next/server';

/**
 * SULTAN PRINT API (Server-side Puppeteer) - OPTIMIZED VERSION
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
    const { url, theme, slideFormat, settings } = (await req.json()) as SultanRequest;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Dynamic import to handle external packages correctly in Next.js
    const chromium = ((await import('@sparticuz/chromium')).default as unknown) as ChromiumProvider;
    const puppeteer = ((await import('puppeteer-core')).default as unknown) as PuppeteerProvider;

    const browser = await puppeteer.launch({
      args: [
        ...chromium.args, 
        '--no-sandbox', 
        '--disable-setuid-sandbox', 
        '--disable-dev-shm-usage',
        '--disable-gpu',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-extensions'
      ],
      defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 1.5 },
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });

    const page = await browser.newPage();
    
    // ACCELERATION: Block unnecessary resources
    await page.setRequestInterception(true);
    page.on('request', (request) => {
      const requestUrl = request.url();
      const resourceType = request.resourceType();
      if (
        requestUrl.includes('umami.is') || 
        requestUrl.includes('analytics') || 
        requestUrl.includes('doubleclick') ||
        requestUrl.includes('google-analytics') ||
        requestUrl.includes('facebook') ||
        requestUrl.includes('twitter') ||
        (resourceType === 'font' && !requestUrl.includes('geist')) ||
        resourceType === 'media' ||
        resourceType === 'websocket' ||
        resourceType === 'other'
      ) {
        request.abort();
      } else {
        request.continue();
      }
    });

    // 1. Pre-inject state
    await page.evaluateOnNewDocument((t: unknown, f: unknown, s: unknown) => {
      localStorage.setItem('presentation_mode', 'true');
      localStorage.setItem('presentation_slide_format', (f as string) || 'binary');
      localStorage.setItem('theme', (t as string));
      if (s) {
        const settings = s as SultanRequest['settings'];
        if (settings) {
          localStorage.setItem('settings-font', settings.font);
          localStorage.setItem('settings-align', settings.textAlign);
          localStorage.setItem('settings-scale', settings.textScale.toString());
          localStorage.setItem('settings-spacing', settings.letterSpacing.toString());
          localStorage.setItem('settings-lineheight', settings.lineHeight.toString());
        }
      }
      // KILL Animations and transitions at the source
      const style = document.createElement('style');
      style.textContent = `
        *, *::before, *::after {
          transition: none !important;
          animation: none !important;
          transition-duration: 0s !important;
          animation-duration: 0s !important;
          scroll-behavior: auto !important;
        }
      `;
      document.head.appendChild(style);
    }, theme, slideFormat, settings);

    // 2. Faster Navigation - Try 'domcontentloaded' first
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // 3. Forced Layout (Immediate)
    await page.evaluate((t: unknown, s: unknown) => {
      const themeName = t as string;
      const userSettings = s as SultanRequest['settings'];
      const isDark = themeName === 'dark';
      const textColor = isDark ? '#ededed' : '#000000';

      document.documentElement.classList.add(themeName);
      document.documentElement.classList.add('is-printing-sultan');
      document.body.classList.add('presentation-mode');

      // Apply Typography Settings manually to body to ensure immediate effect
      if (userSettings) {
        const body = document.body;
        body.style.setProperty('--text-scale-factor', (userSettings.textScale / 100).toString());
        body.style.setProperty('--app-letter-spacing', `${userSettings.letterSpacing}px`);
        body.style.setProperty('--app-line-height', userSettings.lineHeight.toString());
        if (userSettings.textAlign && userSettings.textAlign !== 'default') {
          body.style.textAlign = userSettings.textAlign;
        }
      }
      
      const style = document.createElement('style');
      style.textContent = `
        * { transition: none !important; animation: none !important; scroll-behavior: auto !important; }
        nav, header, footer, .no-print, #ask-me-popup-container, .cookie-initializer { display: none !important; }
        body.presentation-mode main { display: block !important; height: auto !important; background-color: transparent !important; }
        
        /* FORCE VISIBILITY for all slides and images */
        .presentation-section { 
          display: flex !important; 
          height: 100vh !important; 
          page-break-after: always !important; 
          color: ${textColor} !important; 
          background-color: transparent !important;
          opacity: 1 !important;
          visibility: visible !important;
          transform: none !important;
          filter: none !important;
        }

        img {
          opacity: 1 !important;
          visibility: visible !important;
          display: block !important;
        }
        
        /* Match main webpage background effects */
        .presentation-background { filter: blur(8px) !important; transform: scale(1.1) !important; }
        .presentation-background::after {
          content: "";
          position: fixed;
          inset: 0;
          z-index: -5;
          background: ${isDark 
            ? 'linear-gradient(to bottom, rgba(0,0,0,0.92), rgba(0,0,0,0.85), rgba(0,0,0,0.95))' 
            : 'linear-gradient(to bottom, rgba(255,255,255,0.98), rgba(255,255,255,0.96), rgba(255,255,255,1))'
          } !important;
          pointer-events: none;
        }
      `;
      document.head.appendChild(style);
    }, theme, settings);

    // 4. ENSURE IMAGES ARE LOADED (Critical Fix for missing images)
    await page.evaluate(async () => {
      const selectors = ['img', '.presentation-section img'];
      const images = Array.from(document.querySelectorAll(selectors.join(',')));
      
      // Trigger lazy loading by scrolling
      const sections = document.querySelectorAll('.presentation-section');
      for (const section of Array.from(sections)) {
        section.scrollIntoView();
        await new Promise(r => setTimeout(r, 40)); // Slightly more reliable delay
      }
      window.scrollTo(0, 0);

      // Wait for all images to decode/load
      await Promise.all(images.map(img => {
        if ((img as HTMLImageElement).complete) return Promise.resolve();
        return new Promise(resolve => {
          img.addEventListener('load', resolve);
          img.addEventListener('error', resolve);
        });
      }));

      // Final wait for any late renders
      await new Promise(r => setTimeout(r, 100));
    });

    // 5. Minimal wait for fonts
    await page.evaluateHandle('document.fonts.ready');

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
