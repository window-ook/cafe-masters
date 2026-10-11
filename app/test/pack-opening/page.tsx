'use client';

import { useState } from 'react';
import { notFound } from 'next/navigation';
import LazyPackOpeningViewer from '@/components/opening/LazyPackOpeningViewer';
import {
  getMaterialClass,
  LABRADORITE_MATERIAL,
  MATERIAL_WEIGHTS,
  type DrawnMaterial,
} from '@/utils/shared/material';

const MATERIALS = [
  ...Object.keys(MATERIAL_WEIGHTS),
  LABRADORITE_MATERIAL,
] as DrawnMaterial[];

/** S1 개봉 뷰어 검증용 테스트 라우트. 배포 환경에서는 404입니다 */
export default function PackOpeningTestPage() {
  const [material, setMaterial] = useState<DrawnMaterial>('mica');
  const [round, setRound] = useState(0);
  const [completeCount, setCompleteCount] = useState(0);
  /* 실제 동선(S2)처럼 페이지가 다 열린 뒤 탭해야 뷰어를 붙입니다. 로드 시간(ACC-02)을 그 조건으로 잽니다 */
  const [opened, setOpened] = useState(false);

  if (process.env.NODE_ENV === 'production') notFound();

  const replay = (next: DrawnMaterial) => {
    setMaterial(next);
    setCompleteCount(0);
    setRound(prev => prev + 1);
  };

  return (
    <main className="fixed inset-0 z-50 bg-neutral-950">
      {opened ? (
        <LazyPackOpeningViewer
          key={`${material}-${round}`}
          material={material}
          onComplete={() => setCompleteCount(prev => prev + 1)}
        />
      ) : (
        <button
          className="absolute top-1/2 left-1/2 -translate-1/2 rounded-full bg-white px-6 py-3 font-bold text-black hover:cursor-pointer"
          onClick={() => setOpened(true)}
        >
          개봉
        </button>
      )}
      <div className="absolute top-3 left-3 flex items-center gap-2 rounded bg-black/60 p-2 text-xs text-white">
        <select
          className="bg-transparent"
          value={material}
          onChange={event => replay(event.target.value as DrawnMaterial)}
        >
          {MATERIALS.map(item => (
            <option key={item} value={item} className="text-black">
              {item}
            </option>
          ))}
        </select>
        <button onClick={() => replay(material)}>다시</button>
        <span data-testid="complete-count">onComplete {completeCount}</span>
        <div
          className={`size-8 rounded ${getMaterialClass(material)}`}
          title="CSS 재질 바탕"
        />
      </div>
    </main>
  );
}
