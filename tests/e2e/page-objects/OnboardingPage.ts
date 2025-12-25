import { Page } from '@playwright/test';
import { TEST_SELECTORS } from '@/tests/e2e/utils/constants';

export class OnboardingPage {
    constructor(private page: Page) {}

    /**
     * 성별 선택
     * @param gender 'male' 또는 'female'
     */
    async selectGender(gender: 'male' | 'female') {
        const genderLabel = gender === 'male' ? '남성' : '여성';
        await this.page.getByRole('radio', { name: genderLabel }).click();
    }

    /**
     * 닉네임 입력
     * @param nickname 닉네임 (2-10자)
     */
    async fillNickname(nickname: string) {
        await this.page.getByTestId(TEST_SELECTORS.INPUT_NICKNAME).fill(nickname);
    }

    /**
     * 프로필 설정 폼 작성
     * @param nickname 닉네임
     * @param gender 성별
     */
    async fillProfileSetupForm(nickname: string, gender: 'male' | 'female') {
        await this.fillNickname(nickname);
        await this.selectGender(gender);
    }

    /**
     * 프로필 설정 완료 버튼 클릭
     */
    async submitProfileSetup() {
        await this.page.getByTestId(TEST_SELECTORS.BUTTON_SUBMIT_PROFILE_SETUP).click();
    }

    /**
     * 프로필 설정 완료 (프로필 입력 + 제출)
     * @param nickname 닉네임
     * @param gender 성별
     */
    async completeProfileSetup(nickname: string, gender: 'male' | 'female') {
        await this.fillProfileSetupForm(nickname, gender);
        await this.submitProfileSetup();
    }
}
