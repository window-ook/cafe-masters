'use client';

import { useUserStore } from 'utils/store';

import Head from 'next/head';
import useCountCollectedQuery from 'hooks/cache/useCountCollectedQuery';

export default function CollectedPage() {
  const userId = useUserStore(state => state.userId);
  useCountCollectedQuery(userId);

  return (
    <Head>
      <title>수집한 카드 | Cafe Masters</title>
      <meta name="description" content={`내가 수집한 카드들을 볼 수 있어요.`} />
    </Head>
  );
}
