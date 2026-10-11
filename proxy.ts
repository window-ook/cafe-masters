import { NextRequest, NextResponse } from 'next/server';
import { createMiddlewareSupabaseClient } from '@/utils/supabase/middleware';

const AUTH_ROUTES = {
    RECOVERY_ROUTES: ['/reset-password', '/reset-password/complete'],
    REQUIRE_AUTH: ['/collection/detail', '/bookmark/detail'],
    BLOCK_IF_AUTH: ['/signin', '/signup', '/signup/confirm', '/reset-password', '/reset-password/complete'],
    REQUIRE_PROFILE: ['/main', '/search', '/collection', '/bookmark', '/recommendation'],
};

export async function proxy(request: NextRequest) {
    const { pathname, searchParams } = new URL(request.url);

    // LAN IP로 붙는 dev(실기기 확인)는 https가 없어 승격하면 CSS·JS가 전부 실패합니다. localhost는 //로 시작하는 외부 스크립트를 https로 올려야 하므로 유지합니다
    const isLanDev = process.env.NODE_ENV !== 'production' && !/^(localhost|127\.0\.0\.1)(:\d+)?$/.test(request.headers.get('host') ?? '');

    const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
    const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.kakao.com https://dapi.kakao.com https://t1.daumcdn.net https://*.vercel.live https://vercel.live https://*.vercel-scripts.com https://static.cloudflareinsights.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://*.kakao.com https://*.kakaocdn.net https://lh3.googleusercontent.com https://avatars.githubusercontent.com https://t1.daumcdn.net https://mts.daumcdn.net https://*.supabase.co;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' blob: https://*.supabase.co https://*.kakao.com https://dapi.kakao.com https://*.vercel.live https://vercel.live https://cloudflareinsights.com https://*.cloudflareinsights.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self' https://*.kakao.com;
    frame-ancestors 'none';
    frame-src https://*.vercel.live https://vercel.live https://*.kakao.com;
    ${isLanDev ? '' : 'upgrade-insecure-requests;'}`;

    const contentSecurityPolicyHeaderValue = cspHeader.replace(/\s{2,}/g, ' ').trim();

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-nonce', nonce);
    requestHeaders.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);

    const response = NextResponse.next({ request: { headers: requestHeaders } });
    response.headers.set('Content-Security-Policy', contentSecurityPolicyHeaderValue);

    const supabase = createMiddlewareSupabaseClient(request, response);
    const { data: { user } } = await supabase.auth.getUser();

    const isRecoveryFlow = AUTH_ROUTES.RECOVERY_ROUTES.some(route => pathname.startsWith(route)) || searchParams.get('type') === 'recovery';
    if (isRecoveryFlow) return response;

    const requiresAuth = AUTH_ROUTES.REQUIRE_AUTH.some(route => pathname.startsWith(route));
    if (requiresAuth && !user) return NextResponse.redirect(new URL('/signin', request.url));

    const blockIfAuth = AUTH_ROUTES.BLOCK_IF_AUTH.some(route => pathname.startsWith(route));
    if (blockIfAuth && user) return NextResponse.redirect(new URL('/main', request.url));

    const requiresProfile = AUTH_ROUTES.REQUIRE_PROFILE.some(route => pathname.startsWith(route));
    const isOnboardingPage = pathname.startsWith('/onboarding');

    if (requiresProfile && user && !isOnboardingPage) {
        const { data: userData } = await supabase
            .from('user')
            .select('nickname, gender')
            .eq('user_id', user.id)
            .maybeSingle();

        if (!userData?.nickname || !userData?.gender) {
            return NextResponse.redirect(new URL('/onboarding/profile-setup', request.url));
        }
    }

    return response;
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)$).*)',
    ],
};