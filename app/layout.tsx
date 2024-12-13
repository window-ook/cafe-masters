import { createServerSupabaseClient } from 'utils/supabase/server';
import { AuthViewProvider } from 'config/auth-view-provider';
import { ToastContainer } from 'react-toastify';
import { Metadata } from 'next';
import ReactQueryClientProvider from 'config/react-query-client-provider';
import AuthProvider from 'config/auth-provider';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react';
import dynamic from 'next/dynamic';
import Auth from 'components/auth/shared';
import MainLayout from 'components/layouts/main-layout';
import KakaoMap from 'components/layouts/kakaomap';
import localFont from 'next/font/local';

const dungGeunMo = localFont({
  src: './fonts/DungGeunMo.woff',
  display: 'swap',
  style: 'normal',
  variable: '--font-dpixel',
});

const ReactQueryDevtools = dynamic(
  () =>
    import('@tanstack/react-query-devtools').then(
      mod => mod.ReactQueryDevtools,
    ),
  { ssr: false },
);

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

  const isDev = process.env.NEXT_THIS_ENV === 'develope';

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en" className={dungGeunMo.className}>
      <body>
        <ReactQueryClientProvider>
          <AuthProvider accessToken={session?.access_token ?? 'no-user'}>
            {session?.user ? (
              <MainLayout>
                {children}
                <KakaoMap />
                <ToastContainer
                  position="top-center"
                  autoClose={2000}
                  newestOnTop={false}
                  draggable
                  theme="light"
                  limit={1}
                />
                {isDev && <ReactQueryDevtools initialIsOpen={false} />}
              </MainLayout>
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
