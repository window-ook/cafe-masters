import { NextResponse } from 'next/server';
import { getBookmarkCounts } from '@/data/supabase/bookmark';

/** 북마크한 카페 수 조회 */
export async function GET() {
  return NextResponse.json(await getBookmarkCounts());
}
