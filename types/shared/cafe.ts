
export interface CafeStore {
    // 원본 데이터
    searchResult: IKakaoSearchResult[]
    collectedCafe: ISupabaseCollectedCafe[]
    bookmarkedCafe: ISupabaseBookmarkedCafe[]
    recommendedCafe: ISupabaseRecommendedCafe[]

    // 필터링된 데이터
    filteredCollectedCafe: ISupabaseCollectedCafe[]
    filteredBookmarkedCafe: ISupabaseBookmarkedCafe[]
    filteredRecommendedCafe: ISupabaseRecommendedCafe[]

    // 상세 정보
    cafeDetail: {}
    collectedCafeDetail: ISupabaseCollectedCafe[]
    bookmarkedCafeDetail: ISupabaseBookmarkedCafe[]
    recommendedCafeDetail: ISupabaseRecommendedCafe[]

    // 카운트
    collectedCafeCount: number
    bookmarkedCafeCount: number
    recommendedCafeCount: number

    // 상태 플래그
    isCollected: boolean
    isBookmarked: boolean
    isRecommended: boolean
}