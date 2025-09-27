import { Page } from 'playwright-core';
import { TEST_SELECTORS } from '@/tests/e2e/utils/constants';

export class MainPage {
    constructor(private page: Page) { }

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

        const searchInput = this.page.getByTestId(TEST_SELECTORS.INPUT_SEARCH);
        await searchInput.waitFor({ state: 'visible' });

        const submitKeywordButton = this.page.getByTestId(TEST_SELECTORS.BUTTON_SUBMIT_KEYWORD_FOR_SEARCH);
        await submitKeywordButton.waitFor({ state: 'visible' });

        await this.page.getByTestId(TEST_SELECTORS.INPUT_SEARCH).fill(keyword);
        await this.page.getByTestId(TEST_SELECTORS.BUTTON_SUBMIT_KEYWORD_FOR_SEARCH).click();
    }
}