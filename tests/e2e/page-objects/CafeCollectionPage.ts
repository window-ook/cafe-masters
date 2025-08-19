import { Page, Locator } from '@playwright/test';

/**
 * 카페 수집 페이지 객체 모델
 * 카페 수집과 관련된 모든 UI 인터랙션을 캡슐화
 */
export class CafeCollectionPage {
  private page: Page;

  // 로케이터 정의
  private readonly cafeDetailModal: Locator;
  private readonly collectButton: Locator;
  private readonly ratingStars: Locator;
  private readonly memoInput: Locator;
  private readonly confirmButton: Locator;
  private readonly successMessage: Locator;
  private readonly duplicateMessage: Locator;
  private readonly errorMessage: Locator;
  private readonly collectionCount: Locator;
  private readonly userTier: Locator;

  constructor(page: Page) {
    this.page = page;

    // 셀렉터 정의 - 실제 애플리케이션에 맞게 조정 필요
    this.cafeDetailModal = page.locator('[data-testid="cafe-detail-modal"], .cafe-detail-modal, [role="dialog"]');
    this.collectButton = page.locator('[data-testid="collect-cafe-button"], button:has-text("수집하기")');
    this.ratingStars = page.locator('[data-testid="rating-stars"], .rating-stars');
    this.memoInput = page.locator('[data-testid="cafe-memo-input"], input[placeholder*="메모"], textarea[placeholder*="메모"]');
    this.confirmButton = page.locator('[data-testid="confirm-collect-button"], button:has-text("수집 완료"), button:has-text("확인")');
    this.successMessage = page.locator('[data-testid="collection-success-message"], .success-message, [role="alert"]:has-text("수집")');
    this.duplicateMessage = page.locator('[data-testid="duplicate-collection-message"], .duplicate-message');
    this.errorMessage = page.locator('[data-testid="error-message"], .error-message, [role="alert"]:has-text("오류")');
    this.collectionCount = page.locator('[data-testid="collection-count"], .collection-count');
    this.userTier = page.locator('[data-testid="user-tier"], .user-tier');
  }

  /**
   * 카페 상세 모달이 열려있는지 확인
   */
  async isDetailModalOpen(): Promise<boolean> {
    try {
      await this.cafeDetailModal.waitFor({ timeout: 5000 });
      return await this.cafeDetailModal.isVisible();
    } catch {
      return false;
    }
  }

  /**
   * 수집하기 버튼 클릭
   */
  async clickCollectButton(): Promise<void> {
    await this.collectButton.waitFor({ state: 'visible' });
    await this.collectButton.click();
  }

  /**
   * 평점 선택
   * @param rating 1-5 사이의 평점
   */
  async selectRating(rating: number): Promise<void> {
    if (rating < 1 || rating > 5) {
      throw new Error('평점은 1-5 사이의 값이어야 합니다.');
    }

    // 다양한 평점 선택 방법 시도
    const selectors = [
      `[data-testid="rating-star-${rating}"]`,
      `[data-rating="${rating}"]`,
      `.rating-star:nth-child(${rating})`,
      `.star[data-value="${rating}"]`
    ];

    let clicked = false;
    for (const selector of selectors) {
      const element = this.page.locator(selector);
      if (await element.count() > 0) {
        await element.click();
        clicked = true;
        break;
      }
    }

    if (!clicked) {
      // 별점 컨테이너에서 위치 기반 클릭
      const starsContainer = this.ratingStars.first();
      if (await starsContainer.count() > 0) {
        const box = await starsContainer.boundingBox();
        if (box) {
          const starWidth = box.width / 5;
          const clickX = starWidth * (rating - 0.5);
          await starsContainer.click({ position: { x: clickX, y: box.height / 2 } });
        }
      }
    }
  }

  /**
   * 메모 입력
   * @param memo 메모 텍스트
   */
  async enterMemo(memo: string): Promise<void> {
    if (await this.memoInput.count() > 0) {
      await this.memoInput.fill(memo);
    }
  }

  /**
   * 수집 확인 버튼 클릭
   */
  async confirmCollection(): Promise<void> {
    await this.confirmButton.click();
  }

