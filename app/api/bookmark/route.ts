import { NextResponse } from 'next/server';
import { getBookmarkCafes } from '@/data/supabase/bookmark';

/** 북마크 카페 목록 조회 */
export async function GET() {
  return NextResponse.json(await getBookmarkCafes());
}
