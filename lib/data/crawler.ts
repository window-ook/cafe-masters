import { Browser, BrowserContext } from 'playwright-core';
import { EXTERNAL_PATHS } from '@/lib/paths';
import chromiumPkg from '@sparticuz/chromium';

export interface CafeCrawlingResult {
  image: string | null;
  extra_images: (string | null)[];
  opening_time: string;
}

export interface BrowserConfig {
  viewport: { width: number; height: number };
  args?: string[];
  additionalOptions?: {
    ignoreHTTPSErrors?: boolean;
    bypassCSP?: boolean;
    userAgent?: string;
  };
}

export interface CrawlingConfig {
  waitUntil: 'load' | 'domcontentloaded' | 'networkidle' | 'commit';
  timeout: number;
  selectorTimeout?: number;
  minWaitTime?: number;
  resourceBlocking?: {
    blockImages?: boolean;
    blockFonts?: boolean;
    blockStylesheets?: boolean;
    customFilter?: (url: string, resourceType: string) => boolean;
  };
}

const toAbsoluteUrl = (src: string | null): string | null => src && !src.startsWith('http') ? `https:${src}` : src;

export async function createBrowserContext(browser: Browser, config: BrowserConfig): Promise<BrowserContext> {
  return await browser.newContext({
    viewport: config.viewport,
    ...config.additionalOptions,
  });
}

export async function setupResourceBlocking(
  page: any,
  config?: CrawlingConfig['resourceBlocking']
): Promise<void> {
  if (!config) return;

  await page.route('**/*', (route: any) => {
    const url = route.request().url();
    const resourceType = route.request().resourceType();

    if (config.customFilter) {
      if (!config.customFilter(url, resourceType)) {
        route.abort();
        return;
      }
    } else {
      const shouldBlock =
        (config.blockImages && resourceType === 'image') ||
        (config.blockFonts && resourceType === 'font') ||
        (config.blockStylesheets && resourceType === 'stylesheet');

      if (shouldBlock) {
        route.abort();
        return;
      }
    }

    route.continue();
  });
}

export async function crawlCafeData(
  page: any,
  cafeId: string,
  config: CrawlingConfig
): Promise<CafeCrawlingResult> {
  await page.goto(EXTERNAL_PATHS.KAKAO_MAP_CAFE_DETAIL(cafeId), {
    waitUntil: config.waitUntil,
    timeout: config.timeout,
  });

  if (config.minWaitTime || config.selectorTimeout) {
    const waitPromises: Promise<any>[] = [];

    if (config.selectorTimeout) {
      waitPromises.push(
        page.waitForSelector('.img-thumb', { timeout: config.selectorTimeout })
          .catch(() => console.warn('선택자 대기 시간 초과'))
      );
    }

    if (config.minWaitTime) {
      waitPromises.push(page.waitForTimeout(config.minWaitTime));
    }

    if (waitPromises.length > 0) {
      await Promise.race(waitPromises);
    }
  }

  const data = await page.evaluate(() => {
    const toAbsoluteUrl = (src: string | null) =>
      src && !src.startsWith('http') ? `https:${src}` : src;

    const imgElement = document.querySelector('.img-thumb.img_cfit');
    const photo = toAbsoluteUrl(imgElement?.getAttribute('src') || null);

    const photos = Array.from(document.querySelectorAll('.col.col_depth1 .col.col_depth2 .img-thumb.img_cfit'));
    const photoList = photos
      .slice(0, 2)
      .map(el => toAbsoluteUrl(el.getAttribute('src')));

    const timeElement = document.querySelector('.line_fold .txt_detail');
    let openingHours = timeElement ? timeElement.textContent?.trim().replace(/\s+/g, ' ') || '' : '';
    openingHours = openingHours.replace(/^매일\s+/, '').trim();

    return {
      image: photo,
      extra_images: photoList,
      opening_time: openingHours,
    };
  });

  console.log(`✅ 카페 ${cafeId} 조회 완료:`, {
    image: !!data.image,
    extraImages: data.extra_images.length,
    hasOpeningTime: !!data.opening_time,
  });

  return data;
}

export function getBaseChromiumArgs(): string[] {
  return [
    ...chromiumPkg.args,
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--disable-background-timer-throttling',
    '--disable-renderer-backgrounding',
    '--disable-backgrounding-occluded-windows',
  ];
}

export function getProductionExecutablePath(): Promise<string> | undefined {
  return process.env.NODE_ENV === 'production'
    ? chromiumPkg.executablePath()
    : undefined;
}

export function handleCrawlingError(error: any): { error: string; details: string; status: number } {
  if (error instanceof Error) {
    if (error.message.includes('timeout')) {
      return {
        error: '페이지 로딩 시간 초과',
        details: '카카오맵 서버 응답이 지연되고 있습니다.',
        status: 408
      };
    }

    if (error.message.includes('net::ERR_')) {
      return {
        error: '네트워크 연결 실패',
        details: '인터넷 연결을 확인해주세요.',
        status: 503
      };
    }
  }

  return {
    error: '카페 정보를 가져올 수 없습니다',
    details: '잠시 후 다시 시도해주세요.',
    status: 500
  };
}