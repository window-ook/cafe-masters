"""
Cafe Masters — 카드팩 아트워크 합성기

히어로 스프라이트를 픽셀아트로 정리한 뒤, 실링과 절취선 위치에 맞춰
앞뒤 전개도를 한 장으로 구워 pack_art.png를 만듭니다.

실행 방법
    blender --background --python assets/blender/art_builder.py

밴드 위치를 여기에 숫자로 다시 적지 않고 pack_generator의 파라미터에서
파생시킵니다. 수치를 복사해 두면 TOP_RATIO를 바꾸는 순간 아트워크와 메시가
어긋나는데, 그 어긋남은 렌더를 눈으로 보기 전까지 드러나지 않습니다.

파이프라인
    1. 히어로 원본을 sRGB로 읽기
    2. area 평균으로 96 격자에 눌러 담기
    3. 고정 팔레트로 양자화
    4. 정수배 확대
"""

import os
import re
import sys

import bpy
import numpy

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import pack_generator as pack


ASSET_DIR = os.path.dirname(os.path.abspath(__file__))
HERO_PATH = os.path.join(ASSET_DIR, "hero_raw.png")
WORDMARK_PATH = os.path.join(ASSET_DIR, "..", "logo", "wordmark.png")
OUTPUT_PATH = os.path.join(ASSET_DIR, "pack_art.png")
CARD_OUTPUT_PATH = os.path.join(ASSET_DIR, "card_art.png")
CARD_VARIANT_DIR = os.path.join(ASSET_DIR, "card_art")
CARD_CSS_PATH = os.path.join(ASSET_DIR, "..", "..", "app", "card-styles.css")

# 카드 면. 비율은 pack_generator의 CARD_ASPECT를 따라야 늘어나지 않습니다
CARD_WIDTH = 800

# 원본을 눌러 담을 칸 수. 원본이 그려진 격자와 같아야 합니다. 어긋나면
# 원본 칸 하나가 1.5칸으로 쪼개지면서 계단이 불규칙해집니다
SPRITE_GRID = 64

HERO_BOX = 800            # 히어로 영역 높이. 폭은 앞면 전체를 씁니다
SPRITE_MARGIN = 16        # 스프라이트 사방 여백. 히어로가 밴드에 닿아 잘려 보이지 않게 합니다
SPRITE_COLORS = 16        # 히어로가 쓸 색 수
BACKGROUND_TOLERANCE = 0.12   # 모서리 색에서 이만큼 안쪽이면 배경으로 봅니다 (sRGB 거리)

TEAR_LINE = 5             # 절취선 두께
TEAR_DASH = 28            # 대시 한 칸. 칠하고 비우기를 이 간격으로 반복합니다
ACCENT_HEIGHT = 22        # 절취선이 차지하는 띠. 선 위아래 여백을 포함합니다
NOTICE_HEIGHT = 58        # 고지 문구 띠

TAGLINE = "COLLECT WHERE YOU GO"

# 팩 프레임 팔레트 — 배경과 밴드, 문자에만 씁니다.
#
# 히어로에는 쓰지 않습니다. 여기에는 카키도 갈색도 청색도 없어서, 이 색으로
# 캐릭터를 양자화하면 코트와 부츠와 바지가 전부 네이비와 크림으로 뭉개져
# 다른 캐릭터가 됩니다. 일러스트는 자기 색을, 프레임은 브랜드 색을 씁니다.
#
# 헥스로 적는 이유는 브랜드 컬러와 눈으로 대조하기 위해서입니다.
# 선형 값으로 적어 두면 오렌지를 레드로 착각하는 사고가 조용히 남습니다
PALETTE_HEX = (
    "#0b0e17",   # void    가장 깊은 그림자
    "#1a2233",   # ink     배경과 외곽
    "#33415c",   # slate   중간톤
    "#5d6b85",   # mist    밝은 면
    "#8f2f2a",   # ember   레드 그림자
    "#da483b",   # brick   브랜드 레드 (--color-main)
    "#b5a17a",   # tan     가죽과 크림 그림자
    "#ede6d1",   # bone    최명 하이라이트
)

# 최근접 색을 고를 때 쓰는 채널 가중치. 사람 눈은 초록에 민감해서
# 균등하게 재면 붉은 계열이 엉뚱한 칸으로 끌려갑니다
CHANNEL_WEIGHT = numpy.array([0.30, 0.59, 0.11], dtype=numpy.float32)

