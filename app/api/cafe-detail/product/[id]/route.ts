import { NextResponse } from 'next/server';
import { chromium } from 'playwright-core';
import chromiumPkg from '@sparticuz/chromium';

export const runtime = 'nodejs';
export const maxDuration = 10; // Vercel timeout 10초로 제한

// 카페 상세 정보 타입 정의
interface ICafeDetailData {
  image: string | null;
  extra_images: string[];
  opening_time: string;
  menus: Array<{ name: string; price: string }>;
}

// 간단한 메모리 캐시 (Vercel 함수 인스턴스 수준)
const cache = new Map<string, { data: ICafeDetailData; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5분

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: 'Invalid cafe ID' }, { status: 400 });
  }

  // 캐시 확인
  const cacheKey = `cafe-${id}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`✅ 캐시에서 카페 ${id} 데이터 반환`);
    return NextResponse.json(cached.data);
  }

  try {
    // Vercel 환경을 위한 Chromium 설정
    const browser = await chromium.launch({
      args: [
        ...chromiumPkg.args,
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-background-timer-throttling',
        '--disable-renderer-backgrounding',
        '--disable-backgrounding-occluded-windows',
      ],
      executablePath: process.env.NODE_ENV === 'production' 
        ? await chromiumPkg.executablePath() 
        : undefined,
      headless: true,
    });

    const context = await browser.newContext({
      viewport: { width: 800, height: 600 },
    });
    
    const page = await context.newPage();

    // 네트워크 최적화 - 크롤링에 불필요한 리소스 차단
    await page.route('**/*', (route) => {
      const url = route.request().url();
      const resourceType = route.request().resourceType();
      
      // 카카오맵 이미지는 허용, 기타 외부 리소스 차단
      const isKakaoResource = url.includes('kakao');
      const isEssentialResource = ['document', 'xhr', 'fetch'].includes(resourceType);
      
      if (!isKakaoResource && !isEssentialResource) {
        route.abort();
      } else {
        route.continue();
      }
    });

    // 페이지 접속 - Vercel 환경 최적화
    await page.goto(`https://place.map.kakao.com/${id}`, {
      waitUntil: 'domcontentloaded',
      timeout: 8000,
    });

    console.log(`✅ 카페 ${id} 상세정보 크롤링 시작`);

    // Vercel 환경 최적화 - 더 빠른 요소 대기
    const waitForElementSafely = async (selector: string, timeout: number = 3000) => {
      try {
        await page.waitForSelector(selector, { timeout, state: 'visible' });
        return true;
      } catch (error) {
        console.warn(`요소 ${selector} 대기 실패:`, error instanceof Error ? error.message : String(error));
        return false;
      }
    };

    // 필수 요소 대기 - Vercel 최적화
    const imageReady = await waitForElementSafely('.img-thumb.img_cfit', 4000);
    const menuReady = await waitForElementSafely('.list_goods', 2000);
    
    console.log(`요소 대기 결과: image=${imageReady}, menu=${menuReady}`);

    // 추가 안전 대기 - 최소화
    await page.waitForTimeout(1000);

    // 선택적 크롤링 - 사용 가능한 데이터만 수집
    const data = await page.evaluate((): ICafeDetailData => {
      const toAbsoluteUrl = (src: string | null) =>
        src && !src.startsWith('http') ? `https:${src}` : src;

      // 대표 이미지
      const imgElement = document.querySelector('.img-thumb.img_cfit');
      const photo = toAbsoluteUrl(imgElement?.getAttribute('src') || null);

      // 리뷰 이미지 2개 (빠르게 수집)
      const photos = Array.from(
        document.querySelectorAll(
          '.col.col_depth1 .col.col_depth2 .img-thumb.img_cfit',
        ),
      );
      const photoList = photos
        .slice(0, 2)
        .map(el => toAbsoluteUrl(el.getAttribute('src')))
        .filter((url): url is string => Boolean(url));

      // 영업 시간 (간단화)
      const timeElement = document.querySelector('.line_fold .txt_detail');
      const openingHours = timeElement?.textContent?.trim().replace(/\s+/g, ' ').replace(/^매일\s+/, '').trim() || '';

      // 메뉴 - 빠른 수집
      const menuItems: Array<{name: string; price: string}> = [];
      const menuContainer = document.querySelector('.list_goods');
      if (menuContainer) {
        const menuElements = menuContainer.querySelectorAll('li');
        for (let i = 0; i < Math.min(4, menuElements.length); i++) {
          const el = menuElements[i];
          const name = el.querySelector('.tit_item')?.textContent?.trim();
          const price = el.querySelector('.desc_item')?.textContent?.trim();
          if (name && price) {
            menuItems.push({ name, price });
          }
        }
      }

      return {
        image: photo,
        extra_images: photoList,
        opening_time: openingHours,
        menus: menuItems
      };
    });
    
    console.log(`✅ 카페 ${id} 크롤링 완료:`, {
      image: !!data.image,
      extraImages: data.extra_images.length,
      hasOpeningTime: !!data.opening_time,
      menuCount: data.menus.length
    });
    
    await context.close();
    await browser.close();
    
    // 캐시에 저장
    cache.set(cacheKey, { data, timestamp: Date.now() });
    
    // 오래된 캐시 정리
    if (cache.size > 100) {
      const now = Date.now();
      for (const [key, value] of cache.entries()) {
        if (now - value.timestamp > CACHE_TTL) {
          cache.delete(key);
        }
      }
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('카페 상세정보 크롤링 실패:', error);
    
    // 구체적인 에러 타입별 처리
    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        return NextResponse.json({ 
          error: '페이지 로딩 시간 초과', 
          details: '카카오맵 서버 응답이 지연되고 있습니다.' 
        }, { status: 408 });
      }
      if (error.message.includes('net::ERR_')) {
        return NextResponse.json({ 
          error: '네트워크 연결 실패', 
          details: '인터넷 연결을 확인해주세요.' 
        }, { status: 503 });
      }
    }
    
    return NextResponse.json({ 
      error: '카페 정보를 가져올 수 없습니다', 
      details: '잠시 후 다시 시도해주세요.' 
    }, { status: 500 });
  }
}
