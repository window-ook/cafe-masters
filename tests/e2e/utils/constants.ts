/** 실제 테스트용 사용자 계정 정보 */
export const TEST_USER = {
    EMAIL: 'demouser@test.com',
    PASSWORD: '1234uio!',
} as const;

/** 잘못된 테스트 데이터 */
export const INVALID_TEST_DATA = {
    EMAIL: 'nonexistent@test.com',
    PASSWORD: 'wrongpassword',
} as const;

/** 애플리케이션 URL */
export const APP_URLS = {
    BASE: 'http://localhost:3000',
    SIGNIN: '/signin',
    SIGNUP: '/signup',
    MAIN: '/main',
    RESET_PASSWORD: '/reset-password',
} as const;

/** 테스트 타임아웃 설정 */
export const TEST_TIMEOUTS = {
    SHORT: 1000,
    MEDIUM: 2000,
    LONG: 3000,
    NETWORK_FAIL: 5000,
} as const;

/** 공통 에러 메시지 */
export const ERROR_MESSAGES = {
    INVALID_CREDENTIALS: '이메일 또는 비밀번호가 올바르지 않습니다',
    EMAIL_REQUIRED: '이메일을 입력해주세요',
    PASSWORD_REQUIRED: '비밀번호는 최소 6자 이상 입력해야 합니다',
} as const;

/** getBy 메서드 사용을 위한 로케이터 정의 */
export const LOCATORS = {
    // 이메일/비밀번호 입력 
    EMAIL_INPUT: { method: 'getByRole', args: ['textbox', { name: '이메일' }] },
    PASSWORD_INPUT: { method: 'getByRole', args: ['textbox', { name: '비밀번호' }] },

    // 버튼들 
    SUBMIT_BUTTON: { method: 'getByRole', args: ['button', { name: '로그인 버튼' }] },
    KAKAO_LOGIN_BUTTON: { method: 'getByRole', args: ['button', { name: '카카오 로그인' }] },
    RESET_PASSWORD_BUTTON: { method: 'getByRole', args: ['button', { name: '비밀번호 재설정' }] },

    // 링크
    SIGNUP_LINK: { method: 'getByRole', args: ['link', { name: '회원가입 페이지로 이동 버튼' }] },

    // 텍스트 기반
    LOGOUT_TEXT: { method: 'getByText', args: ['로그아웃'] },
    MY_PAGE_TEXT: { method: 'getByText', args: ['마이페이지'] },

    // 테스트 ID
    USER_MENU: { method: 'getByTestId', args: ['user-menu'] },

    PASSWORD_TOGGLE: { method: 'getByAltText', args: ['비밀번호 보기 숨김'] },
    EMAIL_ERROR: { method: 'getByText', args: ['이메일을 입력해주세요'] },
    PASSWORD_ERROR: { method: 'getByText', args: ['비밀번호는 최소 6자 이상 입력해야 합니다'] },
} as const;