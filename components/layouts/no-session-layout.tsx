'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

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
