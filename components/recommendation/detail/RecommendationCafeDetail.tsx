'use client';

import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores';
import { useRecommendationCafes } from '@/hooks/supabase/recommendation/useRecommendationCafes';
import { ISupabaseRecommendationCafe } from '@/types/supabase/recommendation';
import Button from '@/components/shared/Button';
import CafeDetailHeader from '@/components/shared/sliding-drawer/CafeDetailHeader';
import CafeDetailBody from '@/components/shared/sliding-drawer/CafeDetailBody';
import CollectButton from '@/components/opening/CollectButton';

export default function RecommendationCafeDetail({
  cafeId,
}: {
  cafeId: number;
}) {
  const router = useRouter();

  const session = useUserStore(state => state.session);

  const { recommendationCafes } = useRecommendationCafes();

  const recommendationCafedetail = recommendationCafes?.find(
    (cafe: ISupabaseRecommendationCafe) => cafe.id === cafeId,
  );

  if (!recommendationCafedetail) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>카페 정보를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const bookmarkData = {
    id: recommendationCafedetail.id,
    name: recommendationCafedetail.name,
    address: recommendationCafedetail.address,
    coordX: recommendationCafedetail.coordX,
    coordY: recommendationCafedetail.coordY,
  };

  const cafeData = {
    name: recommendationCafedetail.name,
    address: recommendationCafedetail.address,
    categories: recommendationCafedetail.categories,
  };

  const actionButtons = (
    <>
      {/* 로그인 상태. 이미 수집한 카페도 다시 수집할 수 있습니다 */}
      {session && (
        <CollectButton
          target={{
            placeId: recommendationCafedetail.id,
            name: recommendationCafedetail.name,
            address: recommendationCafedetail.address,
            coordX: recommendationCafedetail.coordX,
            coordY: recommendationCafedetail.coordY,
          }}
        />
      )}

      {/* 로그아웃 상태 */}
      {!session && (
        <Button onClick={() => router.push('/signin')} customClassName="flex-1">
          로그인하고 수집하기
        </Button>
      )}
    </>
  );

  return (
    <article className="flex h-full flex-col rounded-md">
      <CafeDetailHeader bookmarkData={bookmarkData} />
      <CafeDetailBody
        cafeId={cafeId}
        cafeData={cafeData}
        actionButtons={actionButtons}
      />
    </article>
  );
}
