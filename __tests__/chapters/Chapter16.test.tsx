import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Chapter16Page from '@/app/chapter16/page';
import BusinessFinanceLessonEnhanced from '@/components/chapters/fundamentals/lessons/BusinessFinanceLessonEnhanced';
import BusinessFinanceQuizEnhanced from '@/components/chapters/fundamentals/quizzes/BusinessFinanceQuizEnhanced';
import BusinessCashFlowAnalyzer from '@/components/shared/calculators/BusinessCashFlowAnalyzer';
import CompoundInterestCalculator from '@/components/shared/calculators/CompoundInterestCalculator';
import RewardsOptimizerCalculator from '@/components/shared/calculators/RewardsOptimizerCalculator';
import DebtPayoffCalculator from '@/components/shared/calculators/DebtPayoffCalculator';

// Mock the progress store
jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: () => ({
    recordCalculatorUsage: jest.fn(),
    userProgress: {
      completedLessons: [],
      completedChapters: [],
      unlockedChapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
      calculatorUsage: {},
      quizScores: {},
    },
    isChapterUnlocked: () => true,
    completeLesson: jest.fn(),
    getPersonalizedEncouragement: () => 'Keep going!',
    getStudyRecommendation: () => ({ priority: 'low', message: 'Keep learning!' }),
    checkLevelUp: () => false,
  }),
}));

// Mock Recharts
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="responsive-container">{children}</div>
  ),
  LineChart: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="line-chart">{children}</div>
  ),
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}));

