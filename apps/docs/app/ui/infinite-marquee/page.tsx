'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';

export default function InfiniteMarqueePage() {
  const [speed, setSpeed] = useState(50);
  const [direction, setDirection] = useState<'left' | 'right'>('left');
  const [isPaused, setIsPaused] = useState(false);
  const [gap, setGap] = useState(40);
  const [variant, setVariant] = useState<'text' | 'images' | 'mixed'>('text');

  const marqueeRef = useRef<HTMLDivElement>(null);

  // Sample content for different variants
  const textContent = [
    '🚀 INNOVATION',
    '⚡ PERFORMANCE',
    '🎨 DESIGN',
    '🔧 ENGINEERING',
    '💡 CREATIVITY',
    '🌟 EXCELLENCE',
    '🎯 PRECISION',
    '🔥 PASSION',
  ];

  const imageContent = [
    { id: 1, color: 'bg-gradient-to-r from-red-500 to-pink-500' },
    { id: 2, color: 'bg-gradient-to-r from-blue-500 to-purple-500' },
    { id: 3, color: 'bg-gradient-to-r from-green-500 to-teal-500' },
    { id: 4, color: 'bg-gradient-to-r from-yellow-500 to-orange-500' },
    { id: 5, color: 'bg-gradient-to-r from-purple-500 to-indigo-500' },
    { id: 6, color: 'bg-gradient-to-r from-pink-500 to-rose-500' },
  ];

  const mixedContent = [
    { type: 'text', content: '🎵 Music' },
    { type: 'image', color: 'bg-gradient-to-r from-cyan-500 to-blue-500' },
    { type: 'text', content: '🎬 Movies' },
    { type: 'image', color: 'bg-gradient-to-r from-emerald-500 to-green-500' },
    { type: 'text', content: '🎮 Gaming' },
    { type: 'image', color: 'bg-gradient-to-r from-amber-500 to-yellow-500' },
  ];

  const renderContent = () => {
    switch (variant) {
      case 'text':
        return textContent.map((text, index) => (
          <div
            key={index}
            className="flex-shrink-0 text-2xl font-bold text-white px-8 py-4 bg-gray-800 rounded-lg border border-gray-700"
            style={{ marginRight: `${gap}px` }}
          >
            {text}
          </div>
        ));

      case 'images':
        return imageContent.map((item, index) => (
          <div
            key={item.id}
            className={`flex-shrink-0 w-32 h-20 rounded-lg ${item.color} flex items-center justify-center text-white font-bold`}
            style={{ marginRight: `${gap}px` }}
          >
            IMG {item.id}
          </div>
        ));

      case 'mixed':
        return mixedContent.map((item, index) => (
          <div key={index} className="flex-shrink-0" style={{ marginRight: `${gap}px` }}>
            {item.type === 'text' ? (
              <div className="text-xl font-semibold text-white px-6 py-3 bg-gray-700 rounded-lg">
                {item.content}
              </div>
            ) : (
              <div
                className={`w-24 h-16 rounded-lg ${item.color} flex items-center justify-center text-white font-bold text-sm`}
              >
                MEDIA
              </div>
            )}
          </div>
        ));

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8">
          ← Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Infinite Marquee</h1>
          <p className="text-gray-300 text-lg">
            Smooth, infinite scrolling content marquee with customizable speed, direction, and
            content types.
          </p>
        </div>

        {/* Controls */}
        <div className="mb-12 p-6 bg-gray-800 rounded-lg">
          <h2 className="text-2xl font-semibold mb-6">Marquee Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Speed: {speed}px/s</label>
              <input
                type="range"
                min="10"
                max="150"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Gap: {gap}px</label>
              <input
                type="range"
                min="10"
                max="100"
                value={gap}
                onChange={(e) => setGap(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Direction</label>
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value as 'left' | 'right')}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
              >
                <option value="left">Left</option>
                <option value="right">Right</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Content Type</label>
              <select
                value={variant}
                onChange={(e) => setVariant(e.target.value as 'text' | 'images' | 'mixed')}
                className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
              >
                <option value="text">Text Only</option>
                <option value="images">Images Only</option>
                <option value="mixed">Mixed Content</option>
              </select>
            </div>

            <div className="flex items-center">
              <button
                onClick={() => setIsPaused(!isPaused)}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  isPaused ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {isPaused ? 'Resume' : 'Pause'}
              </button>
            </div>
          </div>
        </div>

        {/* Main Marquee Demo */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Main Marquee</h2>
          <div className="bg-gray-800 p-6 rounded-lg overflow-hidden">
            <div
              ref={marqueeRef}
              className="flex animate-marquee-left"
              style={{
                animationDuration: `${(100 / speed) * 10}s`,
                animationDirection: direction === 'right' ? 'reverse' : 'normal',
                animationPlayState: isPaused ? 'paused' : 'running',
              }}
            >
              {/* First set of items */}
              {renderContent()}
              {/* Duplicate set for seamless loop */}
              {renderContent()}
            </div>
          </div>
        </div>

        {/* Multiple Marquee Examples */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Multiple Marquee Layers</h2>
          <div className="space-y-4">
            {/* Fast marquee */}
            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-4 rounded-lg overflow-hidden">
              <h3 className="text-sm font-medium mb-2 text-blue-300">Fast Layer (120px/s)</h3>
              <div className="flex animate-marquee-left" style={{ animationDuration: '8s' }}>
                {textContent.slice(0, 4).map((text, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 text-lg font-semibold text-blue-300 px-6 py-2 mx-4 bg-blue-800/30 rounded"
                  >
                    {text}
                  </div>
                ))}
                {textContent.slice(0, 4).map((text, index) => (
                  <div
                    key={`dup-${index}`}
                    className="flex-shrink-0 text-lg font-semibold text-blue-300 px-6 py-2 mx-4 bg-blue-800/30 rounded"
                  >
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Medium marquee */}
            <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 p-4 rounded-lg overflow-hidden">
              <h3 className="text-sm font-medium mb-2 text-green-300">Medium Layer (60px/s)</h3>
              <div className="flex animate-marquee-right" style={{ animationDuration: '16s' }}>
                {imageContent.map((item, index) => (
                  <div
                    key={item.id}
                    className={`flex-shrink-0 w-24 h-12 mx-3 rounded ${item.color} flex items-center justify-center text-white text-xs font-bold`}
                  >
                    IMG {item.id}
                  </div>
                ))}
                {imageContent.map((item, index) => (
                  <div
                    key={`dup-${item.id}`}
                    className={`flex-shrink-0 w-24 h-12 mx-3 rounded ${item.color} flex items-center justify-center text-white text-xs font-bold`}
                  >
                    IMG {item.id}
                  </div>
                ))}
              </div>
            </div>

            {/* Slow marquee */}
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 p-4 rounded-lg overflow-hidden">
              <h3 className="text-sm font-medium mb-2 text-purple-300">Slow Layer (30px/s)</h3>
              <div className="flex animate-marquee-left" style={{ animationDuration: '32s' }}>
                {mixedContent.map((item, index) => (
                  <div key={index} className="flex-shrink-0 mx-4">
                    {item.type === 'text' ? (
                      <div className="text-sm font-medium text-purple-300 px-4 py-2 bg-purple-800/30 rounded">
                        {item.content}
                      </div>
                    ) : (
                      <div
                        className={`w-16 h-10 rounded ${item.color} flex items-center justify-center text-white text-xs`}
                      >
                        MED
                      </div>
                    )}
                  </div>
                ))}
                {mixedContent.map((item, index) => (
                  <div key={`dup-${index}`} className="flex-shrink-0 mx-4">
                    {item.type === 'text' ? (
                      <div className="text-sm font-medium text-purple-300 px-4 py-2 bg-purple-800/30 rounded">
                        {item.content}
                      </div>
                    ) : (
                      <div
                        className={`w-16 h-10 rounded ${item.color} flex items-center justify-center text-white text-xs`}
                      >
                        MED
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Implementation Code */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Implementation</h2>
          <div className="bg-gray-900 p-6 rounded-lg overflow-x-auto">
            <pre className="text-sm text-gray-300">
              {`import { InfiniteMarquee } from '@tuel/components';

const items = [
  "🚀 INNOVATION",
  "⚡ PERFORMANCE",
  "🎨 DESIGN",
  "🔧 ENGINEERING"
];

export default function MyMarquee() {
  return (
    <InfiniteMarquee
      items={items}
      speed={50}
      direction="left"
      gap={40}
      pauseOnHover={true}
      className="my-marquee"
    />
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
                  <td className="px-6 py-3 font-mono text-sm">items</td>
                  <td className="px-6 py-3 text-sm">ReactNode[]</td>
                  <td className="px-6 py-3 text-sm">required</td>
                  <td className="px-6 py-3 text-sm">Array of items to display in marquee</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 font-mono text-sm">speed</td>
                  <td className="px-6 py-3 text-sm">number</td>
                  <td className="px-6 py-3 text-sm">50</td>
                  <td className="px-6 py-3 text-sm">Animation speed in pixels per second</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 font-mono text-sm">direction</td>
                  <td className="px-6 py-3 text-sm">'left' | 'right'</td>
                  <td className="px-6 py-3 text-sm">'left'</td>
                  <td className="px-6 py-3 text-sm">Direction of marquee movement</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 font-mono text-sm">gap</td>
                  <td className="px-6 py-3 text-sm">number</td>
                  <td className="px-6 py-3 text-sm">40</td>
                  <td className="px-6 py-3 text-sm">Gap between items in pixels</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 font-mono text-sm">pauseOnHover</td>
                  <td className="px-6 py-3 text-sm">boolean</td>
                  <td className="px-6 py-3 text-sm">false</td>
                  <td className="px-6 py-3 text-sm">Pause animation on hover</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 font-mono text-sm">className</td>
                  <td className="px-6 py-3 text-sm">string</td>
                  <td className="px-6 py-3 text-sm">''</td>
                  <td className="px-6 py-3 text-sm">Additional CSS classes</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Features */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">🔄 Infinite Loop</h3>
              <p className="text-gray-300 text-sm">
                Seamless infinite scrolling with no visible breaks or stutters.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">⚡ Performance</h3>
              <p className="text-gray-300 text-sm">
                Hardware-accelerated CSS animations for smooth 60fps performance.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">📱 Responsive</h3>
              <p className="text-gray-300 text-sm">
                Adapts to different screen sizes and container widths.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">🎮 Interactive</h3>
              <p className="text-gray-300 text-sm">
                Pause on hover, click events, and keyboard navigation support.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">🎨 Customizable</h3>
              <p className="text-gray-300 text-sm">
                Full control over speed, direction, spacing, and styling.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">♿ Accessible</h3>
              <p className="text-gray-300 text-sm">
                Respects prefers-reduced-motion and includes ARIA labels.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for marquee animations */}
      <style jsx>{`
        @keyframes marquee-left {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes marquee-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0%);
          }
        }

        .animate-marquee-left {
          animation: marquee-left linear infinite;
        }

        .animate-marquee-right {
          animation: marquee-right linear infinite;
        }
      `}</style>
    </div>
  );
}
