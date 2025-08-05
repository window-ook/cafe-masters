/** Supabase 추천 카페 */
export interface ISupabaseRecommendationCafe {
    id: number;
    categories: string[];
    coordX: number;
    coordY: number;
    name: string;
    image: string;
    extra_images?: string[] | null;
    opening_time?: string | undefined;
    address: string;
    phone_number?: string | null;
    menus?: string | null;
    created_at: string;
}