/**
 * 카드 재질 - 세상이 정하는 축
 * @description 수집 시점에 무작위로 확정되며 이후 바뀌지 않습니다.
 * 홀로그램(별점)과 달리 유저가 조절할 수 없습니다.
 */
export type CardMaterial =
  | 'mica'
  | 'amber'
  | 'gold'
  | 'emerald'
  | 'amethyst'
  | 'obsidian';

/**
 * 발행이 중단된 재질
 * @description 위치 인증 도입 이전에 수집된 카드에만 남아 있습니다.
 * 광물 6종과 달리 인공물이므로 서열 밖에 있다는 것이 계열로 드러납니다.
 */
export const ARCHIVE_MATERIAL = 'archive';

/**
 * 확률 밖 재질 - 라브라도라이트
 * @description 각도에 따라 청색 섬광이 번쩍이는 장석입니다.
 * 뽑아서 얻는 것이 아니라 같은 카페를 거듭 찾아가 얻습니다.
 * 확률표를 건드리지 않으므로 흑요석의 최고 등급 지위와 충돌하지 않으며,
 * 서열 안이 아니라 서열 밖에 있다는 점에서 아카이브와 같은 계열입니다.
 */
export const LABRADORITE_MATERIAL = 'labradorite';

/** 수집하면 라브라도라이트가 확정되는 카페 */
export const LABRADORITE_CAFE_NAMES: string[] = [];

/**
 * 라브라도라이트가 확정되는 스택 순번
 * @description 같은 카페에서 이 순번째로 뽑는 카드가 확정됩니다(5 = 다섯 번째 카드).
 * 스택 두께는 유저가 조작할 수 없는 행동의 흔적이므로 발행 근거가 됩니다.
 */
export const LABRADORITE_STACK_ORDINAL = 5;

/** 수집으로 발행 가능한 재질 */
export type DrawnMaterial = CardMaterial | typeof LABRADORITE_MATERIAL;

/**
 * 재질별 출현 확률(%)
 * @description 합이 100이어야 합니다. 발행 속도가 실제 카페 방문에 묶여 있어
 * 주 3~5장이 상한이므로, 일반 TCG보다 완만하게 배분했습니다.
 */
export const MATERIAL_WEIGHTS: Record<CardMaterial, number> = {
  mica: 30,
  amber: 25,
  gold: 20,
  emerald: 15,
  amethyst: 8,
  obsidian: 2,
};

/** 수집하면 흑요석이 확정되는 카페 (이스터에그) */
export const OBSIDIAN_CAFE_NAMES = ['탐앤탐스 대구강북점'];

/**
 * 가중치에 따라 재질을 무작위로 뽑습니다
 * @description 반드시 서버에서만 호출합니다. 클라이언트에서 뽑으면 결과가
 * 마음에 들 때까지 재시도할 수 있고, 재질은 Market에서 화폐로 기능합니다.
 * 확정 재질을 먼저 판정하고, 해당되지 않을 때만 확률표를 돌립니다.
 * @param cafeName 카페 이름. 지정 카페면 재질이 확정됩니다
 * @param stackCount 같은 카페로 이미 보유한 카드 수. 임계값을 넘으면 라브라도라이트가 확정됩니다
 */
export const drawMaterial = (
  cafeName?: string | null,
  stackCount = 0,
): DrawnMaterial => {
  if (cafeName && LABRADORITE_CAFE_NAMES.includes(cafeName))
    return LABRADORITE_MATERIAL;

  /* stackCount는 이미 보유한 수이므로, 이번에 만들 카드의 순번은 +1입니다.
     그 순번에서만 확정되며 이후로는 확률표로 돌아갑니다.
     계속 확정하면 한 카페 반복 방문이 가장 싼 발행 경로가 되어 희소성이 무너집니다 */
  if (stackCount + 1 === LABRADORITE_STACK_ORDINAL) return LABRADORITE_MATERIAL;

  if (cafeName && OBSIDIAN_CAFE_NAMES.includes(cafeName)) return 'obsidian';

  const roll = Math.random() * 100;
  let cumulative = 0;

  for (const [material, weight] of Object.entries(MATERIAL_WEIGHTS)) {
    cumulative += weight;
    if (roll < cumulative) return material as CardMaterial;
  }

  return 'mica';
};

/**
 * 재질에 대응하는 카드 베이스 클래스를 반환합니다
 * @description material이 null이면 미개봉 상태이므로 베이스가 없습니다.
 * @param material 저장된 재질 값
 */
export const getMaterialClass = (material: string | null): string =>
  material ? `card-base-${material}` : '';

/**
 * 별점에 대응하는 홀로그램 클래스를 반환합니다
 * @description 별점이 없으면 빈 문자열을 반환하며, 그 상태가 무광입니다.
 * @param ratings 유저가 매긴 별점
 */
export const getHoloClass = (ratings: number | null): string =>
  ratings && ratings >= 1 && ratings <= 5 ? `card-holo-${ratings}` : '';
