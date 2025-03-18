import Head from 'next/head';

export default function ForDev() {
  return (
    <Head>
      <title>개발자를 위한 카페 추천 리스트 | Cafe Masters</title>
      <meta name="description" content={`개발자를 위한 카페를 추천해드려요`} />
    </Head>
  );
}
