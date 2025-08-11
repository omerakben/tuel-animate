# Tuel Animate - Component Examples

Complete usage examples for all 60+ animation components.

## Table of Contents

- [Installation](#installation)
- [Scroll Animations](#scroll-animations)
- [Page Transitions](#page-transitions)
- [Text Effects](#text-effects)
- [3D/WebGL](#3dwebgl)
- [Particles & Canvas](#particles--canvas)
- [UI Components](#ui-components)
- [Hover Effects](#hover-effects)

## Installation

```bash
npm install @tuel/components
```

For Next.js projects:

```jsx
// next.config.js
module.exports = {
  transpilePackages: ['@tuel/components', '@tuel/gsap', '@tuel/three'],
};
```

## Scroll Animations

### ScrollFrameAnimation

Frame-by-frame animations triggered by scroll.

```tsx
import { ScrollFrameAnimation } from '@tuel/components';

function FrameScroll() {
  return (
    <ScrollFrameAnimation
      frameCount={120}
      framePath="/sequences/frame-{index}.jpg"
      startFrame={1}
      pinContainer={true}
      scrollSpeed={1}
      preloadFrames={true}
      onProgress={(progress) => console.log(`Progress: ${progress}%`)}
    />
  );
}
```

### ParallaxScroll

Multi-layer parallax scrolling effects.

```tsx
import { ParallaxScroll, ParallaxLayer } from '@tuel/components';

function ParallaxSection() {
  return (
    <ParallaxScroll>
      <ParallaxLayer speed={0.5} offset={0}>
        <img src="/bg.jpg" alt="Background" className="w-full" />
      </ParallaxLayer>
      <ParallaxLayer speed={1} offset={0.2}>
        <h1 className="text-6xl font-bold">Parallax Title</h1>
      </ParallaxLayer>
      <ParallaxLayer speed={1.5} offset={0.5}>
        <div className="p-8 bg-white rounded-lg">
          <p>Foreground content</p>
        </div>
      </ParallaxLayer>
    </ParallaxScroll>
  );
}
```

### StickyCards

Stacking cards that stick and transform on scroll.

```tsx
import { StickyCards } from '@tuel/components';

function CardStack() {
  const cards = [
    { id: '1', content: <div>Card 1 Content</div>, backgroundColor: '#8b5cf6' },
    { id: '2', content: <div>Card 2 Content</div>, backgroundColor: '#3b82f6' },
    { id: '3', content: <div>Card 3 Content</div>, backgroundColor: '#ec4899' },
  ];

  return (
    <StickyCards
      cards={cards}
      variant="scale" // or 'fade', 'rotate'
      spacing={100}
      scaleOffset={0.05}
      fadeOffset={0.2}
    />
  );
}
```

### ScrollMinimap

Navigation minimap for long pages.

```tsx
import { ScrollMinimap } from '@tuel/components';

function PageWithMinimap() {
  return (
    <>
      <ScrollMinimap
        position="right"
        sections={[
          { id: 'intro', label: 'Introduction', color: '#8b5cf6' },
          { id: 'features', label: 'Features', color: '#3b82f6' },
          { id: 'pricing', label: 'Pricing', color: '#10b981' },
          { id: 'contact', label: 'Contact', color: '#ec4899' },
        ]}
        showLabels={true}
        autoHide={true}
        hideDelay={2000}
      />

      <section id="intro">...</section>
      <section id="features">...</section>
      <section id="pricing">...</section>
      <section id="contact">...</section>
    </>
  );
}
```

## Page Transitions

### PageTransition

Animated page reveals with multiple variants.

```tsx
import { PageTransition } from '@tuel/components';

function AnimatedPage() {
  return (
    <PageTransition
      variant="morph" // 'fade', 'slide', 'scale', 'rotate', 'blur', 'clip', 'mask', 'split', 'curtain'
      duration={1.5}
      delay={0.2}
      direction="up"
      backgroundColor="bg-black"
      onComplete={() => console.log('Transition complete')}
    >
      <div>Your page content</div>
    </PageTransition>
  );
}
```

### RouteTransition (Next.js)

Smooth transitions between routes.

```tsx
import { RouteTransition } from '@tuel/components';

// In _app.tsx
function MyApp({ Component, pageProps }) {
  return (
    <RouteTransition
      variant="slide" // 'fade', 'push', 'reveal', 'distort'
      duration={0.6}
      backgroundColor="bg-black"
    >
      <Component {...pageProps} />
    </RouteTransition>
  );
}
```

### SmoothScroll

Lenis-like smooth scrolling.

```tsx
import { SmoothScroll } from '@tuel/components';

function SmoothPage() {
  return (
    <SmoothScroll
      enabled={true}
      lerp={0.1}
      duration={1.2}
      orientation="vertical"
      smooth={true}
      smoothTouch={false}
      touchMultiplier={2}
      onScroll={({ scroll, progress, velocity }) => {
        console.log(`Scroll: ${scroll}px, Progress: ${progress}%, Velocity: ${velocity}`);
      }}
    >
      <div>Your scrollable content</div>
    </SmoothScroll>
  );
}
```

### ImageTrail

Mouse trail effect with images.

```tsx
import { ImageTrail } from '@tuel/components';

function MouseTrail() {
  return (
    <ImageTrail
      images={['/trail/img1.jpg', '/trail/img2.jpg', '/trail/img3.jpg']}
      imageSize={{ width: 200, height: 200 }}
      maxImages={10}
      threshold={100}
      fadeOutDuration={1000}
      animationDuration={750}
      opacity={0.9}
      scale={1.1}
      rotation={15}
      enabled={true}
    />
  );
}
```

## Text Effects

### AnimatedText

Text animations with multiple variants.

```tsx
import { AnimatedText } from '@tuel/components';

function TextAnimations() {
  return (
    <>
      <AnimatedText
        text="Split Text Animation"
        variant="split" // 'fade', 'slide', 'wave', 'scramble', 'typewriter', 'gradient'
        duration={1}
        stagger={0.05}
        className="text-6xl font-bold"
      />

      <AnimatedText text="Scramble Effect" variant="scramble" duration={2} scrambleSpeed={50} />

      <AnimatedText text="Wave Animation" variant="wave" waveHeight={20} waveSpeed={0.5} />
    </>
  );
}
```

### ParticleText

Interactive particle text effects.

```tsx
import { ParticleText } from '@tuel/components';

function ParticleTitle() {
  return (
    <ParticleText
      text="PARTICLES"
      font="bold 80px Arial"
      particleSize={2}
      particleGap={3}
      mouseRadius={150}
      mouseForce={2}
      hover={true}
      explode={true}
      wave={true}
      waveSpeed={0.002}
      waveAmplitude={20}
      interactive={true}
    />
  );
}
```

## 3D/WebGL

### FloatingObjects

3D objects with float animation.

```tsx
import { FloatingObjects } from '@tuel/components';

function Scene3D() {
  return (
    <FloatingObjects
      objects={[
        {
          position: [-2, 0, 0],
          shape: 'sphere',
          color: '#8b5cf6',
          distort: 0.3,
          floatIntensity: 1,
          rotationSpeed: 1,
        },
        {
          position: [2, 0, 0],
          shape: 'torus',
          color: '#3b82f6',
          metalness: 0.8,
          roughness: 0.2,
        },
      ]}
      environment="sunset"
      fog={true}
      shadows={true}
      backgroundColor="#1a1a2e"
    />
  );
}
```

### ParticleWave

3D particle wave animation.

```tsx
import { ParticleWave } from '@tuel/components';

function WaveScene() {
  return (
    <ParticleWave
      particleCount={10000}
      color1="#8b5cf6"
      color2="#3b82f6"
      waveAmplitude={2}
      waveFrequency={0.2}
      waveSpeed={1}
      spread={10}
      fog={true}
      cameraPosition={[0, 0, 10]}
    />
  );
}
```

### MorphingShapes

Shapes that morph between forms.

```tsx
import { MorphingShapes } from '@tuel/components';

function MorphScene() {
  return (
    <MorphingShapes
      shapes={[
        {
          position: [0, 0, 0],
          color: '#8b5cf6',
          morphTargets: ['sphere', 'box', 'torus', 'dodecahedron'],
          morphSpeed: 0.5,
          wobbleFactor: 0.3,
        },
      ]}
      enableOrbitControls={true}
      autoRotate={true}
      backgroundColor="#0a0a0a"
    />
  );
}
```

### PhantomGallery

WebGL shader-based gallery.

```tsx
import { PhantomGallery } from '@tuel/components';

function ShaderGallery() {
  const items = [
    { id: '1', image: '/img1.jpg', title: 'Project 1', year: 2024, href: '/project-1' },
    { id: '2', image: '/img2.jpg', title: 'Project 2', year: 2024, href: '/project-2' },
  ];

  return (
    <PhantomGallery
      items={items}
      cellSize={0.75}
      zoomLevel={1.25}
      lerpFactor={0.075}
      borderColor="rgba(255, 255, 255, 0.15)"
      backgroundColor="rgba(0, 0, 0, 1)"
      onItemClick={(item) => console.log('Clicked:', item)}
    />
  );
}
```

## Particles & Canvas

### ParticleField

Interactive particle system.

```tsx
import { ParticleField } from '@tuel/components';

function ParticleBackground() {
  return (
    <ParticleField
      count={200}
      minRadius={1}
      maxRadius={3}
      speed={1}
      colors={['#8b5cf6', '#3b82f6', '#ec4899']}
      connectionDistance={100}
      mouseInteraction={true}
      mouseRadius={150}
      mouseForce={0.1}
      gravity={0.01}
      bounce={true}
      shape="circle" // 'square', 'triangle', 'star'
    />
  );
}
```

### WaveCanvas

Animated wave patterns.

```tsx
import { WaveCanvas } from '@tuel/components';

function WaveBackground() {
  return (
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
      fillMode={false}
      gradient={true}
      gradientColors={['#3b82f6', '#8b5cf6', '#ec4899']}
      interactive={true}
      mouseInfluence={50}
      glow={true}
      glowIntensity={20}
    />
  );
}
```

### NoiseField

Perlin noise flow field.

```tsx
import { NoiseField } from '@tuel/components';

function FlowField() {
  return (
    <NoiseField
      particleCount={1000}
      particleSize={1}
      noiseScale={0.003}
      noiseSpeed={0.001}
      noiseStrength={1}
      fadeTrails={true}
      trailLength={0.98}
      colorMode="rainbow" // 'monochrome', 'gradient', 'custom'
      interactive={true}
      mouseRadius={150}
      flowField={true}
      turbulence={1}
    />
  );
}
```

## UI Components

### Carousel

Advanced carousel with multiple variants.

```tsx
import { Carousel } from '@tuel/components';

function ImageCarousel() {
  const slides = [
    { id: '1', image: '/slide1.jpg', title: 'Slide 1', description: 'Description 1' },
    { id: '2', image: '/slide2.jpg', title: 'Slide 2', description: 'Description 2' },
  ];

  return (
    <Carousel
      slides={slides}
      variant="3d" // 'fade', 'slide', 'scale', 'stack', 'coverflow'
      autoPlay={true}
      autoPlayInterval={5000}
      loop={true}
      showIndicators={true}
      showArrows={true}
      draggable={true}
      onSlideChange={(index) => console.log('Slide:', index)}
    />
  );
}
```

### AnimatedMenu

Menu with animations.

```tsx
import { AnimatedMenu } from '@tuel/components';

function Navigation() {
  const menuItems = [
    { id: '1', label: 'Home', href: '/' },
    { id: '2', label: 'About', href: '/about' },
    { id: '3', label: 'Services', href: '/services' },
    { id: '4', label: 'Contact', href: '/contact' },
  ];

  return (
    <AnimatedMenu
      items={menuItems}
      variant="slide" // 'overlay', 'push', 'morph', 'circular'
      position="left"
      duration={0.5}
      stagger={0.1}
      onItemClick={(item) => console.log('Navigate to:', item.href)}
    />
  );
}
```

### ImageGallery

Flexible image gallery.

```tsx
import { ImageGallery } from '@tuel/components';

function Gallery() {
  const images = [
    { id: '1', src: '/img1.jpg', alt: 'Image 1', caption: 'Caption 1' },
    { id: '2', src: '/img2.jpg', alt: 'Image 2', caption: 'Caption 2' },
  ];

  return (
    <ImageGallery
      images={images}
      layout="grid" // 'masonry', 'carousel', 'stack'
      columns={3}
      gap={20}
      hoverEffect="zoom" // 'fade', 'blur', 'grayscale'
      lightbox={true}
      lazy={true}
    />
  );
}
```

### HeroSection

Landing page hero component.

```tsx
import { HeroSection } from '@tuel/components';

function LandingPage() {
  return (
    <HeroSection
      title="Welcome to Our Site"
      subtitle="Building amazing experiences"
      backgroundImage="/hero-bg.jpg"
      backgroundVideo="/hero-video.mp4"
      overlay={true}
      overlayOpacity={0.5}
      height="100vh"
      parallax={true}
      reveal="fade-up"
      revealDuration={1}
      revealDelay={0.2}
      ctaButtons={[
        { label: 'Get Started', href: '/signup', variant: 'primary' },
        { label: 'Learn More', href: '/about', variant: 'secondary' },
      ]}
    />
  );
}
```

## Hover Effects

### HoverDistortion

Image distortion on hover.

```tsx
import { HoverDistortion } from '@tuel/components';

function DistortionImage() {
  return (
    <HoverDistortion
      image="/image.jpg"
      displacementImage="/displacement.jpg"
      intensity={0.3}
      speed={0.5}
      scale={1.1}
      hover={true}
      rgbShift={true}
      rgbIntensity={0.1}
      blendMode="normal"
      onHover={() => console.log('Hovering')}
      onLeave={() => console.log('Left')}
    />
  );
}
```

## Performance Tips

### 1. Lazy Loading

```tsx
import { lazy, Suspense } from 'react';

const ParticleWave = lazy(() =>
  import('@tuel/components').then((m) => ({ default: m.ParticleWave }))
);

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ParticleWave />
    </Suspense>
  );
}
```

### 2. SSR Safety (Next.js)

```tsx
import dynamic from 'next/dynamic';

const ThreeScene = dynamic(() => import('@tuel/components').then((m) => m.FloatingObjects), {
  ssr: false,
});
```

### 3. Conditional Loading

```tsx
import { useEffect, useState } from 'react';

function ConditionalAnimation() {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // Only load on desktop
    setShowAnimation(window.innerWidth > 768);
  }, []);

  return showAnimation ? <ParticleField /> : null;
}
```

## CSS Import

Don't forget to import the animation styles:

```tsx
// In your main app file or _app.tsx
import '@tuel/components/styles/animations.css';
```

## TypeScript Support

All components are fully typed. Import types for better IDE support:

```tsx
import type { ParticleFieldProps, CarouselProps, AnimatedTextProps } from '@tuel/components';
```

---

For more examples and live demos, visit [tuel-animate.dev](https://tuel-animate.dev)
