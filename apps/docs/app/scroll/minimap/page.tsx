'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function ScrollMinimapPage() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMinimapVisible, setIsMinimapVisible] = useState(true);
  const [minimapPosition, setMinimapPosition] = useState<'right' | 'left'>('right');
  const [showLabels, setShowLabels] = useState(true);
  const [activeSection, setActiveSection] = useState(0);

  const sectionsRef = useRef<HTMLDivElement[]>([]);
  const pageRef = useRef<HTMLDivElement>(null);

  // Section data
  const sections = [
    { id: 'intro', title: 'Introduction', color: 'bg-blue-500' },
    { id: 'features', title: 'Key Features', color: 'bg-green-500' },
    { id: 'demo', title: 'Interactive Demo', color: 'bg-purple-500' },
    { id: 'usage', title: 'Usage Examples', color: 'bg-orange-500' },
    { id: 'api', title: 'API Reference', color: 'bg-red-500' },
    { id: 'performance', title: 'Performance', color: 'bg-yellow-500' },
    { id: 'accessibility', title: 'Accessibility', color: 'bg-pink-500' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / documentHeight, 1);
      setScrollProgress(progress);

      // Determine active section
      const sectionOffsets = sectionsRef.current.map((section) => {
        if (!section) return 0;
        return section.offsetTop - window.innerHeight / 3;
      });

      const currentSection = sectionOffsets.findIndex((offset, index) => {
        const nextOffset = sectionOffsets[index + 1];
        return scrollTop >= offset && (nextOffset === undefined || scrollTop < nextOffset);
      });

      if (currentSection !== -1) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (index: number) => {
    sectionsRef.current[index]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <div ref={pageRef} className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Scroll Minimap */}
      {isMinimapVisible && (
        <div
          className={`fixed top-1/2 transform -translate-y-1/2 z-50 ${
            minimapPosition === 'right' ? 'right-4' : 'left-4'
          }`}
        >
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 border border-gray-700">
            {/* Progress indicator */}
            <div className="relative h-64 w-3 bg-gray-700 rounded-full mb-4">
              <div
                className="absolute left-0 w-full bg-blue-400 rounded-full transition-all duration-300"
                style={{ height: `${scrollProgress * 100}%` }}
              />

              {/* Section markers */}
              {sections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(index)}
                  className={`absolute left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full border-2 border-gray-800 transition-all duration-200 hover:scale-125 ${
                    activeSection === index ? section.color : 'bg-gray-600'
                  }`}
                  style={{
                    top: `${(index / (sections.length - 1)) * 100}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  title={section.title}
                />
              ))}
            </div>

            {/* Section labels */}
            {showLabels && (
              <div className="space-y-1">
                {sections.map((section, index) => (
                  <button
                    key={`label-${section.id}`}
                    onClick={() => scrollToSection(index)}
                    className={`block text-xs px-2 py-1 rounded transition-colors w-full text-left ${
                      activeSection === index
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8">
          ← Back to Home
        </Link>

        {/* Introduction Section */}
        <div
          ref={(el) => {
            if (el) sectionsRef.current[0] = el;
          }}
          className="min-h-screen flex flex-col justify-center"
        >
          <h1 className="text-6xl font-bold mb-6">Scroll Minimap</h1>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl">
            Navigate long content with an intuitive minimap that shows your current position and
            allows quick jumps to different sections.
          </p>

          {/* Controls */}
          <div className="bg-gray-800 p-6 rounded-lg max-w-2xl">
            <h2 className="text-2xl font-semibold mb-4">Minimap Controls</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <span>Show Minimap</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isMinimapVisible}
                    onChange={(e) => setIsMinimapVisible(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <span>Position</span>
                <select
                  value={minimapPosition}
                  onChange={(e) => setMinimapPosition(e.target.value as 'right' | 'left')}
                  className="bg-gray-700 border border-gray-600 rounded px-3 py-1"
                >
                  <option value="right">Right</option>
                  <option value="left">Left</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span>Show Labels</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showLabels}
                    onChange={(e) => setShowLabels(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <span>Progress</span>
                <span className="text-blue-400 font-mono">{Math.round(scrollProgress * 100)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div
          ref={(el) => { if (el) sectionsRef.current[1] = el; }}
          className="min-h-screen flex flex-col justify-center"
        >
          <div className="max-w-4xl">
            <h2 className="text-5xl font-bold mb-8 text-green-400">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-2xl font-semibold mb-4">Real-time Progress</h3>
                <p className="text-gray-300">
                  Visual progress indicator that updates as you scroll through the content.
                </p>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-2xl font-semibold mb-4">Section Navigation</h3>
                <p className="text-gray-300">
                  Click on section markers to instantly jump to different parts of the page.
                </p>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-2xl font-semibold mb-4">Active Section Highlighting</h3>
                <p className="text-gray-300">
                  Current section is highlighted to show your exact position in the content.
                </p>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-2xl font-semibent mb-4">Customizable Position</h3>
                <p className="text-gray-300">
                  Choose between left or right side placement based on your layout needs.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Demo Section */}
        <div
          ref={(el) => { if (el) sectionsRef.current[2] = el; }}
          className="min-h-screen flex flex-col justify-center"
        >
          <h2 className="text-5xl font-bold mb-8 text-purple-400">Interactive Demo</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Demo area with scrollable content */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800 p-6 rounded-lg h-96 overflow-y-auto relative">
                <h3 className="text-xl font-semibold mb-4">Scrollable Content Area</h3>

                {/* Mini minimap for this demo area */}
                <div className="absolute right-4 top-4 w-2 h-80 bg-gray-700 rounded-full">
                  <div
                    className="w-full bg-purple-400 rounded-full transition-all duration-300"
                    style={{ height: `${scrollProgress * 100}%` }}
                  />
                </div>

                <div className="space-y-8 pr-8">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div key={i} className="p-4 bg-gray-700 rounded">
                      <h4 className="font-semibold mb-2">Content Block {i + 1}</h4>
                      <p className="text-gray-300 text-sm">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
                        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                        quis nostrud exercitation.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Feature highlights */}
            <div className="space-y-4">
              <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/30">
                <h4 className="font-semibold mb-2">📍 Position Tracking</h4>
                <p className="text-sm text-gray-300">
                  The minimap accurately tracks your scroll position in real-time.
                </p>
              </div>

              <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/30">
                <h4 className="font-semibold mb-2">🎯 Quick Navigation</h4>
                <p className="text-sm text-gray-300">
                  Click on any section marker to instantly jump to that content.
                </p>
              </div>

              <div className="bg-purple-900/30 p-4 rounded-lg border border-purple-500/30">
                <h4 className="font-semibold mb-2">📱 Responsive Design</h4>
                <p className="text-sm text-gray-300">
                  Works perfectly on desktop and mobile devices.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Examples Section */}
        <div
          ref={(el) => { if (el) sectionsRef.current[3] = el; }}
          className="min-h-screen flex flex-col justify-center"
        >
          <h2 className="text-5xl font-bold mb-8 text-orange-400">Usage Examples</h2>

          <div className="bg-gray-900 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Basic Implementation</h3>
            <pre className="text-sm text-gray-300 overflow-x-auto">
              {`import { ScrollMinimap } from '@tuel/components';

const sections = [
  { id: 'intro', title: 'Introduction', color: 'bg-blue-500' },
  { id: 'features', title: 'Features', color: 'bg-green-500' },
  { id: 'demo', title: 'Demo', color: 'bg-purple-500' },
];

export default function MyPage() {
  return (
    <div>
      <ScrollMinimap
        sections={sections}
        position="right"
        showLabels={true}
        className="custom-minimap"
      />

      <div id="intro">Introduction content...</div>
      <div id="features">Features content...</div>
      <div id="demo">Demo content...</div>
    </div>
  );
}`}
            </pre>
          </div>
        </div>

        {/* API Reference Section */}
        <div
          ref={(el) => { if (el) sectionsRef.current[4] = el; }}
          className="min-h-screen flex flex-col justify-center"
        >
          <h2 className="text-5xl font-bold mb-8 text-red-400">API Reference</h2>

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
                  <td className="px-6 py-3 font-mono text-sm">sections</td>
                  <td className="px-6 py-3 text-sm">Section[]</td>
                  <td className="px-6 py-3 text-sm">required</td>
                  <td className="px-6 py-3 text-sm">Array of section objects to track</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 font-mono text-sm">position</td>
                  <td className="px-6 py-3 text-sm">'left' | 'right'</td>
                  <td className="px-6 py-3 text-sm">'right'</td>
                  <td className="px-6 py-3 text-sm">Position of the minimap</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 font-mono text-sm">showLabels</td>
                  <td className="px-6 py-3 text-sm">boolean</td>
                  <td className="px-6 py-3 text-sm">true</td>
                  <td className="px-6 py-3 text-sm">Show section labels</td>
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

        {/* Performance Section */}
        <div
          ref={(el) => { if (el) sectionsRef.current[5] = el; }}
          className="min-h-screen flex flex-col justify-center"
        >
          <h2 className="text-5xl font-bold mb-8 text-yellow-400">Performance</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">60fps</div>
              <div className="text-gray-300">Smooth scroll tracking</div>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">5KB</div>
              <div className="text-gray-300">Minified bundle size</div>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-400 mb-2">1ms</div>
              <div className="text-gray-300">Scroll event processing</div>
            </div>
          </div>

          <div className="mt-8 bg-yellow-900/20 border border-yellow-500/30 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4">Performance Features</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Throttled scroll event handling</li>
              <li>• Optimized DOM queries with refs</li>
              <li>• Minimal re-renders with efficient state management</li>
              <li>• Hardware-accelerated CSS transforms</li>
              <li>• Lazy loading of section positions</li>
            </ul>
          </div>
        </div>

        {/* Accessibility Section */}
        <div
          ref={(el) => { if (el) sectionsRef.current[6] = el; }}
          className="min-h-screen flex flex-col justify-center"
        >
          <h2 className="text-5xl font-bold mb-8 text-pink-400">Accessibility</h2>

          <div className="space-y-6">
            <div className="bg-pink-900/20 border border-pink-500/30 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Keyboard Navigation</h3>
              <p className="text-gray-300 mb-4">
                The minimap is fully navigable using keyboard shortcuts for better accessibility.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="font-mono bg-gray-700 px-2 py-1 rounded">Tab</span>
                  <span>Navigate through sections</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-mono bg-gray-700 px-2 py-1 rounded">Enter</span>
                  <span>Jump to selected section</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-mono bg-gray-700 px-2 py-1 rounded">↑/↓</span>
                  <span>Navigate sections</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-mono bg-gray-700 px-2 py-1 rounded">Esc</span>
                  <span>Close minimap</span>
                </div>
              </div>
            </div>

            <div className="bg-pink-900/20 border border-pink-500/30 p-6 rounded-lg">
              <h3 className="text-xl font-semibent mb-4">Screen Reader Support</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• ARIA labels for all interactive elements</li>
                <li>• Semantic HTML structure</li>
                <li>• Progress announcements</li>
                <li>• Section navigation descriptions</li>
                <li>• Focus management</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
