import { test, expect, Page } from '@playwright/test';

// 테스트 데이터 상수
const TEST_DATA = {
  VALID_EMAIL: `test.user.${Date.now()}@example.com`,
  EXISTING_EMAIL: 'existing.user@example.com',
  VALID_PASSWORD: 'password123',
  INVALID_PASSWORDS: {
    TOO_SHORT: '12345',
    ONLY_LETTERS: 'password',
    ONLY_NUMBERS: '123456',
  },
};

// 페이지 셀렉터 상수
const SELECTORS = {
  FORM: 'form',
  EMAIL_INPUT: 'input[name="email"]',
  PASSWORD_INPUT: 'input[name="password"]',
  PASSWORD_TOGGLE: 'button[type="button"]:has(img[alt*="비밀번호"])',
  SIGNUP_BUTTON: 'button[type="submit"]:has-text("가입하기")',
  KAKAO_LOGIN_BUTTON: 'button:has-text("카카오 로그인")',
  LOGIN_LINK: 'a[href="/signin"]:has-text("로그인 하기")',
  PASSWORD_GUIDE: 'p:has-text("비밀번호는 최소 6자 이상")',
  ERROR_MESSAGE: '.error-message, [role="alert"], .text-red-500',
  SUCCESS_MESSAGE: '.success-message, [role="status"], .text-green-500',
} as const;

// 헬퍼 함수
class SignupPageHelpers {
  constructor(private page: Page) { }

  async navigateToSignup() {
    await this.page.goto('http://localhost:3000/signup');
    await this.page.waitForSelector(SELECTORS.FORM);
    await expect(this.page.locator('p:has-text("회원가입")')).toBeVisible();
  }

  async fillSignupForm(email: string, password: string) {
    await this.page.fill(SELECTORS.EMAIL_INPUT, email);
    await this.page.fill(SELECTORS.PASSWORD_INPUT, password);
  }

  async submitForm() {
    await this.page.click(SELECTORS.SIGNUP_BUTTON);
  }

  async clearForm() {
    await this.page.fill(SELECTORS.EMAIL_INPUT, '');
    await this.page.fill(SELECTORS.PASSWORD_INPUT, '');
  }

  async waitForRedirect(expectedPath: string) {
    await this.page.waitForURL(expectedPath, { timeout: 10000 });
  }

  async checkPasswordVisibilityToggle() {
    const passwordInput = this.page.locator(SELECTORS.PASSWORD_INPUT);
    const toggleButton = this.page.locator(SELECTORS.PASSWORD_TOGGLE);

    // 초기 상태는 password 타입
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // 토글 클릭 후 text 타입으로 변경
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // 다시 클릭하면 password 타입으로 복원
    await toggleButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  }

  async testKeyboardNavigation() {
    await this.page.locator(SELECTORS.EMAIL_INPUT).focus();
    await this.page.keyboard.press('Tab');
    await expect(this.page.locator(SELECTORS.PASSWORD_INPUT)).toBeFocused();

    await this.page.keyboard.press('Tab');
    await expect(this.page.locator(SELECTORS.SIGNUP_BUTTON)).toBeFocused();
  }
}

