import { NextResponse } from 'next/server';

export async function GET() {
  const TEST_USER_EMAIL = process.env.NEXT_TEST_USER_EMAIL;
  const TEST_USER_PASSWORD = process.env.NEXT_TEST_USER_PASSWORD;

  if (!TEST_USER_EMAIL || !TEST_USER_PASSWORD) {
    return NextResponse.json(
      { error: '테스트 계정 정보를 찾을 수 없습니다.' },
      { status: 500 },
    );
  }

  return NextResponse.json({
    email: TEST_USER_EMAIL,
    password: TEST_USER_PASSWORD,
  });
}
