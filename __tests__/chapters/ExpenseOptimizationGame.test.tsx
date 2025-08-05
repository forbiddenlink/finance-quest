import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ExpenseOptimizationGame from '@/components/chapters/fundamentals/lessons/ExpenseOptimizationGame';

// Mock the dependencies
const mockRecordCalculatorUsage = jest.fn();

jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: () => ({
    recordCalculatorUsage: mockRecordCalculatorUsage
  })
}));

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    h3: ({ children, ...props }: any) => <h3 {...props}>{children}</h3>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>
  }
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

// Mock timers
jest.useFakeTimers();

describe('ExpenseOptimizationGame', () => {
  beforeEach(() => {
    mockRecordCalculatorUsage.mockClear();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test('renders the component', () => {
    render(<ExpenseOptimizationGame />);
    expect(screen.getByText(/Expense Optimization Challenge/i)).toBeInTheDocument();
  });

  test('shows start challenge button', () => {
    render(<ExpenseOptimizationGame />);
    expect(screen.getByText(/Start Challenge/i)).toBeInTheDocument();
  });

  test('starts game when button clicked', () => {
    render(<ExpenseOptimizationGame />);
    const startButton = screen.getByText(/Start Challenge/i);
    fireEvent.click(startButton);
    expect(screen.getByText(/Time Remaining/i)).toBeInTheDocument();
  });

  test('shows expense categories', () => {
    render(<ExpenseOptimizationGame />);
    const startButton = screen.getByText(/Start Challenge/i);
    fireEvent.click(startButton);
    expect(screen.getByText(/Dining Out/i)).toBeInTheDocument();
  });

  test('records calculator usage on mount', () => {
    render(<ExpenseOptimizationGame />);
    expect(mockRecordCalculatorUsage).toHaveBeenCalledWith('expense-optimization-game');
  });

  test('handles timer functionality', () => {
    render(<ExpenseOptimizationGame />);
    const startButton = screen.getByText(/Start Challenge/i);
    fireEvent.click(startButton);
    expect(screen.getByText(/2:00/i)).toBeInTheDocument();
  });

  test('handles component lifecycle correctly', () => {
    const { unmount } = render(<ExpenseOptimizationGame />);
    expect(mockRecordCalculatorUsage).toHaveBeenCalledTimes(1);
    unmount();
  });
});
