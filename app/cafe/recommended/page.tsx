import Head from 'next/head';

export default function Recommends() {
  return (
    <Head>
      <title>추천 카페 | Cafe Masters</title>
      <meta
        name="description"
        content={`마스터즈 월드의 크리에이터가 추천하는 카페입니다.`}
      />
    </Head>
  );
}
