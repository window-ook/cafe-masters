import { NextResponse } from 'next/server';
import { getRecommendationCafes } from '@/data/supabase/recommendation';

/** 추천 카페 목록 조회 */
export async function GET() {
  return NextResponse.json(await getRecommendationCafes());
}
