import { useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { useMask } from '@react-three/drei';
import * as THREE from 'three';

interface SlideTitleProps {
  maskId: number;
  label: string;
  index: number;
  zPos: number;
}

export default function SlideTitle({ maskId, label, index, zPos }: SlideTitleProps) {
  const stencil = useMask(maskId);
  const { viewport } = useThree((state) => state);

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 120;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = '500 52px "Arial Narrow", Arial, sans-serif';
    ctx.letterSpacing = '6px';
    // Dim index number
    ctx.globalAlpha = 0.4;
    ctx.fillText(`0${index + 1}`, 0, 76);
    ctx.globalAlpha = 1;
    ctx.fillText(`  ${label}`, 64, 76);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, [label, index]);

  // Keep aspect ratio of the canvas (1200×120 = 10:1)
  const h = viewport.height * 0.05;
  const w = h * (1200 / 120);

  return (
    <mesh
      position={[
        -viewport.width / 2 + w / 2 + viewport.width * 0.03,
        -viewport.height / 2 + h / 2 + viewport.height * 0.07,
        zPos + 0.05,
      ]}
    >
      <planeGeometry args={[w, h]} />
      <meshBasicMaterial map={texture} transparent alphaTest={0.01} {...stencil} />
    </mesh>
  );
}
