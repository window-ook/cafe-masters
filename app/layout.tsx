import { Metadata } from 'next';
import { createServerSupabaseClient } from '@/utils/supabase/server';
import { SpeedInsights } from "@vercel/speed-insights/next";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://www.cafe-masters.com'),
  verification: {
    other: {
      'naver-site-verification': 'a5ac1b2a1e00d0be10af5842d117fd62879c6e92',
    },
  },
  title: {
    default: 'Cafe Masters',
    template: '%s | Cafe Masters'
  },
  description: '카페를 즐겨 다니는 분들을 위한 서비스',
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
  manifest: '/manifest.json',
  authors: [{ name: 'github@window-ook' }],
  creator: 'github@window-ook',
  publisher: 'github@window-ook',
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    title: 'Cafe Masters',
    siteName: 'Cafe Masters',
    description: '카페 정보를 쉽게 관리하고 싶은 당신을 위한 서비스',
    images: ['https://www.cafe-masters.com/opengraph-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cafe Masters',
    description: '카페 정보를 쉽게 관리하고 싶은 당신을 위한 서비스',
    images: ['https://www.cafe-masters.com/opengraph-image.png'],
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
    canonical: 'https://www.cafe-masters.com'
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createServerSupabaseClient();

  const { data: { session } } = await supabase.auth.getSession();

  return (
    <html lang="ko">
      <head>
        <meta
          name="google-site-verification"
          content="uLLg7r0DwRzwQB1croiSmhHf5Krf4FaxC2Z2t0BX4JM"
        />
        {/* PWA Meta Tags */}
        <meta name="application-name" content="Cafe Masters" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Cafe Masters" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#da483b" />
        <meta name="theme-color" content="#da483b" />

        <link rel="apple-touch-icon" href="/image/icons/app_icon_192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/image/icons/app_icon_192.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/image/icons/app_icon_192.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/image/icons/app_icon_192.png" />

        {/* Favicons */}
        <link rel="icon" type="image/png" sizes="32x32" href="/image/icons/app_icon_192.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/image/icons/app_icon_192.png" />
        <link rel="shortcut icon" href="/favicon.ico" />

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
          <SpeedInsights />
        </AuthProvider>
      </body>
    </html>
  );
}