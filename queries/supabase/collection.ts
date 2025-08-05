export const collectionCafeQuery = {
    all: (user_id: string) => ['collectionCafe', user_id],
    counts: (user_id: string) => ['collectionCafeCounts', user_id],
} as const;