# 5×7 대문자. 한 글자를 행 7개로 적고 "/"로 끊습니다
FONT = {
    "A": ".###./#...#/#...#/#####/#...#/#...#/#...#",
    "B": "####./#...#/#...#/####./#...#/#...#/####.",
    "C": ".####/#..../#..../#..../#..../#..../.####",
    "D": "####./#...#/#...#/#...#/#...#/#...#/####.",
    "E": "#####/#..../#..../####./#..../#..../#####",
    "F": "#####/#..../#..../####./#..../#..../#....",
    "G": ".####/#..../#..../#.###/#...#/#...#/.####",
    "H": "#...#/#...#/#...#/#####/#...#/#...#/#...#",
    "I": ".###./..#../..#../..#../..#../..#../.###.",
    "J": "..###/...#./...#./...#./...#./#..#./.##..",
    "K": "#...#/#..#./#.#../##.../#.#../#..#./#...#",
    "L": "#..../#..../#..../#..../#..../#..../#####",
    "M": "#...#/##.##/#.#.#/#...#/#...#/#...#/#...#",
    "N": "#...#/##..#/#.#.#/#..##/#...#/#...#/#...#",
    "O": ".###./#...#/#...#/#...#/#...#/#...#/.###.",
    "P": "####./#...#/#...#/####./#..../#..../#....",
    "Q": ".###./#...#/#...#/#...#/#.#.#/#..#./.##.#",
    "R": "####./#...#/#...#/####./#.#../#..#./#...#",
    "S": ".####/#..../#..../.###./....#/....#/####.",
    "T": "#####/..#../..#../..#../..#../..#../..#..",
    "U": "#...#/#...#/#...#/#...#/#...#/#...#/.###.",
    "V": "#...#/#...#/#...#/#...#/#...#/.#.#./..#..",
    "W": "#...#/#...#/#...#/#...#/#.#.#/##.##/#...#",
    "X": "#...#/#...#/.#.#./..#../.#.#./#...#/#...#",
    "Y": "#...#/#...#/.#.#./..#../..#../..#../..#..",
    "Z": "#####/....#/...#./..#../.#.../#..../#####",
}

GLYPH_WIDTH = 5
GLYPH_HEIGHT = 7
GLYPH_ADVANCE = 6   # 자간 1칸 포함


# ─────────────────────────────────────────────────────────────
# 색 — 전부 sRGB로 다룹니다. 팔레트 매칭도 sRGB에서 합니다
# ─────────────────────────────────────────────────────────────

def hexes(*values):
    """#rrggbb 문자열들을 (n, 3) sRGB 배열로 바꿉니다."""
    return numpy.array(
        [[int(value[i:i + 2], 16) / 255.0 for i in (1, 3, 5)] for value in values],
        dtype=numpy.float32,
    )


PALETTE = hexes(*PALETTE_HEX)
VOID, INK, SLATE, MIST, EMBER, BRICK, TAN, BONE = PALETTE

# 카드 — collection 페이지의 card-unopened와 같은 색을 씁니다.
# 재질 6종은 개봉 시점에 서버가 뽑고 표시는 DOM의 card-base-*가 맡으므로,
# 3D 카드가 특정 재질로 보이면 실제 결과와 어긋난 스포일러가 됩니다
CARD_STOPS = hexes("#4b5563", "#3b4553", "#2b3340", "#1f2937")
GRAY_500, GRAY_600, GRAY_700, GRAY_800 = hexes(
    "#6b7280", "#4b5563", "#374151", "#1f2937"
)


# ─────────────────────────────────────────────────────────────
# 이미지 입출력 — bpy의 pixels는 아래 행부터 채워집니다
# ─────────────────────────────────────────────────────────────

def load_rgba(path):
    """
    PNG를 (h, w, 4) 배열로 읽습니다. RGB는 sRGB, A는 0~1, 행 0이 이미지 위쪽입니다.

    8비트 PNG의 pixels는 파일에 적힌 sRGB 값을 255로 나눈 것일 뿐, bpy가
    선형으로 디코딩하지 않습니다. 여기서 변환을 걸면 이중 인코딩이 됩니다.
    팔레트 매칭을 선형 공간에서 하면 어두운 쪽 색끼리 거리가 뭉개져 그림자가
    전부 한 칸으로 빨려 들어가므로, sRGB 그대로 씁니다.
    """
    image = bpy.data.images.load(path, check_existing=False)
    image.alpha_mode = "STRAIGHT"
    width, height = image.size
    pixels = numpy.array(image.pixels[:], dtype=numpy.float32).reshape(height, width, 4)
    bpy.data.images.remove(image)

    return pixels[::-1]


def save_srgb(path, canvas):
    """
    (h, w, 3) sRGB 배열을 PNG로 저장합니다. 행 0이 이미지 위쪽입니다.

    8비트 이미지의 pixels는 그대로 파일에 적히므로 sRGB 값을 변환 없이 넣습니다.
    선형으로 바꿔 넣으면 #6b7280이 #252b37로 저장되듯 전부 어둡게 굳습니다.
    """
    height, width, _ = canvas.shape

    art = numpy.ones((height, width, 4), dtype=numpy.float32)
    art[:, :, :3] = numpy.clip(canvas, 0.0, 1.0)

    image = bpy.data.images.new("PackArt", width, height, alpha=True)
    image.pixels = art[::-1].reshape(-1)
    image.filepath_raw = path
    image.file_format = "PNG"
    image.save()
    bpy.data.images.remove(image)


