# 카드팩 개봉 연출 — 작업 인계

Blender로 만든 카드팩 3D 개봉 애니메이션. 스크롤 스크럽으로 재생할 GLB를 뽑는 것이 목표.

---

## 1. 지금 돌아가는 것

```
pack_generator.py     씬 전체를 만드는 스크립트. 이것이 진실의 원천
card_pack.glb         220 KB — 메시 3 + 애니메이션 2클립 + UV + 텍스처 임베드
pack_art.png          임시 인쇄 (절차적 생성). 실제 아트워크로 덮어쓰면 자동으로 밀려남
pack_art_guide.png    아트워크를 그릴 때 배경으로 깔 가이드
art_builder.py        pack_art.png · card_art.png · card_art/*.png · card_back.png를 굽는 합성기
card_art.png          GLB에 임베드되는 카드 면. 미개봉(card-unopened) 바탕
card_art/<재질>.png   재질별 카드 면. 바탕은 app/card-styles.css의 card-base-*에서 직접 파싱
card_back.png         카드 뒷면. 실물 TCG처럼 모든 카드 공통이라 GLB에 임베드
```

### 카드 색 교체 (웹 연동 계약)

GLB의 카드는 항상 미개봉 면으로 나간다. 개봉 시 서버가 돌려준 재질
(`openCollectionCafe`의 반환값)에 맞춰 웹이 `CardPlaceholder` 머티리얼의 `map`을
`card_art/<재질>.png`로 갈아 끼운다. 재질을 받기 전에는 특정 재질이 보이지 않아야 하므로
재질별 면을 GLB에 넣지 않는다.

교체 텍스처는 glTF 규약에 맞춰 `flipY = false`, `colorSpace = SRGBColorSpace`로 로드할 것.
`Card`는 프리미티브 3개라 three.js에서는 자식 메시 3개를 가진 그룹으로 로드된다.
메시가 아니라 머티리얼 이름(`CardPlaceholder`)으로 찾아야 뒷면 · 옆면을 건드리지 않는다.
바탕만 옮겼고 위에 겹친 결(운모 층리 · 호박 기포 · 자수정 결정면 · `::before` 텍스처)은 없다.

**`.blend` 파일은 만들지 않는다.** 스크립트를 다시 돌리면 씬이 통째로 재생성되므로,
모든 조정은 파라미터를 고치고 재실행하는 방식으로 한다. 조정 이력이 diff로 남는다는
부수 효과가 크다.

### 실행

```bash
# Blender를 띄우면서 MCP 서버 자동 시작 (애드온은 이미 설치·활성화되어 있음)
blender --python-expr "
import bpy
bpy.app.timers.register(lambda: (bpy.ops.blendermcp.start_server(), None)[1], first_interval=1.5)
"
```

애드온 위치: `~/Library/Application Support/Blender/5.2/scripts/addons/blender_mcp_addon.py`
(레거시 애드온 경로가 Blender 5.2에서도 동작함을 확인함)

MCP 연결 후에는 `execute_blender_code`로 아래를 실행:

```python
import runpy
runpy.run_path("<repo>/assets/blender/pack_generator.py", run_name="__main__")
```

---

## 2. 확정된 설계

### 구조

```
PackPouch    아래 주머니. 고정. 톱니 rim을 남기고 카드를 품음
TearStrip    뜯겨 나가는 조각. origin이 오른쪽 끝에 있어 그 점을 축으로 벌어짐
Card         실제 규격 두께(0.3/63)·모서리 반경(3/63)의 얇은 상자. 슬롯 0 앞면(CardPlaceholder) · 1 뒷면(CardBack) · 2 옆면(CardEdge)
             텍스처는 직사각형 그대로이고 모서리는 메시가 자른다. 외곽 테두리는 round_corners()가 호를 따라 덧칠
PackRoot     전부를 묶는 부모 empty. yaw 15°
```

### 타이밍 (60프레임)

```
 1 ~ 30    오른쪽 끝을 축으로 윗부분이 쐐기꼴로 벌어지며 뜯김
           (1~18에 85%, 18~30에 나머지 15% — 초반 가속)
26 ~ 60    카드가 톱니 rim 사이로 상승
30 ~ 60    잘린 조각이 회전하며 프레임 밖으로 (46프레임에 진행도 28% — 느리게 시작)
```

키프레임은 **전부 LINEAR**. 스크롤 진행도와 프레임이 1:1로 대응해야 하는데,
베지어를 쓰면 Blender 커브와 웹 스크롤 매핑이 이중으로 걸려 예측이 불가능해진다.
이징은 커브가 아니라 **구간 배분**으로 만든다.

### pillow pack 마감

실제 TCG 부스터 팩 구조를 따름. 네 변이 다 실링된 것이 아니다.

