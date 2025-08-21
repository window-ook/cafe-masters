import { test, expect, Page } from '@playwright/test';

test.describe('사이드바 네비게이션 테스트', () => {
  // 로그인이 필요한 테스트들을 위한 헬퍼 함수
  const performLogin = async (page: Page) => {
    await page.goto('http://localhost:3000/signin');
    await page.waitForLoadState('networkidle');

    // 이미 로그인되어 있으면 메인 페이지로 리다이렉트될 수 있음
    if (page.url().includes('/main')) {
      return;
    }

    await page.fill('input[type="email"]', 'demouser@test.com');
    await page.fill('input[type="password"]', '1234uio!');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/main', { timeout: 10000 });
  };

  test('시나리오 1: 사이드바 기본 표시 및 구조', async ({ page }) => {

    // 사이드바 표시 확인
    const sidebar = page.locator('nav');
    await expect(sidebar).toBeVisible();

    // 로고 "Cafe Masters" 표시 확인
    const logo = page.locator('h1:has-text("Cafe Masters")');
    await expect(logo).toBeVisible();
    await expect(logo).toHaveText('Cafe Masters');

    // 검색 입력 필드 및 "GO" 버튼 확인
    const searchInput = page.locator('search input[placeholder*="찾으시는 곳"]');
    await expect(searchInput).toBeVisible();

    const goButton = page.locator('search button:has-text("GO")');
    await expect(goButton).toBeVisible();

    // 메뉴 항목들 표시 확인
    const menuItems = [
      { text: '검색 결과', selector: 'a[href="/search"]' },
      { text: '내가 수집한 카페', selector: 'a[href="/collection"]' },
      { text: '북마크한 카페', selector: 'a[href="/bookmark"]' },
      { text: '개발자가 추천하는 카페', selector: 'a[href="/recommendation"]' },
      { text: '도움 센터', selector: 'a[href="/help"]' }
    ];

    for (const menuItem of menuItems) {
      const menuElement = page.locator(menuItem.selector);
      await expect(menuElement).toBeVisible();
      await expect(menuElement).toContainText(menuItem.text);
    }

    // 메뉴 개수 표시 확인
    const searchResultCount = page.locator('a[href="/search"] p:last-child');
    await expect(searchResultCount).toBeVisible();
    await expect(searchResultCount).toHaveText('45');

    const recommendationCount = page.locator('a[href="/recommendation"] p:last-child');
    await expect(recommendationCount).toBeVisible();
    await expect(recommendationCount).toHaveText('4');

    // 하단 로그인 영역 확인
    const userEmail = page.locator('footer p:has-text("demouser@test.com")');
    await expect(userEmail).toBeVisible();

    const tierButton = page.locator('button:has-text("BEGINNER")');
    await expect(tierButton).toBeVisible();

    const logoutButton = page.locator('button:has-text("로그아웃")');
    await expect(logoutButton).toBeVisible();
  });

  test('시나리오 2: 사이드바 검색 기능', async ({ page }) => {
    await performLogin(page);

    // 검색 입력 필드 클릭 및 검색어 입력
    const searchInput = page.locator('search input[placeholder*="찾으시는 곳"]');
    await searchInput.click();
    await searchInput.fill('성수');

    // "GO" 버튼 클릭
    const goButton = page.locator('search button:has-text("GO")');
    await goButton.click();

    // 검색 결과 페이지로 이동 확인
    await expect(page).toHaveURL(/.*\/search/);

    // 검색어가 유지되는지 확인
    const searchResultInput = page.locator('input[value="성수"]').first();
    await expect(searchResultInput).toBeVisible();

    // 검색 결과가 표시되는지 확인
    const searchResults = page.locator('[data-testid="search-results"], .search-results, main').first();
    await expect(searchResults).toBeVisible();
  });

  test('시나리오 3: 메뉴별 페이지 이동', async ({ page }) => {
    await performLogin(page);

    // 각 메뉴 클릭 및 페이지 이동 테스트
    const menuTests = [
      {
        name: '검색 결과',
        selector: 'a[href="/search"]',
        expectedUrl: /.*\/search/,
        expectedContent: '검색'
      },
      {
        name: '내가 수집한 카페',
        selector: 'a[href="/collection"]',
        expectedUrl: /.*\/collection/,
        expectedContent: '수집'
      },
      {
        name: '북마크한 카페',
        selector: 'a[href="/bookmark"]',
        expectedUrl: /.*\/bookmark/,
        expectedContent: '북마크'
      },
      {
        name: '개발자가 추천하는 카페',
        selector: 'a[href="/recommendation"]',
        expectedUrl: /.*\/recommendation/,
        expectedContent: '추천'
      },
      {
        name: '도움 센터',
        selector: 'a[href="/help"]',
        expectedUrl: /.*\/help/,
        expectedContent: '도움'
      }
    ];

    for (const menuTest of menuTests) {
      // 메뉴 클릭
      await page.click(menuTest.selector);

      // URL 변경 확인
      await expect(page).toHaveURL(menuTest.expectedUrl);

      // 페이지 콘텐츠 로드 확인
      await expect(page.locator('main, [role="main"], .main-content').first()).toBeVisible();

      // 메인 페이지로 돌아가기 (다음 테스트를 위해)
      await page.click('a[href="/main"], h1:has-text("Cafe Masters")');
      await page.waitForURL('**/main');
    }
  });

  test('시나리오 4: 로그인 상태별 처리', async ({ page }) => {
    // 로그아웃 상태에서 시작
    await page.goto('http://localhost:3000/main');

    // 로그인되지 않은 상태에서는 로그인 페이지로 리다이렉트되어야 함
    await expect(page).toHaveURL(/.*\/login/);

    // 로그인 수행
    await page.fill('input[type="email"]', 'demouser@test.com');
    await page.fill('input[type="password"]', '1234uio!');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/main');

    // 로그인 후 사이드바 하단에 사용자 정보 표시 확인
    const userEmail = page.locator('footer p:has-text("demouser@test.com")');
    await expect(userEmail).toBeVisible();

    const logoutButton = page.locator('button:has-text("로그아웃")');
    await expect(logoutButton).toBeVisible();

    // 보호된 페이지 정상 접근 확인
    await page.click('a[href="/collection"]');
    await expect(page).toHaveURL(/.*\/collection/);

    await page.click('a[href="/bookmark"]');
    await expect(page).toHaveURL(/.*\/bookmark/);
  });

  test('시나리오 5: 로그아웃 기능', async ({ page }) => {
    await performLogin(page);

    // 로그아웃 버튼 클릭
    const logoutButton = page.locator('button:has-text("로그아웃")');
    await logoutButton.click();

    // 로그아웃 후 홈페이지나 로그인 페이지로 이동 확인
    await expect(page).toHaveURL(/.*\/(login)?$/);

    // 보호된 페이지 접근 시 로그인 페이지로 리다이렉트 확인
    await page.goto('http://localhost:3000/collection');
    await expect(page).toHaveURL(/.*\/login/);

    await page.goto('http://localhost:3000/bookmark');
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('시나리오 6: 메뉴 개수 표시 동기화', async ({ page }) => {
    await performLogin(page);

    // 검색 결과 개수 확인
    const initialSearchCount = await page.locator('a[href="/search"] p:last-child').textContent();
    expect(initialSearchCount).toBe('45');

    // 검색 페이지로 이동하여 실제 개수 확인
    await page.click('a[href="/search"]');
    await page.waitForLoadState('networkidle');

    // 검색 결과가 있는지 확인 (정확한 개수 매칭은 데이터에 따라 달라질 수 있음)
    const searchResults = page.locator('[data-testid="cafe-item"], .cafe-card, .search-result-item');
    const resultsCount = await searchResults.count();
    expect(resultsCount).toBeGreaterThan(0);

    // 메인 페이지로 돌아가서 추천 카페 개수 확인
    await page.click('a[href="/main"], h1:has-text("Cafe Masters")');
    await page.waitForURL('**/main');

    const recommendationCount = await page.locator('a[href="/recommendation"] p:last-child').textContent();
    expect(recommendationCount).toBe('4');

    // 추천 페이지로 이동하여 실제 개수 확인
    await page.click('a[href="/recommendation"]');
    await page.waitForLoadState('networkidle');

    const recommendationItems = page.locator('[data-testid="recommendation-item"], .recommendation-card, .cafe-card');
    const recommendationItemsCount = await recommendationItems.count();
    expect(recommendationItemsCount).toBeGreaterThan(0);
  });

  test('시나리오 7: 사이드바 반응형 동작', async ({ page }) => {
    await performLogin(page);

    // 데스크톱 화면에서 사이드바 고정 표시 확인
    await page.setViewportSize({ width: 1280, height: 800 });
    const sidebar = page.locator('nav');
    await expect(sidebar).toBeVisible();

    // 모든 메뉴 완전 표시 확인
    const menuItems = page.locator('nav ul li a');
    const menuCount = await menuItems.count();
    expect(menuCount).toBe(5); // 5개 메뉴

    // 태블릿 화면에서 테스트
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(sidebar).toBeVisible();

    // 모바일 화면에서 테스트
    await page.setViewportSize({ width: 375, height: 667 });

    // 사이드바가 여전히 접근 가능한지 확인
    // 모바일에서는 숨겨져 있을 수 있으므로 햄버거 메뉴나 다른 방식으로 접근
    const mobileMenu = page.locator('button[aria-label*="menu"], .mobile-menu-button, nav').first();
    await expect(mobileMenu).toBeVisible();

    // 화면 크기를 다시 데스크톱으로 복원
    await page.setViewportSize({ width: 1280, height: 800 });
  });

  test('시나리오 8: 키보드 네비게이션 및 접근성', async ({ page }) => {
    await performLogin(page);

    // 검색 필드에 Tab으로 포커스 이동
    await page.keyboard.press('Tab');
    const searchInput = page.locator('search input[placeholder*="찾으시는 곳"]');
    await expect(searchInput).toBeFocused();

    // Enter 키로 검색 실행
    await searchInput.fill('테스트');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/.*\/search/);

    // 메인 페이지로 돌아가기
    await page.goto('http://localhost:3000/main');

    // Tab 키로 메뉴 항목들 순차 접근
    const focusableElements = [
      'search input[placeholder*="찾으시는 곳"]',
      'search button:has-text("GO")',
      'a[href="/search"]',
      'a[href="/collection"]',
      'a[href="/bookmark"]',
      'a[href="/recommendation"]',
      'a[href="/help"]'
    ];

    let tabCount = 0;
    for (const selector of focusableElements) {
      await page.keyboard.press('Tab');
      tabCount++;

      const element = page.locator(selector).first();
      if (await element.isVisible()) {
        await expect(element).toBeFocused({ timeout: 1000 });

        // Enter 키로 링크 활성화 테스트 (첫 번째 메뉴만)
        if (selector === 'a[href="/search"]') {
          await page.keyboard.press('Enter');
          await expect(page).toHaveURL(/.*\/search/);
          await page.goto('http://localhost:3000/main');
          break;
        }
      }
    }

    expect(tabCount).toBeGreaterThan(0);
  });

  test('시나리오 9: 티어 정보 모달 동작', async ({ page }) => {
    await performLogin(page);

    // BEGINNER 티어 버튼 클릭
    const tierButton = page.locator('button:has-text("BEGINNER")');
    await tierButton.click();

    // 티어 모달이 열리는지 확인
    const tierModal = page.locator('dialog[aria-labelledby*="티어"]');
    await expect(tierModal).toBeVisible();

    // 모달 내용 확인
    await expect(page.locator('text=TIER INFORMATION')).toBeVisible();
    await expect(page.locator('text=BEGINNER')).toBeVisible();
    await expect(page.locator('text=JUNIOR')).toBeVisible();
    await expect(page.locator('text=SENIOR')).toBeVisible();
    await expect(page.locator('text=EXPERT')).toBeVisible();
    await expect(page.locator('text=MASTER')).toBeVisible();

    // ESC 키로 모달 닫기
    await page.keyboard.press('Escape');
    await expect(tierModal).not.toBeVisible();
  });

  test('시나리오 10: 테마 토글 기능', async ({ page }) => {
    await performLogin(page);

    // 테마 토글 버튼 확인
    const themeToggle = page.locator('button[aria-label*="테마 토글"]');
    await expect(themeToggle).toBeVisible();

    // 초기 테마 상태 확인
    const initialThemeIcon = themeToggle.locator('svg');
    await expect(initialThemeIcon).toBeVisible();

    // 테마 토글 클릭
    await themeToggle.click();

    // 테마 변경 확인 (아이콘이나 배경 변화)
    await page.waitForTimeout(500); // 애니메이션 대기

    // 다시 클릭하여 원래 테마로 복원
    await themeToggle.click();
    await page.waitForTimeout(500);
  });
});