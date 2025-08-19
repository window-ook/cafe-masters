import { test, expect, Page } from '@playwright/test';

/**
 * 카페 수집 기능 E2E 테스트
 * 
 * 테스트 범위:
 * 1. 카페 수집 기본 플로우
 * 2. 평점별 등급 시스템 (Under/Silver/Gold)
 * 3. 중복 수집 방지
 * 4. 컬렉션 페이지 연동
 * 5. 티어 시스템 진행도
 * 6. 에러 처리 및 데이터 검증
 * 7. 수집된 카페 상세 관리
 */

const TEST_USER = {
  email: 'demouser@test.com',
  password: '1234uio!'
};

// 테스트 헬퍼 함수들
class CafeCollectionHelper {
  constructor(private page: Page) { }

  async login() {
    await this.page.goto('/signin');
    await this.page.fill('input[type="email"]', TEST_USER.email);
    await this.page.fill('input[type="password"]', TEST_USER.password);
    await this.page.click('button[type="submit"]');
    await this.page.waitForURL('/main');
  }

  async navigateToRecommendation() {
    await this.page.goto('/recommendation');
    await this.page.waitForLoadState('networkidle');
  }

  async navigateToCollection() {
    await this.page.goto('/collection');
    await this.page.waitForLoadState('networkidle');
  }

  async searchCafes(keyword: string) {
    await this.page.goto('/main');
    await this.page.fill('input[placeholder="찾으시는 곳을 입력하세요"]', keyword);
    await this.page.click('button:has-text("GO")');
    await this.page.waitForLoadState('networkidle');
  }

  async openCafeDetail() {
    // 추천 카페나 검색 결과에서 첫 번째 카페 클릭
    const cafeCard = this.page.locator('[data-testid="cafe-card"]').first();
    if (await cafeCard.count() > 0) {
      await cafeCard.click();
    } else {
      // 카카오맵 마커 클릭 시도
      await this.page.locator('#map').click({ position: { x: 400, y: 300 } });
    }

    // 카페 상세 모달 표시 대기
    await this.page.waitForSelector('[data-testid="cafe-detail-modal"]', { timeout: 10000 });
  }

  async collectCafe(rating: number, memo?: string) {
    // 수집하기 버튼 클릭
    await this.page.click('[data-testid="collect-cafe-button"]');

    // 평점 선택
    await this.page.click(`[data-testid="rating-star-${rating}"]`);

    // 메모 입력 (선택사항)
    if (memo) {
      await this.page.fill('[data-testid="cafe-memo-input"]', memo);
    }

    // 수집 완료 버튼 클릭
    await this.page.click('[data-testid="confirm-collect-button"]');

    // 수집 완료 메시지 확인
    await this.page.waitForSelector('[data-testid="collection-success-message"]');
  }

  async getCollectionCount(): Promise<number> {
    const countElement = this.page.locator('[data-testid="collection-count"]');
    const countText = await countElement.textContent();
    return parseInt(countText || '0', 10);
  }

  async getTierInfo() {
    const tierElement = this.page.locator('[data-testid="user-tier"]');
    return {
      tier: await tierElement.getAttribute('data-tier'),
      text: await tierElement.textContent()
    };
  }

  async getCafeCardGrade(cafeId: string): Promise<string> {
    const gradeElement = this.page.locator(`[data-testid="cafe-card-${cafeId}"] [data-testid="card-grade"]`);
    return await gradeElement.getAttribute('data-grade') || '';
  }
}

