import '@testing-library/jest-dom';
import React from 'react';

// Suppress specific console warnings in test environment
const originalError = console.error;
console.error = (...args) => {
  const message = args[0];
  if (typeof message === 'string') {
    // Suppress React warnings about unknown props from Framer Motion
    if (message.includes('React does not recognize the `whileHover` prop') ||
        message.includes('React does not recognize the `whileTap` prop') ||
        message.includes('React does not recognize the `layoutId` prop') ||
        message.includes('An update to ProgressRing inside a test was not wrapped in act')) {
      return;
    }
  }
  // Don't call originalError if we're suppressing
};

// ResizeObserver polyfill for Recharts components in test environment
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Global Recharts mock to prevent canvas/chart rendering warnings in tests
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => (
    <div data-testid="responsive-container" style={{ width: 400, height: 300 }}>
      {children}
    </div>
  ),
  LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
  BarChart: ({ children }) => <div data-testid="bar-chart">{children}</div>,
  PieChart: ({ children }) => <div data-testid="pie-chart">{children}</div>,
  AreaChart: ({ children }) => <div data-testid="area-chart">{children}</div>,
  ComposedChart: ({ children }) => <div data-testid="composed-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  Bar: () => <div data-testid="bar" />,
  Area: () => <div data-testid="area" />,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  ReferenceLine: () => <div data-testid="reference-line" />,
  ReferenceArea: () => <div data-testid="reference-area" />,
}));

// Global Framer Motion mock to prevent animation props from being passed to DOM elements
jest.mock('framer-motion', () => {
  const MockMotionComponent = ({ children, whileHover, whileTap, initial, animate, exit, transition, layout, layoutId, ...props }) => {
    // Remove animation-specific props before passing to DOM element
    const {
      whileHover: _whileHover,
      whileTap: _whileTap,
      initial: _initial,
      animate: _animate,
      exit: _exit,
      transition: _transition,
      layout: _layout,
      layoutId: _layoutId,
      ...domProps
    } = props;
    return React.createElement('div', domProps, children);
  };

  return {
    motion: new Proxy({}, {
      get: (target, prop) => {
        return MockMotionComponent;
      }
    }),
    AnimatePresence: ({ children }) => children,
    useAnimation: () => ({
      start: jest.fn(),
      stop: jest.fn(),
      set: jest.fn(),
    }),
    useMotionValue: () => ({ get: jest.fn(), set: jest.fn() }),
    useTransform: () => jest.fn(),
  };
});
