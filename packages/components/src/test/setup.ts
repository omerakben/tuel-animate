import '@testing-library/jest-dom';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords() {
    return [];
  }
};

// Mock requestAnimationFrame
global.requestAnimationFrame = (cb) => setTimeout(cb, 0) as any;
global.cancelAnimationFrame = (id) => clearTimeout(id);

// Mock GSAP ScrollTrigger
jest.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    create: jest.fn(),
    refresh: jest.fn(),
    kill: jest.fn(),
  },
}));