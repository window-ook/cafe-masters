/** Supabase 북마크한 카페 */
export interface ISupabaseBookmarkedCafe {
    id: number;
    user_id: string;
    name: string;
    coordX: number;
    coordY: number;
    image?: string | null;
    extra_images?: string[] | null;
    opening_time?: string | null;
    address: string;
    phone_number?: string | null;
    menus?: string | null;
    created_at: string;
}