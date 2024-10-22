import Sidebar from 'components/layouts/sidebar/sidebar';

export default function MainLayout({ children, session }) {
  return (
    <main className="flex">
      <Sidebar session={session} />
      {children}
    </main>
  );
}
