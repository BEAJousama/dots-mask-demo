import { Mask } from '@react-three/drei';

interface MaskDotProps {
  radius: number;
  position: [number, number, number];
  maskId: number;
}

export default function MaskDot({ radius, position, maskId }: MaskDotProps) {
  if (radius <= 0.001) return null;
  return (
    <Mask id={maskId} position={position}>
      <circleGeometry args={[radius, 64]} />
      <meshBasicMaterial />
    </Mask>
  );
}
