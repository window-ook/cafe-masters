import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import { createServerSupabaseClient } from 'utils/supabase/server';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ToastContainer } from 'react-toastify';
import { Metadata } from 'next';
import ReactQueryClientProvider from 'config/ReactQueryClientProvider';
import Auth from 'components/auth';
import AuthProvider from 'config/auth-provider';
import MainLayout from 'components/layouts/main-layout';
import KakaoMap from 'components/layouts/map';

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

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css"
          integrity="sha512-MV7K8+y+gLIBoVD59lQIYicR65iaqukzvf/nwasF0nqhPay5w/9lJmVM2hMDcnK1OnMGCdVK+iQrJ7lzPJQd1w=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body>
        <ReactQueryClientProvider>
          <AuthProvider accessToken={session?.access_token}>
            {session?.user ? (
              <MainLayout session={session}>
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
                <ReactQueryDevtools initialIsOpen={false} />
              </MainLayout>
            ) : (
              <Auth />
            )}
          </AuthProvider>
        </ReactQueryClientProvider>
      </body>
    </html>
  );
}
