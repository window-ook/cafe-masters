'use client';

import dynamic from 'next/dynamic';

const PolaroidGalleryBackground = dynamic(
  () => import('@/components/shared/PolaroidGalleryBackground'),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-50 to-gray-100" />
    ),
  },
);

export default function PersistentBackgroundCards() {
  return <PolaroidGalleryBackground />;
}
