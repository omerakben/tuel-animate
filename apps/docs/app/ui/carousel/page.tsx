'use client';

import { Carousel } from '@tuel/components';
import Link from 'next/link';
import { useState } from 'react';

const variants = ['fade', 'slide', '3d', 'stack', 'coverflow'] as const;

const slides = [
  {
    id: '1',
    content: (
      <div className="h-full bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center">
        <div className="text-center text-white p-8">
          <h3 className="text-4xl font-bold mb-4">Slide 1</h3>
          <p className="text-xl">Beautiful gradient background</p>
        </div>
      </div>
    ),
  },
  {
    id: '2',
    content: (
      <div className="h-full bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center">
        <div className="text-center text-white p-8">
          <h3 className="text-4xl font-bold mb-4">Slide 2</h3>
          <p className="text-xl">Smooth animations</p>
        </div>
      </div>
    ),
  },
  {
    id: '3',
    content: (
      <div className="h-full bg-gradient-to-br from-green-600 to-teal-600 rounded-2xl flex items-center justify-center">
        <div className="text-center text-white p-8">
          <h3 className="text-4xl font-bold mb-4">Slide 3</h3>
          <p className="text-xl">Multiple variants</p>
        </div>
      </div>
    ),
  },
  {
    id: '4',
    content: (
      <div className="h-full bg-gradient-to-br from-orange-600 to-red-600 rounded-2xl flex items-center justify-center">
        <div className="text-center text-white p-8">
          <h3 className="text-4xl font-bold mb-4">Slide 4</h3>
          <p className="text-xl">Touch & drag support</p>
        </div>
      </div>
    ),
  },
  {
    id: '5',
    content: (
      <div className="h-full bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center">
        <div className="text-center text-white p-8">
          <h3 className="text-4xl font-bold mb-4">Slide 5</h3>
          <p className="text-xl">Responsive design</p>
        </div>
      </div>
    ),
  },
];

