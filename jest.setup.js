import '@testing-library/jest-dom';

// ResizeObserver polyfill for Recharts components in test environment
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));
