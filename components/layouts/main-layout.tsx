import { ReactNode } from 'react';
import Sidebar from 'components/layouts/sidebar/sidebar';

interface MainLayout {
  children: ReactNode;
  session: any;
}

export default function MainLayout({ children, session }: MainLayout) {
  return (
    <main className="flex">
      <Sidebar session={session} />
      {children}
    </main>
  );
}
