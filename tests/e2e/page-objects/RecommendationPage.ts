import { Page } from 'playwright-core';
import { TEST_SELECTORS, MOCK_RECOMMENDATION_CAFES, MOCK_AUTH_DATA } from '@/tests/e2e/utils/constants';

export class RecommendationPage {
    constructor(private page: Page) { }

    /** Supabase 추천 카페 조회 API 모킹 */
    async mockRecommendationCafesAPI(cafes = MOCK_RECOMMENDATION_CAFES) {
        await this.page.route('**/rest/v1/recommendation**', route => {
            // Supabase DB 형식에 맞게 배열을 JSON 문자열로 변환
            const dbFormattedCafes = cafes.map(cafe => ({
                ...cafe,
                categories: JSON.stringify(cafe.categories),
                extra_images: JSON.stringify(cafe.extra_images)
            }));

            route.fulfill({
                status: 200,
                contentType: 'application/json',
                headers: {
                    'content-range': `0-${cafes.length - 1}/${cafes.length}`
                },
                body: JSON.stringify(dbFormattedCafes)
            });
        });
    }

    /** 추천 카페 탭으로 이동 */
    async goToRecommendationTab() {
        const recommendationTabButton = this.page.getByTestId(TEST_SELECTORS.BUTTON_GO_TO_RECOMMENDATION_BY_TAB);
        await recommendationTabButton.waitFor({ state: 'visible' });
        await recommendationTabButton.click();
        await this.page.waitForURL('**/recommendation**');
        await this.page.waitForLoadState('domcontentloaded');
    }

    /** 카테고리 필터 적용 */
    async applyFilter(filterName: string) {
        const filterButton = this.page.getByText(filterName, { exact: true });
        await filterButton.waitFor({ state: 'visible' });
        await filterButton.click();
        await this.page.waitForTimeout(500);
    }

    /** 특정 카페 클릭 */
    async clickCafe(cafeName: string) {
        const cafeCard = this.page.getByText(cafeName);
        await cafeCard.waitFor({ state: 'visible' });
        await cafeCard.click();
        const slidingDrawer = this.page.getByTestId(TEST_SELECTORS.SLIDING_DRAWER);
        await slidingDrawer.waitFor({ state: 'visible' });
    }

    /** 인증 상태 확인 및 강제 설정 */
    async ensureAuthenticated() {
        const userId = await this.page.evaluate(() => {
            const store = localStorage.getItem('userStore');
            if (store) {
                const parsed = JSON.parse(store);
                return parsed.state?.userId || null;
            }
            return null;
        });

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

            await this.page.reload();
            await this.page.waitForLoadState();
        } else {
            console.log('[TEST] 인증 상태 확인됨:', userId);
        }

        // 페이지 로드 후 mock session 설정
        await this.page.evaluate((mockData) => {
            // Playwright 테스트 플래그 설정
            (window as any).__PLAYWRIGHT_TEST__ = true;

            // Mock session 설정
            (window as any).__MOCK_SESSION__ = {
                user: {
                    id: mockData.USER_ID,
                    email: mockData.SIGNUP_EMAIL
                }
            };
        }, MOCK_AUTH_DATA);
    }

    /** Supabase 수집 카페 생성 API 모킹 */
    async mockCollectCafeAPI() {
        await this.page.route('**/rest/v1/collection**', route => {
            if (route.request().method() === 'POST') {
                route.fulfill({
                    status: 201,
                    contentType: 'application/json',
                    body: JSON.stringify([{
                        id: 1,
                        user_id: MOCK_AUTH_DATA.USER_ID,
                        created_at: new Date().toISOString()
                    }])
                });
            } else route.continue();
        });
    }

    /** 수집하기 버튼 클릭 */
    async clickCollectButton() {
        const collectButton = this.page.getByTestId(TEST_SELECTORS.BUTTON_COLLECT);
        await collectButton.waitFor({ state: 'visible' });
        await collectButton.click();
    }

    /** 수집 정보 입력 및 제출 */
    async fillCollectionForm(ratings: number, comment: string, eatenMenus: string) {
        await this.page.getByTestId(TEST_SELECTORS.SELECTOR_RATINGS).locator('label').nth(ratings - 1).click();
        await this.page.getByTestId(TEST_SELECTORS.INPUT_COMMENT).fill(comment);
        await this.page.getByTestId(TEST_SELECTORS.INPUT_EATEN_MENUS).fill(eatenMenus);
        await this.page.getByTestId(TEST_SELECTORS.BUTTON_SUBMIT_COLLECT).click();
        await this.page.waitForLoadState();
    }
}
