'use client';

import { useQueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { RecommendationRowInsert, createRecommendationCafe, } from '@/actions/supabase/recommendation';
import { recommendationCafeQuery } from '@/queries/supabase/recommendation';
import { CONSOLE_ERROR, TOAST_ERROR } from '@/utils/constants/messages';

/** 추천 카페 추가 훅 */
export function useCreateRecommendationCafe() {
  const queryClient = useQueryClient();

  const createRecommendation = useMutation({
    mutationFn: async (memo: RecommendationRowInsert) => await createRecommendationCafe(memo),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: recommendationCafeQuery.all() });
      queryClient.invalidateQueries({ queryKey: recommendationCafeQuery.counts() });
    },
    onError: error => {
      console.error(CONSOLE_ERROR.CREATE_RECOMMENDATION_CAFE, error);
      toast.error(TOAST_ERROR.CREATE_RECOMMENDATION);
    },
  });

  return { createRecommendationCafe: createRecommendation.mutateAsync };
}