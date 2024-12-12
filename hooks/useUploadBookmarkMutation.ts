import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUserStore } from 'utils/store';
import {
  BookmarkedRowInsert,
  createBookmarkedCafe,
} from 'actions/bookmarkActions';
import { toast } from 'react-toastify';

export function useUploadBookmarkMutation() {
  const userId = useUserStore(state => state.userId);

  const router = useRouter();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (detail: BookmarkedRowInsert) =>
      await createBookmarkedCafe(detail),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarkedCafe', userId] });
      queryClient.refetchQueries({ queryKey: ['bookmarkedCafe', userId] });
      toast.success('새로운 카페를 북마크에 저장했습니다!');
      router.refresh();
    },
    onError: error => console.error(error),
  });
}
