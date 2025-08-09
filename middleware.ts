import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
    const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://*.kakao.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://*.kakao.com https://*.kakaocdn.net https://lh3.googleusercontent.com https://avatars.githubusercontent.com https://map1.daumcdn.net https://map2.daumcdn.net https://map3.daumcdn.net https://map4.daumcdn.net https://*.daumcdn.net;
    font-src 'self' https://fonts.gstatic.com;
    connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.kakao.com;
    object-src 'none';
    base-uri 'self';
    form-action 'self' https://*.kakao.com;
    frame-ancestors 'none';
    frame-src https://*.kakao.com;
    upgrade-insecure-requests;
  `;
    // 줄 바꿈 및 공백 제거
    const contentSecurityPolicyHeaderValue = cspHeader
        .replace(/\s{2,}/g, ' ')
        .trim();

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-nonce', nonce);
    requestHeaders.set(
        'Content-Security-Policy',
        contentSecurityPolicyHeaderValue,
    );

    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
    response.headers.set(
        'Content-Security-Policy',
        contentSecurityPolicyHeaderValue,
    );

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};