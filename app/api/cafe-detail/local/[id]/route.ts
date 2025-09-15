import { NextResponse } from 'next/server';
import { chromium } from 'playwright-core';
import {
  createBrowserContext,
  setupResourceBlocking,
  scrapCafeData,
  getBaseChromiumArgs,
  getProductionExecutablePath,
  handleScrappingError,
  type BrowserConfig,
  type ScrappingConfig,
} from '@/lib/data/scrapper';

export const runtime = 'nodejs';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> },) {
  const { id } = await params;

  if (!id) return NextResponse.json({ error: '유효하지 않은 카페 ID입니다' }, { status: 400 });

  try {
    const browser = await chromium.launch({
      args: getBaseChromiumArgs(),
      executablePath: await getProductionExecutablePath(),
      headless: true,
    });

    const browserConfig: BrowserConfig = {
      viewport: { width: 800, height: 600 },
    };

    const scrapingConfig: ScrappingConfig = {
      waitUntil: 'domcontentloaded',
      timeout: 3000,
      selectorTimeout: 1000,
      resourceBlocking: {
        customFilter: (url: string, resourceType: string) => {
          const isKakaoResource = url.includes('kakao');
          const isEssentialResource = ['document', 'xhr', 'fetch'].includes(resourceType);
          return isKakaoResource || isEssentialResource;
        },
      },
    };

    const context = await createBrowserContext(browser, browserConfig);
    const page = await context.newPage();

    await setupResourceBlocking(page, scrapingConfig.resourceBlocking);

    const data = await scrapCafeData(page, id, scrapingConfig);

    await context.close();
    await browser.close();
    return NextResponse.json(data);
  } catch (error) {
    console.error('카페 상세정보 크롤링 실패:', error);

    const errorResponse = handleScrappingError(error);
    return NextResponse.json(
      { error: errorResponse.error, details: errorResponse.details },
      { status: errorResponse.status }
    );
  }
}