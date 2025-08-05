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
    div: ({ children, whileHover, whileTap, animate, initial, transition, ...props }: any) => <div {...props}>{children}</div>,
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

// Mock timers
jest.useFakeTimers();

describe('ExpenseOptimizationGame', () => {
  beforeEach(() => {
    mockRecordCalculatorUsage.mockClear();
    jest.clearAllMocks();
    jest.clearAllTimers();
  });

  afterEach(() => {
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
    expect(screen.getByText(/Time Left/i)).toBeInTheDocument();
  });

  test('shows expense categories', () => {
    render(<ExpenseOptimizationGame />);
    const startButton = screen.getByText(/Start Challenge/i);
    fireEvent.click(startButton);
    expect(screen.getByText(/Scenario 1 of 5/i)).toBeInTheDocument();
  });

  test('records calculator usage on mount', () => {
    render(<ExpenseOptimizationGame />);
    expect(mockRecordCalculatorUsage).toHaveBeenCalledWith('expense-optimization-game');
  });

  test('handles timer functionality', () => {
    render(<ExpenseOptimizationGame />);
    const startButton = screen.getByText(/Start Challenge/i);
    fireEvent.click(startButton);
    expect(screen.getByText(/45/)).toBeInTheDocument();
  });

  test('handles component lifecycle correctly', () => {
    const { unmount } = render(<ExpenseOptimizationGame />);
    expect(mockRecordCalculatorUsage).toHaveBeenCalledTimes(1);
    unmount();
  });
});
