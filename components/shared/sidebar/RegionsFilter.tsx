'use client';

import { useFilterStore, useUIStore } from '@/stores';
import React from 'react';

const REGIONS = [
  { value: 'all', label: '선택 안 함' },
  { value: '서울', label: '서울특별시' },
  { value: '인천', label: '인천광역시' },
  { value: '부산', label: '부산광역시' },
  { value: '울산', label: '울산광역시' },
  { value: '대구', label: '대구광역시' },
  { value: '대전', label: '대전광역시' },
  { value: '광주', label: '광주광역시' },
  { value: '세종', label: '세종특별자치시' },
  { value: '경기', label: '경기도' },
  { value: '충북', label: '충청북도' },
  { value: '충남', label: '충청남도' },
  { value: '전북', label: '전라북도' },
  { value: '전남', label: '전라남도' },
  { value: '경북', label: '경상북도' },
  { value: '경남', label: '경상남도' },
  { value: '강원특별자치도', label: '강원특별자치도' },
  { value: '제주특별자치도', label: '제주특별자치도' },
];

export default function RegionFilter() {
  const isDarkTheme = useUIStore(state => state.isDarkTheme);
  const selectedRegion = useFilterStore(state => state.selectedRegion);
  const setSelectedRegion = useFilterStore(state => state.setSelectedRegion);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedRegion(value);
  };

  return (
    <div className="relative">
      <select
        aria-label="지역 선택 드롭다운"
        className={`w-full appearance-none rounded-xl py-3 pr-12 pl-4 text-sm font-medium transition-all duration-200 ease-out ${
          isDarkTheme
            ? 'border-gray-600/40 bg-gray-800/60 text-white hover:bg-gray-800/80'
            : 'border-white/70 bg-white/60 text-gray-800 hover:bg-white/80'
        } focus:ring-main/20 cursor-pointer border backdrop-blur-md focus:ring-2 focus:ring-offset-0 focus:outline-none`}
        onChange={handleChange}
        value={selectedRegion}
      >
        {REGIONS.map(region => (
          <option key={region.value} value={region.value}>
            {region.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2">
        <svg
          className="size-4 opacity-60"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
}
