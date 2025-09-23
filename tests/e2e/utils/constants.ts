/** 페이지 경로 */
export const PAGE_PATHS = {
    BASE: 'http://localhost:3000',
    SIGNIN: 'http://localhost:3000/signin',
    SIGNUP: 'http://localhost:3000/signup',
    SIGNUP_VERIFY: 'http://localhost:3000/signup/verify',
    RESET_PASSWORD: 'http://localhost:3000/reset-password',
} as const;

/** Mock 데이터 */
export const MOCK_DATA = {
    // 인증
    USER_ID: 'mock-user-id',
    SIGNUP_EMAIL: 'test@example.com',
    SIGNUP_PASSWORD: '3579ciak!',
    ACCESS_TOKEN: 'mock-access-token',
    REFRESH_TOKEN: 'mock-refresh-token',
    JWT_TOKEN: 'mock-jwt-token',
    VERIFICATION_CODE: '123456',

    // 카페
    CAFE_ID: 'mock-cafe-id',
    DEFAULT_CAFE_ID: '1',
    SEARCH_KEYWORD: '대구 교동'
} as const;

/** API 경로 */
export const API_PATHS = {
    SUPABASE_AUTH_SIGNUP: '**/auth/v1/signup**',
    SUPABASE_AUTH_VERIFY: '**/auth/v1/verify**',

    CAFE_DETAIL_LOCAL: '**/api/cafe-detail/*',

    SUPABASE_CREATE_COLLECTION_CAFE: '**/actions/supabase/cafe/createCafe**',
    SUPABASE_UPDATE_COLLECTION_CAFE: '**/actions/supabase/cafe/updateCafe**',

    SUPABASE_CREATE_BOOKMARK_CAFE: '**/actions/supabase/cafe/bookmarkCafe**',
    SUPABASE_REMOVE_BOOKMARK_CAFE: '**/actions/supabase/cafe/bookmarkCafe**',

    SUPABASE_GET_COLLECTION_CAFES: '**/actions/supabase/collection/getData**',
    SUPABASE_GET_BOOKMARK_CAFES: '**/actions/supabase/bookmark/getAllBookmarkedCafes**',
    SUPABASE_GET_RECOMMENDATION_CAFES: '**/actions/supabase/recommendation/getAllRecommendationCafes**',
    SUPABASE_ACTIONS: '**/actions/supabase/**',
} as const;

/** 테스트 타임아웃 */
export const TEST_TIMEOUTS = {
    SHORT: 1000,
    MEDIUM: 2000,
    LONG: 3000,
    NETWORK_FAIL: 5000,
    NAVIGATION: 10000,
    API_RESPONSE: 15000,
} as const;

/** 성공 메시지 */
export const SUCCESS_MESSAGES = {
    CAFE_COLLECTED: '카페를 수집했어요!',
    COLLECTION_CAFE_UPDATED: '카페 정보 수정을 완료했어요!',
    BOOKMARK_CAFE_ADDED: '북마크에 추가했어요!',
    BOOKMARK_CAFE_REMOVED: '북마크에서 제거했어요!',
    SIGNUP_SUCCESS: '회원가입이 완료되었습니다',
    SIGNIN_SUCCESS: '로그인이 완료되었습니다',
} as const;

/** 에러 메시지 */
export const ERROR_MESSAGES = {
    INVALID_CREDENTIALS: '이메일 또는 비밀번호가 올바르지 않습니다',
    EMAIL_REQUIRED: '이메일을 입력해주세요',
    PASSWORD_REQUIRED: '비밀번호는 최소 6자 이상 입력해야 합니다',
    VERIFICATION_CODE_REQUIRED: '인증번호를 입력해주세요',
    RATING_REQUIRED: '별점을 선택해주세요',
} as const;

/** 테스트 선택자 */
export const TEST_SELECTORS = {
    // 입력란
    EMAIL_INPUT: 'email-input',
    PASSWORD_INPUT: 'password-input',
    VERIFICATION_CODE_INPUT: 'verification-code-input',
    SEARCH_INPUT: 'search-input',
    RATINGS_SELECTOR: 'ratings-selector',
    COMMENT_INPUT: 'comment-input',
    EATEN_MENUS_INPUT: 'eaten-menus-input',

    // 요소
    SLIDING_DRAWER: 'sliding-drawer',

    // 버튼
    SIGNIN_BUTTON: 'signin-button',
    SIGNOUT_BUTTON: 'signout-button',
    OPEN_TIER_DIALOG_BUTTON: 'open-tier-dialog',
    SUBMIT_KEYWORD_FOR_SEARCH_BUTTON: 'submit-keyword-for-search',
    SUBMIT_REQUEST_SIGNUP_BUTTON: 'submit-request-signup-button',
    SUBMIT_EMAIL_VERIFICATION_CODE_BUTTON: 'submit-email-verification-code-button',
    SUBMIT_COLLECT_BUTTON: 'submit-collect-button',

    COLLECT_BUTTON: 'collect-button',
    COLLECT_EDIT_BUTTON: 'collect-edit-button',

    BOOKMARK_BUTTON: 'bookmark-button',
    BOOKMARK_CANCEL_BUTTON: 'bookmark-cancel-button',

    // 네비게이션
    GO_TO_SIGNIN_FROM_LANDING: 'go-to-signin-from-landing',
    GO_TO_SIGNIN_FROM_MAIN: 'go-to-signin-from-main',
    GO_TO_SIGNIN_FROM_SIGNUP: 'go-to-signin-from-signUp',

    GO_TO_SIGNUP_FROM_SIGNIN: 'go-to-signup-from-signIn',

    GO_TO_MAIN_BY_HEADER: 'go-to-main',
    GO_TO_SEARCH_BY_TAB: 'go-to-search-by-tab',
    GO_TO_COLLECTION_BY_TAB: 'go-to-collection-by-tab',
    GO_TO_BOOKMARK_BY_TAB: 'go-to-bookmark-by-tab',
    GO_TO_RECOMMENDATION_BY_TAB: 'go-to-recommendation-by-tab',
} as const;