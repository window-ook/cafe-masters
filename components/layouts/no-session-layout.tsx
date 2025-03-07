'use client';

import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

export default function NoSessionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const router = useRouter();

  useEffect(() => {
    if (pathname.startsWith('/cafe')) router.replace('/auth');
  }, [pathname, router]);

  return <>{children}</>;
}
