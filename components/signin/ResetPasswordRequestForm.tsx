'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRequestResetPassword } from '@/hooks/supabase/user/useRequestResetPassword';
import { resetPasswordRequestSchema, ResetPasswordRequestData } from '@/schema/auth';
import InputField from '@/components/shared/InputField';
import Button from '@/components/shared/Button';
import { CONSOLE_ERROR } from '@/utils/constants/messages';

interface IResetPasswordRequestFormProps {
  onBackAction: () => void;
  onSuccessAction: () => void;
}

export default function ResetPasswordRequestForm({
  onBackAction,
  onSuccessAction
}: IResetPasswordRequestFormProps) {
  const { requestResetPassword } = useRequestResetPassword();

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordRequestData>({
    resolver: zodResolver(resetPasswordRequestSchema),
    defaultValues: {
      email: '',
    },
  });

  const onFormSubmit = async (data: ResetPasswordRequestData) => {
    try {
      requestResetPassword(data.email.trim());
      onSuccessAction();
    } catch (error) {
      console.error(CONSOLE_ERROR.REQUEST_RESET_PASSWORD, error);
    }
  };

  return (
    <div>
      <p className="auth-form-title">비밀번호 재설정</p>
      <form
        className="w-80 max-w-(--breakpoint-lg) sm:w-96 flex flex-col gap-4"
        onSubmit={handleSubmit(onFormSubmit)}
      >
        <p className="text-sm text-gray-600 mb-2">
          가입하신 이메일 주소를 입력해주세요.<br />
          비밀번호 재설정 링크를 발송해드립니다.
        </p>

        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <InputField
              {...field}
              id="reset-email"
              type="email"
              label="이메일"
              placeholder="아이디@주소"
              disabled={isSubmitting}
              isError={errors.email?.message}
            />
          )}
        />

        <Button
          type="submit"
          ariaLabel="비밀번호 재설정 이메일 발송"
          disabled={isSubmitting}
          text={isSubmitting ? '발송 중...' : '재설정 링크 발송'}
        />

        <Button
          type="button"
          ariaLabel="로그인 화면으로 돌아가기"
          onClick={onBackAction}
          customClassName="bg-gray-500"
          text="취소"
        />
      </form>
    </div>
  );
}