# ─────────────────────────────────────────────────────────────
# 픽셀화
# ─────────────────────────────────────────────────────────────

def downsample(rgb, grid):
    """
    area 평균으로 grid × grid 격자에 눌러 담습니다.

    최근접 이웃을 쓰지 않는 이유는 원본 변이 격자 수의 정수배가 아니면
    샘플 간격이 칸마다 달라져, 격자를 맞추려던 것이 오히려 어긋나기
    때문입니다. 평균이 만든 중간색은 뒤따르는 양자화가 걷어냅니다.
    """
    height, width, channels = rgb.shape
    rows = numpy.linspace(0, height, grid + 1).round().astype(int)
    cols = numpy.linspace(0, width, grid + 1).round().astype(int)

    out = numpy.empty((grid, grid, channels), dtype=numpy.float32)
    for i in range(grid):
        for j in range(grid):
            block = rgb[rows[i]:rows[i + 1], cols[j]:cols[j + 1]]
            out[i, j] = block.reshape(-1, channels).mean(axis=0)

    return out


def quantize(rgb, palette):
    """각 픽셀을 팔레트에서 가장 가까운 색으로 바꿉니다."""
    flat = rgb.reshape(-1, 1, 3)
    distance = (((flat - palette[None, :, :]) * CHANNEL_WEIGHT) ** 2).sum(axis=2)

    return palette[distance.argmin(axis=1)].reshape(rgb.shape)


def extract_palette(rgb, alpha, count):
    """
    불투명한 칸들에서 대표색을 뽑습니다.

    이미지 모델 출력은 칸 하나 안에서도 색이 미세하게 흔들려 고유 색이
    수만 개가 됩니다. 눈에는 같은 카키인데 값은 전부 다른 상태라, 줄이지
    않으면 확대했을 때 칸마다 얼룩이 집니다.

    시작점을 무작위로 잡으면 실행마다 결과가 달라져 조정 이력을 비교할 수
    없습니다. 밝기 순으로 고르게 집어 항상 같은 답이 나오게 합니다.
    """
    samples = rgb[alpha > 0.5]
    if len(samples) <= count:
        return samples

    order = numpy.argsort(samples @ CHANNEL_WEIGHT)
    centers = samples[order[numpy.linspace(0, len(samples) - 1, count).astype(int)]].copy()

    for _ in range(24):
        distance = (((samples[:, None, :] - centers[None]) * CHANNEL_WEIGHT) ** 2).sum(axis=2)
        index = distance.argmin(axis=1)

        moved = False
        for k in range(count):
            member = samples[index == k]
            if len(member) == 0:
                continue
            center = member.mean(axis=0)
            moved = moved or not numpy.allclose(center, centers[k])
            centers[k] = center

        if not moved:
            break

    return centers


def upscale(rgb, scale):
    """칸을 정수배로 넓힙니다. 보간이 없어 경계가 그대로 남습니다."""
    return rgb.repeat(scale, axis=0).repeat(scale, axis=1)


def column_center(alpha):
    """열 방향 무게중심. 잉크가 없으면 한가운데를 돌려줍니다."""
    columns = alpha.sum(axis=0)
    total = columns.sum()
    if total <= 0:
        return (len(columns) - 1) / 2

    return float((columns * numpy.arange(len(columns))).sum() / total)


def blend(canvas, top, left, rgb, alpha):
    """알파 마스크를 따라 캔버스 위에 얹습니다. rgb는 배열이거나 색 하나입니다."""
    height, width = alpha.shape
    mask = alpha[:, :, None]
    region = canvas[top:top + height, left:left + width]

    canvas[top:top + height, left:left + width] = region * (1.0 - mask) + rgb * mask


def key_background(rgba):
    """
    배경이 통째로 불투명하면 모서리 색을 기준으로 뚫습니다.

    투명하게 지운 PNG를 받아도 되지만, 그 파일은 재현할 수 없는 외부
    상태가 됩니다. 원본만 두고 스크립트가 뚫으면 임계값을 고친 이력이
    diff로 남고, 이미지를 다시 뽑아도 같은 처리가 그대로 적용됩니다.

    이미 알파가 들어 있는 파일은 그대로 통과시킵니다.
    """
    if rgba[:, :, 3].min() < 0.5:
        return rgba

    edge = 24
    corners = numpy.concatenate([
        rgba[:edge, :edge, :3].reshape(-1, 3), rgba[:edge, -edge:, :3].reshape(-1, 3),
        rgba[-edge:, :edge, :3].reshape(-1, 3), rgba[-edge:, -edge:, :3].reshape(-1, 3),
    ])
    background = corners.mean(axis=0)

    distance = numpy.sqrt(((rgba[:, :, :3] - background) ** 2).sum(axis=2))
    rgba[:, :, 3] = (distance >= BACKGROUND_TOLERANCE).astype(numpy.float32)

    return rgba