test.describe('카페 수집 기능 테스트', () => {
  let helper: CafeCollectionHelper;

  test.beforeEach(async ({ page }) => {
    helper = new CafeCollectionHelper(page);
    await helper.login();
  });

  test('시나리오 1: 카페 수집 기본 플로우', async ({ page }) => {
    await test.step('추천 카페 페이지로 이동', async () => {
      await helper.navigateToRecommendation();
      await expect(page.locator('[data-testid="recommendation-page"]')).toBeVisible();
    });

    await test.step('카페 상세 모달 열기', async () => {
      await helper.openCafeDetail();
      await expect(page.locator('[data-testid="cafe-detail-modal"]')).toBeVisible();
    });

    await test.step('수집하기 버튼 확인 및 클릭', async () => {
      const collectButton = page.locator('[data-testid="collect-cafe-button"]');
      await expect(collectButton).toBeVisible();
      await expect(collectButton).toBeEnabled();
    });

    await test.step('평점 선택 인터페이스 확인', async () => {
      await page.click('[data-testid="collect-cafe-button"]');

      // 평점 선택 UI 표시 확인
      await expect(page.locator('[data-testid="rating-stars"]')).toBeVisible();

      // 1-5점 평점 버튼 모두 표시 확인
      for (let i = 1; i <= 5; i++) {
        await expect(page.locator(`[data-testid="rating-star-${i}"]`)).toBeVisible();
      }
    });

    await test.step('카페 수집 완료', async () => {
      const initialCount = await helper.getCollectionCount();

      await helper.collectCafe(4, '테스트 카페 수집');

      // 수집 성공 메시지 확인
      await expect(page.locator('[data-testid="collection-success-message"]')).toBeVisible();

      // 수집 개수 증가 확인
      const newCount = await helper.getCollectionCount();
      expect(newCount).toBe(initialCount + 1);
    });

    await test.step('컬렉션에 카페 추가 확인', async () => {
      await helper.navigateToCollection();

      // 수집된 카페 카드 표시 확인
      await expect(page.locator('[data-testid="cafe-card"]').first()).toBeVisible();
    });
  });

  test('시나리오 2: 평점별 카드 등급 시스템', async ({ page }) => {
    await helper.navigateToRecommendation();

    const testCases = [
      { rating: 1, expectedGrade: 'under', description: '1점 - Under 등급' },
      { rating: 2, expectedGrade: 'under', description: '2점 - Under 등급' },
      { rating: 3, expectedGrade: 'silver', description: '3점 - Silver 등급' },
      { rating: 4, expectedGrade: 'silver', description: '4점 - Silver 등급' },
      { rating: 5, expectedGrade: 'gold', description: '5점 - Gold 등급' }
    ];

    for (const testCase of testCases) {
      await test.step(`${testCase.description} 테스트`, async () => {
        await helper.openCafeDetail();
        await helper.collectCafe(testCase.rating);

        // 컬렉션 페이지에서 등급 확인
        await helper.navigateToCollection();

        const cafeCards = page.locator('[data-testid^="cafe-card-"]');
        const lastCard = cafeCards.last();

        const grade = await lastCard.getAttribute('data-grade');
        expect(grade).toBe(testCase.expectedGrade);

        // 시각적 등급 표시 확인
        const gradeIndicator = lastCard.locator('[data-testid="grade-indicator"]');
        await expect(gradeIndicator).toHaveClass(new RegExp(testCase.expectedGrade));
      });
    }
  });

  test('시나리오 3: 중복 수집 방지', async ({ page }) => {
    await test.step('첫 번째 카페 수집', async () => {
      await helper.navigateToRecommendation();
      await helper.openCafeDetail();
      await helper.collectCafe(4);
    });

    await test.step('동일 카페 재수집 시도', async () => {
      await helper.navigateToRecommendation();
      await helper.openCafeDetail();

      // 이미 수집된 카페의 경우 버튼 상태 확인
      const collectButton = page.locator('[data-testid="collect-cafe-button"]');

      // 중복 수집 방지 상태 확인
      if (await collectButton.count() > 0) {
        const buttonText = await collectButton.textContent();
        expect(buttonText).toContain('이미 수집됨');
        await expect(collectButton).toBeDisabled();
      } else {
        // 또는 다른 UI 표시 (예: "수정하기" 버튼)
        await expect(page.locator('[data-testid="edit-collection-button"]')).toBeVisible();
      }
    });

    await test.step('중복 수집 방지 메시지 확인', async () => {
      const duplicateMessage = page.locator('[data-testid="duplicate-collection-message"]');
      if (await duplicateMessage.count() > 0) {
        await expect(duplicateMessage).toBeVisible();
        await expect(duplicateMessage).toContainText('이미 수집된 카페입니다');
      }
    });
  });

  test('시나리오 4: 컬렉션 페이지 연동', async ({ page }) => {
    // 여러 카페 수집
    for (let i = 0; i < 3; i++) {
      await helper.navigateToRecommendation();
      await helper.openCafeDetail();
      await helper.collectCafe(3 + i); // 3, 4, 5점으로 수집
    }

    await test.step('컬렉션 페이지 접근', async () => {
      await helper.navigateToCollection();
      await expect(page.locator('[data-testid="collection-page"]')).toBeVisible();
    });

    await test.step('수집된 카페 목록 표시', async () => {
      const cafeCards = page.locator('[data-testid^="cafe-card-"]');
      await expect(cafeCards).toHaveCount(3);
    });

    await test.step('카페 카드 정보 확인', async () => {
      const firstCard = page.locator('[data-testid^="cafe-card-"]').first();

      // 카페 이름
      await expect(firstCard.locator('[data-testid="cafe-name"]')).toBeVisible();

      // 평점 표시
      await expect(firstCard.locator('[data-testid="cafe-rating"]')).toBeVisible();

      // 등급 표시
      await expect(firstCard.locator('[data-testid="card-grade"]')).toBeVisible();

      // 수집 날짜
      await expect(firstCard.locator('[data-testid="collection-date"]')).toBeVisible();
    });

    await test.step('필터 기능 테스트', async () => {
      // 지역 필터
      const regionFilter = page.locator('[data-testid="region-filter"]');
      if (await regionFilter.count() > 0) {
        await regionFilter.selectOption('강남구');
        await page.waitForLoadState('networkidle');
      }

      // 별점 필터
      const ratingFilter = page.locator('[data-testid="rating-filter"]');
      if (await ratingFilter.count() > 0) {
        await ratingFilter.selectOption('5');
        await page.waitForLoadState('networkidle');
      }
    });

    await test.step('카페 카드 클릭 시 상세 페이지 이동', async () => {
      const firstCard = page.locator('[data-testid^="cafe-card-"]').first();
      const cafeId = await firstCard.getAttribute('data-cafe-id');

      await firstCard.click();

      await page.waitForURL(`/collection/detail/${cafeId}`);
      await expect(page.locator('[data-testid="collection-detail-page"]')).toBeVisible();
    });
  });

  test('시나리오 5: 티어 시스템 진행도', async ({ page }) => {
    await test.step('초기 티어 상태 확인', async () => {
      const initialTier = await helper.getTierInfo();
      expect(initialTier.tier).toBe('beginner');
    });

    await test.step('카페 수집 후 티어 변화 확인', async () => {
      const initialCount = await helper.getCollectionCount();

      // 카페 여러 개 수집
      for (let i = 0; i < 5; i++) {
        await helper.navigateToRecommendation();
        await helper.openCafeDetail();
        await helper.collectCafe(Math.floor(Math.random() * 5) + 1);
      }

      const newCount = await helper.getCollectionCount();
      expect(newCount).toBe(initialCount + 5);
    });

    await test.step('홈페이지 카운터 업데이트 확인', async () => {
      await page.goto('/main');

      const collectionCountDisplay = page.locator('[data-testid="total-collection-count"]');
      if (await collectionCountDisplay.count() > 0) {
        const displayedCount = await collectionCountDisplay.textContent();
        const actualCount = await helper.getCollectionCount();
        expect(parseInt(displayedCount || '0')).toBe(actualCount);
      }
    });

    await test.step('티어 진행도 실시간 업데이트 확인', async () => {
      const tierInfo = await helper.getTierInfo();
      const collectionCount = await helper.getCollectionCount();

      // 티어 진행도 로직에 따른 확인
      if (collectionCount >= 10) {
        expect(tierInfo.tier).toBe('junior');
      } else {
        expect(tierInfo.tier).toBe('beginner');
      }
    });
  });

  test('시나리오 6: 에러 처리 및 데이터 검증', async ({ page }) => {
    await test.step('필수 데이터 누락 상황 테스트', async () => {
      await helper.navigateToRecommendation();
      await helper.openCafeDetail();

      // 평점 선택 없이 수집 시도
      await page.click('[data-testid="collect-cafe-button"]');
      await page.click('[data-testid="confirm-collect-button"]');

      // 유효성 검사 메시지 확인
      await expect(page.locator('[data-testid="rating-required-message"]')).toBeVisible();
    });

    await test.step('네트워크 에러 시뮬레이션', async () => {
      // 네트워크 차단
      await page.route('**/api/collection/**', route => route.abort());

      await helper.navigateToRecommendation();
      await helper.openCafeDetail();

      try {
        await helper.collectCafe(4);
      } catch {
        // 에러 메시지 확인
        await expect(page.locator('[data-testid="network-error-message"]')).toBeVisible();

        // 재시도 옵션 확인
        await expect(page.locator('[data-testid="retry-button"]')).toBeVisible();
      }
    });

    await test.step('동시 수집 요청 방지', async () => {
      await helper.navigateToRecommendation();
      await helper.openCafeDetail();

      await page.click('[data-testid="collect-cafe-button"]');
      await page.click('[data-testid="rating-star-4"]');

      // 빠른 연속 클릭
      const confirmButton = page.locator('[data-testid="confirm-collect-button"]');
      await Promise.all([
        confirmButton.click(),
        confirmButton.click(),
        confirmButton.click()
      ]);

      // 중복 요청 방지 확인 (한 번만 처리됨)
      const collectionMessages = page.locator('[data-testid="collection-success-message"]');
      await expect(collectionMessages).toHaveCount(1);
    });
  });

  test('시나리오 7: 수집된 카페 상세 페이지', async ({ page }) => {
    await test.step('카페 수집', async () => {
      await helper.navigateToRecommendation();
      await helper.openCafeDetail();
      await helper.collectCafe(5, '정말 맛있는 카페였어요!');
    });

    await test.step('수집된 카페 상세 페이지 접근', async () => {
      await helper.navigateToCollection();

      const firstCard = page.locator('[data-testid^="cafe-card-"]').first();
      await firstCard.click();

      // URL 패턴 확인
      await page.waitForURL(/\/collection\/detail\/\d+/);
    });

    await test.step('상세 정보 표시 확인', async () => {
      // 카페 기본 정보
      await expect(page.locator('[data-testid="cafe-basic-info"]')).toBeVisible();

      // 내가 매긴 평점
      await expect(page.locator('[data-testid="my-rating"]')).toBeVisible();
      await expect(page.locator('[data-testid="my-rating"]')).toContainText('5');

      // 수집 날짜
      await expect(page.locator('[data-testid="collection-date"]')).toBeVisible();

      // 카드 등급
      await expect(page.locator('[data-testid="card-grade-display"]')).toBeVisible();
      await expect(page.locator('[data-testid="card-grade-display"]')).toHaveAttribute('data-grade', 'gold');

      // 메모
      await expect(page.locator('[data-testid="collection-memo"]')).toContainText('정말 맛있는 카페였어요!');
    });

    await test.step('수정하기 기능 확인', async () => {
      const editButton = page.locator('[data-testid="edit-collection-button"]');
      if (await editButton.count() > 0) {
        await editButton.click();

        // 수정 모달 또는 폼 표시 확인
        await expect(page.locator('[data-testid="edit-collection-modal"]')).toBeVisible();

        // 평점 변경 가능 확인
        await expect(page.locator('[data-testid="rating-stars"]')).toBeVisible();
      }
    });

    await test.step('메뉴 보기 기능 확인', async () => {
      const menuButton = page.locator('[data-testid="view-menu-button"]');
      if (await menuButton.count() > 0) {
        await menuButton.click();
        await expect(page.locator('[data-testid="cafe-menu"]')).toBeVisible();
      }
    });

    await test.step('뒤로가기 네비게이션 확인', async () => {
      const backButton = page.locator('[data-testid="back-to-collection-button"]');
      await backButton.click();

      await page.waitForURL('/collection');
      await expect(page.locator('[data-testid="collection-page"]')).toBeVisible();
    });
  });
});

