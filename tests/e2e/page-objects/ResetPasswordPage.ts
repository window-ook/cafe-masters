import { Page } from 'playwright-core';
import { MOCK_AUTH_DATA } from '@/tests/e2e/utils/constants';

export class ResetPasswordPage {
    constructor(private page: Page) { }

    /** 비밀번호 재설정 이메일 요청 API 모킹 (성공) */
    async mockResetPasswordRequestSuccess() {
        await this.page.route('**/auth/v1/recover**', route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({})
            });
        });
    }

    /** 비밀번호 재설정 이메일 요청 API 모킹 (실패 - 존재하지 않는 이메일) */
    async mockResetPasswordRequestFailure() {
        await this.page.route('**/auth/v1/recover**', route => {
            route.fulfill({
                status: 400,
                contentType: 'application/json',
                body: JSON.stringify({
                    error: 'invalid_email',
                    error_description: '등록되지 않은 이메일입니다'
                })
            });
        });
    }

    /** 새 비밀번호 설정 API 모킹 (성공) */
    async mockSetNewPasswordSuccess() {
        await this.page.route('**/auth/v1/user**', route => {
            if (route.request().method() === 'PUT') {
                route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        id: MOCK_AUTH_DATA.USER_ID,
                        email: MOCK_AUTH_DATA.SIGNUP_EMAIL
                    })
                });
            } else route.continue();
        });
    }

    /** 새 비밀번호 설정 API 모킹 (실패 - 비밀번호 조건 미충족) */
    async mockSetNewPasswordFailure() {
        await this.page.route('**/auth/v1/user**', route => {
            if (route.request().method() === 'PUT') {
                route.fulfill({
                    status: 422,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        error: 'weak_password',
                        error_description: '비밀번호는 최소 6자 이상이어야 합니다'
                    })
                });
            } else route.continue();
        });
    }

    /** 비밀번호 재설정 버튼 클릭 */
    async clickForgotPasswordLink() {
        const resetButton = this.page.getByTestId('open-resetpassword-form-button');
        await resetButton.waitFor({ state: 'visible' });
        await resetButton.click();
        await this.page.waitForLoadState();
    }

    /** 이메일 입력 */
    async fillEmail(email: string) {
        const emailInput = this.page.locator('input#reset-email');
        await emailInput.waitFor({ state: 'visible' });
        await emailInput.fill(email);
    }

    /** 비밀번호 재설정 요청 버튼 클릭 */
    async submitResetRequest() {
        // aria-label이 "비밀번호 재설정 이메일 발송"으로 설정되어 있음
        const submitButton = this.page.getByRole('button', { name: /비밀번호 재설정 이메일 발송|발송 중/i });
        await submitButton.waitFor({ state: 'visible' });
        await submitButton.click();
        await this.page.waitForLoadState();
    }

    /** 새 비밀번호 입력 */
    async fillNewPassword(password: string) {
        const passwordInput = this.page.locator('input#new-password');
        await passwordInput.waitFor({ state: 'visible' });
        await passwordInput.fill(password);
    }

    /** 새 비밀번호 확인 입력 */
    async fillConfirmPassword(password: string) {
        const confirmInput = this.page.locator('input#confirm-password');
        await confirmInput.waitFor({ state: 'visible' });
        await confirmInput.fill(password);
    }

    /** 새 비밀번호 설정 제출 */
    async submitNewPassword() {
        const submitButton = this.page.getByRole('button', { name: /완료|변경 중/i });
        await submitButton.waitFor({ state: 'visible' });
        await submitButton.click();
        await this.page.waitForLoadState();
    }
}
