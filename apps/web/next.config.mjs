/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@tuel/components',
    '@tuel/gsap',
    '@tuel/motion',
    '@tuel/three',
    '@tuel/tokens',
    '@tuel/utils',
  ],
};

export default nextConfig;
