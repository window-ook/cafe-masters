'use client';

import Button from '@/components/shared/Button';
import {
  getPlaceBusyKey,
  ICollectTarget,
  usePackOpening,
} from '@/components/opening/PackOpeningProvider';

/**
 * 1탭 수집 버튼
 * @description 폼 없이 바로 수집합니다. 반경 안이면 개봉 연출로 이어지고, 아니면 미개봉 카드로 저장됩니다.
 * 이미 수집한 카페도 다시 수집할 수 있습니다(카드 = 방문). 진행 중에는 앱 전체에서 다른 시도를 막습니다.
 * @param target 수집할 카페. 이름·좌표가 준비되기 전에는 null을 넘겨 버튼을 막습니다
 */
export default function CollectButton({
  target,
}: {
  target: ICollectTarget | null;
}) {
  const { busyKey, busyLabel, collectCafe } = usePackOpening();

  const isMine = !!target && busyKey === getPlaceBusyKey(target.placeId);

  return (
    <Button
      dataTestId="button-collect"
      disabled={!target || busyKey !== null}
      onClick={() => {
        if (target) collectCafe(target);
      }}
      customClassName="flex-1"
    >
      <span>{isMine && busyLabel ? busyLabel : '수집하기'}</span>
    </Button>
  );
}
