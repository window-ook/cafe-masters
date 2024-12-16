import { createServerSupabaseClient } from 'utils/supabase/server';
import { AuthViewProvider } from 'config/auth-view-provider';
import { Metadata } from 'next';
import './globals.css';
import React from 'react';
import localFont from 'next/font/local';
import ReactQueryClientProvider from 'config/react-query-client-provider';
import AuthProvider from 'config/auth-provider';
import MainLayout from 'components/layouts/main-layout';
import Auth from 'components/auth/shared';

const dungGeunMo = localFont({
  src: './fonts/DungGeunMo.woff',
  display: 'swap',
  style: 'normal',
  variable: '--font-dpixel',
});

export const metadata: Metadata = {
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
        url: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/og_image.webp',
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
    <html lang="en" className={dungGeunMo.className}>
      <body>
        <ReactQueryClientProvider>
          <AuthProvider
            accessToken={session?.access_token ?? 'no-access-token'}
          >
            {session?.user || isTesting ? (
              <MainLayout>{children}</MainLayout>
            ) : (
              <AuthViewProvider>
                <Auth />
              </AuthViewProvider>
            )}
          </AuthProvider>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
