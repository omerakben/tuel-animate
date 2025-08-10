'use client';

import {
  AnimatedMenu,
  // UI Components
  Carousel,
  HeroSection,
  HoverDistortion,
  ImageGallery,
  ImageTrail,
  InfiniteMarquee,
  // Page Transitions
  PageTransition,
  ParallaxLayer,
  ParallaxScroll,
  // Canvas Components
  ParticleField,
  RevealOnScroll,
  StickyCards,
  WaveCanvas,
} from '@tuel/components';
import dynamic from 'next/dynamic';
import { Suspense, useState } from 'react';

// Import mock components for React 19 compatibility
import {
  AnimatedText,
  FloatingObjects,
  MorphingShapes,
  NoiseField,
  ParticleWave,
} from '../../components/DisabledComponents';

// Lazy load heavy 3D components and SSR-incompatible components
// const FloatingObjects = dynamic(
//   () => import('@tuel/components').then(mod => mod.FloatingObjects),
//   { ssr: false }
// );

const ScrollMinimapDynamic = dynamic(
  () => import('@tuel/components').then((mod) => mod.ScrollMinimap),
  { ssr: false }
);

// Disabled Three.js components - import as mocks instead
// const ParticleWave = dynamic(
//   () => import('@tuel/components').then(mod => mod.ParticleWave),
//   { ssr: false }
// );

// const MorphingShapes = dynamic(
//   () => import('@tuel/components').then(mod => mod.MorphingShapes),
//   { ssr: false }
// );

const ParticleText = dynamic(() => import('@tuel/components').then((mod) => mod.ParticleText), {
  ssr: false,
});

