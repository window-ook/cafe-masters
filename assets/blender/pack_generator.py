"""
Cafe Masters — 카드팩 개봉 애니메이션 생성 스크립트

실행하면 주머니와 뜯기는 조각, 카드, 카메라, 조명, 애니메이션까지
씬을 통째로 만들고 GLB로 내보냅니다.

실행 방법
    GUI  : Blender > Scripting 탭 > 파일 열기 > Run Script (Alt+P)
    CLI  : blender --background --python assets/blender/pack_generator.py

동작
    1 ~ 30    오른쪽 끝을 축으로 윗부분이 쐐기꼴로 벌어지며 뜯김
    26 ~ 60   카드가 톱니 rim 사이로 올라옴
    30 ~ 60   잘린 조각이 회전하며 프레임 밖으로 날아감

설계 원칙
    이징        곡선이 아니라 구간 배분으로 만듭니다. 키프레임은 전부 LINEAR입니다.
                스크롤 진행도와 프레임이 1:1로 대응해야 하는데, 베지어를 쓰면
                Blender 커브와 웹 스크롤 매핑이 이중으로 걸려 예측이 불가능해집니다.
    절취선      실제 파단 시뮬레이션이 아니라, 하나의 톱니 곡선을 두 조각이 공유하고
                한쪽 끝을 축으로 강체 회전시켜 뜯기는 것처럼 보이게 합니다.
    구간 공백   변화가 없는 스크롤 구간이 생기면 사용자는 스크롤이 먹통이라고 느낍니다.
                뜯기 / 카드 상승 / 조각 비행이 서로 겹치도록 배치했습니다.
"""

import math
import os
import random

import bmesh
import bpy
import mathutils
import numpy

# ─────────────────────────────────────────────────────────────
# 파라미터 — 여기 숫자만 바꿔 가며 조정합니다
# ─────────────────────────────────────────────────────────────

PACK_WIDTH = 1.0
PACK_HEIGHT = 1.45
PACK_DEPTH = 0.075        # 부푼 가운데의 두께. 카드가 이 틈에 들어갑니다

# 실제 TCG 부스터 팩(pillow pack) 마감 — 좌우는 필름이 접힌 fold, 상하만 압착 실링입니다
SEAL_RATIO = 0.075        # 상하 크림프 실링이 차지하는 세로 비율
SEAL_FLAT_RATIO = 0.030   # 그중 두께 변화 없이 완전히 납작한 립. 이 평평한 띠가 실링의 인상을 만듭니다
FLANGE_DEPTH = 0.009      # 실링부 두께. 필름 두 장이 맞붙어도 0은 아닙니다
FOLD_POWER = 4.5          # 좌우 fold의 단면 형상. 클수록 가운데가 평평하고 끝에서 급히 말립니다
CRIMP_AMP = 0.006         # 실링 죠의 이빨 자국 깊이
FIN_WIDTH = 0.13          # 뒷면 중앙 핀 실의 폭 (팩 너비 대비)
FIN_HEIGHT = 0.014        # 핀 실이 뒷면에서 솟아오르는 높이
CRIMP_PERIOD = 0.048      # 이빨 자국 간격. 컬럼 간격의 2배보다 커야 표현됩니다
GRID_ROWS = 22            # 세로 격자 해상도. 실링 전이 구간을 담을 만큼 필요합니다
GRID_ROW_BIAS = 1.8       # 1보다 크면 바깥 끝(실링부)에 행이 몰립니다
TOP_RATIO = 0.22          # 위 조각이 차지하는 세로 비율. 카드가 아래 조각에 다 들어가야 합니다
TEETH = 26                # 절취선 톱니 개수. 적고 크면 톱날처럼 보입니다
TEETH_AMP = 0.020         # 톱니 진폭
TEAR_SEED = 7             # 뜯긴 자국의 불규칙함을 고정하는 시드

CARD_WIDTH_RATIO = 0.78   # 봉투 너비 대비 카드 너비
CARD_ASPECT = 1.4         # 카드 세로/가로. 실제 TCG 규격 63×88mm를 따릅니다
CARD_CLEARANCE = 0.02     # 카드 윗변과 이음새 사이 여유
CARD_THICKNESS_RATIO = 0.3 / 63.0   # 카드 두께/가로. 실제 TCG 규격 0.3mm / 63mm
CARD_CORNER_RATIO = 3.0 / 63.0      # 모서리 반경/가로. 실제 TCG 약 3mm / 63mm
CARD_CORNER_SEGMENTS = 8            # 모서리 호 하나를 나누는 칸 수

PACK_YAW_DEG = 15.0       # 팩 전체를 비트는 각도. 0이면 도표처럼 납작해 보입니다

# 뜯기 — 오른쪽 끝을 축으로 왼쪽 끝이 들리며 쐐기꼴로 벌어집니다.
# yaw 때문에 왼쪽이 카메라에 가까우므로, 가까운 쪽이 들려야 잘 보입니다
TEAR_LIFT_DEG = 42.0      # Y축(깊이축) 회전. 자유단이 들리는 각도
TEAR_PEEL_DEG = 24.0      # X축 회전. 카메라 쪽으로 벗겨지는 정도
TEAR_LIFT_Z = 0.06        # 회전과 별개로 조각 전체가 살짝 뜨는 거리. 축 쪽도 떨어져야 합니다

# 분리된 조각이 날아가는 목적지와 회전. 프레임 밖으로 나갈 만큼 충분해야 합니다
FLY_OFFSET = (-1.5, -0.8, 2.0)
FLY_SPIN_DEG = (46.0, 120.0, -34.0)

FRAME_START = 1
FRAME_TEAR_BREAK = 18     # 뜯기의 85%가 끝나는 지점
FRAME_TEAR_END = 30       # 조각이 완전히 분리되는 지점
FRAME_FLY_MID = 46        # 비행 구간을 나누는 지점
FRAME_END = 60
TEAR_AT_BREAK = 0.85      # FRAME_TEAR_BREAK 시점의 뜯기 진행도
FLY_AT_MID = 0.28         # FRAME_FLY_MID 시점의 비행 진행도. 낮을수록 오래 머뭅니다

