# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a **TypeScript monorepo** for a reusable animation component library built from 87+ creative web templates. The repository uses **Turborepo + pnpm** to manage packages and provides production-ready React components with GSAP, Framer Motion, and Three.js animations.

### Monorepo Structure

- **Apps**: Documentation and playground (`apps/docs`)
- **Packages**: Modular libraries (`@tuel/components`, `@tuel/gsap`, `@tuel/motion`, `@tuel/three`, `@tuel/tokens`, `@tuel/utils`)
- **Legacy Templates**: Original projects in migration process (CGMWT series, `cg-*`, `codegrid-*` prefixes)

## Development Setup & Commands

### Monorepo Management

```bash
# Install dependencies (use pnpm)
pnpm install

# Development - all packages and apps
pnpm dev

# Build all packages
pnpm build

# Run tests
pnpm test
pnpm test:watch

# Type checking
pnpm typecheck

# Linting and formatting
pnpm lint
pnpm format

# Clean all build artifacts
pnpm clean
```

### Package Publishing

```bash
# Create changeset for version bump
pnpm changeset

# Version packages based on changesets
pnpm version

# Build and publish to npm
pnpm release
```

### Legacy Templates (being migrated)

**Next.js Projects** (~40% of templates): `npm run dev` (port 3000)
**Vite Projects** (~60% of templates): `npm run dev` (Vite dev server)

## Project Architecture

### Monorepo Package Structure

**Core Packages**

- `@tuel/tokens`: Design tokens (animations, breakpoints, z-index)
- `@tuel/utils`: Shared utilities (cn, DOM helpers, math functions)
- `@tuel/motion`: Framer Motion primitives and variants
- `@tuel/gsap`: GSAP React hooks and ScrollTrigger wrappers
- `@tuel/three`: React Three Fiber helpers and SSR-safe components
- `@tuel/components`: Production-ready animation components
- `@tuel/tailwind-preset`: Shared Tailwind configuration

**Apps**

- `apps/docs`: Next.js documentation site with live examples

### Technology Stack

- **Build System**: Turborepo + pnpm workspaces
- **Language**: TypeScript (strict mode)
- **Bundler**: tsup for packages, Next.js for apps
- **Testing**: Vitest + React Testing Library
- **Styling**: Tailwind CSS + CSS-in-JS support
- **Animation Libraries**: GSAP 3.12+, Framer Motion 11+, Three.js 0.160+
- **React Version**: 18.2+ (with React 19 support in Next.js)
- **Publishing**: Changesets for versioning and npm releases

## Code Patterns & Conventions

### Component Development

```typescript
// SSR-safe pattern for animations
import { ClientOnly } from '@tuel/three';
import dynamic from 'next/dynamic';

// Dynamic imports for client-only components
const ThreeScene = dynamic(() => import('./ThreeScene'), { ssr: false });

// Use isomorphic layout effect for GSAP
import { useIsomorphicLayoutEffect } from '@tuel/gsap';
```

### Animation Patterns

- **GSAP**: Use `useGsapContext` for scoped animations with auto-cleanup
- **Framer Motion**: Leverage variants for reusable animations
- **Three.js**: Wrap in `ClientOnly` component for SSR safety
- **ScrollTrigger**: Use `useScrollTrigger` hook for declarative API

### TypeScript Conventions

- Strict mode enabled
- Export types alongside components
- Use interface for props, type for unions
- Proper generic constraints for hooks

### Testing Strategy

- Unit tests for utilities and hooks
- Component tests with React Testing Library
- Mock GSAP/Three.js for JSDOM environment
- E2E tests for critical user flows

## Working with Components

### Available Components

1. **RevealOnScroll**: Scroll-triggered reveal animations (GSAP/Framer Motion)
2. **InfiniteMarquee**: Auto-scrolling content with hover pause
3. **ThreeOrbitScene**: SSR-safe 3D scenes with orbit controls
4. *More components in development from legacy patterns*

### Component Usage

```typescript
import { RevealOnScroll, InfiniteMarquee, ThreeOrbitScene } from '@tuel/components';

// Basic usage
<RevealOnScroll engine="gsap" direction="up" triggerOnce>
  <YourContent />
</RevealOnScroll>

// With Three.js (automatically SSR-safe)
<ThreeOrbitScene autoRotate environment="sunset">
  <mesh>
    <boxGeometry args={[1, 1, 1]} />
    <meshStandardMaterial color="#6366f1" />
  </mesh>
</ThreeOrbitScene>
```

## Migration Workflow

### Migrating Legacy Templates

1. **Identify Pattern**: Map template to component pattern (see migration table)
2. **Extract Logic**: Pull out animation logic into hooks/components
3. **Add TypeScript**: Convert to TS with proper interfaces
4. **Make SSR-Safe**: Add client-only guards for browser APIs
5. **Write Tests**: Add unit and integration tests
6. **Document**: Add examples to docs app

### Pattern Migration Map

- **Scroll animations** → `RevealOnScroll` component
- **Infinite scrollers** → `InfiniteMarquee` component
- **3D scenes** → `ThreeOrbitScene` wrapper
- **GSAP timelines** → `useGsapContext` hook
- **Parallax effects** → Framer Motion parallax primitives

## Development Workflow

### Creating New Components

```bash
# 1. Create component in packages/components/src/
# 2. Export from packages/components/src/index.ts
# 3. Write tests in same directory
# 4. Add example to apps/docs
# 5. Run tests and build
pnpm test
pnpm build

# 6. Create changeset
pnpm changeset
```

### Testing Guidelines

- **Unit Tests**: All utilities and hooks must have tests
- **Component Tests**: Test user interactions and props
- **Visual Tests**: Manual verification in docs app
- **Performance**: Profile with Chrome DevTools
- **Accessibility**: Test with screen readers and keyboard

## Important Notes

### Performance Targets

- Bundle size: <50KB per component (gzipped)
- Tree-shaking: All exports must be tree-shakable
- FPS: Maintain 60fps for all animations
- LCP: <2.5s with animations
- CLS: <0.1 even with dynamic content

### SSR Considerations

- Always check `typeof window !== 'undefined'`
- Use dynamic imports for client-only code
- Provide meaningful SSR fallbacks
- Test in Next.js production builds

### Publishing Checklist

1. All tests passing
2. Types exported correctly
3. Peer dependencies listed
4. Changeset created
5. Docs updated
6. Examples working
