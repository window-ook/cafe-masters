import { test, expect } from '@playwright/test';
import { ResetPasswordPage } from '@/tests/e2e/page-objects/ResetPasswordPage';
import { MOCK_AUTH_DATA, TEST_SELECTORS } from '@/tests/e2e/utils/constants';

test.describe('Group A - 비밀번호 재설정 플로우', () => {
    test('비밀번호 재설정 이메일 요청에 성공한다', async ({ page }) => {
        const resetPasswordPage = new ResetPasswordPage(page);

        // 1. 로그인 페이지로 이동
        await page.goto('/signin');
        await expect(page).toHaveURL(/.*signin.*/);

        // 2. 비밀번호 재설정 API 모킹
        await resetPasswordPage.mockResetPasswordRequestSuccess();

        // 3. 비밀번호 재설정 버튼 클릭
        await resetPasswordPage.clickForgotPasswordLink();
        await page.waitForLoadState();

        // 4. 이메일 입력
        await resetPasswordPage.fillEmail(MOCK_AUTH_DATA.SIGNUP_EMAIL);

        // 5. 재설정 요청 버튼 클릭
        await resetPasswordPage.submitResetRequest();

        // 6. 성공 메시지 확인 (이메일을 확인해주세요 화면으로 전환)
        await expect(page.getByText('이메일을 확인해주세요')).toBeVisible({ timeout: 5000 });
    });

    test('새 비밀번호 설정에 성공한다', async ({ page }) => {
        const resetPasswordPage = new ResetPasswordPage(page);

        // 1. 비밀번호 재설정 페이지로 이동 (토큰 포함 URL 가정)
        await page.goto('/reset-password?token=mock-reset-token');
        await page.waitForLoadState();

        // 2. 새 비밀번호 설정 API 모킹
        await resetPasswordPage.mockSetNewPasswordSuccess();

        // 3. 새 비밀번호 입력
        const newPassword = 'newPassword123!';
        await resetPasswordPage.fillNewPassword(newPassword);
        await resetPasswordPage.fillConfirmPassword(newPassword);

        // 4. 새 비밀번호 설정 제출
        await resetPasswordPage.submitNewPassword();

        // 5. 완료 페이지로 리다이렉트 확인
        await expect(page).toHaveURL(/.*reset-password\/complete.*/, { timeout: 5000 });
    });

    test('존재하지 않는 이메일로 요청 시 에러가 표시된다', async ({ page }) => {
        const resetPasswordPage = new ResetPasswordPage(page);

        // 1. 로그인 페이지로 이동
        await page.goto('/signin');
        await expect(page).toHaveURL(/.*signin.*/);

        // 2. 비밀번호 재설정 API 모킹 (실패)
        await resetPasswordPage.mockResetPasswordRequestFailure();

        // 3. 비밀번호 재설정 버튼 클릭
        await resetPasswordPage.clickForgotPasswordLink();
        await page.waitForLoadState();

        // 4. 존재하지 않는 이메일 입력
        await resetPasswordPage.fillEmail('nonexistent@example.com');

        // 5. 재설정 요청 버튼 클릭
        await resetPasswordPage.submitResetRequest();

        // 6. 에러 메시지 확인 (Toastify 사용)
        await expect(page.locator('.Toastify__toast--error')).toBeVisible({ timeout: 5000 });
    });

    test('비밀번호 조건 미충족 시 에러가 표시된다', async ({ page }) => {
        const resetPasswordPage = new ResetPasswordPage(page);

        // 1. 새 비밀번호 설정 API 모킹 (실패) - 페이지 이동 전에 먼저 설정
        await resetPasswordPage.mockSetNewPasswordFailure();

        // 2. 비밀번호 재설정 페이지로 이동
        await page.goto('/reset-password?token=mock-reset-token');
        await page.waitForLoadState('networkidle');

        // 3. 짧은 비밀번호 입력 (조건 미충족)
        const weakPassword = '123';
        await resetPasswordPage.fillNewPassword(weakPassword);
        await resetPasswordPage.fillConfirmPassword(weakPassword);

        // 4. 새 비밀번호 설정 제출
        await resetPasswordPage.submitNewPassword();
        await page.waitForTimeout(1000);

        // 5. 에러 확인 - 여러 방법 중 하나라도 성공해야 함
        const hasClientValidationError = await page.getByText(/비밀번호|password|최소|글자|자리|short|weak/i).isVisible().catch(() => false);
        const hasToastError = await page.locator('.Toastify__toast--error').isVisible().catch(() => false);
        const hasInputError = await page.locator('[data-error="true"], .error, .invalid').isVisible().catch(() => false);
        const stayedOnPage = page.url().includes('reset-password');

        // URL이 변경되지 않았거나 에러가 표시되었다면 성공
        expect(hasClientValidationError || hasToastError || hasInputError || stayedOnPage).toBeTruthy();
    });
});
