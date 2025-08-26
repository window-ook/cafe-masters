import { Database } from 'types_db';

export { getCollectionCafes, getAllCollectionCafes, getCollectionCafeById } from '@/actions/supabase/collection/getData';
export { getCollectionCounts } from '@/actions/supabase/collection/getCounts';
export { createCollectionCafe } from '@/actions/supabase/collection/create';
export { updateCollectionCafe } from '@/actions/supabase/collection/update';

export type CollectionRow = Database['public']['Tables']['collection']['Row'];
export type CollectionRowInsert = Database['public']['Tables']['collection']['Insert'];
export type CollectionRowUpdate = Database['public']['Tables']['collection']['Update'];