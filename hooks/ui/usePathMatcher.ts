import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

export function usePathMatcher() {
    const pathname = usePathname();

    const paths = useMemo(() => ({
        // 기본
        isMain: pathname === '/main',
        isSearch: pathname.startsWith('/search'),
        isCollection: pathname.startsWith('/collection'),
        isBookmark: pathname.startsWith('/bookmark'),
        isRecommendation: pathname.startsWith('/recommendation'),
        isHelp: pathname.startsWith('/help'),
        // 상세 페이지
        isSearchDetail: pathname.startsWith('/search/detail/'),
        isCollectionDetail: pathname.startsWith('/collection/detail/'),
        isBookmarkDetail: pathname.startsWith('/bookmark/detail/'),
        isRecommendationDetail: pathname.startsWith('/recommendation/detail/')
    }), [pathname]);

    return paths;
}