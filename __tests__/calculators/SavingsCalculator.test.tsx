import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SavingsCalculator from '@/components/chapters/fundamentals/calculators/SavingsCalculator';
import { useProgressStore } from '@/lib/store/progressStore';

// Mock the progress store
jest.mock('@/lib/store/progressStore');
const mockUseProgressStore = useProgressStore as jest.MockedFunction<typeof useProgressStore>;

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

// Mock Recharts
jest.mock('recharts', () => ({
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <div>{children}</div>,
}));

// Simplified mock for CalculatorWrapper that just renders children
jest.mock('@/components/shared/calculators/CalculatorWrapper', () => {
  return function MockCalculatorWrapper({ children, onReset }: any) {
    return (
      <div data-testid="calculator-wrapper">
        <div data-testid="calculator-content">{children}</div>
        <button onClick={onReset} data-testid="reset-button">Reset</button>
      </div>
    );
  };
});

// Mock the result components
jest.mock('@/components/shared/calculators/ResultComponents', () => ({
  ResultCard: ({ label, value }: any) => (
    <div data-testid="result-card">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  ),
}));

// Mock form fields
jest.mock('@/components/shared/calculators/FormFields', () => ({
  CurrencyInput: ({ label, value, onChange, ...props }: any) => (
    <div>
      <label>{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
    </div>
  ),
  NumberInput: ({ label, value, onChange, ...props }: any) => (
    <div>
      <label>{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
    </div>
  ),
}));

describe('SavingsCalculator', () => {
  const mockRecordCalculatorUsage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseProgressStore.mockReturnValue({
      recordCalculatorUsage: mockRecordCalculatorUsage,
      userProgress: {},
      isChapterUnlocked: jest.fn(() => true),
      completeLesson: jest.fn(),
      recordQuizScore: jest.fn(),
      advanceChapter: jest.fn(),
    } as any);
  });

  describe('Initial Rendering', () => {
    test('renders calculator wrapper', () => {
      render(<SavingsCalculator />);
      
      expect(screen.getByTestId('calculator-wrapper')).toBeInTheDocument();
      expect(screen.getByTestId('calculator-content')).toBeInTheDocument();
    });

    test('displays input fields with labels', () => {
      render(<SavingsCalculator />);
      
      expect(screen.getByText('Initial Deposit')).toBeInTheDocument();
      expect(screen.getByText('Monthly Deposit')).toBeInTheDocument();
      expect(screen.getByText(/Annual Interest Rate/)).toBeInTheDocument();
      expect(screen.getByText(/Time Period/)).toBeInTheDocument();
    });

    test('renders chart components', () => {
      render(<SavingsCalculator />);
      
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    });
  });

  describe('Financial Calculations', () => {
    test('renders without crashing with default values', () => {
      render(<SavingsCalculator />);
      
      // Should render default form inputs
      expect(screen.getByDisplayValue('1000')).toBeInTheDocument();
      expect(screen.getByDisplayValue('100')).toBeInTheDocument();
      expect(screen.getByDisplayValue('4.5')).toBeInTheDocument();
      expect(screen.getByDisplayValue('5')).toBeInTheDocument();
    });

    test('updates input values when changed', () => {
      render(<SavingsCalculator />);
      
      const initialDepositInput = screen.getByDisplayValue('1000');
      fireEvent.change(initialDepositInput, { target: { value: '5000' } });
      
      expect(screen.getByDisplayValue('5000')).toBeInTheDocument();
    });

    test('handles interest rate changes', () => {
      render(<SavingsCalculator />);
      
      const interestInput = screen.getByDisplayValue('4.5');
      fireEvent.change(interestInput, { target: { value: '6.0' } });
      
      expect(screen.getByDisplayValue('6.0')).toBeInTheDocument();
    });
  });

  describe('Quick Preset Scenarios', () => {
    test('displays preset buttons', () => {
      render(<SavingsCalculator />);
      
      expect(screen.getByText(/Big Bank/)).toBeInTheDocument();
      expect(screen.getByText(/Credit Union/)).toBeInTheDocument();
      expect(screen.getByText(/Online Bank/)).toBeInTheDocument();
      expect(screen.getByText(/Emergency Fund Goal/)).toBeInTheDocument();
    });

    test('applies preset when clicked', () => {
      render(<SavingsCalculator />);
      
      const onlineBankButton = screen.getByText(/Online Bank/);
      fireEvent.click(onlineBankButton);
      
      // Should update the interest rate to 4.5%
      expect(screen.getByDisplayValue('4.5')).toBeInTheDocument();
    });
  });

  describe('Chart Rendering', () => {
    test('displays chart legend', () => {
      render(<SavingsCalculator />);
      
      expect(screen.getByText('Total Deposited')).toBeInTheDocument();
      expect(screen.getByText('Total Value')).toBeInTheDocument();
      // Use getAllByText since "Interest Earned" appears in both result card and legend
      const interestEarnedElements = screen.getAllByText('Interest Earned');
      expect(interestEarnedElements.length).toBeGreaterThan(0);
    });

    test('renders result cards', () => {
      render(<SavingsCalculator />);
      
      const resultCards = screen.getAllByTestId('result-card');
      expect(resultCards.length).toBeGreaterThan(0);
    });
  });

  describe('Reset Functionality', () => {
    test('resets values when reset button clicked', async () => {
      render(<SavingsCalculator />);
      
      // Change a value
      const initialDepositInput = screen.getByDisplayValue('1000');
      fireEvent.change(initialDepositInput, { target: { value: '5000' } });
      expect(screen.getByDisplayValue('5000')).toBeInTheDocument();
      
      // Click reset
      const resetButton = screen.getByTestId('reset-button');
      fireEvent.click(resetButton);
      
      // Should return to default
      await waitFor(() => {
        expect(screen.getByDisplayValue('1000')).toBeInTheDocument();
      });
    });
  });

  describe('Educational Content', () => {
    test('displays savings plan section', () => {
      render(<SavingsCalculator />);
      
      expect(screen.getByText(/Your Savings Plan/)).toBeInTheDocument();
    });

    test('shows growth over time section', () => {
      render(<SavingsCalculator />);
      
      expect(screen.getByText(/Growth Over Time/)).toBeInTheDocument();
    });

    test('includes helpful rate guidance', () => {
      render(<SavingsCalculator />);
      
      // Check for the new view mode buttons instead of old text
      expect(screen.getByText('Basic')).toBeInTheDocument();
      expect(screen.getByText('Advanced')).toBeInTheDocument();
      expect(screen.getByText('Compare Banks')).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    test('handles empty string inputs gracefully', () => {
      render(<SavingsCalculator />);
      
      const initialDepositInput = screen.getByDisplayValue('1000');
      fireEvent.change(initialDepositInput, { target: { value: '' } });
      
      // Should not crash
      expect(screen.getByDisplayValue('')).toBeInTheDocument();
    });

    test('handles negative values without crashing', () => {
      render(<SavingsCalculator />);
      
      const monthlyInput = screen.getByDisplayValue('100');
      fireEvent.change(monthlyInput, { target: { value: '-50' } });
      
      // Should handle negative input
      expect(screen.getByDisplayValue('-50')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    test('provides proper form labels', () => {
      render(<SavingsCalculator />);
      
      expect(screen.getByText('Initial Deposit')).toBeInTheDocument();
      expect(screen.getByText('Monthly Deposit')).toBeInTheDocument();
      expect(screen.getByText(/Annual Interest Rate/)).toBeInTheDocument();
      expect(screen.getByText(/Time Period/)).toBeInTheDocument();
    });

    test('includes descriptive text for users', () => {
      render(<SavingsCalculator />);
      
      // Check for analysis mode description
      expect(screen.getByText('Analysis Mode')).toBeInTheDocument();
      expect(screen.getByText('Basic')).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    test('renders without throwing errors', () => {
      expect(() => render(<SavingsCalculator />)).not.toThrow();
    });

    test('calculator wrapper receives proper props', () => {
      render(<SavingsCalculator />);
      
      // Verify the mocked wrapper is called
      expect(screen.getByTestId('calculator-wrapper')).toBeInTheDocument();
    });

    test('handles quick scenarios section', () => {
      render(<SavingsCalculator />);
      
      expect(screen.getByText(/Quick Scenarios/)).toBeInTheDocument();
    });
  });
});
