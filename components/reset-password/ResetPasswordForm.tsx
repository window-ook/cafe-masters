'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createBrowserSupabaseClient } from '@/utils/supabase/client';
import { resetPasswordFormSchema, ResetPasswordFormData } from '@/schema/auth';
import { useFinishResetPassword } from '@/hooks/supabase/authentication';
import { CONSOLE_ERROR, TOAST_SUCCESS } from '@/constants/messages';
import { toast } from 'react-toastify';
import RisingCards from '@/components/shared/RisingCards';
import Button from '@/components/shared/Button';
import InputField from '@/components/shared/InputField';

export default function ResetPasswordForm() {
  const supabase = createBrowserSupabaseClient();
  const router = useRouter();

  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState<boolean>(false);

  const { finishResetPassword } = useFinishResetPassword();

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordFormSchema),
    defaultValues: {
      newPassword: '',
      newPasswordConfirm: '',
    },
  });

  const onFormSubmit = async (data: ResetPasswordFormData) => {
    try {
      finishResetPassword(data.newPassword);
      toast.success(TOAST_SUCCESS.RESET_PASSWORD);
      router.push('/reset-password/complete');
    } catch (error) {
      console.error(CONSOLE_ERROR.RESET_PASSWORD, error);
    }
  };

  const handleCancel = async () => {
    await supabase.auth.signOut();
    router.push('/signin');
  };

  const togglePasswordVisibility = () => setIsPasswordVisible(prev => !prev);
  const toggleConfirmPasswordVisibility = () => setIsConfirmPasswordVisible(prev => !prev);

  return (
    <main className="area h-screen w-screen flex justify-center items-center">
      <RisingCards />
      <div className="flex flex-col items-center gap-4">
        <span className="text-3xl font-bold text-white [text-shadow:0_0_10px_rgba(135,90,173,1),0_4px_8px_rgba(0,0,0,0.9)]">
          Cafe Masters
        </span>
        <div className="z-10 p-5 rounded-xl bg-white shadow-main-shadow">
          <form
            className="w-80 max-w-(--breakpoint-lg) sm:w-96 flex flex-col gap-4"
            onSubmit={handleSubmit(onFormSubmit)}
          >
            <p className="text-center text-3xl font-bold">
              비밀번호 재설정
            </p>
            <p className="text-sm text-gray-600 text-center">
              새로운 비밀번호를 설정해주세요.
            </p>

            <Controller
              name="newPassword"
              control={control}
              render={({ field }) => (
                <InputField
                  {...field}
                  id="new-password"
                  type="password"
                  label="새 비밀번호"
                  placeholder="영문+숫자 6자 이상"
                  disabled={isSubmitting}
                  isError={errors.newPassword?.message}
                  isPasswordVisible={isPasswordVisible}
                  handlePasswordVisibility={togglePasswordVisibility}
                />
              )}
            />

            <Controller
              name="newPasswordConfirm"
              control={control}
              render={({ field }) => (
                <InputField
                  {...field}
                  id="confirm-password"
                  type="password"
                  label="비밀번호 확인"
                  placeholder="비밀번호를 다시 입력하세요"
                  disabled={isSubmitting}
                  isError={errors.newPasswordConfirm?.message}
                  isPasswordVisible={isConfirmPasswordVisible}
                  handlePasswordVisibility={toggleConfirmPasswordVisibility}
                />
              )}
            />

            <Button
              type="submit"
              ariaLabel="완료 버튼, 재설정 완료 화면으로 이동합니다"
              disabled={isSubmitting}
              text={isSubmitting ? '변경 중...' : '완료'}
            />

            <Button
              type="button"
              ariaLabel="취소 버튼, 초기 화면으로 돌아갑니다"
              onClick={handleCancel}
              customClassName="bg-gray-500"
              text="취소"
            />
          </form>
        </div>
      </div>
    </main>
  );
}