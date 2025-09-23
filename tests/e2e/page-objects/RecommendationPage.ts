import { Page } from 'playwright-core';
import { API_PATHS } from '@/tests/e2e/utils/constants';
import { ISupabaseRecommendationCafe } from '@/types/supabase/recommendation';

export class RecommendationPage {
    constructor(private page: Page) { }

    /** 추천 카페 목록 조회 서버 액션 모킹 */
    async mockGetRecommendationCafesAction() {
        await this.page.route(API_PATHS.SUPABASE_GET_RECOMMENDATION_CAFES, async (route) => {
            const mockCafes = [
                this.getMockRecommendationCafe('1'),
                this.getMockRecommendationCafe('2')
            ];

            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    success: true,
                    data: mockCafes
                })
            });
        });
    }

    /** 추천 카페 JSON 데이터 반환
     * @return ISupabaseRecommendationCafe
    */
    private getMockRecommendationCafe(cafeId: string): ISupabaseRecommendationCafe {
        const mockCafes: Record<string, ISupabaseRecommendationCafe> = {
            '1': {
                id: 2076535170,
                name: "어레인지먼트",
                image: "https://img1.kakaocdn.net/cthumb/local/C544x408.q50/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flocal%2FkakaomapPhoto%2Freview%2Fd445e1ce0d081a1df12773a411d4a50b91e95448%3Foriginal",
                categories: ["주차장 있는", "포토존 있는", "공간이 넓은", "전망 좋은"],
                opening_time: "10:00 ~ 21:00",
                address: "경북 포항시 북구 흥해읍 해안로 1804",
                phone_number: "054-612-5050",
                menus: null,
                created_at: "2025-08-04 12:52:04.386+00",
                extra_images: ["https://img1.kakaocdn.net/cthumb/local/C264x196.q50/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flocal%2FkakaomapPhoto%2Freview%2Ff9cdd9696840515ad39f58e5af443d5c57741fa0%3Foriginal", "https://img1.kakaocdn.net/cthumb/local/C264x196.q50/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flocal%2FkakaomapPhoto%2Freview%2Ffe945252e31ff580880d80769d205fcea52ecc2e%3Foriginal"],
                coordX: 129.39852287790671,
                coordY: 36.16411815427859
            },
            '2': {
                id: 932891473,
                name: "카페오하이오",
                image: "https://img1.kakaocdn.net/cthumb/local/C544x408.q50/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flocal%2FkakaomapPhoto%2Freview%2Fdc837f79f497af139fba4a3e056f548940e27a3c%3Foriginal",
                categories: ["특색있는", "밝은", "콘센트 많은", "시끌벅적한", "포토존 있는"],
                opening_time: "11:00 ~ 23:00",
                address: "대구 중구 국채보상로 629",
                phone_number: null,
                menus: null,
                created_at: "2025-09-09 11:57:30.313+00",
                extra_images: ["https://img1.kakaocdn.net/cthumb/local/C264x196.q50/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flocal%2FkakaomapPhoto%2Freview%2Fbfac6e0b93d499470f0228076821bfbe8e1df51d%3Foriginal", "https://img1.kakaocdn.net/cthumb/local/C264x196.q50/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flocal%2FkakaomapPhoto%2Freview%2Ffd2a5f6f68a2cef99717a4fbbec9e720e1fd98c6%3Foriginal"],
                coordX: 128.599664378036,
                coordY: 35.8703959176838
            }
        };

        return mockCafes[cafeId] || mockCafes['1'];
    }

    // TODO: 카테고리 필터링 기능 구현 필요
}