import { Page } from 'playwright-core';
import { API_PATHS } from '@/tests/e2e/utils/constants';
import { ISupabaseBookmarkCafe } from '@/types/supabase/bookmark';

export class BookmarkPage {
    constructor(private page: Page) { }

    /** 북마크한 카페 목록 조회 서버 액션 모킹 */
    async mockGetBookmarkCafesAction() {
        await this.page.route(API_PATHS.SUPABASE_GET_BOOKMARK_CAFES, async (route) => {
            const mockCafes = [
                this.getMockBookmarkCafe('1'),
                this.getMockBookmarkCafe('2')
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

    /** 북마크 카페 목록 JSON 데이터 반환
    * @return ISupabaseBookmarkCafe
   */
    private getMockBookmarkCafe(cafeId: string): ISupabaseBookmarkCafe {
        const mockCafes: Record<string, ISupabaseBookmarkCafe> = {
            '1': {
                id: 1,
                user_id: "d2115d83-da2f-4c2d-8c27-5bb29b8eb0f3",
                name: "블루보틀 성수 카페",
                image: "https://img1.kakaocdn.net/cthumb/local/C544x408.q50/?fname=http%3A%2F%2Ft1.kakaocdn.net%2Fmystore%2F723A22186EE84C9BB142E6E93DBCA4AA",
                opening_time: "07:30 ~ 20:30",
                address: "서울 성동구 아차산로 7",
                phone_number: "1533-6906",
                menus: "[{\"name\":\"아메리카노\",\"price\":\"5,900원\"}]",
                coordX: 127.04564285335792,
                coordY: 37.548088279686716,
                created_at: "2025-08-26 03:15:19.568+00",
                extra_images: ["https://img1.kakaocdn.net/cthumb/local/C264x196.q50/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flocal%2FkakaomapPhoto%2Freview%2F10d79014d04a5c9819979b3cce3599a674fe4192%3Foriginal\",\"https://img1.kakaocdn.net/cthumb/local/C264x196.q50/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flocal%2FkakaomapPhoto%2Freview%2F13e8afef43ac9a569a67a36a1abb7b886f39484b%3Foriginal"]
            },
            '2': {
                id: 537725204,
                user_id: "d2115d83-da2f-4c2d-8c27-5bb29b8eb0f3",
                name: "프론다커피바",
                image: "https://img1.kakaocdn.net/cthumb/local/C544x408.q50/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flocal%2FkakaomapPhoto%2Freview%2F7689d2feb17b4fe2eff73d5503ab0cfd5383e978%3Foriginal",
                opening_time: "12:00 ~ 22:00",
                address: "대구 중구 공평로 87",
                phone_number: "0503-7152-3868",
                menus: null,
                coordX: 128.6006804877929,
                coordY: 35.87186926414192,
                created_at: "2025-09-09 06:26:57.541+00", extra_images: ["https://img1.kakaocdn.net/cthumb/local/C264x196.q50/?fname=https%3A%2F%2Fpostfiles.pstatic.net%2FMjAyNTA4MjRfMjUg%2FMDAxNzU1OTYyNzQ0OTc1.urxac3yy4ZrJr2RqvFfC-uXyATrM6BTWSKzRc2AwCtAg.2ontoTnNGSiV2NKp7mSFhBX-0Lf26Ko1lqJ2l9oLzGEg.JPEG%2FIMG%25EF%25BC%25BF6924.jpg%3Ftype%3Dw773\",\"https://img1.kakaocdn.net/cthumb/local/C264x196.q50/?fname=https%3A%2F%2Fpostfiles.pstatic.net%2FMjAyNTA4MjRfMTUz%2FMDAxNzU1OTYyNzQ0MDcz.RsmtxCx_9S1htUsQfDJNyt5mQrWOKXErsDYcDIKOh20g.lA8ZzXumNRNYwj782gN7LfOPdUSBRBIfACKPNA2FiJkg.JPEG%2FIMG%25EF%25BC%25BF6957.jpg%3Ftype%3Dw773"]
            }
        };

        return mockCafes[cafeId] || mockCafes['1'];
    }


    // TODO: 지역 필터링 기능 구현 필요
}