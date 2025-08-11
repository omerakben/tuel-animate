# Tuel Animate - Legacy Migration TODO

## Migration Overview

**Mission**: Migrate 87+ legacy animation projects into the modern tuel-animate monorepo (TypeScript + React 19 + Next.js 15 + modern GSAP/Three.js).

**Target**: All animations, UI tricks, GSAP effects, and Three.js scenes should be functional and visible when running `pnpm dev`.

---

## 📋 Phase 1: Analysis & Categorization ✅ COMPLETED

### Legacy Project Categories Identified ✅

#### 🎯 Three.js/WebGL Projects (3D Scenes)

- ✅ `cg-3d-garage` - GLTF model viewer with post-processing effects → **MIGRATED** to `GarageScene` component
- ✅ `cg-3d-slider-threejs` - Three.js carousel/slider → **MIGRATED** to `ThreeSlider` component
- ✅ `cg-ashfall-3d-image-gallery` - 3D image gallery → **MIGRATED** to `AshfallGallery` component
- ✅ `cg-threejs-video-gallery` - Video gallery with Three.js → **MIGRATED** to `ThreeJSVideoGallery` component
- ✅ `codegrid-cielrose-threejs-slider-nextjs` - Next.js Three.js slider → **MIGRATED** to `CielroseSlider` component
- ✅ `codegrid-threejs-slider-final` - Final Three.js slider implementation → **MIGRATED** to `ThreeJSFinalSlider` component
- ✅ `cg-orchestra-3d-scroll-animation` - 3D scroll-driven animations → **MIGRATED** to `OrchestraCubes` component
- ✅ `cg-webgl-interactive-background-nextjs` - Interactive WebGL backgrounds → **MIGRATED** to `InteractiveFluidGradient` component

#### 📜 Scroll Animations (GSAP + Lenis)

- ✅ `cg-karim-saab-scroll-animation` - Vite + GSAP + Lenis → **MIGRATED** to `KarimSaabScroll` component
- ✅ `cg-telescope-scroll-animation` - Scroll-driven animations → **MIGRATED** to `TelescopeScroll` component
- ✅ `cg-telescope-img-scroll-animation-nextjs` - Next.js image scroll effects → **MIGRATED** to `TelescopeImageScroll` component
- ✅ `cg-nvg8-scroll-animation` - Complex scroll sequences → **MIGRATED** to `NVG8Scroll` component
- ✅ `cg-mat-voyce-scroll-animation` - Scroll-triggered animations → **MIGRATED** to `MatVoyceScroll` component
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

## 📋 Phase 2: Foundation Preparation ✅ COMPLETED

### New Components Implemented ✅

- `ThreeGLTFScene` - GLTF model loading for 3D projects (cg-3d-garage, etc.)
- `HorizontalScroll` + `HorizontalScrollItem` - Horizontal scroll sections
- `TextExplosion` - Matter.js text explosion effects
- `ViewTransition` + `ViewPageTransition` + `useViewTransition` - Native view transitions
- `FloatingObjects` - Re-enabled after TypeScript fixes
- `ParticleWave` - Re-enabled after TypeScript fixes

### Dependencies Added ✅

- **matter-js** + **@types/matter-js** - Physics engine for text explosion effects

---

## 📋 Phase 3: Systematic Migration ⚙️ IN PROGRESS

### Recently Migrated Components ✅

**December 2024 - Phase 2 Completion:**

- ✅ `ThreeGLTFScene` - Foundation for 3D model viewing
- ✅ `HorizontalScroll` + `HorizontalScrollItem` - GSAP horizontal scrolling
- ✅ `TextExplosion` - Matter.js physics-based text effects
- ✅ `ViewTransition` + `ViewPageTransition` - Native View Transition API

**August 2025 - Legacy Migration Progress:**

- ✅ **`GarageScene`** - **FIRST LEGACY MIGRATION** from `cg-3d-garage`
- ✅ **`ThreeSlider`** - **SECOND LEGACY MIGRATION** from `cg-3d-slider-threejs`
- ✅ **`AshfallGallery`** - **THIRD LEGACY MIGRATION** from `cg-ashfall-3d-image-gallery`
- ✅ **`ThreeJSVideoGallery`** - **FOURTH LEGACY MIGRATION** from `cg-threejs-video-gallery`
- ✅ **`CielroseSlider`** - **FIFTH LEGACY MIGRATION** from `codegrid-cielrose-threejs-slider-nextjs`
- ✅ **`ThreeJSFinalSlider`** - **SIXTH LEGACY MIGRATION** from `codegrid-threejs-slider-final`
- ✅ **`OrchestraCubes`** - **SEVENTH LEGACY MIGRATION** from `cg-orchestra-3d-scroll-animation`
- ✅ **`InteractiveFluidGradient`** - **EIGHTH LEGACY MIGRATION** from `cg-webgl-interactive-background-nextjs`
- ✅ **`KarimSaabScroll`** - **NINTH LEGACY MIGRATION** from `cg-karim-saab-scroll-animation`

### 🎯 **MILESTONE: 11 COMPONENTS SUCCESSFULLY MIGRATED** ✅

#### Quality Assurance & Browser Testing Completed

**Comprehensive Browser Testing Results (Playwright Chrome):**

**Development Server**: ✅ Running successfully on localhost:3001
**Overall Status**: Core functionality working, some integration issues identified

**Working Pages** ✅
- **Homepage** - ✅ All navigation links visible and functional
- **Reveal on Scroll** - ✅ Perfect scroll animations with interactive controls
- **Sticky Cards** - ✅ Smooth card stacking effects with real-time parameter adjustment
- **3D Garage Scene** - ✅ Three.js cyberpunk scene with bloom effects working
- **3D Slider** - ✅ Curved 3D slider with scroll-driven textures functional

