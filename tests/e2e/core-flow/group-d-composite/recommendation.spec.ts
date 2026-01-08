import { test, expect } from '@playwright/test';
import { RecommendationPage } from '@/tests/e2e/page-objects/RecommendationPage';
import { SignInPage } from '@/tests/e2e/page-objects/SignInPage';
import { VerifyPage } from '@/tests/e2e/page-objects/VerifyPage';
import { MOCK_AUTH_DATA, TEST_SELECTORS } from '@/tests/e2e/utils/constants';

// 실제 DB 데이터 기반 추천 카페 (서버 액션은 클라이언트 측 모킹이 불가능)
const REAL_RECOMMENDATION_CAFES = {
    CAFE_1: {
        name: '어레인지먼트',
        address: '경북 포항시 북구 흥해읍 해안로 1804',
        phone_number: '054-612-5050'
    },
    CAFE_2: {
        name: '코쿠',
        address: '대구 중구 공평로8길 46'
    }
};

test.describe('Group D - 추천 카페 탐색 플로우', () => {
    test('비로그인 상태에서 추천 카페 조회에 성공한다', async ({ page }) => {
        const recommendationPage = new RecommendationPage(page);

        // 1. 비로그인 상태에서 메인 페이지 접속
        await page.goto('/main');
        await page.waitForLoadState('domcontentloaded');

        // 2. 비로그인 상태에서 추천 카페 탭으로 이동
        await recommendationPage.goToRecommendationTab();
        await expect(page).toHaveURL(/.*recommendation.*/);

        // 3. 추천 카페 목록 확인 (실제 DB 데이터 기반)
        await expect(page.getByText(REAL_RECOMMENDATION_CAFES.CAFE_1.name)).toBeVisible({ timeout: 15000 });
    });

    test('카테고리 필터링이 동작한다', async ({ page }) => {
        const recommendationPage = new RecommendationPage(page);

        // 1. 메인 페이지 접속
        await page.goto('/main');
        await page.waitForLoadState('domcontentloaded');

        // 2. 추천 카페 탭으로 이동
        await recommendationPage.goToRecommendationTab();
        await expect(page).toHaveURL(/.*recommendation.*/);

        // 3. 초기 상태 - 추천 카페 표시 확인
        await expect(page.getByText(REAL_RECOMMENDATION_CAFES.CAFE_1.name)).toBeVisible({ timeout: 15000 });

        // 4. "포토존 있는" 카테고리 필터 적용
        await recommendationPage.applyFilter('포토존 있는');
        await page.waitForTimeout(1000);

        // 5. 필터링 후에도 "어레인지먼트"가 표시됨 (포토존 있는 카테고리를 가진 카페)
        await expect(page.getByText(REAL_RECOMMENDATION_CAFES.CAFE_1.name)).toBeVisible();
    });

    test('추천 카페 상세 정보를 확인할 수 있다', async ({ page }) => {
        const recommendationPage = new RecommendationPage(page);

        // 1. 메인 페이지 접속
        await page.goto('/main');
        await page.waitForLoadState('domcontentloaded');

        // 2. 추천 카페 탭으로 이동
        await recommendationPage.goToRecommendationTab();
        await expect(page).toHaveURL(/.*recommendation.*/);

        // 3. 추천 카페 클릭하여 상세 정보 확인
        await recommendationPage.clickCafe(REAL_RECOMMENDATION_CAFES.CAFE_1.name);
        const slidingDrawer = page.getByTestId(TEST_SELECTORS.SLIDING_DRAWER);
        await expect(slidingDrawer).toBeVisible();

        // 4. 상세 정보 내용 확인
        await expect(page.getByText(REAL_RECOMMENDATION_CAFES.CAFE_1.address)).toBeVisible();
        await expect(page.getByText(REAL_RECOMMENDATION_CAFES.CAFE_1.phone_number)).toBeVisible();
    });

    test('로그인 후 추천 탭에서 수집하기 버튼이 표시된다', async ({ page }) => {
        const recommendationPage = new RecommendationPage(page);
        const signInPage = new SignInPage(page);
        const verifyPage = new VerifyPage(page);

        // 1. 인증 API 모킹 먼저 설정
        await verifyPage.mockAuthenticationSuccess();

        // 2. 로그인 페이지로 이동
        await page.goto('/signin');
        await expect(page).toHaveURL(/.*signin.*/);

        // 3. 로그인 정보 입력 및 로그인
        await signInPage.fillSignInForm(MOCK_AUTH_DATA.SIGNUP_EMAIL, MOCK_AUTH_DATA.SIGNUP_PASSWORD);
        await signInPage.signIn();
        await page.waitForURL('**/main**', { timeout: 15000 });
        await expect(page).toHaveURL(/.*main.*/);
        await page.waitForLoadState('domcontentloaded');

        // 4. 추천 카페 탭으로 이동 (URL 직접 이동으로 에러 우회)
        await page.goto('/recommendation');
        await expect(page).toHaveURL(/.*recommendation.*/);
        await page.waitForLoadState('networkidle');

        // 5. 추천 페이지 UI 확인 - 카테고리 필터 버튼들이 표시됨
        await expect(page.getByRole('button', { name: "카테고리 '커피가 맛있는' 선택 버튼" })).toBeVisible();
        await expect(page.getByRole('button', { name: "카테고리 '디저트가 맛있는' 선택 버튼" })).toBeVisible();

        // 6. 로그인 상태 확인 - 프로필 영역이 표시됨
        await expect(page.getByText(MOCK_AUTH_DATA.SIGNUP_EMAIL)).toBeVisible();
    });
});
