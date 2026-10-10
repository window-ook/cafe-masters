/**
 * Cafe Masters — 로고 자산 생성
 *
 *   node assets/logo/generate.cjs
 *
 * 로고는 이미지 한 장이 아니라 작은 자산 세트입니다. 쓰이는 자리마다
 * 요구하는 비율과 담을 수 있는 정보량이 다르기 때문입니다.
 *
 *   favicon 16px    1:1     심볼만. 글자는 물리적으로 불가능
 *   사이드바 헤더     가로     심볼 + 워드마크. 세로로 길면 헤더가 뚱뚱해짐
 *   팩 앞면          세로     락업 전체
 *
 * 자형과 굵기, 간격이 모두 같은 파라미터에서 나오므로 형제 관계가 유지됩니다.
 */
const fs = require('fs');
const path = require('path');

const Symbol_ = require('./symbol.js').CafeMastersSymbol;

const OUT_DIR = __dirname;

const ASSETS = [
  {
    name: 'symbol.svg',
    note: '48px 이상 · 앱 UI · 팩 상단 임프린트',
    svg: color => Symbol_.svgFor(Symbol_.DEFAULTS, color, 'sym'),
  },
  {
    name: 'symbol-small.svg',
    note: '16 · 32px favicon — 테두리선 제거, 간격 확대',
    svg: color => Symbol_.svgFor({ ...Symbol_.DEFAULTS, ...Symbol_.SMALL }, color, 'sms'),
  },
];

/*
  락업 SVG는 더 이상 만들지 않습니다.

  워드마크를 Anton으로 조판하기로 하면서, 락업은 "경로가 박힌 파일"이 아니라
  "심볼 + 텍스트 조합"이 되었습니다. 앱에서는 CSS가, 이미지가 필요한 곳에서는
  브라우저 래스터가 담당합니다. 폰트를 참조하는 SVG 파일은 폰트가 없는 환경에서
  깨지므로 배포용 자산으로 부적합합니다.
*/

for (const asset of ASSETS) {
  // currentColor로 두면 쓰는 쪽에서 CSS color만 바꿔 다크/라이트를 모두 커버합니다
  const svg = asset.svg('currentColor').replace('><', '>\n  <').replace(/><\/svg>$/, '>\n</svg>');
  fs.writeFileSync(path.join(OUT_DIR, asset.name), svg + '\n');

  const ratio = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
  const shape = ratio ? `${Math.round(ratio[1])}×${Math.round(ratio[2])}` : '';
  console.log(`  ${asset.name.padEnd(20)} ${shape.padStart(9)}   ${asset.note}`);
}

/*
  앱에서 쓸 React 컴포넌트도 함께 생성합니다.

  SVG 파일을 <img>로 불러오면 currentColor가 동작하지 않아 테마별 파일이 늘어납니다.
  인라인으로 넣어야 CSS color 하나로 다크/라이트를 모두 커버할 수 있습니다.

  JSX는 하이픈 속성을 카멜케이스로 요구하므로 변환해서 내보냅니다.
*/
const JSX_ATTRS = {
  'fill-rule': 'fillRule',
  'stroke-width': 'strokeWidth',
  'stroke-linejoin': 'strokeLinejoin',
  'stroke-linecap': 'strokeLinecap',
};

const toJsx = svg =>
  Object.entries(JSX_ATTRS).reduce((out, [from, to]) => out.split(from + '=').join(to + '='), svg)
    .replace(/^<svg[^>]*viewBox="([^"]+)"[^>]*>/, '')
    .replace(/<\/svg>\s*$/, '');

/*
  워드마크는 Anton으로 조판하므로 컴포넌트는 심볼만 내보냅니다.
  텍스트를 경로로 굽지 않는 편이 번들도 작고, 크기 조절도 CSS로 끝납니다.
*/
const symbolInner = toJsx(Symbol_.svgFor(Symbol_.DEFAULTS, 'currentColor', 'mark'));

const componentSource =
  `/** 겹친 카드 심볼 · 워드마크는 Anton으로 조판합니다 */\n`
  + `export function LogoSymbol({ className }: ILogoArtwork) {\n`
  + `  return (\n`
  + `    <svg viewBox="0 0 ${Symbol_.VIEW} ${Symbol_.VIEW}" fill="currentColor" aria-hidden className={className}>\n`
  + `      ${symbolInner}\n`
  + `    </svg>\n`
  + `  );\n}`;

const TSX_PATH = path.join(__dirname, '..', '..', 'components', 'shared', 'logo-artwork.tsx');

fs.writeFileSync(TSX_PATH,
  `/**\n`
  + ` * 이 파일은 assets/logo/generate.cjs가 생성합니다. 직접 수정하지 마세요.\n`
  + ` * 형태를 바꾸려면 assets/logo/symbol.js의 DEFAULTS를 고치고 생성기를 다시 실행하세요.\n`
  + ` */\n\n`
  + `export interface ILogoArtwork {\n  className?: string;\n}\n\n`
  + componentSource + '\n');

console.log(`  ${'logo-artwork.tsx'.padEnd(20)} ${String(componentSource.length).padStart(9)}자   `
  + `components/shared/ — 인라인 SVG 컴포넌트`);

console.log('\n  PNG는 playground.html의 내보내기 버튼을 쓰세요 — 브라우저가 가장 정확한 래스터라이저입니다.');
