import { createBrowserSupabaseClient } from 'utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useUserStore, useFilterStore } from '@/stores';
import { useMutation } from '@tanstack/react-query';
import { getAdminUser } from '@/actions/supabase/user';

export function useSignIn() {
  const supabase = createBrowserSupabaseClient();
  const router = useRouter();

  const { setUserId, setUserEmail, setAdmin } = useUserStore();

  const signIn = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) throw new Error(error.message);
      return data.session;
    },

    onSuccess: async session => {
      // 유저 데이터 초기화
      useUserStore.setState({
        userId: '',
        userEmail: '',
        userTier: 'BEGINNER',
        admin: false,
      });

      // 키워드 초기화
      useFilterStore.setState({ keyword: '' });

      const user = session?.user;
      if (!user) return;

      // 유저 ID, 이메일 동기화
      setUserId(user.id);
      setUserEmail(user.email ?? '');

      // 관리자 여부 체크
      const isAdmin = await getAdminUser(user.id);
      if (isAdmin) setAdmin(true);

      // 세션 새로고침
      await supabase.auth.refreshSession();
      router.replace('/cafe');
    },

    onError: error => {
      if (error) alert(error.message);
      else alert('서버에 에러가 발생했습니다.');
    },
  });

  return { signIn: signIn.mutate, isPending: signIn.isPending };
}