import { useCallback, useRef } from 'react';

type useThrottleParams<T extends (...args: any[]) => void> = {
  callback: T;
  delay: number;
};

export default function useThrottle<T extends (...args: any[]) => void>({
  callback,
  delay,
}: useThrottleParams<T>) {
  const lastRun = useRef(Date.now());

  return useCallback(
    (...args: Parameters<T>) => {
      const timeElapsed = Date.now() - lastRun.current;
      if (timeElapsed >= delay) {
        callback(...args);
        lastRun.current = Date.now();
      }
    },
    [callback, delay]
  );
}
