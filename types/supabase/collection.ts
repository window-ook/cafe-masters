/** Supabase 수집한 카페 */
export interface ISupabaseCollectionCafe {
    id: number;
    user_id: string;
    name: string;
    coordX: number;
    coordY: number;
    image: string;
    extra_images?: string[] | null;
    ratings?: number | null;
    /** 광물 재질. null이면 아직 개봉되지 않은 카드입니다 */
    material?: string | null;
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