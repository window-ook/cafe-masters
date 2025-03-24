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
      <title>메뉴 | Cafe Masters</title>
      <meta name="description" content={`원하는 메뉴를 선택해보세요.`} />
    </Head>
  );
}