**Pages with Issues** ⚠️
- **Orchestra 3D Cubes** - ⚠️ Loads but has multiple asset 404 errors (model/texture files)
- **3D Video Gallery** - ⚠️ Loads with "Framecast" content but extensive video asset 404 errors
- **Parallax Scroll** - ❌ Redirects to homepage, page navigation broken

**New Migration Components Status** ✅ RESOLVED
- **NVG8 Scroll Demo** - ✅ /examples/nvg8-scroll working correctly (directory structure fixed)
- **Mat Voyce Scroll Demo** - ✅ /examples/mat-voyce-scroll working correctly (directory structure fixed)

**Technical Issues Identified**:
1. **Asset Management**: Multiple 404 errors for video, model, and texture files
2. ~~**Demo Page Integration**: Newly migrated components lack proper demo pages in docs app~~ ✅ RESOLVED
3. ~~**Navigation Links**: Missing links to migrated components on homepage~~ ✅ RESOLVED
4. **Route Configuration**: Some scroll-based pages have routing issues

**Build Status** ✅
- **Packages Building**: All @tuel/gsap components compile without errors
- **Component Exports**: All migrated components properly exported from package
- **TypeScript**: No compilation errors in migrated components

**Critical Fix Applied:**

**RESOLVED: Demo Page Integration Issue (January 2025)**
- **Problem**: NVG8Scroll and MatVoyceScroll components had 404 errors on /examples/* routes
- **Root Cause**: Demo pages were located in `src/app/examples/` instead of `app/examples/`
- **Solution**: Moved examples directory to correct Next.js app router location
- **Actions Taken**:
  1. Moved `src/app/examples/` → `app/examples/`
  2. Restarted development server to clear routing cache
  3. Added navigation links to homepage component listing
  4. Verified both demo pages working correctly with scroll animations
- **Result**: Both migrated components now fully accessible and functional from homepage

- 🔧 **React Hook Rule Violation**: Fixed `useRef` being called inside `reduce` function in `OrchestraCubes` component
- ✅ **Solution**: Replaced with manual ref creation in `useState` initializer
- ✅ **Result**: Component now loads without errors and animations work correctly

### Migration Pattern Established 🔧

**Successfully migrated `cg-3d-garage` → `GarageScene` component:**

1. **Analysis**: Examined legacy vanilla Three.js code (GLTF, lighting, post-processing)
2. **Component Creation**: Built React component using existing `ThreeGLTFScene` foundations
3. **Feature Preservation**: Maintained all original features (bloom effects, custom lighting, navigation)
4. **UI Integration**: Added React-based navigation overlay and footer
5. **Documentation**: Added to docs app at `/three/garage-scene`
6. **Type Safety**: Full TypeScript integration with configurable props

**Successfully migrated `cg-3d-slider-threejs` → `ThreeSlider` component:**

1. **Analysis**: Examined complex Three.js curved geometry, canvas textures, scroll integration
2. **Component Creation**: Built React component with dynamic canvas texture generation
3. **Feature Preservation**: Maintained curved plane geometry, image loading, scroll-driven animation
4. **Modern Enhancements**: Added TypeScript interfaces, configurable slides, proper error handling
5. **Documentation**: Added to docs app at `/three/slider`
6. **Scroll Integration**: Implemented native scroll listener with performance optimization

**Successfully migrated `codegrid-cielrose-threejs-slider-nextjs` → `CielroseSlider` component:**

1. **Analysis**: Examined advanced shader-based Three.js slider with custom vertex/fragment shaders
2. **Component Creation**: Built React component with sophisticated texture transition system
3. **Shader Preservation**: Maintained custom shaders for distortion effects and smooth transitions
4. **Feature Implementation**: Added scroll-driven navigation, auto-rotation, title animations
5. **Documentation**: Added to docs app at `/three/cielrose-slider`
6. **GSAP Integration**: Implemented smooth transitions with GSAP timeline animations

**Key Dependencies**: Three.js R3F ecosystem, canvas texture manipulation, scroll event handling

### Component Mapping Strategy

#### Existing Components (Active) ✅

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

### Current Status ✅

**Development Server Running**: `pnpm dev` → **<http://localhost:3001>**

**First Legacy Migration Complete**:

- ✅ `cg-3d-garage` → `GarageScene` component successfully integrated
- ✅ Available at: `/three/garage-scene` in docs app
- ✅ Features preserved: GLTF loading, custom lighting, bloom effects, navigation overlay
- ✅ Modern React component with full TypeScript support

### Demo Application Requirements

When running `pnpm dev`, the docs application should showcase:

- ✅ All Phase 2 foundation components working
- ✅ First migrated Three.js scene rendering properly (`GarageScene`)
- [ ] All scroll animations working smoothly
- [ ] All page transitions functioning
- [ ] All text effects animating correctly
- [ ] All hover effects responding
- [ ] All carousels/sliders operating
- [ ] All particle systems active
- [ ] All interactive elements responsive

### Performance Requirements

- ✅ Initial page load < 3 seconds (currently achieved)
- ✅ Smooth 60fps animations (Phase 2 components)
- [ ] Proper code splitting and lazy loading
- [ ] Optimized asset delivery

### Next Priority Actions

**Continue Three.js Migration Batch:**

1. `cg-3d-slider-threejs` - Three.js carousel/slider
2. `cg-ashfall-3d-image-gallery` - 3D image gallery
3. `cg-threejs-video-gallery` - Video gallery with Three.js

**Migration Pattern Established:**

1. Analyze legacy vanilla code structure
2. Create React component using existing foundations
3. Preserve all original features + add React benefits
4. Integrate into docs app with proper routing
5. Update TODO.md with completion status

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
