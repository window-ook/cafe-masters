import { EXTERNAL_PATHS } from '@/lib/paths';
import { ExternalLink } from 'lucide-react';

/**
 * 카카오맵 장소 링크
 * @description 사진·메뉴·영업시간은 카카오맵 서비스 안에서만 볼 수 있어 직접 표시하지 않고 카카오맵으로 보냅니다
 * @param placeId 카카오 장소 ID. 수집 카드는 카드 ID가 아닌 place_id를 넘깁니다
 */
export default function KakaoMapLink({ placeId }: { placeId: string | number }) {
  return (
    <div className="col-span-2 grid grid-cols-3 items-center">
      <div className="col-span-1 flex items-center gap-1">
        <ExternalLink className="size-4" />
        <p className="font-medium">카카오맵</p>
      </div>
      <a
        href={EXTERNAL_PATHS.KAKAO_MAP_PLACE(placeId)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="카카오맵에서 장소 보기"
        className="col-span-2 text-sm underline underline-offset-2 hover:opacity-50"
      >
        카카오맵에서 보기
      </a>
    </div>
  );
}
