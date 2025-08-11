'use client';

import Link from 'next/link';

const testPages = [
  {
    category: 'Scroll Animations',
    pages: [
      {
        href: '/scroll/reveal-on-scroll',
        title: 'Reveal on Scroll',
        description: 'Elements reveal with various animations on scroll',
      },
      {
        href: '/scroll/scroll-frame',
        title: 'Frame Animation',
        description: 'Frame-by-frame animations triggered by scroll',
      },
      {
        href: '/scroll/parallax',
        title: 'Parallax Scroll',
        description: 'Multi-layer parallax scrolling effects',
      },
      {
        href: '/scroll/sticky-cards',
        title: 'Sticky Cards',
        description: 'Cards that stick and transform on scroll',
      },
      {
        href: '/scroll/minimap',
        title: 'Scroll Minimap',
        description: 'Navigation minimap with scroll progress',
      },
    ],
  },
  {
    category: 'Page Transitions',
    pages: [
      {
        href: '/transitions/page-transition',
        title: 'Page Transitions',
        description: 'Various page transition effects',
      },
      {
        href: '/transitions/route-transition',
        title: 'Route Transitions',
        description: 'Next.js router transitions',
      },
      {
        href: '/transitions/smooth-scroll',
        title: 'Smooth Scroll',
        description: 'Lenis-like smooth scrolling',
      },
      {
        href: '/transitions/image-trail',
        title: 'Image Trail',
        description: 'Mouse trail effects with images',
      },
    ],
  },
  {
    category: 'Text Effects',
    pages: [
      {
        href: '/text/animated-text',
        title: 'Animated Text',
        description: 'Split, scramble, wave, typewriter effects',
      },
      {
        href: '/text/particle-text',
        title: 'Particle Text',
        description: 'Text to particle animations',
      },
    ],
  },
  {
    category: '3D/WebGL',
    pages: [
      {
        href: '/three/orbit-scene',
        title: '3D Orbit Scene',
        description: 'Basic Three.js scene with orbit controls',
      },
      {
        href: '/three/garage-scene',
        title: '3D Garage Scene',
        description: 'Cyberpunk garage with bloom effects',
      },
      {
        href: '/three/slider',
        title: '3D Slider',
        description: 'Curved 3D slider with scroll-driven textures',
      },
      {
        href: '/three/cylindrical-gallery',
        title: '3D Cylindrical Gallery',
        description: 'Circular image gallery with curved planes',
      },
      {
        href: '/three/phantom-gallery',
        title: 'Phantom Gallery',
        description: 'WebGL shader-based infinite gallery',
      },
      {
        href: '/three/floating-objects',
        title: 'Floating Objects',
        description: '3D floating shapes with distortion',
      },
      {
        href: '/three/particle-wave',
        title: 'Particle Wave',
        description: '3D particle wave system',
      },
      {
        href: '/three/morphing-shapes',
        title: 'Morphing Shapes',
        description: 'Shape morphing animations',
      },
    ],
  },
  {
    category: 'Particles & Canvas',
    pages: [
      {
        href: '/canvas/particle-field',
        title: 'Particle Field',
        description: 'Interactive particle system with physics',
      },
      { href: '/canvas/wave-canvas', title: 'Wave Canvas', description: 'Animated wave patterns' },
      { href: '/canvas/noise-field', title: 'Noise Field', description: 'Perlin noise flow field' },
      {
        href: '/canvas/canvas-animation',
        title: 'Canvas Animation',
        description: 'Custom canvas wrapper animations',
      },
    ],
  },
  {
    category: 'UI Components',
    pages: [
      {
        href: '/ui/carousel',
        title: 'Carousel',
        description: 'Multiple carousel animation variants',
      },
      {
        href: '/ui/animated-menu',
        title: 'Animated Menu',
        description: 'Menu animations (slide, overlay, push, morph)',
      },
      {
        href: '/ui/image-gallery',
        title: 'Image Gallery',
        description: 'Multiple gallery layout options',
      },
      {
        href: '/ui/hero-section',
        title: 'Hero Section',
        description: 'Landing page hero with parallax',
      },
      {
        href: '/ui/infinite-marquee',
        title: 'Infinite Marquee',
        description: 'Auto-scrolling content marquee',
      },
    ],
  },
  {
    category: 'Hover Effects',
    pages: [
      {
        href: '/hover/distortion',
        title: 'Hover Distortion',
        description: 'WebGL image distortion on hover',
      },
    ],
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      <div className="container mx-auto px-6 py-12">
        <header className="mb-16 text-center">
          <h1 className="text-6xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Tuel Animate Components
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Developer Playground & Component Documentation
          </p>

          {/* Two-App Architecture Explanation */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-12 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-4">🏗️ Two-App Architecture</h2>
            <div className="grid md:grid-cols-2 gap-6 text-left">
              <div className="bg-blue-500/20 rounded-lg p-4">
                <h3 className="font-bold text-blue-300 mb-2">📚 This App (localhost:3001)</h3>
                <p className="text-gray-300 text-sm mb-2">Developer Playground</p>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• Component documentation & API refs</li>
                  <li>• Copy-paste code examples</li>
                  <li>• Technical implementation guides</li>
                  <li>• Component testing playground</li>
                </ul>
              </div>
              <div className="bg-purple-500/20 rounded-lg p-4">
                <h3 className="font-bold text-purple-300 mb-2">🎨 Web App (localhost:3002)</h3>
                <p className="text-gray-300 text-sm mb-2">Polished Demo Showcase</p>
                <ul className="text-gray-400 text-sm space-y-1">
                  <li>• Production-ready animation demos</li>
                  <li>• Client presentation quality</li>
                  <li>• Portfolio-worthy showcases</li>
                  <li>• Real-world implementations</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-3 bg-green-500/20 rounded-lg">
              <p className="text-green-300 text-sm">
                💡 <strong>For Developers:</strong> Use this app to learn and implement components.
                <strong>For Clients:</strong> Visit{' '}
                <a href="http://localhost:3002" className="underline hover:text-white">
                  localhost:3002
                </a>{' '}
                for polished demos.
              </p>
            </div>
          </div>
        </header>

        <div className="grid gap-12">
          {testPages.map((category) => (
            <section
              key={category.category}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-8"
            >
              <h2 className="text-3xl font-bold text-white mb-6 border-b border-white/20 pb-4">
                {category.category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {category.pages.map((page) => (
                  <Link
                    key={page.href}
                    href={page.href}
                    className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-purple-600/20 to-pink-600/20 p-6 hover:from-purple-600/30 hover:to-pink-600/30 transition-all duration-300 border border-white/10 hover:border-white/30"
                  >
                    <div className="relative z-10">
                      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                        {page.title}
                      </h3>
                      <p className="text-gray-300 text-sm">{page.description}</p>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-pink-600/0 group-hover:from-purple-600/10 group-hover:to-pink-600/10 transition-all duration-300" />
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        <footer className="mt-16 text-center text-gray-400">
          <p>© 2024 Tuel Animate - Production-ready animation components</p>
        </footer>
      </div>
    </div>
  );
}
