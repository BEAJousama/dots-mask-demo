import { useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import dotsArray from '../data/dots';
import MaskDot from './MaskDot';

function linearMap(val: number, toA: number, toB: number) {
  return ((val - 0) * (toB - toA)) / (1 - 0) + toA;
}

function getRandomArbitrary(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min);
}

interface CircleGridMaskProps {
  progress: number;
  maskId: number;
  maskZ: number;
}

export default function CircleGridMask({ progress, maskId, maskZ }: CircleGridMaskProps) {
  const { viewport, size } = useThree((state) => state);

  const isMd = size.width >= 768;
  const cols = isMd
    ? Math.max(1, Math.round(viewport.width / 1.8)) + 1
    : Math.max(1, Math.round(viewport.height / 1.3));

  const rows = 4;
  const spacing = (isMd ? viewport.width : viewport.height) / cols;
  const dotsHeight = (rows - 1) * spacing;
  const margin = ((!isMd ? viewport.width : viewport.height) - dotsHeight) / 2;

  const anchorX = !isMd ? -viewport.width / 2 + margin : -viewport.width / 2;
  const anchorY = !isMd ? -viewport.height / 2 : -viewport.height / 2 + margin;

  // Responsive max radius based on viewport height
  const minH = 300, maxH = 1300, minW = 1.6, maxW = 7.5;
  const h = size.height;
  const maxRadius = h <= minH ? minW : h > maxH ? maxW : Math.min(Math.max(1.6 + (h - 300) / 50 * 0.3, minW), maxW);

  const randomXOffset = useMemo(
    () => getRandomArbitrary(-1, dotsArray.length - cols - 1),
    [cols]
  );

  const circles = useMemo(() => {
    const result = [];
    for (let x = 0; x < cols + 1; x++) {
      const colData = dotsArray[x + randomXOffset] ?? [1, 0, 0, 1];
      for (let y = 0; y < colData.length; y++) {
        if (!colData[y]) continue;
        const cx = (!isMd ? y : x) * spacing;
        const cy = (!isMd ? x : y) * spacing;
        result.push(
          <MaskDot
            key={`${cx}-${cy}`}
            position={[cx, cy, maskZ]}
            radius={linearMap(progress, 0, maxRadius)}
            maskId={maskId}
          />
        );
      }
    }
    return result;
  }, [progress, maskZ, maskId, randomXOffset, maxRadius, cols, spacing, isMd]);

  return (
    <group position={[anchorX, anchorY, 0]}>
      {circles}
    </group>
  );
}
