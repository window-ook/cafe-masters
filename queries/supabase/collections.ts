export const collectedCafeQuery = {
    all: (user_id: string) => ['collectedCafe', user_id],
    counts: (user_id: string) => ['collectedCafeCounts', user_id],
} as const;