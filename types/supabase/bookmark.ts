/** Supabase 북마크한 카페 */
export interface ISupabaseBookmarkCafe {
    id: number;
    user_id: string;
    coordX: number;
    coordY: number;
    name: string;
    address: string;
    created_at: string;
}