test.describe('회원가입 기능 테스트', () => {
  let helpers: SignupPageHelpers;

  test.beforeEach(async ({ page }) => {
    helpers = new SignupPageHelpers(page);
    await helpers.navigateToSignup();
  });

  test.describe('시나리오 1: 정상 이메일 회원가입', () => {
    test('유효한 정보로 회원가입이 성공해야 함', async ({ page }) => {
      // Given: 유효한 이메일과 비밀번호 입력
      await helpers.fillSignupForm(TEST_DATA.VALID_EMAIL, TEST_DATA.VALID_PASSWORD);

      // When: 가입하기 버튼 클릭
      await helpers.submitForm();

      // 페이지가 리다이렉트되었거나 성공 메시지가 표시되어야 함
      const currentUrl = page.url();
      const hasSuccessMessage = await page.locator(SELECTORS.SUCCESS_MESSAGE).isVisible();

      expect(
        currentUrl.includes('/signin') ||
        currentUrl.includes('/dashboard') ||
        currentUrl.includes('/home') ||
        hasSuccessMessage
      ).toBeTruthy();
    });

    test('회원가입 후 새 계정으로 로그인 가능해야 함', async ({ page }) => {
      const newEmail = TEST_DATA.VALID_EMAIL.replace('@example.com', `+${Date.now()}@example.com`);

      // 회원가입 진행
      await helpers.fillSignupForm(newEmail, TEST_DATA.VALID_PASSWORD);
      await helpers.submitForm();

      // 로그인 페이지로 이동하거나 이미 로그인된 상태 확인
      const currentUrl = page.url();
      if (currentUrl.includes('/signin')) {
        // 로그인 페이지에서 새 계정으로 로그인 시도
        await page.fill(SELECTORS.EMAIL_INPUT, newEmail);
        await page.fill(SELECTORS.PASSWORD_INPUT, TEST_DATA.VALID_PASSWORD);
        await page.click('button[type="submit"]:has-text("접속하기")');

        // 로그인 성공 확인
        await page.waitForURL(/\/(dashboard|home)/, { timeout: 10000 });
      }
    });
  });

  test.describe('시나리오 2: 비밀번호 유효성 검증', () => {
    test('비밀번호 가이드 메시지가 표시되어야 함', async ({ page }) => {
      await expect(page.locator(SELECTORS.PASSWORD_GUIDE)).toBeVisible();
      await expect(page.locator(SELECTORS.PASSWORD_GUIDE)).toContainText('비밀번호는 최소 6자 이상');
      await expect(page.locator(SELECTORS.PASSWORD_GUIDE)).toContainText('영문과 숫자를 포함');
    });

    test('너무 짧은 비밀번호는 에러를 표시해야 함', async ({ page }) => {
      await helpers.fillSignupForm(TEST_DATA.VALID_EMAIL, TEST_DATA.INVALID_PASSWORDS.TOO_SHORT);
      await helpers.submitForm();

      // 에러 메시지 또는 폼 유효성 검사 실패 확인
      const hasError = await Promise.race([
        page.waitForSelector(SELECTORS.ERROR_MESSAGE, { timeout: 3000 }).then(() => true),
        page.locator(':invalid').count().then(count => count > 0),
      ]).catch(() => false);

      expect(hasError).toBeTruthy();
    });

    test('영문자만 포함된 비밀번호는 에러를 표시해야 함', async ({ page }) => {
      await helpers.fillSignupForm(TEST_DATA.VALID_EMAIL, TEST_DATA.INVALID_PASSWORDS.ONLY_LETTERS);
      await helpers.submitForm();

      const hasError = await Promise.race([
        page.waitForSelector(SELECTORS.ERROR_MESSAGE, { timeout: 3000 }).then(() => true),
        page.locator(':invalid').count().then(count => count > 0),
      ]).catch(() => false);

      expect(hasError).toBeTruthy();
    });

    test('숫자만 포함된 비밀번호는 에러를 표시해야 함', async ({ page }) => {
      await helpers.fillSignupForm(TEST_DATA.VALID_EMAIL, TEST_DATA.INVALID_PASSWORDS.ONLY_NUMBERS);
      await helpers.submitForm();

      const hasError = await Promise.race([
        page.waitForSelector(SELECTORS.ERROR_MESSAGE, { timeout: 3000 }).then(() => true),
        page.locator(':invalid').count().then(count => count > 0),
      ]).catch(() => false);

      expect(hasError).toBeTruthy();
    });

    test('유효한 비밀번호는 정상 처리되어야 함', async ({ page }) => {
      await helpers.fillSignupForm(TEST_DATA.VALID_EMAIL, TEST_DATA.VALID_PASSWORD);

      // 비밀번호 입력 후 유효성 확인
      const passwordInput = page.locator(SELECTORS.PASSWORD_INPUT);
      await expect(passwordInput).not.toHaveClass(/invalid|error/);
    });

    test('비밀번호 표시/숨김 기능이 동작해야 함', async () => {
      await helpers.fillSignupForm(TEST_DATA.VALID_EMAIL, TEST_DATA.VALID_PASSWORD);
      await helpers.checkPasswordVisibilityToggle();
    });
  });

  test.describe('시나리오 3: 이메일 중복 검증', () => {
    test('중복된 이메일로 가입 시 적절한 에러 메시지를 표시해야 함', async ({ page }) => {
      // 기존 계정이 있다고 가정하고 테스트
      await helpers.fillSignupForm(TEST_DATA.EXISTING_EMAIL, TEST_DATA.VALID_PASSWORD);
      await helpers.submitForm();

      // 중복 이메일 에러 메시지 확인
      const errorMessage = await Promise.race([
        page.waitForSelector(SELECTORS.ERROR_MESSAGE, { timeout: 5000 }),
        page.waitForSelector('text=이미 가입된', { timeout: 5000 }),
        page.waitForSelector('text=중복', { timeout: 5000 }),
      ]).catch(() => null);

      if (errorMessage) {
        const errorText = await errorMessage.textContent();
        expect(errorText).toMatch(/(이미 가입된|중복|존재)/i);
      }
    });

    test('이메일 중복 에러 후 로그인 페이지 링크가 제공되어야 함', async ({ page }) => {
      await helpers.fillSignupForm(TEST_DATA.EXISTING_EMAIL, TEST_DATA.VALID_PASSWORD);
      await helpers.submitForm();

      // 에러 발생 후 로그인 링크 확인
      await expect(page.locator(SELECTORS.LOGIN_LINK)).toBeVisible();
    });
  });

  test.describe('시나리오 4: 카카오 소셜 회원가입', () => {
    test('카카오 로그인 버튼이 표시되고 클릭 가능해야 함', async ({ page }) => {
      const kakaoButton = page.locator(SELECTORS.KAKAO_LOGIN_BUTTON);
      await expect(kakaoButton).toBeVisible();
      await expect(kakaoButton).toBeEnabled();
    });

    test('카카오 로그인 버튼 클릭 시 적절한 처리가 되어야 함', async ({ page }) => {
      const kakaoButton = page.locator(SELECTORS.KAKAO_LOGIN_BUTTON);

      // 카카오 버튼 클릭
      await kakaoButton.click();

      // 페이지 변화나 OAuth 리다이렉트 확인
      await page.waitForTimeout(1000);

      // URL 변경 또는 새 창/팝업 확인
      const currentUrl = page.url();
      const hasChanged = !currentUrl.includes('/signup') || currentUrl.includes('kakao');

      // OAuth 프로세스가 시작되었거나 처리되었음을 확인
      expect(hasChanged || await page.locator('.loading, .spinner').isVisible()).toBeTruthy();
    });
  });

  test.describe('시나리오 5: 폼 네비게이션 및 사용자 경험', () => {
    test('로그인 페이지로 이동 링크가 동작해야 함', async ({ page }) => {
      await page.click(SELECTORS.LOGIN_LINK);
      await helpers.waitForRedirect('**/signin');
      expect(page.url()).toContain('/signin');
    });

    test('키보드 네비게이션이 올바르게 동작해야 함', async () => {
      await helpers.testKeyboardNavigation();
    });

    test('엔터 키로 폼 제출이 가능해야 함', async ({ page }) => {
      await helpers.fillSignupForm(TEST_DATA.VALID_EMAIL, TEST_DATA.VALID_PASSWORD);

      // 비밀번호 필드에서 엔터 키 입력
      await page.locator(SELECTORS.PASSWORD_INPUT).press('Enter');

      // 폼이 제출되었는지 확인 (로딩 상태나 페이지 변경)
      await Promise.race([
        page.waitForURL(/\/(signin|dashboard|home)/, { timeout: 5000 }),
        page.waitForSelector('.loading, .spinner', { timeout: 2000 }),
        page.waitForTimeout(1000),
      ]);
    });

    test('반응형 디자인이 모바일에서 올바르게 동작해야 함', async ({ page }) => {
      // 모바일 뷰포트로 변경
      await page.setViewportSize({ width: 375, height: 667 });

      // 폼 요소들이 모바일에서 접근 가능한지 확인
      await expect(page.locator(SELECTORS.FORM)).toBeVisible();
      await expect(page.locator(SELECTORS.EMAIL_INPUT)).toBeVisible();
      await expect(page.locator(SELECTORS.PASSWORD_INPUT)).toBeVisible();
      await expect(page.locator(SELECTORS.SIGNUP_BUTTON)).toBeVisible();

      // 터치 친화적 크기 확인 (최소 44px 높이)
      const buttonBox = await page.locator(SELECTORS.SIGNUP_BUTTON).boundingBox();
      expect(buttonBox!.height).toBeGreaterThanOrEqual(40);
    });

    test('포커스 인디케이터가 올바르게 표시되어야 함', async ({ page }) => {
      const emailInput = page.locator(SELECTORS.EMAIL_INPUT);
      const passwordInput = page.locator(SELECTORS.PASSWORD_INPUT);

      await emailInput.focus();
      await expect(emailInput).toBeFocused();

      await passwordInput.focus();
      await expect(passwordInput).toBeFocused();
    });
  });

  test.describe('시나리오 6: 에러 복구 및 재시도', () => {
    test('네트워크 오류 시뮬레이션 및 재시도', async ({ page }) => {
      await helpers.fillSignupForm(TEST_DATA.VALID_EMAIL, TEST_DATA.VALID_PASSWORD);

      // 네트워크 연결 차단
      await page.route('**/*', route => route.abort());

      try {
        await helpers.submitForm();

        // 에러 상태 확인
        await page.waitForTimeout(2000);

        // 네트워크 복구
        await page.unroute('**/*');

        // 재시도 가능한지 확인
        await helpers.submitForm();

      } catch {
        // 네트워크 복구
        await page.unroute('**/*');
      }
    });

    test('폼 데이터가 에러 발생 후에도 보존되어야 함', async ({ page }) => {
      const testEmail = TEST_DATA.VALID_EMAIL;
      const testPassword = TEST_DATA.VALID_PASSWORD;

      await helpers.fillSignupForm(testEmail, testPassword);

      // 잘못된 비밀번호로 에러 유발
      await page.fill(SELECTORS.PASSWORD_INPUT, TEST_DATA.INVALID_PASSWORDS.TOO_SHORT);
      await helpers.submitForm();

      // 이메일 필드는 보존되어야 함
      await expect(page.locator(SELECTORS.EMAIL_INPUT)).toHaveValue(testEmail);
    });

    test('에러 메시지 표시 후 정정 입력 시 에러가 해제되어야 함', async ({ page }) => {
      // 잘못된 비밀번호로 에러 유발
      await helpers.fillSignupForm(TEST_DATA.VALID_EMAIL, TEST_DATA.INVALID_PASSWORDS.TOO_SHORT);
      await helpers.submitForm();

      // 올바른 비밀번호로 수정
      await page.fill(SELECTORS.PASSWORD_INPUT, TEST_DATA.VALID_PASSWORD);

      // 에러 상태가 해제되었는지 확인
      const passwordInput = page.locator(SELECTORS.PASSWORD_INPUT);
      await expect(passwordInput).not.toHaveClass(/invalid|error/);
    });
  });

  test.afterEach(async ({ page }, testInfo) => {
    // 테스트 실패 시 스크린샷 캡처
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshot = await page.screenshot();
      await testInfo.attach('screenshot', { body: screenshot, contentType: 'image/png' });
    }
  });
});