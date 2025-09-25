import { Page } from 'playwright-core';
import { TEST_SELECTORS } from '@/tests/e2e/utils/constants';

export class MainPage {
    constructor(private page: Page) { }

    /** 검색 */
    async searchKeyword(keyword: string) {
        await this.page.waitForLoadState();

        const searchInput = this.page.getByTestId(TEST_SELECTORS.INPUT_SEARCH);
        await searchInput.waitFor({ state: 'visible' });

        const submitKeywordButton = this.page.getByTestId(TEST_SELECTORS.BUTTON_SUBMIT_KEYWORD_FOR_SEARCH);
        await submitKeywordButton.waitFor({ state: 'visible' });

        await this.page.getByTestId(TEST_SELECTORS.INPUT_SEARCH).fill(keyword);
        await this.page.getByTestId(TEST_SELECTORS.BUTTON_SUBMIT_KEYWORD_FOR_SEARCH).click();
    }
}