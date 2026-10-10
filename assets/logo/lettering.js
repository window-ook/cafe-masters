/**
 * Cafe Masters — 커스텀 레터링
 *
 * 글자를 외곽선이 아니라 스트로크 골격으로 정의합니다. 뼈대 선만 두고
 * 굵기는 stroke-width가, 모서리 모따기는 stroke-linejoin="bevel"이 처리합니다.
 * 심볼의 chamfer와 같은 언어를 훨씬 적은 좌표로 얻습니다.
 *
 * 곡선은 짧은 직선으로 근사합니다. C와 S가 팔각형처럼 각지게 나오는데,
 * 이것이 결함이 아니라 의도한 결정 언어입니다.
 *
 * 좌표계는 캡 높이 100 기준이며 y=0이 캡라인, y=100이 베이스라인입니다.
 */
(function (root) {
  /** 글자별 골격. w는 자폭(획 굵기를 뺀 뼈대 기준) */
  const GLYPHS = {
    C: { w: 68, strokes: [[[68, 20], [50, 0], [18, 0], [0, 22], [0, 78], [18, 100], [50, 100], [68, 80]]] },
    A: { w: 72, strokes: [[[0, 100], [36, 0], [72, 100]], [[13, 66], [59, 66]]] },
    F: { w: 58, strokes: [[[0, 100], [0, 0], [56, 0]], [[0, 52], [46, 52]]] },
    E: { w: 58, strokes: [[[58, 0], [0, 0], [0, 100], [58, 100]], [[0, 52], [46, 52]]] },
    M: { w: 86, strokes: [[[0, 100], [0, 0], [43, 56], [86, 0], [86, 100]]] },
    S: {
      w: 64,
      strokes: [[[64, 18], [46, 0], [18, 0], [0, 18], [0, 32], [18, 50],
                 [46, 50], [64, 68], [64, 82], [46, 100], [18, 100], [0, 82]]],
    },
    T: { w: 66, strokes: [[[0, 0], [66, 0]], [[33, 0], [33, 100]]] },
    R: {
      w: 66,
      strokes: [[[0, 100], [0, 0], [46, 0], [66, 20], [66, 36], [46, 56], [0, 56]],
                [[38, 56], [66, 100]]],
    },
  };

  /**
   * 글자들을 배치해 폴리라인 목록과 전체 폭을 돌려줍니다.
   *
   * 획이 뼈대 양쪽으로 weight/2씩 번지므로, 자간을 계산할 때 그만큼을
   * 자폭에 더해야 글자끼리 붙지 않습니다.
   */
  function layout(text, { size, weight, tracking }) {
    const scale = size / 100;
    const polylines = [];
    let cursor = weight / 2;

    [...text].forEach((char, index) => {
      const glyph = GLYPHS[char];
      if (!glyph) return;

      for (const stroke of glyph.strokes) {
        polylines.push(stroke.map(([x, y]) => [cursor + x * scale, weight / 2 + y * scale]));
      }
      cursor += glyph.w * scale + weight;
      if (index < text.length - 1) cursor += tracking;
    });

    return { polylines, width: cursor - weight / 2, height: size + weight };
  }

  /** 자간 0일 때의 폭. 자간을 역산할 때 기준이 됩니다 */
  function baseWidth(text, { size, weight }) {
    return layout(text, { size, weight, tracking: 0 }).width;
  }

  /**
   * 짧은 단어를 긴 단어의 폭에 맞추는 자간을 역산합니다.
   *
   * 폭은 자간에 대해 선형이라 나눗셈 한 번이면 나옵니다.
   * 인쇄 디자인에서 짧은 단어를 늘려 폭을 맞추는 정석 장치입니다.
   */
  function trackingToWidth(text, targetWidth, options) {
    const gaps = [...text].length - 1;
    if (gaps <= 0) return 0;

    return (targetWidth - baseWidth(text, options)) / gaps;
  }

  function toPath(points) {
    return points
      .map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(2) + ' ' + p[1].toFixed(2))
      .join(' ');
  }

  function markup(polylines, { weight, join, color }) {
    return polylines
      .map(line => `<path d="${toPath(line)}" fill="none" stroke="${color}"`
        + ` stroke-width="${weight}" stroke-linejoin="${join}" stroke-linecap="butt"/>`)
      .join('');
  }

  root.CafeMastersLettering = { GLYPHS, layout, baseWidth, trackingToWidth, markup };
})(typeof module !== 'undefined' && module.exports ? module.exports : window);
