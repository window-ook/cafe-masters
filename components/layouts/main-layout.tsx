'use client';

import { ReactNode, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Sidebar from 'components/layouts/sidebar/container';

const KakaoMap = dynamic(() => import('components/layouts/kakaomap'), {
  ssr: false,
});

const ReactQueryDevtools = dynamic(
  () =>
    import('@tanstack/react-query-devtools').then(
      mod => mod.ReactQueryDevtools,
    ),
  { ssr: false },
);

const ToastContainer = dynamic(
  () => import('react-toastify').then(mod => mod.ToastContainer),
  { ssr: false },
);

interface MainLayout {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayout) {
  const isDev = process.env.NEXT_PUBLIC_THIS_ENV === 'develope';

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(registration => {
        console.log('Service Worker registered:', registration);
      });
    }
  }, []);

  return (
    <main className="flex">
      <Sidebar />
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
    </main>
  );
}
