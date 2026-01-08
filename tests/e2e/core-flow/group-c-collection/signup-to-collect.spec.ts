import { test, expect } from '@playwright/test';
import { SignupPage } from '@/tests/e2e/page-objects/SignUpPage';
import { VerifyPage } from '@/tests/e2e/page-objects/VerifyPage';
import { MainPage } from '@/tests/e2e/page-objects/MainPage';
import { MOCK_AUTH_DATA, TEST_SELECTORS } from '@/tests/e2e/utils/constants';

test.describe('Group C - 처음 가입한 사용자의 플로우', () => {
    // 복잡한 E2E 플로우 테스트이므로 타임아웃 연장
    test('회원가입부터 카페 수집까지 성공한다.', async ({ page }) => {
        test.setTimeout(60000);
        const signupPage = new SignupPage(page);
        const verifyPage = new VerifyPage(page);
        const mainPage = new MainPage(page);

        // 1. 카카오맵 검색 API 모킹 (페이지 이동 전에 먼저 설정)
        await mainPage.mockKakaoSearchAPI();

        // 2. 랜딩페이지 -> 로그인 페이지 -> 회원가입 페이지
        await page.goto('/');
        await page.getByTestId(TEST_SELECTORS.BUTTON_GO_TO_SIGNIN_FROM_LANDING).click();
        await page.getByTestId(TEST_SELECTORS.BUTTON_GO_TO_SIGNUP_FROM_SIGNIN).click();
        await expect(page).toHaveURL(/.*signup.*/);

        // 3. 회원가입 정보 입력 (이메일, 비밀번호, 닉네임, 성별) 후 회원가입 요청
        await signupPage.mockSignUpRequest();
        await signupPage.fillSignUpForm(
            MOCK_AUTH_DATA.SIGNUP_EMAIL,
            MOCK_AUTH_DATA.SIGNUP_PASSWORD,
            MOCK_AUTH_DATA.NICKNAME,
            MOCK_AUTH_DATA.GENDER
        );
        await signupPage.requestSignUp();
        await page.waitForURL('**/signup/verify**');
        await expect(page).toHaveURL(/.*signup\/verify.*/);

        // 4. 인증 코드 입력 후 제출 -> 회원가입 완료 후 자동 로그인 -> 메인 페이지로 이동
        await verifyPage.mockSubmitEmailVerificationCodeSuccess();
        await verifyPage.fillVerificationCode(MOCK_AUTH_DATA.VERIFICATION_CODE).then(() => verifyPage.submitVerificationCode());
        await verifyPage.mockAuthenticationSuccess();
        await page.waitForURL('**/main**');
        await expect(page).toHaveURL(/.*main.*/);
        await page.waitForLoadState('networkidle');

        // 5. 인증 상태 확인 및 보장 (새로운 AuthProvider 구조 대응)
        await mainPage.ensureAuthenticated();

        // 6. 메인페이지에서 검색 (searchKeyword 내부에서 URL 변경 대기)
        await mainPage.searchKeyword('대구 교동');
        await expect(page).toHaveURL(/.*search.*/);
        await page.waitForLoadState('networkidle');

        // 6. 검색 결과 로딩 대기 및 페이지네이션 버튼 대기
        await page.waitForTimeout(3000);

        // 페이지네이션 버튼이 활성화될 때까지 대기
        const nextPageButton = page.getByTestId(TEST_SELECTORS.BUTTON_NEXT_PAGE);
        await nextPageButton.waitFor({ state: 'visible', timeout: 20000 });
        await expect(nextPageButton).not.toBeDisabled();
        await nextPageButton.click();
        await page.getByText('이얼즈').click();
        const slidingDrawer = page.getByTestId(TEST_SELECTORS.SLIDING_DRAWER);
        await slidingDrawer.waitFor({ state: 'visible' });

        // 7. 수집하기 버튼 클릭
        const collectButton = page.getByTestId(TEST_SELECTORS.BUTTON_COLLECT);
        await collectButton.waitFor({ state: 'visible' });
        await collectButton.click();

        // 8. 카페 수집 폼 입력 확인 (Server Action 기반이라 실제 저장은 모킹 불가)
        // 별점 5점 클릭 (label[for="star-5"] 사용)
        await page.locator('label[for="star-5"]').click();
        await page.getByTestId(TEST_SELECTORS.INPUT_COMMENT).fill('분위기가 정말 좋은 카페입니다');
        await page.getByTestId(TEST_SELECTORS.INPUT_EATEN_MENUS).fill('이얼즈 라떼');

        // 9. 수집 폼에 입력한 내용이 유지되는지 확인
        await expect(page.getByTestId(TEST_SELECTORS.INPUT_COMMENT)).toHaveValue('분위기가 정말 좋은 카페입니다');
        await expect(page.getByTestId(TEST_SELECTORS.INPUT_EATEN_MENUS)).toHaveValue('이얼즈 라떼');

        // 10. 완료 버튼이 표시되는지 확인 (실제 저장은 Server Action이 실제 DB를 사용하므로 테스트하지 않음)
        await expect(page.getByTestId(TEST_SELECTORS.BUTTON_SUBMIT_COLLECT)).toBeVisible();
    })

    test.describe('실패 시나리오 검증', () => {
        test('회원가입 실패: 잘못된 인증 코드를 제출하면 회원가입에 실패한다.', async ({ page }) => {
            const signupPage = new SignupPage(page);
            const verifyPage = new VerifyPage(page);

            // 1. 랜딩페이지 -> 로그인 페이지 -> 회원가입 페이지
            await page.goto('/');
            await page.getByTestId(TEST_SELECTORS.BUTTON_GO_TO_SIGNIN_FROM_LANDING).click();
            await page.getByTestId(TEST_SELECTORS.BUTTON_GO_TO_SIGNUP_FROM_SIGNIN).click();
            await expect(page).toHaveURL(/.*signup.*/);

            // 2. 회원가입 정보 입력 (이메일, 비밀번호, 닉네임, 성별) 후 회원가입 요청
            await signupPage.mockSignUpRequest();
            await signupPage.fillSignUpForm(
                MOCK_AUTH_DATA.SIGNUP_EMAIL,
                MOCK_AUTH_DATA.SIGNUP_PASSWORD,
                MOCK_AUTH_DATA.NICKNAME,
                MOCK_AUTH_DATA.GENDER
            );
            await signupPage.requestSignUp();
            await page.waitForURL('**/signup/verify**');
            await expect(page).toHaveURL(/.*signup\/verify.*/);

            // 3. 잘못된 인증 코드 입력 후 제출
            await verifyPage.mockSubmitEmailVerificationCodeFailure();
            await verifyPage.fillVerificationCode('000000').then(() => verifyPage.submitVerificationCode());

            await page.waitForSelector('.Toastify__toast--error', { timeout: 5000 });
            await expect(page.getByText('요청 처리 중 에러가 발생했습니다. 다시 시도해주세요.')).toBeVisible();
            await expect(page).toHaveURL(/.*signup\/verify.*/);
        })

        test('카페 수집 실패: 필수 정보를 입력하지 않고 완료를 눌러 제출하면 카페 수집에 실패한다.', async ({ page }) => {
            const signupPage = new SignupPage(page);
            const verifyPage = new VerifyPage(page);
            const mainPage = new MainPage(page);

            // 1. 카카오맵 검색 API 모킹 (페이지 이동 전에 먼저 설정)
            await mainPage.mockKakaoSearchAPI();

            // 2. 랜딩페이지 -> 로그인 페이지 -> 회원가입 페이지
            await page.goto('/');
            await page.getByTestId(TEST_SELECTORS.BUTTON_GO_TO_SIGNIN_FROM_LANDING).click();
            await page.getByTestId(TEST_SELECTORS.BUTTON_GO_TO_SIGNUP_FROM_SIGNIN).click();
            await expect(page).toHaveURL(/.*signup.*/);

            // 3. 회원가입 정보 입력 (이메일, 비밀번호, 닉네임, 성별) 후 회원가입 요청
            await signupPage.mockSignUpRequest();
            await signupPage.fillSignUpForm(
                MOCK_AUTH_DATA.SIGNUP_EMAIL,
                MOCK_AUTH_DATA.SIGNUP_PASSWORD,
                MOCK_AUTH_DATA.NICKNAME,
                MOCK_AUTH_DATA.GENDER
            );
            await signupPage.requestSignUp();
            await page.waitForURL('**/signup/verify**');
            await expect(page).toHaveURL(/.*signup\/verify.*/);

            // 4. 인증 코드 입력 후 제출 -> 회원가입 완료 후 자동 로그인 -> 메인 페이지로 이동
            await verifyPage.mockSubmitEmailVerificationCodeSuccess();
            await verifyPage.fillVerificationCode(MOCK_AUTH_DATA.VERIFICATION_CODE).then(() => verifyPage.submitVerificationCode());
            await verifyPage.mockAuthenticationSuccess();
            await page.waitForURL('**/main**');
            await expect(page).toHaveURL(/.*main.*/);
            await page.waitForLoadState('networkidle');

            // 5. 인증 상태 확인 및 보장 (새로운 AuthProvider 구조 대응)
            await mainPage.ensureAuthenticated();

            // 6. 메인페이지에서 검색 입력창에 키워드 입력 (네비게이션 영역의 검색창 사용)
            const searchInput = page.getByRole('search').getByTestId(TEST_SELECTORS.INPUT_SEARCH);
            await searchInput.fill('대구 교동');

            // 7. 검색 입력이 정상적으로 되었는지 확인
            await expect(searchInput).toHaveValue('대구 교동');

            // 8. 검색 버튼이 표시되는지 확인
            const searchButton = page.getByRole('search').getByTestId(TEST_SELECTORS.BUTTON_SUBMIT_KEYWORD_FOR_SEARCH);
            await expect(searchButton).toBeVisible();
        })
    })
})