# 카드가 최종적으로 올라오는 거리. 카드 높이의 80%는 나와야 인쇄면 아래쪽의
# 흰 띠까지 드러납니다. 절반만 올리면 카드에 무엇을 그리든 상단만 보입니다
CARD_RISE = 0.88
FRAME_CARD_START = 26     # 카드가 올라오기 시작하는 프레임. 조각 비행과 겹칩니다

# 색은 선형(linear) 값입니다. sRGB 헥스와 다르니 눈으로 보고 조정하세요
VINYL_COLOR = (0.055, 0.062, 0.085, 1.0)   # 짙은 잉크 슬레이트
CARD_COLOR = (0.62, 0.42, 0.10, 1.0)       # 자리표시용 앰버
CARD_EDGE_COLOR = (0.783, 0.745, 0.658, 1.0)   # #e5e0d4 — 카드 옆면에 드러나는 종이 단면

# 임시 인쇄에 쓰는 색. 실제 아트워크를 넣으면 무시됩니다
ART_INK = (0.015, 0.023, 0.042)
ART_ACCENT = (0.701, 0.065, 0.044)   # #da483b — globals.css의 --color-main
ART_CREAM = (0.848, 0.787, 0.639)

RENDER_WIDTH = 1080       # 모달이 세로로 길어 세로 화면비를 씁니다
RENDER_HEIGHT = 1440
CAMERA_LENS = 85          # 짧으면 원근이 과해져 팩이 양동이처럼 벌어져 보입니다
CAMERA_SENSOR = 36.0
CAMERA_TILT_DEG = 13.0    # 위에서 내려다보는 각도. 0이면 주머니 깊이가 안 보입니다
FRAME_MARGIN = 1.18       # 담을 세로 범위에 곱하는 여백 배수
WORLD_STRENGTH = 0.55     # HDRI 세기. 형태는 라이트가 만들고 HDRI는 반사만 담당합니다
ART_CANVAS_WIDTH = 2048   # 아트워크 캔버스 가로. 세로는 팩 비율로 계산해 안내합니다

ASSET_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_PATH = os.path.join(ASSET_DIR, "card_pack.glb")

# 여기에 아트워크를 두면 겉면에 입혀집니다. 없으면 단색으로 렌더됩니다
PACK_ART_PATH = os.path.join(ASSET_DIR, "pack_art.png")
CARD_ART_PATH = os.path.join(ASSET_DIR, "card_art.png")
CARD_BACK_PATH = os.path.join(ASSET_DIR, "card_back.png")


# ─────────────────────────────────────────────────────────────
# 씬 초기화
# ─────────────────────────────────────────────────────────────

def clear_scene():
    """
    기존 오브젝트와 데이터 블록을 모두 제거합니다.

    오브젝트는 선택-삭제가 아니라 데이터에서 직접 지웁니다. 숨긴 오브젝트는
    선택되지 않아 살아남고, 새로 만든 쪽이 PackPouch.001로 밀려나 GLB에
    팩이 두 벌 들어갑니다.
    """
    for obj in list(bpy.data.objects):
        bpy.data.objects.remove(obj, do_unlink=True)

    for block in (bpy.data.meshes, bpy.data.materials, bpy.data.cameras, bpy.data.lights):
        for item in list(block):
            if item.users == 0:
                block.remove(item)

    # 파일 이미지도 지웁니다. 남겨 두면 load(check_existing=True)가 디스크 대신
    # 세션에 남은 옛 픽셀을 돌려줘, 아트를 다시 구워도 GLB에 이전 그림이 들어갑니다
    for image in list(bpy.data.images):
        if image.users == 0 and image.source == "FILE":
            bpy.data.images.remove(image)


# ─────────────────────────────────────────────────────────────
# 메시 — 톱니 가장자리를 가진 조각
# ─────────────────────────────────────────────────────────────

def zigzag_edge(width, teeth, amp):
    """
    절취선 경계 곡선 s(x)를 (x, offset) 목록으로 반환합니다.

    위 조각과 아래 조각이 이 하나의 곡선을 공유해야 톱니가 맞물립니다.
    조각마다 부호를 뒤집으면 같은 자리가 양쪽 모두 파여 구멍이 생깁니다.

    진폭과 x를 흔드는 이유는 균일한 톱니가 핑킹가위 자국처럼 보이기 때문입니다.
    실제로 뜯긴 자국은 불규칙합니다. 고정 시드를 써서 두 조각이 같은 곡선을 얻습니다.
    """
    rng = random.Random(TEAR_SEED)
    points = []
    segments = teeth * 2
    step = width / segments

    for i in range(segments + 1):
        x = -width / 2 + step * i
        if i not in (0, segments):
            x += rng.uniform(-0.35, 0.35) * step

        if i % 2 == 0:
            offset = amp * rng.uniform(0.45, 1.0)
        else:
            offset = amp * rng.uniform(0.0, 0.2)

        points.append((x, offset))

    return points


def smoothstep(value, edge):
    """0 ~ edge 구간을 S자로 완만하게 올립니다."""
    t = min(max(value / edge, 0.0), 1.0)

    return t * t * (3.0 - 2.0 * t)


def seal_factor(z, height):
    """
    바깥 끝 실링 구간에서 0, 안쪽에서 1.

    두께와 이빨 자국, 핀 실이 모두 이 값을 참조합니다. 실링부에서 함께 사라져야
    하는 요소들이라 기준을 하나로 두어야 어긋나지 않습니다.
    """
    along = min(abs(z) / height, 1.0)   # 0 = 이음새, 1 = 바깥 끝

    # 바깥 SEAL_FLAT_RATIO 구간은 완전히 납작하고, 거기서 SEAL_RATIO까지 부풀어 오릅니다
    inward = (1.0 - along) - SEAL_FLAT_RATIO

    return smoothstep(inward, SEAL_RATIO - SEAL_FLAT_RATIO)


