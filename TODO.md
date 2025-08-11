# Tuel Animate - Legacy Migration TODO

## Migration Overview

**Mission**: Migrate 87+ legacy animation projects into the modern tuel-animate monorepo (TypeScript + React 19 + Next.js 15 + modern GSAP/Three.js).

**Target**: All animations, UI tricks, GSAP effects, and Three.js scenes should be functional and visible when running `pnpm dev`.

---

## 📋 Phase 1: Analysis & Categorization (IN PROGRESS)

### Legacy Project Categories Identified

#### 🎯 Three.js/WebGL Projects (3D Scenes)

- `cg-3d-garage` - GLTF model viewer with post-processing effects
- `cg-3d-slider-threejs` - Three.js carousel/slider
- `cg-ashfall-3d-image-gallery` - 3D image gallery
- `cg-threejs-video-gallery` - Video gallery with Three.js
- `codegrid-cielrose-threejs-slider-nextjs` - Next.js Three.js slider
- `codegrid-threejs-slider-final` - Final Three.js slider implementation
- `cg-orchestra-3d-scroll-animation` - 3D scroll-driven animations
- `cg-webgl-interactive-background-nextjs` - Interactive WebGL backgrounds

#### 📜 Scroll Animations (GSAP + Lenis)

- `cg-karim-saab-scroll-animation` - Vite + GSAP + Lenis
- `cg-telescope-scroll-animation` - Scroll-driven animations
- `cg-telescope-img-scroll-animation-nextjs` - Next.js image scroll effects
- `cg-nvg8-scroll-animation` - Complex scroll sequences
- `cg-mat-voyce-scroll-animation` - Scroll-triggered animations
- `cg-orken-world-scroll-animation` - World scroll effects
- `cg-thefirstthelast-scroll-animation` - Scroll reveal animations
- `cg-sofihealth-product-scroll-animation` - Product scroll effects
- `cg-wodniack-work-section-scroll` - Work section scroll
- `cg-radga-horizontal-scroll-animation` - Horizontal scrolling
- `cg-adaline-scroll-animation-nextjs` - Next.js scroll animations
- `cg-eduardbodak-scroll-animation` - Scroll effects
- `codegrid-elementis-scroll-animation-javascript` - Vanilla JS scroll
- `codegrid-fiddle-digital-scroll-animation` - Scroll sequences
- `codegrid-vucko-scroll-animation-javascript` - Vanilla scroll effects
- `next-js-parallax-scroll` - Next.js parallax scrolling

#### 🎠 Carousels & Sliders

- `cg-exo-ape-infinite-carousel` - Infinite carousel
- `cg-infinite-horizontal-slider-nextjs` - Next.js horizontal slider
- `cg-karim-saab-work-carousel-nextjs` - Work carousel
- `cg-warp-slider-next` - Warping slider effects
- `infinite-horizontal-scroll-codegrid` - Infinite horizontal scroll
- `codegrid-infinite-draggable-image-gallery-nextjs` - Draggable gallery
- `codegrid-eseagency-scroll-carousel-javascript` - Scroll carousel

#### 🎭 Page Transitions & View Transitions

- `nextjs-view-transitions` - Next.js view transitions API
- `cg-page-transitions-view-transition-api` - View transition API
- `codegrid-nextjs-scroll-driven-page-transitions` - Scroll-driven transitions
- `codegrid-zajno-page-transitions-nextjs` - Complex page transitions

#### ✨ Text Animations & Effects

- `cg-navigate-scroll-animated-text-javascript` - Scroll text animations
- `cg-explode-text-on-scroll-matterjs` - Text explosion with Matter.js
- `codegrid-nextjs-text-reveal-animation` - Text reveal animations
- `codegrid-menuxl-text-displacement-animation-nextjs` - Text displacement

#### 🖱️ Hover Effects & Interactions

- `cg-henriheymans-hover` - Hover effects
- `codegrid-direction-aware-hover-effect-javascript` - Direction-aware hover
- `codegrid-turbulent-inversion-lens-hover-effect-nextjs` - Lens hover effects

#### 🎨 Landing Pages & Reveals

- `cg-kin-landing-page` - Landing page animations
- `cg-konpo-lp-reveal` - Landing page reveal
- `cg-p10-landing-page-reveal-gsap` - GSAP reveal animations
- `cg-savoirfaire-landing-page-reveal-animation` - Complex reveal
- `next-gsap-landing-page-reveal-codegrid` - GSAP landing page
- `codegrid-nite-riot-landing-page-reveal-javascript` - Vanilla JS reveal
- `codegrid-truekindskincare-landing-page-reveal-nextjs` - Next.js reveal
- `codegrid-gta-vi-landing-page-scroll-final` - GTA VI style landing

