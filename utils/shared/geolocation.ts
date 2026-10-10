'use client';

import { ICoordinates } from '@/utils/shared/geo';

/** 위치 조회 타임아웃 (ms) */
const GEOLOCATION_TIMEOUT_MS = 8_000;

/**
 * 직전에 측정한 위치를 재사용할 수 있는 시간 (ms)
 * @description 카페에 앉아 있는 동안 여러 번 수집할 때 매번 측위하면 느립니다.
 * 30초 사이에 움직여 봐야 반경 200m를 벗어나지 않습니다.
 */
const GEOLOCATION_MAX_AGE_MS = 30_000;

/**
 * 현재 위치를 조회
 * @description 권한 거부, 측위 실패, 타임아웃을 모두 null로 흡수합니다.
 * 위치를 얻지 못해도 수집 자체는 진행되어야 하므로 예외를 던지지 않습니다.
 * 이 함수를 호출하는 시점에 브라우저가 권한 팝업을 띄우므로,
 * 첫 진입이 아니라 수집을 시도하는 순간에만 호출해야 합니다.
 */
export const getCurrentCoordinates = (): Promise<ICoordinates | null> =>
  new Promise(resolve => {
    if (typeof navigator === 'undefined' || !navigator.geolocation)
      return resolve(null);

    navigator.geolocation.getCurrentPosition(
      position =>
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }),
      () => resolve(null),
      {
        enableHighAccuracy: true,
        timeout: GEOLOCATION_TIMEOUT_MS,
        maximumAge: GEOLOCATION_MAX_AGE_MS,
      },
    );
  });
