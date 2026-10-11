'use client';

import dynamic from 'next/dynamic';
import { preload } from 'react-dom';
import type { IPackOpeningViewer } from '@/components/opening/PackOpeningViewer';
import { IMAGE_PATHS } from '@/lib/paths';

/** R3F 전체를 별도 청크로 분리합니다. 외부에서는 이 래퍼만 import합니다 */
const PackOpeningViewer = dynamic(
  () => import('@/components/opening/PackOpeningViewer'),
  {
    ssr: false,
  },
);

/**
 * 뷰어 청크를 받는 동안 GLB와 카드 면도 함께 받습니다
 * @description 미리 받지 않으면 청크 → GLB → 카드 면 순서로 요청이 줄줄이 이어집니다.
 * crossOrigin은 GLTFLoader의 fetch, TextureLoader의 img와 맞춰야 캐시가 재사용됩니다.
 */
export default function LazyPackOpeningViewer(props: IPackOpeningViewer) {
  preload(IMAGE_PATHS.PACK_GLB, { as: 'fetch', crossOrigin: 'anonymous' });
  preload(IMAGE_PATHS.CARD_ART(props.material), {
    as: 'image',
    crossOrigin: 'anonymous',
  });

  return <PackOpeningViewer {...props} />;
}
