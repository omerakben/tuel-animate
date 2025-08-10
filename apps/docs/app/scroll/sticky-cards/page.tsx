'use client';

import { StickyCards } from '@tuel/components';
import Link from 'next/link';
import { useState } from 'react';

const sampleCards = [
  {
    id: '1',
    title: 'First Card',
    description: 'This is the first card that sticks and transforms as you scroll.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&h=300&fit=crop',
    backgroundColor: '#6366f1',
    content: (
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-8 h-96 flex flex-col justify-center items-center text-white">
        <h3 className="text-3xl font-bold mb-4">First Card</h3>
        <p className="text-center">
          This is the first card that sticks and transforms as you scroll.
        </p>
      </div>
    ),
  },
  {
    id: '2',
    title: 'Second Card',
    description: 'The second card reveals with scaling and opacity effects.',
    image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&h=300&fit=crop',
    backgroundColor: '#0ea5e9',
    content: (
      <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl p-8 h-96 flex flex-col justify-center items-center text-white">
        <h3 className="text-3xl font-bold mb-4">Second Card</h3>
        <p className="text-center">The second card reveals with scaling and opacity effects.</p>
      </div>
    ),
  },
  {
    id: '3',
    title: 'Third Card',
    description: 'Third card shows advanced stacking animations.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&h=300&fit=crop',
    backgroundColor: '#06b6d4',
    content: (
      <div className="bg-gradient-to-br from-cyan-600 to-green-600 rounded-xl p-8 h-96 flex flex-col justify-center items-center text-white">
        <h3 className="text-3xl font-bold mb-4">Third Card</h3>
        <p className="text-center">Third card shows advanced stacking animations.</p>
      </div>
    ),
  },
  {
    id: '4',
    title: 'Fourth Card',
    description: 'The final card demonstrates smooth transform transitions.',
    image: 'https://images.unsplash.com/photo-1514359511149-59ea9c6da4a6?w=500&h=300&fit=crop',
    backgroundColor: '#10b981',
    content: (
      <div className="bg-gradient-to-br from-green-600 to-yellow-600 rounded-xl p-8 h-96 flex flex-col justify-center items-center text-white">
        <h3 className="text-3xl font-bold mb-4">Fourth Card</h3>
        <p className="text-center">The final card demonstrates smooth transform transitions.</p>
      </div>
    ),
  },
];

export default function StickyCardsPage() {
  const [spacing, setSpacing] = useState(100);
  const [overlap, setOverlap] = useState(40);
  const [scaleEffect, setScaleEffect] = useState(true);
  const [rotateEffect, setRotateEffect] = useState(false);
  const [fadeEffect, setFadeEffect] = useState(false);

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
          <h1 className="text-5xl font-bold text-white mb-4">Sticky Cards</h1>
          <p className="text-xl text-gray-300">
            Cards that stick and transform with scaling, fading, and rotation effects as you scroll.
          </p>
        </header>

        {/* Controls */}
        <section className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Animation Controls</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-white mb-2">Spacing: {spacing}px</label>
              <input
                type="range"
                min="50"
                max="300"
                step="10"
                value={spacing}
                onChange={(e) => setSpacing(parseInt(e.target.value))}
                className="w-full"
                title="Spacing between cards"
              />
            </div>

            <div>
              <label className="block text-white mb-2">Overlap: {overlap}px</label>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={overlap}
                onChange={(e) => setOverlap(parseInt(e.target.value))}
                className="w-full"
                title="Card overlap amount"
              />
            </div>

            <div>
              <label className="flex items-center text-white">
                <input
                  type="checkbox"
                  checked={scaleEffect}
                  onChange={(e) => setScaleEffect(e.target.checked)}
                  className="mr-2"
                  title="Enable scale effect"
                />
                Scale Effect
              </label>
            </div>

            <div>
              <label className="flex items-center text-white">
                <input
                  type="checkbox"
                  checked={rotateEffect}
                  onChange={(e) => setRotateEffect(e.target.checked)}
                  className="mr-2"
                  title="Enable rotate effect"
                />
                Rotate Effect
              </label>
            </div>

            <div>
              <label className="flex items-center text-white">
                <input
                  type="checkbox"
                  checked={fadeEffect}
                  onChange={(e) => setFadeEffect(e.target.checked)}
                  className="mr-2"
                  title="Enable fade effect"
                />
                Fade Effect
              </label>
            </div>
          </div>
        </section>

        {/* Demo */}
        <section className="relative">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Sticky Cards Demo</h2>

          <StickyCards
            cards={sampleCards}
            className=""
            cardClassName=""
            spacing={spacing}
            overlap={overlap}
            scaleEffect={scaleEffect}
            rotateEffect={rotateEffect}
            fadeEffect={fadeEffect}
          />
        </section>

        {/* Code Example */}
        <section className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Code Example</h2>
          <pre className="bg-black/50 rounded-lg p-4 overflow-x-auto">
            <code className="text-green-300 text-sm">
              {`import { StickyCards } from '@tuel/components';

const cards = [
  {
    id: "1",
    title: "Card Title",
    content: <div>Card content...</div>,
    backgroundColor: "#6366f1"
  },
  // ... more cards
];

<StickyCards
  cards={cards}
  className=""
  cardClassName=""
  spacing={${spacing}}
  overlap={${overlap}}
  scaleEffect={${scaleEffect}}
  rotateEffect={${rotateEffect}}
  fadeEffect={${fadeEffect}}
/>`}
            </code>
          </pre>
        </section>

        {/* Props Documentation */}
        <section className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Props & Configuration</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-white">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left p-2">Prop</th>
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Default</th>
                  <th className="text-left p-2">Description</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/10">
                  <td className="p-2 font-mono text-purple-300">cards</td>
                  <td className="p-2">StickyCard[]</td>
                  <td className="p-2">required</td>
                  <td className="p-2">Array of card objects to display</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-2 font-mono text-purple-300">className</td>
                  <td className="p-2">string</td>
                  <td className="p-2">""</td>
                  <td className="p-2">CSS class for the container</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-2 font-mono text-purple-300">cardClassName</td>
                  <td className="p-2">string</td>
                  <td className="p-2">""</td>
                  <td className="p-2">CSS class for individual cards</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-2 font-mono text-purple-300">spacing</td>
                  <td className="p-2">number</td>
                  <td className="p-2">100</td>
                  <td className="p-2">Spacing between cards in pixels</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-2 font-mono text-purple-300">overlap</td>
                  <td className="p-2">number</td>
                  <td className="p-2">40</td>
                  <td className="p-2">Card overlap amount in pixels</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-2 font-mono text-purple-300">scaleEffect</td>
                  <td className="p-2">boolean</td>
                  <td className="p-2">true</td>
                  <td className="p-2">Enable scaling effect on scroll</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="p-2 font-mono text-purple-300">rotateEffect</td>
                  <td className="p-2">boolean</td>
                  <td className="p-2">false</td>
                  <td className="p-2">Enable rotation effect on scroll</td>
                </tr>
                <tr>
                  <td className="p-2 font-mono text-purple-300">fadeEffect</td>
                  <td className="p-2">boolean</td>
                  <td className="p-2">false</td>
                  <td className="p-2">Enable fade effect on scroll</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
