import { Database } from 'types_db';

export { getRecommendationCafes, getRecommendationCafeById } from '@/actions/supabase/recommendation/getData';
export { getRecommendationCounts } from '@/actions/supabase/recommendation/getCounts';
export { createRecommendationCafe } from '@/actions/supabase/recommendation/create';
export { deleteRecommendationCafe } from '@/actions/supabase/recommendation/delete';

export type RecommendationRow = Database['public']['Tables']['recommendation']['Row'];
export type RecommendationRowInsert = Database['public']['Tables']['recommendation']['Insert'];