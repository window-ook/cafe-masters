import { NextResponse } from 'next/server';
import { chromium } from 'playwright-core';
import chromiumPkg from '@sparticuz/chromium';

export const runtime = 'nodejs';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id) return NextResponse.json({ error: 'Invalid cafe ID' }, { status: 400 });

  try {
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

    await page.goto(`https://place.map.kakao.com/${id}`, {
      waitUntil: 'domcontentloaded',
      timeout: 3000,
    });

    try {
      await page.waitForSelector('.img-thumb.img_cfit', { timeout: 1000 });
      await page.waitForSelector('.list_goods', { timeout: 1000 }).catch(() => {
        console.log('메뉴 정보 없음 또는 로딩 실패');
      });
    } catch (e) {
      console.warn('요소 대기 시간 초과 - 현재 상태로 크롤링 진행:', e instanceof Error ? e.message : String(e));
    }

    const data = await page.evaluate(() => {
      const toAbsoluteUrl = (src: string | null) =>
        src && !src.startsWith('http') ? `https:${src}` : src;

      // 대표 이미지
      const imgElement = document.querySelector('.img-thumb.img_cfit');
      const photo = toAbsoluteUrl(imgElement?.getAttribute('src') || null);

      // 리뷰 이미지 2개
      const photos = Array.from(
        document.querySelectorAll(
          '.col.col_depth1 .col.col_depth2 .img-thumb.img_cfit',
        ),
      );
      const photoList = photos
        .slice(0, 2)
        .map(el => toAbsoluteUrl(el.getAttribute('src')));

      // 영업 시간
      const timeElement = document.querySelector('.line_fold .txt_detail');
      let openingHours = timeElement
        ? timeElement.textContent?.trim().replace(/\s+/g, ' ') || ''
        : '';
      openingHours = openingHours.replace(/^매일\s+/, '').trim();

      // 메뉴 4개 (안전한 크롤링)
      let menuItems: Array<{ name: string; price: string }> = [];
      try {
        const menuContainer = document.querySelector('.list_goods');
        if (menuContainer) {
          menuItems = Array.from(menuContainer.querySelectorAll('li'))
            .slice(0, 4)
            .map(el => ({
              name: el.querySelector('.tit_item')?.textContent?.trim() || '',
              price: el.querySelector('.desc_item')?.textContent?.trim() || '',
            }))
            .filter(menu => menu.name && menu.price);
        }
      } catch (menuError) {
        console.error('Menu crawling error:', menuError);
        menuItems = [];
      }

      return {
        image: photo,
        extra_images: photoList,
        opening_time: openingHours,
        menus: menuItems
      };
    });

    console.log(`✅ 카페 ${id} 조회 완료:`, {
      image: !!data.image,
      extraImages: data.extra_images.length,
      hasOpeningTime: !!data.opening_time,
      menuCount: data.menus.length
    });

    await context.close();
    await browser.close();
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