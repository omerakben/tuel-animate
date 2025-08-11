'use client';

import { InteractiveParticleLogo } from '@tuel/three';

export default function InteractiveParticleLogoDemo() {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      <InteractiveParticleLogo
        logoPath="/logo.png"
        logoSize={1000}
        logoColor="#ffffff"
        canvasBg="#0a0a0a"
        distortionRadius={2000}
        forceStrength={0.004}
        maxDisplacement={120}
        returnForce={0.03}
      />

      <div className="relative z-10 p-8">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Interactive Particle Logo Demo</h1>
          <p className="text-lg mb-8">
            Move your mouse to interact with the particles • WebGL particle system
          </p>
          <div className="text-sm opacity-75">
            <p>Hover over the logo to see particles react to your mouse movement</p>
          </div>
        </div>
      </div>
    </div>
  );
}
