/** Mock 회원가입 유저 */
export const MOCK_AUTH_DATA = {
    USER_ID: 'mock-user-id',
    SIGNUP_EMAIL: 'test@example.com',
    SIGNUP_PASSWORD: '3579ciak!',
    ACCESS_TOKEN: 'mock-access-token',
    REFRESH_TOKEN: 'mock-refresh-token',
    JWT_TOKEN: 'mock-jwt-token',
    VERIFICATION_CODE: '123456',
} as const;

/** API 경로 */
export const API_PATHS = {
    SUPABASE_AUTH_SIGNUP: '**/auth/v1/signup**',
    SUPABASE_AUTH_VERIFY: '**/auth/v1/verify**',
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
    INPUT_EMAIL: 'email-input',
    INPUT_PASSWORD: 'password-input',
    INPUT_VERIFICATION_CODE: 'verification-code-input',
    INPUT_SEARCH: 'search-input',
    SELECTOR_RATINGS: 'ratings-selector',
    INPUT_COMMENT: 'comment-input',
    INPUT_EATEN_MENUS: 'eaten-menus-input',

    // 요소
    SLIDING_DRAWER: 'sliding-drawer',

    // 버튼
    BUTTON_SIGNIN: 'button-signin',
    BUTTON_SIGNOUT: 'button-signout',
    BUTTON_OPEN_TIER_DIALOG: 'button-open-tier-dialog',
    BUTTON_SUBMIT_KEYWORD_FOR_SEARCH: 'button-submit-keyword-for-search',
    BUTTON_SUBMIT_REQUEST_SIGNUP: 'button-submit-request-signup',
    BUTTON_SUBMIT_EMAIL_VERIFICATION_CODE: 'button-submit-email-verification-code',
    BUTTON_NEXT_PAGE: 'button-next-page',
    BUTTON_SUBMIT_COLLECT: 'button-submit-collect',
    BUTTON_COLLECT: 'button-collect',
    BUTTON_COLLECT_EDIT: 'button-collect-edit',
    BUTTON_BOOKMARK: 'bookmark-button',
    BUTTON_BOOKMARK_CANCEL: 'bookmark-cancel-button',
    BUTTON_GO_TO_SIGNIN_FROM_LANDING: 'button-go-to-signin-from-landing',
    BUTTON_GO_TO_SIGNIN_FROM_MAIN: 'button-go-to-signin-from-main',
    BUTTON_GO_TO_SIGNIN_FROM_SIGNUP: 'button-go-to-signin-from-signup',
    BUTTON_GO_TO_SIGNUP_FROM_SIGNIN: 'button-go-to-signup-from-signin',
    BUTTON_GO_TO_MAIN_BY_HEADER: 'button-go-to-main',
    BUTTON_GO_TO_SEARCH_BY_TAB: 'button-go-to-search-by-tab',
    BUTTON_GO_TO_COLLECTION_BY_TAB: 'button-go-to-collection-by-tab',
    BUTTON_GO_TO_BOOKMARK_BY_TAB: 'button-go-to-bookmark-by-tab',
    BUTTON_GO_TO_RECOMMENDATION_BY_TAB: 'button-go-to-recommendation-by-tab',
} as const;

export const MOCK_SEARCH_CAFES = [
    {
        id: '1',
        category_group_code: 'CE7',
        category_group_name: '카페',
        category_name: '음식점 > 카페',
        x: 126.92244916458264,
        y: 37.54882577058748,
        distance: '',
        place_name: '스탠스커피',
        place_url: 'http://place.map.kakao.com/1494667205',
        address_name: '서울 마포구 상수동 93-111',
        road_address_name: '서울 마포구 와우산로 11길 9',
        phone: '02-323-7500',
        image: 'https://img1.kakaocdn.net/cthumb/local/C544x408.q50/?fname=http%3A%2F%2Ft1.kakaocdn.net%2Fmystore%2F80D04C64F6A64A2880EC4EA6840336E7',
        extra_images: ["https://img1.kakaocdn.net/cthumb/local/C264x196.q50/?fname=http%3A%2F%2Ft1.kakaocdn.net%2Fmystore%2F6B4874501939408AB2C136F53E0A3444", "https://img1.kakaocdn.net/cthumb/local/C264x196.q50/?fname=http%3A%2F%2Ft1.kakaocdn.net%2Fmystore%2F69F6C36B0D774B67AC78D13B89DFA519"],
        opening_time: '11:00 ~ 22:00'
    },
    {
        id: '2',
        category_group_code: 'CE7',
        category_group_name: '카페',
        category_name: '음식점 > 카페 > 커피전문점',
        x: 128.60039182923592,
        y: 35.871224288731426,
        distance: '',
        place_name: '이얼즈',
        place_url: 'http://place.map.kakao.com/803452801',
        address_name: '대구 중구 동문동 10-4',
        road_address_name: '대구 중구 공평로 79',
        phone: '',
        image: 'https://img1.kakaocdn.net/cthumb/local/C544x408.q50/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flocal%2FkakaomapPhoto%2Freview%2Fec2c1096b85aa2d7a0ef108c140901a58bffb8f4%3Foriginal',
        extra_images: ["https://img1.kakaocdn.net/cthumb/local/C264x196.q50/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flocal%2FkakaomapPhoto%2Freview%2Fada47eb2153cbf9a7e252665ccfa8fa6c451a8a8%3Foriginal", "https://img1.kakaocdn.net/cthumb/local/C264x196.q50/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flocal%2FkakaomapPhoto%2Freview%2F5437d75d7bf7ab5d3acc116b36e8790d7b756625%3Foriginal"],
        opening_time: '12:00 ~ 23:00'
    }
];

