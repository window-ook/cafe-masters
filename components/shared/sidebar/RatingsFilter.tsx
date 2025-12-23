'use client';

import { useFilterStore, useUIStore } from '@/stores';
import React from 'react';

const STARS = [
  { value: 'all', label: '선택 안 함' },
  { value: 1, label: '⭐️' },
  { value: 2, label: '⭐️⭐️' },
  { value: 3, label: '⭐️⭐️⭐️' },
  { value: 4, label: '⭐️⭐️⭐️⭐️' },
  { value: 5, label: '⭐️⭐️⭐️⭐️⭐️' },
];

export default function RatingsFilter() {
  const isDarkTheme = useUIStore(state => state.isDarkTheme);
  const selectedRating = useFilterStore(state => state.selectedRating);
  const setSelectedRating = useFilterStore(state => state.setSelectedRating);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedRating(value === 'all' ? 'all' : Number(value));
  };

  return (
    <div className="relative">
      <select
        aria-label="평점 선택 드롭다운"
        className={`
          w-full py-3 pl-4 pr-12
          rounded-xl
          text-sm font-medium
          appearance-none
          transition-all duration-200 ease-out
          ${isDarkTheme
            ? 'bg-gray-800/60 border-gray-600/40 text-white hover:bg-gray-800/80'
            : 'bg-white/60 border-white/70 text-gray-800 hover:bg-white/80'
          }
          backdrop-blur-md border
          focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-main/20
          cursor-pointer
        `}
        onChange={handleChange}
        value={selectedRating}
      >
        {STARS.map(rating => (
          <option key={rating.value} value={rating.value}>
            {rating.label}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="size-4 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
