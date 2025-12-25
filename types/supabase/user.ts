/** Supabase 유저 */
export interface ISupabaseUser {
    user_id: string;
    admin: boolean;
    nickname: string | null;
    gender: 'male' | 'female' | null;
    created_at: string;
}