test.describe('카페 수집 성능 테스트', () => {
  test('대량 수집 처리 성능', async ({ page }) => {
    const helper = new CafeCollectionHelper(page);
    await helper.login();

    const startTime = Date.now();

    // 10개 카페 연속 수집
    for (let i = 0; i < 10; i++) {
      await helper.navigateToRecommendation();
      await helper.openCafeDetail();
      await helper.collectCafe(Math.floor(Math.random() * 5) + 1);
    }

    const endTime = Date.now();
    const duration = endTime - startTime;

    // 평균 처리 시간 확인 (카페당 30초 이내)
    expect(duration / 10).toBeLessThan(30000);
  });
});

test.describe('카페 수집 접근성 테스트', () => {
  test('키보드 네비게이션', async ({ page }) => {
    const helper = new CafeCollectionHelper(page);
    await helper.login();

    await helper.navigateToRecommendation();

    // 키보드로 카페 카드 접근
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // 수집하기 버튼까지 Tab 이동
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // 평점 선택을 키보드로
    await page.keyboard.press('4'); // 4점 선택

    // 확인 버튼까지 Tab 이동 후 Enter
    await page.keyboard.press('Tab');
    await page.keyboard.press('Enter');

    // 수집 완료 확인
    await expect(page.locator('[data-testid="collection-success-message"]')).toBeVisible();
  });

  test('스크린 리더 지원', async ({ page }) => {
    const helper = new CafeCollectionHelper(page);
    await helper.login();

    await helper.navigateToCollection();

    // aria-label 속성 확인
    const cafeCard = page.locator('[data-testid^="cafe-card-"]').first();
    const ariaLabel = await cafeCard.getAttribute('aria-label');
    expect(ariaLabel).toContain('카페');
    expect(ariaLabel).toContain('점');
  });
});