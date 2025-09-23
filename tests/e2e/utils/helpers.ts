import { Page } from 'playwright-core';
import { MOCK_DATA, PAGE_PATHS, TEST_SELECTORS } from '@/tests/e2e/utils/constants';

/** 페이지 이동 관련 공통 헬퍼 함수들 */
export class NavigationHelper {
    constructor(private page: Page) { }

    /** 랜딩 페이지에서 로그인 페이지로 이동 */
    async goToSignInPageFromLandingPage() {
        await this.page.getByTestId(TEST_SELECTORS.GO_TO_SIGNIN_FROM_LANDING).click();
    }

    /** 메인 페이지에서 로그인 페이지로 이동 */
    async goToSignInPageFromMainPage() {
        await this.page.getByTestId(TEST_SELECTORS.GO_TO_SIGNIN_FROM_MAIN).click();
    }

    /** 로그인 페이지에서 회원가입 페이지로 이동 */
    async goToSignUpPageFromSignInPage() {
        await this.page.getByTestId(TEST_SELECTORS.GO_TO_SIGNUP_FROM_SIGNIN).click();
    }

    /** 회원가입 페이지에서 로그인 페이지로 이동 */
    async goToSignInPageFromSignUpPage() {
        await this.page.getByTestId(TEST_SELECTORS.GO_TO_SIGNIN_FROM_SIGNUP).click();
    }

    /** 회원가입 페이지에서 인증 코드 입력 페이지로 이동 */
    async goToVerifyPageFromSignUpPage() {
        await this.page.goto(PAGE_PATHS.SIGNUP_VERIFY);
    }

    /** 사이드바 헤더의 로고를 클릭하여 메인 페이지로 이동 */
    async goToMainPage() {
        await this.page.getByTestId(TEST_SELECTORS.GO_TO_MAIN_BY_HEADER).click();
    }

    /** 검색 결과 페이지로 이동 */
    async goToSearchPage() {
        await this.page.getByTestId(TEST_SELECTORS.GO_TO_SEARCH_BY_TAB).click();
    }

    /** 수집한 페이지로 이동 */
    async goToCollectionPage() {
        await this.page.goto('http://localhost:3000/collection');
    }

    /** 북마크 페이지로 이동 */
    async goToBookmarkPage() {
        await this.page.getByTestId(TEST_SELECTORS.GO_TO_BOOKMARK_BY_TAB).click();
    }

    /** 추천 페이지로 이동 */
    async goToRecommendationPage() {
        await this.page.getByTestId(TEST_SELECTORS.GO_TO_RECOMMENDATION_BY_TAB).click();
    }

    /** 직접 URL로 페이지 이동 */
    async navigateToPage(path: keyof typeof PAGE_PATHS) {
        if (path === 'BASE') {
            await this.page.goto(PAGE_PATHS.BASE);
        } else {
            await this.page.goto(PAGE_PATHS[path]);
        }
    }
}

/** 폼 관련 공통 헬퍼 함수들 */
export class FormHelper {
    constructor(private page: Page) { }

    /** 로그인 폼 입력 */
    async fillSignInForm(email: string, password: string) {
        await this.page.getByTestId(TEST_SELECTORS.EMAIL_INPUT).fill(email);
        await this.page.getByTestId(TEST_SELECTORS.PASSWORD_INPUT).fill(password);
    }

    /** 회원가입 폼 입력 */
    async fillSignUpForm(email: string, password: string) {
        await this.page.getByTestId(TEST_SELECTORS.EMAIL_INPUT).fill(email);
        await this.page.getByTestId(TEST_SELECTORS.PASSWORD_INPUT).fill(password);
    }

    /** 인증번호 입력 */
    async fillVerificationCode(code: string) {
        await this.page.getByTestId(TEST_SELECTORS.VERIFICATION_CODE_INPUT).fill(code);
    }
}

/** 인증 관련 모킹을 담당하는 헬퍼 클래스
 * @description 로그인/회원가입 후 인증 상태를 모킹하여 테스트에서 로그인 상태를 유지
 */
export class AuthMockHelper {
    constructor(private page: Page) { }

    /** 인증 쿠키 설정 모킹
     * @description 로그인 상태 확인을 위한 쿠키 설정
     */
    async mockAuthenticationSuccess() {
        // 1. Supabase 인증 쿠키 설정
        await this.page.context().addCookies([
            {
                name: 'sb-vsemazasjbizehcambul-auth-token',
                value: JSON.stringify({
                    access_token: MOCK_DATA.ACCESS_TOKEN,
                    refresh_token: MOCK_DATA.REFRESH_TOKEN,
                    user: {
                        id: MOCK_DATA.USER_ID,
                        email: MOCK_DATA.SIGNUP_EMAIL,
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
        }, MOCK_DATA);

        // 3. Supabase 인증 관련 API 모킹
        await this.page.route('**/auth/v1/user**', route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    id: MOCK_DATA.USER_ID,
                    email: MOCK_DATA.SIGNUP_EMAIL,
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
                    access_token: MOCK_DATA.ACCESS_TOKEN,
                    refresh_token: MOCK_DATA.REFRESH_TOKEN,
                    expires_in: 3600,
                    token_type: "bearer",
                    user: {
                        id: MOCK_DATA.USER_ID,
                        email: MOCK_DATA.SIGNUP_EMAIL,
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
                    access_token: MOCK_DATA.ACCESS_TOKEN,
                    refresh_token: MOCK_DATA.REFRESH_TOKEN,
                    user: {
                        id: MOCK_DATA.USER_ID,
                        email: MOCK_DATA.SIGNUP_EMAIL
                    },
                    expires_at: Math.floor(Date.now() / 1000) + 3600
                })
            });
        });

        // 4. 쿠키 설정 완료 대기
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
            // Playwright 테스트 환경임을 알려주는 플래그
            (window as any).__PLAYWRIGHT_TEST__ = true;
        });
    }
}

/** 대기 관련 공통 헬퍼 함수들 */
export class WaitHelper {
    constructor(private page: Page) { }

    /** SlidingDrawer가 열릴 때까지 대기 */
    async waitForSlidingDrawer() {
        const slidingDrawer = this.page.getByTestId(TEST_SELECTORS.SLIDING_DRAWER);
        await slidingDrawer.waitFor({ state: 'visible' });
    }

    /** 특정 URL로 이동할 때까지 대기 */
    async waitForURL(urlPattern: string) {
        await this.page.waitForURL(urlPattern);
    }

    /** 로딩 완료까지 대기 */
    async waitForLoadState() {
        await this.page.waitForLoadState('networkidle');
    }
}