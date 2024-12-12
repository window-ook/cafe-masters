'use client';

import { ReactNode, useEffect } from 'react';
import Sidebar from 'components/layouts/sidebar/container';

interface MainLayout {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayout) {
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
    </main>
  );
}
