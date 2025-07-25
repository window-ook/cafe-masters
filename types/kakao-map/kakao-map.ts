/** 카카오맵 검색 결과 인터페이스 */
export interface IKakaoSearchResult {
    id: string;
    category_group_code: string;
    category_group_name: string;
    category_name: string;
    x: number;
    y: number;
    place_name: string;
    place_url: string;
    address_name: string;
    road_address_name: string;
    distance: string;
    phone: string;
}