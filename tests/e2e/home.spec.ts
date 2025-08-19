import { test, expect } from '@playwright/test';

test.describe('홈페이지 네비게이션 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
  });

  test('시나리오 1: 메인 입장하기 버튼 동작 검증', async ({ page }) => {
    // 페이지 로딩 완료 대기
    await expect(page.locator('h1')).toContainText('카페 컬렉션의 새로운 경험을');
    
    // "입장하기" 버튼 존재 확인
    const enterButton = page.locator('a[href="/main"]', { hasText: '입장하기' });
    await expect(enterButton).toBeVisible();
    await expect(enterButton).toHaveText('입장하기');
    
    // "입장하기" 버튼 클릭
    await enterButton.click();
    
    // /main 페이지로 리다이렉트 확인 (네비게이션 완료 대기)
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('http://localhost:3000/main');
    
    // 메인 페이지의 사이드바와 콘텐츠 영역이 정상 표시되는지 확인
    await expect(page.locator('main')).toBeVisible();
  });

  test('시나리오 2: 하단 "지금 시작하기" 버튼 동작 검증', async ({ page }) => {
    // 하단으로 스크롤
    const startButton = page.locator('a[href="/signin"]', { hasText: '지금 시작하기' });
    await startButton.scrollIntoViewIfNeeded();
    
    // "지금 시작하기" 버튼 존재 확인
    await expect(startButton).toBeVisible();
    await expect(startButton).toHaveText('지금 시작하기');
    
    // "지금 시작하기" 버튼 클릭
    await startButton.click();
    
    // /signin 페이지로 리다이렉트 확인 (네비게이션 완료 대기)
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('http://localhost:3000/signin');
  });

  test('시나리오 3: ContactCard 버튼 동작 검증', async ({ page }) => {
    // 하단으로 스크롤하여 Contact 섹션 찾기
    const contactSection = page.locator('section').filter({ hasText: 'Contact me' });
    await contactSection.scrollIntoViewIfNeeded();
    
    // Contact me. 섹션이 표시되는지 확인
    await expect(contactSection).toBeVisible();
    
    // ContactCard 버튼들 확인
    const guideButton = page.locator('button[aria-label="카페 마스터즈 사용법 버튼"]');
    const feedbackButton = page.locator('button[aria-label="피드백을 들려주세요 버튼"]');
    
    await expect(guideButton).toBeVisible();
    await expect(feedbackButton).toBeVisible();
    
    // 첫 번째 버튼 클릭 가능성 확인
    await expect(guideButton).toBeEnabled();
    await guideButton.hover();
    
    // 두 번째 버튼 클릭 가능성 확인  
    await expect(feedbackButton).toBeEnabled();
    await feedbackButton.hover();
    
    // 실제 클릭 테스트 (새 탭에서 열리므로 context 처리)
    const [guideTab] = await Promise.all([
      page.context().waitForEvent('page'),
      guideButton.click()
    ]);
    
    // 새 탭이 GitHub 링크로 이동하는지 확인
    await expect(guideTab).toHaveURL(/github\.com/);
    await guideTab.close();
    
    const [feedbackTab] = await Promise.all([
      page.context().waitForEvent('page'),
      feedbackButton.click()
    ]);
    
    // 새 탭이 Notion 링크로 이동하는지 확인  
    await expect(feedbackTab).toHaveURL(/notion\.site/);
    await feedbackTab.close();
  });

  test('시나리오 4: 반응형 디자인 검증', async ({ page }) => {
    // 데스크톱 해상도 (1280x720)에서 테스트
    await page.setViewportSize({ width: 1280, height: 720 });
    
    const enterButton = page.locator('a[href="/main"]', { hasText: '입장하기' });
    await expect(enterButton).toBeVisible();
    
    // 버튼 클릭 테스트
    await enterButton.click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('http://localhost:3000/main');
    
    // 홈페이지로 다시 돌아가기
    await page.goto('http://localhost:3000');
    
    // 태블릿 해상도 (768x1024)로 변경
    await page.setViewportSize({ width: 768, height: 1024 });
    
    await expect(enterButton).toBeVisible();
    
    // "지금 시작하기" 버튼도 확인
    const startButton = page.locator('a[href="/signin"]', { hasText: '지금 시작하기' });
    await startButton.scrollIntoViewIfNeeded();
    await expect(startButton).toBeVisible();
    
    // 모바일 해상도 (375x667)로 변경
    await page.setViewportSize({ width: 375, height: 667 });
    
    await expect(enterButton).toBeVisible();
    await expect(startButton).toBeVisible();
    
    // 모바일에서 버튼 클릭 테스트
    await enterButton.click();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveURL('http://localhost:3000/main');
    
    // ContactCard도 모바일에서 확인
    await page.goto('http://localhost:3000');
    const contactSection = page.locator('section').filter({ hasText: 'Contact me' });
    await contactSection.scrollIntoViewIfNeeded();
    
    const guideButton = page.locator('button[aria-label="카페 마스터즈 사용법 버튼"]');
    const feedbackButton = page.locator('button[aria-label="피드백을 들려주세요 버튼"]');
    
    await expect(guideButton).toBeVisible();
    await expect(feedbackButton).toBeVisible();
    
    // 모바일에서 터치 영역이 적절한지 확인
    const guideButtonBox = await guideButton.boundingBox();
    const feedbackButtonBox = await feedbackButton.boundingBox();
    
    expect(guideButtonBox?.height).toBeGreaterThan(44); // 최소 터치 영역 44px
    expect(feedbackButtonBox?.height).toBeGreaterThan(44);
  });

  test('네비게이션 요소들의 일관성 검증', async ({ page }) => {
    // 두 네비게이션 버튼이 모두 존재하는지 확인
    const enterButton = page.locator('a[href="/main"]', { hasText: '입장하기' });
    const startButton = page.locator('a[href="/signin"]', { hasText: '지금 시작하기' });
    
    await expect(enterButton).toBeVisible();
    await startButton.scrollIntoViewIfNeeded();
    await expect(startButton).toBeVisible();
    
    // 버튼들의 스타일링이 일관되는지 확인 (hover 효과 등)
    await enterButton.hover();
    await expect(enterButton).toHaveCSS('transition-property', 'all');
    
    await startButton.hover();
    await expect(startButton).toHaveCSS('transition-property', 'all');
    
    // Contact 버튼들의 접근성 확인
    const contactSection = page.locator('section').filter({ hasText: 'Contact me' });
    await contactSection.scrollIntoViewIfNeeded();
    
    const contactButtons = page.locator('button[aria-label*="버튼"]');
    const buttonCount = await contactButtons.count();
    expect(buttonCount).toBe(2);
    
    // 모든 버튼이 키보드로 접근 가능한지 확인
    for (let i = 0; i < buttonCount; i++) {
      const button = contactButtons.nth(i);
      await button.focus();
      await expect(button).toBeFocused();
    }
  });

  test('페이지 로딩 성능 검증', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // 페이지가 5초 이내에 로드되어야 함 (개발 환경에서는 더 관대하게)
    expect(loadTime).toBeLessThan(5000);
    
    // 주요 요소들이 모두 렌더링되었는지 확인
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('a[href="/main"]')).toBeVisible();
    
    // 배경 이미지나 애니메이션이 렌더링되었는지 확인
    const heroSection = page.locator('section').first();
    await expect(heroSection).toBeVisible();
  });
});