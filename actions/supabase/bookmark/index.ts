import { Database } from '@/types_db';

export { getBookmarkCafes, getBookmarkCafeById } from '@/actions/supabase/bookmark/getData';
export { getBookmarkCounts } from '@/actions/supabase/bookmark/getCounts';
export { createBookmarkCafe } from '@/actions/supabase/bookmark/create';
export { deleteBookmarkCafe } from '@/actions/supabase/bookmark/delete';

export type BookmarkRowInsert = Database['public']['Tables']['bookmark']['Insert'];