def surface_at(x, z, height):
    """
    (x, z) 지점의 (중심면 오프셋, 반두께)를 돌려줍니다.

    실제 부스터 팩은 상자가 아니라 pillow pack입니다.
        좌우   실링이 아니라 필름이 접힌 fold. 두께가 0으로 수렴하며 둥글게 말립니다
        상하   압착 크림프 실링. 납작한 flange에 죠(jaw)의 이빨 자국이 남습니다
        가운데 내용물로 부풂

    이 실루엣이 재질보다 먼저 "카드팩"을 지시합니다. 네 변을 다 실링하면
    상자가 되고, 이빨 자국이 z 방향으로도 변해 격자 해상도가 폭발합니다.

    z를 절댓값으로 정규화하므로 위로 뻗는 조각과 아래로 뻗는 주머니에
    같은 식이 그대로 적용됩니다. 둘 다 바깥 끝이 실링이니까요.
    """
    across = min(abs(x) / (PACK_WIDTH / 2), 1.0)   # 0 = 중앙, 1 = 좌우 끝

    fold = math.sqrt(max(1.0 - across ** FOLD_POWER, 0.0))
    seal = seal_factor(z, height)

    half = fold * (FLANGE_DEPTH + PACK_DEPTH * seal) / 2

    # 이빨 자국은 실링부에서만 나타나고 안쪽으로 갈수록 사라집니다
    crimp = CRIMP_AMP * (1.0 - seal) * math.sin(x * 2.0 * math.pi / CRIMP_PERIOD)

    return crimp * fold, half


def fin_at(x, z, height):
    """
    뒷면 중앙의 핀 실이 솟아오르는 높이. 앞면에는 적용되지 않습니다.

    부스터 팩은 필름 한 장을 통으로 말아 양 끝을 뒷면 가운데서 맞물려 붙입니다.
    그 접합부가 세로로 길게 융기하는데, 상하 크림프 구간에서는 함께 압착돼 사라지므로
    실링부에서 0이 되도록 seal_factor를 곱합니다.

    텍스처로는 만들 수 없습니다. 그림자를 그려 넣어도 실루엣이 생기지 않고,
    조명이 움직이면 가짜인 것이 바로 드러납니다.
    """
    half_width = FIN_WIDTH / 2
    if abs(x) >= half_width:
        return 0.0

    ridge = 0.5 * (1.0 + math.cos(math.pi * x / half_width))

    return FIN_HEIGHT * ridge * seal_factor(z, height)


def create_piece(name, width, height, teeth, amp, upward, bottom_height, pivot_x=0.0):
    """
    앞장과 뒷장이 절취선을 뺀 나머지 가장자리에서 붙은 주머니 조각을 만듭니다.

    절취선 쪽만 열려 있으므로 카드가 그 틈으로 빠져나옵니다. 평면 한 장으로
    만들면 젖혔을 때 두께가 0이라 화면에서 사라지고, 카드도 팩 뒤에 겹쳐 있다가
    올라올 뿐이라 "뜯어서 꺼낸다"로 읽히지 않습니다.

    pivot_x는 origin을 가로로 옮깁니다. 뜯기는 조각은 한쪽 끝을 축으로 돌아야
    쐐기꼴로 벌어지는데, origin이 가운데면 시소처럼 움직여 뜯김으로 안 읽힙니다.
    메시는 pivot만큼 반대로 밀어 두므로 오브젝트 위치로 상쇄하면 제자리에 옵니다.

    upward=True   위 조각. 이음새에서 위로 뻗습니다.
    upward=False  아래 주머니. 이음새에서 아래로 뻗습니다.
    """
    mesh = bpy.data.meshes.new(name)
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)

    seam = zigzag_edge(width, teeth, amp)
    far_z = height if upward else -height
    rows = max(6, round(GRID_ROWS * abs(height) / PACK_HEIGHT * 1.4))

    bm = bmesh.new()
    uv_layer = bm.loops.layers.uv.new("UVMap")

    def add_face(verts, is_front):
        """UV를 면 단위로 씁니다. fold에서 앞뒤가 정점을 공유하므로 정점으로는 못 가릅니다."""
        face = bm.faces.new(verts)
        for loop in face.loops:
            position = loop.vert.co
            loop[uv_layer].uv = pack_uv(
                position.x + pivot_x, position.z, bottom_height, is_front
            )

    # 격자 — 컬럼은 톱니 x 위치를 그대로 쓰고, 행은 이음새에서 바깥 끝으로 뻗습니다.
    # 행을 바깥으로 몰아야 실링 전이 구간이 뭉개지지 않습니다
    front, back = [], []
    for column, (x, seam_z) in enumerate(seam):
        on_fold = column in (0, len(seam) - 1)
        front_column, back_column = [], []

        for row in range(rows + 1):
            t = 1.0 - (1.0 - row / rows) ** GRID_ROW_BIAS
            z = seam_z + (far_z - seam_z) * t
            center, half = surface_at(x, z, height)

            front_vert = bm.verts.new((x - pivot_x, center - half, z))
            # fold에서는 두께가 0이라 앞뒤가 같은 자리입니다. 정점을 공유해 접힘을 만듭니다.
            # 핀 실은 뒷면에만 얹히므로 앞면은 그대로 둡니다
            if on_fold:
                back_vert = front_vert
            else:
                back_y = center + half + fin_at(x, z, height)
                back_vert = bm.verts.new((x - pivot_x, back_y, z))

            front_column.append(front_vert)
            back_column.append(back_vert)

        front.append(front_column)
        back.append(back_column)

    for i in range(len(seam) - 1):
        for j in range(rows):
            add_face((front[i][j], front[i][j + 1], front[i + 1][j + 1], front[i + 1][j]), True)
            add_face((back[i][j], back[i + 1][j], back[i + 1][j + 1], back[i][j + 1]), False)

        # 바깥 끝의 실링 립. 좌우는 fold라 막을 필요가 없고 이음새는 열려 있어야 합니다
        if front[i][rows] != back[i][rows] and front[i + 1][rows] != back[i + 1][rows]:
            add_face((front[i][rows], front[i + 1][rows], back[i + 1][rows], back[i][rows]), True)

    bmesh.ops.recalc_face_normals(bm, faces=bm.faces[:])
    bmesh.ops.triangulate(bm, faces=bm.faces[:])
    bm.normal_update()
    bm.to_mesh(mesh)
    bm.free()

    # fold는 접힘이지 각진 모서리가 아니므로 부드럽게 이어져야 합니다
    if hasattr(mesh, "shade_smooth"):
        mesh.shade_smooth()

    return obj


