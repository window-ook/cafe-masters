import { Page } from 'playwright-core';
import { FormHelper } from '@/tests/e2e/utils/helpers';
import { TEST_SELECTORS } from '@/tests/e2e/utils/constants';

export class SignInPage {
    private formHelper: FormHelper;

    constructor(private page: Page) {
        this.formHelper = new FormHelper(page);
    }

    /** 로그인 정보 입력 */
    async fillSignInForm(email: string, password: string) {
        await this.formHelper.fillSignInForm(email, password);
    }

    /** 로그인 버튼 클릭 */
    async signIn() {
        await this.page.getByTestId(TEST_SELECTORS.SIGNIN_BUTTON).click();
    }
}