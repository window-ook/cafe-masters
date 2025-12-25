'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateUserProfile } from '@/actions/supabase/user';
import { useUserStore } from '@/stores';
import { ProfileSetupData, profileSetupSchema } from '@/schema/setup';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import InputField from '@/components/shared/InputField';
import Button from '@/components/shared/Button';
import Logo from '../shared/sidebar/Logo';

export default function OnBoardingClient() {
    const router = useRouter();
    const userId = useUserStore(state => state.userId);
    const setUserNickname = useUserStore(state => state.setUserNickname);
    const setUserGender = useUserStore(state => state.setUserGender);

    const [isSubmitting, setIsSubmitting] = useState(false);

    const profileForm = useForm<ProfileSetupData>({
        resolver: zodResolver(profileSetupSchema),
        defaultValues: {
            nickname: '',
            gender: undefined,
        },
    });

    const onSubmit = async (data: ProfileSetupData) => {
        if (!userId) {
            toast.error('유저 정보를 찾을 수 없습니다.');
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await updateUserProfile({
                user_id: userId,
                nickname: data.nickname,
                gender: data.gender,
            });

            if (result.success) {
                setUserNickname(data.nickname);
                setUserGender(data.gender);
                toast.success('프로필이 설정되었습니다!');
                router.push('/main');
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error('프로필 설정 중 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen mx-auto flex flex-col items-center justify-center p-2 gap-2">
            <Logo />
            <div className="auth-glass-card w-full max-w-screen-sm">
                <form
                    className="w-full max-w-sm sm:max-w-md mx-auto flex flex-col gap-4"
                    onSubmit={profileForm.handleSubmit(onSubmit)}
                >
                    <div className="mb-4">
                        <h1 className="auth-form-title">프로필 설정</h1>
                        <p className="text-sm text-gray-600 mt-2">
                            서비스 이용을 위해 프로필 정보를 입력해주세요
                        </p>
                    </div>

                    <Controller
                        name="nickname"
                        control={profileForm.control}
                        render={({ field }) => (
                            <InputField
                                {...field}
                                id="nickname"
                                type="text"
                                label="닉네임"
                                placeholder="2-10자, 한글/영문/숫자"
                                disabled={isSubmitting}
                                isError={profileForm.formState.errors.nickname?.message}
                                data-testid="nickname-input"
                            />
                        )}
                    />

                    <div className="flex flex-col gap-2">
                        <label htmlFor="gender" className="text-sm font-semibold">
                            성별
                        </label>
                        <Controller
                            name="gender"
                            control={profileForm.control}
                            render={({ field }) => (
                                <div className="flex gap-4">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            value="male"
                                            checked={field.value === 'male'}
                                            onChange={() => field.onChange('male')}
                                            disabled={isSubmitting}
                                            className="w-4 h-4 cursor-pointer"
                                        />
                                        <span>남성</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            value="female"
                                            checked={field.value === 'female'}
                                            onChange={() => field.onChange('female')}
                                            disabled={isSubmitting}
                                            className="w-4 h-4 cursor-pointer"
                                        />
                                        <span>여성</span>
                                    </label>
                                </div>
                            )}
                        />
                        {profileForm.formState.errors.gender && (
                            <p className="text-sm text-red-500">
                                {profileForm.formState.errors.gender.message}
                            </p>
                        )}
                    </div>

                    <Button
                        type="submit"
                        aria-label="프로필 설정 완료 버튼"
                        disabled={isSubmitting}
                        customClassName="bg-main mt-4"
                        text={isSubmitting ? '설정 중...' : '완료'}
                        data-testid="button-submit-profile-setup"
                    />
                </form>
            </div>
        </div>
    );
}
