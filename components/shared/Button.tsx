'use client';

import React from 'react';

type ButtonVariant = 'default' | 'cancel' | 'disabled' | 'auth';

interface IButton {
  type?: 'button' | 'submit';
  ariaLabel?: string;
  text?: string;
  variant?: ButtonVariant;
  disabled?: boolean;
  customClassName?: string;
  onClick?: () => void | Promise<void> | Window | null;
  children?: React.ReactNode;
  dataTestId?: string;
}

/**
 * 통합 버튼
 * @param type 버튼 타입
 * @param text 버튼 텍스트
 * @param variant 버튼 변형
 * @param disabled 버튼 비활성화 여부
 */
export default function Button({
  type = 'button',
  ariaLabel,
  text,
  variant = 'default',
  disabled = false,
  customClassName = '',
  onClick,
  children,
  dataTestId,
}: IButton) {
  const getVariantClasses = (variant: ButtonVariant): string => {
    const hasCustomHover = customClassName.includes('hover:');
    const hasCustomBg = customClassName.includes('bg-');

    const baseClasses = `px-4 py-2 rounded-lg ${hasCustomBg ? '' : 'bg-button'} font-semibold text-button-text ${hasCustomHover ? '' : 'hover:bg-button-hover'} disabled:bg-button-disabled disabled:cursor-not-allowed hover-button`;

    switch (variant) {
      case 'default':
        return `${baseClasses}`;
      case 'cancel':
        return `border border-main bg-transparent text-button hover:text-button-text ${baseClasses}`;
      case 'disabled':
        return `bg-button-disabled ${baseClasses}`;
      case 'auth':
        return `w-full py-4 rounded-xl shadow-md bg-main flex justify-center font-semibold text-white text-2xl transition duration-150 ease-in hover:bg-main-600 disabled:opacity-50 disabled:cursor-not-allowed sm:py-2 sm:text-lg`;
      default:
        return `${baseClasses}`;
    }
  };

  const finalClassName = `${getVariantClasses(variant)} ${customClassName}`;
  const isClickDisabled = disabled || variant === 'disabled';

  return (
    <button
      type={type}
      aria-label={ariaLabel}
      data-testid={dataTestId}
      disabled={isClickDisabled}
      onClick={onClick}
      className={finalClassName}
    >
      {text || children}
    </button>
  );
}
