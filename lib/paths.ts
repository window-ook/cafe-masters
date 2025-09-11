const INTERNAL_PATHS = {
    CAFE_DETAIL: (cafeId: string) => `/api/cafe-detail/${cafeId}`,
    CAFE_DETAIL_LOCAL: (cafeId: string) => `/api/cafe-detail/local/${cafeId}`,
    CAFE_DETAIL_BFF_LOCAL: (cafeId: string) => `http://localhost:3001/api/cafe-detail/${cafeId}`,
    CAFE_DETAIL_BFF: (cafeId: string) => `${process.env.NEXT_PUBLIC_BFF_URL}/api/cafe-detail/${cafeId}`,
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
    USER_ICON: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters//user_icon.gif',
    CUSTOM_MARKER: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/custom_marker.avif',
    CUSTOM_INFOWINDOW_GO: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/custom_infowindow_go.avif'
} as const;

export { INTERNAL_PATHS, EXTERNAL_PATHS, IMAGE_PATHS };