describe('Chapter 16: Business & Entrepreneurship Finance', () => {
  describe('Accessibility and Structure', () => {
    it('has proper heading hierarchy', () => {
      render(<Chapter16Page />);
      
      const mainHeading = screen.getByRole('heading', {
        level: 1,
        name: /Business & Entrepreneurship Finance/i
      });
      expect(mainHeading).toBeInTheDocument();
      
      const subHeadings = screen.getAllByRole('heading', { level: 2 });
      expect(subHeadings.length).toBeGreaterThan(0);
    });

    it('has accessible navigation', () => {
      render(<Chapter16Page />);
      
      const tabList = screen.getByRole('tablist');
      expect(tabList).toBeInTheDocument();
      
      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(4);
      
      tabs.forEach(tab => {
        expect(tab).toHaveAttribute('aria-selected');
        expect(tab).toHaveAttribute('aria-controls');
        expect(tab).toHaveAttribute('tabindex');
      });
    });

    it('supports keyboard navigation', async () => {
      render(<Chapter16Page />);
      
      const tabs = screen.getAllByRole('tab');
      const firstTab = tabs[0];
      const secondTab = tabs[1];
      
      firstTab.focus();
      expect(firstTab).toHaveFocus();
      
      await userEvent.keyboard('{arrowright}');
      expect(secondTab).toHaveFocus();
    });
  });

  describe('Business Cash Flow Analyzer', () => {
    it('has accessible form controls', () => {
      render(<BusinessCashFlowAnalyzer />);
      
      const inputs = screen.getAllByRole('spinbutton');
      inputs.forEach(input => {
        expect(input).toHaveAttribute('aria-label');
        expect(input).toHaveAttribute('aria-describedby');
      });
    });

    it('calculates cash flow metrics', async () => {
      render(<BusinessCashFlowAnalyzer />);
      
      // Fill required inputs
      const inputs = {
        'Monthly Revenue': '50000',
        'Cost of Goods Sold': '30000',
        'Operating Expenses': '10000',
        'Accounts Receivable Days': '30',
      };

      for (const [label, value] of Object.entries(inputs)) {
        const input = screen.getByLabelText(new RegExp(label, 'i'));
        await userEvent.clear(input);
        await userEvent.type(input, value);
      }

      // Calculate metrics
      const calculateButton = screen.getByRole('button', { name: /analyze/i });
      await userEvent.click(calculateButton);

      // Check results
      await waitFor(() => {
        expect(screen.getByText(/Operating Cash Flow/i)).toBeInTheDocument();
        expect(screen.getByText(/Cash Conversion Cycle/i)).toBeInTheDocument();
      });
    });

    it('generates cash flow projections', async () => {
      render(<BusinessCashFlowAnalyzer />);
      
      // Fill inputs and generate projections
      const inputs = {
        'Monthly Revenue': '50000',
        'Growth Rate': '10',
        'Projection Months': '12',
      };

      for (const [label, value] of Object.entries(inputs)) {
        const input = screen.getByLabelText(new RegExp(label, 'i'));
        await userEvent.clear(input);
        await userEvent.type(input, value);
      }

      const projectButton = screen.getByRole('button', { name: /project/i });
      await userEvent.click(projectButton);

      // Check projections
      await waitFor(() => {
        expect(screen.getByText(/Cash Flow Forecast/i)).toBeInTheDocument();
        expect(screen.getByTestId('line-chart')).toBeInTheDocument();
      });
    });
  });

  describe('Compound Interest Calculator', () => {
    it('has accessible form inputs', () => {
      render(<CompoundInterestCalculator />);
      
      const form = screen.getByRole('form');
      expect(form).toHaveAttribute('aria-label');
      
      const inputs = screen.getAllByRole('spinbutton');
      inputs.forEach(input => {
        expect(input).toHaveAttribute('aria-label');
      });
    });

    it('calculates compound growth', async () => {
      render(<CompoundInterestCalculator />);
      
      // Fill investment details
      const inputs = {
        'Initial Investment': '100000',
        'Monthly Contribution': '1000',
        'Annual Return': '8',
        'Investment Period': '10',
      };

      for (const [label, value] of Object.entries(inputs)) {
        const input = screen.getByLabelText(new RegExp(label, 'i'));
        await userEvent.clear(input);
        await userEvent.type(input, value);
      }

      // Calculate growth
      const calculateButton = screen.getByRole('button', { name: /calculate/i });
      await userEvent.click(calculateButton);

      // Check results
      await waitFor(() => {
        expect(screen.getByText(/Final Balance/i)).toBeInTheDocument();
        expect(screen.getByText(/Total Contributions/i)).toBeInTheDocument();
      });
    });

    it('shows growth breakdown', async () => {
      render(<CompoundInterestCalculator />);
      
      // Fill inputs and calculate
      const inputs = {
        'Initial Investment': '100000',
        'Annual Return': '8',
      };

      for (const [label, value] of Object.entries(inputs)) {
        const input = screen.getByLabelText(new RegExp(label, 'i'));
        await userEvent.clear(input);
        await userEvent.type(input, value);
      }

      const calculateButton = screen.getByRole('button', { name: /calculate/i });
      await userEvent.click(calculateButton);

      // Check breakdown
      await waitFor(() => {
        expect(screen.getByText(/Principal/i)).toBeInTheDocument();
        expect(screen.getByText(/Interest Earned/i)).toBeInTheDocument();
      });
    });
  });

  describe('Rewards Optimizer Calculator', () => {
    it('has accessible rewards configuration', () => {
      render(<RewardsOptimizerCalculator />);
      
      const form = screen.getByRole('form');
      expect(form).toHaveAttribute('aria-label');
      
      const checkboxes = screen.getAllByRole('checkbox');
      checkboxes.forEach(checkbox => {
        expect(checkbox).toHaveAttribute('aria-label');
      });
    });

    it('optimizes business rewards', async () => {
      render(<RewardsOptimizerCalculator />);
      
      // Add spending categories
      const addCategoryButton = screen.getByRole('button', { name: /add category/i });
      await userEvent.click(addCategoryButton);
      await userEvent.click(addCategoryButton);

      // Fill category details
      const categories = [
        {
          'Category': 'Office Supplies',
          'Monthly Spend': '2000',
        },
        {
          'Category': 'Travel',
          'Monthly Spend': '5000',
        },
      ];

      for (const [index, category] of categories.entries()) {
        for (const [label, value] of Object.entries(category)) {
          const inputs = screen.getAllByLabelText(new RegExp(label, 'i'));
          await userEvent.type(inputs[index], value);
        }
      }

      // Optimize rewards
      const optimizeButton = screen.getByRole('button', { name: /optimize/i });
      await userEvent.click(optimizeButton);

      // Check recommendations
      await waitFor(() => {
        expect(screen.getByText(/Recommended Cards/i)).toBeInTheDocument();
        expect(screen.getByText(/Annual Rewards Value/i)).toBeInTheDocument();
      });
    });

    it('compares reward programs', async () => {
      render(<RewardsOptimizerCalculator />);
      
      // Select programs to compare
      const checkboxes = screen.getAllByRole('checkbox');
      await userEvent.click(checkboxes[0]);
      await userEvent.click(checkboxes[1]);

      // Compare programs
      const compareButton = screen.getByRole('button', { name: /compare/i });
      await userEvent.click(compareButton);

      // Check comparison results
      await waitFor(() => {
        expect(screen.getByText(/Program Comparison/i)).toBeInTheDocument();
        expect(screen.getByText(/Net Value/i)).toBeInTheDocument();
      });
    });
  });

  describe('Debt Payoff Calculator', () => {
    it('has accessible debt input form', () => {
      render(<DebtPayoffCalculator />);
      
      const form = screen.getByRole('form');
      expect(form).toHaveAttribute('aria-label');
      
      const inputs = screen.getAllByRole('spinbutton');
      inputs.forEach(input => {
        expect(input).toHaveAttribute('aria-label');
      });
    });

    it('calculates debt payoff strategy', async () => {
      render(<DebtPayoffCalculator />);
      
      // Add debts
      const addDebtButton = screen.getByRole('button', { name: /add debt/i });
      await userEvent.click(addDebtButton);
      await userEvent.click(addDebtButton);

      // Fill debt details
      const debts = [
        {
          'Debt Name': 'Business Loan',
          'Balance': '50000',
          'Interest Rate': '6',
          'Minimum Payment': '1000',
        },
        {
          'Debt Name': 'Credit Line',
          'Balance': '25000',
          'Interest Rate': '12',
          'Minimum Payment': '500',
        },
      ];

      for (const [index, debt] of debts.entries()) {
        for (const [label, value] of Object.entries(debt)) {
          const inputs = screen.getAllByLabelText(new RegExp(label, 'i'));
          await userEvent.type(inputs[index], value);
        }
      }

      // Calculate payoff plan
      const calculateButton = screen.getByRole('button', { name: /calculate/i });
      await userEvent.click(calculateButton);

      // Check payoff plan
      await waitFor(() => {
        expect(screen.getByText(/Payoff Schedule/i)).toBeInTheDocument();
        expect(screen.getByText(/Total Interest/i)).toBeInTheDocument();
      });
    });

    it('compares payoff methods', async () => {
      render(<DebtPayoffCalculator />);
      
      // Add debt and calculate
      const addDebtButton = screen.getByRole('button', { name: /add debt/i });
      await userEvent.click(addDebtButton);

      const inputs = {
        'Debt Name': 'Business Loan',
        'Balance': '50000',
        'Interest Rate': '6',
      };

      for (const [label, value] of Object.entries(inputs)) {
        const input = screen.getByLabelText(new RegExp(label, 'i'));
        await userEvent.type(input, value);
      }

      // Compare methods
      const compareButton = screen.getByRole('button', { name: /compare methods/i });
      await userEvent.click(compareButton);

      // Check comparison
      await waitFor(() => {
        expect(screen.getByText(/Avalanche Method/i)).toBeInTheDocument();
        expect(screen.getByText(/Snowball Method/i)).toBeInTheDocument();
      });
    });
  });

  describe('Lesson Component', () => {
    it('has accessible content structure', () => {
      render(<BusinessFinanceLessonEnhanced />);
      
      const sections = screen.getAllByRole('region');
      sections.forEach(section => {
        expect(section).toHaveAttribute('aria-label');
      });
    });

    it('tracks progress accessibly', async () => {
      render(<BusinessFinanceLessonEnhanced />);
      
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow');
      expect(progressBar).toHaveAttribute('aria-valuemin');
      expect(progressBar).toHaveAttribute('aria-valuemax');
    });
  });

  describe('Quiz Component', () => {
    it('has accessible quiz form', () => {
      render(<BusinessFinanceQuizEnhanced />);
      
      const form = screen.getByRole('form');
      expect(form).toHaveAttribute('aria-label');
      
      const radioGroups = screen.getAllByRole('radiogroup');
      radioGroups.forEach(group => {
        expect(group).toHaveAttribute('aria-label');
      });
    });

    it('provides accessible feedback', async () => {
      render(<BusinessFinanceQuizEnhanced />);
      
      // Answer a question
      const options = screen.getAllByRole('radio');
      await userEvent.click(options[0]);

      // Submit answer
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await userEvent.click(submitButton);

      // Check feedback
      await waitFor(() => {
        const feedback = screen.getByRole('alert');
        expect(feedback).toBeInTheDocument();
        expect(feedback).toHaveAttribute('aria-live', 'polite');
      });
    });
  });

  describe('Integration Tests', () => {
    it('maintains state between calculator switches', async () => {
      render(<Chapter16Page />);
      
      // Start with Cash Flow
      const cashFlowTab = screen.getByRole('tab', { name: /Cash Flow/i });
      await userEvent.click(cashFlowTab);
      
      // Enter some data
      const input = screen.getByLabelText(/Monthly Revenue/i);
      await userEvent.type(input, '50000');

      // Switch to Growth Analysis
      const growthTab = screen.getByRole('tab', { name: /Growth Analysis/i });
      await userEvent.click(growthTab);

      // Switch back to Cash Flow
      await userEvent.click(cashFlowTab);

      // Check if data persists
      expect(input).toHaveValue(50000);
    });

    it('synchronizes cash flow data with debt calculator', async () => {
      render(<Chapter16Page />);
      
      // Enter cash flow data
      const cashFlowTab = screen.getByRole('tab', { name: /Cash Flow/i });
      await userEvent.click(cashFlowTab);
      
      const revenueInput = screen.getByLabelText(/Monthly Revenue/i);
      await userEvent.type(revenueInput, '50000');

      // Switch to Debt Management
      const debtTab = screen.getByRole('tab', { name: /Debt Management/i });
      await userEvent.click(debtTab);

      // Check if cash flow data is reflected
      await waitFor(() => {
        expect(screen.getByText(/Available for Debt Payment/i)).toBeInTheDocument();
      });
    });

    it('updates rewards based on spending patterns', async () => {
      render(<Chapter16Page />);
      
      // Enter cash flow data
      const cashFlowTab = screen.getByRole('tab', { name: /Cash Flow/i });
      await userEvent.click(cashFlowTab);
      
      const expensesInput = screen.getByLabelText(/Operating Expenses/i);
      await userEvent.type(expensesInput, '10000');

      // Switch to Business Rewards
      const rewardsTab = screen.getByRole('tab', { name: /Business Rewards/i });
      await userEvent.click(rewardsTab);

      // Check if spending patterns are reflected
      await waitFor(() => {
        expect(screen.getByText(/Spending Analysis/i)).toBeInTheDocument();
      });
    });
  });
});

