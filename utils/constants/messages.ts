import { COLLECT_RADIUS_M } from '@/utils/shared/geo';

// 유저 확인용 토스트 메세지 ===============
export const TOAST_SUCCESS = {
    CREATE_BOOKMARK: '북마크에 추가했습니다!',
    DELETE_BOOKMARK: '북마크에서 제거했습니다!',
    RESET_PASSWORD: '비밀번호를 재설정했습니다!',
    EDIT_COLLECTION: '수집한 카페의 정보를 수정했습니다!',
    CREATE_COLLECTION: '새로운 카페를 수집했습니다!',
    OPEN_COLLECTION: '카드를 개봉했어요!',
    UNOPENED_COLLECTION: '미개봉 카드로 수집했어요. 카페 근처에서 카드를 눌러 개봉해 주세요.',
    UPDATE_COLLECTION: '수집한 카페의 정보를 수정했습니다!',
    CREATE_RECOMMENDATION: '새로운 카페를 추천했습니다!',
    COPY_TO_CLIPBOARD: '클립보드에 복사했습니다!',
    SIGNOUT: '로그아웃되었습니다',
} as const;

export const TOAST_ERROR = {
    BOOMARK_TOGGLE_WITHOUT_SIGNIN: '로그인이 필요합니다',
    BOOMARK_TOGGLE: '에러가 발생했습니다',
    CREATE_BOOKMARK: '북마크 추가에 실패했습니다',
    DELETE_BOOKMARK: '북마크 제거에 실패했습니다',
    NO_DATA_FOR_EDIT_COLLECTION: '편집할 카페의 정보가 없습니다',
    EDIT_COLLECTION: '수집한 카페의 수정에 실패했습니다',
    OPEN_COLLECTION: '카드를 개봉하지 못했어요. 다시 시도해 주세요.',
    CREATE_RECOMMENDATION: '새로운 카페 추천에 실패했습니다',
    DELETE_RECOMMENDATION: '추천 카페 삭제에 실패했습니다',
    UPLOAD_IMAGE_SIZE: '이미지 크기는 2MB 이하여야 합니다',
    UPLOAD_IMAGE_TYPE: '이미지 파일만 업로드 가능합니다',
    UPLOAD_IMAGE_FAILED: '이미지 업로드에 실패했습니다',
    RETRY: '다시 시도해주세요',
    SIGNOUT: '로그아웃에 실패했습니다',
} as const;

export const TOAST_WARN = {
    DAILY_DRAW_LIMIT: '오늘은 이 카페에서 이미 카드를 뽑았어요. 내일 다시 방문해 주세요.',
    LOCATION_UNAVAILABLE: '현재 위치를 확인하지 못했어요. 위치 권한을 확인한 뒤 다시 시도해 주세요.',
    OPEN_OUT_OF_RADIUS: `카페 반경 ${COLLECT_RADIUS_M}m 안에서 개봉할 수 있어요.`,
    COLLECT_RESULT_UNKNOWN: '저장 여부를 확인하지 못했어요. 컬렉션을 확인해 주세요.',
    REFETCH_AFTER_SAVE: '카드는 저장됐어요. 화면을 새로고침해 다시 확인해 주세요.',
    NO_DATA_FOR_RECOMMEND: '추천할 카페 정보가 없습니다. 다시 시도해주세요.'
} as const;

// 개발자 확인용 콘솔 ========================
export const CONSOLE_ERROR = {
    CREATE_METADATA: '메타데이터 생성 중 에러:',
    RESET_PASSWORD: '비밀번호 재설정 중 에러:',
    SIGNOUT: '로그아웃 중 에러:',
    CREATE_BOOKMARK_CAFE: '북마크 추가 중 에러:',
    DELETE_BOOKMARK_CAFE: '북마크 삭제 중 에러:',
    EDIT_COLLECTION_CAFE: '수집한 카페 정보 수정 중 에러:',
    CREATE_COLLECTION_CAFE: '새로운 카페 수집 중 에러:',
    OPEN_COLLECTION_CAFE: '카드 개봉 중 에러:',
    CREATE_RECOMMENDATION_CAFE: '새로운 카페 추천 중 에러:',
    DELETE_RECOMMENDATION_CAFE: '추천 카페 삭제 중 에러:',
    REQUEST_RESET_PASSWORD: '비밀번호 재설정 요청 중 에러:',
    PARSE_CATEGORIES: '카테고리 파싱 중 에러:',
    CHECK_ADMIN: '관리자 권한 확인 중 에러:',
    UPLOAD_IMAGE: '이미지 업로드 중 에러:'
} as const;