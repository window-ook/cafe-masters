import { Browser, BrowserContext, Page, Route } from 'playwright-core';
import { EXTERNAL_PATHS } from '@/lib/paths';
import chromiumPkg from '@sparticuz/chromium';

/** 카페 스크래핑 결과를 나타내는 인터페이스
 * @property image - 카페 대표 이미지 URL (없을 경우 null)
 * @property extra_images - 추가 카페 이미지 URL 배열 (최대 2개)
 * @property opening_time - 카페 운영 시간 정보
 */
export interface CafeScrapingResult {
  image: string | null;
  extra_images: (string | null)[];
  opening_time: string;
}

/** 브라우저 설정을 위한 인터페이스
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

/** 스크래핑 동작 설정을 위한 인터페이스
 * @property waitUntil - 페이지 로드 완료 조건 ('load' | 'domcontentloaded' | 'networkidle' | 'commit')
 * @property timeout - 페이지 로드 최대 대기 시간 (밀리초)
 * @property selectorTimeout - 특정 선택자 대기 최대 시간 (선택적, 밀리초)
 * @property minWaitTime - 최소 대기 시간 (선택적, 밀리초)
 * @property resourceBlocking - 리소스 차단 설정 (선택적)
 */
export interface ScrapingConfig {
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

/** 기본 브라우저 컨텍스트를 생성
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


/** 페이지 리소스 로딩을 선택적으로 차단하여 스크래핑 성능을 최적화
 * @param page - Playwright Page 인스턴스
 * @param config - 리소스 차단 설정 (선택적)
 * @returns Promise<void> - 비동기 작업 완료
 */
export async function setupResourceBlocking(
  page: Page,
  config?: ScrapingConfig['resourceBlocking']
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

/** 카카오맵에서 특정 카페의 상세 정보를 스크래핑
 * @param page - Playwright Page 인스턴스
 * @param cafeId - 카카오맵 카페 ID
 * @param config - 스크래핑 설정 객체
 * @returns Promise<CafeScrapingResult> - 스크래핑된 카페 정보 (이미지, 운영시간 등)
 */
export async function scrapCafeData(
  page: Page,
  cafeId: string,
  config: ScrapingConfig
): Promise<CafeScrapingResult> {
  await page.goto(EXTERNAL_PATHS.KAKAO_MAP_CAFE_DETAIL(cafeId), {
    waitUntil: config.waitUntil,
    timeout: config.timeout,
  });

  if (config.minWaitTime || config.selectorTimeout) {
    const waitPromises: Promise<unknown>[] = [];

    if (config.selectorTimeout) {
      waitPromises.push(
        page
          .waitForSelector('.img-thumb', { timeout: config.selectorTimeout })
          .catch(() => console.warn(`${cafeId}: 이미지 선택자 대기 시간 초과 (${config.selectorTimeout}ms)`))
      );
    }

    if (config.minWaitTime) waitPromises.push(page.waitForTimeout(config.minWaitTime));
    if (waitPromises.length > 0) await Promise.race(waitPromises);
  }

  const data = await page.evaluate(() => {
    const toAbsoluteUrl = (src: string | null) => src && !src.startsWith('http') ? `https:${src}` : src;
    const imgElement = document.querySelector('.img-thumb.img_cfit');
    const photo = toAbsoluteUrl(imgElement?.getAttribute('src') || null);

    let photoList: (string | null)[] = [];
    let openingHours = '';

    // 추가 이미지, 운영시간 추출
    {
      const photos = Array.from(document.querySelectorAll('.col.col_depth1 .col.col_depth2 .img-thumb.img_cfit'));
      photoList = photos
        .slice(0, 2)
        .map(el => toAbsoluteUrl(el.getAttribute('src')));

      // 여러 .line_fold에서 유효한 시간 형식을 찾기
      const timeElements = document.querySelectorAll('.line_fold .txt_detail');
      openingHours = '';

      for (const element of timeElements) {
        const timeText = element.textContent?.trim().replace(/\s+/g, ' ') || '';

        // 유효한 운영시간 검증
        if (timeText && /\d{1,2}:\d{2}/.test(timeText) && !timeText.includes('휴무')) {
          openingHours = timeText.replace(/^매일\s+/, '').trim();
          break;
        }
      }

      if (!openingHours) openingHours = '운영시간 정보 없음';
    }

    return {
      image: photo,
      extra_images: photoList,
      opening_time: openingHours,
    };
  });

  console.log(`✅ ${cafeId} 조회 완료:`, {
    image: !!data.image,
    extraImages: data.extra_images.length,
    hasOpeningTime: !!data.opening_time,
  });

  return data;
}

/** 기본 Chromium 브라우저 실행 인수를 반환
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

/** 프로덕션 환경에서 Chromium 실행 파일 경로를 반환
 * @returns Promise<string> | undefined - 프로덕션 환경일 때 Chromium 실행 파일 경로, 개발 환경일 때 undefined
 */
export function getProductionExecutablePath(): Promise<string> | undefined {
  return process.env.NODE_ENV === 'production'
    ? chromiumPkg.executablePath()
    : undefined;
}

/** 로컬 환경에 최적화된 스크래핑 설정을 반환
 * @returns ScrapingConfig - 로컬 환경에 맞게 최적화된 스크래핑 설정
 */
export function getOptimizedScrapingConfig(): ScrapingConfig {
  return {
    waitUntil: 'networkidle',
    timeout: 10000,
    selectorTimeout: 3000,
    minWaitTime: 500,
    resourceBlocking: {
      blockImages: false,
      blockFonts: true,
      blockStylesheets: false,
    },
  };
}

/** 스크래핑 중 발생한 에러를 분석하여 적절한 에러 메시지를 반환
 * @param error - 발생한 에러 객체 (unknown 타입)
 * @returns { error: string; details: string; status: number } - 사용자 친화적 에러 메시지와 HTTP 상태 코드
 */
export function handleScrapingError(error: unknown): { error: string; details: string; status: number } {
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