def crop_to_content(rgb, alpha):
    """
    불투명한 칸에 딱 맞게 잘라냅니다.

    원본의 여백을 그대로 들고 오면 캐릭터가 히어로 영역의 일부만 쓰게 되어,
    프레임은 큰데 그림만 작은 인쇄물이 됩니다.
    """
    rows = numpy.flatnonzero(alpha.any(axis=1))
    cols = numpy.flatnonzero(alpha.any(axis=0))
    if not len(rows) or not len(cols):
        return rgb, alpha

    top, bottom = rows[0], rows[-1] + 1
    left, right = cols[0], cols[-1] + 1

    return rgb[top:bottom, left:right], alpha[top:bottom, left:right]


def build_sprite(path, box):
    """
    히어로 원본을 픽셀 스프라이트로 정리해 (rgb, alpha)를 돌려줍니다. 없으면 None입니다.

    알파를 곱한 뒤 평균하고 다시 나눕니다. RGBA를 그대로 평균하면 투명한
    자리의 색이 윤곽으로 스며들어 캐릭터 가장자리가 어둡게 번집니다.

    평균이 만든 반투명 칸은 0.5를 기준으로 끊습니다. 픽셀아트에 반투명
    픽셀이 남으면 칸 경계가 흐려져 격자를 맞춘 의미가 사라집니다.

    배율은 상수로 두지 않고 잘라낸 크기에서 역산합니다. 고정해 두면 크롭
    결과에 따라 영역을 넘치거나 남기는데, 정수배를 포기하면 칸 경계가
    반올림으로 흔들려 격자를 맞춘 보람이 사라집니다.
    """
    if not os.path.exists(path):
        return None

    source = key_background(load_rgba(path))
    premultiplied = source.copy()
    premultiplied[:, :, :3] *= source[:, :, 3:4]

    small = downsample(premultiplied, SPRITE_GRID)
    weight = small[:, :, 3:4]
    rgb = numpy.divide(
        small[:, :, :3], weight,
        out=numpy.zeros_like(small[:, :, :3]), where=weight > 1e-4,
    )
    alpha = (small[:, :, 3] >= 0.5).astype(numpy.float32)
    palette = extract_palette(rgb, alpha, SPRITE_COLORS)

    rgb, alpha = crop_to_content(quantize(rgb, palette), alpha)
    scale = max(1, min(
        (HERO_BOX - SPRITE_MARGIN * 2) // alpha.shape[0],
        (box["face"] - SPRITE_MARGIN * 2) // alpha.shape[1],
    ))

    return upscale(rgb, scale), upscale(alpha, scale)


# ─────────────────────────────────────────────────────────────
# 문자 — 픽셀 폰트로 직접 찍습니다
# ─────────────────────────────────────────────────────────────

def text_width(text, scale):
    """자간을 포함한 문자열 폭. 마지막 글자 뒤 자간은 빼야 가운데가 맞습니다."""
    return (len(text) * GLYPH_ADVANCE - 1) * scale


def draw_text(canvas, text, center_x, top_y, scale, color):
    """5×7 픽셀 폰트로 문자열을 찍습니다."""
    x = center_x - text_width(text, scale) // 2

    for char in text.upper():
        glyph = FONT.get(char)
        if glyph:
            for row, line in enumerate(glyph.split("/")):
                for col, cell in enumerate(line):
                    if cell != "#":
                        continue
                    y0 = top_y + row * scale
                    x0 = x + col * scale
                    canvas[y0:y0 + scale, x0:x0 + scale] = color
        x += GLYPH_ADVANCE * scale


# ─────────────────────────────────────────────────────────────
# 레이아웃 — 전부 pack_generator 파라미터에서 파생됩니다
# ─────────────────────────────────────────────────────────────

def layout():
    """
    캔버스 크기와 가로 밴드의 y 좌표를 계산합니다. y는 이미지 위에서부터입니다.

    UV의 v는 팩 바닥이 0, 덮개 끝이 1입니다. 이미지는 위가 v=1이므로
    y = (1 - v) * height 로 뒤집습니다.
    """
    width = pack.ART_CANVAS_WIDTH
    height = round(width / 2 * (pack.PACK_HEIGHT / pack.PACK_WIDTH))

    top_height = pack.PACK_HEIGHT * pack.TOP_RATIO
    bottom_height = pack.PACK_HEIGHT * (1.0 - pack.TOP_RATIO)

    def y_of(v):
        return round((1.0 - v) * height)

    # 실링은 조각의 바깥 끝에서 각자의 길이에 SEAL_RATIO를 곱한 만큼입니다.
    # 위 조각과 아래 조각의 길이가 다르므로 두 띠의 두께도 다릅니다
    seam_y = y_of(bottom_height / pack.PACK_HEIGHT)
    top_seal_y = y_of(1.0 - top_height * pack.SEAL_RATIO / pack.PACK_HEIGHT)
    bottom_seal_y = y_of(bottom_height * pack.SEAL_RATIO / pack.PACK_HEIGHT)

    face = width // 2

    # 절취선 아래를 히어로 · 워드마크 · 고지 문구로 나눕니다. 부스터 팩의
    # 앞면은 대체로 이 순서인데, 제품명이 아래에 앉아야 시선이 일러스트에서
    # 이름으로 흐르고 하단 실링이 받침 역할을 합니다
    hero_y = seam_y + ACCENT_HEIGHT
    hero_end = hero_y + HERO_BOX
    notice_y = bottom_seal_y - NOTICE_HEIGHT

    return {
        "width": width,
        "height": height,
        "face": face,
        "top_seal_y": top_seal_y,     # 0 ~ 여기가 상단 크림프. 인쇄 금지
        "seam_y": seam_y,             # 절취선
        "hero_y": hero_y,
        "hero_end": hero_end,
        "wordmark_y": hero_end,       # 히어로 아래부터 고지 문구 위까지
        "notice_y": notice_y,
        "bottom_seal_y": bottom_seal_y,   # 여기부터 아래가 하단 크림프
        # 뒷면은 전개도라 좌우가 뒤집힙니다. 팩 중앙(x=0)은 뒷면 영역의 한가운데입니다
        "fin_center": face + face // 2,
        "fin_half": round(face * pack.FIN_WIDTH / 2),
    }


