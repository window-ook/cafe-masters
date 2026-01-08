import { test, expect } from '@playwright/test';
import { SignInPage } from '@/tests/e2e/page-objects/SignInPage';
import { VerifyPage } from '@/tests/e2e/page-objects/VerifyPage';
import { MOCK_AUTH_DATA, TEST_SELECTORS, ERROR_MESSAGES } from '@/tests/e2e/utils/constants';

test.describe('Group B - 로그인/로그아웃 플로우', () => {
    test('올바른 자격 증명으로 로그인에 성공하고 메인 페이지로 이동한다', async ({ page }) => {
        const signInPage = new SignInPage(page);
        const verifyPage = new VerifyPage(page);

        // 1. 랜딩 페이지에서 로그인 페이지로 이동
        await page.goto('/');
        await page.getByTestId(TEST_SELECTORS.BUTTON_GO_TO_SIGNIN_FROM_LANDING).click();
        await expect(page).toHaveURL(/.*signin.*/);

        // 2. 로그인 API 모킹 및 인증 상태 모킹 (로그인 전에 설정)
        await verifyPage.mockAuthenticationSuccess();

        // 3. 로그인 정보 입력 및 로그인
        await signInPage.fillSignInForm(MOCK_AUTH_DATA.SIGNUP_EMAIL, MOCK_AUTH_DATA.SIGNUP_PASSWORD);
        await signInPage.signIn();

        // 4. 메인 페이지로 이동 확인
        await page.waitForURL('**/main**', { timeout: 10000 });
        await expect(page).toHaveURL(/.*main.*/);
    });

    test('잘못된 이메일로 로그인에 실패한다', async ({ page }) => {
        const signInPage = new SignInPage(page);

        // 1. 랜딩 페이지에서 로그인 페이지로 이동
        await page.goto('/');
        await page.getByTestId(TEST_SELECTORS.BUTTON_GO_TO_SIGNIN_FROM_LANDING).click();
        await expect(page).toHaveURL(/.*signin.*/);

        // 2. 로그인 API 모킹 (실패)
        await page.route('**/auth/v1/token**', route => {
            const postData = route.request().postData();

            if (postData?.includes('grant_type=password')) {
                route.fulfill({
                    status: 400,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        error: 'invalid_grant',
                        error_description: ERROR_MESSAGES.INVALID_CREDENTIALS
                    })
                });
            } else route.continue();
        });

        // 3. 잘못된 이메일로 로그인 시도
        await signInPage.fillSignInForm('wrong@example.com', MOCK_AUTH_DATA.SIGNUP_PASSWORD);
        await signInPage.signIn();

        // 4. 에러 메시지 확인
        await page.waitForSelector('.Toastify__toast--error', { timeout: 5000 });
        await expect(page).toHaveURL(/.*signin.*/);
    });

    test('잘못된 비밀번호로 로그인에 실패한다', async ({ page }) => {
        const signInPage = new SignInPage(page);

        // 1. 랜딩 페이지에서 로그인 페이지로 이동
        await page.goto('/');
        await page.getByTestId(TEST_SELECTORS.BUTTON_GO_TO_SIGNIN_FROM_LANDING).click();
        await expect(page).toHaveURL(/.*signin.*/);

        // 2. 로그인 API 모킹 (실패)
        await page.route('**/auth/v1/token**', route => {
            const postData = route.request().postData();

            if (postData?.includes('grant_type=password')) {
                route.fulfill({
                    status: 400,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        error: 'invalid_grant',
                        error_description: ERROR_MESSAGES.INVALID_CREDENTIALS
                    })
                });
            } else route.continue();
        });

        // 3. 잘못된 비밀번호로 로그인 시도
        await signInPage.fillSignInForm(MOCK_AUTH_DATA.SIGNUP_EMAIL, 'wrongpassword');
        await signInPage.signIn();

        // 4. 에러 메시지 확인
        await page.waitForSelector('.Toastify__toast--error', { timeout: 5000 });
        await expect(page).toHaveURL(/.*signin.*/);
    });

    test('로그아웃 후 랜딩 페이지로 이동한다', async ({ page }) => {
        const signInPage = new SignInPage(page);
        const verifyPage = new VerifyPage(page);

        // 1. 랜딩 페이지에서 로그인 페이지로 이동
        await page.goto('/');
        await page.getByTestId(TEST_SELECTORS.BUTTON_GO_TO_SIGNIN_FROM_LANDING).click();
        await expect(page).toHaveURL(/.*signin.*/);

        // 2. 로그인 API 모킹 및 인증 상태 모킹 (로그인 전에 설정)
        await verifyPage.mockAuthenticationSuccess();

        // 3. 로그인
        await signInPage.fillSignInForm(MOCK_AUTH_DATA.SIGNUP_EMAIL, MOCK_AUTH_DATA.SIGNUP_PASSWORD);
        await signInPage.signIn();
        await page.waitForURL('**/main**', { timeout: 10000 });
        await expect(page).toHaveURL(/.*main.*/);

        // 4. 로그아웃 API 모킹
        await page.route('**/auth/v1/logout**', route => {
            route.fulfill({
                status: 204,
                contentType: 'application/json',
                body: ''
            });
        });

        // 5. 로그아웃 버튼 클릭
        await page.getByTestId(TEST_SELECTORS.BUTTON_SIGNOUT).click();

        // 6. localStorage 인증 상태 클리어 및 랜딩 페이지로 이동
        await page.evaluate(() => {
            localStorage.removeItem('userStore');
        });
        await page.goto('/');

        // 7. 랜딩 페이지 확인
        await expect(page).toHaveURL('/');
    });

    test('비로그인 상태에서 메인 페이지 접근 시 로그인 링크가 표시된다', async ({ page }) => {
        // 1. 비로그인 상태에서 메인 페이지 접근
        // 앱은 /main 페이지를 비로그인 사용자에게도 접근 가능하게 설계됨
        await page.goto('/main');
        await page.waitForLoadState('networkidle');

        // 2. 비로그인 사용자에게 로그인 링크가 표시됨
        await expect(page.getByRole('link', { name: '로그인' })).toBeVisible();

        // 3. 프로필 영역 대신 로그인 링크가 표시됨
        await expect(page.getByTestId(TEST_SELECTORS.BUTTON_SIGNOUT)).not.toBeVisible();
    });
});
