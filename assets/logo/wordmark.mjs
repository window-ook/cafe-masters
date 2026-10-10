/**
 * Cafe Masters — Anton 워드마크 래스터
 *
 *   node assets/logo/wordmark.mjs
 *
 * generate.cjs가 락업 SVG를 버리며 남긴 결론을 그대로 실행합니다.
 * 워드마크를 Anton으로 조판하기로 한 이상 자형은 폰트가 소유하므로,
 * 이미지가 필요한 자리에서는 폰트를 아는 쪽이 래스터해야 합니다.
 * Blender는 woff2를 읽지 못하고, 커닝과 힌팅을 다시 구현할 이유도 없습니다.
 *
 * 폰트는 next/font가 받아 둔 latin 서브셋을 복사해 씁니다. 네트워크를 타면
 * 오프라인에서 자형이 조용히 폴백되는데, 그 사고는 굽고 나서야 드러납니다.
 *
 * 흰 글자에 투명 배경으로 뽑습니다. 색은 팩 팔레트가 정해야 하므로
 * 여기서는 알파 마스크만 만들고 칠은 art_builder에 넘깁니다.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { chromium } from '@playwright/test';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FONT_PATH = path.join(HERE, '..', 'fonts', 'Anton-latin.woff2');
const OUT_PATH = path.join(HERE, 'wordmark.png');

const TEXT = 'CAFE MASTERS';
const TARGET_WIDTH = 900;   // 팩 앞면 1024px 안에서 좌우 여백 62px씩
const TRACKING = 0.02;      // 자폭 대비 자간. Anton은 이미 좁아 조금만 벌립니다

const font = fs.readFileSync(FONT_PATH).toString('base64');

// 번들 브라우저 대신 시스템 Chrome을 씁니다. 워드마크를 다시 뽑는 일은
// 드물어서, 그때마다 playwright install을 요구하면 굽는 것 자체가 막힙니다
const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage();

await page.setContent(`<style>
  @font-face {
    font-family: Anton;
    src: url(data:font/woff2;base64,${font}) format('woff2');
  }
</style>`);

const dataUrl = await page.evaluate(async ({ text, targetWidth, tracking }) => {
  await document.fonts.load('400 200px Anton');

  const measure = (size, spacing) => {
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.letterSpacing = `${spacing}px`;
    ctx.font = `400 ${size}px Anton`;

    return ctx.measureText(text);
  };

  // 200px에서 재고 비례로 늘립니다. 자간도 같이 커져야 비율이 유지됩니다
  const probe = measure(200, 200 * tracking);
  const size = Math.round((200 * targetWidth) / probe.width);
  const spacing = size * tracking;

  const box = measure(size, spacing);
  const ascent = Math.ceil(box.actualBoundingBoxAscent);
  const descent = Math.ceil(box.actualBoundingBoxDescent);
  const width = Math.ceil(box.width);

  // 캔버스를 글자 잉크에 딱 맞춥니다. 폰트 메트릭에 맞추면 위아래로
  // 빈 줄이 남아, 합성할 때 눈으로 본 중심과 계산한 중심이 어긋납니다
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = ascent + descent;

  const ctx = canvas.getContext('2d');
  ctx.letterSpacing = `${spacing}px`;
  ctx.font = `400 ${size}px Anton`;
  ctx.fillStyle = '#ffffff';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(text, 0, ascent);

  return canvas.toDataURL('image/png');
}, { text: TEXT, targetWidth: TARGET_WIDTH, tracking: TRACKING });

await browser.close();

fs.writeFileSync(OUT_PATH, Buffer.from(dataUrl.split(',')[1], 'base64'));

console.log(`  워드마크    ${TEXT}`);
console.log(`  저장        ${OUT_PATH}`);
