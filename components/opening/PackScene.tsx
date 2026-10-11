'use client';

import {
  RefObject,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { invalidate, useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import {
  AnimationMixer,
  LoopOnce,
  MeshStandardMaterial,
  Object3D,
  PerspectiveCamera,
  PMREMGenerator,
  SRGBColorSpace,
  Texture,
  TextureLoader,
  Vector3,
} from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { IMAGE_PATHS } from '@/lib/paths';
import type { DrawnMaterial } from '@/utils/shared/material';

/** Blender 카메라의 종횡비. 이보다 좁은 화면에서는 가로 화각을 이 기준으로 고정합니다 */
const BLENDER_ASPECT = 0.75;

/**
 * Blender area light를 대신하는 방향광
 * @description glTF가 area light를 내보내지 못해 위치 노드만 남습니다.
 * 세기는 Blender 와트 비율(420 : 300 : 200 : 95)을 유지한 채 눈으로 맞췄습니다.
 */
const LIGHTS = [
  { node: 'KeyLight', intensity: 2.4 },
  { node: 'RimLeft', intensity: 1.7 },
  { node: 'RimRight', intensity: 1.15 },
  { node: 'FillBounce', intensity: 0.55 },
] as const;

const ENVIRONMENT_INTENSITY = 0.35;

export interface IPackScene {
  material: DrawnMaterial;
  progressRef: RefObject<number>;
}

export default function PackScene({ material, progressRef }: IPackScene) {
  const { scene, nodes, materials, animations } = useGLTF(IMAGE_PATHS.PACK_GLB);

  /* effect 의존성이라 참조가 유지되어야 합니다 */
  const mixer = useMemo(() => new AnimationMixer(scene), [scene]);

  useEffect(() => {
    animations.forEach(clip => {
      const action = mixer.clipAction(clip);
      action.setLoop(LoopOnce, 1);
      action.clampWhenFinished = true;
      action.play();
    });
    invalidate();

    return () => {
      mixer.stopAllAction();
    };
  }, [mixer, animations]);

  /* 스크롤 진행도로 프레임을 직접 지정합니다. 이징은 Blender 키프레임 구간 배분에 이미 들어 있어 1:1 선형입니다 */
  useFrame(() => {
    animations.forEach(
      clip =>
        (mixer.clipAction(clip).time = progressRef.current * clip.duration),
    );
    mixer.update(0);
  });

  usePackCamera(nodes.PackCamera as PerspectiveCamera);
  useRoomEnvironment();
  useCardFace(materials.CardPlaceholder as MeshStandardMaterial, material);

  return (
    <>
      <primitive object={scene} />
      {LIGHTS.map(({ node, intensity }) => (
        <directionalLight
          key={node}
          position={(nodes[node] as Object3D).getWorldPosition(new Vector3())}
          intensity={intensity}
        />
      ))}
    </>
  );
}

/** GLB의 PackCamera를 기본 카메라로 쓰고, 좁은 화면에서는 세로 화각을 넓혀 가로 구도를 지킵니다 */
function usePackCamera(camera: PerspectiveCamera) {
  const set = useThree(state => state.set);
  const aspect = useThree(state => state.size.width / state.size.height);

  /* fov를 직접 바꾸므로 Blender 원래 값을 처음 한 번만 보관합니다 */
  camera.userData.baseFov ??= camera.fov;
  const baseFov: number = camera.userData.baseFov;

  useLayoutEffect(() => set({ camera }), [set, camera]);

  useLayoutEffect(() => {
    const halfHorizontal = Math.atan(
      Math.tan((baseFov * Math.PI) / 360) * BLENDER_ASPECT,
    );
    camera.fov =
      aspect < BLENDER_ASPECT
        ? (Math.atan(Math.tan(halfHorizontal) / aspect) * 360) / Math.PI
        : baseFov;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, aspect, baseFov]);
}

/** 반사용 환경광. drei Environment 프리셋은 외부 CDN에서 HDR을 받으므로 RoomEnvironment를 굽습니다 */
function useRoomEnvironment() {
  const gl = useThree(state => state.gl);
  const scene = useThree(state => state.scene);

  useEffect(() => {
    const pmrem = new PMREMGenerator(gl);
    const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = environment;
    scene.environmentIntensity = ENVIRONMENT_INTENSITY;
    invalidate();

    return () => {
      scene.environment = null;
      environment.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
}

/**
 * 카드 앞면을 서버가 뽑은 재질로 교체합니다
 * @description 로드 전에는 GLB 기본 면(미개봉 면)이 보이므로 특정 재질이 먼저 보이지 않습니다.
 * useGLTF가 씬을 캐시하므로 언마운트 시 원래 면으로 되돌려야 다음 개봉에 이전 재질이 남지 않습니다.
 */
function useCardFace(
  placeholder: MeshStandardMaterial,
  material: DrawnMaterial,
) {
  const [error, setError] = useState<Error | null>(null);
  if (error) throw error;

  useEffect(() => {
    const original = placeholder.map;
    const originalToneMapped = placeholder.toneMapped;
    let face: Texture | null = null;
    let cancelled = false;

    new TextureLoader().load(
      IMAGE_PATHS.CARD_ART(material),
      texture => {
        if (cancelled) return texture.dispose();
        texture.flipY = false;
        texture.colorSpace = SRGBColorSpace;
        face = texture;
        placeholder.map = texture;
        /* 톤매핑을 거치면 채도가 빠져 CSS 재질 색과 어긋납니다. 조명 음영은 그대로 받습니다 */
        placeholder.toneMapped = false;
        placeholder.needsUpdate = true;
        invalidate();
      },
      undefined,
      () => {
        if (cancelled) return;
        setError(new Error(`card face load failed: ${material}`));
      },
    );

    return () => {
      cancelled = true;
      placeholder.map = original;
      placeholder.toneMapped = originalToneMapped;
      placeholder.needsUpdate = true;
      face?.dispose();
    };
  }, [placeholder, material]);
}

useGLTF.preload(IMAGE_PATHS.PACK_GLB);
