'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function ScrollFramePage() {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [animationSpeed, setAnimationSpeed] = useState(1);
  const [frameCount, setFrameCount] = useState(24);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [triggerPoint, setTriggerPoint] = useState(0.1);

  const containerRef = useRef<HTMLDivElement>(null);
  const frameElements = useRef<HTMLDivElement[]>([]);

  // Simulate scroll-triggered frame animation
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const elementTop = containerRef.current.offsetTop;
      const elementHeight = containerRef.current.offsetHeight;

      // Calculate progress through the animation area
      const start = elementTop - windowHeight * (1 - triggerPoint);
      const end = elementTop + elementHeight;
      const progress = Math.max(0, Math.min(1, (scrollTop - start) / (end - start)));

      // Calculate frame based on scroll progress
      const targetFrame = Math.floor(progress * (frameCount - 1));
      setCurrentFrame(targetFrame);
    };

    if (isAutoPlay) {
      window.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial call
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [frameCount, triggerPoint, isAutoPlay]);

  // Auto-play animation when not scroll-driven
  useEffect(() => {
    if (!isAutoPlay) {
      const interval = setInterval(
        () => {
          setCurrentFrame((prev) => (prev + 1) % frameCount);
        },
        1000 / (animationSpeed * 10)
      );

      return () => clearInterval(interval);
    }
  }, [isAutoPlay, animationSpeed, frameCount]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center text-blue-400 hover:text-blue-300 mb-8">
          ← Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Scroll Frame Animation</h1>
          <p className="text-gray-300 text-lg">
            Frame-by-frame animations triggered by scroll position. Perfect for storytelling and
            product reveals.
          </p>
        </div>

        {/* Animation Controls */}
        <div className="mb-12 p-6 bg-gray-800 rounded-lg">
          <h2 className="text-2xl font-semibold mb-6">Animation Controls</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Frame Count: {frameCount}</label>
              <input
                type="range"
                min="12"
                max="60"
                value={frameCount}
                onChange={(e) => setFrameCount(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Animation Speed: {animationSpeed}x
              </label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={animationSpeed}
                onChange={(e) => setAnimationSpeed(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Trigger Point: {triggerPoint}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={triggerPoint}
                onChange={(e) => setTriggerPoint(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="flex items-center">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAutoPlay}
                  onChange={(e) => setIsAutoPlay(e.target.checked)}
                  className="mr-3 w-4 h-4"
                />
                Scroll-Driven Animation
              </label>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-400">
            Current Frame: {currentFrame + 1} / {frameCount}
          </div>
        </div>

        {/* Frame Animation Demo */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Interactive Frame Animation</h2>
          <div
            ref={containerRef}
            className="relative h-[150vh] bg-gradient-to-b from-purple-900/20 to-blue-900/20 rounded-lg overflow-hidden"
          >
            <div className="sticky top-1/2 transform -translate-y-1/2">
              <div className="flex justify-center items-center h-96">
                {/* Animated Element - Changes based on frame */}
                <div
                  className="relative w-64 h-64 transition-all duration-100"
                  style={{
                    transform: `
                      rotate(${currentFrame * (360 / frameCount)}deg)
                      scale(${0.5 + (currentFrame / frameCount) * 0.8})
                    `,
                    background: `linear-gradient(${currentFrame * (360 / frameCount)}deg,
                      hsl(${(currentFrame * 360) / frameCount}, 70%, 50%),
                      hsl(${((currentFrame * 360) / frameCount + 120) % 360}, 70%, 70%))`,
                  }}
                >
                  <div className="absolute inset-4 bg-white/10 rounded-lg backdrop-blur-sm">
                    <div className="flex items-center justify-center h-full text-white font-bold text-xl">
                      Frame {currentFrame + 1}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(frameCount, 20) }).map((_, i) => {
                  const frameIndex = Math.floor((i / 20) * frameCount);
                  return (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        frameIndex <= currentFrame ? 'bg-blue-400' : 'bg-gray-600'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Multiple Animation Examples */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Animation Variants</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Rotation Animation */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Rotation</h3>
              <div className="h-32 flex items-center justify-center">
                <div
                  className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg"
                  style={{
                    transform: `rotate(${currentFrame * 15}deg)`,
                  }}
                />
              </div>
              <p className="text-sm text-gray-400 mt-2">Rotates 15° per frame</p>
            </div>

            {/* Scale Animation */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Scale</h3>
              <div className="h-32 flex items-center justify-center">
                <div
                  className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
                  style={{
                    transform: `scale(${0.5 + (Math.sin((currentFrame / frameCount) * Math.PI * 2) + 1) * 0.5})`,
                  }}
                />
              </div>
              <p className="text-sm text-gray-400 mt-2">Sine wave scaling</p>
            </div>

            {/* Position Animation */}
            <div className="bg-gray-800 p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Position</h3>
              <div className="h-32 flex items-center justify-center relative overflow-hidden">
                <div
                  className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full absolute"
                  style={{
                    left: `${(currentFrame / frameCount) * 100}%`,
                    transform: 'translateX(-50%)',
                  }}
                />
              </div>
              <p className="text-sm text-gray-400 mt-2">Horizontal movement</p>
            </div>
          </div>
        </div>

        {/* Technical Implementation */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Implementation Example</h2>
          <div className="bg-gray-900 p-6 rounded-lg overflow-x-auto">
            <pre className="text-sm text-gray-300">
              {`import { useEffect, useState } from 'react';

const ScrollFrameAnimation = ({ frameCount = 24, triggerPoint = 0.1 }) => {
  const [currentFrame, setCurrentFrame] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const elementTop = containerRef.current.offsetTop;
      const elementHeight = containerRef.current.offsetHeight;

      // Calculate progress through animation area
      const start = elementTop - windowHeight * (1 - triggerPoint);
      const end = elementTop + elementHeight;
      const progress = Math.max(0, Math.min(1, (scrollTop - start) / (end - start)));

      // Map progress to frame
      const frame = Math.floor(progress * (frameCount - 1));
      setCurrentFrame(frame);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [frameCount, triggerPoint]);

  return (
    <div style={{
      transform: \`rotate(\${currentFrame * (360 / frameCount)}deg)\`
    }}>
      Frame {currentFrame + 1}
    </div>
  );
};`}
            </pre>
          </div>
        </div>

        {/* Features & Use Cases */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Features & Use Cases</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Scroll-driven frame progression
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Configurable frame count
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Custom trigger points
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Smooth frame transitions
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Performance optimized
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Mobile responsive
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Use Cases</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center">
                  <span className="text-blue-400 mr-2">→</span>
                  Product reveal animations
                </li>
                <li className="flex items-center">
                  <span className="text-blue-400 mr-2">→</span>
                  Storytelling sequences
                </li>
                <li className="flex items-center">
                  <span className="text-blue-400 mr-2">→</span>
                  Loading progress indicators
                </li>
                <li className="flex items-center">
                  <span className="text-blue-400 mr-2">→</span>
                  Interactive timelines
                </li>
                <li className="flex items-center">
                  <span className="text-blue-400 mr-2">→</span>
                  Educational content
                </li>
                <li className="flex items-center">
                  <span className="text-blue-400 mr-2">→</span>
                  Portfolio showcases
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="text-center text-gray-400 mb-12">
          <p>Scroll up and down to see the frame animation in action!</p>
          <div className="mt-4">
            <div className="inline-block animate-bounce">↕️</div>
          </div>
        </div>
      </div>
    </div>
  );
}
