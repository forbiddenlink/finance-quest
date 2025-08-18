import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Chapter12Page from '@/app/chapter12/page';
import RealEstateAlternativesLessonEnhanced from '@/components/chapters/fundamentals/lessons/RealEstateAlternativesLessonEnhanced';
import RealEstateAlternativesQuizEnhanced from '@/components/chapters/fundamentals/quizzes/RealEstateAlternativesQuizEnhanced';
import PropertyInvestmentAnalyzer from '@/components/chapters/fundamentals/calculators/PropertyInvestmentAnalyzer';
import BRRRRStrategyCalculator from '@/components/chapters/fundamentals/calculators/BRRRRStrategyCalculator';
import RentalPropertyCalculator from '@/components/chapters/fundamentals/calculators/RentalPropertyCalculator';
import RealEstateComparisonTool from '@/components/chapters/fundamentals/calculators/RealEstateComparisonTool';

// Mock the progress store
jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: () => ({
    recordCalculatorUsage: jest.fn(),
    userProgress: {
      completedLessons: [],
      completedChapters: [],
      unlockedChapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
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

// Mock Recharts to avoid canvas issues in tests
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

describe('Chapter 12: Real Estate & Property Investment', () => {
  describe('Chapter Layout', () => {
    it('renders with proper structure', () => {
      render(<Chapter12Page />);
      
      expect(screen.getByText(/Real Estate & Property Investment/i)).toBeInTheDocument();
      expect(screen.getByText(/Learn real estate investing/i)).toBeInTheDocument();
      
      // Check calculator tabs
      expect(screen.getByText(/Property Investment Analyzer/i)).toBeInTheDocument();
      expect(screen.getByText(/BRRRR Strategy Calculator/i)).toBeInTheDocument();
      expect(screen.getByText(/Rental Property Calculator/i)).toBeInTheDocument();
      expect(screen.getByText(/Property Comparison Tool/i)).toBeInTheDocument();
    });

    it('has proper tab navigation', async () => {
      render(<Chapter12Page />);
      
      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(4);

      // Test tab switching
      await userEvent.click(tabs[1]); // Click BRRRR Strategy tab
      expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
      
      await userEvent.click(tabs[2]); // Click Rental Property tab
      expect(tabs[2]).toHaveAttribute('aria-selected', 'true');
    });
  });

  describe('Property Investment Analyzer', () => {
    it('handles property value inputs', async () => {
      render(<PropertyInvestmentAnalyzer />);
      
      const purchasePriceInput = screen.getByLabelText(/Purchase Price/i);
      await userEvent.type(purchasePriceInput, '300000');
      
      expect(purchasePriceInput).toHaveValue('300000');
    });

    it('calculates investment metrics', async () => {
      render(<PropertyInvestmentAnalyzer />);
      
      // Fill required inputs
      const inputs = {
        'Purchase Price': '300000',
        'Down Payment': '60000',
        'Interest Rate': '4.5',
        'Loan Term': '30',
      };

      for (const [label, value] of Object.entries(inputs)) {
        const input = screen.getByLabelText(new RegExp(label, 'i'));
        await userEvent.type(input, value);
      }

      // Trigger calculation
      const calculateButton = screen.getByRole('button', { name: /calculate/i });
      await userEvent.click(calculateButton);

      // Check for results
      await waitFor(() => {
        expect(screen.getByText(/Monthly Payment/i)).toBeInTheDocument();
      });
    });
  });

  describe('BRRRR Strategy Calculator', () => {
    it('handles multi-step input process', async () => {
      render(<BRRRRStrategyCalculator />);
      
      // Test Buy phase inputs
      const purchasePriceInput = screen.getByLabelText(/Purchase Price/i);
      await userEvent.type(purchasePriceInput, '200000');
      
      // Test Rehab phase inputs
      const rehabCostInput = screen.getByLabelText(/Rehab Cost/i);
      await userEvent.type(rehabCostInput, '50000');

      expect(purchasePriceInput).toHaveValue('200000');
      expect(rehabCostInput).toHaveValue('50000');
    });

    it('shows strategy analysis', async () => {
      render(<BRRRRStrategyCalculator />);
      
      // Fill required inputs
      const inputs = {
        'Purchase Price': '200000',
        'Rehab Cost': '50000',
        'After Repair Value': '300000',
        'Monthly Rent': '2500',
      };

      for (const [label, value] of Object.entries(inputs)) {
        const input = screen.getByLabelText(new RegExp(label, 'i'));
        await userEvent.type(input, value);
      }

      // Trigger analysis
      const analyzeButton = screen.getByRole('button', { name: /analyze/i });
      await userEvent.click(analyzeButton);

      // Check for analysis results
      await waitFor(() => {
        expect(screen.getByText(/ROI/i)).toBeInTheDocument();
      });
    });
  });

  describe('Rental Property Calculator', () => {
    it('calculates rental income and expenses', async () => {
      render(<RentalPropertyCalculator />);
      
      // Fill income inputs
      const rentInput = screen.getByLabelText(/Monthly Rent/i);
      await userEvent.type(rentInput, '2000');

      // Fill expense inputs
      const mortgageInput = screen.getByLabelText(/Monthly Mortgage/i);
      await userEvent.type(mortgageInput, '1200');

      // Trigger calculation
      const calculateButton = screen.getByRole('button', { name: /calculate/i });
      await userEvent.click(calculateButton);

      // Check for cash flow results
      await waitFor(() => {
        expect(screen.getByText(/Cash Flow/i)).toBeInTheDocument();
      });
    });

    it('shows profitability metrics', async () => {
      render(<RentalPropertyCalculator />);
      
      // Fill required inputs
      const inputs = {
        'Monthly Rent': '2000',
        'Monthly Mortgage': '1200',
        'Property Taxes': '200',
        'Insurance': '100',
      };

      for (const [label, value] of Object.entries(inputs)) {
        const input = screen.getByLabelText(new RegExp(label, 'i'));
        await userEvent.type(input, value);
      }

      // Trigger calculation
      const calculateButton = screen.getByRole('button', { name: /calculate/i });
      await userEvent.click(calculateButton);

      // Check for profitability metrics
      await waitFor(() => {
        expect(screen.getByText(/Cap Rate/i)).toBeInTheDocument();
        expect(screen.getByText(/Cash on Cash Return/i)).toBeInTheDocument();
      });
    });
  });

  describe('Real Estate Comparison Tool', () => {
    it('compares multiple properties', async () => {
      render(<RealEstateComparisonTool />);
      
      // Add first property
      const addPropertyButton = screen.getByRole('button', { name: /add property/i });
      await userEvent.click(addPropertyButton);

      // Fill property details
      const inputs = {
        'Property Name': 'Test Property 1',
        'Purchase Price': '250000',
        'Monthly Rent': '2000',
      };

      for (const [label, value] of Object.entries(inputs)) {
        const input = screen.getByLabelText(new RegExp(label, 'i'));
        await userEvent.type(input, value);
      }

      // Trigger comparison
      const compareButton = screen.getByRole('button', { name: /compare/i });
      await userEvent.click(compareButton);

      // Check for comparison results
      await waitFor(() => {
        expect(screen.getByText(/Comparison Results/i)).toBeInTheDocument();
      });
    });

    it('ranks properties by different metrics', async () => {
      render(<RealEstateComparisonTool />);
      
      // Add properties
      const addPropertyButton = screen.getByRole('button', { name: /add property/i });
      await userEvent.click(addPropertyButton);
      await userEvent.click(addPropertyButton);

      // Fill property details
      const properties = [
        {
          'Property Name': 'Property 1',
          'Purchase Price': '200000',
          'Monthly Rent': '1800',
        },
        {
          'Property Name': 'Property 2',
          'Purchase Price': '250000',
          'Monthly Rent': '2200',
        },
      ];

      for (const [index, property] of properties.entries()) {
        for (const [label, value] of Object.entries(property)) {
          const inputs = screen.getAllByLabelText(new RegExp(label, 'i'));
          await userEvent.type(inputs[index], value);
        }
      }

      // Trigger comparison
      const compareButton = screen.getByRole('button', { name: /compare/i });
      await userEvent.click(compareButton);

      // Check for ranking options
      await waitFor(() => {
        expect(screen.getByText(/Sort by/i)).toBeInTheDocument();
      });
    });
  });

  describe('Lesson Component', () => {
    it('displays lesson content', () => {
      render(<RealEstateAlternativesLessonEnhanced />);
      
      expect(screen.getByText(/Real Estate Investment/i)).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('tracks lesson progress', async () => {
      const mockOnComplete = jest.fn();
      render(<RealEstateAlternativesLessonEnhanced onComplete={mockOnComplete} />);

      // Navigate through lesson
      const nextButton = screen.getByRole('button', { name: /next/i });
      await userEvent.click(nextButton);

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });

  describe('Quiz Component', () => {
    it('displays quiz questions', () => {
      render(<RealEstateAlternativesQuizEnhanced />);
      
      expect(screen.getByText(/Quiz/i)).toBeInTheDocument();
      expect(screen.getByRole('form')).toBeInTheDocument();
    });

    it('handles answer submission', async () => {
      render(<RealEstateAlternativesQuizEnhanced />);
      
      // Find and select an answer
      const answers = screen.getAllByRole('radio');
      await userEvent.click(answers[0]);

      // Submit answer
      const submitButton = screen.getByRole('button', { name: /submit/i });
      await userEvent.click(submitButton);

      // Check for feedback
      await waitFor(() => {
        expect(screen.getByText(/Feedback/i)).toBeInTheDocument();
      });
    });
  });
});

