import { Canvas, CanvasProps } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import { ReactNode } from 'react';

interface R3FCanvasProps extends CanvasProps {
  children: ReactNode;
}

export function R3FCanvas({ children, ...props }: R3FCanvasProps) {
  return (
    <Canvas
      dpr={[1, 2]}
      camera={{ position: [0, 0, 5], fov: 50 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      {...props}
    >
      <Preload all />
      {children}
    </Canvas>
  );
}