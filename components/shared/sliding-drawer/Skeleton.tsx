'use client';

import React from 'react';

interface SkeletonProps {
  width: string;
  height: string;
}

export default function Skeleton({ width, height }: SkeletonProps) {
  return (
    <div
      className={`${width} ${height} rounded-sm bg-neutral-100 animate-skeleton opacity-50`}
    />
  );
}
