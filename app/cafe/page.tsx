'use client';

import { useUserStore } from 'utils/store';
import Head from 'next/head';
import useCountCollectedQuery from 'hooks/cache/useCountCollectedQuery';
import useCountBookmarkedQuery from 'hooks/cache/useCountBookmarkedQuery';

export default function Cafe() {
  const userId = useUserStore(state => state.userId);

  useCountCollectedQuery(userId);
  useCountBookmarkedQuery(userId);

  return (
    <Head>
      <title>메뉴 목록 | 카페 마스터즈 Cafe Masters</title>
      <meta name="description" content={`메뉴 목록입니다.`} />
    </Head>
  );
}
