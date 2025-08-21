const INTERNAL_PATHS = {
    CAFE_DETAIL: (cafeId: string) => `/api/cafe-detail/${cafeId}`,
    CAFE_DETAIL_LOCAL: (cafeId: string) => `/api/cafe-detail/local/${cafeId}`,
} as const;

const EXTERNAL_PATHS = {
    KAKAO_MAP_URL: `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&libraries=services&autoload=false`,
    KAKAO_MAP_CAFE_DETAIL: (cafeId: string) => `https://place.map.kakao.com/${cafeId}`,
} as const;

const IMAGE_PATHS = {
    CAFE_THUMBNAIL_FALLBACK: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters//cafe_thumbnail.avif',
    FALLING_CARDS_BACKGROUND: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters//card_logo.avif',
    VISIBILITY_ON: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/visibility_on.svg',
    VISIBILITY_OFF: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/visibility_off.svg',
    USER_ICON: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters//user_icon.gif'
} as const;

export { INTERNAL_PATHS, EXTERNAL_PATHS, IMAGE_PATHS };