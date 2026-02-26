import { useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { useMask, useTexture } from '@react-three/drei';
import { PlaneGeometry } from 'three';
import CircleGridMask from './CircleGridMask';
import SlideTitle from './SlideTitle';

interface SlideData {
  image: string;
  label: string;
  index: number;
}

interface SlideProps {
  slide: SlideData;
  maskId: number;
  revealProgress: number;
  zPos: number;
}

function CoverPlaneSize(viewport: { width: number; height: number }, imgW: number, imgH: number) {
  const scale = Math.max(viewport.width / imgW, viewport.height / imgH);
  return [imgW * scale, imgH * scale] as const;
}

function StencilledPanel({ maskId, image, zPos }: { maskId: number; image: string; zPos: number }) {
  const stencil = useMask(maskId);
  const texture = useTexture(image);
  const { viewport } = useThree((state) => state);
  const img = texture.image as HTMLImageElement;
  const imgW = img?.naturalWidth || img?.width || viewport.width;
  const imgH = img?.naturalHeight || img?.height || viewport.height;
  const [w, h] = useMemo(
    () => CoverPlaneSize(viewport, imgW, imgH),
    [viewport.width, viewport.height, imgW, imgH]
  );
  const geometry = useMemo(() => new PlaneGeometry(w, h), [w, h]);
  return (
    <mesh geometry={geometry} position={[0, 0, zPos]}>
      <meshBasicMaterial map={texture} {...stencil} />
    </mesh>
  );
}

export default function Slide({ slide, maskId, revealProgress, zPos }: SlideProps) {
  return (
    <group>
      <CircleGridMask progress={revealProgress} maskId={maskId} maskZ={zPos + 0.2} />
      <StencilledPanel maskId={maskId} image={slide.image} zPos={zPos} />
      <SlideTitle maskId={maskId} label={slide.label} index={slide.index} zPos={zPos} />
    </group>
  );
}
