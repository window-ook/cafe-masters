import { NextResponse } from 'next/server';
import { getAllCollectionCafes } from '@/data/supabase/collection';

/** 수집한 카페 전체 목록 조회 */
export async function GET() {
  return NextResponse.json(await getAllCollectionCafes());
}
