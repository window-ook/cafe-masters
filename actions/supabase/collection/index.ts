import { Database } from 'types_db';

export { getCollectedCafes } from '@/actions/supabase/collection/getData';
export { getCollectedCafesCounts } from '@/actions/supabase/collection/getCounts';
export { createCollectedCafe } from '@/actions/supabase/collection/create';
export { updateCollectedCafe } from '@/actions/supabase/collection/update';

export type CollectedRow = Database['public']['Tables']['collection']['Row'];
export type CollectedRowInsert = Database['public']['Tables']['collection']['Insert'];
export type CollectedRowUpdate = Database['public']['Tables']['collection']['Update'];