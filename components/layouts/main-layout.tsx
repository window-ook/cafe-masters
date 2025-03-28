'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import 'react-toastify/dist/ReactToastify.css';
import dynamic from 'next/dynamic';
import Home from 'app/page';
import Sidebar from 'components/layouts/sidebar/sidebar';

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
  const router = useRouter();

  const pathname = usePathname();

  useEffect(() => {
    if (!pathname.startsWith('/cafe') && pathname !== '/')
      router.replace('/cafe');
  }, [pathname, router]);

  const isDev = process.env.NEXT_PUBLIC_THIS_ENV === 'develope';

  return (
    <>
      {pathname === '/' ? (
        <Home />
      ) : pathname.startsWith('/cafe') ? (
        <main data-cy="main-layout" className="flex">
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
      ) : null}
    </>
  );
}
