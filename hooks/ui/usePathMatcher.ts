import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

export function usePathMatcher() {
    const pathname = usePathname();

    const paths = useMemo(() => ({
        // 기본
        isMain: pathname === '/main',
        isSearch: pathname.startsWith('/search'),
        isCollected: pathname.startsWith('/collection'),
        isBookmarked: pathname.startsWith('/bookmark'),
        isRecommended: pathname.startsWith('/recommendation'),
        isHelp: pathname.startsWith('/help'),
        // 상세 페이지
        isSearchDetail: pathname.startsWith('/search/detail/'),
        isCollectedDetail: pathname.startsWith('/collection/detail/'),
        isBookmarkedDetail: pathname.startsWith('/bookmark/detail/'),
        isRecommendedDetail: pathname.startsWith('/recommendation/detail/')
    }), [pathname]);

    return paths;
}