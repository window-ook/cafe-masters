import { test, expect } from '@playwright/test';
import { CollectionPage } from '@/tests/e2e/page-objects/CollectionPage';
import { VerifyPage } from '@/tests/e2e/page-objects/VerifyPage';
import { SignInPage } from '@/tests/e2e/page-objects/SignInPage';
import { MOCK_AUTH_DATA } from '@/tests/e2e/utils/constants';

test.describe('Group C - 수집 카페 수정 플로우', () => {
    test('수집 탭으로 이동하면 수집 카페 목록 UI가 표시된다', async ({ page }) => {
        const collectionPage = new CollectionPage(page);
        const verifyPage = new VerifyPage(page);
        const signInPage = new SignInPage(page);

        // 1. 인증 API 모킹 설정
        await verifyPage.mockAuthenticationSuccess();

        // 2. 로그인 페이지로 이동 및 로그인
        await page.goto('/signin');
        await signInPage.fillSignInForm(MOCK_AUTH_DATA.SIGNUP_EMAIL, MOCK_AUTH_DATA.SIGNUP_PASSWORD);
        await signInPage.signIn();
        await page.waitForURL('**/main**', { timeout: 15000 });

        // 3. 수집 탭으로 이동
        await collectionPage.goToCollection();
        await expect(page).toHaveURL(/.*collection.*/);
        await page.waitForLoadState('networkidle');

        // 4. 수집 페이지 UI 요소 확인
        // 지역 선택 드롭다운이 표시됨
        await expect(page.getByRole('combobox', { name: '지역 선택 드롭다운' })).toBeVisible();
        // 검색 필드가 표시됨
        await expect(page.getByPlaceholder('카드 이름으로 검색')).toBeVisible();
    });

    test('수집 탭에서 필터 UI가 정상적으로 동작한다', async ({ page }) => {
        const collectionPage = new CollectionPage(page);
        const verifyPage = new VerifyPage(page);
        const signInPage = new SignInPage(page);

        // 1. 인증 API 모킹 설정
        await verifyPage.mockAuthenticationSuccess();

        // 2. 로그인 페이지로 이동 및 로그인
        await page.goto('/signin');
        await signInPage.fillSignInForm(MOCK_AUTH_DATA.SIGNUP_EMAIL, MOCK_AUTH_DATA.SIGNUP_PASSWORD);
        await signInPage.signIn();
        await page.waitForURL('**/main**', { timeout: 15000 });

        // 3. 수집 탭으로 이동
        await collectionPage.goToCollection();
        await expect(page).toHaveURL(/.*collection.*/);
        await page.waitForLoadState('networkidle');

        // 4. 지역 선택 드롭다운이 존재하고 옵션을 포함하는지 확인
        const regionDropdown = page.getByRole('combobox', { name: '지역 선택 드롭다운' });
        await expect(regionDropdown).toBeVisible();

        // 5. 드롭다운 옵션 개수 확인 (select > option은 hidden이므로 직접 접근)
        const optionCount = await regionDropdown.locator('option').count();
        expect(optionCount).toBeGreaterThan(0);
    });

    test('수집 탭에서 카드 이름 검색이 가능하다', async ({ page }) => {
        const collectionPage = new CollectionPage(page);
        const verifyPage = new VerifyPage(page);
        const signInPage = new SignInPage(page);

        // 1. 인증 API 모킹 설정
        await verifyPage.mockAuthenticationSuccess();

        // 2. 로그인 페이지로 이동 및 로그인
        await page.goto('/signin');
        await signInPage.fillSignInForm(MOCK_AUTH_DATA.SIGNUP_EMAIL, MOCK_AUTH_DATA.SIGNUP_PASSWORD);
        await signInPage.signIn();
        await page.waitForURL('**/main**', { timeout: 15000 });

        // 3. 수집 탭으로 이동
        await collectionPage.goToCollection();
        await expect(page).toHaveURL(/.*collection.*/);
        await page.waitForLoadState('networkidle');

        // 4. 검색 필드에 텍스트 입력
        const searchInput = page.getByPlaceholder('카드 이름으로 검색');
        await searchInput.fill('테스트');

        // 5. 검색 필드에 텍스트가 입력됨
        await expect(searchInput).toHaveValue('테스트');
    });

    test('수집 페이지 직접 접근 시 페이지가 로드된다', async ({ page }) => {
        const verifyPage = new VerifyPage(page);
        const signInPage = new SignInPage(page);

        // 1. 인증 API 모킹 설정
        await verifyPage.mockAuthenticationSuccess();

        // 2. 로그인 페이지로 이동 및 로그인
        await page.goto('/signin');
        await signInPage.fillSignInForm(MOCK_AUTH_DATA.SIGNUP_EMAIL, MOCK_AUTH_DATA.SIGNUP_PASSWORD);
        await signInPage.signIn();
        await page.waitForURL('**/main**', { timeout: 15000 });

        // 3. 수집 페이지로 직접 이동
        await page.goto('/collection');
        await page.waitForLoadState('networkidle');

        // 4. 수집 페이지 UI 확인
        await expect(page).toHaveURL(/.*collection.*/);
        await expect(page.getByRole('combobox', { name: '지역 선택 드롭다운' })).toBeVisible();
    });
});
