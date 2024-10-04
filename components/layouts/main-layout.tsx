import { Sidebar } from 'components/sidebar';

export default function MainLayout({ children }) {
  return (
    <main className="flex">
      <Sidebar />
      {children}
    </main>
  );
}
