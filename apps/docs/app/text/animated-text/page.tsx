'use client';

import { AnimatedText } from '@tuel/components';
import { useState } from 'react';
import Link from 'next/link';

const variants = ['split', 'scramble', 'wave', 'typewriter', 'fade', 'slide', 'glitch'] as const;

export default function AnimatedTextPage() {
  const [variant, setVariant] = useState<typeof variants[number]>('split');
  const [duration, setDuration] = useState(1);
  const [stagger, setStagger] = useState(0.05);
  const [replay, setReplay] = useState(0);

  const triggerReplay = () => {
    setReplay(prev => prev + 1);
  };

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
          <h1 className="text-5xl font-bold text-white mb-4">Animated Text Effects</h1>
          <p className="text-xl text-gray-300">
            Split, scramble, wave, typewriter, and more text animations
          </p>
        </header>

        {/* Controls */}
        <section className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-white mb-6">Animation Controls</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                min="0.3"
                max="3"
                step="0.1"
                value={duration}
                onChange={(e) => setDuration(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-white mb-2">Stagger: {stagger}s</label>
              <input
                type="range"
                min="0"
                max="0.2"
                step="0.01"
                value={stagger}
                onChange={(e) => setStagger(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <button
                onClick={triggerReplay}
                className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-colors"
              >
                Replay Animation
              </button>
            </div>
          </div>
        </section>

        {/* Demo Sections */}
        <section className="space-y-24">
          {/* Main Demo */}
          <div className="text-center">
            <AnimatedText
              key={`main-${variant}-${replay}`}
              variant={variant}
              duration={duration}
              stagger={stagger}
              className="text-6xl font-bold text-white mb-8"
            >
              Animated Text Magic
            </AnimatedText>
            <AnimatedText
              key={`sub-${variant}-${replay}`}
              variant={variant}
              duration={duration}
              stagger={stagger}
              delay={0.3}
              className="text-2xl text-gray-300"
            >
              Watch how text comes to life with beautiful animations
            </AnimatedText>
          </div>

          {/* All Variants Showcase */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-8">All Animation Variants</h2>
            <div className="space-y-8">
              {variants.map((v) => (
                <div key={v} className="bg-white/10 backdrop-blur-lg rounded-xl p-8">
                  <h3 className="text-xl text-purple-300 mb-4">{v.toUpperCase()}</h3>
                  <AnimatedText
                    key={`variant-${v}-${replay}`}
                    variant={v}
                    duration={1.5}
                    stagger={0.05}
                    className="text-4xl font-bold text-white"
                  >
                    {v === 'split' && 'Split characters animate individually'}
                    {v === 'scramble' && 'Scramble effect reveals text randomly'}
                    {v === 'wave' && 'Wave animation flows through text'}
                    {v === 'typewriter' && 'Typewriter effect types out text'}
                    {v === 'fade' && 'Fade in animation for smooth entrance'}
                    {v === 'slide' && 'Slide animation brings text from side'}
                    {v === 'glitch' && 'Glitch effect for digital aesthetic'}
                  </AnimatedText>
                </div>
              ))}
            </div>
          </div>

          {/* Multi-line Poetry */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-8">Multi-line Poetry</h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {[
                'In the realm of code and design,',
                'Where pixels dance and colors align,',
                'Animations breathe life into the screen,',
                'Creating magic that must be seen.',
              ].map((line, i) => (
                <AnimatedText
                  key={`poetry-${i}-${replay}`}
                  variant="wave"
                  duration={1}
                  stagger={0.03}
                  delay={i * 0.3}
                  className="text-3xl text-white text-center"
                >
                  {line}
                </AnimatedText>
              ))}
            </div>
          </div>

          {/* Word by Word */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-8">Word Animation</h2>
            <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-2xl p-12">
              <AnimatedText
                key={`words-${replay}`}
                variant="split"
                duration={0.8}
                stagger={0.1}
                splitBy="words"
                className="text-4xl font-bold text-white leading-relaxed"
              >
                Each word appears one by one creating a dramatic entrance effect perfect for headlines
              </AnimatedText>
            </div>
          </div>

          {/* Glitch Effect */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-8">Glitch Aesthetic</h2>
            <div className="space-y-6 text-center">
              <AnimatedText
                key={`glitch1-${replay}`}
                variant="glitch"
                duration={2}
                className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-400"
              >
                CYBER PUNK
              </AnimatedText>
              <AnimatedText
                key={`glitch2-${replay}`}
                variant="glitch"
                duration={2}
                delay={0.2}
                className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-yellow-400"
              >
                DIGITAL DREAMS
              </AnimatedText>
              <AnimatedText
                key={`glitch3-${replay}`}
                variant="glitch"
                duration={2}
                delay={0.4}
                className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400"
              >
                FUTURE VISION
              </AnimatedText>
            </div>
          </div>

          {/* Typewriter Terminal */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-8">Terminal Typewriter</h2>
            <div className="bg-black rounded-xl p-8 font-mono">
              <AnimatedText
                key={`terminal1-${replay}`}
                variant="typewriter"
                duration={2}
                className="text-green-400 text-xl mb-2"
              >
                $ npm install @tuel/components
              </AnimatedText>
              <AnimatedText
                key={`terminal2-${replay}`}
                variant="typewriter"
                duration={2}
                delay={2.5}
                className="text-green-400 text-xl mb-2"
              >
                $ importing components...
              </AnimatedText>
              <AnimatedText
                key={`terminal3-${replay}`}
                variant="typewriter"
                duration={1.5}
                delay={5}
                className="text-green-400 text-xl"
              >
                ✓ Ready to animate!
              </AnimatedText>
            </div>
          </div>

          {/* Scramble Passwords */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-8">Scramble Reveal</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                'SECRET_KEY_2024',
                'ENCRYPTED_DATA',
                'SECURE_TOKEN_XYZ',
                'PRIVATE_ACCESS',
              ].map((text, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-lg rounded-lg p-6">
                  <AnimatedText
                    key={`scramble-${i}-${replay}`}
                    variant="scramble"
                    duration={2}
                    delay={i * 0.3}
                    className="text-2xl font-mono text-cyan-400"
                  >
                    {text}
                  </AnimatedText>
                </div>
              ))}
            </div>
          </div>

          {/* Marketing Headlines */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-8">Marketing Headlines</h2>
            <div className="space-y-12">
              <div className="text-center">
                <AnimatedText
                  key={`headline1-${replay}`}
                  variant="slide"
                  duration={1}
                  className="text-5xl font-bold text-white mb-4"
                >
                  Build Faster
                </AnimatedText>
                <AnimatedText
                  key={`headline2-${replay}`}
                  variant="fade"
                  duration={1}
                  delay={0.5}
                  className="text-3xl text-gray-300"
                >
                  Ship with confidence
                </AnimatedText>
              </div>

              <div className="text-center">
                <AnimatedText
                  key={`headline3-${replay}`}
                  variant="wave"
                  duration={1.5}
                  stagger={0.05}
                  className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text"
                >
                  Premium Animations
                </AnimatedText>
              </div>
            </div>
          </div>
        </section>

        <div className="h-32" />
      </div>
    </div>
  );
}