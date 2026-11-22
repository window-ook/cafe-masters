import { Database } from '@/types_db';

export { createBookmarkCafe } from '@/actions/supabase/bookmark/create';
export { deleteBookmarkCafe } from '@/actions/supabase/bookmark/delete';

export type BookmarkRowInsert = Database['public']['Tables']['bookmark']['Insert'];