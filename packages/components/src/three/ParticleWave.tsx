import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { cn } from '@tuel/utils';

const vertexShader = `
  uniform float uTime;
  uniform float uWaveAmplitude;
  uniform float uWaveFrequency;
  uniform float uWaveSpeed;
  attribute float aRandom;
  varying vec3 vPosition;
  varying float vDistance;
  
  void main() {
    vPosition = position;
    vec3 pos = position;
    
    // Create wave effect
    float wave = sin(pos.x * uWaveFrequency + uTime * uWaveSpeed) * uWaveAmplitude;
    wave += sin(pos.z * uWaveFrequency * 0.8 + uTime * uWaveSpeed * 0.7) * uWaveAmplitude * 0.5;
    pos.y += wave;
    
    // Add some randomness
    pos.y += sin(uTime * 2.0 + aRandom * 10.0) * 0.1;
    
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    vDistance = -mvPosition.z;
    
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = (30.0 / vDistance) * (1.0 + aRandom);
  }
`;

const fragmentShader = `
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform float uTime;
  varying vec3 vPosition;
  varying float vDistance;
  
  void main() {
    // Create circular particles
    vec2 center = gl_PointCoord - 0.5;
    float dist = length(center);
    if (dist > 0.5) discard;
    
    // Color gradient based on position and time
    float mixFactor = (vPosition.y + 2.0) / 4.0 + sin(uTime * 0.5) * 0.2;
    vec3 color = mix(uColor1, uColor2, mixFactor);
    
    // Fade based on distance
    float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
    alpha *= 1.0 - smoothstep(10.0, 20.0, vDistance);
    
    gl_FragColor = vec4(color, alpha);
  }
`;

interface WaveParticlesProps {
  count?: number;
  size?: number;
  color1?: string;
  color2?: string;
  waveAmplitude?: number;
  waveFrequency?: number;
  waveSpeed?: number;
  spread?: number;
}

function WaveParticles({
  count = 10000,
  size = 4,
  color1 = '#8b5cf6',
  color2 = '#3b82f6',
  waveAmplitude = 1,
  waveFrequency = 0.2,
  waveSpeed = 1,
  spread = 10,
}: WaveParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null);

  // Generate particle positions and random values
  const { positions, randoms } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * spread;
      positions[i3 + 1] = (Math.random() - 0.5) * spread * 0.5;
      positions[i3 + 2] = (Math.random() - 0.5) * spread;
      randoms[i] = Math.random();
    }

    return { positions, randoms };
  }, [count, spread]);

  // Create uniforms
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor1: { value: new THREE.Color(color1) },
      uColor2: { value: new THREE.Color(color2) },
      uWaveAmplitude: { value: waveAmplitude },
      uWaveFrequency: { value: waveFrequency },
      uWaveSpeed: { value: waveSpeed },
    }),
    [color1, color2, waveAmplitude, waveFrequency, waveSpeed]
  );

  // Animation
  useFrame((state) => {
    if (pointsRef.current) {
      uniforms.uTime.value = state.clock.elapsedTime;
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute attach="attributes-aRandom" count={count} array={randoms} itemSize={1} />
      </bufferGeometry>
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export interface ParticleWaveProps {
  className?: string;
  particleCount?: number;
  particleSize?: number;
  color1?: string;
  color2?: string;
  waveAmplitude?: number;
  waveFrequency?: number;
  waveSpeed?: number;
  spread?: number;
  backgroundColor?: string;
  fog?: boolean;
  fogColor?: string;
  fogNear?: number;
  fogFar?: number;
  cameraPosition?: [number, number, number];
  autoRotate?: boolean;
}

export function ParticleWave({
  className,
  particleCount = 10000,
  particleSize = 4,
  color1 = '#8b5cf6',
  color2 = '#3b82f6',
  waveAmplitude = 1,
  waveFrequency = 0.2,
  waveSpeed = 1,
  spread = 10,
  backgroundColor = '#0f0f23',
  fog = true,
  fogColor = '#0f0f23',
  fogNear = 5,
  fogFar = 20,
  cameraPosition = [0, 0, 10],
  autoRotate = true,
}: ParticleWaveProps) {
  return (
    <div className={cn('w-full h-full', className)}>
      <Canvas
        camera={{ position: cameraPosition, fov: 75 }}
        style={{ background: backgroundColor }}
      >
        {fog && <fog attach="fog" args={[fogColor, fogNear, fogFar]} />}

        <WaveParticles
          count={particleCount}
          size={particleSize}
          color1={color1}
          color2={color2}
          waveAmplitude={waveAmplitude}
          waveFrequency={waveFrequency}
          waveSpeed={waveSpeed}
          spread={spread}
        />
      </Canvas>
    </div>
  );
}
