import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useMapStore, useUserStore } from 'utils/store';
import { MapStore, UserStore } from 'types/store';
import { deleteBookmarkedCafe } from 'actions/bookmarkActions';
import { toast } from 'react-toastify';

export function useCancelBookmarkMutation() {
  const bookmarkedCafeDetail = useMapStore(
    (state: MapStore) => state.bookmarkedCafeDetail[0],
  );

  const userId = useUserStore((state: UserStore) => state.userId);

  const router = useRouter();

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () =>
      await deleteBookmarkedCafe(bookmarkedCafeDetail?.id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarkedCafe', userId] });
      queryClient.refetchQueries({ queryKey: ['bookmarkedCafe', userId] });
      toast.success('북마크에서 제거했습니다!');
      router.push('/cafe/bookmarked');
    },
    onError: error => {
      console.error(error);
      toast.error('북마크에서 제거하는데 문제가 발생했습니다');
    },
  });
}
