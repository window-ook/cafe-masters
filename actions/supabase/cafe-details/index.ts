import { Database } from '@/types_db';

export { getCafeDetail } from '@/actions/supabase/cafe-details/getData';
export { createCafeDetail } from '@/actions/supabase/cafe-details/create';

export type CafeDetailRow = Database['public']['Tables']['cafe_details']['Row'];
export type CafeDetailInsert = Database['public']['Tables']['cafe_details']['Insert'];