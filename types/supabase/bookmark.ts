/** Supabase 북마크한 카페 */
export interface ISupabaseBookmarkedCafe {
    id: number;
    user_id: string;
    coordX: number;
    coordY: number;
    image: string;
    extra_images?: string[] | null;
    name: string;
    address: string;
    phone_number?: string | null;
    opening_time?: string | null;
    menus?: string | null;
    created_at: string;
}