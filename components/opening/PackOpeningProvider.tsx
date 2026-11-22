'use client';

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { usePathname } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useUserStore } from '@/stores';
import {
  useCreateCollectionCafe,
  useOpenCollectionCafe,
} from '@/hooks/supabase/collection';
import { collectionCafeQuery } from '@/queries/supabase/collection';
import { getCurrentCoordinates } from '@/utils/shared/geolocation';
import { isWithinRadius } from '@/utils/shared/geo';
import { PLACE_PROVIDER } from '@/utils/constants/place';
import {
  CONSOLE_ERROR,
  TOAST_ERROR,
  TOAST_SUCCESS,
  TOAST_WARN,
} from '@/utils/constants/messages';
import type { DrawnMaterial } from '@/utils/shared/material';
import PackOpeningModal from '@/components/opening/PackOpeningModal';

/** 개봉할 미개봉 카드. 좌표는 서버가 다시 검증하며 여기서는 빠른 안내에만 씁니다 */
export interface IOpenTarget {
  id: number;
  coordX: number;
  coordY: number;
}

/** 1탭으로 수집할 카페. 약관상 저장할 수 있는 필드만 받습니다 */
export interface ICollectTarget {
  placeId: string | number;
  name: string;
  address: string;
  coordX: number;
  coordY: number;
}

type TPhase = 'idle' | 'locating' | 'saving' | 'playing';
type TAttemptKind = 'open' | 'create';

/** 진행 중인 시도. 늦게 온 응답이 다른 사용자·다른 화면에 반영되지 않도록 시작 시점을 기억합니다 */
interface IAttempt {
  kind: TAttemptKind;
  userId: string;
  pathname: string;
}

interface IPackOpeningContext {
  /** 진행 중인 대상. 카드는 `card-{id}`, 수집은 `place-{장소 ID}`입니다 */
  busyKey: string | null;
  /** 진행 중인 대상에 띄울 문구 */
  busyLabel: string | null;
  openCard: (card: IOpenTarget) => void;
  collectCafe: (cafe: ICollectTarget) => void;
}

const PackOpeningContext = createContext<IPackOpeningContext | null>(null);

export const getCardBusyKey = (id: number) => `card-${id}`;
export const getPlaceBusyKey = (placeId: string | number) => `place-${placeId}`;

const BUSY_LABEL: Record<TAttemptKind, Record<'locating' | 'saving', string>> = {
  open: { locating: '위치 확인 중…', saving: '개봉 준비 중…' },
  create: { locating: '위치 확인 중…', saving: '수집 중…' },
};

/**
 * 카드 개봉·1탭 수집의 공통 소유자
 * @description 앱 전체에서 한 번에 한 시도만 진행합니다. 저장은 모달을 열기 전에 끝나고,
 * 모달의 완료는 저장 결과를 화면에 반영하는 신호일 뿐입니다. 캐시는 완료 시점에 한 번만 무효화합니다.
 */
