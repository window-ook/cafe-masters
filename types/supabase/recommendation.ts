/** Supabase 추천 카페 */
export interface ISupabaseRecommendationCafe {
    id: number;
    categories: string[];
    coordX: number;
    coordY: number;
    name: string;
    address: string;
    created_at: string;
}