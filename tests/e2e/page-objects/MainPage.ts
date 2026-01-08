import { Page } from 'playwright-core';
import { TEST_SELECTORS, MOCK_AUTH_DATA } from '@/tests/e2e/utils/constants';

export class MainPage {
    constructor(private page: Page) { }

    /** 인증 상태 확인 및 강제 설정 (새로운 AuthProvider 구조 대응) */
    async ensureAuthenticated() {
        // localStorage에서 userStore 확인
        const userId = await this.page.evaluate(() => {
            const store = localStorage.getItem('userStore');
            if (store) {
                const parsed = JSON.parse(store);
                return parsed.state?.userId || null;
            }
            return null;
        });

        // userId가 없으면 강제로 설정
        if (!userId) {
            console.log('[TEST] 인증 상태가 없습니다. localStorage에 설정합니다.');
            await this.page.evaluate((mockData) => {
                const userStoreState = {
                    state: {
                        userId: mockData.USER_ID,
                        userEmail: mockData.SIGNUP_EMAIL,
                        userTier: "BEGINNER",
                        isAdmin: false
                    },
                    version: 0
                };
                localStorage.setItem('userStore', JSON.stringify(userStoreState));

                // Playwright 테스트 플래그 설정
                (window as any).__PLAYWRIGHT_TEST__ = true;
            }, MOCK_AUTH_DATA);

            // 페이지 새로고침으로 Zustand persist가 localStorage를 읽도록 함
            await this.page.reload();
            await this.page.waitForLoadState('domcontentloaded');
        } else {
            console.log('[TEST] 인증 상태 확인됨:', userId);
        }

        // 페이지 로드 후 session을 Zustand store에 직접 설정
        await this.page.evaluate((mockData) => {
            // Playwright 테스트 플래그 설정
            (window as any).__PLAYWRIGHT_TEST__ = true;

            // Zustand store에 session 강제 설정 시도
            const interval = setInterval(() => {
                type ZustandStore = { getState: () => Record<string, unknown>; setState: (state: Record<string, unknown>) => void };
                const stores = (Object.values(window) as unknown[]).filter((val): val is ZustandStore =>
                    val !== null &&
                    typeof val === 'object' &&
                    'getState' in (val as object) &&
                    'setState' in (val as object) &&
                    typeof (val as ZustandStore).getState === 'function' &&
                    typeof (val as ZustandStore).setState === 'function'
                );

                for (const store of stores) {
                    try {
                        const state = store.getState();
                        // userStore인지 확인 (userId 속성이 있으면)
                        if ('userId' in state || 'session' in state) {
                            // session 설정
                            store.setState({
                                session: {
                                    access_token: mockData.ACCESS_TOKEN,
                                    refresh_token: mockData.REFRESH_TOKEN,
                                    expires_at: Math.floor(Date.now() / 1000) + 3600,
                                    user: {
                                        id: mockData.USER_ID,
                                        email: mockData.SIGNUP_EMAIL,
                                    }
                                },
                                userId: mockData.USER_ID,
                                userEmail: mockData.SIGNUP_EMAIL
                            });
                            console.log('[TEST] Zustand session 설정 완료');
                            clearInterval(interval);
                            break;
                        }
                    } catch (e) {
                        // 무시
                    }
                }
            }, 100);

            // 5초 후 타임아웃
            setTimeout(() => clearInterval(interval), 5000);
        }, MOCK_AUTH_DATA);

        // session이 설정될 때까지 잠시 대기
        await this.page.waitForTimeout(500);
    }

    /** 카카오맵 검색 API 모킹 */
    async mockKakaoSearchAPI() {
        // 카카오맵 API 응답을 모킹하여 충분한 검색 결과 보장
        await this.page.route('**/v2/local/search/keyword.json**', route => {
            const mockApiResponse = {
                documents: Array.from({ length: 20 }, (_, index) => ({
                    id: `${803452801 + index}`,
                    place_name: index === 1 ? '이얼즈' : `테스트카페${index + 1}`,
                    category_name: '음식점 > 카페',
                    category_group_code: 'CE7',
                    category_group_name: '카페',
                    phone: index % 3 === 0 ? `053-123-456${index}` : '',
                    address_name: `대구 중구 동문동 ${10 + index}-4`,
                    road_address_name: `대구 중구 공평로 ${79 + index}`,
                    x: `${128.60039182923592 + (index * 0.001)}`,
                    y: `${35.871224288731426 + (index * 0.001)}`,
                    place_url: `http://place.map.kakao.com/${803452801 + index}`,
                    distance: ''
                })),
                meta: {
                    total_count: 20,
                    pageable_count: 20,
                    is_end: true
                }
            };

            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(mockApiResponse)
            });
        });
    }

    /** 검색 */
    async searchKeyword(keyword: string) {
        await this.page.waitForLoadState();

        // NavBar (데스크톱) 또는 SlidingDrawer (모바일)에서 첫 번째로 보이는 검색 입력 필드 사용
        const searchInput = this.page.getByTestId(TEST_SELECTORS.INPUT_SEARCH).first();
        await searchInput.waitFor({ state: 'visible' });

        const submitKeywordButton = this.page.getByTestId(TEST_SELECTORS.BUTTON_SUBMIT_KEYWORD_FOR_SEARCH).first();
        await submitKeywordButton.waitFor({ state: 'visible' });

        await searchInput.fill(keyword);

        // 검색 버튼 클릭과 동시에 URL 변경을 기다림
        await Promise.all([
            this.page.waitForURL('**/search**', { timeout: 30000 }),
            submitKeywordButton.click()
        ]);

        await this.page.waitForLoadState();
    }
}