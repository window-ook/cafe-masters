import { useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUIStore } from '@/stores/ui';
import { useCurrentCafeStore } from '@/stores/current-cafe';

/**
 * 카페 클릭 핸들러 공통 타입 인터페이스
 */
interface ICafeClickData {
  id: string | number;
  place_name?: string;
  coordX?: number;
  coordY?: number;
  x?: number;
  y?: number;
}

/**
 * 카페 클릭 핸들러 옵션
 */
interface ICafeClickHandlerOptions {
  routePath: string;
}

/**
 * 카페 클릭 핸들러 제네릭 훅
 * @template T - 카페 데이터 타입 (ICafeClickData를 확장해야 함)
 * @param options - 핸들러 옵션
 * @returns 카페 클릭 핸들러 함수
 */
export function useCafeClick<T extends ICafeClickData>(
  options: ICafeClickHandlerOptions
) {
  const router = useRouter();
  const pathname = usePathname();

  const openCafeDetail = useUIStore(state => state.openCafeDetail);
  const currentCafeId = useCurrentCafeStore(state => state.currentCafeId);
  const setCurrentCoordX = useCurrentCafeStore(state => state.setCurrentCoordX);
  const setCurrentCoordY = useCurrentCafeStore(state => state.setCurrentCoordY);

  const { routePath } = options;

  const handleCafeClick = useCallback((cafe: T) => {
    // ID 타입에 따른 비교 (string 또는 number)
    const cafeId = typeof cafe.id === 'string' ? cafe.id : Number(cafe.id);
    const currentId = typeof currentCafeId === 'string' ? currentCafeId : Number(currentCafeId);

    // 동일한 카페를 이미 보고 있을 때만 클릭 방지
    if (cafeId === currentId && pathname === `/${routePath}/detail/${cafe.id}`) return;

    // 좌표 설정 (coordX/coordY 또는 x/y 지원)
    const coordX = cafe.coordX ?? cafe.x ?? 0;
    const coordY = cafe.coordY ?? cafe.y ?? 0;
    setCurrentCoordX(coordX);
    setCurrentCoordY(coordY);

    // 통합 액션: 카페 상세 열기 (카페 ID 설정 + 슬라이딩 드로어 열기)
    const cafeIdAsNumber = typeof cafe.id === 'string' ? parseInt(cafe.id) : cafe.id;
    openCafeDetail(cafeIdAsNumber);

    // 라우팅 (카페 이름을 쿼리 파라미터로 포함)
    const cafeName = cafe.place_name;
    const url = cafeName
      ? `/${routePath}/detail/${cafe.id}?name=${encodeURIComponent(cafeName)}`
      : `/${routePath}/detail/${cafe.id}`;
    router.push(url);
  }, [
    currentCafeId,
    router,
    routePath,
    pathname,
    openCafeDetail,
    setCurrentCoordX,
    setCurrentCoordY
  ]);

  return handleCafeClick;
}