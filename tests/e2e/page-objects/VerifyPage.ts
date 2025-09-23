import { Page } from 'playwright-core';
import { FormHelper } from '@/tests/e2e/utils/helpers';
import { API_PATHS, TEST_SELECTORS, MOCK_DATA } from '@/tests/e2e/utils/constants';

export class VerifyPage {
    private formHelper: FormHelper;

    constructor(private page: Page) {
        this.formHelper = new FormHelper(page);
    }

    /** 인증 코드 입력 */
    async fillVerificationCode(code: string = MOCK_DATA.VERIFICATION_CODE) {
        await this.formHelper.fillVerificationCode(code);
    }

    /** 인증 코드 전송 */
    async submitVerificationCode() {
        await this.page.getByTestId(TEST_SELECTORS.SUBMIT_EMAIL_VERIFICATION_CODE_BUTTON).click();
    }

    /** 회원가입 이메일 인증 코드 제출 API 모킹
     * @return session O
    */
    async mockEmailVerification() {
        await this.page.route(API_PATHS.SUPABASE_AUTH_VERIFY, route => {
            route.fulfill({
                status: 200,
                body: JSON.stringify({
                    user: {
                        id: MOCK_DATA.USER_ID,
                        email: 'test@example.com',
                        app_metadata: {
                            provider: "email",
                            providers: [
                                "email"
                            ]
                        },
                    },
                    session: {
                        token_type: "bearer",
                        access_token: MOCK_DATA.ACCESS_TOKEN,
                        refresh_token: MOCK_DATA.REFRESH_TOKEN,
                    }
                })
            });
        });
    }
}