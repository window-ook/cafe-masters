import { Page } from 'playwright-core';
import { FormHelper } from '@/tests/e2e/utils/helpers';
import { TEST_SELECTORS } from '@/tests/e2e/utils/constants';
import { API_PATHS, MOCK_DATA } from '@/tests/e2e/utils/constants';

export class SignupPage {
    private formHelper: FormHelper;

    constructor(private page: Page) {
        this.formHelper = new FormHelper(page);
    }

    /** 회원가입 정보 입력 */
    async fillSignUpForm(email: string, password: string) {
        await this.formHelper.fillSignUpForm(email, password);
    }

    /** 회원가입 요청 버튼 클릭 */
    async requestSignUp() {
        await this.page.getByTestId(TEST_SELECTORS.SUBMIT_REQUEST_SIGNUP_BUTTON).click();
    }

    /** 회원가입 요청 API 모킹 */
    async mockSignUpRequest() {
        await this.page.route(API_PATHS.SUPABASE_AUTH_SIGNUP, route => {
            console.log('회원가입 요청 인터셉트: ', route.request().url());
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    user: {
                        id: MOCK_DATA.USER_ID,
                        email: 'test@example.com',
                        email_confirmed_at: new Date().toISOString(),
                        app_metadata: {
                            provider: "email",
                            providers: [
                                "email"
                            ]
                        },
                    },
                    session: null
                })
            });
        });
    }
}