import { NextResponse } from 'next/server';
import { chromium, Browser } from 'playwright-core';
import {
  createBrowserContext,
  setupResourceBlocking,
  crawlCafeData,
  getBaseChromiumArgs,
  getProductionExecutablePath,
  handleCrawlingError,
  type BrowserConfig,
  type CrawlingConfig,
} from '@/lib/data/crawler';

export const runtime = 'nodejs';

let globalBrowser: Browser | null = null;
let browserInitializing = false;

/** 글로벌 브라우저 인스턴스
 * @description 브라우저 인스턴스를 반환하는 비동기 함수, 모든 유저가 재사용할 수 있도록 글로벌 변수로 관리
 */
async function getBrowserInstance(): Promise<Browser> {
  if (browserInitializing) {
    while (browserInitializing) await new Promise(resolve => setTimeout(resolve, 100));
    if (globalBrowser && globalBrowser.isConnected()) return globalBrowser;
  }

  if (globalBrowser && globalBrowser.isConnected()) return globalBrowser;

  browserInitializing = true;

  try {
    globalBrowser = await chromium.launch({
      args: [
        ...getBaseChromiumArgs(),
        '--disable-extensions',
        '--disable-plugins',
        '--disable-images',
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
      ],
      executablePath: await getProductionExecutablePath(),
      headless: true,
    });

    return globalBrowser;
  } finally {
    browserInitializing = false;
  }
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!id) return NextResponse.json({ error: '유효하지 않은 카페 ID입니다' }, { status: 400 });

  let context = null;

  try {
    const browser = await getBrowserInstance();

    const browserConfig: BrowserConfig = {
      viewport: { width: 1280, height: 720 },
      additionalOptions: {
        ignoreHTTPSErrors: true,
        bypassCSP: true,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    };

    const crawlingConfig: CrawlingConfig = {
      waitUntil: 'networkidle',
      timeout: 3000,
      selectorTimeout: 2000,
      minWaitTime: 1500,
      resourceBlocking: {
        blockImages: true,
        blockFonts: true,
        blockStylesheets: true,
      },
    };

    context = await createBrowserContext(browser, browserConfig);
    const page = await context.newPage();

    await setupResourceBlocking(page, crawlingConfig.resourceBlocking);

    const data = await crawlCafeData(page, id, crawlingConfig);

    if (context) await context.close().catch(() => { });
    return NextResponse.json(data);
  } catch (error) {
    console.error('카페 상세정보 크롤링 실패:', error);

    if (context) await context.close().catch(() => { });

    const errorResponse = handleCrawlingError(error);
    return NextResponse.json(
      { error: errorResponse.error, details: errorResponse.details },
      { status: errorResponse.status }
    );
  }
}