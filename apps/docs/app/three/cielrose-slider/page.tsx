'use client';

import { CielroseSlider } from '@tuel/components';

const slides = [
  {
    title: 'Chromatic Loopscape',
    url: 'https://example.com/alpha',
    image: '/img1.jpg',
  },
  {
    title: 'Solar Bloom',
    url: 'https://example.com/beta',
    image: '/img2.jpg',
  },
  {
    title: 'Neon Handscape',
    url: 'https://example.com/gamma',
    image: '/img3.jpg',
  },
  {
    title: 'Echo Discs',
    url: 'https://example.com/delta',
    image: '/img4.jpg',
  },
  {
    title: 'Void Gaze',
    url: 'https://example.com/epsilon',
    image: '/img5.jpg',
  },
  {
    title: 'Gravity Sync',
    url: 'https://example.com/zeta',
    image: '/img6.jpg',
  },
  {
    title: 'Heat Core',
    url: 'https://example.com/eta',
    image: '/img7.jpg',
  },
];

export default function CielrosePage() {
  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Cielrose Three.js Slider</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            A sophisticated Three.js shader-based slider with custom vertex and fragment shaders for
            texture distortion and smooth transitions. Features scroll-driven navigation and dynamic
            distortion effects.
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {/* Main Demo */}
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-2">Interactive Shader Slider</h2>
              <p className="text-gray-400 text-sm">
                Scroll to navigate • Custom shader distortion effects
              </p>
            </div>
            <div className="h-[600px]">
              <CielroseSlider slides={slides} autoRotate={false} className="w-full h-full" />
            </div>
          </div>

          {/* Auto-rotation Demo */}
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-2">Auto-rotating Slider</h2>
              <p className="text-gray-400 text-sm">Automatic progression • 4-second intervals</p>
            </div>
            <div className="h-[400px]">
              <CielroseSlider slides={slides} autoRotate={true} className="w-full h-full" />
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-900 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">Custom Shaders</h3>
            <p className="text-gray-400 text-sm">
              Advanced vertex and fragment shaders with distortion effects and smooth texture
              transitions.
            </p>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">Scroll Navigation</h3>
            <p className="text-gray-400 text-sm">
              Intuitive scroll-based navigation with dynamic intensity affecting visual distortion.
            </p>
          </div>

          <div className="bg-gray-900 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-white mb-3">GSAP Animations</h3>
            <p className="text-gray-400 text-sm">
              Smooth transitions powered by GSAP with easing and title animations.
            </p>
          </div>
        </div>

        {/* Technical Details */}
        <div className="mt-12 bg-gray-900 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Technical Implementation</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="text-white font-medium mb-2">Shader Features:</h4>
              <ul className="text-gray-400 space-y-1">
                <li>• Custom vertex shader with distortion calculations</li>
                <li>• Fragment shader for texture blending</li>
                <li>• Scroll-intensity based visual effects</li>
                <li>• UV coordinate manipulation for transitions</li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-2">React Integration:</h4>
              <ul className="text-gray-400 space-y-1">
                <li>• React Three Fiber canvas management</li>
                <li>• TypeScript type safety</li>
                <li>• GSAP animation integration</li>
                <li>• Responsive design system</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
