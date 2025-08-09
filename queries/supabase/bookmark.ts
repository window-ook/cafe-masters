export const bookmarkCafeQuery = {
    all: (user_id: string) => ['bookmarkCafe', user_id],
    counts: (user_id: string) => ['bookmarkCafeCounts', user_id],
} as const;