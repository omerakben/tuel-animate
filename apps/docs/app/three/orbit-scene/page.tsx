'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function ThreeOrbitScenePage() {
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([0, 0, 5]);
  const [enableZoom, setEnableZoom] = useState(true);
  const [enablePan, setEnablePan] = useState(true);
  const [enableRotate, setEnableRotate] = useState(true);
  const [autoRotate, setAutoRotate] = useState(false);
  const [autoRotateSpeed, setAutoRotateSpeed] = useState(1);
  const [environment, setEnvironment] = useState<
    | 'sunset'
    | 'dawn'
    | 'night'
    | 'warehouse'
    | 'forest'
    | 'apartment'
    | 'studio'
    | 'city'
    | 'park'
    | 'lobby'
  >('studio');
  const [sceneType, setSceneType] = useState<'basic' | 'multiple' | 'interactive'>('basic');
  const [shadows, setShadows] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8">
          ← Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">3D Orbit Scene</h1>
          <p className="text-gray-300 text-lg">
            Basic Three.js scene with orbit controls, environment lighting, and interactive 3D
            objects.
          </p>
        </div>

        {/* Controls */}
        <div className="mb-12 p-6 bg-gray-800 rounded-lg">
          <h2 className="text-2xl font-semibold mb-6">Scene Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Scene Type</label>
              <select
                value={sceneType}
                onChange={(e) => setSceneType(e.target.value as any)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
              >
                <option value="basic">Basic Cube</option>
                <option value="multiple">Multiple Objects</option>
                <option value="interactive">Interactive Scene</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Environment</label>
              <select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value as any)}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
              >
                <option value="studio">Studio</option>
                <option value="sunset">Sunset</option>
                <option value="dawn">Dawn</option>
                <option value="night">Night</option>
                <option value="warehouse">Warehouse</option>
                <option value="forest">Forest</option>
                <option value="apartment">Apartment</option>
                <option value="city">City</option>
                <option value="park">Park</option>
                <option value="lobby">Lobby</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Auto Rotate Speed: {autoRotateSpeed}
              </label>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={autoRotateSpeed}
                onChange={(e) => setAutoRotateSpeed(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={enableZoom}
                  onChange={(e) => setEnableZoom(e.target.checked)}
                  className="mr-2"
                />
                Enable Zoom
              </label>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={enablePan}
                  onChange={(e) => setEnablePan(e.target.checked)}
                  className="mr-2"
                />
                Enable Pan
              </label>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={enableRotate}
                  onChange={(e) => setEnableRotate(e.target.checked)}
                  className="mr-2"
                />
                Enable Rotate
              </label>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={autoRotate}
                  onChange={(e) => setAutoRotate(e.target.checked)}
                  className="mr-2"
                />
                Auto Rotate
              </label>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={shadows}
                  onChange={(e) => setShadows(e.target.checked)}
                  className="mr-2"
                />
                Enable Shadows
              </label>
            </div>
          </div>
        </div>

        {/* 3D Scene Container */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">3D Scene Demo</h2>
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            <div className="h-96 bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center relative">
              {/* Fallback for when Three.js is not available */}
              <div className="text-center">
                <div className="text-6xl mb-4">🎮</div>
                <h3 className="text-xl font-semibold mb-2">3D Scene Preview</h3>
                <p className="text-gray-300 text-sm max-w-md">
                  Interactive 3D scene with orbit controls. In a real implementation, this would
                  render a Three.js scene with:
                </p>
                <div className="mt-4 text-left inline-block">
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• Orbit controls for camera movement</li>
                    <li>• Environment lighting ({environment})</li>
                    <li>
                      •{' '}
                      {sceneType === 'basic'
                        ? 'Single rotating cube'
                        : sceneType === 'multiple'
                          ? 'Multiple 3D objects'
                          : 'Interactive 3D elements'}
                    </li>
                    <li>• {shadows ? 'Dynamic shadows enabled' : 'Shadows disabled'}</li>
                    <li>
                      •{' '}
                      {autoRotate
                        ? `Auto-rotation at ${autoRotateSpeed}x speed`
                        : 'Manual camera control'}
                    </li>
                  </ul>
                </div>
              </div>

              {/* Controls overlay */}
              <div className="absolute bottom-4 left-4 bg-black/50 rounded p-3 text-xs">
                <p>🖱️ Click & drag to rotate</p>
                <p>🔍 Scroll to zoom</p>
                <p>⌨️ Right-click & drag to pan</p>
              </div>

              {/* Scene info overlay */}
              <div className="absolute top-4 right-4 bg-black/50 rounded p-3 text-xs">
                <p>Environment: {environment}</p>
                <p>Scene: {sceneType}</p>
                <p>Auto-rotate: {autoRotate ? 'ON' : 'OFF'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Implementation Code */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Implementation</h2>
          <div className="bg-gray-900 p-6 rounded-lg overflow-x-auto">
            <pre className="text-sm text-gray-300">
              {`import { ThreeOrbitScene } from '@tuel/components';
import { Box, Sphere, Torus } from '@react-three/drei';

export default function My3DScene() {
  return (
    <ThreeOrbitScene
      cameraPosition={[${cameraPosition.join(', ')}]}
      enableZoom={${enableZoom}}
      enablePan={${enablePan}}
      enableRotate={${enableRotate}}
      autoRotate={${autoRotate}}
      autoRotateSpeed={${autoRotateSpeed}}
      environment="${environment}"
      shadows={${shadows}}
      className="h-96 w-full"
    >
      {/* Basic cube example */}
      <Box args={[1, 1, 1]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#6366f1" />
      </Box>

      {/* Additional objects for multiple scene */}
      {sceneType === 'multiple' && (
        <>
          <Sphere args={[0.5]} position={[-2, 0, 0]}>
            <meshStandardMaterial color="#10b981" />
          </Sphere>

          <Torus args={[0.6, 0.2]} position={[2, 0, 0]}>
            <meshStandardMaterial color="#f59e0b" />
          </Torus>
        </>
      )}
    </ThreeOrbitScene>
  );
}`}
            </pre>
          </div>
        </div>

        {/* Props Documentation */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Props & Configuration</h2>
          <div className="overflow-x-auto">
            <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left">Prop</th>
                  <th className="px-6 py-3 text-left">Type</th>
                  <th className="px-6 py-3 text-left">Default</th>
                  <th className="px-6 py-3 text-left">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                <tr>
                  <td className="px-6 py-3 font-mono text-sm">children</td>
                  <td className="px-6 py-3 text-sm">ReactNode</td>
                  <td className="px-6 py-3 text-sm">required</td>
                  <td className="px-6 py-3 text-sm">3D objects to render in scene</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 font-mono text-sm">cameraPosition</td>
                  <td className="px-6 py-3 text-sm">[number, number, number]</td>
                  <td className="px-6 py-3 text-sm">[0, 0, 5]</td>
                  <td className="px-6 py-3 text-sm">Initial camera position [x, y, z]</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 font-mono text-sm">enableZoom</td>
                  <td className="px-6 py-3 text-sm">boolean</td>
                  <td className="px-6 py-3 text-sm">true</td>
                  <td className="px-6 py-3 text-sm">Allow camera zoom with mouse wheel</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 font-mono text-sm">enablePan</td>
                  <td className="px-6 py-3 text-sm">boolean</td>
                  <td className="px-6 py-3 text-sm">true</td>
                  <td className="px-6 py-3 text-sm">Allow camera panning with right-click</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 font-mono text-sm">enableRotate</td>
                  <td className="px-6 py-3 text-sm">boolean</td>
                  <td className="px-6 py-3 text-sm">true</td>
                  <td className="px-6 py-3 text-sm">Allow camera rotation with left-click</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 font-mono text-sm">autoRotate</td>
                  <td className="px-6 py-3 text-sm">boolean</td>
                  <td className="px-6 py-3 text-sm">false</td>
                  <td className="px-6 py-3 text-sm">Automatically rotate camera around scene</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 font-mono text-sm">autoRotateSpeed</td>
                  <td className="px-6 py-3 text-sm">number</td>
                  <td className="px-6 py-3 text-sm">1</td>
                  <td className="px-6 py-3 text-sm">Speed of auto-rotation</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 font-mono text-sm">environment</td>
                  <td className="px-6 py-3 text-sm">string</td>
                  <td className="px-6 py-3 text-sm">'studio'</td>
                  <td className="px-6 py-3 text-sm">Environment lighting preset</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 font-mono text-sm">shadows</td>
                  <td className="px-6 py-3 text-sm">boolean</td>
                  <td className="px-6 py-3 text-sm">false</td>
                  <td className="px-6 py-3 text-sm">Enable shadow rendering</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 font-mono text-sm">onLoad</td>
                  <td className="px-6 py-3 text-sm">() =&gt; void</td>
                  <td className="px-6 py-3 text-sm">undefined</td>
                  <td className="px-6 py-3 text-sm">Callback when scene is loaded</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Environment Presets */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Environment Presets</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { name: 'studio', desc: 'Clean studio lighting', color: 'bg-gray-600' },
              { name: 'sunset', desc: 'Warm sunset ambiance', color: 'bg-orange-600' },
              { name: 'dawn', desc: 'Cool morning light', color: 'bg-blue-600' },
              { name: 'night', desc: 'Dark night scene', color: 'bg-indigo-900' },
              { name: 'warehouse', desc: 'Industrial warehouse', color: 'bg-gray-700' },
              { name: 'forest', desc: 'Natural forest setting', color: 'bg-green-700' },
              { name: 'apartment', desc: 'Indoor apartment', color: 'bg-yellow-700' },
              { name: 'city', desc: 'Urban cityscape', color: 'bg-cyan-700' },
              { name: 'park', desc: 'Outdoor park', color: 'bg-emerald-600' },
              { name: 'lobby', desc: 'Modern hotel lobby', color: 'bg-purple-700' },
            ].map((env) => (
              <button
                key={env.name}
                onClick={() => setEnvironment(env.name as any)}
                className={`p-4 rounded-lg text-left transition-all ${
                  environment === env.name ? 'ring-2 ring-blue-400' : ''
                } ${env.color} hover:opacity-80`}
              >
                <div className="text-sm font-medium capitalize">{env.name}</div>
                <div className="text-xs opacity-75 mt-1">{env.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">🔄 Orbit Controls</h3>
              <p className="text-gray-300 text-sm">
                Full camera control with mouse and touch support for rotating, zooming, and panning.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">🌅 Environment Lighting</h3>
              <p className="text-gray-300 text-sm">
                10+ preset environments for realistic lighting and reflections.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">🛡️ SSR Safe</h3>
              <p className="text-gray-300 text-sm">
                Client-side only rendering that works perfectly with Next.js SSR.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">⚡ Performance</h3>
              <p className="text-gray-300 text-sm">
                Optimized rendering with automatic performance adjustments and frame rate limiting.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">🎨 Customizable</h3>
              <p className="text-gray-300 text-sm">
                Full control over camera settings, lighting, shadows, and interaction modes.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">📱 Touch Friendly</h3>
              <p className="text-gray-300 text-sm">
                Native touch and gesture support for mobile and tablet devices.
              </p>
            </div>
          </div>
        </div>

        {/* Use Cases */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Use Cases</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Product Showcases</h3>
              <p className="text-gray-300 text-sm mb-4">
                Display 3D product models with interactive viewing and lighting.
              </p>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• E-commerce product views</li>
                <li>• Automotive configurators</li>
                <li>• Furniture placement tools</li>
                <li>• Jewelry displays</li>
              </ul>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Portfolio & Art</h3>
              <p className="text-gray-300 text-sm mb-4">
                Showcase 3D artwork, architectural models, and creative projects.
              </p>
              <ul className="text-gray-400 text-sm space-y-1">
                <li>• Architectural visualizations</li>
                <li>• 3D art galleries</li>
                <li>• Game asset previews</li>
                <li>• Educational models</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
