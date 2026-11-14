import { expect, test } from '@playwright/test';

/**
 * 운영 스모크 검사
 * @description 배포하지 않아도 외부 변화로 운영이 깨질 수 있어 핵심 경로만 주기적으로 확인합니다.
 * 2026-10-11 카카오가 지도 SDK 리소스를 kakaocdn.net으로 옮기면서 CSP에 막혀 지도와 검색이 멈춘 장애가 출발점입니다.
 */
const CSP_VIOLATION = 'Content Security Policy';

test('지도와 장소 검색이 동작한다', async ({ page }) => {
  const cspViolations: string[] = [];
  page.on('console', message => {
    if (message.type() === 'error' && message.text().includes(CSP_VIOLATION))
      cspViolations.push(message.text());
  });

  await page.goto('/search');

  /* SDK 본체가 막히면 kakao.maps.load 콜백이 실행되지 않아 services가 생기지 않습니다 */
  await page.waitForFunction(() => !!window.kakao?.maps?.services, undefined, {
    timeout: 20_000,
  });
  await expect.poll(() => page.locator('#map img').count()).toBeGreaterThan(0);

  await page.getByPlaceholder('찾으시는 곳을 입력하세요').fill('성수 카페');
  await page.getByRole('button', { name: '검색 버튼' }).click();
  await expect(page.locator('aside li').first()).toBeVisible();

  expect(cspViolations).toEqual([]);
});
