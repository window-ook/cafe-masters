import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export const runtime = 'nodejs';

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const id = params.id;
  if (!id) {
    return NextResponse.json({ error: 'Invalid cafe ID' }, { status: 400 });
  }

  console.log(`🔍 Fetching cafe details for ID: ${id}`);

  try {
    const browser = await puppeteer.launch({
      headless: true,
    });

    const page = await browser.newPage();
    await page.goto(`https://place.map.kakao.com/${id}`, {
      waitUntil: 'networkidle2',
    });

    await page.waitForSelector('.img-thumb.img_cfit', { timeout: 5000 });
    await page.waitForSelector(
      '.col.col_depth1 .col.col_depth2 .img-thumb.img_cfit',
      { timeout: 5000 },
    );
    await page.waitForSelector('.row_detail .txt_detail', { timeout: 5000 });
    await page.waitForSelector('.line_fold .txt_detail', { timeout: 5000 });

    const data = await page.evaluate(() => {
      const toAbsoluteUrl = (src: string | null) =>
        src && !src.startsWith('http') ? `https:${src}` : src;

      // ✅ 썸네일 이미지 URL 가져오기
      const imgElement = document.querySelector('.img-thumb.img_cfit');
      const photo = toAbsoluteUrl(imgElement?.getAttribute('src') || null);

      // ✅ 리뷰 이미지 4개의 URL 가져오기
      const photos = Array.from(
        document.querySelectorAll(
          '.col.col_depth1 .col.col_depth2 .img-thumb.img_cfit',
        ),
      );
      const photoList = photos
        .slice(0, 4)
        .map(el => toAbsoluteUrl(el.getAttribute('src')));

      // ✅ 주소 정보 가져오기
      const addressElement = document.querySelector('.row_detail .txt_detail');
      const address = addressElement
        ? addressElement.textContent?.trim() || '주소 정보 없음'
        : '주소 정보 없음';

      // ✅ 운영시간 정보 가져오기
      const timeElement = document.querySelector('.line_fold .txt_detail');
      const openingHours = timeElement
        ? timeElement.textContent?.trim().replace(/\s+/g, ' ') ||
          '운영시간 정보 없음'
        : '운영시간 정보 없음';

      // ✅ 메뉴명 & 가격 가져오기
      const menuItems = Array.from(
        document.querySelectorAll('.list_goods > li'),
      )
        .map(el => ({
          name:
            el.querySelector('.tit_item')?.textContent?.trim() || '메뉴명 없음',
          price:
            el.querySelector('.desc_item')?.textContent?.trim() ||
            '가격 정보 없음',
        }))
        .filter(menu => menu.name !== '메뉴명 없음'); // 빈 값 제거

      return { photo, photoList, address, openingHours, menu: menuItems };
    });

    console.log(`📝 크롤링된 데이터:`, data);
    await browser.close();

    return NextResponse.json(data);
  } catch (error) {
    console.error('🚨 Puppeteer 크롤링 중 오류 발생:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
