'use client';

import { useFilterStore } from '@/stores';
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
  const selectedRating = useFilterStore(state => state.selectedRating);
  const setSelectedRating = useFilterStore(state => state.setSelectedRating);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedRating(value === 'all' ? 'all' : Number(value));
  };

  return (
    <div>
      <select
        aria-label="평점 선택 드롭다운"
        className="block w-full py-2 pl-3 pr-10 text-base rounded-md border-gray-300 bg-gray-100 focus:border-main focus:outline-none focus:ring-main text-black sm:text-sm"
        onChange={handleChange}
        value={selectedRating}
      >
        {STARS.map(rating => (
          <option key={rating.value} value={rating.value}>
            {rating.label}
          </option>
        ))}
      </select>
    </div>
  );
}
