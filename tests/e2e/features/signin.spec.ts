import { TEST_USER } from '@/tests/e2e/utils/constants';
import { test } from '@playwright/test';
import {
  navigateToSignInPage,
  fillCredentialsAndSubmit,
  verifySuccessfulLogin,
  testLoginWithNonExistentEmail,
  testLoginWithWrongPassword,
  testEmptyEmailValidation,
  testEmptyPasswordValidation,
  testAllFieldsEmptyValidation,
  testKakaoLoginButton,
  testSignUpNavigation,
  testPasswordResetButton,
  testPasswordVisibilityToggle,
} from '@/tests/e2e/utils/auth-helper';

test.describe('로그인 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await navigateToSignInPage(page);
  });

  test('시나리오 1: 로그인 성공', async ({ page }) => {
    await fillCredentialsAndSubmit(page, TEST_USER.EMAIL, TEST_USER.PASSWORD);
    await page.waitForLoadState('networkidle');
    await verifySuccessfulLogin(page);
  });

  test('시나리오 2-1: 로그인 실패 - 존재하지 않는 이메일', async ({ page }) => {
    await testLoginWithNonExistentEmail(page);
  });

  test('시나리오 2-2: 로그인 실패 - 잘못된 비밀번호', async ({ page }) => {
    await testLoginWithWrongPassword(page);
  });

  test('시나리오 3-1: 빈 이메일 필드 유효성 검사', async ({ page }) => {
    await testEmptyEmailValidation(page);
  });

  test('시나리오 3-2: 빈 비밀번호 필드 유효성 검사', async ({ page }) => {
    await testEmptyPasswordValidation(page);
  });

  test('시나리오 3-3: 모든 필드가 빈 상태에서 제출', async ({ page }) => {
    await testAllFieldsEmptyValidation(page);
  });

  test('시나리오 4: 카카오 로그인 페이지 리다이렉트', async ({ page }) => {
    await testKakaoLoginButton(page);
  });

  test('시나리오 5: 회원가입 페이지 네비게이션', async ({ page }) => {
    await testSignUpNavigation(page);
  });

  test('시나리오 6: 비밀번호 재설정 페이지 네비게이션', async ({ page }) => {
    await testPasswordResetButton(page);
  });

  test('시나리오 7: 비밀번호 토글 테스트', async ({ page }) => {
    await testPasswordVisibilityToggle(page);
  });
});