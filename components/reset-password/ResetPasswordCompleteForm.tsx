'use client';

import { createBrowserSupabaseClient } from '@/utils/supabase/client';
import BackgroundCards from '@/components/shared/FallingCards';
import Button from '../shared/Button';

export default function ResetPasswordCompleteForm() {
    const supabase = createBrowserSupabaseClient();

    const handleWindow = async () => {
        await supabase.auth.signOut();
        window.close();
    };

    return (
        <main className="area h-screen w-screen flex justify-center items-center">
            <BackgroundCards />
            <div className="flex flex-col items-center gap-4">
                <span className="text-3xl text-white text-shadow-black font-bold">
                    Cafe Masters
                </span>
                <div className="z-10 p-5 rounded-xl bg-white shadow-main-shadow">
                    <div className="w-80 max-w-(--breakpoint-lg) sm:w-96 flex flex-col gap-4">
                        <p className="text-center text-3xl font-bold ">
                            비밀번호 재설정 완료
                        </p>
                        <span className="text-lg ">
                            초기 화면으로 돌아가 다시 로그인하세요!
                        </span>
                        <Button
                            type="button"
                            aria-label="돌아가기 버튼, 초기 화면으로 돌아갑니다."
                            onClick={handleWindow}
                            text='돌아가기'
                            customClassName='w-full'
                        />
                    </div>
                </div>
            </div>
        </main>
    );
} 