# ─────────────────────────────────────────────────────────────
# 합성
# ─────────────────────────────────────────────────────────────

def paint_bands(canvas, box):
    """앞뒤에 걸치는 가로 밴드. 전개도라 폭 전체에 그으면 앞뒤가 이어집니다."""
    # 뜯겨 나가는 부분은 한 단계 밝게 둡니다. 개봉 전에 절취선이 어디인지
    # 색으로도 읽혀야 사용자가 뜯을 곳을 찾습니다
    canvas[:box["seam_y"]] = SLATE * 0.55 + INK * 0.45

    # 절취선. 실선은 디자인 요소로 읽히지만 점선은 "여기를 뜯으라"는
    # 지시로 읽힙니다. 실제 포장재의 절취 표시도 점선입니다
    line = box["seam_y"] + (ACCENT_HEIGHT - TEAR_LINE) // 2
    dash = (numpy.arange(box["width"]) // TEAR_DASH) % 2 == 0
    canvas[line:line + TEAR_LINE, dash] = MIST

    # 크림프 실링은 압착돼 그림이 찌그러지므로 단색으로 비웁니다
    canvas[:box["top_seal_y"]] = VOID
    canvas[box["bottom_seal_y"]:] = VOID


def paint_front(canvas, box, sprite, wordmark):
    """앞면 — 히어로 위, 워드마크 아래. 시선이 그림에서 이름으로 흐릅니다."""
    face = box["face"]

    if sprite is not None:
        rgb, alpha = sprite
        height, width = alpha.shape

        # 바운딩 박스로도 무게중심으로도 가운데가 맞지 않습니다. 박스는
        # 한쪽으로 뻗은 코트 자락에 넓혀지고, 무게중심은 그 면적에 끌려갑니다.
        # 사람이 인물 그림에서 중심으로 삼는 것은 머리와 발을 잇는 축이라,
        # 위아래 끝 밴드의 중심만 평균합니다. 코트 자락은 중간 높이에 몰려
        # 있어 자동으로 빠집니다
        band = max(1, height // 4)
        axis = (column_center(alpha[:band]) + column_center(alpha[-band:])) / 2
        left = max(0, min(face - width, round(face / 2 - axis)))

        blend(canvas, box["hero_y"] + (HERO_BOX - height) // 2, left, rgb, alpha)

    if wordmark is not None:
        height, width = wordmark.shape
        band = box["notice_y"] - box["wordmark_y"]
        blend(
            canvas,
            box["wordmark_y"] + (band - height) // 2,
            (face - width) // 2,
            BONE, wordmark,
        )

    # 뜯겨 나가는 조각은 비워 둡니다. 어차피 개봉하면 날아가는 자리라
    # 여기에 정보를 얹으면 개봉 후에 그 정보가 사라집니다

    # 고지 문구 — 워드마크 아래, 하단 실링 위의 좁은 띠
    scale = 3
    draw_text(
        canvas, TAGLINE, face // 2,
        box["notice_y"] + (NOTICE_HEIGHT - GLYPH_HEIGHT * scale) // 2,
        scale, TAN,
    )


def paint_back(canvas, box):
    """
    뒷면 — 잔잔한 도트 격자.

    중앙 세로 띠는 핀 실이 솟아오르는 자리라 비워 둡니다. 융기부에
    그래픽이 걸리면 UV가 늘어나면서 그 부분만 찢어져 보입니다.
    """
    step = 46
    dot = 7

    rows = range(box["seam_y"] + step, box["bottom_seal_y"] - step, step)
    cols = range(box["face"] + step, box["width"] - step, step)

    for y in rows:
        for x in cols:
            if abs(x - box["fin_center"]) < box["fin_half"] + dot:
                continue
            canvas[y:y + dot, x:x + dot] = SLATE


def gradient(height, width, stops):
    """좌상단에서 우하단으로 흐르는 그라디언트. CSS의 to bottom right와 같은 방향입니다."""
    y = numpy.linspace(0.0, 1.0, height, dtype=numpy.float32)[:, None]
    x = numpy.linspace(0.0, 1.0, width, dtype=numpy.float32)[None, :]
    t = (x + y) / 2.0
    position = numpy.linspace(0.0, 1.0, len(stops))

    return numpy.stack(
        [numpy.interp(t, position, stops[:, c]).astype(numpy.float32) for c in range(3)],
        axis=-1,
    )


def fill(canvas, top, left, height, width, color):
    """사각형을 칠합니다."""
    canvas[top:top + height, left:left + width] = color


def outline(canvas, top, left, height, width, color, weight):
    """테두리만 그립니다."""
    fill(canvas, top, left, weight, width, color)
    fill(canvas, top + height - weight, left, weight, width, color)
    fill(canvas, top, left, height, weight, color)
    fill(canvas, top, left + width - weight, height, weight, color)


def round_corners(canvas, weight, color):
    """
    카드 외곽 테두리를 둥근 모서리에 맞춰 덧칠합니다.

    메시 모서리가 둥글게 깎이면 직사각형 테두리는 모서리에서 절반 두께로
    얇아집니다. 호에서 weight 안쪽까지를 테두리 색으로 채워 두께를 유지합니다.
    호 바깥은 메시에 잘려 보이지 않지만 같이 칠해 둡니다. 텍스처 필터링이
    가장자리에서 바깥 색을 끌어와 테두리에 어두운 테가 생기는 것을 막습니다.
    """
    height, width, _ = canvas.shape
    radius = round(width * pack.CARD_CORNER_RATIO)
    yy, xx = numpy.mgrid[0:radius, 0:radius]
    band = numpy.hypot(radius - 0.5 - xx, radius - 0.5 - yy) > radius - weight

    for rows in (slice(0, radius), slice(height - radius, height)):
        for cols in (slice(0, radius), slice(width - radius, width)):
            mask = band[::1 if rows.start == 0 else -1, ::1 if cols.start == 0 else -1]
            canvas[rows, cols][mask] = color


def build_card(stops=CARD_STOPS, path=CARD_OUTPUT_PATH):
    """
    팩에서 나오는 카드.

    collection 페이지의 카드 골격을 그대로 씁니다. 이름 · 일러스트 · 주소가
    세로로 쌓이고, 일러스트 아래 흰 띠에 CAFE MASTERS가 들어가는 구조가
    이 서비스의 카드를 지시합니다.

    바탕은 인자로 받습니다. 기본값은 미개봉 면이고, GLB에 구워지는 것은
    이것뿐입니다. 재질은 개봉 시점에 서버가 뽑는 값이라(open.ts) GLB에 특정
    재질을 박으면 실제 결과와 어긋난 스포일러가 됩니다. 재질별 면은
    build_card_variants가 따로 굽고, 웹이 뽑힌 재질에 맞춰 갈아 끼웁니다.

    글자가 들어갈 자리는 막대로 둡니다. 카페 이름과 주소는 카드마다 다른데,
    한 장을 골라 박으면 그 카페의 카드로 읽힙니다.
    """
    height = round(CARD_WIDTH * pack.CARD_ASPECT)
    canvas = gradient(height, CARD_WIDTH, stops)

    # CSS 카드(h-96 = 384px)를 기준으로 비율을 옮깁니다
    unit = height / 384.0
    border = round(6 * unit)
    pad = round(16 * unit)

    # 테두리는 밝게 둡니다. 미개봉 면이 어두워서 어두운 테두리를 두르면
    # 카드가 팩 안쪽 그늘에 묻혀 윤곽이 사라집니다
    outline(canvas, 0, 0, height, CARD_WIDTH, GRAY_500, border)
    round_corners(canvas, border, GRAY_500)

    top = border + pad
    left = border + pad
    inner_w = CARD_WIDTH - 2 * left
    inner_h = height - 2 * top

    art_h = round(inner_h * 176 / 340)     # h-44 일러스트
    band_h = round(inner_h * 16 / 340)     # h-4 흰 띠
    head_h = round(inner_h * 60 / 340)
    gap = (inner_h - head_h - art_h - head_h) // 2

    # 이름 자리
    bar_h = round(head_h * 0.30)
    fill(canvas, top, left, bar_h, round(inner_w * 0.62), GRAY_500)

    # 일러스트 — 카페 사진 자리와 그 아래 흰 띠
    art_y = top + head_h + gap
    fill(canvas, art_y, left, art_h, inner_w, GRAY_700)
    outline(canvas, art_y, left, art_h - band_h, inner_w, GRAY_600,
            max(1, round(2 * unit)))

    # 흰 띠는 카드의 시그니처입니다. 어두운 재질에서도 여기만 흰색이라
    # 어느 재질이든 이 띠로 우리 카드인 것이 읽힙니다
    band_y = art_y + art_h - band_h
    fill(canvas, band_y, left, band_h, inner_w, numpy.ones(3, dtype=numpy.float32))
    draw_text(canvas, "CAFE MASTERS", left + inner_w // 2,
              band_y + (band_h - GLYPH_HEIGHT * 4) // 2, 4, numpy.zeros(3, dtype=numpy.float32))

    # 주소와 전화번호 자리
    foot_y = art_y + art_h + gap
    fill(canvas, foot_y, left, head_h, inner_w, GRAY_800)
    outline(canvas, foot_y, left, head_h, inner_w, GRAY_500, max(1, round(2 * unit)))

    line_h = round(head_h * 0.16)
    fill(canvas, foot_y + round(head_h * 0.24), left + pad // 2, line_h,
         round(inner_w * 0.62), GRAY_500)
    fill(canvas, foot_y + round(head_h * 0.58), left + pad // 2, line_h,
         round(inner_w * 0.38), GRAY_500)

    # EdgeSquare — 정보 박스의 네 모서리에 절반씩 걸칩니다
    square = round(6 * unit)
    for corner_y in (foot_y, foot_y + head_h):
        for corner_x in (left, left + inner_w):
            fill(canvas, corner_y - square // 2, corner_x - square // 2,
                 square, square, GRAY_500)
            outline(canvas, corner_y - square // 2, corner_x - square // 2,
                    square, square, GRAY_600, max(1, round(unit)))

    save_srgb(path, canvas)
    print(f"  카드        {CARD_WIDTH} x {height}   {path}")


def read_material_stops(path):
    """
    card-styles.css에서 재질별 바탕 그라디언트의 색 지점을 읽습니다.

    헥스를 여기에 옮겨 적지 않습니다. 웹 카드의 색을 고치는 순간 3D 카드와
    어긋나는데, 그 어긋남은 개봉 연출이 DOM 카드로 넘어가는 이음매에서야
    드러납니다. 위에 겹친 결(층리 · 기포 · 결정면 · ::before 텍스처)은
    옮기지 않고 바탕 그라디언트만 씁니다.
    """
    with open(path, encoding="utf-8") as css:
        source = css.read()

    stops = {}
    for name, body in re.findall(r"\.card-base-([\w-]+)\s*\{([^}]*)\}", source):
        ramps = re.findall(r"linear-gradient\(to bottom right,([^)]*)\)", body)
        if not ramps:
            continue

        # 8자리 헥스의 알파는 버립니다. 3D 카드 뒤에는 비쳐 보일 바탕이 없습니다
        colors = re.findall(r"#[0-9a-fA-F]{6,8}", ramps[-1])
        stops[name] = hexes(*(color[:7] for color in colors))

    return stops


def build_card_variants():
    """
    재질별 카드 면을 card_art/<재질>.png로 굽습니다.

    개봉 연출에서 웹이 서버가 뽑은 재질의 면으로 카드 텍스처를 갈아 끼웁니다.
    GLB에 넣지 않는 이유는 두 가지입니다. 재질을 받기 전에 특정 재질이 먼저
    보일 수 있고, 카드 한 장을 열 때마다 쓰지 않을 면까지 내려받게 됩니다.
    """
    os.makedirs(CARD_VARIANT_DIR, exist_ok=True)

    for material, stops in read_material_stops(CARD_CSS_PATH).items():
        build_card(stops, os.path.join(CARD_VARIANT_DIR, f"{material}.png"))


def load_wordmark(path):
    """Anton 워드마크를 알파 마스크로 읽습니다. 색은 팩 팔레트가 정합니다."""
    if not os.path.exists(path):
        return None

    return load_rgba(path)[:, :, 3]


def resize_mask(mask, width):
    """알파 마스크를 비율을 지켜 가로 width로 맞춥니다. 쌍선형 보간입니다."""
    src_h, src_w = mask.shape
    height = round(src_h * width / src_w)

    ys = numpy.linspace(0.0, src_h - 1, height)
    xs = numpy.linspace(0.0, src_w - 1, width)
    y0, x0 = ys.astype(int), xs.astype(int)
    y1, x1 = numpy.minimum(y0 + 1, src_h - 1), numpy.minimum(x0 + 1, src_w - 1)
    fy, fx = (ys - y0)[:, None], (xs - x0)[None, :]

    top = mask[y0][:, x0] * (1 - fx) + mask[y0][:, x1] * fx
    bottom = mask[y1][:, x0] * (1 - fx) + mask[y1][:, x1] * fx

    return (top * (1 - fy) + bottom * fy).astype(numpy.float32)


def build_card_back():
    """
    카드 뒷면. 실물 TCG처럼 재질과 상관없이 모든 카드가 같은 뒷면을 씁니다.

    팩과 같은 언어로 그립니다 — 잉크 남색 바탕, 팩 뒷면의 도트 격자, 가운데
    워드마크. 테두리는 크림으로 둘러 앞면(회색 테두리)과 한눈에 구분되게 합니다.

    크림은 옆면 종이 단면(pack_generator의 CARD_EDGE_COLOR)과 거의 같은 색이라
    테두리와 옆면이 이어진 한 장의 인쇄물로 읽힙니다. 브랜드 레드는 안쪽 가는
    선으로만 씁니다. 레드로 테두리 전체를 두르면 로고보다 테두리가 먼저 보이고,
    수집 대상인 앞면보다 뒷면이 더 시끄러워집니다.
    """
    height = round(CARD_WIDTH * pack.CARD_ASPECT)
    unit = height / 384.0
    border = round(6 * unit)

    # 가운데가 밝고 가장자리로 갈수록 가라앉는 방사형 바탕
    y = numpy.linspace(-1.0, 1.0, height, dtype=numpy.float32)[:, None]
    x = numpy.linspace(-1.0, 1.0, CARD_WIDTH, dtype=numpy.float32)[None, :]
    t = numpy.clip(numpy.sqrt(x * x + y * y) / numpy.sqrt(2.0), 0.0, 1.0)[:, :, None]
    canvas = INK * (1.0 - t) + VOID * t

    inset = border + round(4 * unit)
    step = round(14 * unit)
    dot = max(2, round(2 * unit))

    # 엠블럼 — 워드마크와 그 아래 고지 문구. 도트 격자는 이 띠를 비워 둡니다
    wordmark = load_wordmark(WORDMARK_PATH)
    mark = resize_mask(wordmark, round(CARD_WIDTH * 0.68)) if wordmark is not None else None
    mark_h = mark.shape[0] if mark is not None else 0
    tag_scale = 3
    tag_gap = round(6 * unit)
    emblem_h = mark_h + tag_gap + GLYPH_HEIGHT * tag_scale
    emblem_y = (height - emblem_h) // 2

    def centered(length):
        """테두리 안쪽에서 양 끝 여백이 같도록 격자 위치를 잡습니다."""
        count = (length - 2 * (inset + step)) // step + 1
        start = (length - (count - 1) * step - dot) // 2
        return range(start, start + count * step, step)

    for dot_y in centered(height):
        if emblem_y - step < dot_y < emblem_y + emblem_h + step:
            continue
        for dot_x in centered(CARD_WIDTH):
            canvas[dot_y:dot_y + dot, dot_x:dot_x + dot] = SLATE

    outline(canvas, 0, 0, height, CARD_WIDTH, BONE, border)
    round_corners(canvas, border, BONE)
    outline(canvas, inset, inset, height - 2 * inset, CARD_WIDTH - 2 * inset,
            BRICK, max(1, round(unit)))

    if mark is not None:
        blend(canvas, emblem_y, (CARD_WIDTH - mark.shape[1]) // 2, BONE, mark)
    draw_text(canvas, TAGLINE, CARD_WIDTH // 2, emblem_y + mark_h + tag_gap, tag_scale, TAN)

    save_srgb(pack.CARD_BACK_PATH, canvas)
    print(f"  카드 뒷면    {CARD_WIDTH} x {height}   {pack.CARD_BACK_PATH}")


def build_art():
    box = layout()
    sprite = build_sprite(HERO_PATH, box)
    wordmark = load_wordmark(WORDMARK_PATH)

    canvas = numpy.broadcast_to(INK, (box["height"], box["width"], 3)).copy()

    paint_bands(canvas, box)
    paint_back(canvas, box)
    paint_front(canvas, box, sprite, wordmark)

    save_srgb(OUTPUT_PATH, canvas)

    hero_note = (
        f"{'x'.join(str(v) for v in reversed(sprite[1].shape))}px"
        if sprite is not None else "없음 — 자리 비움"
    )

    print("─" * 56)
    print(f"  캔버스      {box['width']} x {box['height']}")
    print(f"  상단 실링    0 ~ {box['top_seal_y']}")
    print(f"  뜯기는 부분  {box['top_seal_y']} ~ {box['seam_y']}")
    print(f"  절취선      {box['seam_y']}   점선 {TEAR_LINE}px / 대시 {TEAR_DASH}px")
    print(f"  히어로      {box['hero_y']} ~ {box['hero_end']}   {hero_note}")
    print(f"  워드마크    {box['wordmark_y']} ~ {box['notice_y']}"
          f"   {'x'.join(str(v) for v in reversed(wordmark.shape)) if wordmark is not None else '없음'}")
    print(f"  고지 문구    {box['notice_y']} ~ {box['bottom_seal_y']}   {TAGLINE}")
    print(f"  하단 실링    {box['bottom_seal_y']} ~ {box['height']}")
    print(f"  핀 실       x {box['fin_center'] - box['fin_half']}"
          f" ~ {box['fin_center'] + box['fin_half']}")
    print(f"  히어로 원본  {HERO_PATH if sprite is not None else '없음 — 자리 비움'}")
    print(f"  저장        {OUTPUT_PATH}")
    print("─" * 56)


if __name__ == "__main__":
    build_art()
    build_card()
    build_card_variants()
    build_card_back()
