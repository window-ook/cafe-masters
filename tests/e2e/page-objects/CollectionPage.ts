import { Page } from 'playwright-core';
import { API_PATHS } from '@/tests/e2e/utils/constants';
import { ISupabaseCollectionCafe } from '@/types/supabase/collection';

export class CollectionPage {
    constructor(private page: Page) { }

    /** 수집한 카페 목록 조회 서버 액션 모킹 (빈 상태) */
    async mockGetEmptyCollectionCafesAction() {
        await this.page.route(API_PATHS.SUPABASE_GET_COLLECTION_CAFES, async (route) => {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    success: true,
                    data: [],
                    hasMore: false,
                    nextCursor: null
                })
            });
        });
    }

    /** 수집한 카페 목록 조회 서버 액션 모킹 */
    async mockGetCollectionCafesAction() {
        await this.page.route(API_PATHS.SUPABASE_GET_COLLECTION_CAFES, async (route) => {
            const mockCafes = [
                this.getCollectionCafe('1'),
                this.getCollectionCafe('2')
            ];

            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    success: true,
                    data: mockCafes,
                    hasMore: false,
                    nextCursor: null
                })
            });
        });
    }

    /** 수집한 카페 JSON 데이터 반환
    * @return ISupabaseCollectionCafe
   */
    private getCollectionCafe(cafeId: string): ISupabaseCollectionCafe {
        const mockCafes: Record<string, ISupabaseCollectionCafe> = {
            '1': {
                id: 233485062,
                name: "수수밀소",
                address: "대구 동구 매여로 320",
                coordX: 128.715042760351,
                coordY: 35.9068536906751,
                image: "https://img1.kakaocdn.net/cthumb/local/C544x408.q50/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flocal%2FkakaomapPhoto%2Freview%2Fa7a8a9c5e452346856a6295285ab32a008dc4a97%3Foriginal",
                comment: "쾌적한 통창, 산을 바라보는 풍경이 아주 좋은 카페입니다. 아주 좋아~",
                pros: "커피도 맛있고, 포토존으로 찍기 좋은 인공연못과 푸르른 산이 있습니다.",
                cons: "",
                eaten_menus: "아이스크림 라떼",
                ratings: 5,
                created_at: "2025-08-05 13:01:55.155+00",
                updated_at: null,
                user_id: "d2115d83-da2f-4c2d-8c27-5bb29b8eb0f3",
                phone_number: "053-965-4595",
                opening_time: "10:30 ~ 20:00",
                categories: ["전망 좋은", "공간이 넓은", "주차장 있는", "디저트가 맛있는", "포토존 있는"],
                extra_images: ["https://img1.kakaocdn.net/cthumb/local/C264x196.q50/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flocal%2FkakaomapPhoto%2Freview%2F03885574f8b8070879f6259ccd56cb55d5621896%3Foriginal", "https://img1.kakaocdn.net/cthumb/local/C264x196.q50/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flocal%2FkakaomapPhoto%2Freview%2F46d4eada07b3992d0f3d4a9bc21f8550f513e239%3Foriginal"]
            },
            '2': {
                id: 803452801,
                name: "이얼즈",
                address: "대구 중구 동문동 10-4",
                coordX: 128.60039182923592,
                coordY: 35.871224288731426,
                image: "https://img1.kakaocdn.net/cthumb/local/C544x408.q50/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flocal%2FkakaomapPhoto%2Freview%2Fec2c1096b85aa2d7a0ef108c140901a58bffb8f4%3Foriginal",
                comment: "분위기가 정말 좋은 카페입니다",
                pros: "",
                cons: "",
                eaten_menus: "이얼즈 라떼",
                ratings: 5,
                created_at: "2025-09-23 03:00:00.000+00",
                updated_at: null,
                user_id: "mock-user-id",
                phone_number: "",
                opening_time: "12:00 ~ 23:00",
                categories: ["특색있는", "커피가 맛있는"],
                extra_images: ["https://img1.kakaocdn.net/cthumb/local/C264x196.q50/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flocal%2FkakaomapPhoto%2Freview%2Fada47eb2153cbf9a7e252665ccfa8fa6c451a8a8%3Foriginal"]
            }
        };

        return mockCafes[cafeId] || mockCafes['1'];
    }

    // TODO: 지역 필터링 기능 구현 필요
    // TODO: 별점 필터링 기능 구현 필요
}