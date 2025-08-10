import { DisabledComponentPlaceholder } from '../components/DisabledComponentPlaceholder';

// Mock AnimatedText component
export function AnimatedText(props: any) {
  return (
    <DisabledComponentPlaceholder
      componentName="AnimatedText"
      reason="Three.js React 19 compatibility - will be re-enabled when @react-three/fiber updates"
    >
      {JSON.stringify(props, null, 2)}
    </DisabledComponentPlaceholder>
  );
}

// Mock NoiseField component
export function NoiseField(props: any) {
  return (
    <DisabledComponentPlaceholder
      componentName="NoiseField"
      reason="Three.js React 19 compatibility - will be re-enabled when @react-three/fiber updates"
    >
      {JSON.stringify(props, null, 2)}
    </DisabledComponentPlaceholder>
  );
}

// Mock FloatingObjects component
export function FloatingObjects(props: any) {
  return (
    <DisabledComponentPlaceholder
      componentName="FloatingObjects"
      reason="Three.js React 19 compatibility - will be re-enabled when @react-three/fiber updates"
    >
      {JSON.stringify(props, null, 2)}
    </DisabledComponentPlaceholder>
  );
}

// Mock ParticleWave component
export function ParticleWave(props: any) {
  return (
    <DisabledComponentPlaceholder
      componentName="ParticleWave"
      reason="Three.js React 19 compatibility - will be re-enabled when @react-three/fiber updates"
    >
      {JSON.stringify(props, null, 2)}
    </DisabledComponentPlaceholder>
  );
}

// Mock MorphingShapes component
export function MorphingShapes(props: any) {
  return (
    <DisabledComponentPlaceholder
      componentName="MorphingShapes"
      reason="Three.js React 19 compatibility - will be re-enabled when @react-three/fiber updates"
    >
      {JSON.stringify(props, null, 2)}
    </DisabledComponentPlaceholder>
  );
}
