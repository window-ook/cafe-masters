import { Browser, BrowserContext, Page, Route } from 'playwright-core';
import { EXTERNAL_PATHS } from '@/lib/paths';
import chromiumPkg from '@sparticuz/chromium';

/**
 * @description 카페 크롤링 결과를 나타내는 인터페이스
 * @property image - 카페 대표 이미지 URL (없을 경우 null)
 * @property extra_images - 추가 카페 이미지 URL 배열 (최대 2개)
 * @property opening_time - 카페 운영 시간 정보
 */
export interface CafeCrawlingResult {
  image: string | null;
  extra_images: (string | null)[];
  opening_time: string;
}

/**
 * @description 브라우저 설정을 위한 인터페이스
 * @property viewport - 브라우저 뷰포트 크기 설정 (너비, 높이)
 * @property args - 브라우저 실행 시 전달할 추가 명령행 인수 (선택적)
 * @property additionalOptions - 브라우저 컨텍스트 추가 옵션 설정 (선택적)
 */
export interface BrowserConfig {
  viewport: { width: number; height: number };
  args?: string[];
  additionalOptions?: {
    ignoreHTTPSErrors?: boolean;
    bypassCSP?: boolean;
    userAgent?: string;
  };
}

/**
 * @description 크롤링 동작 설정을 위한 인터페이스
 * @property waitUntil - 페이지 로드 완료 조건 ('load' | 'domcontentloaded' | 'networkidle' | 'commit')
 * @property timeout - 페이지 로드 최대 대기 시간 (밀리초)
 * @property selectorTimeout - 특정 선택자 대기 최대 시간 (선택적, 밀리초)
 * @property minWaitTime - 최소 대기 시간 (선택적, 밀리초)
 * @property resourceBlocking - 리소스 차단 설정 (선택적)
 */
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

/**
 * @description 기본 브라우저 컨텍스트를 생성하는 함수
 * @param browser - Playwright Browser 인스턴스
 * @param config - 브라우저 설정 객체
 * @returns Promise<BrowserContext> - 생성된 브라우저 컨텍스트
 */
export async function createBrowserContext(browser: Browser, config: BrowserConfig): Promise<BrowserContext> {
  return await browser.newContext({
    viewport: config.viewport,
    ...config.additionalOptions,
  });
}

/**
 * @description Vercel 서버리스 환경에 최적화된 브라우저 컨텍스트를 생성하는 함수
 * @param browser - Playwright Browser 인스턴스
 * @param config - 브라우저 설정 객체
 * @returns Promise<BrowserContext> - Vercel 환경에 최적화된 브라우저 컨텍스트
 */
export async function createVercelOptimizedBrowserContext(browser: Browser, config: BrowserConfig): Promise<BrowserContext> {
  return await browser.newContext({
    viewport: config.viewport,
    ignoreHTTPSErrors: true,
    bypassCSP: true,
    javaScriptEnabled: true,
    acceptDownloads: false,
    colorScheme: 'no-preference',
    reducedMotion: 'reduce',
    extraHTTPHeaders: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'ko-KR,ko;q=0.9,en;q=0.8',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
    },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    ...config.additionalOptions,
  });
}

/**
 * @description 페이지 리소스 로딩을 선택적으로 차단하여 크롤링 성능을 최적화하는 함수
 * @param page - Playwright Page 인스턴스
 * @param config - 리소스 차단 설정 (선택적)
 * @returns Promise<void> - 비동기 작업 완료
 */
