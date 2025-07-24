'use client';

import { use } from 'react';
import { PageProps } from 'types/common';
import useCafeDetailState from '@/hooks/shared/useCafeDetailState';

export default function RecommendedDetailClient({ params }: PageProps) {
  const { id } = use(params);

  useCafeDetailState(id, 'recommended');

  return null;
}
