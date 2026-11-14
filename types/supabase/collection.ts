/** Supabase 수집한 카페 */
export interface ISupabaseCollectionCafe {
    /** 카드 ID. 방문마다 새로 생성됩니다 */
    id: number;
    user_id: string;
    /** 장소 ID를 발급한 지도 제공자 */
    place_provider: string;
    /** 제공자 기준 장소 ID. 같은 카페의 카드들은 이 값을 공유합니다 */
    place_id: string;
    name: string;
    coordX: number;
    coordY: number;
    image: string;
    extra_images?: string[] | null;
    ratings?: number | null;
    /** 광물 재질. null이면 아직 개봉되지 않은 카드입니다 */
    material?: string | null;
    /** 재질을 추첨한 시각. 미개봉이면 null입니다 */
    drawn_at?: string | null;
    address: string;
    comment: string;
    pros: string;
    cons: string;
    eaten_menus: string;
    phone_number?: string | null;
    opening_time?: string | null;
    categories: string[];
    created_at: string;
    updated_at?: string | null;
}