import { Page } from 'playwright-core';
import { API_PATHS, MOCK_DATA } from '@/tests/e2e/utils/constants';
import { IKakaoSearchResult, ISearchCafeDetail } from '@/types/kakao-map';

interface IMockCafeDetailResponse extends IKakaoSearchResult, ISearchCafeDetail { }

export class SearchPage {
    constructor(private page: Page) { }

    /** 카페 검색 결과 목록에서 특정 카페 클릭 */
    async clickCafe(cafeId: string = MOCK_DATA.DEFAULT_CAFE_ID) {
        await this.page.route(API_PATHS.CAFE_DETAIL_LOCAL, async (route) => {
            const mockData = this.getMockSearchCafes(cafeId);
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ success: true, data: mockData })
            });
        });
    }

    /** 검색한 카페 정보 데이터
     * @return IMockCafeDetailResponse -> 카카오맵 데이터 + 스크래핑 데이터
    */
    private getMockSearchCafes(cafeId: string): IMockCafeDetailResponse {
        const mockCafes: Record<string, IMockCafeDetailResponse> = {
            '1': {
                id: '1',
                category_group_code: 'CE7',
                category_group_name: '카페',
                category_name: '음식점 > 카페',
                x: 126.92244916458264,
                y: 37.54882577058748,
                distance: '',
                place_name: '스탠스커피',
                place_url: 'http://place.map.kakao.com/1494667205',
                address_name: '서울 마포구 상수동 93-111',
                road_address_name: '서울 마포구 와우산로 11길 9',
                phone: '02-323-7500',
                image: 'https://img1.kakaocdn.net/cthumb/local/C544x408.q50/?fname=http%3A%2F%2Ft1.kakaocdn.net%2Fmystore%2F80D04C64F6A64A2880EC4EA6840336E7',
                extra_images: ["https://img1.kakaocdn.net/cthumb/local/C264x196.q50/?fname=http%3A%2F%2Ft1.kakaocdn.net%2Fmystore%2F6B4874501939408AB2C136F53E0A3444", "https://img1.kakaocdn.net/cthumb/local/C264x196.q50/?fname=http%3A%2F%2Ft1.kakaocdn.net%2Fmystore%2F69F6C36B0D774B67AC78D13B89DFA519"],
                opening_time: '11:00 ~ 22:00'
            },
            '2': {
                id: '2',
                category_group_code: 'CE7',
                category_group_name: '카페',
                category_name: '음식점 > 카페 > 커피전문점',
                x: 128.60039182923592,
                y: 35.871224288731426,
                distance: '',
                place_name: '이얼즈',
                place_url: 'http://place.map.kakao.com/803452801',
                address_name: '대구 중구 동문동 10-4',
                road_address_name: '대구 중구 공평로 79',
                phone: '',
                image: 'https://img1.kakaocdn.net/cthumb/local/C544x408.q50/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flocal%2FkakaomapPhoto%2Freview%2Fec2c1096b85aa2d7a0ef108c140901a58bffb8f4%3Foriginal',
                extra_images: ["https://img1.kakaocdn.net/cthumb/local/C264x196.q50/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flocal%2FkakaomapPhoto%2Freview%2Fada47eb2153cbf9a7e252665ccfa8fa6c451a8a8%3Foriginal", "https://img1.kakaocdn.net/cthumb/local/C264x196.q50/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flocal%2FkakaomapPhoto%2Freview%2F5437d75d7bf7ab5d3acc116b36e8790d7b756625%3Foriginal"],
                opening_time: '12:00 ~ 23:00'
            }
        };

        return mockCafes[cafeId] || mockCafes['1'];
    }
}