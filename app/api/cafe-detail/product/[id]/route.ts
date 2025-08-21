import { NextResponse } from 'next/server';
import { chromium, Browser } from 'playwright-core';
import chromiumPkg from '@sparticuz/chromium';

export const runtime = 'nodejs';
export const maxDuration = 30;

let globalBrowser: Browser | null = null;
let browserInitializing = false;

async function getBrowserInstance(): Promise<Browser> {
  if (browserInitializing) {
    while (browserInitializing) await new Promise(resolve => setTimeout(resolve, 100));
    if (globalBrowser && globalBrowser.isConnected()) {
      return globalBrowser;
    }
  }

  if (globalBrowser && globalBrowser.isConnected()) {
    return globalBrowser;
  }

  browserInitializing = true;

  try {
    globalBrowser = await chromium.launch({
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
        '--disable-web-security',
        '--disable-features=VizDisplayCompositor',
      ],
      executablePath: process.env.NODE_ENV === 'production'
        ? await chromiumPkg.executablePath()
        : undefined,
      headless: true,
    });

    return globalBrowser;
  } finally {
    browserInitializing = false;
  }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id) return NextResponse.json({ error: 'Invalid cafe ID' }, { status: 400 });

  let context = null;

  try {
    const startTime = Date.now();
    const browser = await getBrowserInstance();

    context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      ignoreHTTPSErrors: true,
      bypassCSP: true,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    });

    const page = await context.newPage();

    await page.route('**/*', (route) => {
      const resourceType = route.request().resourceType();

      if (resourceType === 'image' || resourceType === 'font' || resourceType === 'stylesheet') route.abort();
      else route.continue();
    });

    await page.goto(`https://place.map.kakao.com/${id}`, {
      waitUntil: 'networkidle',
      timeout: 6000,
    });

    await Promise.race([
      page.waitForSelector('.place_details', { timeout: 2000 }),
      page.waitForSelector('.img-thumb', { timeout: 2000 }),
      page.waitForTimeout(1500)
    ]);

    await page.waitForTimeout(500);

    const data = await page.evaluate(() => {
      const toAbsoluteUrl = (src: string | null) =>
        src && !src.startsWith('http') ? `https:${src}` : src;

      // 대표 이미지
      const imgElement = document.querySelector('.img-thumb.img_cfit');
      const photo = toAbsoluteUrl(imgElement?.getAttribute('src') || null);

      // 리뷰 이미지 2개
      const photos = Array.from(document.querySelectorAll('.col.col_depth1 .col.col_depth2 .img-thumb.img_cfit'));
      const photoList = photos
        .slice(0, 2)
        .map(el => toAbsoluteUrl(el.getAttribute('src')));

      // 영업 시간
      const timeElement = document.querySelector('.line_fold .txt_detail');
      let openingHours = timeElement ? timeElement.textContent?.trim().replace(/\s+/g, ' ') || '' : '';
      openingHours = openingHours.replace(/^매일\s+/, '').trim();

      // 메뉴 4개
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

    const totalTime = Date.now() - startTime;
    console.log(`✅ 카페 ${id} 조회 완료 (총 ${totalTime}ms):`, {
      image: !!data.image,
      extraImages: data.extra_images.length,
      hasOpeningTime: !!data.opening_time,
      menuCount: data.menus.length
    });

    if (context) await context.close().catch(() => { });
    return NextResponse.json(data);
  } catch (error) {
    console.error('카페 상세정보 크롤링 실패:', error);

    if (context) await context.close().catch(() => { });

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