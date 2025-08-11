'use client';

import { AssetOrb } from '@tuel/three';

export default function AssetOrbDemo() {
  return (
    <div className="min-h-screen bg-gray-900">
      <AssetOrb
        totalImages={20}
        totalItems={80}
        sphereRadius={6}
        backgroundColor="1a1a1a"
        className="asset-orb-demo"
      />
      <div className="absolute top-4 left-4 text-white z-10">
        <h1 className="text-2xl font-bold mb-2">Asset Orb Demo</h1>
        <p className="text-sm opacity-80">
          Drag to rotate • Scroll to zoom • Interactive 3D sphere
        </p>
      </div>
    </div>
  );
}
