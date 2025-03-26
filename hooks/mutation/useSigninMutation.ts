import { createBrowserSupabaseClient } from 'utils/supabase/client';
import { useRouter } from 'next/navigation';
import { useUserStore } from 'utils/store';
import { useMapStore } from 'utils/store';
import { useMutation } from '@tanstack/react-query';
import { getAdminUser } from 'actions/userActions';

export function useSigninMutation() {
  const supabase = createBrowserSupabaseClient();

  const setUserId = useUserStore(state => state.setUserId);
  const setUserEmail = useUserStore(state => state.setUserEmail);
  const setAdmin = useUserStore(state => state.setAdmin);

  const router = useRouter();

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw new Error(error.message);
      return data.session;
    },

    onSuccess: async session => {
      // 유저 데이터 초기화 보장
      useUserStore.setState({
        userId: '',
        userEmail: '',
        userTier: 'BEGINNER',
        admin: false,
      });

      // 키워드 초기화
      useMapStore.setState({
        keyword: '',
      });

      const user = session?.user;
      if (!user) return;

      setUserId(user.id);
      setUserEmail(user.email ?? '');

      const isAdmin = await getAdminUser(user.id);
      if (isAdmin) setAdmin(true);

      await supabase.auth.refreshSession();
      router.replace('/cafe');
    },

    onError: error => {
      if (error) alert(error.message);
      else alert('서버에 에러가 발생했습니다.');
    },
  });
}
