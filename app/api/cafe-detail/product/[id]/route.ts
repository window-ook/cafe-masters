import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export const runtime = 'nodejs';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: 'Invalid cafe ID' }, { status: 400 });
  }

  try {
    // 브라우저 설정
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: (await chromium.executablePath()) || '/usr/bin/chromium',
      defaultViewport: { width: 800, height: 600 },
      headless: true,
    });

    const page = await browser.newPage();

    await page.setDefaultNavigationTimeout(4000);
    await page.setRequestInterception(true);

    page.on('request', request => {
      const blockedResourceTypes = ['image', 'media', 'font', 'stylesheet'];
      const skipUrls = [
        'googleapis',
        'gstatic',
        'analytics',
        'facebook',
        'twitter',
      ];
      const url = request.url();
      const isKakaoImageUrl =
        url.includes('dapi.kakao.com') || url.includes('map.kakaocdn.net');

      if (
        blockedResourceTypes.includes(request.resourceType()) &&
        !isKakaoImageUrl &&
        skipUrls.some(skipUrl => url.includes(skipUrl))
      ) {
        request.abort();
      } else {
        request.continue();
      }
    });

    // 접속
    const pageLoadPromise = page.goto(`https://place.map.kakao.com/${id}`, {
      waitUntil: 'domcontentloaded',
      timeout: 4000,
    });

    await Promise.race([
      pageLoadPromise,
      new Promise(resolve => setTimeout(resolve, 4000)),
    ]);

    // 필요한 요소만 기다림
    const mainSelector = '.img-thumb.img_cfit';
    
    try {
      await page.waitForSelector(mainSelector, { timeout: 3000 });
    } catch (e) {
      console.error('Main selector wait error:', e);
    }

    console.log('✅ 선택한 카페의 상세 정보 조회 시작');

    // 메뉴 크롤링을 위한 최소한의 대기 (optional)
    await new Promise(resolve => setTimeout(resolve, 1000));

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
      let menuItems: Array<{name: string; price: string}> = [];
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
    console.log(`✅ 선택한 카페 상세 정보: `, data);
    await browser.close();
    return NextResponse.json(data);
  } catch (error) {
    console.error('상세 정보 fetch error:', error);
    return NextResponse.json({ status: 500, error: 'Internal Server Error' });
  }
}
