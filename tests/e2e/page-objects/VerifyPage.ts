import { Page } from 'playwright-core';
import { API_PATHS, TEST_SELECTORS, MOCK_AUTH_DATA, ERROR_MESSAGES } from '@/tests/e2e/utils/constants';

export class VerifyPage {
    constructor(private page: Page) { }

    /** 인증 코드 입력 */
    async fillVerificationCode(code: string = MOCK_AUTH_DATA.VERIFICATION_CODE) {
        await this.page.getByTestId(TEST_SELECTORS.INPUT_VERIFICATION_CODE).fill(code);
    }

    /** 인증 코드 전송 */
    async submitVerificationCode() {
        await this.page.getByTestId(TEST_SELECTORS.BUTTON_SUBMIT_EMAIL_VERIFICATION_CODE).click();
    }

    /** 회원가입 이메일 인증 코드 제출 API 모킹 (성공) */
    async mockSubmitEmailVerificationCodeSuccess() {
        await this.page.route(API_PATHS.SUPABASE_AUTH_VERIFY, route => {
            route.fulfill({
                status: 200,
                body: JSON.stringify({
                    user: {
                        id: MOCK_AUTH_DATA.USER_ID,
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
                        access_token: MOCK_AUTH_DATA.ACCESS_TOKEN,
                        refresh_token: MOCK_AUTH_DATA.REFRESH_TOKEN,
                    }
                })
            });
        });
    }

    /** 회원가입 이메일 인증 코드 제출 API 모킹 (실패) */
    async mockSubmitEmailVerificationCodeFailure() {
        // 모든 Supabase 요청을 잡아서 verifyOtp 관련 요청만 실패시키기
        await this.page.route('**/*', route => {
            const url = route.request().url();
            const method = route.request().method();
            const postData = route.request().postData();

            // Supabase auth 관련 POST 요청이고 type=signup이 포함된 경우
            if (url.includes('supabase.co/auth/v1') && method === 'POST' && postData?.includes('"type":"signup"')) {
                route.fulfill({
                    status: 400,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        code: 'otp_expired',
                        message: ERROR_MESSAGES.VERIFICATION_CODE_INVALID,
                        error_description: ERROR_MESSAGES.VERIFICATION_CODE_INVALID
                    })
                });
            } else {
                route.continue();
            }
        });
    }

    /** 인증 쿠키 설정 모킹 */
    async mockAuthenticationSuccess() {
        // 1. Supabase 인증 쿠키 설정
        await this.page.context().addCookies([
            {
                name: 'sb-vsemazasjbizehcambul-auth-token',
                value: JSON.stringify({
                    access_token: MOCK_AUTH_DATA.ACCESS_TOKEN,
                    refresh_token: MOCK_AUTH_DATA.REFRESH_TOKEN,
                    user: {
                        id: MOCK_AUTH_DATA.USER_ID,
                        email: MOCK_AUTH_DATA.SIGNUP_EMAIL,
                        app_metadata: {
                            provider: "email",
                            providers: ["email"]
                        }
                    },
                    expires_at: Math.floor(Date.now() / 1000) + 3600
                }),
                domain: 'localhost',
                path: '/',
                httpOnly: false,
                secure: false,
                sameSite: 'Lax'
            }
        ]);

        // 2. useUserStore 상태 모킹
        await this.page.addInitScript((mockData) => {
            const userStoreState = {
                state: {
                    userId: mockData.USER_ID,
                    userEmail: mockData.SIGNUP_EMAIL,
                    userTier: "BEGINNER",
                    admin: false
                },
                version: 0
            };
            window.localStorage.setItem('userStore', JSON.stringify(userStoreState));

            // userStore 변경 이벤트 발생
            window.dispatchEvent(new StorageEvent('storage', {
                key: 'userStore',
                newValue: JSON.stringify(userStoreState)
            }));
        }, MOCK_AUTH_DATA);

        // 3. Supabase 인증 관련 API 모킹
        await this.page.route('**/auth/v1/user**', route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    id: MOCK_AUTH_DATA.USER_ID,
                    email: MOCK_AUTH_DATA.SIGNUP_EMAIL,
                    app_metadata: {
                        provider: "email",
                        providers: ["email"]
                    },
                    user_metadata: {},
                    aud: "authenticated",
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
            });
        });

        // 4. Supabase 세션 상태 확인 API 모킹
        await this.page.route('**/auth/v1/session**', route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    access_token: MOCK_AUTH_DATA.ACCESS_TOKEN,
                    refresh_token: MOCK_AUTH_DATA.REFRESH_TOKEN,
                    expires_in: 3600,
                    token_type: "bearer",
                    user: {
                        id: MOCK_AUTH_DATA.USER_ID,
                        email: MOCK_AUTH_DATA.SIGNUP_EMAIL,
                        app_metadata: {
                            provider: "email",
                            providers: ["email"]
                        }
                    }
                })
            });
        });

        // 5. Supabase 토큰 갱신 API 모킹
        await this.page.route('**/auth/v1/token**', route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    access_token: MOCK_AUTH_DATA.ACCESS_TOKEN,
                    refresh_token: MOCK_AUTH_DATA.REFRESH_TOKEN,
                    user: {
                        id: MOCK_AUTH_DATA.USER_ID,
                        email: MOCK_AUTH_DATA.SIGNUP_EMAIL
                    },
                    expires_at: Math.floor(Date.now() / 1000) + 3600
                })
            });
        });

        await this.page.waitForTimeout(100);

        // 5. Supabase DB 요청 모킹
        await this.page.route('**/rest/v1/**', route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify([])
            });
        });

        // 6. Playwright 테스트 환경 플래그 설정
        await this.page.addInitScript(() => {
            (window as any).__PLAYWRIGHT_TEST__ = true;
        });
    }
}