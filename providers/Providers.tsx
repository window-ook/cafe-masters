'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundaryWrapper } from '@/components/shared/ErrorBoundaryWrapper';
import 'react-toastify/dist/ReactToastify.css';
import dynamic from 'next/dynamic';
import SideBar from '@/components/shared/sidebar/SideBar';

const ReactQueryDevtools = dynamic(() => import('@tanstack/react-query-devtools').then(mod => mod.ReactQueryDevtools), { ssr: false });
const ToastContainer = dynamic(() => import('react-toastify').then(mod => mod.ToastContainer), { ssr: false });
const KakaoMap = dynamic(() => import('@/components/shared/KaKaoMap'), { ssr: false });

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: (failureCount, error) => {
              if (error?.name === 'NetworkError') return failureCount < 3;
              return false;
            },
            staleTime: 30 * 60 * 1000,
            gcTime: 60 * 60 * 1000,
            refetchOnWindowFocus: false,
            refetchOnReconnect: 'always',
          },
        },
      }),
  );

  const pathname = usePathname();

  // 카카오맵과 사이드바를 숨겨야 하는 페이지들
  const hiddenPages = ['/'];
  const authPages = ['/signin', '/signup', '/reset-password'];
  const shouldHideComponents = hiddenPages.includes(pathname) || authPages.some(page => pathname.startsWith(page));

  return (
    <main className={shouldHideComponents ? "w-full" : "flex h-screen overflow-hidden"}>
      <QueryClientProvider client={queryClient}>
        {!shouldHideComponents && (
          <ErrorBoundaryWrapper
            featureName="사이드바"
            message="사이드바를 불러오는 중 에러가 발생했습니다."
          >
            <SideBar />
          </ErrorBoundaryWrapper>
        )}
        {children}
        {!shouldHideComponents && <KakaoMap />}
        <ToastContainer
          position="top-center"
          autoClose={2000}
          newestOnTop={false}
          draggable
          theme="light"
          limit={1}
        />
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools
            initialIsOpen={false}
          />
        )}
      </QueryClientProvider>
    </main>
  );
}
