import './globals.css';
import type { Metadata } from 'next';
import { createServerSupabaseClient } from 'utils/supabase/server';
import ReactQueryClientProvider from 'config/ReactQueryClientProvider';
import Auth from 'components/auth';
import AuthProvider from 'config/auth-provider';
import MainLayout from 'components/layouts/main-layout';
import KakaoMap from 'components/map';

export const metadata: Metadata = {
  title: '카페 마스터즈',
  description: '개발중인 프로젝트입니다.',
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
