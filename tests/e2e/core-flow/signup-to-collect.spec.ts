import { test, expect } from '@playwright/test';
import { SignupPage } from '@/tests/e2e/page-objects/SignUpPage';
import { VerifyPage } from '@/tests/e2e/page-objects/VerifyPage';
import { MainPage } from '@/tests/e2e/page-objects/MainPage';
import { MOCK_AUTH_DATA, TEST_SELECTORS, ERROR_MESSAGES } from '@/tests/e2e/utils/constants';
import { TOAST_SUCCESS } from '@/utils/constants/messages';

test.describe('처음 가입한 사용자의 플로우 테스트', () => {
    test('회원가입부터 카페 수집까지 성공한다.', async ({ page }) => {
        const signupPage = new SignupPage(page);
        const verifyPage = new VerifyPage(page);
        const mainPage = new MainPage(page);

        // 1. 랜딩페이지 -> 로그인 페이지 -> 회원가입 페이지
        await page.goto('/');
        await page.getByTestId(TEST_SELECTORS.BUTTON_GO_TO_SIGNIN_FROM_LANDING).click();
        await page.getByTestId(TEST_SELECTORS.BUTTON_GO_TO_SIGNUP_FROM_SIGNIN).click();
        await expect(page).toHaveURL(/.*signup.*/);

        // 2. 정보 입력 후 회원가입 요청
        await signupPage.mockSignUpRequest();
        await signupPage.fillSignUpForm(MOCK_AUTH_DATA.SIGNUP_EMAIL, MOCK_AUTH_DATA.SIGNUP_PASSWORD).then(() => signupPage.requestSignUp());
        await page.waitForURL('**/signup/verify**');
        await expect(page).toHaveURL(/.*signup\/verify.*/);

        // 3. 인증 코드 입력 후 제출 -> 회원가입 완료 후 자동 로그인
        await verifyPage.mockSubmitEmailVerificationCodeSuccess();
        await verifyPage.fillVerificationCode(MOCK_AUTH_DATA.VERIFICATION_CODE).then(() => verifyPage.submitVerificationCode());
        await verifyPage.mockAuthenticationSuccess();
        await page.waitForURL('**/main**');
        await expect(page).toHaveURL(/.*main.*/);
        await page.waitForLoadState();

        // 5. 메인페이지에서 검색 (카카오맵 API 모킹)
        await mainPage.mockKakaoSearchAPI();
        await mainPage.searchKeyword('대구 교동');
        await page.waitForURL('**/search**');
        await expect(page).toHaveURL(/.*search.*/);
        await page.waitForLoadState('networkidle');

        // 6. 검색 결과 로딩 대기 및 페이지네이션 버튼 대기
        // 페이지네이션이 렌더링될 때까지 추가 대기
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

        // 8. 카페 수집 정보 입력 후 완료 버튼 클릭
        await page.getByTestId('ratings-selector').locator('label').nth(4).click();
        await page.getByTestId(TEST_SELECTORS.INPUT_COMMENT).fill('분위기가 정말 좋은 카페입니다');
        await page.getByTestId(TEST_SELECTORS.INPUT_EATEN_MENUS).fill('이얼즈 라떼');
        await page.getByTestId(TEST_SELECTORS.BUTTON_SUBMIT_COLLECT).click();
        await expect(page.getByText(TOAST_SUCCESS.CREATE_COLLECTION)).toBeVisible();
        await page.waitForLoadState();

        // 9. 수집 완료 후 수집 확인
        await page.getByTestId(TEST_SELECTORS.BUTTON_GO_TO_MAIN_BY_HEADER).click();
        await page.getByTestId(TEST_SELECTORS.BUTTON_GO_TO_COLLECTION_BY_TAB).click();
        await expect(page).toHaveURL(/.*collection.*/);
        await page.reload(); // useCollectionCafes 모킹 데이터 반환
        await expect(page.getByText('이얼즈')).toBeVisible();
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

            // 2. 정보 입력 후 회원가입 요청
            await signupPage.mockSignUpRequest();
            await signupPage.fillSignUpForm(MOCK_AUTH_DATA.SIGNUP_EMAIL, MOCK_AUTH_DATA.SIGNUP_PASSWORD).then(() => signupPage.requestSignUp());
            await page.waitForURL('**/signup/verify**');
            await expect(page).toHaveURL(/.*signup\/verify.*/);

            // 잘못된 인증 코드 입력 후 제출        
            await verifyPage.mockSubmitEmailVerificationCodeFailure();
            await verifyPage.fillVerificationCode('000000').then(() => verifyPage.submitVerificationCode());

            await page.waitForSelector('.Toastify__toast--error', { timeout: 5000 });
            await expect(page.getByText('요청 처리 중 에러가 발생했습니다. 다시 시도해주세요.')).toBeVisible();
            await expect(page).toHaveURL(/.*signup\/verify.*/);
        })

        test('카페 수집 실패: 필수 정보를 입력하지 않고 완료를 눌러 제출하면 카페 수집에 실패한다.', async ({ page }) => {
            // TODO: 필수 입력값 없이 수집 시도하는 실패 시나리오 구현
            const signupPage = new SignupPage(page);
            const verifyPage = new VerifyPage(page);
            const mainPage = new MainPage(page);

            // 1. 랜딩페이지 -> 로그인 페이지 -> 회원가입 페이지
            await page.goto('/');
            await page.getByTestId(TEST_SELECTORS.BUTTON_GO_TO_SIGNIN_FROM_LANDING).click();
            await page.getByTestId(TEST_SELECTORS.BUTTON_GO_TO_SIGNUP_FROM_SIGNIN).click();
            await expect(page).toHaveURL(/.*signup.*/);

            // 2. 정보 입력 후 회원가입 요청
            await signupPage.mockSignUpRequest();
            await signupPage.fillSignUpForm(MOCK_AUTH_DATA.SIGNUP_EMAIL, MOCK_AUTH_DATA.SIGNUP_PASSWORD).then(() => signupPage.requestSignUp());
            await page.waitForURL('**/signup/verify**');
            await expect(page).toHaveURL(/.*signup\/verify.*/);

            // 3. 인증 코드 입력 후 제출 -> 회원가입 완료 후 자동 로그인
            await verifyPage.mockSubmitEmailVerificationCodeSuccess();
            await verifyPage.fillVerificationCode(MOCK_AUTH_DATA.VERIFICATION_CODE).then(() => verifyPage.submitVerificationCode());
            await verifyPage.mockAuthenticationSuccess();
            await page.waitForURL('**/main**');
            await expect(page).toHaveURL(/.*main.*/);
            await page.waitForLoadState();

            // 5. 메인페이지에서 검색 (카카오맵 API 모킹)
            await mainPage.mockKakaoSearchAPI();
            await mainPage.searchKeyword('대구 교동');
            await page.waitForURL('**/search**');
            await expect(page).toHaveURL(/.*search.*/);
            await page.waitForLoadState('networkidle');

            // 6. 검색 결과 로딩 대기 및 페이지네이션 버튼 대기
            // 페이지네이션이 렌더링될 때까지 추가 대기
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

            // 8. 먹은 메뉴를 입력하지 않고 '완료' 클릭하면 에러 UI 표시
            await page.getByTestId('ratings-selector').locator('label').nth(4).click();
            await page.getByTestId(TEST_SELECTORS.INPUT_COMMENT).fill('분위기가 정말 좋은 카페입니다');
            await page.getByTestId(TEST_SELECTORS.BUTTON_SUBMIT_COLLECT).click();
            await expect(page.getByText(ERROR_MESSAGES.NO_EATEN_MENUS)).toBeVisible();
            await expect(page).toHaveURL(/.*search\/detail.*/);
        })
    })
})