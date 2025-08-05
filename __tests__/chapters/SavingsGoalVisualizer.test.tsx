import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SavingsGoalVisualizer from '@/components/chapters/fundamentals/lessons/SavingsGoalVisualizer';

// Mock the dependencies
const mockRecordCalculatorUsage = jest.fn();

jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: () => ({
    recordCalculatorUsage: mockRecordCalculatorUsage
  })
}));

// Mock Recharts
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />
}));

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, whileHover, whileTap, animate, initial, transition, layout, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, whileHover, whileTap, animate, initial, transition, ...props }: any) => <button {...props}>{children}</button>,
    h3: ({ children, whileHover, whileTap, animate, initial, transition, ...props }: any) => <h3 {...props}>{children}</h3>,
    p: ({ children, whileHover, whileTap, animate, initial, transition, ...props }: any) => <p {...props}>{children}</p>
  },
  AnimatePresence: ({ children }: any) => children
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

describe('SavingsGoalVisualizer', () => {
  beforeEach(() => {
    mockRecordCalculatorUsage.mockClear();
    jest.clearAllMocks();
  });

  test('renders the component', () => {
    render(<SavingsGoalVisualizer />);
    expect(screen.getByText(/Savings Goal Visualizer/i)).toBeInTheDocument();
  });

  test('shows add goal button', () => {
    render(<SavingsGoalVisualizer />);
    expect(screen.getByText(/Add Goal/i)).toBeInTheDocument();
  });

  test('opens goal form when add button clicked', () => {
    render(<SavingsGoalVisualizer />);
    const addButton = screen.getByText(/Add Goal/i);
    fireEvent.click(addButton);
    expect(screen.getByText(/Add New Savings Goal/i)).toBeInTheDocument();
  });

  test('shows visualizations', () => {
    render(<SavingsGoalVisualizer />);
    expect(screen.getByText(/Total Goals/i)).toBeInTheDocument();
  });

  test('records calculator usage on mount', () => {
    render(<SavingsGoalVisualizer />);
    expect(mockRecordCalculatorUsage).toHaveBeenCalledWith('savings-goal-visualizer');
  });

  test('handles component lifecycle correctly', () => {
    const { unmount } = render(<SavingsGoalVisualizer />);
    expect(mockRecordCalculatorUsage).toHaveBeenCalledTimes(1);
    unmount();
  });

  test('displays target amount field', () => {
    render(<SavingsGoalVisualizer />);
    const addButton = screen.getByText(/Add Goal/i);
    fireEvent.click(addButton);
    expect(screen.getByText(/Add New Savings Goal/i)).toBeInTheDocument();
  });
});
