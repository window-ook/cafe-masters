'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createBrowserSupabaseClient } from 'utils/supabase/client';
import { useUserStore } from '@/stores';
import { CONSOLE_ERROR } from '@/utils/constants/messages';

interface IAuthProvider {
  accessToken: string | null;
  children: ReactNode;
}

// 로그인 필요: 수집한 카페 상세 페이지, 북마크 카페 상세 페이지
// 로그인 후 접근 불가: 로그인, 회원가입, 회원가입 리다이렉션, 비밀번호 재설정, 비밀번호 재설정 완료
const RULES = [
  { path: '/signin', requireAuth: false, blockIfAuth: true },
  { path: '/signup', requireAuth: false, blockIfAuth: true },
  { path: '/signup/confirm', requireAuth: false, blockIfAuth: true },
  { path: '/reset-password', requireAuth: false, blockIfAuth: true },
  { path: '/reset-password/complete', requireAuth: false, blockIfAuth: true },
  { path: '/collection/detail', requireAuth: true, blockIfAuth: false },
  { path: '/bookmark/detail', requireAuth: true, blockIfAuth: false },
];

const matchRule = (pathname: string) => RULES.find(rule => pathname === rule.path);

export default function AuthProvider({
  accessToken,
  children,
}: IAuthProvider) {
  const supabase = createBrowserSupabaseClient();
  const router = useRouter();
  const pathname = usePathname();

  // User store 액션들
  const { setUserId, setUserEmail, setAdmin, resetUser } = useUserStore();

  useEffect(() => {
    const {
      data: { subscription: authListner }, } = supabase.auth.onAuthStateChange(async (event, session) => {
        const rule = matchRule(pathname);

        // 비밀번호 재설정 플로우인지 확인 (URL 파라미터나 현재 경로로 판단)
        const isPasswordRecovery = event === 'PASSWORD_RECOVERY' ||
          pathname === '/reset-password' ||
          pathname === '/reset-password/complete' ||
          (typeof window !== 'undefined' && window.location.search.includes('type=recovery'));

        // 비밀번호 재설정 플로우인 경우 예외 처리
        if (isPasswordRecovery) {
          // recovery 상태일 때는 /reset-password로, 그 외에는 현재 경로 유지
          if (event === 'PASSWORD_RECOVERY' && pathname !== '/reset-password') router.replace('/reset-password');
          return;
        }

        // 🔥 핵심: 세션 상태에 따라 user store 동기화
        if (session?.user) {
          // 로그인된 경우: user store 업데이트
          setUserId(session.user.id);
          setUserEmail(session.user.email ?? '');

          // 관리자 권한 체크 (필요시)
          try {
            const { getIsAdmin } = await import('@/actions/supabase/user');
            const isAdmin = await getIsAdmin();
            if (isAdmin) setAdmin(true);
          } catch (error) {
            console.error(CONSOLE_ERROR.CHECK_ADMIN, error);
          }
        } else {
          // 로그아웃된 경우: user store 초기화
          resetUser();
        }

        // 라우팅 처리
        if (!session && rule?.requireAuth) router.replace('/signin');
        if (session && rule?.blockIfAuth) {
          router.replace('/main');
        }
      });

    return () => authListner.unsubscribe();
  }, [accessToken, supabase, router, pathname, setUserId, setUserEmail, setAdmin, resetUser]);

  return children;
}