import { Page } from 'playwright-core';
import { TEST_SELECTORS } from '@/tests/e2e/utils/constants';
import { API_PATHS, MOCK_AUTH_DATA } from '@/tests/e2e/utils/constants';

export class SignupPage {
    constructor(private page: Page) { }

    /** 회원가입 정보 입력 */
    async fillSignUpForm(email: string, password: string) {
        await this.page.getByTestId(TEST_SELECTORS.INPUT_EMAIL).fill(email);
        await this.page.getByTestId(TEST_SELECTORS.INPUT_PASSWORD).fill(password);
    }

    /** 회원가입 요청 버튼 클릭 */
    async requestSignUp() {
        await this.page.getByTestId(TEST_SELECTORS.BUTTON_SUBMIT_REQUEST_SIGNUP).click();
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
                        id: MOCK_AUTH_DATA.USER_ID,
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