'use client';

import React from 'react';

type ButtonVariant = 'default' | 'cancel' | 'disabled';

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

        const baseClasses = `hover-button px-4 py-2 rounded-lg font-semibold disabled:bg-button-disabled ${hasCustomBg ? '' : 'bg-button'} text-button-text ${hasCustomHover ? '' : 'hover:bg-button-hover'} disabled:cursor-not-allowed`;

        switch (variant) {
            case 'default':
                return `${baseClasses}`;
            case 'cancel':
                return `bg-transparent text-button border border-main hover:text-button-text ${baseClasses}`;
            case 'disabled':
                return `bg-button-disabled ${baseClasses}`;
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