def pack_uv(x, z, bottom_height, is_front):
    """
    팩 전체를 아트워크 이미지 한 장에 매핑하는 좌표.

        U  0.0 ~ 0.5  앞면 (왼→오)
        U  0.5 ~ 1.0  뒷면 (펼친 전개도라 오→왼으로 이어짐)
        V  0.0        팩 바닥
        V  1.0        덮개 끝

    glTF는 UV 기반 텍스처만 지원합니다. 셰이더에서 오브젝트 좌표로 투영하는
    방식은 Blender에서만 보이고 .glb로는 나가지 않습니다.
    """
    across = (x + PACK_WIDTH / 2) / PACK_WIDTH
    v = (z + bottom_height) / PACK_HEIGHT

    return (across * 0.5 if is_front else 1.0 - across * 0.5, v)


def create_root(name, yaw_deg):
    """
    팩 전체를 담는 부모 노드.

    정면 대칭 구도는 도표처럼 보입니다. 살짝 비틀어야 옆면이 드러나
    두께가 인지됩니다. 덮개가 자기 로컬 X축을 경첩으로 쓰므로 개별 오브젝트를
    돌리면 회전축이 틀어집니다. 부모를 돌려야 경첩이 보존됩니다.
    """
    root = bpy.data.objects.new(name, None)
    root.empty_display_type = "PLAIN_AXES"
    root.rotation_euler = (0.0, 0.0, math.radians(yaw_deg))
    bpy.context.collection.objects.link(root)

    return root


def create_card(name, width, height):
    """
    개봉 후 드러나는 카드. 실제 규격 두께의 얇은 상자입니다.

    평면 한 장이면 뒤에서 볼 때 앞면 인쇄가 거울상으로 비칩니다. 실물 카드는
    앞뒤 인쇄가 다르고 옆에서 보면 종이 단면이 드러나므로, 면마다 머티리얼
    슬롯을 나눕니다. 슬롯 0 앞면 · 1 뒷면 · 2 옆면이며 glTF에서는 프리미티브
    3개로 나갑니다.

    앞면은 -Y(카메라 쪽)를 봅니다. 뒷면 U는 좌우를 뒤집어야 뒤에서 볼 때
    인쇄가 바로 읽힙니다.

    모서리는 실물처럼 둥글게 깎습니다. 인쇄면 UV는 정점 위치에서 바로 계산하므로
    아트워크는 직사각형 그대로 두고 모서리만 잘려 나갑니다.
    """
    mesh = bpy.data.meshes.new(name)
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)

    half_w, half_h = width / 2, height / 2
    half_t = width * CARD_THICKNESS_RATIO / 2
    radius = width * CARD_CORNER_RATIO

    # 오른쪽 아래 모서리부터 반시계 방향으로 호 네 개를 잇습니다. 직선 변은 호 사이에 저절로 생깁니다
    centers = (
        (half_w - radius, -half_h + radius),
        (half_w - radius, half_h - radius),
        (-half_w + radius, half_h - radius),
        (-half_w + radius, -half_h + radius),
    )
    outline = []
    for k, (cx, cz) in enumerate(centers):
        for s in range(CARD_CORNER_SEGMENTS + 1):
            angle = math.radians(90 * k - 90 + 90 * s / CARD_CORNER_SEGMENTS)
            outline.append((cx + radius * math.cos(angle), cz + radius * math.sin(angle)))

    bm = bmesh.new()
    uv_layer = bm.loops.layers.uv.new("UVMap")
    front = [bm.verts.new((x, -half_t, z)) for x, z in outline]
    back = [bm.verts.new((x, half_t, z)) for x, z in outline]

    def add_face(verts, slot, mirror=False):
        face = bm.faces.new(verts)
        face.material_index = slot
        for loop in face.loops:
            u = (loop.vert.co.x + half_w) / width
            v = (loop.vert.co.z + half_h) / height
            loop[uv_layer].uv = (1.0 - u if mirror else u, v)

    add_face(front, 0)
    add_face(back[::-1], 1, mirror=True)
    for i in range(len(outline)):
        j = (i + 1) % len(outline)
        add_face((front[j], front[i], back[i], back[j]), 2)

    bm.normal_update()
    bm.to_mesh(mesh)
    bm.free()

    return obj


# ─────────────────────────────────────────────────────────────
# 재질
# ─────────────────────────────────────────────────────────────

def set_input(bsdf, names, value):
    """Blender 버전마다 소켓 이름이 달라 후보를 순서대로 시도합니다."""
    for name in names:
        if name in bsdf.inputs:
            bsdf.inputs[name].default_value = value
            return True
    return False


def add_crinkle(mat, targets, coarse_scale, coarse_strength, fine_scale, fine_strength):
    """
    노이즈 범프 두 겹으로 포장재의 구김을 만듭니다.

    사실감의 핵심은 색이나 광택이 아니라 이 요철입니다. 표면이 완벽하게 매끈하면
    아무리 반사율을 올려도 플라스틱 판으로 보입니다. 하이라이트가 불규칙하게
    끊겨야 비닐로 읽힙니다.

    Bump 노드에 Normal 입력이 있어 체인으로 겹칠 수 있습니다. Mix 노드로 합치면
    타입별 소켓이 겹쳐 있어 인덱스 접근이 버전마다 깨집니다.
    """
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links

    coords = nodes.new("ShaderNodeTexCoord")

    previous_normal = None
    for scale, strength, distance in (
        (coarse_scale, coarse_strength, 0.02),
        (fine_scale, fine_strength, 0.003),
    ):
        noise = nodes.new("ShaderNodeTexNoise")
        noise.inputs["Scale"].default_value = scale
        noise.inputs["Detail"].default_value = 2.0

        bump = nodes.new("ShaderNodeBump")
        bump.inputs["Strength"].default_value = strength
        bump.inputs["Distance"].default_value = distance

        # 오브젝트 좌표를 써야 노이즈가 표면에 붙어 있고, 덮개가 회전해도 같이 돕니다
        links.new(coords.outputs["Object"], noise.inputs["Vector"])
        links.new(noise.outputs["Fac"], bump.inputs["Height"])
        if previous_normal:
            links.new(previous_normal, bump.inputs["Normal"])
        previous_normal = bump.outputs["Normal"]

    for target in targets:
        links.new(previous_normal, target.inputs["Normal"])


