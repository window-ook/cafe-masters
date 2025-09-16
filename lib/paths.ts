/** 내부 API */
const INTERNAL_PATHS = {
    CAFE_DETAIL: '/api/cafe-detail',
    CAFE_DETAIL_LOCAL: '/api/cafe-detail/local',
} as const;

/** 외부 API */
const EXTERNAL_PATHS = {
    KAKAO_MAP: `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&libraries=services&autoload=false`,
    KAKAO_MAP_CAFE_DETAIL: (cafeId: string) => `https://place.map.kakao.com/${cafeId}`,
    GOOGLE_FORM_BUG_REPORT: 'https://forms.gle/7jEc8cKfELoKDFPb7',
    GOOGLE_FORM_FEEDBACK: 'https://forms.gle/PRAbmuAoKpHnCJCP6',
    USER_MANUAL: 'https://github.com/window-ook/cafe-masters'
} as const;

/** CDN 이미지 URL */
const IMAGE_PATHS = {
    VISIBILITY_ON: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/visibility_on.svg',
    VISIBILITY_OFF: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/visibility_off.svg',
    CAFE_THUMBNAIL_FALLBACK: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters//cafe_thumbnail.avif',
    FALLING_CARDS_BACKGROUND: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters//card_logo.avif',
    USER_ICON: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters//user_icon.gif',
    CUSTOM_MARKER: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/custom_marker.avif',
    CUSTOM_INFOWINDOW_GO: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/custom_infowindow_go.avif'
} as const;

export { INTERNAL_PATHS, EXTERNAL_PATHS, IMAGE_PATHS };