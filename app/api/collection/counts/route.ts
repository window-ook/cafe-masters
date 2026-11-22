import { NextResponse } from 'next/server';
import { getCollectionCounts } from '@/data/supabase/collection';

/** 수집한 카페 수 조회 */
export async function GET() {
  return NextResponse.json(await getCollectionCounts());
}
