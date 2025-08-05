import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BudgetBuilderCalculator from '@/components/shared/calculators/BudgetBuilderCalculator';

// Mock the dependencies
const mockRecordCalculatorUsage = jest.fn();

jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: () => ({
    recordCalculatorUsage: mockRecordCalculatorUsage
  })
}));

// Mock CalculatorWrapper to avoid the wrapper complexity
jest.mock('@/components/shared/calculators/CalculatorWrapper', () => {
  return function MockedCalculatorWrapper({ children }: any) {
    return <div data-testid="calculator-wrapper">{children}</div>;
  };
});

// Mock performance monitoring
jest.mock('@/lib/monitoring/PerformanceMonitor', () => ({
  usePerformanceMonitor: () => ({
    startMeasurement: jest.fn(),
    endMeasurement: jest.fn(),
    recordMetric: jest.fn()
  })
}));

// Mock Recharts
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />
}));

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>
  }
}));

describe('BudgetBuilderCalculator', () => {
  beforeEach(() => {
    mockRecordCalculatorUsage.mockClear();
    jest.clearAllMocks();
  });

  test('renders the component', () => {
    render(<BudgetBuilderCalculator />);
    expect(screen.getByTestId('calculator-wrapper')).toBeInTheDocument();
  });

  test('displays monthly income input', () => {
    render(<BudgetBuilderCalculator />);
    expect(screen.getByText(/Monthly Take-Home Income/i)).toBeInTheDocument();
  });

  test('shows budget categories', () => {
    render(<BudgetBuilderCalculator />);
    expect(screen.getByText(/Housing/i)).toBeInTheDocument();
  });

  test('shows visualizations', () => {
    render(<BudgetBuilderCalculator />);
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
  });

  test('handles component lifecycle correctly', () => {
    const { unmount } = render(<BudgetBuilderCalculator />);
    expect(mockRecordCalculatorUsage).toHaveBeenCalledTimes(1);
    unmount();
  });
});
