import { useRef, useCallback } from 'react';

type ThrottleCallback<T extends unknown[]> = (...args: T) => void;
type ThrottleCondition<T extends unknown[]> = (...args: T) => boolean;

export default function useThrottle<T extends unknown[]>(
  callback: ThrottleCallback<T>,
  delay: number = 5000,
  shouldThrottle: ThrottleCondition<T>,
) {
  const lastRun = useRef(0);

  const throttledFunction = useCallback(
    (...args: T) => {
      const now = Date.now();

      // 쓰로틀링 조건을 체크
      if (shouldThrottle(...args)) {
        // 쓰로틀링 적용
        if (now - lastRun.current >= delay) {
          callback(...args);
          lastRun.current = now;
        }
      } else {
        // 조건이 맞지 않으면 즉시 실행
        callback(...args);
      }
    },
    [callback, delay, shouldThrottle],
  );

  return throttledFunction;
}
