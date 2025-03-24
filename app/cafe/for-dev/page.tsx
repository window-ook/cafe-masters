import Head from 'next/head';

export default function ForDev() {
  return (
    <Head>
      <title>개발자를 위한 카페 추천 | Cafe Masters</title>
      <meta name="description" content={`개발자를 위한 카페입니다.`} />
    </Head>
  );
}