```
좌우      필름이 접힌 fold. 두께가 0으로 수렴하며 둥글게 말림
상하      압착 크림프 실링. 납작한 flange에 죠(jaw)의 이빨 자국
뒷면 중앙  핀 실 — 필름 양 끝을 맞물려 붙인 세로 융기. 상하 크림프에서 소멸
```

이 구조 덕에 이빨 자국이 x 방향으로만 변해 격자 컬럼(53개)으로 충분하다.
네 변을 다 실링했다면 z 방향 해상도까지 필요해 정점이 4배로 늘었을 것.

---

## 3. 아트워크 규격 (다음 작업의 핵심)

`pack_art.png`를 이 규격으로 만들면 자동으로 입혀진다.

```
캔버스        2048 × 1485
u 0.0~0.5     앞면 (1024px)        u 0.5~1.0  뒷면 (전개도로 이어짐)
v 0 = 팩 바닥                      v 1 = 덮개 끝
좌우          fold — 디자인이 가장자리까지 bleed
```

**앞면 세로 좌표** (1024 × 1485, 위에서부터)

```
   0 ~   24    상단 크림프 실링 — 인쇄 금지 (압착돼 찌그러짐)
  24 ~  327    뜯겨 날아가는 부분
        327    절취선
 327 ~ 1351    히어로 일러스트 자리 (1024×1024, 좌우 bleed)
1351 ~ 1398    고지 문구 + ©
1398 ~ 1485    하단 크림프 실링 — 로고·문자 금지
```

**뒷면**: 중앙 세로 133px는 핀 실 융기부라 그래픽 금지. 나머지는 앞면 팔레트에서 자동 생성.

이 수치들은 `TOP_RATIO`, `SEAL_RATIO` 등에서 파생된다. 파라미터를 바꾸면
`export_art_guide()`가 갱신된 가이드를 다시 뽑는다. **문서의 수치를 믿지 말고 생성기를 돌릴 것.**

---

## 4. 남은 작업

> **2026-10-10 Blender 단계 완료.** 모션 · 팩 텍스처/디자인 · 카드 앞뒤면 · 광원 모두 현재 상태로 확정.
> 아래 ①②는 완료, ③은 지금 조명을 유지하는 것으로 확정. 다음 단계는 R3F 웹 연동(1절 "카드 색 교체" 계약 참조).

### ① 어드벤처러 일러스트

컨셉: **크로스백을 맨 어드벤처러**를 2.5D 픽셀 스프라이트로.

제품의 핵심 메커니즘(직접 가야 얻는다)을 그대로 그린 것이라, 커피 원두나 광물보다
훨씬 우리 것이다. 코드에 이미 `DungGeunMo` 픽셀 폰트가 등급·수치에 쓰이고 있어
픽셀 레이어가 비로소 하나의 언어가 된다.

**주의: 이미지 모델은 픽셀아트를 못 만든다.** 격자가 불규칙하고 안티에일리어싱이
들어가며 색이 수백 개가 된다. 반드시 후처리한다.

```
1. 모델 출력 1024×1024
2. 최근접 이웃으로 96×96 다운샘플     → 격자 강제 정렬
3. 팔레트 6~8색으로 양자화            → 진짜 픽셀아트 수준의 색 수
4. 최근접 이웃으로 재확대             → 칸이 또렷해짐
```

numpy로 처리 가능. Blender의 `bpy.data.images`가 PNG 디코딩을 해주므로 별도 라이브러리 불필요.

프롬프트 초안:

```
A pixel art character sprite of a lone adventurer, shown in a three-quarter
oblique view, standing and facing slightly left. They wear a crossbody satchel
across the chest and a light traveling coat. Calm, determined posture.

Chunky low-resolution pixel art on a strict grid, the look of a 16-bit
adventure game sprite. Every pixel is a hard square with no anti-aliasing, no
blur, and no gradients. A small palette of about eight flat colors: deep ink
navy, brick red, bone cream, and a few muted mid-tones.

Strong readable silhouette with large simple shapes, since this must stay
legible when small. The character stands in the upper two thirds; the lower
third is empty flat background so a logo can be placed over it later.

Centered full-body view on a plain flat navy background, filling the square
canvas. The image contains no text, no letters, and no user interface.
```

### ② 아트워크 합성기

히어로 이미지를 지정 좌표에 앉히고, 실링 밴드·액센트 띠를 그리고, 뒷면까지 생성해
`pack_art.png`로 굽는 스크립트. `export_placeholder_art()`가 이미 numpy로 캔버스를
그리고 있으므로 그 구조를 확장하면 된다.

### ③ 광원 효과와 문양

미착수. 현재 조명은 키 1 + 림 2 + 반사판 1이고 환경광은 절차적 그라디언트다.

---

