export const recommendationCafeQuery = {
    all: () => ['recommendationCafe'],
    detail: (id: number) => ['recommendationCafe', 'detail', id],
    counts: () => ['recommendationCafe', 'counts'],
} as const;