export async function setupResourceBlocking(
  page: Page,
  config?: CrawlingConfig['resourceBlocking']
): Promise<void> {
  if (!config) return;

  await page.route('**/*', (route: Route) => {
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

/**
 * @description 카카오맵에서 특정 카페의 상세 정보를 크롤링하는 함수
 * @param page - Playwright Page 인스턴스
 * @param cafeId - 카카오맵 카페 ID
 * @param config - 크롤링 설정 객체
 * @returns Promise<CafeCrawlingResult> - 크롤링된 카페 정보 (이미지, 운영시간 등)
 */
export async function crawlCafeData(
  page: Page,
  cafeId: string,
  config: CrawlingConfig
): Promise<CafeCrawlingResult> {
  await page.goto(EXTERNAL_PATHS.KAKAO_MAP_CAFE_DETAIL(cafeId), {
    waitUntil: config.waitUntil,
    timeout: config.timeout,
  });

  if (config.minWaitTime || config.selectorTimeout) {
    const waitPromises: Promise<unknown>[] = [];

    if (config.selectorTimeout) {
      const isVercelProduction = process.env.NODE_ENV === 'production' && process.env.VERCEL;
      const optimizedTimeout = isVercelProduction
        ? Math.min(config.selectorTimeout, 8000)
        : Math.min(config.selectorTimeout, 3000);

      waitPromises.push(
        page
          .waitForSelector('.img-thumb', { timeout: optimizedTimeout })
          .catch(() => console.warn(`카페 ${cafeId}: 이미지 선택자 대기 시간 초과 (${optimizedTimeout}ms)`))
      );
    }

    if (config.minWaitTime) {
      const isVercelProduction = process.env.NODE_ENV === 'production' && process.env.VERCEL;
      const optimizedMinWait = isVercelProduction
        ? Math.min(config.minWaitTime, 2000)
        : Math.min(config.minWaitTime, 1000);

      waitPromises.push(page.waitForTimeout(optimizedMinWait));
    }

    if (waitPromises.length > 0) await Promise.race(waitPromises);
  }

  const data = await page.evaluate(() => {
    const toAbsoluteUrl = (src: string | null) => src && !src.startsWith('http') ? `https:${src}` : src;

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

/**
 * @description 기본 Chromium 브라우저 실행 인수를 반환하는 함수
 * @returns string[] - Chromium 실행에 필요한 기본 명령행 인수 배열
 */
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

/**
 * @description Vercel 서버리스 환경에 최적화된 Chromium 브라우저 실행 인수를 반환하는 함수
 * @returns string[] - Vercel 환경에서 메모리 및 성능 최적화된 Chromium 실행 인수 배열
 */
export function getVercelOptimizedChromiumArgs(): string[] {
  return [
    ...chromiumPkg.args,
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--disable-background-timer-throttling',
    '--disable-renderer-backgrounding',
    '--disable-backgrounding-occluded-windows',
    '--disable-web-security',
    '--disable-features=VizDisplayCompositor,TranslateUI,BlinkGenPropertyTrees',
    '--disable-extensions',
    '--disable-plugins',
    '--disable-default-apps',
    '--disable-sync',
    '--disable-translate',
    '--hide-scrollbars',
    '--mute-audio',
    '--no-first-run',
    '--disable-ipc-flooding-protection',
    '--disable-component-extensions-with-background-pages',
    '--disable-background-networking',
    '--disable-component-update',
    '--disable-client-side-phishing-detection',
    '--disable-hang-monitor',
    '--disable-popup-blocking',
    '--disable-prompt-on-repost',
    '--disable-domain-reliability',
    '--autoplay-policy=user-gesture-required',
    '--disable-images',
    '--disable-gpu',
    '--disable-software-rasterizer',
    '--disable-background-media-pause',
    '--disable-renderer-accessibility',
    '--disable-client-side-phishing-detection',
    '--disable-features=AudioServiceOutOfProcess',
    '--force-color-profile=srgb',
    '--disable-accelerated-2d-canvas',
    '--disable-accelerated-jpeg-decoding',
    '--disable-accelerated-mjpeg-decode',
    '--disable-accelerated-video-decode',
    '--disable-app-list-dismiss-on-blur',
    '--disable-accelerated-video-encode',
    '--disable-blink-features=AutomationControlled',
    '--disable-dev-tools',
    '--disable-logging',
    '--disable-web-sockets',
    '--no-zygote',
    '--single-process',
    '--aggressive-cache-discard',
    '--memory-pressure-off',
  ];
}

/**
 * @description 프로덕션 환경에서 Chromium 실행 파일 경로를 반환하는 함수
 * @returns Promise<string> | undefined - 프로덕션 환경일 때 Chromium 실행 파일 경로, 개발 환경일 때 undefined
 */
export function getProductionExecutablePath(): Promise<string> | undefined {
  return process.env.NODE_ENV === 'production'
    ? chromiumPkg.executablePath()
    : undefined;
}

/**
 * @description 환경에 따라 최적화된 크롤링 설정을 반환하는 함수
 * @returns CrawlingConfig - Vercel 프로덕션 환경과 로컬 환경에 맞게 최적화된 크롤링 설정
 */
export function getOptimizedCrawlingConfig(): CrawlingConfig {
  const isVercelProduction = process.env.NODE_ENV === 'production' && process.env.VERCEL;

  return {
    waitUntil: 'networkidle',
    timeout: isVercelProduction ? 15000 : 10000,
    selectorTimeout: isVercelProduction ? 8000 : 3000,
    minWaitTime: isVercelProduction ? 2000 : 500,
    resourceBlocking: {
      blockImages: false,
      blockFonts: true,
      blockStylesheets: false,
    },
  };
}

/**
 * @description 크롤링 중 발생한 에러를 분석하여 적절한 에러 메시지를 반환하는 함수
 * @param error - 발생한 에러 객체 (unknown 타입)
 * @returns { error: string; details: string; status: number } - 사용자 친화적 에러 메시지와 HTTP 상태 코드
 */
export function handleCrawlingError(error: unknown): { error: string; details: string; status: number } {
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