import { z } from 'zod';

/** 카페 추천 폼 데이터 스키마
 * @description 관리자가 카페를 추천할 때 입력하는 데이터의 유효성을 검증합니다.
 */
export const recommendationFormSchema = z.object({
  categories: z
    .array(z.string())
    .min(1, '카테고리를 선택해주세요'),
});

export type RecommendationFormData = z.infer<typeof recommendationFormSchema>;