# Tuel Animate - Unified Animation Component Library

A comprehensive TypeScript monorepo for production-ready React animation components, built from 87+ creative web templates. Features GSAP, Framer Motion, and Three.js integrations with full SSR support.

## 🚀 Features

- **30+ Core Components with 60+ Variants** - Scroll effects, page transitions, 3D scenes, particle systems, and more
- **TypeScript First** - Full type safety and IntelliSense support
- **SSR Safe** - All components work with Next.js and server-side rendering
- **Tree Shakeable** - Import only what you need
- **Performance Optimized** - Lazy loading, code splitting, and efficient animations
- **Framework Agnostic** - Works with Next.js, Vite, CRA, and more

## 📦 Packages

| Package                 | Description                 | Version |
| ----------------------- | --------------------------- | ------- |
| `@tuel/components`      | React animation components  | 0.1.0   |
| `@tuel/tokens`          | Design tokens and constants | 0.1.0   |
| `@tuel/utils`           | Shared utilities            | 0.1.0   |
| `@tuel/motion`          | Framer Motion utilities     | 0.1.0   |
| `@tuel/gsap`            | GSAP utilities and hooks    | 0.1.0   |
| `@tuel/three`           | Three.js utilities          | 0.1.0   |
| `@tuel/tailwind-preset` | Tailwind configuration      | 0.1.0   |

## 🎨 Component Categories

### Scroll Animations (5 components)

- `ScrollFrameAnimation` - Frame-by-frame scroll animations
- `ParallaxScroll` - Multi-layer parallax effects
- `RevealOnScroll` - Reveal elements on scroll
- `StickyCards` - Stacking card animations
- `ScrollMinimap` - Navigation minimap with progress

### Page Transitions (5 components)

- `PageTransition` - 10+ transition variants (fade, slide, morph, split, curtain, etc.)
- `RouteTransition` - Next.js router integration
- `ViewTransition` - Native View Transitions API
- `SmoothScroll` - Lenis-like smooth scrolling
- `ImageTrail` - Mouse trail effects

### Text Effects (2 components)

- `AnimatedText` - 7 animation variants (split, scramble, wave, typewriter, etc.)
- `ParticleText` - Interactive text to particle animations

### 3D/WebGL (5 components)

- `PhantomGallery` - WebGL shader-based infinite gallery
- `FloatingObjects` - 3D floating shapes with distortion
- `ParticleWave` - 3D particle wave system
- `MorphingShapes` - Shape morphing animations
- `ThreeOrbitScene` - Basic Three.js scene setup

### Particles & Canvas (5 components)

- `ParticleField` - Interactive particle system with physics
- `ParticleText` - Text particle effects
- `WaveCanvas` - Animated wave patterns
- `NoiseField` - Perlin noise flow field
- `CanvasAnimation` - Custom canvas wrapper

### UI Components (8 components)

- `Carousel` - 6 animation variants (fade, slide, 3d, stack, coverflow)
- `AnimatedMenu` - 5 menu animations (slide, overlay, push, morph, circular)
- `ImageGallery` - Multiple layout options (grid, masonry, carousel)
- `HeroSection` - Landing page hero with parallax
- `PageReveal` - Page reveal animations
- `OverlayReveal` - Overlay transitions
- `InfiniteMarquee` - Auto-scrolling content
- `HoverDistortion` - WebGL image distortion on hover

## 🎯 Quick Examples

### Scroll Animations

```tsx
import { ScrollFrameAnimation, ParallaxScroll } from '@tuel/components';

// Frame-by-frame animation
<ScrollFrameAnimation
  frameCount={120}
  framePath="/frames/frame-{index}.jpg"
  pinContainer
/>

// Parallax layers
<ParallaxScroll>
  <ParallaxLayer speed={0.5}>
    <img src="background.jpg" />
  </ParallaxLayer>
  <ParallaxLayer speed={1.2}>
    <h1>Foreground Text</h1>
  </ParallaxLayer>
</ParallaxScroll>
```

### Page Transitions

```tsx
import { PageTransition, RouteTransition } from '@tuel/components';

// Page reveal animation
<PageTransition variant="morph" duration={1.5}>
  <YourPageContent />
</PageTransition>

// Next.js route transitions
<RouteTransition variant="slide">
  <Component {...pageProps} />
</RouteTransition>
```

### 3D Scenes

```tsx
import { FloatingObjects, ParticleWave } from '@tuel/components';

// Floating 3D objects
<FloatingObjects
  objects={[
    { shape: 'sphere', color: '#8b5cf6', distort: 0.3 },
    { shape: 'torus', color: '#3b82f6', distort: 0.5 }
  ]}
  environment="sunset"
/>

// Particle wave
<ParticleWave
  particleCount={10000}
  waveAmplitude={2}
  color1="#8b5cf6"
  color2="#3b82f6"
/>
```

## 🛠️ Installation

```bash
# Install core components
npm install @tuel/components

# Install specific animation libraries as needed
npm install @tuel/gsap @tuel/motion @tuel/three

# For Tailwind users
npm install @tuel/tailwind-preset
```

### Next.js Setup

```js
// next.config.js
module.exports = {
  transpilePackages: ['@tuel/components', '@tuel/gsap', '@tuel/three'],
};
```

### Tailwind Setup

```js
// tailwind.config.js
module.exports = {
  presets: [require('@tuel/tailwind-preset')],
  // Your custom config
};
```

## 🏗️ Development

### Prerequisites

- Node.js >= 18
- pnpm >= 9

### Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/tuel-animate.git
cd tuel-animate

# Install dependencies
pnpm install

# Start development
pnpm dev         # Start all dev servers
pnpm build       # Build all packages
pnpm test        # Run tests
pnpm lint        # Lint code
pnpm typecheck   # Type checking

# Publishing
pnpm changeset   # Create changeset
pnpm version     # Version packages
pnpm release     # Publish to npm
```

## 📚 Documentation

- [Full Component Examples](./EXAMPLES.md) - Detailed usage for all components
- [Migration Analysis](./MIGRATION_ANALYSIS.md) - Legacy project coverage
- [API Reference](./docs/api) - Complete API documentation

All components follow consistent prop patterns:

```tsx
interface BaseAnimationProps {
  className?: string;       // Custom CSS classes
  duration?: number;        // Animation duration in seconds
  delay?: number;          // Animation delay in seconds
  easing?: string;         // Easing function
  onComplete?: () => void; // Completion callback
}
```

### Import Animation Styles

```tsx
// Import pre-built animation CSS
import '@tuel/components/styles/animations.css';
```

## ⚡ Performance Tips

1. **Lazy Load Heavy Components**

   ```tsx
   const ParticleWave = lazy(() =>
     import('@tuel/components').then(m => ({ default: m.ParticleWave }))
   );
   ```

2. **Use SSR-Safe Imports**

   ```tsx
   import dynamic from 'next/dynamic';
   const ThreeScene = dynamic(
     () => import('@tuel/components').then(m => m.ThreeOrbitScene),
     { ssr: false }
   );
   ```

3. **Optimize Bundle Size**

   ```tsx
   // Import only what you need
   import { RevealOnScroll } from '@tuel/components/reveal-on-scroll';
   ```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT © Tuel Animate

## 🙏 Credits

Built with:

- [React](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [GSAP](https://greensock.com/gsap)
- [Framer Motion](https://www.framer.com/motion)
- [Three.js](https://threejs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Turborepo](https://turbo.build)

---

Made with ❤️ by the Tuel team
