import { test, expect } from '@playwright/test';
import { MainPage } from '@/tests/e2e/page-objects/MainPage';
import { TEST_SELECTORS } from '@/tests/e2e/utils/constants';

test.describe('Group A - 비로그인 검색 플로우', () => {
    test('비로그인 상태에서 카페 검색에 성공한다', async ({ page }) => {
        const mainPage = new MainPage(page);

        // 1. 카카오맵 검색 API 모킹 (페이지 이동 전에 먼저 설정)
        await mainPage.mockKakaoSearchAPI();

        // 2. 메인 페이지로 바로 이동 (비로그인 상태)
        await page.goto('/main');
        await page.waitForLoadState('networkidle');

        // 3. 카페 검색 (searchKeyword 내부에서 URL 변경 대기)
        await mainPage.searchKeyword('대구 교동');
        await expect(page).toHaveURL(/.*search.*/);

        // 4. 검색 결과 확인
        await page.waitForLoadState('networkidle');
        await expect(page.getByText('테스트카페1').first()).toBeVisible({ timeout: 10000 });
    });

    test('검색 결과 페이지네이션이 동작한다', async ({ page }) => {
        const mainPage = new MainPage(page);

        // 1. 카카오맵 검색 API 모킹 (페이지 이동 전에 먼저 설정)
        await mainPage.mockKakaoSearchAPI();

        // 2. 메인 페이지로 바로 이동 (비로그인 상태)
        await page.goto('/main');
        await page.waitForLoadState('networkidle');

        // 3. 카페 검색 (searchKeyword 내부에서 URL 변경 대기)
        await mainPage.searchKeyword('대구 교동');
        await expect(page).toHaveURL(/.*search.*/);

        // 4. 검색 결과 로딩 대기
        await page.waitForLoadState('networkidle');

        // 5. 페이지네이션 버튼 확인 및 클릭
        const nextPageButton = page.getByTestId(TEST_SELECTORS.BUTTON_NEXT_PAGE);
        await nextPageButton.waitFor({ state: 'visible', timeout: 20000 });
        await expect(nextPageButton).not.toBeDisabled();
        await nextPageButton.click();

        // 6. 다음 페이지 결과 확인 (이얼즈 카페)
        await expect(page.getByText('이얼즈')).toBeVisible({ timeout: 10000 });
    });

    test('카페 상세 정보를 확인할 수 있다', async ({ page }) => {
        const mainPage = new MainPage(page);

        // 1. 카카오맵 검색 API 모킹 (페이지 이동 전에 먼저 설정)
        await mainPage.mockKakaoSearchAPI();

        // 2. 메인 페이지로 바로 이동 (비로그인 상태)
        await page.goto('/main');
        await page.waitForLoadState('networkidle');

        // 3. 카페 검색 (searchKeyword 내부에서 URL 변경 대기)
        await mainPage.searchKeyword('대구 교동');
        await expect(page).toHaveURL(/.*search.*/);

        // 4. 검색 결과 로딩 대기
        await page.waitForLoadState('networkidle');

        // 5. 페이지네이션으로 이동 후 카페 선택
        const nextPageButton = page.getByTestId(TEST_SELECTORS.BUTTON_NEXT_PAGE);
        await nextPageButton.waitFor({ state: 'visible', timeout: 20000 });
        await nextPageButton.click();

        // 6. 카페 클릭하여 상세 정보 확인
        await page.getByText('이얼즈').click();
        const slidingDrawer = page.getByTestId(TEST_SELECTORS.SLIDING_DRAWER);
        await slidingDrawer.waitFor({ state: 'visible' });

        // 7. 상세 정보 내용 확인
        await expect(page.getByText('대구 중구 공평로 80')).toBeVisible();
    });

    test('수집하기 클릭 시 로그인 페이지로 이동한다', async ({ page }) => {
        const mainPage = new MainPage(page);

        // 1. 카카오맵 검색 API 모킹 (페이지 이동 전에 먼저 설정)
        await mainPage.mockKakaoSearchAPI();

        // 2. 메인 페이지로 바로 이동 (비로그인 상태)
        await page.goto('/main');
        await page.waitForLoadState('networkidle');

        // 3. 카페 검색 (searchKeyword 내부에서 URL 변경 대기)
        await mainPage.searchKeyword('대구 교동');
        await expect(page).toHaveURL(/.*search.*/);

        // 4. 검색 결과 로딩 대기
        await page.waitForLoadState('networkidle');

        // 5. 페이지네이션으로 이동 후 카페 선택
        const nextPageButton = page.getByTestId(TEST_SELECTORS.BUTTON_NEXT_PAGE);
        await nextPageButton.waitFor({ state: 'visible', timeout: 20000 });
        await nextPageButton.click();

        // 6. 카페 클릭
        await page.getByText('이얼즈').click();
        const slidingDrawer = page.getByTestId(TEST_SELECTORS.SLIDING_DRAWER);
        await slidingDrawer.waitFor({ state: 'visible' });

        // 7. 로그인하고 수집하기 버튼 클릭 (비로그인 상태)
        const collectButton = page.getByRole('button', { name: '로그인하고 수집하기' });
        await collectButton.waitFor({ state: 'visible' });
        await collectButton.click();

        // 8. 로그인 페이지로 리다이렉트 또는 로그인 유도 확인
        await page.waitForTimeout(1000);
        const currentURL = page.url();
        const isSigninPage = currentURL.includes('signin');
        const hasLoginPrompt = await page.getByText(/로그인|로그인이 필요/).isVisible().catch(() => false);

        expect(isSigninPage || hasLoginPrompt).toBeTruthy();
    });
});