#### 🔲 Cards & Layouts

- `cg-capsules-animated-columns` - Animated column layouts
- `cg-capsules-sticky-cards-javascript` - Sticky cards with vanilla JS
- `cg-next-sticky-cards` - Next.js sticky cards
- `codegrid-sticky-cards-ashfall-rebuild-nextjs` - Rebuilt sticky cards

#### 🎮 Interactive Elements

- `cg-playable-objects` - Interactive object animations
- `cg-interactive-particle-logo-nextjs` - Interactive particle logo
- `cg-asset-orb-next` - Interactive orb animations
- `codegrid-interactive-team-section-nextjs` - Interactive team section

#### 🍃 Particles & Physics

- `cg-lusion-fluid-particles` - Fluid particle systems
- `codegrid-image-explosion-scroll-animation-nextjs` - Image explosion

#### 🧭 Navigation & Menus

- `cg-bitkraft-menu-nextjs` - Next.js animated menu
- `cg-push-over-overlay-menu` - Overlay menu animations
- `cg-next-minimap` - Navigation minimap
- `codegrid-exoape-menu-javascript` - Vanilla JS menu

#### 🖼️ Galleries & Media

- `cg-phantom-gallery-javascript` - Phantom gallery effects
- `codegrid-burocratik-image-trail-nextjs` - Image trail effects
- `codegrid-inkwell-image-gallery-javascript` - Vanilla gallery

#### 🌍 Specialized Effects

- `cg-parallax-snap-infinite-scroll` - Parallax snap scrolling
- `cg-247artists-trail-nextjs` - Artist trail effects
- `cg-ethnocare` - Healthcare-themed animations
- `cg-gentlerain` - Rain/weather effects
- `cg-silenceo` - Audio visualization effects
- `heurebleue-scroll-animation-nextjs` - Blue hour scroll effects

### Monthly Template Collections (CGMWT\*)

- `CGMWTAPR2025/` through `CGMWTSEPT2024/` - Monthly collections with various templates

---

## 📋 Phase 2: Technical Dependency Analysis

### Current tuel-animate Stack ✅

- React 19.0.0-rc.1 + React DOM 19.0.0-rc.1
- Next.js 15.4.6
- TypeScript 5.9.2
- Turbo + pnpm monorepo
- Modern GSAP + Framer Motion + Three.js packages

### Legacy Dependencies to Modernize

- **Three.js**: Upgrade from r128 to latest (r170+)
- **GSAP**: Consolidate to @gsap/react pattern
- **Lenis**: Migrate to @studio-freight/react-lenis
- **SplitType**: Update and ensure React 19 compatibility
- **Matter.js**: Add for physics-based animations
- **View Transitions API**: Ensure next-view-transitions compatibility

---

## 📋 Phase 3: Component Mapping Strategy

### Existing Components (Active) ✅

- `RevealOnScroll` - Maps to scroll reveal projects
- `InfiniteMarquee` - Maps to marquee/scroll projects
- `ScrollFrameAnimation` - Maps to frame-based scroll animations
- `ParallaxScroll` - Maps to parallax projects
- `ScrollMinimap` - Maps to minimap navigation
- `StickyCards` - Maps to sticky card projects
- `ImageGallery` - Maps to gallery projects
- `AnimatedMenu` - Maps to menu animation projects
- `HeroSection` - Maps to landing page projects
- `PageReveal` - Maps to page reveal projects
- `Carousel` - Maps to carousel/slider projects
- `PageTransition` - Maps to page transition projects
- `RouteTransition` - Maps to route-based transitions
- `SmoothScroll` - Maps to smooth scroll projects
- `ImageTrail` - Maps to image trail effects
- `ParticleField` - Maps to particle system projects
- `ParticleText` - Maps to particle text projects
- `CanvasAnimation` - Maps to canvas-based projects
- `WaveCanvas` - Maps to wave animation projects
- `HoverDistortion` - Maps to hover effect projects

### Components to Fix/Enable 🔧

- `ThreeOrbitScene` - Fix React 19 compatibility for 3D projects
- `AnimatedText` - Fix TypeScript issues for text animation projects
- `PhantomGallery` - Enable for 3D gallery projects
- `FloatingObjects` - Enable for 3D object projects
- `ParticleWave` - Enable for particle wave projects
- `MorphingShapes` - Enable for shape morphing projects
- `NoiseField` - Enable for noise-based projects

### New Components Needed 🆕

