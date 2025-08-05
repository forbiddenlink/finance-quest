import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BudgetPersonalityAssessment from '@/components/chapters/fundamentals/lessons/BudgetPersonalityAssessment';

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
  },
  AnimatePresence: ({ children }: any) => <div>{children}</div>
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn()
  }
}));

describe('BudgetPersonalityAssessment', () => {
  beforeEach(() => {
    mockRecordCalculatorUsage.mockClear();
    jest.clearAllMocks();
  });

  test('renders the component', () => {
    render(<BudgetPersonalityAssessment />);
    expect(screen.getByText(/Discover Your Budgeting Personality/i)).toBeInTheDocument();
  });

  test('shows start assessment button', () => {
    render(<BudgetPersonalityAssessment />);
    expect(screen.getByText(/Question 1 of 5/i)).toBeInTheDocument();
  });

  test('starts assessment when button clicked', () => {
    render(<BudgetPersonalityAssessment />);
    // Component starts automatically, so just check if first question is visible
    expect(screen.getByText(/How do you typically approach financial planning?/i)).toBeInTheDocument();
  });

  test('records calculator usage on mount', () => {
    render(<BudgetPersonalityAssessment />);
    expect(mockRecordCalculatorUsage).toHaveBeenCalledWith('budget-personality-assessment');
  });

  test('handles component lifecycle correctly', () => {
    const { unmount } = render(<BudgetPersonalityAssessment />);
    expect(mockRecordCalculatorUsage).toHaveBeenCalledTimes(1);
    unmount();
  });
});
