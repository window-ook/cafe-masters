import { Page } from 'playwright-core';
import { TEST_SELECTORS } from '@/tests/e2e/utils/constants';

export class SignInPage {
    constructor(private page: Page) { }

    /** 로그인 정보 입력 */
    async fillSignInForm(email: string, password: string) {
        await this.page.getByTestId(TEST_SELECTORS.INPUT_EMAIL).fill(email);
        await this.page.getByTestId(TEST_SELECTORS.INPUT_PASSWORD).fill(password);
    }

    /** 로그인 버튼 클릭 */
    async signIn() {
        await this.page.getByTestId(TEST_SELECTORS.BUTTON_SIGNIN).click();
    }
}