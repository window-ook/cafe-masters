'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import 'react-toastify/dist/ReactToastify.css';
import dynamic from 'next/dynamic';
import Home from 'app/page';
import Sidebar from '@/components/shared/sliding-drawer/SideBar';


const KakaoMap = dynamic(() => import('@/components/shared/KaKaoMap'), {
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

const isValidPath = (path: string) => {
  if (path === '/cafe') return true;
  if (path === '/cafe/help') return true;
  if (path.startsWith('/cafe/search')) return true;
  if (path.startsWith('/cafe/collected')) return true;
  if (path.startsWith('/cafe/bookmarked')) return true;
  if (path.startsWith('/cafe/recommended')) return true;
  return false;
};

export default function MainLayout({ children }: MainLayout) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isValidPath(pathname) && pathname !== '/') {
      router.replace('/cafe');
    }
  }, [pathname, router]);

  const isDev = process.env.NEXT_PUBLIC_THIS_ENV === 'develope';

  return (
    <>
      {pathname === '/' ? (
        <Home />
      ) : isValidPath(pathname) ? (
        <main data-cy="main-layout" className="flex h-screen overflow-hidden">
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