- `ThreeGLTFScene` - For GLTF model loading (cg-3d-garage)
- `TextExplosion` - For Matter.js text effects
- `DirectionAwareHover` - For direction-aware hover
- `LensDistortion` - For lens/distortion effects
- `FluidParticles` - For fluid particle systems
- `ViewTransition` - For native view transitions
- `HorizontalScroll` - For horizontal scroll sections
- `InteractiveParticles` - For interactive particle logos
- `ScrollSequence` - For complex scroll sequences
- `MediaGallery` - For video/media galleries
- `PhysicsText` - For physics-based text animations

---

## 📋 Phase 4: Asset Migration Plan

### Assets to Collect & Organize

- **3D Models**: GLTF files from cg-3d-garage, etc.
- **Images**: Hero images, backgrounds, textures
- **Videos**: Background videos, demos
- **Fonts**: Custom typography files
- **Audio**: Sound effects for interactions
- **Textures**: Three.js materials and textures

### Target Asset Structure

```
tuel-animate/
├── packages/
│   └── components/
│       └── public/
│           ├── models/     # GLTF, OBJ files
│           ├── images/     # JPG, PNG, WebP
│           ├── videos/     # MP4, WebM
│           ├── audio/      # MP3, WAV
│           ├── fonts/      # WOFF2, TTF
│           └── textures/   # Three.js textures
└── apps/
    └── docs/
        └── public/
            └── examples/   # Example assets
```

---

## 📋 Phase 5: Implementation Roadmap

### Week 1: Foundation & Infrastructure

- [ ] Fix React 19 compatibility issues in Three.js components
- [ ] Update all dependencies to latest versions
- [ ] Create asset management system
- [ ] Set up proper TypeScript configurations
- [ ] Establish testing framework

### Week 2: Core Component Development

- [ ] Fix existing disabled components
- [ ] Implement missing core components
- [ ] Create comprehensive component documentation
- [ ] Set up Storybook or similar for component showcase

### Week 3: Legacy Project Migration (Batch 1)

- [ ] Migrate Three.js projects (cg-3d-garage, etc.)
- [ ] Migrate scroll animation projects
- [ ] Migrate carousel/slider projects
- [ ] Test all migrated components

### Week 4: Legacy Project Migration (Batch 2)

- [ ] Migrate page transition projects
- [ ] Migrate text animation projects
- [ ] Migrate hover effect projects
- [ ] Migrate landing page projects

### Week 5: Advanced Features & Polish

- [ ] Migrate particle system projects
- [ ] Migrate interactive elements
- [ ] Migrate specialized effects
- [ ] Performance optimization

### Week 6: Documentation & Examples

- [ ] Create comprehensive examples in docs app
- [ ] Document all component APIs
- [ ] Create migration guides
- [ ] Set up live demo deployment

---

## 📋 Phase 6: Quality Assurance

### Testing Checklist

- [ ] All components render without errors
- [ ] TypeScript types are complete and accurate
- [ ] SSR works properly with Next.js 15
- [ ] Performance is optimized (Lighthouse scores)
- [ ] Accessibility guidelines are followed
- [ ] Browser compatibility (Chrome, Firefox, Safari, Edge)
- [ ] Mobile responsiveness
- [ ] Build process is clean (no warnings/errors)

### Build & Deploy Checklist

- [ ] `pnpm typecheck` passes
- [ ] `pnpm lint` passes
- [ ] `pnpm build` completes successfully
- [ ] `pnpm test` passes (when tests are added)
- [ ] Git commits are clean and organized
- [ ] Documentation is complete and accurate

---

## 📋 Phase 7: Final Integration

### Demo Application Requirements

When running `pnpm dev`, the docs application should showcase:

- [ ] All scroll animations working smoothly
- [ ] All Three.js scenes rendering properly
- [ ] All page transitions functioning
- [ ] All text effects animating correctly
- [ ] All hover effects responding
- [ ] All carousels/sliders operating
- [ ] All particle systems active
- [ ] All interactive elements responsive

### Performance Requirements

- [ ] Initial page load < 3 seconds
- [ ] Smooth 60fps animations
- [ ] Proper code splitting and lazy loading
- [ ] Optimized asset delivery
- [ ] SEO-friendly rendering

---

## 🚀 Success Criteria

1. **Functional**: All 87+ legacy project features are working in tuel-animate
2. **Modern**: Using React 19, Next.js 15, TypeScript 5.9+, latest GSAP/Three.js
3. **Performant**: Lighthouse score 90+ on all metrics
4. **Maintainable**: Clean, typed, documented, and tested code
5. **Accessible**: WCAG 2.1 AA compliance
6. **Scalable**: Tree-shakeable, modular architecture

---

## 📝 Migration Notes

_This TODO will be updated as migration progresses. Each completed task will be checked off and detailed notes will be added for future reference._

**Last Updated**: August 10, 2025
**Status**: Phase 1 (Analysis) in progress
**Next Action**: Continue systematic analysis of legacy projects
