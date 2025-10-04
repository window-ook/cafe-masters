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
      // 비밀번호 재설정 플로우인 경우
      if (type === 'recovery') return NextResponse.redirect(`${origin}/reset-password`);
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}