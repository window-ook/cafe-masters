'use client';

import React from 'react';

interface ITooltip {
  comment: string;
  component: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * 툴팁 컴포넌트
 * @param comment - 툴팁에 표시될 텍스트
 * @param component - 툴팁이 적용될 React 컴포넌트
 * @param position - 툴팁 표시 위치 (기본값: 'top')
 */
export default function Tooltip({ comment, component, position = 'top' }: ITooltip) {
  const POSITION_STYLES: Record<NonNullable<ITooltip['position']>, string> = {
    top: 'bottom-full left-1/2 -translate-x-1/2 -translate-y-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 translate-y-2',
    left: 'right-full top-1/2 -translate-y-1/2 -translate-x-2',
    right: 'left-full top-1/2 -translate-y-1/2 translate-x-2',
  };

  return (
    <div className="relative group inline-block">
      {component}
      <span
        className={`absolute ${POSITION_STYLES[position]} px-3 py-1.5 rounded-md shadow-lg bg-gray-500 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50`}
      >
        {comment}
      </span>
    </div>
  );
}
