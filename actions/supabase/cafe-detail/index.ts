import { Database } from '@/types_db';

export { getCafeDetail } from '@/actions/supabase/cafe-detail/getData';
export { createCafeDetail } from '@/actions/supabase/cafe-detail/create';

export type CafeDetailRow = Database['public']['Tables']['cafe_detail']['Row'];
export type CafeDetailInsert = Database['public']['Tables']['cafe_detail']['Insert'];