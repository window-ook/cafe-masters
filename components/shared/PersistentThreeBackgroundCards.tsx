'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';
import dynamic from 'next/dynamic';

const ThreeBackgroundCards = dynamic(() => import('@/components/shared/ThreeBackgroundCards'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 -z-10 bg-black/60" />,
});

const BACKGROUND_ROUTES = [
  '/',
  '/signin',
  '/signup',
  '/signup/verify',
  '/reset-password',
  '/reset-password/complete',
];

export default function PersistentThreeBackgroundCards() {
  const pathname = usePathname();

  const shouldShowBackground = useMemo(
    () => BACKGROUND_ROUTES.includes(pathname),
    [pathname]
  );

  return (
    <div className={shouldShowBackground ? '' : 'hidden'}>
      <ThreeBackgroundCards />
    </div>
  );
}
