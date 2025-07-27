export const bookmarkedCafeQuery = {
    all: (user_id: string) => ['bookmarkedCafe', user_id],
    counts: (user_id: string) => ['bookmarkedCafeCounts', user_id],
} as const;