import { NextResponse } from 'next/server';
import { chromium } from 'playwright-core';
import chromiumPkg from '@sparticuz/chromium';

export const runtime = 'nodejs';
export const maxDuration = 10;

interface ICafeDetailData {
  image: string | null;
  extra_images: string[];
  opening_time: string;
  menus: Array<{ name: string; price: string }>;
}

const cache = new Map<string, { data: ICafeDetailData; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: 'Invalid cafe ID' }, { status: 400 });
  }

  const cacheKey = `cafe-${id}`;
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`✅ 캐시 히트: 카페 ${id} 데이터 반환`);
    return NextResponse.json(cached.data);
  }

  try {
    const browser = await chromium.launch({
      args: [
        ...chromiumPkg.args,
        '--no-sandbox',
        '--disable-dev-shm-usage',
        '--disable-background-timer-throttling',
        '--disable-renderer-backgrounding',
        '--disable-backgrounding-occluded-windows',
        '--disable-extensions',
        '--disable-plugins',
        '--disable-images',
        '--disable-javascript',
      ],
      executablePath: process.env.NODE_ENV === 'production'
        ? await chromiumPkg.executablePath()
        : undefined,
      headless: true,
    });

    const context = await browser.newContext({
      viewport: { width: 400, height: 300 },
      ignoreHTTPSErrors: true,
      bypassCSP: true,
    });

    const page = await context.newPage();

    await page.route('**/*', (route) => {
      const resourceType = route.request().resourceType();

      if (resourceType === 'document') {
        route.continue();
      } else {
        route.abort();
      }
    });

    await page.goto(`https://place.map.kakao.com/${id}`, {
      waitUntil: 'commit',
      timeout: 5000,
    });

    await page.waitForTimeout(500);

    const data = await page.evaluate((): ICafeDetailData => {
      const imgElement = document.querySelector('.img-thumb.img_cfit');
      const timeElement = document.querySelector('.line_fold .txt_detail');
      const menuContainer = document.querySelector('.list_goods');
      const extraImageElements = document.querySelectorAll('.col.col_depth1 .col.col_depth2 .img-thumb.img_cfit');

      const photo = imgElement?.getAttribute('src') || null;
      const photoProcessed = photo && !photo.startsWith('http') ? `https:${photo}` : photo;

      const extraImages = Array.from(extraImageElements)
        .slice(0, 2)
        .map(el => {
          const src = el.getAttribute('src');
          return src && !src.startsWith('http') ? `https:${src}` : src;
        })
        .filter(Boolean) as string[];

      const openingHours = timeElement?.textContent?.trim().replace(/\s+/g, ' ').replace(/^매일\s+/, '').trim() || '';

      const menuItems: Array<{ name: string; price: string }> = [];
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
        image: photoProcessed,
        extra_images: extraImages,
        opening_time: openingHours,
        menus: menuItems
      };
    });

    console.log(`✅ 카페 ${id} 조회 완료: 이미지=${!!data.image}, 메뉴=${data.menus.length}개`);

    await Promise.allSettled([
      context.close(),
      browser.close()
    ]);

    cache.set(cacheKey, { data, timestamp: Date.now() });

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
