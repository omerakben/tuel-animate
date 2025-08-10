'use client';

// import { FloatingObjects } from '@tuel/components'; // Disabled due to React 19 compatibility

// Import mock components for React 19 compatibility
import Link from 'next/link';
import { useState } from 'react';
import { FloatingObjects } from '../../../components/DisabledComponents';

const shapes = ['sphere', 'box', 'torus', 'cone', 'cylinder', 'dodecahedron'] as const;
const environments = [
  'sunset',
  'dawn',
  'night',
  'warehouse',
  'forest',
  'apartment',
  'studio',
  'city',
  'park',
  'lobby',
] as const;

export default function FloatingObjectsPage() {
  const [autoRotate, setAutoRotate] = useState(true);
  const [environment, setEnvironment] = useState<(typeof environments)[number]>('sunset');
  const [distortionScale, setDistortionScale] = useState(0.3);
  const [floatSpeed, setFloatSpeed] = useState(1);
  const [selectedShapes, setSelectedShapes] = useState<(typeof shapes)[number][]>([
    'sphere',
    'torus',
    'box',
  ]);

  const toggleShape = (shape: (typeof shapes)[number]) => {
    setSelectedShapes((prev) =>
      prev.includes(shape) ? prev.filter((s) => s !== shape) : [...prev, shape]
    );
  };

  const objects = selectedShapes.map((shape, i) => ({
    shape,
    color: ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'][i % 6],
    distort: distortionScale,
    position: [(i - selectedShapes.length / 2) * 3, Math.sin(i) * 2, Math.cos(i) * 2] as [
      number,
      number,
      number,
    ],
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900">
      <div className="container mx-auto px-6 py-12">
        <Link
          href="/"
          className="inline-flex items-center text-white mb-8 hover:text-purple-300 transition-colors"
        >
          ← Back to Home
        </Link>

        <header className="mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">3D Floating Objects</h1>
          <p className="text-xl text-gray-300">
            Interactive 3D shapes with distortion effects and environment mapping
          </p>
        </header>

        {/* Controls */}
        <section className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">3D Scene Controls</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-white mb-2">Environment</label>
              <select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value as typeof environment)}
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30"
              >
                {environments.map((env) => (
                  <option key={env} value={env}>
                    {env.charAt(0).toUpperCase() + env.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white mb-2">
                Distortion: {distortionScale.toFixed(2)}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={distortionScale}
                onChange={(e) => setDistortionScale(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-white mb-2">Float Speed: {floatSpeed.toFixed(1)}</label>
              <input
                type="range"
                min="0"
                max="3"
                step="0.1"
                value={floatSpeed}
                onChange={(e) => setFloatSpeed(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="lg:col-span-3">
              <label className="flex items-center text-white mb-4">
                <input
                  type="checkbox"
                  checked={autoRotate}
                  onChange={(e) => setAutoRotate(e.target.checked)}
                  className="mr-2"
                />
                Auto Rotate Scene
              </label>

              <div>
                <label className="block text-white mb-2">Select Shapes</label>
                <div className="flex flex-wrap gap-2">
                  {shapes.map((shape) => (
                    <button
                      key={shape}
                      onClick={() => toggleShape(shape)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        selectedShapes.includes(shape)
                          ? 'bg-purple-600 text-white'
                          : 'bg-white/20 text-white/60 hover:bg-white/30'
                      }`}
                    >
                      {shape}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main 3D Scene */}
        <section className="mb-12">
          <div className="bg-black/50 rounded-2xl overflow-hidden border border-white/20">
            <div className="h-[600px]">
              <FloatingObjects
                objects={objects}
                autoRotate={autoRotate}
                autoRotateSpeed={0.5}
                environment={environment}
                floatSpeed={floatSpeed}
                cameraPosition={[0, 0, 10]}
              />
            </div>
            <div className="p-6 bg-white/5">
              <p className="text-gray-300">
                🖱️ Drag to rotate • 📜 Scroll to zoom • 🎮 Use controls above to customize
              </p>
            </div>
          </div>
        </section>

        {/* Multiple Scenes */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8">Environment Presets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { env: 'sunset', title: 'Sunset Vibes', colors: ['#ff6b6b', '#4ecdc4'] },
              { env: 'night', title: 'Night Mode', colors: ['#667eea', '#764ba2'] },
              { env: 'forest', title: 'Forest Scene', colors: ['#38b2ac', '#68d391'] },
              { env: 'city', title: 'Urban Setting', colors: ['#f6ad55', '#ed8936'] },
            ].map((preset) => (
              <div
                key={preset.env}
                className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden"
              >
                <div className="h-[400px]">
                  <FloatingObjects
                    objects={[
                      { shape: 'sphere', color: preset.colors[0], distort: 0.4 },
                      { shape: 'torus', color: preset.colors[1], distort: 0.3 },
                    ]}
                    autoRotate={true}
                    environment={preset.env as (typeof environments)[number]}
                    floatSpeed={1.5}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{preset.title}</h3>
                  <p className="text-gray-300">Environment: {preset.env}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Demo */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-8">Material Properties</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              { distort: 0, title: 'No Distortion', desc: 'Clean geometric shapes' },
              { distort: 0.5, title: 'Medium Distortion', desc: 'Organic wobble effect' },
              { distort: 1, title: 'Max Distortion', desc: 'Fluid-like behavior' },
            ].map((demo) => (
              <div
                key={demo.distort}
                className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden"
              >
                <div className="h-[300px]">
                  <FloatingObjects
                    objects={[
                      {
                        shape: 'sphere',
                        color: '#8b5cf6',
                        distort: demo.distort,
                        position: [0, 0, 0],
                      },
                    ]}
                    autoRotate={true}
                    environment="studio"
                    floatSpeed={0.5}
                    cameraPosition={[0, 0, 5]}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{demo.title}</h3>
                  <p className="text-gray-300">{demo.desc}</p>
                  <p className="text-purple-400 mt-2">Distortion: {demo.distort}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Performance Notes */}
        <section className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Performance & Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-purple-300 mb-3">Features</h3>
              <ul className="space-y-2 text-gray-300">
                <li>✓ WebGL-powered 3D rendering</li>
                <li>✓ Real-time mesh distortion</li>
                <li>✓ HDR environment mapping</li>
                <li>✓ Automatic floating animation</li>
                <li>✓ Interactive orbit controls</li>
                <li>✓ SSR-safe implementation</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-purple-300 mb-3">Optimization</h3>
              <ul className="space-y-2 text-gray-300">
                <li>✓ Instanced rendering for multiple objects</li>
                <li>✓ Automatic LOD (Level of Detail)</li>
                <li>✓ Efficient shader compilation</li>
                <li>✓ 60 FPS on modern devices</li>
                <li>✓ Mobile-optimized settings</li>
                <li>✓ Lazy loading with suspense</li>
              </ul>
            </div>
          </div>
        </section>

        <div className="h-32" />
      </div>
    </div>
  );
}
