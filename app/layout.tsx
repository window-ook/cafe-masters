import { Metadata } from 'next';
import { createServerSupabaseClient } from '@/utils/supabase/server';
import './globals.css';
import React from 'react';
import localFont from 'next/font/local';
import AuthProvider from '@/providers/AuthProvider';
import Providers from '@/providers/Providers';

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
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: 'Cafe Masters',
  description: '카페를 자주 다니는 사람들을 위한 플랫폼',
  keywords: [
    '카페 마스터즈',
    '카페마스터즈',
    '카페 마스터',
    '카페마스터',
    '카페 마스터즈 수집',
    '카페 마스터즈 수집하기',
    '카페 마스터즈 카드',
    '카페 마스터즈 유희왕',
    'Cafe Masters',
    'CafeMasters',
    'cafe masters',
    'cafemasters',
  ],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    title: 'Cafe Masters',
    siteName: 'Cafe Masters',
    description: '카페를 자주 다니는 사람들을 위한 플랫폼',
    images: ['https://app.cafe-masters.co/opengraph-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cafe Masters',
    description: '카페를 자주 다니는 사람들을 위한 플랫폼',
    images: ['https://app.cafe-masters.co/opengraph-image.png'],
  },
  alternates: {
    canonical: '/',
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
    <html lang="kr">
      <head>
        <meta
          name="google-site-verification"
          content="uLLg7r0DwRzwQB1croiSmhHf5Krf4FaxC2Z2t0BX4JM"
        />
        <link
          rel="preload"
          href="/fonts/PretendardVariable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/DungGeunMo.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${pretendard.variable} ${dunggeunmo.variable} font-pretendard`}
      >
        <AuthProvider accessToken={session?.access_token || null}>
          <Providers>{children}</Providers>
        </AuthProvider>
      </body>
    </html>
  );
}