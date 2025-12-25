import { Page } from 'playwright-core';
import { SUCCESS_MESSAGES, TEST_SELECTORS } from '@/tests/e2e/utils/constants';
import { API_PATHS, MOCK_AUTH_DATA } from '@/tests/e2e/utils/constants';

export class SignupPage {
    constructor(private page: Page) { }

    /** 이메일/비밀번호 입력 */
    async fillEmailAndPassword(email: string, password: string) {
        await this.page.getByTestId(TEST_SELECTORS.INPUT_EMAIL).fill(email);
        await this.page.getByTestId(TEST_SELECTORS.INPUT_PASSWORD).fill(password);
    }

    /** 닉네임 입력 */
    async fillNickname(nickname: string) {
        await this.page.getByTestId(TEST_SELECTORS.INPUT_NICKNAME).fill(nickname);
    }

    /** 성별 선택 */
    async selectGender(gender: 'male' | 'female') {
        const genderLabel = gender === 'male' ? '남성' : '여성';
        await this.page.getByRole('radio', { name: genderLabel }).click();
    }

    /** 회원가입 전체 정보 입력 (이메일, 비밀번호, 닉네임, 성별) */
    async fillSignUpForm(email: string, password: string, nickname: string, gender: 'male' | 'female') {
        await this.fillEmailAndPassword(email, password);
        await this.fillNickname(nickname);
        await this.selectGender(gender);
    }

    /** 회원가입 요청 버튼 클릭 */
    async requestSignUp() {
        await this.page.getByTestId(TEST_SELECTORS.BUTTON_SUBMIT_REQUEST_SIGNUP).click();
    }

    /** 회원가입 요청 API 모킹 */
    async mockSignUpRequest() {
        await this.page.route(API_PATHS.SUPABASE_AUTH_SIGNUP, route => {
            console.log(SUCCESS_MESSAGES.INTERCEPT_REQUEST_SIGNUP, route.request().url());

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