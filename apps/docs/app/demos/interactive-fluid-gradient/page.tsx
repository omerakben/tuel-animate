'use client';

import { InteractiveFluidGradient } from '@tuel/three';

export default function InteractiveFluidGradientDemo() {
  return (
    <div className="relative min-h-screen bg-black">
      <div className="absolute inset-0 z-0">
        <InteractiveFluidGradient
          brushSize={0.8}
          brushStrength={0.9}
          distortionAmount={0.15}
          fluidDecay={0.98}
          trailLength={12.0}
          stopDecay={0.85}
          color1="#ff6b6b"
          color2="#4ecdc4"
          color3="#45b7d1"
          color4="#f9ca24"
          colorIntensity={1.2}
          softness={0.7}
        />
      </div>

      <div className="relative z-10 p-8">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Interactive Fluid Gradient Demo</h1>
          <p className="text-lg mb-8">
            Move your mouse to create beautiful fluid effects • Interactive WebGL shader
          </p>
        </div>
      </div>
    </div>
  );
}
