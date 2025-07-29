import { Database } from 'types_db';

export { getRecommendedCafes } from '@/actions/supabase/recommendation/getData';
export { getRecommendedCafesCounts } from '@/actions/supabase/recommendation/getCounts';
export { createRecommendedCafe } from '@/actions/supabase/recommendation/create';
export { deleteRecommendedCafe } from '@/actions/supabase/recommendation/delete';

export type RecommendationRow = Database['public']['Tables']['recommendation']['Row'];
export type RecommendationRowInsert = Database['public']['Tables']['recommendation']['Insert'];