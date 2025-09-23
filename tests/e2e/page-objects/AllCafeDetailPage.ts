import { Page } from 'playwright-core';
import { API_PATHS, MOCK_DATA, SUCCESS_MESSAGES } from '@/tests/e2e/utils/constants';

export class AllCafeDetailPage {
    constructor(private page: Page) { }

    /** 수집한 카페(collection) 추가 액션 모킹 */
    async mockCreateCollectionCafeAction() {
        await this.page.route(API_PATHS.SUPABASE_CREATE_COLLECTION_CAFE, async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    success: true,
                    message: SUCCESS_MESSAGES.CAFE_COLLECTED,
                    data: { id: MOCK_DATA.CAFE_ID }
                })
            });
        });
    }

    /** 수집한 카페(collection) 수정 액션 모킹 */
    async mockUpdateCollectionCafeAction() {
        await this.page.route(API_PATHS.SUPABASE_UPDATE_COLLECTION_CAFE, async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    success: true,
                    message: SUCCESS_MESSAGES.COLLECTION_CAFE_UPDATED,
                    data: { id: MOCK_DATA.CAFE_ID }
                })
            });
        });
    }

    // TODO: 북마크 액션 모킹 구현 필요
    // TODO: 북마크 취소 액션 모킹 구현 필요
}