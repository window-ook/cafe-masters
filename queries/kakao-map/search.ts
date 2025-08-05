export const searchCafeQuery = {
    all: (cafeId: string) => ['searchedCafeDetail', cafeId],
} as const;