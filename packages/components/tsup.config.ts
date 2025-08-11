import { defineConfig } from 'tsup';

export default defineConfig((options) => ({
  entry: ['src/index.ts', 'src/scroll/index.ts'],
  format: ['cjs', 'esm'],
  dts: !options.watch, // Skip DTS generation in watch mode to avoid dependency issues
  splitting: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: [
    'react',
    'react-dom',
    'framer-motion',
    'gsap',
    'three',
    '@react-three/fiber',
    '@react-three/drei',
  ],
}));
