import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from 'utils/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code: string | null = searchParams.get('code');
  const type: string | null = searchParams.get('type');
  // if "next" is in param, use it as the redirect URL
  const next: string = searchParams.get('next') ?? '/main';

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // 비밀번호 재설정 플로우
      if (type === 'recovery') return NextResponse.redirect(`${origin}/reset-password`);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userData } = await supabase
          .from('user')
          .select('nickname, gender')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!userData?.nickname || !userData?.gender) {
          return NextResponse.redirect(`${origin}/onboarding/profile-setup`);
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}