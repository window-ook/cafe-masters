import React from 'react';
import Image from 'next/image';
import { escapeForXSS } from '@/utils/shared/escapeForXSS';

interface IInputField extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    labelSize?: 'text-sm' | 'text-base';
    isError?: string;
    errorResponseMessage?: string | null;
    isPasswordVisible?: boolean;
    customClassName?: string;
    handlePasswordVisibility?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    disabled: boolean;
    enableXSSProtection?: boolean; // XSS 보호 활성화 여부
}

/** 폼 공통 Input Field
 * @props label 라벨 텍스트
 * @props labelSize 라벨 텍스트 크기
 * @props id 인풋 아이디
 * @props type 인풋 타입
 * @props placeholder 인풋 플레이스홀더
 * @props isError 인풋 에러 여부
 * @props errorResponseMessage 인풋 에러 메시지
 * @props disabled 인풋 비활성화 여부
 * @props isPasswordVisible 비밀번호 보기 여부
 * @props handlePasswordVisibility 비밀번호 보기 핸들러
 * @props enableXSSProtection XSS 보호 활성화 여부 (기본값: true)
 * @props ...props 나머지 인풋 속성
 * @description 소수점 입력시 스핀버튼 숨김 적용됨, XSS 보호 기능 내장
 */
const InputField = React.forwardRef<HTMLInputElement, IInputField>(
    ({ label, labelSize = 'text-sm', id, type, placeholder, isError, errorResponseMessage, disabled, isPasswordVisible, customClassName, handlePasswordVisibility, enableXSSProtection = true, onChange, ...props }, ref) => {

        // XSS 보호가 활성화된 경우의 onChange 핸들러
        const handleSecureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            if (enableXSSProtection) {
                const safeValue = escapeForXSS(e.target.value);
                const safeEvent = {
                    ...e,
                    target: {
                        ...e.target,
                        value: safeValue
                    }
                };
                onChange?.(safeEvent as React.ChangeEvent<HTMLInputElement>);
            } else {
                onChange?.(e);
            }
        };

        return (
            <div className="w-full flex flex-col gap-2">
                <label htmlFor={id} className={`block ${labelSize} font-bold`}>{label}</label>
                <div className='relative'>
                    <input
                        ref={ref}
                        type={label === '비밀번호' ? (isPasswordVisible ? 'text' : 'password') : type}
                        id={id}
                        placeholder={placeholder}
                        aria-invalid={disabled ? (isError ? 'true' : 'false') : undefined}
                        className={`${customClassName} block w-full p-2.5 rounded-lg bg-slate-50 text-sm border-1 focus:outline-none ${isError || errorResponseMessage ? 'border-red-600' : 'focus:border-main'} [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
                        onChange={handleSecureChange}
                        {...props}
                    />
                    {label === '비밀번호' && (
                        <button
                            type="button"
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer hover:opacity-60"
                            onClick={handlePasswordVisibility}
                            tabIndex={-1}
                        >
                            <Image
                                src={isPasswordVisible ? "https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/visibility_on.svg" : "https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/visibility_off.svg"}
                                alt="비밀번호 보기 숨김"
                                width={24}
                                height={24}
                            />
                        </button>
                    )}
                </div>
                {errorResponseMessage ? (
                    <p className='text-red-600 text-sm'>{errorResponseMessage}</p>
                ) :
                    (isError && <p className='text-red-600 text-sm'>{isError}</p>)
                }
            </div>
        );
    }
);

InputField.displayName = 'InputField';

export default InputField;