export const MOCK_COLLECTION_CAFES = [
    {
        id: 233485062,
        name: "수수밀소",
        address: "대구 동구 매여로 320",
        coordX: 128.715042760351,
        coordY: 35.9068536906751,
        image: "https://img1.kakaocdn.net/cthumb/local/C544x408.q50/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flocal%2FkakaomapPhoto%2Freview%2Fa7a8a9c5e452346856a6295285ab32a008dc4a97%3Foriginal",
        comment: "쾌적한 통창, 산을 바라보는 풍경이 아주 좋은 카페입니다. 아주 좋아~",
        pros: "커피도 맛있고, 포토존으로 찍기 좋은 인공연못과 푸르른 산이 있습니다.",
        cons: "",
        eaten_menus: "아이스크림 라떼",
        ratings: 5,
        created_at: "2025-08-05 13:01:55.155+00",
        updated_at: null,
        user_id: MOCK_AUTH_DATA.USER_ID,
        phone_number: "053-965-4595",
        opening_time: "10:30 ~ 20:00",
        categories: ["전망 좋은", "공간이 넓은", "주차장 있는", "디저트가 맛있는", "포토존 있는"],
        extra_images: ["https://img1.kakaocdn.net/cthumb/local/C264x196.q50/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flocal%2FkakaomapPhoto%2Freview%2F03885574f8b8070879f6259ccd56cb55d5621896%3Foriginal", "https://img1.kakaocdn.net/cthumb/local/C264x196.q50/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flocal%2FkakaomapPhoto%2Freview%2F46d4eada07b3992d0f3d4a9bc21f8550f513e239%3Foriginal"]
    },
    {
        id: 803452801,
        name: "이얼즈",
        address: "대구 중구 동문동 10-4",
        coordX: 128.60039182923592,
        coordY: 35.871224288731426,
        image: "https://img1.kakaocdn.net/cthumb/local/C544x408.q50/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flocal%2FkakaomapPhoto%2Freview%2Fec2c1096b85aa2d7a0ef108c140901a58bffb8f4%3Foriginal",
        comment: "분위기가 정말 좋은 카페입니다",
        pros: "",
        cons: "",
        eaten_menus: "이얼즈 라떼",
        ratings: 5,
        created_at: "2025-09-23 03:00:00.000+00",
        updated_at: null,
        user_id: MOCK_AUTH_DATA.USER_ID,
        phone_number: "",
        opening_time: "12:00 ~ 23:00",
        categories: ["특색있는", "커피가 맛있는"],
        extra_images: ["https://img1.kakaocdn.net/cthumb/local/C264x196.q50/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flocal%2FkakaomapPhoto%2Freview%2Fada47eb2153cbf9a7e252665ccfa8fa6c451a8a8%3Foriginal"]
    }
]

