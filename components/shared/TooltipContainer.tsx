'use client';

import React from 'react';

interface ITooltip {
  comment: string;
  component: React.ReactNode;
  left: '8' | '16' | '24' | '32';
}

export default function Tooltip({ comment, component, left }: ITooltip) {
  const TOOLTIP_STYLES: Record<ITooltip['left'], string> = {
    '8': `absolute left-8 translate-y-8 px-3 py-1 rounded-md shadow-lg opacity-0 bg-gray-500 text-white text-xs whitespace-nowrap group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`,
    '16': `absolute left-16 translate-y-8 px-3 py-1 rounded-md shadow-lg opacity-0 bg-gray-500 text-white text-xs whitespace-nowrap group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`,
    '24': `absolute left-24 translate-y-8 px-3 py-1 rounded-md shadow-lg opacity-0 bg-gray-500 text-white text-xs whitespace-nowrap group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`,
    '32': `absolute left-32 translate-y-8 px-3 py-1 rounded-md shadow-lg opacity-0 bg-gray-500 text-white text-xs whitespace-nowrap group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`,
  };
  return (
    <div className="relative group">
      <p className={`${TOOLTIP_STYLES[left]}`}>{comment}</p>
      {component}
    </div>
  );
}
