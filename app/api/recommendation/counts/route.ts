import { NextResponse } from 'next/server';
import { getRecommendationCounts } from '@/data/supabase/recommendation';

/** 추천 카페 수 조회 */
export async function GET() {
  return NextResponse.json(await getRecommendationCounts());
}