export const MOCK_BOOKMARK_CAFE = [
    {
        id: 1,
        user_id: MOCK_AUTH_DATA.USER_ID,
        name: "블루보틀 성수 카페",
        image: "https://img1.kakaocdn.net/cthumb/local/C544x408.q50/?fname=http%3A%2F%2Ft1.kakaocdn.net%2Fmystore%2F723A22186EE84C9BB142E6E93DBCA4AA",
        opening_time: "07:30 ~ 20:30",
        address: "서울 성동구 아차산로 7",
        phone_number: "1533-6906",
        menus: "[{\"name\":\"아메리카노\",\"price\":\"5,900원\"}]",
        coordX: 127.04564285335792,
        coordY: 37.548088279686716,
        created_at: "2025-08-26 03:15:19.568+00",
        extra_images: ["https://img1.kakaocdn.net/cthumb/local/C264x196.q50/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flocal%2FkakaomapPhoto%2Freview%2F10d79014d04a5c9819979b3cce3599a674fe4192%3Foriginal\",\"https://img1.kakaocdn.net/cthumb/local/C264x196.q50/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flocal%2FkakaomapPhoto%2Freview%2F13e8afef43ac9a569a67a36a1abb7b886f39484b%3Foriginal"]
    },
    {
        id: 537725204,
        user_id: MOCK_AUTH_DATA.USER_ID,
        name: "프론다커피바",
        image: "https://img1.kakaocdn.net/cthumb/local/C544x408.q50/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flocal%2FkakaomapPhoto%2Freview%2F7689d2feb17b4fe2eff73d5503ab0cfd5383e978%3Foriginal",
        opening_time: "12:00 ~ 22:00",
        address: "대구 중구 공평로 87",
        phone_number: "0503-7152-3868",
        menus: null,
        coordX: 128.6006804877929,
        coordY: 35.87186926414192,
        created_at: "2025-09-09 06:26:57.541+00", extra_images: ["https://img1.kakaocdn.net/cthumb/local/C264x196.q50/?fname=https%3A%2F%2Fpostfiles.pstatic.net%2FMjAyNTA4MjRfMjUg%2FMDAxNzU1OTYyNzQ0OTc1.urxac3yy4ZrJr2RqvFfC-uXyATrM6BTWSKzRc2AwCtAg.2ontoTnNGSiV2NKp7mSFhBX-0Lf26Ko1lqJ2l9oLzGEg.JPEG%2FIMG%25EF%25BC%25BF6924.jpg%3Ftype%3Dw773\",\"https://img1.kakaocdn.net/cthumb/local/C264x196.q50/?fname=https%3A%2F%2Fpostfiles.pstatic.net%2FMjAyNTA4MjRfMTUz%2FMDAxNzU1OTYyNzQ0MDcz.RsmtxCx_9S1htUsQfDJNyt5mQrWOKXErsDYcDIKOh20g.lA8ZzXumNRNYwj782gN7LfOPdUSBRBIfACKPNA2FiJkg.JPEG%2FIMG%25EF%25BC%25BF6957.jpg%3Ftype%3Dw773"]
    }
]

export const MOCK_RECOMMENDATION_CAFES = [
    {
        id: 2076535170,
        name: "어레인지먼트",
        image: "https://img1.kakaocdn.net/cthumb/local/C544x408.q50/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flocal%2FkakaomapPhoto%2Freview%2Fd445e1ce0d081a1df12773a411d4a50b91e95448%3Foriginal",
        categories: ["주차장 있는", "포토존 있는", "공간이 넓은", "전망 좋은"],
        opening_time: "10:00 ~ 21:00",
        address: "경북 포항시 북구 흥해읍 해안로 1804",
        phone_number: "054-612-5050",
        menus: null,
        created_at: "2025-08-04 12:52:04.386+00",
        extra_images: ["https://img1.kakaocdn.net/cthumb/local/C264x196.q50/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flocal%2FkakaomapPhoto%2Freview%2Ff9cdd9696840515ad39f58e5af443d5c57741fa0%3Foriginal", "https://img1.kakaocdn.net/cthumb/local/C264x196.q50/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flocal%2FkakaomapPhoto%2Freview%2Ffe945252e31ff580880d80769d205fcea52ecc2e%3Foriginal"],
        coordX: 129.39852287790671,
        coordY: 36.16411815427859
    },
    {
        id: 932891473,
        name: "카페오하이오",
        image: "https://img1.kakaocdn.net/cthumb/local/C544x408.q50/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flocal%2FkakaomapPhoto%2Freview%2Fdc837f79f497af139fba4a3e056f548940e27a3c%3Foriginal",
        categories: ["특색있는", "밝은", "콘센트 많은", "시끌벅적한", "포토존 있는"],
        opening_time: "11:00 ~ 23:00",
        address: "대구 중구 국채보상로 629",
        phone_number: null,
        menus: null,
        created_at: "2025-09-09 11:57:30.313+00",
        extra_images: ["https://img1.kakaocdn.net/cthumb/local/C264x196.q50/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flocal%2FkakaomapPhoto%2Freview%2Fbfac6e0b93d499470f0228076821bfbe8e1df51d%3Foriginal", "https://img1.kakaocdn.net/cthumb/local/C264x196.q50/?fname=http%3A%2F%2Ft1.daumcdn.net%2Flocal%2FkakaomapPhoto%2Freview%2Ffd2a5f6f68a2cef99717a4fbbec9e720e1fd98c6%3Foriginal"],
        coordX: 128.599664378036,
        coordY: 35.8703959176838
    }
]