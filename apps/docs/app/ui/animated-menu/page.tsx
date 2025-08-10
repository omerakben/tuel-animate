'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function AnimatedMenuPage() {
  const [menuType, setMenuType] = useState<'slide' | 'overlay' | 'push' | 'morph' | 'circular'>(
    'slide'
  );
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<'left' | 'right' | 'top' | 'bottom'>('left');
  const [speed, setSpeed] = useState(0.6);

  const menuRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Menu items
  const menuItems = [
    { label: 'Home', icon: '🏠', href: '/' },
    { label: 'About', icon: '👥', href: '/about' },
    { label: 'Services', icon: '🛠️', href: '/services' },
    { label: 'Portfolio', icon: '💼', href: '/portfolio' },
    { label: 'Blog', icon: '📝', href: '/blog' },
    { label: 'Contact', icon: '📧', href: '/contact' },
  ];

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = menuType === 'overlay' ? 'hidden' : 'auto';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, menuType]);

  const getMenuClasses = () => {
    const baseClasses = 'fixed z-50 bg-gray-900 text-white transition-all duration-500 ease-in-out';

    switch (menuType) {
      case 'slide':
        return `${baseClasses} ${
          position === 'left'
            ? 'left-0 top-0 h-full w-80'
            : position === 'right'
              ? 'right-0 top-0 h-full w-80'
              : position === 'top'
                ? 'top-0 left-0 w-full h-80'
                : 'bottom-0 left-0 w-full h-80'
        } ${
          !isOpen
            ? position === 'left'
              ? 'transform -translate-x-full'
              : position === 'right'
                ? 'transform translate-x-full'
                : position === 'top'
                  ? 'transform -translate-y-full'
                  : 'transform translate-y-full'
            : 'transform translate-x-0 translate-y-0'
        }`;

      case 'overlay':
        return `${baseClasses} inset-0 ${
          !isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`;

      case 'push':
        return `${baseClasses} ${
          position === 'left' ? 'left-0 top-0 h-full w-80' : 'right-0 top-0 h-full w-80'
        } ${
          !isOpen
            ? position === 'left'
              ? 'transform -translate-x-full'
              : 'transform translate-x-full'
            : 'transform translate-x-0'
        }`;

      case 'morph':
        return `${baseClasses} top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-2xl ${
          !isOpen ? 'w-16 h-16 opacity-0 scale-0' : 'w-96 h-96 opacity-100 scale-100'
        }`;

      case 'circular':
        return `${baseClasses} top-20 right-8 rounded-full ${
          !isOpen ? 'w-16 h-16 opacity-0 scale-0' : 'w-80 h-80 opacity-100 scale-100'
        }`;

      default:
        return baseClasses;
    }
  };

  const getContentClasses = () => {
    if (menuType === 'push' && isOpen) {
      return `transition-transform duration-500 ease-in-out ${
        position === 'left' ? 'transform translate-x-80' : 'transform -translate-x-80'
      }`;
    }
    return '';
  };

  const renderMenuItems = () => {
    const itemClass =
      menuType === 'circular'
        ? 'absolute flex items-center justify-center w-12 h-12 bg-white/10 rounded-full hover:bg-white/20 transition-colors'
        : 'flex items-center space-x-4 p-4 hover:bg-white/10 rounded-lg transition-colors';

    if (menuType === 'circular' && isOpen) {
      return menuItems.map((item, index) => {
        const angle = index * 60 - 90; // Start from top and go clockwise
        const radius = 100;
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;

        return (
          <button
            key={item.label}
            className={itemClass}
            style={{
              left: `calc(50% + ${x}px - 24px)`,
              top: `calc(50% + ${y}px - 24px)`,
              transitionDelay: `${index * 0.1}s`,
            }}
            onClick={() => setIsOpen(false)}
          >
            <span className="text-lg">{item.icon}</span>
          </button>
        );
      });
    }

    return menuItems.map((item, index) => (
      <button
        key={item.label}
        className={itemClass}
        style={{ transitionDelay: isOpen ? `${index * 0.1}s` : '0s' }}
        onClick={() => setIsOpen(false)}
      >
        <span className="text-xl">{item.icon}</span>
        {menuType !== 'circular' && <span className="font-medium">{item.label}</span>}
      </button>
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Main Content */}
      <div className={getContentClasses()}>
        <div className="container mx-auto px-4 py-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8"
          >
            ← Back to Home
          </Link>

          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Animated Menu</h1>
            <p className="text-gray-300 text-lg">
              Five different menu animation types with customizable positions and effects.
            </p>
          </div>

          {/* Menu Trigger */}
          <div className="mb-12">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="fixed top-6 right-6 z-50 bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg transition-colors shadow-lg"
            >
              <div className="flex flex-col space-y-1">
                <div
                  className={`w-6 h-0.5 bg-white transition-transform ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}
                />
                <div
                  className={`w-6 h-0.5 bg-white transition-opacity ${isOpen ? 'opacity-0' : ''}`}
                />
                <div
                  className={`w-6 h-0.5 bg-white transition-transform ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}
                />
              </div>
            </button>
          </div>

          {/* Controls */}
          <div className="mb-12 p-6 bg-gray-800 rounded-lg">
            <h2 className="text-2xl font-semibold mb-6">Menu Controls</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Menu Type</label>
                <select
                  value={menuType}
                  onChange={(e) => setMenuType(e.target.value as any)}
                  className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                >
                  <option value="slide">Slide</option>
                  <option value="overlay">Overlay</option>
                  <option value="push">Push</option>
                  <option value="morph">Morph</option>
                  <option value="circular">Circular</option>
                </select>
              </div>

              {(menuType === 'slide' || menuType === 'push') && (
                <div>
                  <label className="block text-sm font-medium mb-2">Position</label>
                  <select
                    value={position}
                    onChange={(e) => setPosition(e.target.value as any)}
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2"
                  >
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                    {menuType === 'slide' && (
                      <>
                        <option value="top">Top</option>
                        <option value="bottom">Bottom</option>
                      </>
                    )}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Speed: {speed}s</label>
                <input
                  type="range"
                  min="0.2"
                  max="1.5"
                  step="0.1"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="flex items-center">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                >
                  {isOpen ? 'Close Menu' : 'Open Menu'}
                </button>
              </div>
            </div>
          </div>

          {/* Menu Type Descriptions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">📄 Slide Menu</h3>
              <p className="text-gray-300 text-sm">
                Classic slide-in menu from any side. Clean and familiar interaction pattern.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">🎭 Overlay Menu</h3>
              <p className="text-gray-300 text-sm">
                Full-screen overlay with fade animation. Great for mobile-first designs.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">👉 Push Menu</h3>
              <p className="text-gray-300 text-sm">
                Pushes content to the side while menu slides in. Shows spatial relationship.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">🔄 Morph Menu</h3>
              <p className="text-gray-300 text-sm">
                Morphs from small shape to full menu. Creative and unexpected interaction.
              </p>
            </div>

            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">⭕ Circular Menu</h3>
              <p className="text-gray-300 text-sm">
                Items arranged in a circle. Perfect for quick actions and touch interfaces.
              </p>
            </div>
          </div>

          {/* Sample Content */}
          <div className="space-y-16">
            <section className="py-16">
              <h2 className="text-3xl font-bold mb-8 text-center">Sample Content</h2>
              <p className="text-lg text-gray-300 text-center max-w-3xl mx-auto">
                This is sample content to demonstrate how the menu interacts with the page content.
                Try different menu types to see how they affect the layout and user experience.
              </p>
            </section>

            <section className="py-16 bg-gray-800/30 rounded-lg">
              <div className="container mx-auto px-6">
                <h3 className="text-2xl font-bold mb-6">Features Section</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-gray-700 p-6 rounded-lg">
                      <h4 className="text-lg font-semibold mb-3">Feature {i}</h4>
                      <p className="text-gray-300 text-sm">
                        This is a sample feature description to show content layout with the menu.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Overlay backdrop for overlay menu */}
      {menuType === 'overlay' && isOpen && (
        <div
          ref={overlayRef}
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-500"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Animated Menu */}
      <div ref={menuRef} className={getMenuClasses()} style={{ transitionDuration: `${speed}s` }}>
        <div
          className={`h-full ${
            menuType === 'overlay'
              ? 'flex flex-col items-center justify-center'
              : menuType === 'morph'
                ? 'flex flex-col items-center justify-center'
                : menuType === 'circular'
                  ? 'relative'
                  : 'flex flex-col'
          }`}
        >
          {menuType !== 'circular' && menuType !== 'overlay' && (
            <div className="p-6 border-b border-white/10">
              <h2 className="text-xl font-bold">Navigation</h2>
            </div>
          )}

          <div
            className={`${
              menuType === 'circular'
                ? 'w-full h-full relative'
                : menuType === 'overlay'
                  ? 'space-y-8'
                  : menuType === 'morph'
                    ? 'space-y-4 p-6'
                    : 'flex-1 p-6 space-y-2'
            }`}
          >
            {renderMenuItems()}
          </div>

          {menuType !== 'circular' && menuType !== 'overlay' && (
            <div className="p-6 border-t border-white/10">
              <p className="text-sm text-gray-400">© 2024 Tuel Animate</p>
            </div>
          )}
        </div>
      </div>

      {/* Implementation Code */}
      <div className="container mx-auto px-4 py-16">
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Implementation</h2>
          <div className="bg-gray-900 p-6 rounded-lg overflow-x-auto">
            <pre className="text-sm text-gray-300">
              {`import { AnimatedMenu } from '@tuel/components';

const menuItems = [
  { label: 'Home', icon: '🏠', href: '/' },
  { label: 'About', icon: '👥', href: '/about' },
  // ... more items
];

export default function MyPage() {
  return (
    <AnimatedMenu
      type="${menuType}"
      position="${position}"
      speed={${speed}}
      items={menuItems}
      trigger={<MenuButton />}
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
                  <td className="px-6 py-3 font-mono text-sm">type</td>
                  <td className="px-6 py-3 text-sm">
                    'slide' | 'overlay' | 'push' | 'morph' | 'circular'
                  </td>
                  <td className="px-6 py-3 text-sm">'slide'</td>
                  <td className="px-6 py-3 text-sm">Menu animation type</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 font-mono text-sm">position</td>
                  <td className="px-6 py-3 text-sm">'left' | 'right' | 'top' | 'bottom'</td>
                  <td className="px-6 py-3 text-sm">'left'</td>
                  <td className="px-6 py-3 text-sm">Menu position (for slide/push types)</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 font-mono text-sm">speed</td>
                  <td className="px-6 py-3 text-sm">number</td>
                  <td className="px-6 py-3 text-sm">0.6</td>
                  <td className="px-6 py-3 text-sm">Animation duration in seconds</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 font-mono text-sm">items</td>
                  <td className="px-6 py-3 text-sm">MenuItemw[]</td>
                  <td className="px-6 py-3 text-sm">required</td>
                  <td className="px-6 py-3 text-sm">Array of menu items</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 font-mono text-sm">trigger</td>
                  <td className="px-6 py-3 text-sm">ReactNode</td>
                  <td className="px-6 py-3 text-sm">required</td>
                  <td className="px-6 py-3 text-sm">Menu trigger element</td>
                </tr>
                <tr>
                  <td className="px-6 py-3 font-mono text-sm">onItemClick</td>
                  <td className="px-6 py-3 text-sm">(item) =&gt; void</td>
                  <td className="px-6 py-3 text-sm">undefined</td>
                  <td className="px-6 py-3 text-sm">Callback when menu item is clicked</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