def create_vinyl_material(name):
    """
    인쇄된 마일러 포장 재질.

    반드시 Principled BSDF 하나가 Material Output에 직접 연결된 형태를 유지해야
    합니다. glTF 익스포터는 이 형태만 인식하고, Mix Shader 같은 걸 끼우면
    매핑을 포기하면서 베이스 컬러 텍스처까지 통째로 버립니다. Blender 뷰포트에서는
    멀쩡한데 브라우저에서는 무지 회색이 나오는 사고가 여기서 납니다.

    같은 이유로 안쪽 포일 라이너(Geometry > Backfacing으로 나누던 것)는 뺐습니다.
    glTF로 표현하려면 안쪽 셸을 따로 모델링해야 하는데, 가로로 뜯는 방식에서는
    안쪽이 거의 보이지 않아 값을 못 합니다.

    구김 범프는 그대로 둡니다. 절차적 노이즈도 glTF로는 안 나가지만,
    익스포터가 Normal 입력을 무시할 뿐 다른 걸 망가뜨리진 않습니다.
    브라우저에서도 살리려면 노멀맵으로 베이크해야 합니다.
    """
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links

    # 포일 느낌은 metallic이 아니라 코팅층의 정반사에서 옵니다.
    # metallic을 올리면 확산 반사가 사라져 어두운 환경에서 형태가 통째로 사라집니다
    outer = nodes.get("Principled BSDF")
    set_input(outer, ["Base Color"], VINYL_COLOR)

    # 아트워크 파일이 있으면 겉면 색을 대체합니다. 없으면 단색으로 그대로 둡니다
    if os.path.exists(PACK_ART_PATH):
        art = nodes.new("ShaderNodeTexImage")
        art.image = bpy.data.images.load(PACK_ART_PATH, check_existing=True)
        links.new(art.outputs["Color"], outer.inputs["Base Color"])
    set_input(outer, ["Metallic"], 0.12)
    set_input(outer, ["Roughness"], 0.30)
    set_input(outer, ["Coat Weight", "Clearcoat"], 0.45)
    set_input(outer, ["Coat Roughness", "Clearcoat Roughness"], 0.06)

    add_crinkle(mat, (outer,), coarse_scale=6.0, coarse_strength=0.22,
                fine_scale=90.0, fine_strength=0.06)

    return mat


def create_card_material(name, art_path=CARD_ART_PATH):
    """
    팩에서 나오는 카드의 인쇄면. 앞면과 뒷면이 같은 종이 · 코팅을 쓰고 인쇄만 다릅니다.

    개봉 순간의 카드는 재질이 아직 확정되지 않았으므로 앞면에는 미개봉 면을 입힙니다.
    광물 6종은 개봉 시점에 서버가 뽑고(actions/supabase/collection/open.ts)
    표시는 웹의 card-base-* CSS가 담당하므로, 여기서 특정 재질을 입히면
    실제로 뽑힌 재질과 어긋난 그림이 먼저 보이게 됩니다.
    뒷면은 실물 TCG처럼 모든 카드가 같으므로 그런 문제가 없습니다.
    """
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    bsdf = nodes.get("Principled BSDF")

    set_input(bsdf, ["Base Color"], CARD_COLOR)

    # 팩 겉면과 같은 이유로 Principled BSDF 하나만 두고 직접 연결합니다
    if os.path.exists(art_path):
        art = nodes.new("ShaderNodeTexImage")
        art.image = bpy.data.images.load(art_path, check_existing=True)
        mat.node_tree.links.new(art.outputs["Color"], bsdf.inputs["Base Color"])
    set_input(bsdf, ["Roughness"], 0.34)
    # 카드는 종이에 코팅입니다. metallic을 올리면 확산 반사가 사라져,
    # 미개봉 면처럼 어두운 인쇄가 팩 안쪽 그늘에서 통째로 검게 죽습니다.
    # 광택은 metallic이 아니라 Coat이 맡아야 합니다
    set_input(bsdf, ["Metallic"], 0.0)
    set_input(bsdf, ["Coat Weight", "Clearcoat"], 0.4)
    set_input(bsdf, ["Coat Roughness", "Clearcoat Roughness"], 0.05)

    return mat


def create_card_edge_material(name):
    """카드 옆면. 인쇄도 코팅도 없는 종이 단면이라 광택 없이 둡니다."""
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")

    set_input(bsdf, ["Base Color"], CARD_EDGE_COLOR)
    set_input(bsdf, ["Roughness"], 0.8)
    set_input(bsdf, ["Metallic"], 0.0)

    return mat


# ─────────────────────────────────────────────────────────────
# 애니메이션 — 이징을 곡선이 아니라 구간 배분으로 표현합니다
# ─────────────────────────────────────────────────────────────

def iter_fcurves(action):
    """
    액션에 속한 모든 F-Curve를 순회합니다.

    Blender 4.4에서 Slotted Actions가 도입되며 Action.fcurves가 사라지고
    layer > strip > channelbag 계층으로 바뀌었습니다. 두 구조를 모두 지원합니다.
    """
    if hasattr(action, "fcurves"):
        yield from action.fcurves
        return

    for layer in action.layers:
        for strip in layer.strips:
            for channelbag in strip.channelbags:
                yield from channelbag.fcurves


def make_linear(obj):
    """
    모든 키프레임을 LINEAR로 만듭니다.

    베지어를 쓰지 않는 이유는 구간 배분이 그대로 프레임 번호와 대응해야
    스크롤 진행도를 프레임에 1:1로 매핑할 수 있기 때문입니다.
    """
    if not obj.animation_data or not obj.animation_data.action:
        return

    for fcurve in iter_fcurves(obj.animation_data.action):
        for keyframe in fcurve.keyframe_points:
            keyframe.interpolation = "LINEAR"


