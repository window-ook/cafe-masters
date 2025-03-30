import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

export const runtime = 'nodejs';

export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const id = params.id;
  if (!id) {
    return NextResponse.json({ error: 'Invalid cafe ID' }, { status: 400 });
  }

  try {
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: (await chromium.executablePath()) || '/usr/bin/chromium',
      headless: true,
      defaultViewport: { width: 1200, height: 800 },
    });

    // 새로운 페이지
    const page = await browser.newPage();

    // 페이지 접속
    await page.goto(`https://place.map.kakao.com/${id}`, {
      waitUntil: 'domcontentloaded',
      timeout: 10000,
    });

    const selectors = [
      '.img-thumb.img_cfit',
      '.col.col_depth1 .col.col_depth2 .img-thumb.img_cfit',
      '.row_detail .txt_detail',
      '.line_fold .txt_detail',
    ];

    await Promise.all(
      selectors.map(selector =>
        page.waitForSelector(selector, { timeout: 5000 }).catch(() => null),
      ),
    );

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
      let address = addressElement
        ? addressElement.textContent?.trim() || ''
        : '';
      address = address.replace(/\(우\)\d{5,}/, '').trim(); // 우편번호 제거

      // ✅ 운영시간 정보 가져오기
      const timeElement = document.querySelector('.line_fold .txt_detail');
      let openingHours = timeElement
        ? timeElement.textContent?.trim().replace(/\s+/g, ' ') || ''
        : '';
      openingHours = openingHours.replace(/^매일\s+/, '').trim();

      // ✅ 메뉴명 & 가격 가져오기
      const menuItems = Array.from(
        document.querySelectorAll('.list_goods > li'),
      )
        .map(el => ({
          name: el.querySelector('.tit_item')?.textContent?.trim() || '',
          price: el.querySelector('.desc_item')?.textContent?.trim() || '',
        }))
        .filter(menu => menu.name !== '');

      return { photo, photoList, address, openingHours, menu: menuItems };
    });

    console.log(`📝 추출된 데이터:`, data);
    await browser.close();

    return NextResponse.json(data);
  } catch (error) {
    console.error('상세 정보 fetch error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
