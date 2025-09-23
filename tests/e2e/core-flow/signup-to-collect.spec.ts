import { test, expect } from '@playwright/test';
import { AuthMockHelper, NavigationHelper, WaitHelper } from '@/tests/e2e/utils/helpers';
import { SignupPage } from '@/tests/e2e/page-objects/SignUpPage';
import { VerifyPage } from '@/tests/e2e/page-objects/VerifyPage';
import { MainPage } from '@/tests/e2e/page-objects/MainPage';
import { SearchPage } from '@/tests/e2e/page-objects/SearchPage';
import { AllCafeDetailPage } from '@/tests/e2e/page-objects/AllCafeDetailPage';
import { CollectionPage } from '@/tests/e2e/page-objects/CollectionPage';
import { MOCK_DATA, TEST_SELECTORS, SUCCESS_MESSAGES } from '@/tests/e2e/utils/constants';

test.describe('처음 가입한 사용자의 플로우 테스트', () => {
    test('회원가입부터 카페 수집까지 성공한다.', async ({ page }) => {
        const navigation = new NavigationHelper(page);
        const waitHelper = new WaitHelper(page);
        const authMockHelper = new AuthMockHelper(page);
        const signupPage = new SignupPage(page);
        const verifyPage = new VerifyPage(page);
        const mainPage = new MainPage(page);
        const searchPage = new SearchPage(page);
        const cafeDetailPage = new AllCafeDetailPage(page);
        const collectionPage = new CollectionPage(page);

        // 1. 랜딩페이지 -> 로그인 페이지 -> 회원가입 페이지
        await navigation.navigateToPage('BASE');
        await navigation.goToSignInPageFromLandingPage();
        await navigation.goToSignUpPageFromSignInPage();
        await expect(page).toHaveURL(/.*signup.*/);

        // 2. 회원가입 정보 입력 후 요청
        await signupPage.mockSignUpRequest();
        await signupPage.fillSignUpForm(MOCK_DATA.SIGNUP_EMAIL, MOCK_DATA.SIGNUP_PASSWORD);
        await signupPage.requestSignUp();
        await waitHelper.waitForURL('**/signup/verify**');
        await expect(page).toHaveURL(/.*signup\/verify.*/);

        // 3. 인증 코드 입력 후 제출, 회원가입 완료 -> 자동 로그인
        await verifyPage.mockEmailVerification().then(() => authMockHelper.mockAuthenticationSuccess());
        await verifyPage.fillVerificationCode(MOCK_DATA.VERIFICATION_CODE).then(() => verifyPage.submitVerificationCode());
        await waitHelper.waitForURL('**/main**');
        await expect(page).toHaveURL(/.*main.*/);
        await waitHelper.waitForLoadState();

        // 5. 메인페이지에서 키워드 검색 (대구 교동)
        // 초기에는 빈 컬렉션으로 모킹하여 수집 버튼이 나타나도록 함
        await collectionPage.mockGetEmptyCollectionCafesAction();
        await mainPage.searchKeyword(MOCK_DATA.SEARCH_KEYWORD);
        await expect(page).toHaveURL(/.*search.*/);
        await waitHelper.waitForLoadState();

        // 6. 검색 결과에서 카페 선택 및 수집하기 클릭
        // 먼저 카페 상세 정보 모킹 설정
        await searchPage.clickCafe('2');

        // 페이지 3에 있는 '이얼즈'를 클릭
        await page.getByTestId('next-page-button').click();
        await page.getByTestId('next-page-button').click();
        await page.getByText('이얼즈').click();
        await waitHelper.waitForSlidingDrawer();

        // 7. 수집하기 버튼 클릭
        await cafeDetailPage.mockCreateCollectionCafeAction();

        // 수집 버튼이 나타날 때까지 대기 후 클릭
        const collectButton = page.getByTestId(TEST_SELECTORS.COLLECT_BUTTON);
        await collectButton.waitFor({ state: 'visible', timeout: 10000 });
        await collectButton.click();

        // 8. 카페 수집 정보 입력 후 완료
        await page.getByTestId('ratings-selector').locator('label').nth(4).click();
        await page.getByTestId(TEST_SELECTORS.COMMENT_INPUT).fill('분위기가 정말 좋은 카페입니다');
        await page.getByTestId(TEST_SELECTORS.EATEN_MENUS_INPUT).fill('이얼즈 라떼');
        await page.getByTestId(TEST_SELECTORS.SUBMIT_COLLECT_BUTTON).click();
        await expect(page.getByText(SUCCESS_MESSAGES.CAFE_COLLECTED)).toBeVisible();

        // 9. 수집 완료 후 컬렉션 페이지에서 확인
        await navigation.goToMainPage();
        await navigation.goToCollectionPage();
        await expect(page).toHaveURL(/.*collection.*/);
        await expect(page.getByText('이얼즈')).toBeVisible();
    })

    test.describe('실패 시나리오 검증', () => {
        test('회원가입 실패: 잘못된 인증 코드를 제출하면 회원가입에 실패한다.', async ({ page }) => {
            // TODO: 잘못된 인증 코드 제출로 실패하는 시나리오 구현
        })

        test('카페 수집 실패: 필수 정보를 입력하지 않고 완료를 눌러 제출하면 카페 수집에 실패한다.', async ({ page }) => {
            // TODO: 필수 입력값 없이 수집 시도하는 실패 시나리오 구현
        })
    })
})