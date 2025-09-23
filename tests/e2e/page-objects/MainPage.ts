import { Page } from 'playwright-core';
import { NavigationHelper, WaitHelper } from '@/tests/e2e/utils/helpers';
import { TEST_SELECTORS } from '@/tests/e2e/utils/constants';

export class MainPage {
    private navigationHelper: NavigationHelper;
    private waitHelper: WaitHelper;

    constructor(private page: Page) {
        this.navigationHelper = new NavigationHelper(page);
        this.waitHelper = new WaitHelper(page);
    }

    /** 메인 페이지로 이동 */
    async goToMainPage() {
        await this.navigationHelper.goToMainPage();
        // 페이지 로딩 완료까지 대기
        await this.waitHelper.waitForLoadState();
    }

    /** 키워드로 검색 */
    async searchKeyword(keyword: string) {
        // 페이지가 완전히 로드될 때까지 대기
        await this.waitHelper.waitForLoadState();
        const searchInput = this.page.getByTestId(TEST_SELECTORS.SEARCH_INPUT);
        await searchInput.waitFor({ state: 'visible' });

        // 검색 버튼이 보일 때까지 대기
        const submitKeywordButton = this.page.getByTestId(TEST_SELECTORS.SUBMIT_KEYWORD_FOR_SEARCH_BUTTON);
        await submitKeywordButton.waitFor({ state: 'visible' });

        // 검색어 입력
        await this.page.getByTestId(TEST_SELECTORS.SEARCH_INPUT).fill(keyword);

        // 버튼 클릭
        await this.page.getByTestId(TEST_SELECTORS.SUBMIT_KEYWORD_FOR_SEARCH_BUTTON).click();

        // URL 변경까지 대기
        await this.waitHelper.waitForURL('**/search**');
    }

    /** 티어 안내 다이얼로그 열기 */
    async openTierDialog() {
        await this.page.getByTestId(TEST_SELECTORS.OPEN_TIER_DIALOG_BUTTON).click();
    }

    /** 로그아웃 */
    async signOut() {
        await this.page.getByTestId(TEST_SELECTORS.SIGNOUT_BUTTON).click();
    }
}