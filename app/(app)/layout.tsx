import { type ReactNode } from 'react';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { getAuthContext } from '@/data/supabase/getAuthContext';
import { getBookmarkCafes, getBookmarkCounts } from '@/data/supabase/bookmark';
import { getAllCollectionCafes, getCollectionCounts } from '@/data/supabase/collection';
import { getRecommendationCafes, getRecommendationCounts } from '@/data/supabase/recommendation';
import { bookmarkCafeQuery } from '@/queries/supabase/bookmark';
import { collectionCafeQuery } from '@/queries/supabase/collection';
import { recommendationCafeQuery } from '@/queries/supabase/recommendation';

/**
 * 지도 셸을 쓰는 화면의 레이아웃
 * @description 셸이 쓰는 조회를 서버에서 미리 받아 클라이언트 Query 캐시에 넘깁니다.
 * 지도와 사이드바가 모든 앱 화면에서 세 목록과 세 카운트를 쓰므로 한 번에 받습니다.
 * 각 queryFn은 같은 key를 쓰는 훅의 queryFn과 같은 모양의 값을 돌려줘야 합니다.
 * 실패한 조회는 넘기지 않으며, 그 조회는 훅이 API로 다시 받습니다.
 * 조회를 기다렸다가 첫 응답에 싣습니다. Suspense로 스트리밍하면 셸의 훅이 먼저 마운트되어 같은 조회를 한 번 더 보냅니다.
 */
export default async function AppLayout({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient();
  const { user } = await getAuthContext();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: recommendationCafeQuery.all(),
      queryFn: async () => (await getRecommendationCafes()).data,
    }),
    queryClient.prefetchQuery({
      queryKey: recommendationCafeQuery.counts(),
      queryFn: () => getRecommendationCounts(),
    }),
    ...(user
      ? [
          queryClient.prefetchQuery({
            queryKey: bookmarkCafeQuery.all(user.id),
            queryFn: () => getBookmarkCafes(),
          }),
          queryClient.prefetchQuery({
            queryKey: bookmarkCafeQuery.counts(user.id),
            queryFn: () => getBookmarkCounts(),
          }),
          queryClient.prefetchQuery({
            queryKey: collectionCafeQuery.all(user.id),
            queryFn: () => getAllCollectionCafes(),
          }),
          queryClient.prefetchQuery({
            queryKey: collectionCafeQuery.counts(user.id),
            queryFn: () => getCollectionCounts(),
          }),
        ]
      : []),
  ]);

  return <HydrationBoundary state={dehydrate(queryClient)}>{children}</HydrationBoundary>;
}