def animate_strip(strip, pivot):
    """
    한쪽 끝을 잡고 가로로 잡아뜯은 뒤, 잘린 조각이 날아가는 애니메이션.

    origin이 오른쪽 끝에 있으므로 Y축(깊이축) 회전이 왼쪽 자유단을 들어올립니다.
    노출되는 톱니 rim이 왼쪽에서 오른쪽으로 번져 나가는데, 이게 실제 찢김의
    진행 방향과 같아서 강체 하나만으로도 뜯기는 것처럼 읽힙니다.

    X축 회전을 섞어 카메라 쪽으로 벗겨지게 하고, Z를 조금 띄워 축 쪽 끝도
    떨어지게 합니다. 축이 붙어 있으면 시소처럼 보입니다.

    회전이 끝나는 시점과 비행이 시작되는 시점을 겹치지 않으면
    "멈췄다가 갑자기 날아가는" 끊김이 생깁니다.
    """
    lift = math.radians(TEAR_LIFT_DEG)
    peel = math.radians(TEAR_PEEL_DEG)

    def key(frame, progress):
        strip.rotation_euler = (peel * progress, lift * progress, 0.0)
        strip.location = (pivot[0], pivot[1], pivot[2] + TEAR_LIFT_Z * progress)
        strip.keyframe_insert("rotation_euler", frame=frame)
        strip.keyframe_insert("location", frame=frame)

    key(FRAME_START, 0.0)
    key(FRAME_TEAR_BREAK, TEAR_AT_BREAK)
    key(FRAME_TEAR_END, 1.0)

    # 분리 후 비행. 회전은 뜯긴 자세에서 이어서 더 돌아갑니다.
    # 등속으로 날리면 스크롤 절반쯤에 이미 화면을 벗어나 남은 구간이 비어 버리므로,
    # 중간 키로 구간을 나눠 처음에는 느리게 떨어져 나오다 끝에서 빠르게 빠집니다
    def fly(frame, progress):
        strip.location = (
            pivot[0] + FLY_OFFSET[0] * progress,
            pivot[1] + FLY_OFFSET[1] * progress,
            pivot[2] + TEAR_LIFT_Z + FLY_OFFSET[2] * progress,
        )
        strip.rotation_euler = (
            peel + math.radians(FLY_SPIN_DEG[0]) * progress,
            lift + math.radians(FLY_SPIN_DEG[1]) * progress,
            math.radians(FLY_SPIN_DEG[2]) * progress,
        )
        strip.keyframe_insert("location", frame=frame)
        strip.keyframe_insert("rotation_euler", frame=frame)

    fly(FRAME_FLY_MID, FLY_AT_MID)
    fly(FRAME_END, 1.0)

    make_linear(strip)


def animate_card(card, base_z):
    """
    카드는 뜯기가 거의 끝날 무렵부터 올라옵니다.

    조각이 날아가는 구간과 겹쳐 두는 이유는, 겹치지 않으면 스크롤 중간에
    아무것도 변하지 않는 구간이 생겨 사용자가 스크롤이 먹통이라고 느끼기 때문입니다.
    """
    card.location = (0.0, 0.0, base_z)
    card.keyframe_insert("location", frame=FRAME_START)
    card.keyframe_insert("location", frame=FRAME_CARD_START)

    card.location = (0.0, 0.0, base_z + CARD_RISE)
    card.keyframe_insert("location", frame=FRAME_END)

    make_linear(card)


# ─────────────────────────────────────────────────────────────
# 카메라와 조명
# ─────────────────────────────────────────────────────────────

def setup_camera(center_z, span_z):
    """
    세로로 span_z만큼을 담도록 카메라를 뒤로 물립니다.

    화면비가 세로로 길면 Blender는 센서 36mm를 세로에 맞추므로
    수직 화각으로 거리를 역산할 수 있습니다.
    """
    scene = bpy.context.scene
    scene.render.resolution_x = RENDER_WIDTH
    scene.render.resolution_y = RENDER_HEIGHT

    half_fov = math.atan((CAMERA_SENSOR / 2) / CAMERA_LENS)
    distance = (span_z * FRAME_MARGIN / 2) / math.tan(half_fov)

    # 살짝 위에서 내려다봐야 주머니 안쪽과 젖혀진 뚜껑의 두께가 보입니다
    tilt = math.radians(CAMERA_TILT_DEG)
    bpy.ops.object.camera_add(
        location=(
            0.0,
            -distance * math.cos(tilt),
            center_z + distance * math.sin(tilt),
        ),
        rotation=(math.radians(90) - tilt, 0, 0),
    )
    camera = bpy.context.active_object
    camera.name = "PackCamera"
    camera.data.lens = CAMERA_LENS
    camera.data.sensor_width = CAMERA_SENSOR
    scene.camera = camera

    return camera, distance


def aim(obj, target=(0.0, 0.0, 0.0)):
    """오브젝트의 -Z축이 target을 향하도록 회전시킵니다. 라이트 조준용입니다."""
    direction = mathutils.Vector(target) - obj.location
    obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()


def setup_lights():
    """
    키 하나와 림 둘.

    림 라이트가 특히 중요합니다. 팩이 어두운 모달 배경 위에 올라가므로
    실루엣 가장자리에 빛이 걸리지 않으면 배경에 묻혀 형태가 사라집니다.
    """
    lights = []

    for name, location, energy, size in (
        ("KeyLight", (1.9, -2.3, 2.6), 420, 3.0),
        ("RimLeft", (-2.4, 1.7, 1.0), 300, 1.6),
        ("RimRight", (2.6, 1.9, 0.4), 200, 1.6),
        # 아래로 기운 덮개 겉면은 반사할 게 없어 검은 띠가 됩니다. 반사판 역할입니다
        ("FillBounce", (-0.6, -2.4, -1.6), 95, 4.0),
    ):
        bpy.ops.object.light_add(type="AREA", location=location)
        light = bpy.context.active_object
        light.name = name
        light.data.energy = energy
        light.data.size = size
        aim(light)
        lights.append(light)

    return lights


