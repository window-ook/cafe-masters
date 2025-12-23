'use client';

import { IMAGE_PATHS } from '@/lib/paths';

interface IPolaroidCardLayout {
  id: string;
  imageUrl: string;
  rotation: number;
  position: {
    x: number;
    y: number;
    z: number;
  };
  scale: number;
  delay: number;
}

/**
 * 폴라로이드 카드 레이아웃 훅
 * @param count - 생성할 카드 개수
 * @returns {IPolaroidCardLayout[]} 폴라로이드 카드 레이아웃 배열
 */
export const usePolaroidLayout = (count: number = 9): IPolaroidCardLayout[] => {
  const images = Object.values(IMAGE_PATHS.POLAROID_IMAGES);

  const cards: IPolaroidCardLayout[] = [];

  const rotations = [-12, 8, -5, 15, -8, 10, -15, 6];
  const scales = [0.9, 1.1, 0.95, 1.05, 0.85, 1.15, 1.0, 0.9];

  for (let i = 0; i < count; i++) {
    const imageIndex = i % images.length;

    const rotation = rotations[i % rotations.length];
    const scale = scales[i % scales.length];

    const xPercent = (i % 3) * 33 + 20;
    const yPercent = Math.floor(i / 3) * 30 + 10;

    const x = xPercent - 10;
    const y = yPercent - 10;
    const z = i;

    const delay = i * 0.1;

    cards.push({
      id: `polaroid-${i}`,
      imageUrl: images[imageIndex],
      rotation,
      position: { x, y, z },
      scale,
      delay,
    });
  }

  return cards;
};
