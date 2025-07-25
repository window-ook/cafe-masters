'use client';

import { use } from 'react';
import { ClientPageProps, UrlParams } from 'types/shared/page';
import useCafeDetailState from '@/hooks/shared/useCafeDetailState';

export default function BookmarkedDetailClient({ params }: ClientPageProps) {
  const resolvedParams: UrlParams = use(params);
  const { id } = resolvedParams;

  useCafeDetailState(id, 'bookmarked');

  return null;
}