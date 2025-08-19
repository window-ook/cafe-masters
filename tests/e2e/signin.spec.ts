import { test, expect } from '@playwright/test';

test.describe('로그인 기능 테스트', () => {
  const TEST_EMAIL = 'demouser@test.com';
  const TEST_PASSWORD = '1234uio!';
  const BASE_URL = 'http://localhost:3000';

  test.beforeEach(async ({ page }) => {
    // 각 테스트 전에 로그인 페이지로 이동
    await page.goto(`${BASE_URL}/signin`);

    // 페이지 로드 대기
    await page.waitForLoadState('networkidle');

    // 로그인 폼이 로드되었는지 확인
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('시나리오 1: 정상 이메일 로그인 성공', async ({ page }) => {
    // 테스트 계정으로 로그인 시도
    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[type="password"]', TEST_PASSWORD);

    // "접속하기" 버튼 클릭
    await page.click('button[type="submit"]:has-text("접속하기")');

    // 로그인 처리 대기
    await page.waitForLoadState('networkidle');

    // 성공 시 메인 페이지로 리다이렉트 확인
    await expect(page).toHaveURL(/\/main|\/$/);

    // 로그인 상태 확인 - 사이드바 또는 네비게이션에서 로그인 상태 변경 확인
    // 실제 애플리케이션의 로그인 후 상태에 따라 조정 필요
    const isLoggedIn = await page.locator('text=로그아웃').isVisible() ||
      await page.locator('[data-testid="user-menu"]').isVisible() ||
      await page.locator('text=마이페이지').isVisible();

    expect(isLoggedIn).toBe(true);
  });

  test('시나리오 2-1: 존재하지 않는 이메일로 로그인 실패', async ({ page }) => {
    // 존재하지 않는 이메일로 로그인 시도
    await page.fill('input[type="email"]', 'nonexistent@test.com');
    await page.fill('input[type="password"]', TEST_PASSWORD);

    // alert 대화상자 처리를 위한 핸들러 설정
    let alertMessage = '';
    page.on('dialog', async (dialog) => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    await page.click('button[type="submit"]:has-text("접속하기")');

    // alert 메시지가 표시되기까지 대기
    await page.waitForTimeout(2000);

    // 에러 메시지 확인 (한국어 에러 메시지)
    expect(alertMessage).toContain('이메일 또는 비밀번호가 올바르지 않습니다');

    // 로그인 페이지에 그대로 있는지 확인
    await expect(page).toHaveURL(/\/signin/);

    // 폼 입력값이 유지되는지 확인
    await expect(page.locator('input[type="email"]')).toHaveValue('nonexistent@test.com');
  });

  test('시나리오 2-2: 잘못된 비밀번호로 로그인 실패', async ({ page }) => {
    // 올바른 이메일, 잘못된 비밀번호로 로그인 시도
    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.fill('input[type="password"]', 'wrongpassword');

    // alert 대화상자 처리를 위한 핸들러 설정
    let alertMessage = '';
    page.on('dialog', async (dialog) => {
      alertMessage = dialog.message();
      await dialog.accept();
    });

    await page.click('button[type="submit"]:has-text("접속하기")');

    // alert 메시지가 표시되기까지 대기
    await page.waitForTimeout(2000);

    // 에러 메시지 확인 (한국어 에러 메시지)
    expect(alertMessage).toContain('이메일 또는 비밀번호가 올바르지 않습니다');

    // 로그인 페이지에 그대로 있는지 확인
    await expect(page).toHaveURL(/\/signin/);

    // 이메일 입력값이 유지되는지 확인
    await expect(page.locator('input[type="email"]')).toHaveValue(TEST_EMAIL);
  });

  test('시나리오 3-1: 빈 이메일 필드 유효성 검사', async ({ page }) => {
    // 이메일을 비우고 비밀번호만 입력
    await page.fill('input[type="password"]', TEST_PASSWORD);

    await page.click('button[type="submit"]:has-text("접속하기")');

    // React Hook Form + Zod 유효성 검사 에러 메시지 확인
    const emailErrorMessage = page.locator('p.text-red-600:has-text("이메일을 입력해주세요")');
    await expect(emailErrorMessage).toBeVisible({ timeout: 3000 });

    // 로그인 페이지에 그대로 있는지 확인
    await expect(page).toHaveURL(/\/signin/);
  });

  test('시나리오 3-2: 빈 비밀번호 필드 유효성 검사', async ({ page }) => {
    // 이메일만 입력하고 비밀번호를 비움
    await page.fill('input[type="email"]', TEST_EMAIL);

    await page.click('button[type="submit"]:has-text("접속하기")');

    // React Hook Form + Zod 유효성 검사 에러 메시지 확인
    const passwordErrorMessage = page.locator('p.text-red-600:has-text("비밀번호는 최소 6자 이상 입력해야 합니다")');
    await expect(passwordErrorMessage).toBeVisible({ timeout: 3000 });

    // 로그인 페이지에 그대로 있는지 확인
    await expect(page).toHaveURL(/\/signin/);
  });

  test('시나리오 3-3: 모든 필드가 빈 상태에서 제출', async ({ page }) => {
    // 모든 필드를 비운 상태에서 제출
    await page.click('button[type="submit"]:has-text("접속하기")');

    // 이메일 필드 유효성 검사 에러 메시지 확인 (먼저 나타나는 에러)
    const emailErrorMessage = page.locator('p.text-red-600:has-text("이메일을 입력해주세요")');
    await expect(emailErrorMessage).toBeVisible({ timeout: 3000 });

    // 로그인 페이지에 그대로 있는지 확인
    await expect(page).toHaveURL(/\/signin/);
  });

  test('시나리오 4: 카카오 로그인 버튼 존재 및 클릭 테스트', async ({ page }) => {
    // 카카오 로그인 버튼이 존재하는지 확인
    const kakaoButton = page.locator('button:has-text("카카오 로그인")');
    await expect(kakaoButton).toBeVisible();

    // 버튼 스타일 확인 (노란색 배경)
    await expect(kakaoButton).toHaveClass(/bg-yellow-500/);

    // 카카오 로그인 버튼 클릭 기능만 테스트 (로컬 개발 환경 고려)
    // 실제 인증 프로세스는 OAuth 설정에 따라 다르므로 버튼 클릭만 확인
    await kakaoButton.click();

    // 버튼 클릭 후 짧은 대기 (리다이렉트 시도 확인)
    await page.waitForTimeout(2000);

    // 현재 URL 상태 확인
    const currentUrl = page.url();
    console.log('카카오 로그인 버튼 테스트 완료:', currentUrl);
  });

  test('시나리오 5: 회원가입 페이지 네비게이션', async ({ page }) => {
    // 회원가입 링크가 존재하는지 확인
    const signupLink = page.locator('a:has-text("회원가입")');
    await expect(signupLink).toBeVisible();

    // 회원가입 링크 클릭
    await signupLink.click();

    // 회원가입 페이지로 이동했는지 확인
    await expect(page).toHaveURL(/\/signup/);

    // 페이지 로드 대기 및 회원가입 페이지 요소 확인
    await page.waitForLoadState('networkidle');

    // 회원가입 폼이나 관련 텍스트가 표시되는지 확인
    const signupPageVisible = await page.locator('text=회원가입').first().isVisible();
    expect(signupPageVisible).toBe(true);
  });

  test('시나리오 6: 비밀번호 재설정 버튼 테스트', async ({ page }) => {
    // 비밀번호 재설정 버튼이 존재하는지 확인
    const resetButton = page.locator('button:has-text("비밀번호 재설정")');
    await expect(resetButton).toBeVisible();

    // 버튼 클릭
    await resetButton.click();

    // 비밀번호 재설정 폼으로 상태 변경 확인
    await page.waitForTimeout(1000);

    // 비밀번호 재설정 관련 텍스트 확인
    const resetFormVisible = await page.locator('text=비밀번호 재설정').isVisible();
    expect(resetFormVisible).toBe(true);

    // 로그인 화면으로 돌아가기 버튼 확인
    const backButton = page.locator('button:has-text("로그인 화면으로 돌아가기")');
    await expect(backButton).toBeVisible();
  });

  test('시나리오 7: 폼 입력 UX 테스트', async ({ page }) => {
    // 이메일 입력 필드 포커스 테스트
    await page.click('input[type="email"]');
    await expect(page.locator('input[type="email"]')).toBeFocused();

    // 이메일 입력 후 Tab 키로 비밀번호 필드로 이동
    await page.fill('input[type="email"]', TEST_EMAIL);
    await page.press('input[type="email"]', 'Tab');
    await expect(page.locator('input[type="password"]')).toBeFocused();

    // 비밀번호 입력 후 Enter 키로 폼 제출
    await page.fill('input[type="password"]', TEST_PASSWORD);
    await page.press('input[type="password"]', 'Enter');

    // 로그인 처리 대기
    await page.waitForLoadState('networkidle');

    // 성공 시 페이지 이동 확인
    await expect(page).toHaveURL(/\/main|\/$/);
  });

  test('시나리오 8: 비밀번호 가시성 토글 테스트', async ({ page }) => {
    // 비밀번호 입력
    await page.fill('input[type="password"]', 'testpassword');

    // 비밀번호 필드가 password 타입인지 확인
    await expect(page.locator('input[type="password"]')).toHaveAttribute('type', 'password');

    // 비밀번호 보기/숨김 버튼 찾기 및 클릭
    const toggleButton = page.locator('button:has(img[alt*="비밀번호"])');
    if (await toggleButton.isVisible()) {
      await toggleButton.click();

      // 타입이 text로 변경되었는지 확인
      const passwordInput = page.locator('input[name="password"]');
      await expect(passwordInput).toHaveAttribute('type', 'text');

      // 다시 클릭하여 숨김 상태로 되돌리기
      await toggleButton.click();
      await expect(passwordInput).toHaveAttribute('type', 'password');
    }
  });
});