import '@testing-library/jest-dom';

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
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, whileHover, whileTap, initial, animate, exit, transition, layout, layoutId, ...props }) => (
      <div {...props}>{children}</div>
    ),
    button: ({ children, whileHover, whileTap, initial, animate, exit, transition, layout, layoutId, ...props }) => (
      <button {...props}>{children}</button>
    ),
    span: ({ children, whileHover, whileTap, initial, animate, exit, transition, layout, layoutId, ...props }) => (
      <span {...props}>{children}</span>
    ),
    h1: ({ children, whileHover, whileTap, initial, animate, exit, transition, layout, layoutId, ...props }) => (
      <h1 {...props}>{children}</h1>
    ),
    h2: ({ children, whileHover, whileTap, initial, animate, exit, transition, layout, layoutId, ...props }) => (
      <h2 {...props}>{children}</h2>
    ),
    h3: ({ children, whileHover, whileTap, initial, animate, exit, transition, layout, layoutId, ...props }) => (
      <h3 {...props}>{children}</h3>
    ),
    p: ({ children, whileHover, whileTap, initial, animate, exit, transition, layout, layoutId, ...props }) => (
      <p {...props}>{children}</p>
    ),
    li: ({ children, whileHover, whileTap, initial, animate, exit, transition, layout, layoutId, ...props }) => (
      <li {...props}>{children}</li>
    ),
    ul: ({ children, whileHover, whileTap, initial, animate, exit, transition, layout, layoutId, ...props }) => (
      <ul {...props}>{children}</ul>
    ),
    form: ({ children, whileHover, whileTap, initial, animate, exit, transition, layout, layoutId, ...props }) => (
      <form {...props}>{children}</form>
    ),
  },
  AnimatePresence: ({ children }) => children,
  useAnimation: () => ({
    start: jest.fn(),
    stop: jest.fn(),
    set: jest.fn(),
  }),
  useMotionValue: () => ({ get: jest.fn(), set: jest.fn() }),
  useTransform: () => jest.fn(),
}));
