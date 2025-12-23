const INTERNAL_PATHS = {
    CAFE_DETAIL: '/api/cafe-detail',
} as const;

const EXTERNAL_PATHS = {
    KAKAO_MAP: `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&libraries=services&autoload=false`,
    KAKAO_MAP_CAFE_DETAIL: (cafeId: string) => `https://place.map.kakao.com/${cafeId}`,
    GOOGLE_FORM_BUG_REPORT: 'https://forms.gle/7jEc8cKfELoKDFPb7',
    GOOGLE_FORM_FEEDBACK: 'https://forms.gle/PRAbmuAoKpHnCJCP6',
    USER_MANUAL: 'https://velog.io/@windowook/cafe-masters',
    INSTAGRAM: 'https://www.instagram.com/cafemasters_official'
} as const;

const IMAGE_PATHS = {
    COFFEE_ICON: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/3d_center_coffee.webp',
    VISIBILITY_ON: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/visibility_on.svg',
    VISIBILITY_OFF: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/visibility_off.svg',
    CAFE_THUMBNAIL_FALLBACK: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters//cafe_thumbnail.avif',
    LOGO_IMG: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters//card_logo.avif',
    USER_IMAGE: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/user_image.webp',
    CUSTOM_MARKER: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/custom_marker.avif',
    CUSTOM_MARKER_1: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/custom_marker_1.avif',
    CUSTOM_INFOWINDOW_GO: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/custom_infowindow_go.avif',
    INSTAGRAM_LOGO: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/insta.webp',
    FALLBACK_THUMBNAILS: {
        IMAGE_1: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/fallback_thumbnails/fallback_thumb_1.avif',
        IMAGE_2: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/fallback_thumbnails/fallback_thumb_2.avif',
        IMAGE_3: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/fallback_thumbnails/fallback_thumb_3.avif',
        IMAGE_4: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/fallback_thumbnails/fallback_thumb_4.avif',
        IMAGE_5: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/fallback_thumbnails/fallback_thumb_5.avif',
        IMAGE_6: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/fallback_thumbnails/fallback_thumb_6.avif',
        IMAGE_7: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/fallback_thumbnails/fallback_thumb_7.avif',
        IMAGE_8: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/fallback_thumbnails/fallback_thumb_8.avif',
        IMAGE_9: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/fallback_thumbnails/fallback_thumb_9.avif',
        IMAGE_10: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/fallback_thumbnails/fallback_thumb_10.avif',
        IMAGE_11: 'https://vsemazasjbizehcambul.supabase.co/storage/v1/object/public/cafe%20masters/fallback_thumbnails/fallback_thumb_11.avif',
    },
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
} as const;

export { INTERNAL_PATHS, EXTERNAL_PATHS, IMAGE_PATHS };