  /**
   * 카페 수집 전체 프로세스
   * @param rating 평점 (1-5)
   * @param memo 선택적 메모
   */
  async collectCafe(rating: number, memo?: string): Promise<void> {
    await this.clickCollectButton();
    await this.selectRating(rating);

    if (memo) {
      await this.enterMemo(memo);
    }

    await this.confirmCollection();
  }

  /**
   * 수집 성공 메시지 확인
   */
  async waitForSuccessMessage(): Promise<void> {
    await this.successMessage.waitFor({ timeout: 10000 });
  }

  /**
   * 중복 수집 메시지 확인
   */
  async hasDuplicateMessage(): Promise<boolean> {
    return await this.duplicateMessage.isVisible();
  }

  /**
   * 에러 메시지 확인
   */
  async getErrorMessage(): Promise<string | null> {
    if (await this.errorMessage.count() > 0) {
      return await this.errorMessage.textContent();
    }
    return null;
  }

  /**
   * 현재 수집 개수 가져오기
   */
  async getCollectionCount(): Promise<number> {
    if (await this.collectionCount.count() > 0) {
      const text = await this.collectionCount.textContent();
      const match = text?.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    }
    return 0;
  }

  /**
   * 사용자 티어 정보 가져오기
   */
  async getTierInfo(): Promise<{ tier: string; text: string }> {
    if (await this.userTier.count() > 0) {
      const tier = await this.userTier.getAttribute('data-tier') || 'beginner';
      const text = await this.userTier.textContent() || '';
      return { tier, text };
    }
    return { tier: 'beginner', text: 'BEGINNER' };
  }

  /**
   * 수집하기 버튼 상태 확인
   */
  async isCollectButtonEnabled(): Promise<boolean> {
    if (await this.collectButton.count() > 0) {
      return await this.collectButton.isEnabled();
    }
    return false;
  }

  /**
   * 수집하기 버튼 텍스트 가져오기
   */
  async getCollectButtonText(): Promise<string> {
    if (await this.collectButton.count() > 0) {
      return await this.collectButton.textContent() || '';
    }
    return '';
  }

  /**
   * 카페 정보 가져오기
   */
  async getCafeInfo(): Promise<{
    id: string;
    name: string;
    address: string;
  }> {
    const modal = this.cafeDetailModal;

    return {
      id: await modal.getAttribute('data-cafe-id') || '',
      name: await modal.locator('[data-testid="cafe-name"], .cafe-name, h1, h2').first().textContent() || '',
      address: await modal.locator('[data-testid="cafe-address"], .cafe-address').textContent() || ''
    };
  }

  /**
   * 모달 닫기
   */
  async closeModal(): Promise<void> {
    const closeButton = this.page.locator('[data-testid="close-modal"], .close-button, [aria-label="닫기"]');
    if (await closeButton.count() > 0) {
      await closeButton.click();
    } else {
      // ESC 키로 모달 닫기
      await this.page.keyboard.press('Escape');
    }
  }
}

/**
 * 컬렉션 페이지 객체 모델
 */
export class CollectionPage {
  private page: Page;

