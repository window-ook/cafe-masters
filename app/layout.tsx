import { createServerSupabaseClient } from 'utils/supabase/server';
import { Metadata } from 'next';
import './globals.css';
import React from 'react';
import ReactQueryClientProvider from 'config/react-query-client-provider';
import AuthProvider from 'config/auth-provider';
import MainLayout from 'components/layouts/main-layout';
import localFont from 'next/font/local';
import NoSessionLayout from 'components/layouts/no-session-layout';

const pretendard = localFont({
  src: '../public/fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

const dunggeunmo = localFont({
  src: '../public/fonts/DungGeunMo.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-dunggeunmo',
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_API_REQUEST_URI || 'http://localhost:3000',
  ),
  title: 'Cafe Masters',
  description: '카드를 수집하고 카페 마스터가 되어보세요!',
  keywords: [
    '카페 마스터즈',
    '카페 마스터',
    '카페 추천',
    '카페 수집',
    '카페 카드',
  ],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    title: '카페 마스터즈 Cafe Masters',
    description: '카드를 수집하고 카페 마스터가 되어보세요!',
    images: [
      {
        url: '/image/og_image.avif',
        width: 2000,
        height: 1500,
        alt: 'OG image Alt 2000*1500(4:3)',
      },
    ],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createServerSupabaseClient();

  const isTesting = process.env.NEXT_IS_TESTING === 'test';

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="kr" className={`${pretendard.variable} ${dunggeunmo.variable}`}>
      <head>
        <meta
          name="google-site-verification"
          content="uLLg7r0DwRzwQB1croiSmhHf5Krf4FaxC2Z2t0BX4JM"
        />
      </head>
      <body className={`font-pretendard`}>
        <ReactQueryClientProvider>
          <AuthProvider
            accessToken={session?.access_token ?? 'no-access-token'}
          >
            {session?.user || isTesting ? (
              <MainLayout>{children}</MainLayout>
            ) : (
              <NoSessionLayout>{children}</NoSessionLayout>
            )}
          </AuthProvider>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