def setup_world():
    """
    환경광. 이미 HDRI가 걸려 있으면 세기만 맞추고, 없으면 절차적으로 만듭니다.

    씬을 스크립트로 재생성하는 이상 환경도 스크립트가 책임져야 합니다. 외부에서
    붙인 HDRI에만 의존하면 Blender를 새로 켤 때마다 그것만 사라져, 렌더가 달라지는데
    스크립트에는 아무 흔적이 없는 상태가 됩니다.

    형태는 라이트가 만들고 환경은 반사만 담당하므로 세기를 낮춰 둡니다.
    """
    world = bpy.context.scene.world or bpy.data.worlds.new("PackWorld")
    bpy.context.scene.world = world
    world.use_nodes = True

    nodes = world.node_tree.nodes
    links = world.node_tree.links
    background = nodes.get("Background")

    if background is None:
        background = nodes.new("ShaderNodeBackground")
        links.new(background.outputs["Background"], nodes["World Output"].inputs["Surface"])

    background.inputs["Strength"].default_value = WORLD_STRENGTH

    if any(node.type == "TEX_ENVIRONMENT" for node in nodes):
        return world

    # 위가 밝고 아래가 어두운 그라디언트. 비닐 반사에 세로 방향을 만들어 줍니다
    coords = nodes.new("ShaderNodeTexCoord")
    axis = nodes.new("ShaderNodeSeparateXYZ")
    ramp = nodes.new("ShaderNodeValToRGB")

    ramp.color_ramp.elements[0].position = 0.42
    ramp.color_ramp.elements[0].color = (0.02, 0.024, 0.032, 1.0)
    ramp.color_ramp.elements[1].position = 0.68
    ramp.color_ramp.elements[1].color = (1.0, 0.97, 0.92, 1.0)

    links.new(coords.outputs["Generated"], axis.inputs["Vector"])
    links.new(axis.outputs["Z"], ramp.inputs["Fac"])
    links.new(ramp.outputs["Color"], background.inputs["Color"])

    return world


# ─────────────────────────────────────────────────────────────
# 조립
# ─────────────────────────────────────────────────────────────

def build():
    clear_scene()

    scene = bpy.context.scene
    scene.frame_start = FRAME_START
    scene.frame_end = FRAME_END

    top_height = PACK_HEIGHT * TOP_RATIO
    bottom_height = PACK_HEIGHT * (1.0 - TOP_RATIO)
    seam_z = 0.0

    # 아래 주머니는 고정. 톱니 rim만 남기고 카드를 품고 있습니다
    pouch = create_piece(
        "PackPouch", PACK_WIDTH, bottom_height, TEETH, TEETH_AMP, False, bottom_height
    )
    pouch.location = (0.0, 0.0, seam_z)

    # 뜯겨 나갈 조각. origin이 오른쪽 끝에 와야 그 점을 축으로 쐐기꼴로 벌어집니다
    strip_pivot = (PACK_WIDTH / 2, 0.0, seam_z)
    strip = create_piece(
        "TearStrip", PACK_WIDTH, top_height, TEETH, TEETH_AMP, True,
        bottom_height, pivot_x=PACK_WIDTH / 2,
    )
    strip.location = strip_pivot

    vinyl = create_vinyl_material("VinylWrap")
    for obj in (pouch, strip):
        obj.data.materials.append(vinyl)

    # 카드 — 앞장과 뒷장 사이(y=0)에 끼워 넣습니다
    card_width = PACK_WIDTH * CARD_WIDTH_RATIO
    card_height = card_width * CARD_ASPECT
    card = create_card("Card", card_width, card_height)
    # 슬롯 순서가 create_card의 material_index와 맞아야 합니다
    card.data.materials.append(create_card_material("CardPlaceholder"))
    card.data.materials.append(create_card_material("CardBack", CARD_BACK_PATH))
    card.data.materials.append(create_card_edge_material("CardEdge"))

    # 1프레임에서 카드 윗변이 이음새 바로 아래에 오도록 놓습니다
    card_base_z = seam_z - card_height / 2 - CARD_CLEARANCE

    if card_height + CARD_CLEARANCE > bottom_height:
        raise ValueError(
            f"카드({card_height:.3f})가 아래 조각({bottom_height:.3f})보다 큽니다. "
            f"TOP_RATIO를 낮추거나 CARD_WIDTH_RATIO를 줄이세요."
        )

    animate_strip(strip, strip_pivot)
    animate_card(card, card_base_z)

    # 자식들은 이미 루트 로컬 좌표로 만들어졌으므로 parent_inverse는 건드리지 않습니다
    root = create_root("PackRoot", PACK_YAW_DEG)
    for child in (pouch, strip, card):
        child.parent = root

    # 담아야 할 세로 범위는 팩 바닥부터 카드가 다 올라온 높이까지입니다
    content_top = card_base_z + CARD_RISE + card_height / 2
    content_bottom = seam_z - bottom_height
    _, distance = setup_camera(
        center_z=(content_top + content_bottom) / 2,
        span_z=content_top - content_bottom,
    )
    setup_lights()
    setup_world()

    scene.render.engine = "CYCLES"
    scene.render.film_transparent = True

    print("─" * 56)
    print(f"  프레임      {FRAME_START} ~ {FRAME_END}")
    print(f"  뜯기        {FRAME_START}~{FRAME_TEAR_BREAK} : {TEAR_AT_BREAK:.0%}"
          f"  /  {FRAME_TEAR_BREAK}~{FRAME_TEAR_END} : {1 - TEAR_AT_BREAK:.0%}")
    print(f"  조각 비행    {FRAME_TEAR_END} ~ {FRAME_END}")
    print(f"  카드 상승    {FRAME_CARD_START} ~ {FRAME_END}")
    print(f"  카드 크기    {card_width:.3f} x {card_height:.3f}"
          f"  /  아래 조각 {bottom_height:.3f}")
    print(f"  카메라      거리 {distance:.2f}, 세로 {content_bottom:.2f} ~ {content_top:.2f}")

    # 아트워크를 그릴 때 절취선이 이미지 어느 높이에 오는지 알아야 안내선을 넣을 수 있습니다
    seam_v = bottom_height / PACK_HEIGHT
    art_height = round(ART_CANVAS_WIDTH / 2 * (PACK_HEIGHT / PACK_WIDTH))
    print(f"  아트워크    {ART_CANVAS_WIDTH} x {art_height}px "
          f"(왼쪽 절반 앞면, 오른쪽 절반 뒷면)")
    print(f"              절취선은 위에서 {(1 - seam_v) * 100:.1f}% "
          f"= 아래에서 {round(art_height * seam_v)}px 지점")
    print(f"              {'적용됨' if os.path.exists(PACK_ART_PATH) else '없음 — 단색 렌더'}"
          f"  {PACK_ART_PATH}")
    print("─" * 56)

    return pouch, strip, card


