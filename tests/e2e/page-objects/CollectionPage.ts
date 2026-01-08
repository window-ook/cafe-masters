import { Page } from 'playwright-core';
import { TEST_SELECTORS, MOCK_AUTH_DATA, MOCK_COLLECTION_CAFES } from '@/tests/e2e/utils/constants';

export class CollectionPage {
    constructor(private page: Page) { }

    /** Supabase 수집 카페 API 모킹 (GET, PATCH 모두 처리) */
    async mockCollectionCafesAPI() {
        await this.page.route('**/rest/v1/collection**', async route => {
            const method = route.request().method();

            if (method === 'GET') {
                // Supabase DB 형식에 맞게 배열을 JSON 문자열로 변환
                const dbFormattedCafes = MOCK_COLLECTION_CAFES.map(cafe => ({
                    ...cafe,
                    categories: JSON.stringify(cafe.categories),
                    extra_images: JSON.stringify(cafe.extra_images)
                }));

                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(dbFormattedCafes)
                });
            } else if (method === 'PATCH') {
                const requestBody = route.request().postDataJSON();

                const updatedCafe = {
                    ...MOCK_COLLECTION_CAFES[1],
                    ...requestBody,
                    updated_at: new Date().toISOString(),
                    categories: JSON.stringify(MOCK_COLLECTION_CAFES[1].categories),
                    extra_images: JSON.stringify(MOCK_COLLECTION_CAFES[1].extra_images)
                };

                await route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify([updatedCafe])
                });
            } else {
                await route.continue();
            }
        });
    }

    /** 하위 호환성을 위한 메서드 (deprecated) */
    async mockGetCollectionCafes() {
        await this.mockCollectionCafesAPI();
    }

    /** 하위 호환성을 위한 메서드 (deprecated) */
    async mockUpdateCollectionCafe() {
        await this.mockCollectionCafesAPI();
    }

    /** 수집 탭으로 이동 */
    async goToCollection() {
        await this.page.getByTestId(TEST_SELECTORS.BUTTON_GO_TO_COLLECTION_BY_TAB).click();
        await this.page.waitForURL('**/collection**');
    }

    /** 수집 카페 클릭 */
    async clickCollectionCafe(cafeName: string) {
        await this.page.getByText(cafeName).first().click();
        await this.page.waitForLoadState();
    }

    /** 수정하기 버튼 클릭 */
    async clickEditButton() {
        const editButton = this.page.getByTestId(TEST_SELECTORS.BUTTON_COLLECT_EDIT);
        await editButton.waitFor({ state: 'visible' });
        await editButton.click();
    }

    /** 별점 선택 */
    async selectRating(rating: number) {
        await this.page.getByTestId(TEST_SELECTORS.SELECTOR_RATINGS).locator('label').nth(rating - 1).click();
    }

    /** 코멘트 입력 */
    async fillComment(comment: string) {
        const commentInput = this.page.getByTestId(TEST_SELECTORS.INPUT_COMMENT);
        await commentInput.clear();
        await commentInput.fill(comment);
    }

    /** 먹은 메뉴 입력 */
    async fillEatenMenus(menus: string) {
        const menusInput = this.page.getByTestId(TEST_SELECTORS.INPUT_EATEN_MENUS);
        await menusInput.clear();
        await menusInput.fill(menus);
    }

    /** 수정 완료 버튼 클릭 */
    async submitUpdate() {
        await this.page.getByTestId(TEST_SELECTORS.BUTTON_SUBMIT_COLLECT).click();
        await this.page.waitForLoadState();
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
                // localStorage에 userStore 설정
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

                // Playwright 테스트 플래그 설정 (모킹 데이터 사용을 위해)
                (window as any).__PLAYWRIGHT_TEST__ = true;
            }, MOCK_AUTH_DATA);

            await this.page.reload();
            await this.page.waitForLoadState();
        } else {
            console.log('[TEST] 인증 상태 확인됨:', userId);
        }

        // 페이지 로드 후 Zustand store에 session을 직접 설정
        await this.page.evaluate((mockData) => {
            // Playwright 테스트 플래그 설정
            (window as any).__PLAYWRIGHT_TEST__ = true;

            // Zustand store에 직접 접근하여 session 설정
            // Zustand는 window 객체에 store를 노출하지 않으므로,
            // 페이지가 로드되고 나면 React 컴포넌트에서 store를 사용할 수 있도록
            // 글로벌 변수로 mock session을 설정
            (window as any).__MOCK_SESSION__ = {
                user: {
                    id: mockData.USER_ID,
                    email: mockData.SIGNUP_EMAIL
                }
            };
        }, MOCK_AUTH_DATA);
    }
}
