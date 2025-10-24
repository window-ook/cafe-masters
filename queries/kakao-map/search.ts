export const searchCafeQuery = {
    all: (cafeId: string) => ['searchCafeDetail', cafeId],
} as const;