export function PackOpeningProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const userId = useUserStore(state => state.session?.user?.id ?? '');

  const { createCollectionCafe } = useCreateCollectionCafe();
  const { openCollectionCafe } = useOpenCollectionCafe();

  const [phase, setPhase] = useState<TPhase>('idle');
  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [kind, setKind] = useState<TAttemptKind>('open');
  const [material, setMaterial] = useState<DrawnMaterial | null>(null);

  const attemptRef = useRef<IAttempt | null>(null);
  const userIdRef = useRef(userId);
  const pathnameRef = useRef(pathname);

  useEffect(() => {
    userIdRef.current = userId;
    pathnameRef.current = pathname;
  }, [userId, pathname]);

  /** 시작한 뒤 사용자나 화면이 바뀌었으면 결과를 보여 주지 않습니다 */
  const isCurrent = useCallback(
    (attempt: IAttempt) =>
      attemptRef.current === attempt &&
      userIdRef.current === attempt.userId &&
      pathnameRef.current === attempt.pathname,
    [],
  );

  const reset = useCallback(() => {
    attemptRef.current = null;
    setPhase('idle');
    setBusyKey(null);
    setMaterial(null);
  }, []);

  /** 저장 결과를 다시 읽습니다. 다시 읽기 실패는 저장 실패가 아니므로 안내만 합니다 */
  const refreshCollection = useCallback(
    async (targetUserId: string, withCounts: boolean) => {
      const queryKeys = [
        collectionCafeQuery.all(targetUserId),
        ...(withCounts ? [collectionCafeQuery.counts(targetUserId)] : []),
      ];
      await Promise.all(
        queryKeys.map(queryKey => queryClient.invalidateQueries({ queryKey })),
      );
      const isRefetchFailed = queryKeys.some(
        queryKey => queryClient.getQueryState(queryKey)?.status === 'error',
      );
      if (isRefetchFailed) toast.warning(TOAST_WARN.REFETCH_AFTER_SAVE);
    },
    [queryClient],
  );

  /** 진입 함수가 렌더 값을 붙잡지 않도록 사용자·경로는 ref에서 읽습니다 */
  const begin = useCallback(
    (attemptKind: TAttemptKind, key: string): IAttempt | null => {
      if (attemptRef.current || !userIdRef.current) return null;
      const attempt = {
        kind: attemptKind,
        userId: userIdRef.current,
        pathname: pathnameRef.current,
      };
      attemptRef.current = attempt;
      setKind(attemptKind);
      setBusyKey(key);
      setPhase('locating');
      return attempt;
    },
    [],
  );

  const play = useCallback((drawn: DrawnMaterial) => {
    setMaterial(drawn);
    setPhase('playing');
  }, []);

  const openCard = useCallback(async (card: IOpenTarget) => {
    const attempt = begin('open', getCardBusyKey(card.id));
    if (!attempt) return;

    const userCoords = await getCurrentCoordinates();
    if (!isCurrent(attempt)) return reset();
    if (!userCoords) {
      toast.warning(TOAST_WARN.LOCATION_UNAVAILABLE);
      return reset();
    }
    /* 서버도 저장된 카드 좌표로 다시 판정합니다. 여기서는 헛걸음 요청만 줄입니다 */
    if (!isWithinRadius(userCoords, { lat: card.coordY, lng: card.coordX })) {
      toast.warning(TOAST_WARN.OPEN_OUT_OF_RADIUS);
      return reset();
    }

    setPhase('saving');
    let drawn: DrawnMaterial | null;
    try {
      drawn = await openCollectionCafe({ id: card.id, userCoords });
    } catch (error) {
      /* 다른 탭에서 먼저 개봉했을 수도 있으니 실제 상태를 다시 읽습니다. 재추첨하지 않습니다 */
      console.error(CONSOLE_ERROR.OPEN_COLLECTION_CAFE, error);
      toast.error(TOAST_ERROR.OPEN_COLLECTION);
      reset();
      void refreshCollection(attempt.userId, false);
      return;
    }

    if (drawn === null) {
      toast.warning(TOAST_WARN.DAILY_DRAW_LIMIT);
      return reset();
    }
    if (!isCurrent(attempt)) {
      reset();
      void refreshCollection(attempt.userId, false);
      return;
    }
    play(drawn);
  }, [begin, isCurrent, reset, refreshCollection, openCollectionCafe, play]);

  const collectCafe = useCallback(async (cafe: ICollectTarget) => {
    const attempt = begin('create', getPlaceBusyKey(cafe.placeId));
    if (!attempt) return;

    /* 위치를 얻지 못해도 미개봉 카드로 저장합니다 */
    const userCoords = await getCurrentCoordinates();
    if (!isCurrent(attempt)) return reset();

    setPhase('saving');
    let created: Awaited<ReturnType<typeof createCollectionCafe>>;
    try {
      created = await createCollectionCafe({
        cafe: {
          place_provider: PLACE_PROVIDER,
          place_id: String(cafe.placeId),
          name: cafe.name,
          address: cafe.address,
          coordX: cafe.coordX,
          coordY: cafe.coordY,
          image: null,
          ratings: 0,
          categories: JSON.stringify([]),
          comment: '',
          eaten_menus: '',
          pros: '',
          cons: '',
        },
        userCoords,
      });
    } catch (error) {
      /* 저장됐는데 응답만 잃었을 수 있습니다. 다시 INSERT하지 않고 목록을 다시 읽습니다 */
      console.error(CONSOLE_ERROR.CREATE_COLLECTION_CAFE, error);
      toast.warning(TOAST_WARN.COLLECT_RESULT_UNKNOWN);
      reset();
      void refreshCollection(attempt.userId, true);
      return;
    }

    if (created === null) {
      toast.warning(TOAST_WARN.DAILY_DRAW_LIMIT);
      return reset();
    }
    /* 담아 둔 미개봉 카드를 대신 개봉했으면 카드 수는 그대로이고 안내도 개봉으로 합니다 */
    const resultKind: TAttemptKind = created.isNew ? 'create' : 'open';

    if (created.material === null || !isCurrent(attempt)) {
      const isSameUser = userIdRef.current === attempt.userId;
      reset();
      void refreshCollection(attempt.userId, created.isNew);
      if (isSameUser)
        toast.success(
          created.material === null
            ? TOAST_SUCCESS.UNOPENED_COLLECTION
            : resultKind === 'create'
              ? TOAST_SUCCESS.CREATE_COLLECTION
              : TOAST_SUCCESS.OPEN_COLLECTION,
        );
      return;
    }
    attemptRef.current = { ...attempt, kind: resultKind };
    play(created.material);
  }, [begin, isCurrent, reset, refreshCollection, createCollectionCafe, play]);

  /** 연출 끝·건너뛰기·닫기·Esc가 겹쳐도 한 번만 처리합니다 */
  const complete = useCallback(() => {
    const attempt = attemptRef.current;
    if (!attempt) return;
    reset();
    void refreshCollection(attempt.userId, attempt.kind === 'create');
    toast.success(
      attempt.kind === 'create'
        ? TOAST_SUCCESS.CREATE_COLLECTION
        : TOAST_SUCCESS.OPEN_COLLECTION,
    );
  }, [reset, refreshCollection]);

  /* 모달이 화면을 덮고 있어 연출 중에 화면이 바뀌는 길은 뒤로 가기뿐입니다. 저장 결과만 반영하고 닫습니다 */
  useEffect(() => {
    if (phase !== 'playing') return;
    window.addEventListener('popstate', complete);
    return () => window.removeEventListener('popstate', complete);
  }, [phase, complete]);

  const busyLabel =
    phase === 'locating' || phase === 'saving' ? BUSY_LABEL[kind][phase] : null;

  const value = useMemo(
    () => ({ busyKey, busyLabel, openCard, collectCafe }),
    [busyKey, busyLabel, openCard, collectCafe],
  );

  return (
    <PackOpeningContext.Provider value={value}>
      {children}
      <PackOpeningModal
        material={phase === 'playing' ? material : null}
        onCloseAction={complete}
      />
    </PackOpeningContext.Provider>
  );
}

/** 카드 개봉·1탭 수집 진입 함수와 진행 상태 */
export function usePackOpening() {
  const context = useContext(PackOpeningContext);
  if (!context)
    throw new Error('usePackOpening은 PackOpeningProvider 안에서 써야 합니다.');
  return context;
}