def export_placeholder_art(path):
    """
    아트워크가 아직 없을 때 쓰는 임시 인쇄.

    무지 필름 상태로는 실링 마감이 잘 나왔는지 판단이 어렵습니다. 색면이 있어야
    형태의 굴곡이 드러나니까요. 문자는 넣지 않습니다 — 색면 구성만으로도
    "인쇄된 포장"과 "무지 필름"은 확연히 갈립니다.

    실제 아트워크를 같은 경로에 두면 이 파일을 덮어쓰게 되므로 자동으로 밀려납니다.
    """
    width = ART_CANVAS_WIDTH
    height = round(ART_CANVAS_WIDTH / 2 * (PACK_HEIGHT / PACK_WIDTH))
    seam_v = (1.0 - TOP_RATIO)

    u = numpy.linspace(0.0, 1.0, width, dtype=numpy.float32)[None, :]
    v = numpy.linspace(0.0, 1.0, height, dtype=numpy.float32)[:, None]

    # 앞뒤 각각의 로컬 가로 좌표. 전개도라 뒷면은 방향이 반대입니다
    is_front = u < 0.5
    fx = numpy.where(is_front, u * 2.0, (1.0 - u) * 2.0)
    fx, vv = numpy.broadcast_arrays(fx, v)

    canvas = numpy.broadcast_to(
        numpy.array(ART_INK, dtype=numpy.float32), (height, width, 3)
    ).copy()

    # 가운데를 살짝 밝혀 인쇄면에 깊이를 줍니다
    canvas *= (0.72 + 0.55 * numpy.exp(-((vv - 0.45) ** 2) / 0.10))[:, :, None]

    # 절취선 바로 아래의 액센트 띠. 실제 팩도 뜯는 자리에 색 띠를 넣습니다
    canvas[(vv > seam_v - 0.035) & (vv < seam_v - 0.008)] = ART_ACCENT
    canvas[vv >= seam_v] = numpy.array(ART_INK, dtype=numpy.float32) * 1.8

    # 앞면 중앙 엠블럼. 타원 두 겹이면 로고 자리로 읽힙니다
    emblem = ((fx - 0.5) / 0.30) ** 2 + ((vv - 0.46) / 0.15) ** 2
    canvas[is_front & (emblem < 1.0)] = ART_ACCENT
    canvas[is_front & (emblem < 0.62)] = ART_CREAM

    # 하단 실링 밴드는 인쇄가 거의 없습니다
    canvas[vv < seam_v * SEAL_RATIO * 1.6] = numpy.array(ART_INK, dtype=numpy.float32) * 0.6

    art = numpy.ones((height, width, 4), dtype=numpy.float32)
    art[:, :, :3] = numpy.clip(canvas, 0.0, 1.0)

    image = bpy.data.images.new("PackArtPlaceholder", width, height, alpha=True)
    image.pixels = art.reshape(-1)
    image.filepath_raw = path
    image.file_format = "PNG"
    image.save()
    bpy.data.images.remove(image)

    print(f"  임시 인쇄    {path}")


def export_art_guide(path):
    """
    아트워크를 그릴 때 배경으로 깔 가이드 이미지를 만듭니다.

    절취선과 실링 밴드 위치는 TOP_RATIO, SEAL_RATIO에서 파생되는 값입니다.
    문서에 수치를 적어두면 팩 비율을 바꾸는 순간 거짓말이 되므로 계산해서 뽑습니다.

        진한 배경 / 옅은 배경   왼쪽 절반 앞면, 오른쪽 절반 뒷면
        붉은 밴드              바닥 실링. 앞뒤가 압착돼 두께가 0이라 그림이 찌그러집니다
        노란 선                절취선. 이 위로는 뜯겨 나가 안쪽이 드러납니다
    """
    width = ART_CANVAS_WIDTH
    height = round(ART_CANVAS_WIDTH / 2 * (PACK_HEIGHT / PACK_WIDTH))

    bottom_height = PACK_HEIGHT * (1.0 - TOP_RATIO)
    seam_v = bottom_height / PACK_HEIGHT
    seal_v = seam_v * SEAL_RATIO

    # Blender의 pixels는 아래쪽 행부터 채워지므로 v 좌표와 그대로 맞습니다
    pixels = numpy.zeros((height, width, 4), dtype=numpy.float32)
    pixels[:, :, 3] = 1.0
    pixels[:, : width // 2, :3] = 0.24
    pixels[:, width // 2 :, :3] = 0.15

    def band(v0, v1, color):
        pixels[int(v0 * height) : max(int(v1 * height), int(v0 * height) + 1), :, :3] = color

    band(0.0, seal_v, (0.34, 0.14, 0.14))
    band(seam_v - 0.004, seam_v + 0.004, (0.62, 0.52, 0.10))
    pixels[:, width // 2 - 1 : width // 2 + 1, :3] = 0.45

    image = bpy.data.images.new("PackArtGuide", width, height, alpha=True)
    image.pixels = pixels.reshape(-1)
    image.filepath_raw = path
    image.file_format = "PNG"
    image.save()
    bpy.data.images.remove(image)

    print(f"  가이드      {path}")

    return width, height


def export_glb(path):
    """
    GLB로 내보냅니다.

    Draco 압축은 버전에 따라 옵션 이름이 달라 기본 설정으로 내보낸 뒤
    gltf-transform 등으로 후처리하는 편이 안전합니다.
        npx @gltf-transform/cli draco card_pack.glb card_pack.draco.glb
    """
    bpy.ops.export_scene.gltf(
        filepath=path,
        export_format="GLB",
        export_animations=True,
        # 액션별로 나누면 클립이 오브젝트 수만큼 생겨 스크럽할 때 따로 동기화해야 합니다.
        # SCENE 모드는 씬 전체를 클립 하나로 묶습니다
        export_animation_mode="SCENE",
        export_frame_range=True,
        export_apply=True,
        export_cameras=True,
        export_lights=True,
    )
    print(f"  GLB 저장     {path}")


if __name__ == "__main__":
    # 실제 아트워크가 있으면 건드리지 않습니다
    if not os.path.exists(PACK_ART_PATH):
        export_placeholder_art(PACK_ART_PATH)

    build()
    export_art_guide(os.path.join(ASSET_DIR, "pack_art_guide.png"))
    export_glb(OUTPUT_PATH)
