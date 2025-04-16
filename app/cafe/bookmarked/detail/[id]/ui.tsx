'use client';

import { use } from 'react';
import { PageProps } from 'types/common';
import useCafeDetailState from 'hooks/state/useCafeDetailState';

export default function BookmarkedDetailUI({ params }: PageProps) {
  const { id } = use(params);

  useCafeDetailState(id, 'bookmarked');

  return null;
}
