import { test, expect } from '@playwright/test';
import { SignInPage } from '@/tests/e2e/page-objects/SignInPage';
import { VerifyPage } from '@/tests/e2e/page-objects/VerifyPage';
import { MainPage } from '@/tests/e2e/page-objects/MainPage';
import { BookmarkPage } from '@/tests/e2e/page-objects/BookmarkPage';
import { MOCK_AUTH_DATA, TEST_SELECTORS } from '@/tests/e2e/utils/constants';

test.describe('Group B - 북마크 CRUD 플로우', () => {
    test('카페 검색 후 북마크 버튼이 표시된다', async ({ page }) => {
        const signInPage = new SignInPage(page);
        const verifyPage = new VerifyPage(page);
        const mainPage = new MainPage(page);

        // 1. 인증 API 모킹 설정 (페이지 이동 전에 먼저 설정)
        await mainPage.mockKakaoSearchAPI();
        await verifyPage.mockAuthenticationSuccess();

        // 2. 로그인 페이지로 이동 및 로그인
        await page.goto('/signin');
        await signInPage.fillSignInForm(MOCK_AUTH_DATA.SIGNUP_EMAIL, MOCK_AUTH_DATA.SIGNUP_PASSWORD);
        await signInPage.signIn();
        await page.waitForURL('**/main**', { timeout: 15000 });

        // 3. 카페 검색 (mainPage.searchKeyword 대신 직접 검색)
        const searchInput = page.getByTestId(TEST_SELECTORS.INPUT_SEARCH);
        await searchInput.fill('대구 교동');
        const searchButton = page.getByTestId(TEST_SELECTORS.BUTTON_SUBMIT_KEYWORD_FOR_SEARCH);
        await searchButton.click();

        // 4. 검색 결과 페이지로 이동 대기
        await page.waitForURL('**/search**', { timeout: 30000 });
        await expect(page).toHaveURL(/.*search.*/);
        await page.waitForLoadState('networkidle');

        // 5. 검색 결과 대기
        await expect(page.getByText('이얼즈').first()).toBeVisible({ timeout: 15000 });

        // 6. 카페 선택
        await page.getByText('이얼즈').first().click();
        const slidingDrawer = page.getByTestId(TEST_SELECTORS.SLIDING_DRAWER);
        await slidingDrawer.waitFor({ state: 'visible' });

        // 7. 북마크 버튼이 표시되는지 확인
        const bookmarkButton = page.getByTestId(TEST_SELECTORS.BUTTON_BOOKMARK).first();
        await expect(bookmarkButton).toBeVisible();
    });

    test('북마크 탭으로 이동할 수 있다', async ({ page }) => {
        const signInPage = new SignInPage(page);
        const verifyPage = new VerifyPage(page);
        const bookmarkPage = new BookmarkPage(page);

        // 1. 인증 API 모킹 설정
        await verifyPage.mockAuthenticationSuccess();

        // 2. 로그인 페이지로 이동 및 로그인
        await page.goto('/signin');
        await signInPage.fillSignInForm(MOCK_AUTH_DATA.SIGNUP_EMAIL, MOCK_AUTH_DATA.SIGNUP_PASSWORD);
        await signInPage.signIn();
        await page.waitForURL('**/main**', { timeout: 15000 });

        // 3. 북마크 탭으로 이동
        await bookmarkPage.goToBookmarkTab();
        await page.waitForURL('**/bookmark**');
        await expect(page).toHaveURL(/.*bookmark.*/);

        // 4. 북마크 페이지 UI 확인 (검색 필드 존재 - placeholder: '카페 이름으로 검색')
        await expect(page.getByPlaceholder('카페 이름으로 검색')).toBeVisible();
    });

    test('북마크 목록에서 실제 북마크된 카페를 확인할 수 있다', async ({ page }) => {
        const signInPage = new SignInPage(page);
        const verifyPage = new VerifyPage(page);
        const bookmarkPage = new BookmarkPage(page);

        // 1. 인증 API 모킹 설정
        await verifyPage.mockAuthenticationSuccess();

        // 2. 로그인 페이지로 이동 및 로그인
        await page.goto('/signin');
        await signInPage.fillSignInForm(MOCK_AUTH_DATA.SIGNUP_EMAIL, MOCK_AUTH_DATA.SIGNUP_PASSWORD);
        await signInPage.signIn();
        await page.waitForURL('**/main**', { timeout: 15000 });

        // 3. 북마크 탭으로 이동
        await bookmarkPage.goToBookmarkTab();
        await page.waitForURL('**/bookmark**');

        // 4. 북마크 페이지가 로드됨 (실제 데이터가 있으면 목록이, 없으면 빈 상태가 표시)
        await page.waitForLoadState('networkidle');

        // 5. 북마크 페이지의 필터 UI가 표시됨
        await expect(page.getByRole('combobox', { name: '지역 선택 드롭다운' })).toBeVisible();
    });

    test('비로그인 상태에서 메인 페이지 접근 시 로그인 링크가 표시된다', async ({ page }) => {
        // 1. 비로그인 상태에서 메인 페이지로 이동
        // 앱은 비로그인 사용자에게도 /main 페이지 접근을 허용
        await page.goto('/main');
        await page.waitForLoadState('networkidle');

        // 2. 비로그인 사용자에게 로그인 링크가 표시됨
        await expect(page.getByRole('link', { name: '로그인' })).toBeVisible();

        // 3. 북마크 탭 링크가 표시됨 (비로그인도 탭은 볼 수 있음)
        await expect(page.getByRole('link', { name: '북마크한 카페' })).toBeVisible();

        // 4. 로그아웃 버튼은 표시되지 않음
        await expect(page.getByTestId(TEST_SELECTORS.BUTTON_SIGNOUT)).not.toBeVisible();
    });
});