export default function CarouselPage() {
  const [variant, setVariant] = useState<(typeof variants)[number]>('slide');
  const [autoPlay, setAutoPlay] = useState(true);
  const [loop, setLoop] = useState(true);
  const [showIndicators, setShowIndicators] = useState(true);
  const [showArrows, setShowArrows] = useState(true);
  const [duration, setDuration] = useState(0.5);
  const [autoPlayInterval, setAutoPlayInterval] = useState(3000);

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
          <h1 className="text-5xl font-bold text-white mb-4">Carousel Component</h1>
          <p className="text-xl text-gray-300">
            Multiple carousel variants with smooth animations and touch support
          </p>
        </header>

        {/* Controls */}
        <section className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Carousel Controls</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-white mb-2">Variant</label>
              <select
                value={variant}
                onChange={(e) => setVariant(e.target.value as typeof variant)}
                className="w-full px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30"
              >
                {variants.map((v) => (
                  <option key={v} value={v}>
                    {v.charAt(0).toUpperCase() + v.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white mb-2">Duration: {duration}s</label>
              <input
                type="range"
                min="0.2"
                max="2"
                step="0.1"
                value={duration}
                onChange={(e) => setDuration(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-white mb-2">
                Auto Play Interval: {autoPlayInterval}ms
              </label>
              <input
                type="range"
                min="1000"
                max="5000"
                step="500"
                value={autoPlayInterval}
                onChange={(e) => setAutoPlayInterval(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="flex items-center text-white">
                <input
                  type="checkbox"
                  checked={autoPlay}
                  onChange={(e) => setAutoPlay(e.target.checked)}
                  className="mr-2"
                />
                Auto Play
              </label>
            </div>

            <div>
              <label className="flex items-center text-white">
                <input
                  type="checkbox"
                  checked={loop}
                  onChange={(e) => setLoop(e.target.checked)}
                  className="mr-2"
                />
                Loop
              </label>
            </div>

            <div>
              <label className="flex items-center text-white">
                <input
                  type="checkbox"
                  checked={showIndicators}
                  onChange={(e) => setShowIndicators(e.target.checked)}
                  className="mr-2"
                />
                Show Indicators
              </label>
            </div>

            <div>
              <label className="flex items-center text-white">
                <input
                  type="checkbox"
                  checked={showArrows}
                  onChange={(e) => setShowArrows(e.target.checked)}
                  className="mr-2"
                />
                Show Arrows
              </label>
            </div>
          </div>
        </section>

        {/* Main Carousel Demo */}
        <section className="mb-24">
          <div className="h-[500px]">
            <Carousel
              slides={slides}
              variant={variant}
              autoPlay={autoPlay}
              autoPlayInterval={autoPlayInterval}
              loop={loop}
              showIndicators={showIndicators}
              showArrows={showArrows}
              className="h-full"
            />
          </div>
        </section>

        {/* All Variants Showcase */}
        <section className="space-y-24">
          <h2 className="text-3xl font-bold text-white mb-8">All Carousel Variants</h2>

          {variants.map((v) => (
            <div key={v} className="space-y-4">
              <h3 className="text-2xl font-bold text-purple-300">{v.toUpperCase()} Variant</h3>
              <div className="h-[400px]">
                <Carousel
                  slides={slides}
                  variant={v}
                  autoPlay={false}
                  loop={true}
                  showIndicators={true}
                  showArrows={true}
                  className="h-full"
                />
              </div>
              <p className="text-gray-300">
                {v === 'fade' && 'Smooth fade transition between slides'}
                {v === 'slide' && 'Classic sliding animation'}
                {v === '3d' && '3D perspective transformation'}
                {v === 'stack' && 'Cards stack behind each other'}
                {v === 'coverflow' && 'Apple-style coverflow effect'}
              </p>
            </div>
          ))}
        </section>

        {/* Image Gallery Example */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold text-white mb-8">Image Gallery</h2>
          <div className="h-[600px]">
            <Carousel
              slides={[
                {
                  id: 'img1',
                  content: (
                    <div className="h-full flex items-center justify-center bg-black rounded-2xl">
                      <div className="text-center">
                        <div className="w-full h-96 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg mb-4" />
                        <h3 className="text-2xl font-bold text-white">Nature Photography</h3>
                        <p className="text-gray-400">Captured in the wild</p>
                      </div>
                    </div>
                  ),
                },
                {
                  id: 'img2',
                  content: (
                    <div className="h-full flex items-center justify-center bg-black rounded-2xl">
                      <div className="text-center">
                        <div className="w-full h-96 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg mb-4" />
                        <h3 className="text-2xl font-bold text-white">Urban Landscapes</h3>
                        <p className="text-gray-400">City lights and shadows</p>
                      </div>
                    </div>
                  ),
                },
                {
                  id: 'img3',
                  content: (
                    <div className="h-full flex items-center justify-center bg-black rounded-2xl">
                      <div className="text-center">
                        <div className="w-full h-96 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg mb-4" />
                        <h3 className="text-2xl font-bold text-white">Abstract Art</h3>
                        <p className="text-gray-400">Digital creations</p>
                      </div>
                    </div>
                  ),
                },
              ]}
              variant="coverflow"
              autoPlay={true}
              autoPlayInterval={4000}
              loop={true}
              showIndicators={true}
              showArrows={true}
              className="h-full"
            />
          </div>
        </section>

        {/* Testimonial Carousel */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold text-white mb-8">Testimonials</h2>
          <div className="max-w-4xl mx-auto">
            <Carousel
              slides={[
                {
                  id: 't1',
                  content: (
                    <div className="text-center p-12">
                      <p className="text-2xl text-white mb-6 italic">
                        "The best animation library I've ever used. It just works!"
                      </p>
                      <div className="flex items-center justify-center space-x-4">
                        <div className="w-12 h-12 bg-purple-500 rounded-full" />
                        <div>
                          <p className="text-white font-semibold">Sarah Johnson</p>
                          <p className="text-gray-400">Frontend Developer</p>
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  id: 't2',
                  content: (
                    <div className="text-center p-12">
                      <p className="text-2xl text-white mb-6 italic">
                        "Incredible performance and beautiful animations out of the box."
                      </p>
                      <div className="flex items-center justify-center space-x-4">
                        <div className="w-12 h-12 bg-blue-500 rounded-full" />
                        <div>
                          <p className="text-white font-semibold">Michael Chen</p>
                          <p className="text-gray-400">UX Designer</p>
                        </div>
                      </div>
                    </div>
                  ),
                },
                {
                  id: 't3',
                  content: (
                    <div className="text-center p-12">
                      <p className="text-2xl text-white mb-6 italic">
                        "Saved us weeks of development time. Highly recommended!"
                      </p>
                      <div className="flex items-center justify-center space-x-4">
                        <div className="w-12 h-12 bg-green-500 rounded-full" />
                        <div>
                          <p className="text-white font-semibold">Emily Davis</p>
                          <p className="text-gray-400">Tech Lead</p>
                        </div>
                      </div>
                    </div>
                  ),
                },
              ]}
              variant="fade"
              autoPlay={true}
              autoPlayInterval={5000}
              loop={true}
              showIndicators={true}
              showArrows={false}
              className="h-[300px]"
            />
          </div>
        </section>

        {/* Feature List */}
        <section className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Carousel Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ul className="space-y-3 text-gray-300">
              <li>✓ 6 unique animation variants</li>
              <li>✓ Touch and drag support</li>
              <li>✓ Keyboard navigation</li>
              <li>✓ Auto-play with pause on hover</li>
              <li>✓ Infinite loop option</li>
              <li>✓ Customizable indicators</li>
            </ul>
            <ul className="space-y-3 text-gray-300">
              <li>✓ Previous/Next arrows</li>
              <li>✓ Responsive breakpoints</li>
              <li>✓ Custom slide content</li>
              <li>✓ Smooth animations</li>
              <li>✓ Accessibility support</li>
              <li>✓ TypeScript support</li>
            </ul>
          </div>
        </section>

        <div className="h-32" />
      </div>
    </div>
  );
}
