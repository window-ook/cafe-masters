import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export const runtime = 'nodejs';

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const id = params?.id;
  if (!id) {
    return NextResponse.json({ error: 'Invalid cafe ID' }, { status: 400 });
  }

  try {
    // 브라우저 설정
    const browser = await puppeteer.launch({
      defaultViewport: { width: 800, height: 600 },
      headless: true,
    });

    const page = await browser.newPage();

    await page.setDefaultNavigationTimeout(3000);
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
      timeout: 3000,
    });

    await Promise.race([
      pageLoadPromise,
      new Promise(resolve => setTimeout(resolve, 3000)),
    ]);

    // 필요한 요소만 기다림
    const mainSelector = '.img-thumb.img_cfit';
    const menuSelector = '.list_goods';
    try {
      await page.waitForSelector(mainSelector, { timeout: 3000 });
      await page.waitForSelector(menuSelector, { timeout: 3000 });
    } catch (e) {
      console.error(e);
    }

    // 추출
    const data = await page.evaluate(() => {
      const toAbsoluteUrl = (src: string | null) =>
        src && !src.startsWith('http') ? `https:${src}` : src;

      // 대표 이미지
      const thumbnail = document.querySelector('.img-thumb.img_cfit');
      const photo = toAbsoluteUrl(thumbnail?.getAttribute('src') || null);

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

      // 메뉴 3개
      const menuItems = Array.from(document.querySelectorAll('.list_goods li'))
        .slice(0, 3)
        .map(el => ({
          name: el.querySelector('.tit_item')?.textContent?.trim() || '',
          price: el.querySelector('.desc_item')?.textContent?.trim() || '',
        }))
        .filter(menu => menu.name && menu.price); // 이름과 가격이 모두 있는 경우만 포함

      return { photo, photoList, openingHours, menu: menuItems };
    });
    console.log(`✅ 카페 상세 정보: `, data);
    await browser.close();
    return NextResponse.json(data);
  } catch (error) {
    console.error('상세 정보 fetch error:', error);
    return NextResponse.json({ status: 500, error: 'Internal Server Error' });
  }
}