export default function TestPage() {
  const [activeSection, setActiveSection] = useState('hero');

  // Sample data
  const carouselSlides = [
    {
      id: '1',
      title: 'Slide 1',
      description: 'First slide',
      content: (
        <div className="p-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
          Slide 1 Content
        </div>
      ),
    },
    {
      id: '2',
      title: 'Slide 2',
      description: 'Second slide',
      content: (
        <div className="p-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg">
          Slide 2 Content
        </div>
      ),
    },
    {
      id: '3',
      title: 'Slide 3',
      description: 'Third slide',
      content: (
        <div className="p-8 bg-gradient-to-r from-green-500 to-yellow-500 rounded-lg">
          Slide 3 Content
        </div>
      ),
    },
  ];

  const stickyCards = [
    {
      id: '1',
      content: <div className="p-8 text-white">Card 1 - Scroll to see effect</div>,
      backgroundColor: '#8b5cf6',
    },
    {
      id: '2',
      content: <div className="p-8 text-white">Card 2 - Stacking animation</div>,
      backgroundColor: '#3b82f6',
    },
    {
      id: '3',
      content: <div className="p-8 text-white">Card 3 - Beautiful transitions</div>,
      backgroundColor: '#ec4899',
    },
  ];

  const menuItems = [
    { id: '1', label: 'Home', href: '#hero' },
    { id: '2', label: 'Features', href: '#features' },
    { id: '3', label: 'Gallery', href: '#gallery' },
    { id: '4', label: 'Contact', href: '#contact' },
  ];

  const galleryImages = [
    {
      id: '1',
      src: 'https://picsum.photos/400/300?random=1',
      alt: 'Image 1',
      caption: 'Beautiful landscape',
    },
    {
      id: '2',
      src: 'https://picsum.photos/400/300?random=2',
      alt: 'Image 2',
      caption: 'Urban architecture',
    },
    {
      id: '3',
      src: 'https://picsum.photos/400/300?random=3',
      alt: 'Image 3',
      caption: 'Nature close-up',
    },
    {
      id: '4',
      src: 'https://picsum.photos/400/300?random=4',
      alt: 'Image 4',
      caption: 'Abstract art',
    },
    {
      id: '5',
      src: 'https://picsum.photos/400/300?random=5',
      alt: 'Image 5',
      caption: 'City lights',
    },
    {
      id: '6',
      src: 'https://picsum.photos/400/300?random=6',
      alt: 'Image 6',
      caption: 'Mountain view',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Minimap */}
      <ScrollMinimapDynamic
        sections={[
          { id: 'hero', label: 'Hero', color: '#8b5cf6' },
          { id: 'text-effects', label: 'Text', color: '#3b82f6' },
          { id: 'carousel-section', label: 'Carousel', color: '#10b981' },
          { id: 'particles', label: 'Particles', color: '#ec4899' },
          { id: 'three-d', label: '3D', color: '#f59e0b' },
          { id: 'gallery', label: 'Gallery', color: '#ef4444' },
        ]}
        position="right"
        showLabels={true}
        autoHide={false}
      />

      {/* Menu */}
      <AnimatedMenu items={menuItems} variant="slide" position="left" />

      {/* Hero Section */}
      <section id="hero" className="relative h-screen">
        <HeroSection
          title="Tuel Animate"
          subtitle="60+ Production-Ready Animation Components"
          backgroundImage="https://picsum.photos/1920/1080?random=hero"
          overlay={true}
          overlayOpacity={0.6}
          parallax={true}
          reveal="fade-up"
          ctaButtons={[
            { label: 'View Components', href: '#text-effects', variant: 'primary' },
            { label: 'Documentation', href: '/docs', variant: 'secondary' },
          ]}
        />

        {/* Infinite Marquee */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 backdrop-blur py-4">
          <InfiniteMarquee speed={50} pauseOnHover>
            <span className="mx-8">React</span>
            <span className="mx-8">TypeScript</span>
            <span className="mx-8">GSAP</span>
            <span className="mx-8">Framer Motion</span>
            <span className="mx-8">Three.js</span>
            <span className="mx-8">WebGL</span>
            <span className="mx-8">Canvas</span>
            <span className="mx-8">SSR Safe</span>
          </InfiniteMarquee>
        </div>
      </section>

      {/* Text Effects Section */}
      <section
        id="text-effects"
        className="min-h-screen p-20 flex flex-col justify-center items-center space-y-16"
      >
        <RevealOnScroll animation="fade-up">
          <AnimatedText
            text="Amazing Text Animations"
            variant="split"
            className="text-6xl font-bold"
            duration={1}
            stagger={0.05}
          />
        </RevealOnScroll>

        <RevealOnScroll animation="fade-up" delay={0.2}>
          <AnimatedText
            text="Scramble Effect Demo"
            variant="scramble"
            className="text-4xl"
            duration={2}
          />
        </RevealOnScroll>

        <RevealOnScroll animation="fade-up" delay={0.4}>
          <AnimatedText
            text="Wave Animation Here"
            variant="wave"
            className="text-4xl"
            waveHeight={20}
          />
        </RevealOnScroll>

        <Suspense fallback={<div>Loading...</div>}>
          <div className="h-96 w-full">
            <ParticleText
              text="PARTICLES"
              font="bold 60px Arial"
              particleSize={2}
              hover={true}
              wave={true}
              interactive={true}
            />
          </div>
        </Suspense>
      </section>

      {/* Carousel Section */}
      <section id="carousel-section" className="min-h-screen p-20">
        <RevealOnScroll animation="fade-up">
          <h2 className="text-4xl font-bold mb-12 text-center">Advanced Carousel</h2>
        </RevealOnScroll>

        <div className="h-96">
          <Carousel
            slides={carouselSlides}
            variant="3d"
            autoPlay={true}
            autoPlayInterval={4000}
            showIndicators={true}
            showArrows={true}
          />
        </div>
      </section>

      {/* Sticky Cards */}
      <section className="min-h-screen">
        <StickyCards cards={stickyCards} variant="scale" spacing={100} />
      </section>

      {/* Particles Section */}
      <section id="particles" className="min-h-screen relative">
        <div className="absolute inset-0">
          <ParticleField
            count={150}
            colors={['#8b5cf6', '#3b82f6', '#ec4899']}
            connectionDistance={100}
            mouseInteraction={true}
          />
        </div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <h2 className="text-6xl font-bold">Interactive Particles</h2>
        </div>
      </section>

      {/* Wave Canvas */}
      <section className="h-screen relative">
        <div className="absolute inset-0">
          <WaveCanvas
            waves={[
              {
                amplitude: 50,
                frequency: 0.01,
                speed: 0.02,
                phase: 0,
                color: '#3b82f6',
                lineWidth: 2,
                opacity: 1,
              },
              {
                amplitude: 30,
                frequency: 0.02,
                speed: 0.03,
                phase: Math.PI / 4,
                color: '#8b5cf6',
                lineWidth: 2,
                opacity: 0.8,
              },
            ]}
            gradient={true}
            interactive={true}
            glow={true}
          />
        </div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <h2 className="text-6xl font-bold">Wave Animation</h2>
        </div>
      </section>

      {/* Noise Field */}
      <section className="h-screen relative">
        <div className="absolute inset-0">
          <NoiseField
            particleCount={800}
            colorMode="rainbow"
            fadeTrails={true}
            interactive={true}
            flowField={true}
          />
        </div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <h2 className="text-6xl font-bold">Flow Field</h2>
        </div>
      </section>

      {/* 3D Section */}
      <section id="three-d" className="min-h-screen">
        <h2 className="text-4xl font-bold text-center py-12">3D Animations</h2>

        <Suspense
          fallback={<div className="h-96 flex items-center justify-center">Loading 3D...</div>}
        >
          <div className="h-96">
            <FloatingObjects
              objects={[
                { position: [-2, 0, 0], shape: 'sphere', color: '#8b5cf6', distort: 0.3 },
                { position: [0, 0, 0], shape: 'box', color: '#3b82f6', distort: 0.5 },
                { position: [2, 0, 0], shape: 'torus', color: '#ec4899', distort: 0.4 },
              ]}
              environment="sunset"
              fog={true}
              shadows={true}
            />
          </div>
        </Suspense>

        <Suspense
          fallback={<div className="h-96 flex items-center justify-center">Loading 3D...</div>}
        >
          <div className="h-96 mt-12">
            <ParticleWave
              particleCount={5000}
              color1="#8b5cf6"
              color2="#3b82f6"
              waveAmplitude={2}
            />
          </div>
        </Suspense>

        <Suspense
          fallback={<div className="h-96 flex items-center justify-center">Loading 3D...</div>}
        >
          <div className="h-96 mt-12">
            <MorphingShapes
              shapes={[
                {
                  position: [-3, 0, 0],
                  color: '#8b5cf6',
                  morphTargets: ['sphere', 'box', 'torus'],
                },
                {
                  position: [0, 0, 0],
                  color: '#3b82f6',
                  morphTargets: ['box', 'dodecahedron', 'sphere'],
                },
                {
                  position: [3, 0, 0],
                  color: '#ec4899',
                  morphTargets: ['cone', 'octahedron', 'torus'],
                },
              ]}
              enableOrbitControls={true}
              autoRotate={true}
            />
          </div>
        </Suspense>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="min-h-screen p-20">
        <h2 className="text-4xl font-bold mb-12 text-center">Image Gallery</h2>
        <ImageGallery
          images={galleryImages}
          layout="grid"
          columns={3}
          gap={20}
          hoverEffect="zoom"
        />
      </section>

      {/* Hover Distortion */}
      <section className="min-h-screen p-20">
        <h2 className="text-4xl font-bold mb-12 text-center">Hover Effects</h2>
        <div className="grid grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[1, 2, 3].map((i) => (
            <div key={i} className="aspect-video">
              <HoverDistortion
                image={`https://picsum.photos/400/300?random=${i + 10}`}
                intensity={0.3}
                scale={1.1}
                rgbShift={true}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Parallax Section */}
      <section className="h-screen">
        <ParallaxScroll>
          <ParallaxLayer speed={0.5}>
            <img
              src="https://picsum.photos/1920/1080?random=bg"
              alt="Background"
              className="w-full h-full object-cover"
            />
          </ParallaxLayer>
          <ParallaxLayer speed={1} offset={0.5}>
            <div className="h-screen flex items-center justify-center">
              <h2 className="text-8xl font-bold text-white drop-shadow-2xl">Parallax Scrolling</h2>
            </div>
          </ParallaxLayer>
          <ParallaxLayer speed={1.5} offset={0.8}>
            <div className="flex justify-center">
              <div className="bg-white/10 backdrop-blur p-12 rounded-2xl">
                <p className="text-2xl">Foreground Content with Different Speed</p>
              </div>
            </div>
          </ParallaxLayer>
        </ParallaxScroll>
      </section>

      {/* Page Transition Demo */}
      <section className="min-h-screen p-20">
        <PageTransition variant="morph" duration={1.5}>
          <div className="text-center">
            <h2 className="text-6xl font-bold mb-8">Page Transitions</h2>
            <p className="text-2xl">This content appears with morph transition</p>
          </div>
        </PageTransition>
      </section>

      {/* Image Trail Effect */}
      <ImageTrail
        images={[
          'https://picsum.photos/200/200?random=trail1',
          'https://picsum.photos/200/200?random=trail2',
          'https://picsum.photos/200/200?random=trail3',
        ]}
        imageSize={{ width: 150, height: 150 }}
        enabled={true}
      />
    </div>
  );
}
