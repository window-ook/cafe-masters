export const recommendedCafeQuery = {
    all: () => ['recommendedCafe'],
    detail: (id: number) => ['recommendedCafe', 'detail', id],
    counts: () => ['recommendedCafe', 'counts'],
} as const;