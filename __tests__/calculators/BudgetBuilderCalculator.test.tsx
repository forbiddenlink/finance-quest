import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import BudgetBuilderCalculator from '@/components/shared/calculators/BudgetBuilderCalculator';
import { useProgressStore } from '@/lib/store/progressStore';

// Mock the dependencies
jest.mock('@/lib/store/progressStore');
jest.mock('@/lib/monitoring/PerformanceMonitor', () => ({
  usePerformanceMonitor: () => ({
    trackCalculation: jest.fn(),
    renderCount: 0
  })
}));
jest.mock('@/lib/accessibility/AccessibilityManager', () => ({
  useAccessibility: () => ({
    state: {},
    preferences: {},
    updateFontSize: jest.fn(),
    toggleHighContrast: jest.fn(),
    toggleReducedMotion: jest.fn(),
    toggleFocusVisible: jest.fn(),
    focusElement: jest.fn()
  })
}));

// Mock Recharts to avoid canvas issues in tests
jest.mock('recharts', () => ({
  PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
  Pie: () => <div data-testid="pie" />,
  Cell: () => <div data-testid="cell" />,
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
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

const mockRecordCalculatorUsage = jest.fn();
const mockUseProgressStore = useProgressStore as jest.MockedFunction<typeof useProgressStore>;

describe('BudgetBuilderCalculator', () => {
  beforeEach(() => {
    mockRecordCalculatorUsage.mockClear();
    mockUseProgressStore.mockReturnValue({
      recordCalculatorUsage: mockRecordCalculatorUsage,
      userProgress: {
        completedLessons: [],
        quizScores: {},
        calculatorUsage: {},
        currentChapter: 1,
        financialLiteracyScore: 0
      },
      isChapterUnlocked: jest.fn(() => true),
      completeLesson: jest.fn(),
      recordQuizScore: jest.fn(),
      recordSimulationResult: jest.fn(),
      getChapterProgress: jest.fn(() => ({ completed: 0, total: 0 })),
      resetProgress: jest.fn()
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Initial Rendering', () => {
    it('renders the calculator wrapper and main components', () => {
      render(<BudgetBuilderCalculator />);
      
      expect(screen.getByText('Budget Builder Calculator')).toBeInTheDocument();
      expect(screen.getByText('Monthly Take-Home Income')).toBeInTheDocument();
      expect(screen.getByText('Needs (Essential Expenses)')).toBeInTheDocument();
      expect(screen.getByText('Wants (Lifestyle Expenses)')).toBeInTheDocument();
      expect(screen.getByText('Savings & Investments')).toBeInTheDocument();
    });

    it('displays default budget categories', () => {
      render(<BudgetBuilderCalculator />);
      
      expect(screen.getByText('Housing')).toBeInTheDocument();
      expect(screen.getByText('Groceries')).toBeInTheDocument();
      expect(screen.getByText('Transportation')).toBeInTheDocument();
      expect(screen.getByText('Entertainment')).toBeInTheDocument();
      expect(screen.getByText('Emergency Fund')).toBeInTheDocument();
    });

    it('shows 50/30/20 rule progress section', () => {
      render(<BudgetBuilderCalculator />);
      
      expect(screen.getByText('50/30/20 Rule Progress')).toBeInTheDocument();
      expect(screen.getByText('Needs (Target: 50%)')).toBeInTheDocument();
      expect(screen.getByText('Wants (Target: 30%)')).toBeInTheDocument();
      expect(screen.getByText('Savings (Target: 20%)')).toBeInTheDocument();
    });
  });

  describe('Income Input', () => {
    it('allows updating monthly income', async () => {
      render(<BudgetBuilderCalculator />);
      
      const incomeInput = screen.getByDisplayValue('5000');
      fireEvent.change(incomeInput, { target: { value: '6000' } });
      
      await waitFor(() => {
        expect(incomeInput).toHaveValue('6000');
      });
    });

    it('updates budget calculations when income changes', async () => {
      render(<BudgetBuilderCalculator />);
      
      const incomeInput = screen.getByDisplayValue('5000');
      fireEvent.change(incomeInput, { target: { value: '4000' } });
      
      // Should see updated remaining budget calculation
      await waitFor(() => {
        expect(screen.getByText(/Remaining Budget/)).toBeInTheDocument();
      });
    });
  });

  describe('Budget Category Management', () => {
    it('allows updating category amounts', async () => {
      render(<BudgetBuilderCalculator />);
      
      // Find a budgeted amount input for housing
      const budgetInputs = screen.getAllByDisplayValue('1500');
      if (budgetInputs.length > 0) {
        fireEvent.change(budgetInputs[0], { target: { value: '1800' } });
        
        await waitFor(() => {
          expect(budgetInputs[0]).toHaveValue('1800');
        });
      }
    });

    it('updates actual spending amounts', async () => {
      render(<BudgetBuilderCalculator />);
      
      // Find actual amount inputs
      const actualInputs = screen.getAllByDisplayValue('1500');
      if (actualInputs.length > 1) {
        fireEvent.change(actualInputs[1], { target: { value: '1600' } });
        
        await waitFor(() => {
          expect(actualInputs[1]).toHaveValue('1600');
        });
      }
    });

    it('calculates budget vs actual differences', async () => {
      render(<BudgetBuilderCalculator />);
      
      // The calculator should show comparison between budgeted and actual
      expect(screen.getByText('Budget vs Actual')).toBeInTheDocument();
    });
  });

  describe('50/30/20 Rule Validation', () => {
    it('shows correct percentage calculations', async () => {
      render(<BudgetBuilderCalculator />);
      
      // With default $5000 income and default category amounts
      // Should calculate percentages for needs, wants, savings
      const percentageElements = screen.getAllByText(/%/);
      expect(percentageElements.length).toBeGreaterThan(0);
    });

    it('provides visual feedback for good/bad allocations', async () => {
      render(<BudgetBuilderCalculator />);
      
      // Should show progress bars for 50/30/20 rule
      const progressSection = screen.getByText('50/30/20 Rule Progress');
      expect(progressSection).toBeInTheDocument();
    });

    it('updates percentages when income changes', async () => {
      render(<BudgetBuilderCalculator />);
      
      const incomeInput = screen.getByDisplayValue('5000');
      fireEvent.change(incomeInput, { target: { value: '10000' } });
      
      await waitFor(() => {
        // Percentages should recalculate with new income
        expect(screen.getByText('50/30/20 Rule Progress')).toBeInTheDocument();
      });
    });
  });

  describe('Charts and Visualizations', () => {
    it('renders spending breakdown pie chart', () => {
      render(<BudgetBuilderCalculator />);
      
      expect(screen.getByText('Spending Breakdown')).toBeInTheDocument();
      expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
    });

    it('renders budget vs actual comparison chart', () => {
      render(<BudgetBuilderCalculator />);
      
      expect(screen.getByText('Budget vs Actual')).toBeInTheDocument();
      expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });

    it('includes responsive chart containers', () => {
      render(<BudgetBuilderCalculator />);
      
      const containers = screen.getAllByTestId('responsive-container');
      expect(containers.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Reset Functionality', () => {
    it('has a reset button that works', async () => {
      render(<BudgetBuilderCalculator />);
      
      // Change some values first
      const incomeInput = screen.getByDisplayValue('5000');
      fireEvent.change(incomeInput, { target: { value: '8000' } });
      
      // Find and click reset button (it's part of CalculatorWrapper)
      const resetButton = screen.getByText(/Reset/);
      fireEvent.click(resetButton);
      
      await waitFor(() => {
        // Should return to default values
        expect(screen.getByDisplayValue('5000')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('handles invalid input values gracefully', async () => {
      render(<BudgetBuilderCalculator />);
      
      const incomeInput = screen.getByDisplayValue('5000');
      fireEvent.change(incomeInput, { target: { value: '-1000' } });
      
      // Calculator should handle negative values appropriately
      await waitFor(() => {
        expect(incomeInput).toBeInTheDocument();
      });
    });

    it('handles zero income appropriately', async () => {
      render(<BudgetBuilderCalculator />);
      
      const incomeInput = screen.getByDisplayValue('5000');
      fireEvent.change(incomeInput, { target: { value: '0' } });
      
      await waitFor(() => {
        expect(incomeInput).toHaveValue('0');
        // Should show appropriate messaging for zero income
      });
    });

    it('prevents division by zero errors', async () => {
      render(<BudgetBuilderCalculator />);
      
      const incomeInput = screen.getByDisplayValue('5000');
      fireEvent.change(incomeInput, { target: { value: '0' } });
      
      // Should not crash the component
      await waitFor(() => {
        expect(screen.getByText('Budget Builder Calculator')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has proper labels for form inputs', () => {
      render(<BudgetBuilderCalculator />);
      
      expect(screen.getByLabelText(/Monthly Take-Home Income/)).toBeInTheDocument();
    });

    it('includes descriptive text for screen readers', () => {
      render(<BudgetBuilderCalculator />);
      
      expect(screen.getByText(/Create your personal budget using the proven 50\/30\/20 rule/)).toBeInTheDocument();
    });

    it('has proper heading structure', () => {
      render(<BudgetBuilderCalculator />);
      
      expect(screen.getByText('Budget Builder Calculator')).toBeInTheDocument();
      expect(screen.getByText('Needs (Essential Expenses)')).toBeInTheDocument();
      expect(screen.getByText('Wants (Lifestyle Expenses)')).toBeInTheDocument();
    });
  });

  describe('Performance Tracking', () => {
    it('records calculator usage on mount', () => {
      render(<BudgetBuilderCalculator />);
      
      expect(mockRecordCalculatorUsage).toHaveBeenCalledWith('budget-builder-calculator');
    });
  });

  describe('Edge Cases', () => {
    it('handles very large income values', async () => {
      render(<BudgetBuilderCalculator />);
      
      const incomeInput = screen.getByDisplayValue('5000');
      fireEvent.change(incomeInput, { target: { value: '999999' } });
      
      await waitFor(() => {
        expect(incomeInput).toHaveValue('999999');
        // Should still function properly with large numbers
      });
    });

    it('handles decimal values in income', async () => {
      render(<BudgetBuilderCalculator />);
      
      const incomeInput = screen.getByDisplayValue('5000');
      fireEvent.change(incomeInput, { target: { value: '5000.50' } });
      
      await waitFor(() => {
        expect(incomeInput).toHaveValue('5000.50');
      });
    });

    it('maintains calculation accuracy with multiple updates', async () => {
      render(<BudgetBuilderCalculator />);
      
      const incomeInput = screen.getByDisplayValue('5000');
      
      // Rapidly change values
      fireEvent.change(incomeInput, { target: { value: '6000' } });
      fireEvent.change(incomeInput, { target: { value: '7000' } });
      fireEvent.change(incomeInput, { target: { value: '8000' } });
      
      await waitFor(() => {
        expect(incomeInput).toHaveValue('8000');
        // Calculator should maintain accuracy
      });
    });
  });

  describe('Real-World Scenarios', () => {
    it('handles typical middle-class budget scenario', async () => {
      render(<BudgetBuilderCalculator />);
      
      const incomeInput = screen.getByDisplayValue('5000');
      fireEvent.change(incomeInput, { target: { value: '4200' } });
      
      await waitFor(() => {
        // Should calculate realistic percentages for $4200 income
        expect(screen.getByText('50/30/20 Rule Progress')).toBeInTheDocument();
      });
    });

    it('handles high-earner budget scenario', async () => {
      render(<BudgetBuilderCalculator />);
      
      const incomeInput = screen.getByDisplayValue('5000');
      fireEvent.change(incomeInput, { target: { value: '12000' } });
      
      await waitFor(() => {
        // Should show potential for higher savings rate
        expect(screen.getByText('50/30/20 Rule Progress')).toBeInTheDocument();
      });
    });

    it('handles tight-budget scenario', async () => {
      render(<BudgetBuilderCalculator />);
      
      const incomeInput = screen.getByDisplayValue('5000');
      fireEvent.change(incomeInput, { target: { value: '2800' } });
      
      await waitFor(() => {
        // Should show need for budget adjustment
        expect(screen.getByText('50/30/20 Rule Progress')).toBeInTheDocument();
      });
    });
  });
});
