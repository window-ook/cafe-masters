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
  verification: {
    other: {
      'naver-site-verification': 'a5ac1b2a1e00d0be10af5842d117fd62879c6e92',
    },
  },
  title: {
    default: 'Cafe Masters',
    template: '%s | Cafe Masters'
  },
  description: '카페를 즐겨 다니는 누구나 마스터가 될 수 있습니다!',
  keywords: [
    '카페 마스터즈',
    '카페마스터즈',
    '카페 마스터',
    '카페마스터',
    '카페 마스터즈 수집',
    '카페 마스터즈 수집하기',
    '카페 마스터즈 카드',
    '카페 마스터즈 유희왕',
    '카페 추천',
    '카페 리뷰',
    '카페 지도',
    'Cafe Masters',
    'CafeMasters',
    'cafe masters',
    'cafemasters',
  ],
  authors: [{ name: 'github@window-ook' }],
  creator: 'github@window-ook',
  publisher: 'github@window-ook',
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: 'https://app.cafe-masters.co',
    title: 'Cafe Masters',
    siteName: 'Cafe Masters',
    description: '카페를 즐겨 다니는 누구나 마스터가 될 수 있습니다!',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Cafe Masters',
        type: 'image/png',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cafe Masters',
    description: '카페를 즐겨 다니는 누구나 마스터가 될 수 있습니다!',
    images: [
      {
        url: '/opengraph-image.png',
        alt: 'Cafe Masters',
      }
    ],
    creator: 'github@window-ook',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://app.cafe-masters.co',
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
    <html lang="ko">
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