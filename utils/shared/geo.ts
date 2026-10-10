/** 지구 평균 반지름 (m) */
const EARTH_RADIUS_M = 6_371_000;

/**
 * 카페 수집 시 허용하는 최대 거리 (m)
 * @description 실내에서는 GPS가 Wi-Fi 측위로 대체되어 오차가 20~100m에 이릅니다.
 * 카페에 있는데 인증이 실패하는 쪽이 반경이 넓은 쪽보다 훨씬 나쁘므로 넉넉하게 잡습니다.
 */
export const COLLECT_RADIUS_M = 200;

/**
 * 위경도 좌표
 * @description Supabase의 coordY가 위도, coordX가 경도입니다.
 * 축을 헷갈리지 않도록 항상 이 형태로 변환해 넘깁니다.
 */
export interface ICoordinates {
  lat: number;
  lng: number;
}

const toRadians = (degree: number): number => (degree * Math.PI) / 180;

/**
 * 두 좌표 사이의 실제 거리를 미터 단위로 반환
 * @description Haversine 공식을 사용합니다.
 * @param from 기준 좌표
 * @param to 대상 좌표
 */
export const getDistanceInMeters = (
  from: ICoordinates,
  to: ICoordinates,
): number => {
  const deltaLat = toRadians(to.lat - from.lat);
  const deltaLng = toRadians(to.lng - from.lng);

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(toRadians(from.lat)) *
      Math.cos(toRadians(to.lat)) *
      Math.sin(deltaLng / 2) ** 2;

  return EARTH_RADIUS_M * 2 * Math.asin(Math.sqrt(a));
};

/**
 * 대상 좌표가 허용 반경 안에 있는지 판단
 * @param from 사용자의 현재 좌표
 * @param to 카페 좌표
 * @param radiusM 허용 반경(m). 기본값은 COLLECT_RADIUS_M
 */
export const isWithinRadius = (
  from: ICoordinates,
  to: ICoordinates,
  radiusM: number = COLLECT_RADIUS_M,
): boolean => getDistanceInMeters(from, to) <= radiusM;
