import { NextResponse } from 'next/server';
import { chromium } from 'playwright-core';
import chromiumPkg from '@sparticuz/chromium';

export const runtime = 'nodejs';
export const maxDuration = 30;

interface ICafeDetailData {
  image: string | null;
  extra_images: string[];
  opening_time: string;
  menus: Array<{ name: string; price: string }>;
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: 'Invalid cafe ID' }, { status: 400 });
  }


  let browser = null;
  let context = null;
  
  try {
    // 재시도 로직으로 안정성 확보
    const maxRetries = 2;
    let data: ICafeDetailData | null = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        browser = await chromium.launch({
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

        context = await browser.newContext({
          viewport: { width: 1280, height: 720 },
          ignoreHTTPSErrors: true,
          bypassCSP: true,
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        });

        const page = await context.newPage();

        // 리소스 차단을 최소화하여 필요한 스크립트 실행 허용
        await page.route('**/*', (route) => {
          const resourceType = route.request().resourceType();
          
          // 이미지, 폰트, CSS만 차단하고 JavaScript는 허용
          if (resourceType === 'image' || resourceType === 'font' || resourceType === 'stylesheet') {
            route.abort();
          } else {
            route.continue();
          }
        });

        // 페이지 로딩 최적화
        await page.goto(`https://place.map.kakao.com/${id}`, {
          waitUntil: 'networkidle',
          timeout: 8000,
        });

        // 핵심 요소 대기 - 하나라도 성공하면 진행
        await Promise.race([
          page.waitForSelector('.place_details', { timeout: 2000 }),
          page.waitForSelector('.img-thumb', { timeout: 2000 }),
          page.waitForTimeout(1500)
        ]);

        // 추가 대기 시간 - 동적 콘텐츠 로딩 완료
        await page.waitForTimeout(1000);

        data = await page.evaluate((): ICafeDetailData => {
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

        console.log(`✅ 시도 ${attempt}/${maxRetries}: 카페 ${id} 조회 완료 - 이미지=${!!data.image}, 메뉴=${data.menus.length}개`);
        
        // 성공 시 리소스 정리하고 종료
        await Promise.allSettled([
          context.close(),
          browser.close()
        ]);
        
        break; // 성공 시 재시도 루프 종료
        
      } catch (retryError) {
        console.error(`시도 ${attempt}/${maxRetries} 실패:`, retryError);
        
        // 리소스 정리
        if (context) await context.close().catch(() => {});
        if (browser) await browser.close().catch(() => {});
        
        // 마지막 시도가 아니면 재시도
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 대기
          continue;
        }
        
        // 모든 재시도 실패 시 에러 던지기
        throw retryError;
      }
    }

    if (!data) {
      throw new Error('모든 재시도 실패: 데이터를 가져올 수 없습니다');
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
