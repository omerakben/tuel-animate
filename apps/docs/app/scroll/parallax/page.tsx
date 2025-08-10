'use client';

import { ParallaxScroll, ParallaxLayer } from '@tuel/components';
import Link from 'next/link';

export default function ParallaxPage() {
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
          <h1 className="text-5xl font-bold text-white mb-4">Parallax Scroll</h1>
          <p className="text-xl text-gray-300">
            Create depth with multi-layer parallax scrolling effects
          </p>
        </header>

        {/* Basic Parallax Demo */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold text-white mb-8">Basic Parallax Layers</h2>
          <div className="h-[600px] relative overflow-hidden rounded-2xl border border-white/20">
            <ParallaxScroll>
              <ParallaxLayer speed={0.2} offset={0}>
                <div className="absolute inset-0 bg-gradient-to-b from-purple-900 to-pink-900" />
              </ParallaxLayer>
              
              <ParallaxLayer speed={0.5} offset={0.2}>
                <div className="flex justify-center items-center h-full">
                  <div className="text-center">
                    <h3 className="text-6xl font-bold text-white/30">Background Layer</h3>
                    <p className="text-xl text-white/20 mt-4">Speed: 0.5</p>
                  </div>
                </div>
              </ParallaxLayer>

              <ParallaxLayer speed={1} offset={0.5}>
                <div className="flex justify-center items-center h-full">
                  <div className="bg-white/20 backdrop-blur-lg rounded-2xl p-12 border border-white/30">
                    <h3 className="text-4xl font-bold text-white">Middle Layer</h3>
                    <p className="text-xl text-gray-300 mt-4">Speed: 1.0 (Normal)</p>
                  </div>
                </div>
              </ParallaxLayer>

              <ParallaxLayer speed={1.5} offset={0.7}>
                <div className="flex justify-center items-center h-full">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 shadow-2xl">
                    <h3 className="text-3xl font-bold text-white">Foreground Layer</h3>
                    <p className="text-lg text-white/90 mt-2">Speed: 1.5 (Faster)</p>
                  </div>
                </div>
              </ParallaxLayer>
            </ParallaxScroll>
          </div>
        </section>

        {/* Hero Section with Parallax */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold text-white mb-8">Hero Section Example</h2>
          <div className="h-[800px] relative overflow-hidden rounded-2xl">
            <ParallaxScroll>
              {/* Background */}
              <ParallaxLayer speed={0.3} offset={0}>
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(0,0,0,0.4)_100%)]" />
                </div>
              </ParallaxLayer>

              {/* Stars/Particles */}
              <ParallaxLayer speed={0.5} offset={0}>
                <div className="absolute inset-0">
                  {Array.from({ length: 50 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-white rounded-full opacity-50"
                      style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                      }}
                    />
                  ))}
                </div>
              </ParallaxLayer>

              {/* Main Content */}
              <ParallaxLayer speed={1} offset={0.3}>
                <div className="flex flex-col justify-center items-center h-full px-6">
                  <h1 className="text-7xl font-bold text-white mb-6 text-center">
                    Parallax Hero
                  </h1>
                  <p className="text-2xl text-gray-300 text-center max-w-2xl">
                    Create stunning depth effects with multiple scrolling layers
                  </p>
                  <button className="mt-8 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transition-colors">
                    Get Started
                  </button>
                </div>
              </ParallaxLayer>

              {/* Floating Elements */}
              <ParallaxLayer speed={1.5} offset={0.6}>
                <div className="flex justify-around items-center h-full px-12">
                  <div className="w-20 h-20 bg-purple-500/30 backdrop-blur rounded-full" />
                  <div className="w-32 h-32 bg-pink-500/30 backdrop-blur rounded-full" />
                  <div className="w-24 h-24 bg-blue-500/30 backdrop-blur rounded-full" />
                </div>
              </ParallaxLayer>
            </ParallaxScroll>
          </div>
        </section>

        {/* Card Stack with Parallax */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold text-white mb-8">Parallax Card Stack</h2>
          <div className="h-[1200px] relative">
            <ParallaxScroll>
              {[
                { speed: 0.5, color: 'from-purple-600 to-blue-600', title: 'Design', offset: 0.1 },
                { speed: 0.7, color: 'from-pink-600 to-purple-600', title: 'Develop', offset: 0.3 },
                { speed: 0.9, color: 'from-blue-600 to-green-600', title: 'Deploy', offset: 0.5 },
                { speed: 1.1, color: 'from-green-600 to-yellow-600', title: 'Scale', offset: 0.7 },
              ].map((card, i) => (
                <ParallaxLayer key={i} speed={card.speed} offset={card.offset}>
                  <div className="flex justify-center items-center h-full px-6">
                    <div className={`bg-gradient-to-br ${card.color} rounded-2xl p-12 shadow-2xl max-w-md w-full`}>
                      <h3 className="text-4xl font-bold text-white mb-4">{card.title}</h3>
                      <p className="text-white/90">
                        Layer {i + 1} scrolls at {card.speed}x speed creating a beautiful depth effect
                      </p>
                    </div>
                  </div>
                </ParallaxLayer>
              ))}
            </ParallaxScroll>
          </div>
        </section>

        {/* Horizontal Parallax */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold text-white mb-8">Feature Showcase</h2>
          <div className="space-y-32">
            {[
              {
                title: 'Performance Optimized',
                description: 'Hardware-accelerated transforms for smooth 60fps scrolling',
                icon: '⚡',
              },
              {
                title: 'Fully Customizable',
                description: 'Control speed, offset, and direction for each layer',
                icon: '🎨',
              },
              {
                title: 'Responsive Design',
                description: 'Works seamlessly across all device sizes',
                icon: '📱',
              },
              {
                title: 'Easy Integration',
                description: 'Simple API that works with any React project',
                icon: '🔧',
              },
            ].map((feature, i) => (
              <div key={i} className="h-[400px] relative">
                <ParallaxScroll>
                  <ParallaxLayer speed={0.5} offset={0}>
                    <div className="flex items-center justify-center h-full">
                      <div className="text-[200px] opacity-10">{feature.icon}</div>
                    </div>
                  </ParallaxLayer>
                  <ParallaxLayer speed={1} offset={0.2}>
                    <div className="flex items-center justify-center h-full px-6">
                      <div className="max-w-2xl">
                        <h3 className="text-5xl font-bold text-white mb-4">{feature.title}</h3>
                        <p className="text-xl text-gray-300">{feature.description}</p>
                      </div>
                    </div>
                  </ParallaxLayer>
                </ParallaxScroll>
              </div>
            ))}
          </div>
        </section>

        <div className="h-32" />
      </div>
    </div>
  );
}