import { ReactNode } from 'react';
import { OrbitControls } from '@react-three/drei';

interface SceneWrapperProps {
  children: ReactNode;
  orbitControls?: boolean;
  lights?: boolean;
}

export function SceneWrapper({ 
  children, 
  orbitControls = true,
  lights = true 
}: SceneWrapperProps) {
  return (
    <>
      {lights && (
        <>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
        </>
      )}
      {orbitControls && <OrbitControls makeDefault />}
      {children}
    </>
  );
}