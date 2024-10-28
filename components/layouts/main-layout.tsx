'use client';

import { ReactNode } from 'react';
import Sidebar from 'components/layouts/sidebar/sidebar';

interface MainLayout {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayout) {
  return (
    <main className="flex">
      <Sidebar />
      {children}
    </main>
  );
}
