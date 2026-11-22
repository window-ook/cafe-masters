import type { DrawnMaterial } from '@/utils/shared/material';

const INTERNAL_PATHS = {
    API_BOOKMARK: '/api/bookmark',
    API_BOOKMARK_COUNTS: '/api/bookmark/counts',
    API_COLLECTION: '/api/collection',
    API_COLLECTION_COUNTS: '/api/collection/counts',
    API_RECOMMENDATION: '/api/recommendation',
    API_RECOMMENDATION_COUNTS: '/api/recommendation/counts',
} as const;

const EXTERNAL_PATHS = {
    KAKAO_MAP: `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&libraries=services&autoload=false`,
    /** 장소 ID로 카카오맵을 엽니다. 카카오 지도 Web API 가이드의 공식 URL 패턴입니다 */
    KAKAO_MAP_PLACE: (placeId: string | number) => `https://map.kakao.com/link/map/${placeId}`,
    GOOGLE_FORM_BUG_REPORT: 'https://forms.gle/7jEc8cKfELoKDFPb7',
    GOOGLE_FORM_FEEDBACK: 'https://forms.gle/PRAbmuAoKpHnCJCP6',
    USER_MANUAL: 'https://velog.io/@windowook/cafe-masters',
    INSTAGRAM: 'https://www.instagram.com/cafemasters_official'
} as const;

const IMAGE_PATHS = {
    COFFEE_ICON: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/3d_center_coffee.webp',
    VISIBILITY_ON: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/visibility_on.svg',
    VISIBILITY_OFF: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/visibility_off.svg',
    LOGO_IMG: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters//card_logo.avif',
    USER_IMAGE_MALE: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/user_image_male.webp',
    USER_IMAGE_FEMALE: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/user_image_female.webp',
    CUSTOM_MARKER: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/custom_marker.avif',
    CUSTOM_MARKER_1: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/custom_marker_1.avif',
    CUSTOM_INFOWINDOW_GO: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/custom_infowindow_go.avif',
    INSTAGRAM_LOGO: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/insta.webp',
    POLAROID_IMAGES: {
        CAFE_1: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/fallback_thumbnails/fallback_thumb_1.avif',
        CAFE_2: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/fallback_thumbnails/fallback_thumb_2.avif',
        CAFE_3: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/fallback_thumbnails/fallback_thumb_3.avif',
        CAFE_4: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/fallback_thumbnails/fallback_thumb_4.avif',
        CAFE_5: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/fallback_thumbnails/fallback_thumb_5.avif',
        CAFE_6: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/fallback_thumbnails/fallback_thumb_6.avif',
        CAFE_7: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/fallback_thumbnails/fallback_thumb_7.avif',
        CAFE_8: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/fallback_thumbnails/fallback_thumb_8.avif',
        CAFE_9: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/fallback_thumbnails/fallback_thumb_9.avif',
    },
    PACK_GLB: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/card_pack/card_pack.v4.glb',
    CARD_ART: (material: DrawnMaterial) => `https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/card_pack/card_art/${material}.webp`,
} as const;

export { INTERNAL_PATHS, EXTERNAL_PATHS, IMAGE_PATHS };
