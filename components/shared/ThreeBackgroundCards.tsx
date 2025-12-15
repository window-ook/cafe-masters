'use client';

import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, Stars, useTexture, Decal } from '@react-three/drei';
import { IMAGE_PATHS } from '@/lib/paths';
import * as THREE from 'three';

interface CardProps {
  position?: [number, number, number];
  scale?: number;
  rotationSpeed?: number;
}

function AnimatedCard({ position = [0, 0, 0], scale = 1, rotationSpeed = 0.2 }: CardProps) {
  const groupRef = useRef<THREE.Group>(null);
  const texture = useTexture(IMAGE_PATHS.COFFEE_ICON);

  useFrame((state) => {
    if (groupRef.current) {
      const time = state.clock.getElapsedTime();
      // 부드러운 회전 - 카드가 회전하는 효과
      groupRef.current.rotation.x = Math.sin(time * 0.3) * 0.2;
      groupRef.current.rotation.y = time * rotationSpeed;
      groupRef.current.rotation.z = Math.sin(time * 0.2) * 0.1;

      // 마우스 위치에 따른 미묘한 움직임 (중앙 카드만)
      if (scale === 1) {
        const x = state.pointer.x * 0.5;
        const y = state.pointer.y * 0.5;
        groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, x + position[0], 0.1);
        groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, y + position[1], 0.1);
      }
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* 메인 카드 - 전면만 렌더링 */}
      <RoundedBox args={[2.5, 3.5, 0.1]} radius={0.1} smoothness={4}>
        <meshStandardMaterial
          color="#da483b"
          roughness={0.3}
          metalness={0.7}
          side={THREE.FrontSide}
        />
        {/* 커피 컵 아이콘 decal */}
        <Decal
          position={[0, 0, 0.051]}
          rotation={[0, 0, 0]}
          scale={[1.5, 1.5, 1.5]}
        >
          <meshStandardMaterial
            map={texture}
            transparent
            polygonOffset
            polygonOffsetFactor={-1}
            color="#ffffff"
          />
        </Decal>
      </RoundedBox>

      {/* 카드 테두리 강조 - 전면만 */}
      <RoundedBox args={[2.6, 3.6, 0.08]} radius={0.12} smoothness={4}>
        <meshStandardMaterial
          color="#f5a623"
          roughness={0.1}
          metalness={0.9}
          transparent
          opacity={0.6}
          side={THREE.FrontSide}
        />
      </RoundedBox>
    </group>
  );
}

function BackgroundContent() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
      <pointLight position={[-10, -10, -5]} intensity={1} color="#da483b" />
      <spotLight position={[0, 5, 5]} intensity={0.8} angle={0.6} penumbra={0.5} color="#ffd700" />

      {/* 중앙 메인 카드 */}
      <AnimatedCard position={[0, 0, 0]} scale={1} rotationSpeed={0.2} />

      {/* 좌측 상단 카드 - 작은 크기 */}
      <AnimatedCard position={[-4, 3, -2]} scale={0.6} rotationSpeed={0.15} />

      {/* 우측 상단 카드 - 중간 크기 */}
      <AnimatedCard position={[4.5, 3.5, -1]} scale={0.75} rotationSpeed={0.25} />

      {/* 우측 하단 카드 - 작은 크기 */}
      <AnimatedCard position={[5, -3, -3]} scale={0.5} rotationSpeed={0.18} />

      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
    </>
  );
}

export default function ThreeBackgroundCards() {
  return (
    <div className="fixed inset-0 -z-10 bg-dark-bg">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <Suspense fallback={null}>
          <BackgroundContent />
        </Suspense>
      </Canvas>
      {/* 배경 오버레이 - 콘텐츠 가독성을 위해 */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]" />
    </div>
  );
}