## 5. 폐기된 방향 (다시 제안하지 말 것)

| 방향 | 폐기 이유 |
|---|---|
| 레트로 리소그래프 / 1970s 스크린프린트 | 기획서의 "인쇄물"은 **물성**(종이·포일)을 뜻했지 레트로 양식이 아니었다. 게다가 이 스타일은 이미지 모델의 최빈 출력이라 "AI 느낌"이 강하게 남는다 |
| 커피 원두 + 광물 결정 모티프 | ① 요소 50개가 넘어 400px에서 얼룩이 됨 ② 원두를 갈라 벌리면 형태가 신체 기관으로 읽힘 (`pushing it slightly open` + 좌우 대칭 + 원형 실루엣의 조합) |
| 앞뒤로 벌어지는 개봉 | 카드가 나올 통로는 생기지만 "뜯는" 동작으로 안 읽힘. 가로 잡아뜯기로 교체 |
| 안쪽 포일 라이너 (Geometry > Backfacing) | glTF로 표현 불가. 가로 뜯기에서는 안쪽이 거의 안 보여 값을 못 함 |

**브랜드 컬러는 오렌지가 아니라 `#da483b` 레드다.** `globals.css`의 `--color-main`이자
`manifest.json`의 `theme_color`. 초기에 오렌지로 잘못 잡았던 흔적이 남아 있을 수 있다.

---

## 6. 밟았던 함정

| 증상 | 원인 |
|---|---|
| `Action has no attribute fcurves` | Blender 4.4 Slotted Actions. `layer › strip › channelbag › fcurves` 계층으로 바뀜 |
| 톱니 사이 마름모 구멍 | 위/아래를 각각 파냄. 절취선은 **하나의 경계선**을 두 조각이 공유해야 함 |
| 뚜껑이 꼭대기에서 넘어감 | 회전축이 팩 상단에 있었음. origin을 이음새로 |
| 어두운 환경에서 형태 소실 | `Metallic 0.55`. 금속은 확산 반사가 없어 반사할 게 없으면 검정이 된다 |
| UV 셰브론 왜곡 | 실링부 두께가 0이라 정점 y가 `-0.0`이 되는데, 파이썬에서 `-0.0 < 0`은 **False**. 기하학적 위치로 정점 소속을 되추론하지 말 것 |
| GLB에 텍스처가 통째로 누락 | glTF 익스포터는 **Principled BSDF 하나가 Material Output에 직접 연결된** 형태만 인식. Mix Shader를 끼우면 매핑을 포기하며 베이스 컬러 텍스처까지 버린다 |
| PNG 색이 헥스보다 어둡게 저장됨 (`#6b7280` → `#252b37`) | 8비트 이미지의 `pixels`는 sRGB 값을 그대로 주고받는다. 선형 변환을 걸면 이중 인코딩. `pack_generator`의 `ART_*` 상수(가이드·플레이스홀더용)는 아직 선형 값으로 적혀 있다 |
| 아트를 다시 구웠는데 GLB에 옛 그림이 들어감 | 같은 세션에서 `images.load(check_existing=True)`가 디스크 대신 남아 있던 이미지 블록을 돌려줌. `clear_scene()`에서 파일 이미지도 지우도록 수정 |
| GLB에 `PackPouch.001`이 생겨 팩이 두 벌 | 숨긴 오브젝트는 select_all에 안 잡혀 삭제를 피함. `clear_scene()`이 `bpy.data.objects`에서 직접 지우도록 수정 |
| Blender 재시작 후 렌더가 달라짐 | HDRI만 외부 상태였음. `setup_world()`가 절차적 환경을 만들도록 수정 |

### glTF로 나가지 않는 것

```
절차적 노이즈 (구김 범프)    Blender 렌더 전용. 살리려면 노멀맵으로 베이크해야 함
Mix Shader · Geometry 노드   위 표 참조
오브젝트 좌표 투영           glTF는 UV 기반 텍스처만 지원
```

---

## 7. 앱 쪽 상태 (참고)

로고 작업(겹친 카드 심볼 + Anton 워드마크)은 **앱에서 전부 되돌렸다.**
`assets/logo/`에 플레이그라운드와 생성기가 남아 있지만 앱은 이전 로고를 쓰고 있다.

팩 앞면 레이아웃이 "로고 자리"를 비워두고 있는데, 로고가 롤백됐으므로
**그 자리를 무엇으로 채울지는 열린 문제다.** 어드벤처러가 주인공이 된 이상
워드마크만 얹어도 충분할 수 있다.

워킹 트리에 **글래스모피즘 제거 작업(40여 개 파일)이 미커밋 상태**로 있다.
`git restore`를 파일 단위로 돌리면 날아간다. 되돌리기 전에 반드시 `git diff`로
누구의 변경인지 확인할 것.
