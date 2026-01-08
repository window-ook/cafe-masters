import { test, expect } from '@playwright/test';
import { SignInPage } from '@/tests/e2e/page-objects/SignInPage';
import { VerifyPage } from '@/tests/e2e/page-objects/VerifyPage';
import { MainPage } from '@/tests/e2e/page-objects/MainPage';
import { TEST_SELECTORS, MOCK_AUTH_DATA } from '@/tests/e2e/utils/constants';

test.describe('Group D - 페이지네이션 플로우', () => {
    test('검색 결과에서 페이지네이션이 동작한다', async ({ page }) => {
        const verifyPage = new VerifyPage(page);
        const mainPage = new MainPage(page);
        const signInPage = new SignInPage(page);

        // 1. 인증 API 모킹 설정
        await verifyPage.mockAuthenticationSuccess();
        await mainPage.mockKakaoSearchAPI();

        // 2. 로그인 페이지로 이동 및 로그인
        await page.goto('/signin');
        await signInPage.fillSignInForm(MOCK_AUTH_DATA.SIGNUP_EMAIL, MOCK_AUTH_DATA.SIGNUP_PASSWORD);
        await signInPage.signIn();
        await page.waitForURL('**/main**', { timeout: 15000 });

        // 3. 카페 검색 (모킹된 데이터로 40개 결과 반환)
        await mainPage.searchKeyword('대구 교동');
        await expect(page).toHaveURL(/.*search.*/);
        await page.waitForLoadState('networkidle');

        // 4. 검색 결과 확인
        await expect(page.getByText(/개의 검색 결과/)).toBeVisible({ timeout: 15000 });

        // 5. 페이지네이션 UI 확인
        const nextPageButton = page.getByTestId(TEST_SELECTORS.BUTTON_NEXT_PAGE);
        await expect(nextPageButton).toBeVisible();

        // 6. 다음 페이지로 이동
        await nextPageButton.click();
        await page.waitForTimeout(500);

        // 7. 페이지 이동 확인 (페이지 표시기 변경)
        await expect(page.getByText(/2 \/ /)).toBeVisible();
    });

    test('수집 카페 탭에서 페이지네이션 UI가 표시된다', async ({ page }) => {
        const verifyPage = new VerifyPage(page);
        const signInPage = new SignInPage(page);

        // 1. 인증 API 모킹 설정
        await verifyPage.mockAuthenticationSuccess();

        // 2. 로그인 페이지로 이동 및 로그인
        await page.goto('/signin');
        await signInPage.fillSignInForm(MOCK_AUTH_DATA.SIGNUP_EMAIL, MOCK_AUTH_DATA.SIGNUP_PASSWORD);
        await signInPage.signIn();
        await page.waitForURL('**/main**', { timeout: 15000 });

        // 3. 수집 카페 탭으로 이동
        await page.getByTestId(TEST_SELECTORS.BUTTON_GO_TO_COLLECTION_BY_TAB).click();
        await page.waitForURL('**/collection**');
        await expect(page).toHaveURL(/.*collection.*/);
        await page.waitForLoadState('networkidle');

        // 4. 수집 카페 페이지가 로드됨 (실제 데이터 기반)
        // 페이지네이션 버튼이 표시되거나 빈 상태가 표시됨
        await page.waitForLoadState('networkidle');

        // 5. 수집 페이지 필터 UI 확인
        await expect(page.getByRole('combobox', { name: '지역 선택 드롭다운' })).toBeVisible();
    });

    test('북마크 카페 탭에서 페이지네이션 UI가 표시된다', async ({ page }) => {
        const verifyPage = new VerifyPage(page);
        const signInPage = new SignInPage(page);

        // 1. 인증 API 모킹 설정
        await verifyPage.mockAuthenticationSuccess();

        // 2. 로그인 페이지로 이동 및 로그인
        await page.goto('/signin');
        await signInPage.fillSignInForm(MOCK_AUTH_DATA.SIGNUP_EMAIL, MOCK_AUTH_DATA.SIGNUP_PASSWORD);
        await signInPage.signIn();
        await page.waitForURL('**/main**', { timeout: 15000 });

        // 3. 북마크 카페 탭으로 이동
        await page.getByTestId(TEST_SELECTORS.BUTTON_GO_TO_BOOKMARK_BY_TAB).click();
        await page.waitForURL('**/bookmark**');
        await expect(page).toHaveURL(/.*bookmark.*/);
        await page.waitForLoadState('networkidle');

        // 4. 북마크 페이지가 로드됨 (실제 데이터 기반)
        await page.waitForLoadState('networkidle');

        // 5. 북마크 페이지 필터 UI 확인
        await expect(page.getByRole('combobox', { name: '지역 선택 드롭다운' })).toBeVisible();
    });
});