  private readonly cafeCards: Locator;
  private readonly filterRegion: Locator;
  private readonly filterRating: Locator;
  private readonly backButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.cafeCards = page.locator('[data-testid^="cafe-card-"], .cafe-card');
    this.filterRegion = page.locator('[data-testid="region-filter"], select[name="region"]');
    this.filterRating = page.locator('[data-testid="rating-filter"], select[name="rating"]');
    this.backButton = page.locator('[data-testid="back-button"], button:has-text("뒤로")');
  }

  /**
   * 페이지 이동
   */
  async navigate(): Promise<void> {
    await this.page.goto('/collection');
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * 수집된 카페 카드 개수
   */
  async getCafeCardCount(): Promise<number> {
    return await this.cafeCards.count();
  }

  /**
   * 특정 인덱스의 카페 카드 클릭
   */
  async clickCafeCard(index: number): Promise<void> {
    await this.cafeCards.nth(index).click();
  }

  /**
   * 첫 번째 카페 카드 클릭
   */
  async clickFirstCafeCard(): Promise<void> {
    await this.clickCafeCard(0);
  }

  /**
   * 카페 카드의 등급 확인
   */
  async getCafeCardGrade(index: number): Promise<string> {
    const card = this.cafeCards.nth(index);
    const gradeElement = card.locator('[data-testid="card-grade"], .card-grade');

    if (await gradeElement.count() > 0) {
      return await gradeElement.getAttribute('data-grade') || '';
    }
    return '';
  }

  /**
   * 카페 카드 정보 가져오기
   */
  async getCafeCardInfo(index: number): Promise<{
    name: string;
    rating: string;
    grade: string;
    date: string;
  }> {
    const card = this.cafeCards.nth(index);

    return {
      name: await card.locator('[data-testid="cafe-name"], .cafe-name').textContent() || '',
      rating: await card.locator('[data-testid="cafe-rating"], .cafe-rating').textContent() || '',
      grade: await this.getCafeCardGrade(index),
      date: await card.locator('[data-testid="collection-date"], .collection-date').textContent() || ''
    };
  }

  /**
   * 지역 필터 적용
   */
  async filterByRegion(region: string): Promise<void> {
    if (await this.filterRegion.count() > 0) {
      await this.filterRegion.selectOption(region);
      await this.page.waitForLoadState('networkidle');
    }
  }

  /**
   * 평점 필터 적용
   */
  async filterByRating(rating: string): Promise<void> {
    if (await this.filterRating.count() > 0) {
      await this.filterRating.selectOption(rating);
      await this.page.waitForLoadState('networkidle');
    }
  }

  /**
   * 페이지가 로드되었는지 확인
   */
  async isLoaded(): Promise<boolean> {
    try {
      await this.page.waitForSelector('[data-testid="collection-page"], .collection-page', { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * 수집된 카페 상세 페이지
 */
export class CollectionDetailPage {
  private page: Page;

  private readonly cafeInfo: Locator;
  private readonly myRating: Locator;
  private readonly collectionDate: Locator;
  private readonly gradeDisplay: Locator;
  private readonly memo: Locator;
  private readonly editButton: Locator;
  private readonly menuButton: Locator;
  private readonly backButton: Locator;

  constructor(page: Page) {
    this.page = page;

    this.cafeInfo = page.locator('[data-testid="cafe-basic-info"], .cafe-basic-info');
    this.myRating = page.locator('[data-testid="my-rating"], .my-rating');
    this.collectionDate = page.locator('[data-testid="collection-date"], .collection-date');
    this.gradeDisplay = page.locator('[data-testid="card-grade-display"], .card-grade-display');
    this.memo = page.locator('[data-testid="collection-memo"], .collection-memo');
    this.editButton = page.locator('[data-testid="edit-collection-button"], button:has-text("수정")');
    this.menuButton = page.locator('[data-testid="view-menu-button"], button:has-text("메뉴")');
    this.backButton = page.locator('[data-testid="back-to-collection-button"], button:has-text("뒤로")');
  }

  /**
   * 페이지 정보 가져오기
   */
  async getDetailInfo(): Promise<{
    rating: string;
    date: string;
    grade: string;
    memo: string;
  }> {
    return {
      rating: await this.myRating.textContent() || '',
      date: await this.collectionDate.textContent() || '',
      grade: await this.gradeDisplay.getAttribute('data-grade') || '',
      memo: await this.memo.textContent() || ''
    };
  }

  /**
   * 수정하기 버튼 클릭
   */
  async clickEdit(): Promise<void> {
    if (await this.editButton.count() > 0) {
      await this.editButton.click();
    }
  }

  /**
   * 메뉴 보기 버튼 클릭
   */
  async clickViewMenu(): Promise<void> {
    if (await this.menuButton.count() > 0) {
      await this.menuButton.click();
    }
  }

  /**
   * 뒤로가기 버튼 클릭
   */
  async clickBack(): Promise<void> {
    await this.backButton.click();
  }

  /**
   * 페이지가 로드되었는지 확인
   */
  async isLoaded(): Promise<boolean> {
    try {
      await this.page.waitForSelector('[data-testid="collection-detail-page"], .collection-detail-page', { timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
}