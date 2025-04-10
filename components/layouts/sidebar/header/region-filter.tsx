'use client';

import { useMapStore } from 'utils/store';
import React from 'react';

export default function RegionFilter() {
  const { selectedRegion, setSelectedRegion } = useMapStore();

  const regions = [
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

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedRegion(value);
  };

  return (
    <div>
      <select
        className="block w-full py-2 pl-3 pr-10 text-base rounded-md border-gray-300 bg-gray-100 focus:border-main focus:outline-none focus:ring-main text-black sm:text-sm"
        onChange={handleChange}
        value={selectedRegion}
      >
        {regions.map(region => (
          <option key={region.value} value={region.value}>
            {region.label}
          </option>
        ))}
      </select>
    </div>
  );
}
