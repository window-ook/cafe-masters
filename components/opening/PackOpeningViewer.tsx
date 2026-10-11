'use client';

import { Suspense, useRef, type UIEvent } from 'react';
import { Canvas, invalidate } from '@react-three/fiber';
import { AgXToneMapping } from 'three';
import PackScene from '@/components/opening/PackScene';
import { ErrorBoundaryWrapper } from '@/components/shared/ErrorBoundaryWrapper';
import type { DrawnMaterial } from '@/utils/shared/material';

export interface IPackOpeningViewer {
  /** 서버가 뽑은 재질. 카드 앞면을 이 재질로 교체합니다 */
  material: DrawnMaterial;
  /** 진행도 100% 도달, 스킵, 로드 실패 시 1회 호출됩니다 */
  onComplete: () => void;
}

/**
 * 카드팩 개봉 뷰어
 * @description 스크롤 진행도가 곧 애니메이션 프레임입니다. 진행도의 출처는 스크롤 위치 하나뿐이고
 * ref로만 다뤄 리렌더가 없습니다. 스크롤할 때만 invalidate()하므로 손을 떼면 렌더도 멈춥니다.
 * 건너뛰기는 버튼으로만 합니다. 화면 탭으로 건너뛰면 실수 탭에 연출이 끝나 버립니다.
 */
export default function PackOpeningViewer({
  material,
  onComplete,
}: IPackOpeningViewer) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const completedRef = useRef(false);

  const complete = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete();
  };

  const handleScroll = (event: UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    const scrollable = scrollHeight - clientHeight;
    /* scrollHeight는 정수로 반올림되고 scrollTop은 소수라서 끝에서도 1에 못 미칠 수 있습니다 */
    const progress =
      scrollable - scrollTop <= 1
        ? 1
        : Math.min(Math.max(scrollTop / scrollable, 0), 1);
    progressRef.current = progress;
    invalidate();
    if (progress === 1) complete();
  };

  /* 스크롤을 끝으로 보냅니다. 진행도는 handleScroll이 스크롤 위치에서 다시 계산합니다 */
  const handleSkip = () =>
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });

  return (
    <div
      ref={scrollRef}
      className="relative size-full overflow-y-auto overscroll-contain"
      onScroll={handleScroll}
    >
      <div className="sticky top-0 h-full">
        <ErrorBoundaryWrapper
          featureName="PackOpeningViewer"
          message="개봉 연출을 불러오지 못했습니다."
          onError={complete}
        >
          <Canvas
            frameloop="demand"
            dpr={[1, 2]}
            onCreated={({ gl }) => (gl.toneMapping = AgXToneMapping)}
          >
            <Suspense fallback={null}>
              <PackScene material={material} progressRef={progressRef} />
            </Suspense>
          </Canvas>
        </ErrorBoundaryWrapper>
        <button
          type="button"
          className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/15 px-3 py-1.5 text-sm text-white hover:cursor-pointer"
          onClick={handleSkip}
        >
          건너뛰기
        </button>
      </div>
      <div className="h-[220vh]" aria-hidden />
    </div>
  );
}
