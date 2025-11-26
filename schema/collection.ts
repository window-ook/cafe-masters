import { z } from 'zod';

/** 카페 수집 폼 데이터 스키마
 * @description 사용자가 카페를 수집할 때 입력하는 데이터의 유효성을 검증합니다.
 */
export const collectionFormSchema = z.object({
  rating: z
    .number()
    .min(1, '별점을 선택해주세요')
    .max(5, '별점은 1-5 사이여야 합니다'),

  categories: z.array(z.string()),

  comment: z
    .string()
    .min(1, '코멘트를 입력해주세요')
    .max(500, '코멘트는 500자 이하로 입력해주세요'),

  eaten_menus: z
    .string()
    .min(1, '먹은 메뉴를 입력해주세요')
    .max(200, '먹은 메뉴는 200자 이하로 입력해주세요'),

  pros: z
    .string()
    .max(300, '좋은 점은 300자 이하로 입력해주세요'),

  cons: z
    .string()
    .max(300, '아쉬운 점은 300자 이하로 입력해주세요'),

  customImage: z.instanceof(File).optional(),

  keepOriginalImage: z.boolean(),
});

export type CollectionFormData = z.infer<typeof collectionFormSchema>;