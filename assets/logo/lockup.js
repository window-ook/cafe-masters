/**
 * Cafe Masters — 락업 조합
 *
 * 심볼과 두 줄 워드마크를 배치합니다. 두 줄의 폭은 자간으로 자동 정렬합니다.
 *
 * 배치(layout)만 바꿔 세로형·가로형을 뽑습니다. 자형과 굵기, 간격이 같은
 * 파라미터에서 나오므로 어디서 봐도 같은 브랜드로 읽힙니다.
 */
(function (root, Symbol_, Type) {
  /** 확정 파라미터 — lockup.html에서 조정한 값 */
  const DEFAULTS = {
    weight: 25,      // 획 굵기
    topScale: 100,   // 윗줄(CAFE) 크기, 아랫줄 대비 %
    lineGap: 26,
    tracking: 7,     // 기준 자간
    symScale: 154,   // 심볼 크기, 워드마크 높이 대비 %
    symGap: 32,
    join: 'bevel',
    layout: 'stack', // stack | row
  };

  const BASE_SIZE = 100;

  /**
   * 두 줄의 폭을 맞춥니다.
   *
   * 더 넓은 쪽을 기준으로 삼고 좁은 쪽 자간을 역산합니다. 윗줄 크기를 키우면
   * 기준이 뒤집히므로 어느 쪽이 넓은지 매번 따져야 합니다. "짧은 단어를 벌린다"로
   * 고정하면 윗줄을 키우는 순간 자간이 음수가 되어 글자가 겹칩니다.
   */
  function buildWordmark(P) {
    const bottomOpts = { size: BASE_SIZE, weight: P.weight };
    const topOpts = {
      size: BASE_SIZE * (P.topScale / 100),
      weight: P.weight * (P.topScale / 100),
    };

    const target = Math.max(
      Type.baseWidth('MASTERS', bottomOpts) + P.tracking * 6,
      Type.baseWidth('CAFE', topOpts)
    );

    const top = Type.layout('CAFE', {
      ...topOpts,
      tracking: Type.trackingToWidth('CAFE', target, topOpts),
    });
    const bottom = Type.layout('MASTERS', {
      ...bottomOpts,
      tracking: Type.trackingToWidth('MASTERS', target, bottomOpts),
    });

    const drop = (lines, dy) => lines.map(l => l.map(([x, y]) => [x, y + dy]));

    return {
      top: top.polylines,
      bottom: drop(bottom.polylines, top.height + P.lineGap),
      width: target,
      height: top.height + P.lineGap + bottom.height,
      topWeight: topOpts.weight,
    };
  }

  function buildLockup(P, color, id) {
    const word = buildWordmark(P);
    const symbolSize = word.height * (P.symScale / 100);
    const hasSymbol = symbolSize > 1;

    let totalW = word.width, totalH = word.height;
    let wordX = 0, wordY = 0, symX = 0, symY = 0;

    if (hasSymbol && P.layout === 'stack') {
      totalW = Math.max(word.width, symbolSize);
      totalH = symbolSize + P.symGap + word.height;
      symX = (totalW - symbolSize) / 2;
      wordX = (totalW - word.width) / 2;
      wordY = symbolSize + P.symGap;
    } else if (hasSymbol) {
      totalW = symbolSize + P.symGap + word.width;
      totalH = Math.max(word.height, symbolSize);
      symY = (totalH - symbolSize) / 2;
      wordX = symbolSize + P.symGap;
      wordY = (totalH - word.height) / 2;
    }

    const pad = P.weight;
    const view = `0 0 ${(totalW + pad * 2).toFixed(1)} ${(totalH + pad * 2).toFixed(1)}`;
    let defs = '', body = '';

    if (hasSymbol) {
      const mark = Symbol_.buildMarkup(Symbol_.DEFAULTS, color, id + 'sym');
      defs += mark.defs;
      body += `<g transform="translate(${(pad + symX).toFixed(1)} ${(pad + symY).toFixed(1)})`
        + ` scale(${(symbolSize / Symbol_.VIEW).toFixed(4)})">${mark.body}</g>`;
    }

    // 윗줄과 아랫줄은 획 굵기가 다르므로 따로 그립니다
    const place = lines => lines.map(l => l.map(([x, y]) => [x + pad + wordX, y + pad + wordY]));
    body += Type.markup(place(word.top), { weight: word.topWeight, join: P.join, color });
    body += Type.markup(place(word.bottom), { weight: P.weight, join: P.join, color });

    return { view, defs, body, ratio: (totalW + pad * 2) / (totalH + pad * 2) };
  }

  function svgFor(P, color, id, width) {
    const { view, defs, body, ratio } = buildLockup(P, color, id);
    const size = width ? ` width="${width}" height="${(width / ratio).toFixed(1)}"` : '';
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${view}"${size}>`
      + (defs ? `<defs>${defs}</defs>` : '') + body + '</svg>';
  }

  root.CafeMastersLockup = { DEFAULTS, buildWordmark, buildLockup, svgFor };
})(
  typeof module !== 'undefined' && module.exports ? module.exports : window,
  (typeof module !== 'undefined' && module.exports
    ? require('./symbol.js') : window).CafeMastersSymbol,
  (typeof module !== 'undefined' && module.exports
    ? require('./lettering.js') : window).CafeMastersLettering
);
