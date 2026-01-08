import { Page } from 'playwright-core';
import { TEST_SELECTORS, MOCK_AUTH_DATA, MOCK_BOOKMARK_CAFE } from '@/tests/e2e/utils/constants';

export class BookmarkPage {
    constructor(private page: Page) { }

    /** 북마크 추가 버튼 클릭 */
    async addBookmark() {
        await this.page.getByTestId(TEST_SELECTORS.BUTTON_BOOKMARK).click();
    }

    /** 북마크 취소 버튼 클릭 */
    async cancelBookmark() {
        await this.page.getByTestId(TEST_SELECTORS.BUTTON_BOOKMARK_CANCEL).click();
    }

    /** 북마크 탭으로 이동 */
    async goToBookmarkTab() {
        await this.page.getByTestId(TEST_SELECTORS.BUTTON_GO_TO_BOOKMARK_BY_TAB).click();
    }

    /** 북마크 목록 조회 API 모킹 (성공) */
    async mockGetBookmarksSuccess() {
        await this.page.route('**/rest/v1/bookmark**', route => {
            const method = route.request().method();

            if (method === 'GET') {
                // Supabase DB 형식에 맞게 배열을 JSON 문자열로 변환
                const dbFormattedCafes = MOCK_BOOKMARK_CAFE.map(cafe => ({
                    ...cafe,
                    extra_images: JSON.stringify(cafe.extra_images)
                }));

                route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(dbFormattedCafes)
                });
            } else route.continue();
        });
    }

    /** 북마크 추가 API 모킹 (성공) */
    async mockAddBookmarkSuccess() {
        await this.page.route('**/rest/v1/bookmark**', route => {
            const method = route.request().method();

            if (method === 'POST') {
                route.fulfill({
                    status: 201,
                    contentType: 'application/json',
                    body: JSON.stringify([{
                        id: 999,
                        user_id: MOCK_AUTH_DATA.USER_ID,
                        name: "이얼즈",
                        image: "https://img1.kakaocdn.net/cthumb/local/C544x408.q50/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flocal%2FkakaomapPhoto%2Freview%2Fec2c1096b85aa2d7a0ef108c140901a58bffb8f4%3Foriginal",
                        opening_time: "12:00 ~ 23:00",
                        address: "대구 중구 동문동 10-4",
                        phone_number: "",
                        menus: null,
                        coordX: 128.60039182923592,
                        coordY: 35.871224288731426,
                        created_at: new Date().toISOString(),
                        extra_images: JSON.stringify([])
                    }])
                });
            } else route.continue();
        });
    }

    /** 북마크 삭제 API 모킹 (성공) */
    async mockDeleteBookmarkSuccess() {
        await this.page.route('**/rest/v1/bookmark**', route => {
            const method = route.request().method();

            if (method === 'DELETE') {
                route.fulfill({
                    status: 204,
                    contentType: 'application/json',
                    body: ''
                });
            } else route.continue();
        });
    }

    /** 북마크 전체 API 모킹 (GET, POST, DELETE 모두 처리) */
    async mockBookmarkAPIs() {
        await this.page.route('**/rest/v1/bookmark**', route => {
            const method = route.request().method();

            if (method === 'GET') {
                // Supabase DB 형식에 맞게 배열을 JSON 문자열로 변환
                const dbFormattedCafes = MOCK_BOOKMARK_CAFE.map(cafe => ({
                    ...cafe,
                    extra_images: JSON.stringify(cafe.extra_images)
                }));

                route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify(dbFormattedCafes)
                });
            } else if (method === 'POST') {
                route.fulfill({
                    status: 201,
                    contentType: 'application/json',
                    body: JSON.stringify([{
                        id: 999,
                        user_id: MOCK_AUTH_DATA.USER_ID,
                        name: "이얼즈",
                        image: "https://img1.kakaocdn.net/cthumb/local/C544x408.q50/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flocal%2FkakaomapPhoto%2Freview%2Fec2c1096b85aa2d7a0ef108c140901a58bffb8f4%3Foriginal",
                        opening_time: "12:00 ~ 23:00",
                        address: "대구 중구 동문동 10-4",
                        phone_number: "",
                        menus: null,
                        coordX: 128.60039182923592,
                        coordY: 35.871224288731426,
                        created_at: new Date().toISOString(),
                        extra_images: JSON.stringify([])
                    }])
                });
            } else if (method === 'DELETE') {
                route.fulfill({
                    status: 204,
                    contentType: 'application/json',
                    body: ''
                });
            } else route.continue();
        });
    }
}
