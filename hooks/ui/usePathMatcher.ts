import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

export function usePathMatcher() {
    const pathname = usePathname();

    const paths = useMemo(() => ({
        // 기본
        isMain: pathname === '/main',
        isSearch: pathname.startsWith('/search'),
        isCollected: pathname.startsWith('/collected'),
        isBookmarked: pathname.startsWith('/bookmarked'),
        isRecommended: pathname.startsWith('/recommended'),
        isHelp: pathname.startsWith('/help'),
        // 상세 페이지
        isSearchDetail: pathname.startsWith('/search/detail/'),
        isCollectedDetail: pathname.startsWith('/collected/detail/'),
        isBookmarkedDetail: pathname.startsWith('/bookmarked/detail/'),
        isRecommendedDetail: pathname.startsWith('/recommended/detail/')
    }), [pathname]);

    return paths;
}