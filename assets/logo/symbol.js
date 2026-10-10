/**
 * Cafe Masters — 로고 심볼 형상
 *
 * 겹친 카드 두 장. 모서리를 둥글리지 않고 잘라내(chamfer) 카드이면서
 * 동시에 광물 단면으로 읽히게 합니다. 네 모서리를 서로 다르게 자르는 것이
 * "모따기한 사각형"과 "쪼개진 결정"을 가릅니다.
 *
 * 브라우저(playground.html)와 Node(generate.cjs) 양쪽에서 같은 코드를 씁니다.
 * ES 모듈로 만들면 file:// 에서 CORS에 막혀 플레이그라운드가 안 열리므로
 * 고전 스크립트 형태를 유지합니다.
 */
(function (root) {
  const VIEW = 512;
  const MARGIN = 28;

  /** 확정 파라미터 — 플레이그라운드에서 조정한 값 */
  const DEFAULTS = {
    count: 2,
    aspect: 70,      // 카드 가로 / 세로 (%)
    dx: 40,          // 뒷장이 오른쪽으로 어긋난 정도
    dy: 33,          // 뒷장이 위로 어긋난 정도
    spread: 15,      // 장당 회전 (도)
    chamfer: 16,     // 모서리 컷 크기
    cjit: 30,        // 컷 불규칙 (%)
    seed: 9,
    gap: 6,          // 카드 사이 간격
    frame: 3,        // 앞장 테두리선 안쪽 여백. 0이면 선 없음
    fw: 3,           // 테두리선 굵기
  };

  /**
   * 16·32px 전용 덮어쓰기.
   *
   * 512 기준으로는 과해 보이지만 그 파일은 작은 크기에서만 쓰입니다.
   * 해상도가 표현 못 하는 디테일은 사라지는 게 아니라 회색 얼룩이 되므로,
   * 테두리선을 빼고 간격을 벌려 형태만 남깁니다.
   */
  const SMALL = { frame: 0, gap: 17 };

  /** 시드가 같으면 항상 같은 형태가 나오도록 해시로 흔듭니다 */
  function wobble(a, b, seed) {
    const x = Math.sin((a + 1) * 12.9898 + b * 78.233 + seed * 37.719) * 43758.5453;
    return (x - Math.floor(x)) * 2 - 1;
  }

  /** 네 모서리를 각각 다르게 잘라낸 카드 한 장의 꼭짓점 */
  function cardPoints(w, h, chamfers) {
    const [a, b, c, d] = chamfers;
    const x = w / 2, y = h / 2;
    return [
      [-x + a, -y], [x - b, -y], [x, -y + b],
      [x, y - c], [x - c, y], [-x + d, y],
      [-x, y - d], [-x, -y + a],
    ];
  }

  function transform(points, angleDeg, tx, ty) {
    const t = (angleDeg * Math.PI) / 180;
    const cos = Math.cos(t), sin = Math.sin(t);
    return points.map(([x, y]) => [x * cos - y * sin + tx, x * sin + y * cos + ty]);
  }

  function toPath(points) {
    return points
      .map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(2) + ' ' + p[1].toFixed(2))
      .join(' ') + ' Z';
  }

  function buildCards(P) {
    const h = 200;
    const w = h * (P.aspect / 100);
    const cards = [];

    for (let i = 0; i < P.count; i++) {
      const depth = P.count - 1 - i;   // 0 = 맨 앞장
      const chamfers = [0, 1, 2, 3].map(
        k => P.chamfer * (1 + (P.cjit / 100) * wobble(i * 4 + k, 1, P.seed))
      );
      const inner = chamfers.map(c => Math.max(c - P.frame, 2));
      const place = pts => transform(pts, depth * P.spread, depth * P.dx, -depth * P.dy);

      cards.push({
        outer: place(cardPoints(w, h, chamfers)),
        frameOuter: P.frame > 0 ? place(cardPoints(w - P.frame * 2, h - P.frame * 2, inner)) : null,
        frameInner: P.frame > 0
          ? place(cardPoints(w - (P.frame + P.fw) * 2, h - (P.frame + P.fw) * 2, inner))
          : null,
      });
    }
    return cards;
  }

  /** 파라미터를 바꿔도 마크의 시각적 무게가 일정하도록 항상 화면에 꽉 맞춥니다 */
  function fitAll(cards) {
    const all = cards.flatMap(c => c.outer);
    const xs = all.map(p => p[0]), ys = all.map(p => p[1]);
    const minX = Math.min(...xs), maxX = Math.max(...xs);
    const minY = Math.min(...ys), maxY = Math.max(...ys);
    const scale = (VIEW - MARGIN * 2) / Math.max(maxX - minX, maxY - minY);
    const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2;
    const apply = pts =>
      pts && pts.map(([x, y]) => [(x - cx) * scale + VIEW / 2, (y - cy) * scale + VIEW / 2]);

    return cards.map(c => ({
      outer: apply(c.outer),
      frameOuter: apply(c.frameOuter),
      frameInner: apply(c.frameInner),
    }));
  }

  function buildMarkup(P, color, idPrefix) {
    const cards = fitAll(buildCards(P));
    let defs = '', body = '';

    cards.forEach((card, i) => {
      /*
        단색 마크에서 카드끼리 겹치면 경계가 사라져 한 덩어리로 뭉칩니다.
        배경색으로 덧그리면 배경이 바뀔 때 깨지므로, 앞장들을 stroke까지 포함해
        마스크로 파냅니다. stroke는 절반이 바깥으로 나가므로 다각형 오프셋이 공짜로 나옵니다.
      */
      const inFront = cards.slice(i + 1);
      let maskAttr = '';

      if (inFront.length && P.gap > 0) {
        const id = `${idPrefix}-cut${i}`;
        const holes = inFront
          .map(f => `<path d="${toPath(f.outer)}" fill="#000" stroke="#000"`
            + ` stroke-width="${P.gap * 2}" stroke-linejoin="round"/>`)
          .join('');
        defs += `<mask id="${id}"><rect width="${VIEW}" height="${VIEW}" fill="#fff"/>${holes}</mask>`;
        maskAttr = ` mask="url(#${id})"`;
      }

      const d = card.frameOuter
        ? `${toPath(card.outer)} ${toPath(card.frameOuter)} ${toPath(card.frameInner)}`
        : toPath(card.outer);

      body += `<path d="${d}" fill="${color}" fill-rule="evenodd"${maskAttr}/>`;
    });

    return { defs, body };
  }

  function svgFor(P, color, idPrefix, size) {
    const { defs, body } = buildMarkup(P, color, idPrefix);
    const dimensions = size ? ` width="${size}" height="${size}"` : '';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VIEW} ${VIEW}"${dimensions}>`
      + (defs ? `<defs>${defs}</defs>` : '') + body + '</svg>';
  }

  root.CafeMastersSymbol = { VIEW, DEFAULTS, SMALL, buildMarkup, svgFor };
})(typeof module !== 'undefined' && module.exports ? module.exports : window);
