'use client';

import { useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from '@/utils/supabase/client';
import Button from '@/components/shared/Button';
import Logo from '@/components/shared/sidebar/Logo';

export default function ResetPasswordCompleteForm() {
    const supabase = createBrowserSupabaseClient();
    const router = useRouter();

    const handleGoToMain = async () => {
        await supabase.auth.signOut();
        router.push('/signin');
    };

    return (
        <main className="area h-screen w-screen flex justify-center items-center">
            <div className="flex flex-col items-center gap-8 px-6">
                <div className='flex items-center gap-1'>
                    <Logo />
                </div>
                <div className="auth-glass-card">
                    <div className="w-80 max-w-(--breakpoint-lg) sm:w-96 flex flex-col gap-6">
                        <div className="text-center">
                            <div className="size-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg
                                    className="size-8 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    aria-hidden="true"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                비밀번호 재설정 완료!
                            </h2>
                            <p className="text-gray-600 leading-relaxed">
                                새로운 비밀번호로 재설정이 완료되었습니다.<br />
                                로그인 페이지에서 새 비밀번호로 로그인해주세요.
                            </p>
                        </div>

                        <Button
                            type="button"
                            ariaLabel="로그인 페이지로 이동"
                            onClick={handleGoToMain}
                            text="로그인하러 가기"
                            customClassName="w-full bg-main hover:bg-main/90"
                        />
                    </div>
                </div>
            </div>
        </main>
    );
} 