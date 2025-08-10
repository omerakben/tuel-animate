'use client';

import { RevealOnScroll } from '@tuel/components';
import { useState } from 'react';
import Link from 'next/link';

const directions = ['up', 'down', 'left', 'right'] as const;
const engines = ['framer', 'gsap'] as const;

export default function RevealOnScrollPage() {
  const [engine, setEngine] = useState<'framer' | 'gsap'>('framer');
  const [direction, setDirection] = useState<'up' | 'down' | 'left' | 'right'>('up');
  const [duration, setDuration] = useState(0.6);
  const [distance, setDistance] = useState(50);
  const [threshold, setThreshold] = useState(0.1);
  const [triggerOnce, setTriggerOnce] = useState(true);

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
          <h1 className="text-5xl font-bold text-white mb-4">Reveal on Scroll</h1>
          <p className="text-xl text-gray-300">
            Animate elements into view as users scroll. Supports both GSAP and Framer Motion engines.
          </p>
        </header>

        {/* Controls */}
        <section className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Animation Controls</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-white mb-2">Engine</label>
              <select
                value={engine}
                onChange={(e) => setEngine(e.target.value as typeof engine)}
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30"
              >
                {engines.map((eng) => (
                  <option key={eng} value={eng}>
                    {eng === 'framer' ? 'Framer Motion' : 'GSAP'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white mb-2">Direction</label>
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value as typeof direction)}
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30"
              >
                {directions.map((dir) => (
                  <option key={dir} value={dir}>
                    {dir.charAt(0).toUpperCase() + dir.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white mb-2">Duration: {duration}s</label>
              <input
                type="range"
                min="0.1"
                max="2"
                step="0.1"
                value={duration}
                onChange={(e) => setDuration(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-white mb-2">Distance: {distance}px</label>
              <input
                type="range"
                min="10"
                max="200"
                step="10"
                value={distance}
                onChange={(e) => setDistance(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-white mb-2">Threshold: {threshold}</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={threshold}
                onChange={(e) => setThreshold(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="flex items-center text-white">
                <input
                  type="checkbox"
                  checked={triggerOnce}
                  onChange={(e) => setTriggerOnce(e.target.checked)}
                  className="mr-2"
                />
                Trigger Once
              </label>
            </div>
          </div>
        </section>

        {/* Demo Grid */}
        <section className="space-y-24">
          <div>
            <h2 className="text-3xl font-bold text-white mb-8">Basic Reveal</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <RevealOnScroll
                  key={`basic-${i}-${engine}-${direction}`}
                  engine={engine}
                  direction={direction}
                  duration={duration}
                  distance={distance}
                  threshold={threshold}
                  triggerOnce={triggerOnce}
                  delay={i * 0.1}
                >
                  <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6 border border-white/30">
                    <h3 className="text-2xl font-bold text-white mb-2">Card {i}</h3>
                    <p className="text-gray-300">
                      This card reveals from {direction} with a {(i * 0.1).toFixed(1)}s delay
                    </p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-white mb-8">Staggered Text</h2>
            <div className="space-y-4">
              {['Welcome to', 'Tuel Animate', 'Scroll animations', 'made easy'].map((text, i) => (
                <RevealOnScroll
                  key={`text-${i}-${engine}`}
                  engine={engine}
                  direction="left"
                  duration={0.8}
                  distance={100}
                  threshold={0.1}
                  triggerOnce={triggerOnce}
                  delay={i * 0.2}
                >
                  <h3 className="text-4xl font-bold text-white">{text}</h3>
                </RevealOnScroll>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-white mb-8">Mixed Directions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {directions.map((dir, i) => (
                <RevealOnScroll
                  key={`mixed-${dir}-${engine}`}
                  engine={engine}
                  direction={dir}
                  duration={1}
                  distance={80}
                  threshold={0.2}
                  triggerOnce={triggerOnce}
                >
                  <div className="bg-gradient-to-br from-purple-600/30 to-pink-600/30 rounded-xl p-8 border border-white/30">
                    <h3 className="text-3xl font-bold text-white mb-4">From {dir}</h3>
                    <p className="text-gray-300">
                      This element animates in from the {dir} direction
                    </p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-white mb-8">Image Gallery</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <RevealOnScroll
                  key={`img-${i}-${engine}`}
                  engine={engine}
                  direction={directions[i % 4]}
                  duration={0.6}
                  distance={30}
                  threshold={0.1}
                  triggerOnce={triggerOnce}
                  delay={(i % 4) * 0.1}
                >
                  <div className="aspect-square bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
                    {i + 1}
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-white mb-8">Feature List</h2>
            <div className="max-w-2xl mx-auto space-y-4">
              {[
                'SSR Safe - Works with Next.js',
                'Two Animation Engines - GSAP & Framer Motion',
                'Customizable Direction & Distance',
                'Stagger Support for Multiple Elements',
                'Threshold Control for Trigger Point',
                'Optional Repeat Animation',
              ].map((feature, i) => (
                <RevealOnScroll
                  key={`feature-${i}-${engine}`}
                  engine={engine}
                  direction="right"
                  duration={0.5}
                  distance={40}
                  threshold={0.1}
                  triggerOnce={triggerOnce}
                  delay={i * 0.1}
                >
                  <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-lg rounded-lg p-4">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white">
                      ✓
                    </div>
                    <p className="text-white text-lg">{feature}</p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>

        <div className="h-32" />
      </div>
    </div>
  );
}