import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Chapter14Page from '@/app/chapter14/page';
import BondFixedIncomeLessonEnhanced from '@/components/chapters/fundamentals/lessons/BondFixedIncomeLessonEnhanced';
import BondFixedIncomeQuizEnhanced from '@/components/chapters/fundamentals/quizzes/BondFixedIncomeQuizEnhanced';
import AdvancedBondPricingCalculator from '@/components/shared/calculators/AdvancedBondPricingCalculator';
import YieldCurveAnalyzer from '@/components/shared/calculators/YieldCurveAnalyzer';
import BondLadderBuilder from '@/components/shared/calculators/BondLadderBuilder';
import FixedIncomePortfolioOptimizer from '@/components/shared/calculators/FixedIncomePortfolioOptimizer';

// Mock the progress store
jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: () => ({
    recordCalculatorUsage: jest.fn(),
    userProgress: {
      completedLessons: [],
      completedChapters: [],
      unlockedChapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
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

describe('Chapter 14: Bonds & Fixed Income Mastery', () => {
  describe('Accessibility and Structure', () => {
    it('has proper heading hierarchy', () => {
      render(<Chapter14Page />);
      
      const mainHeading = screen.getByRole('heading', {
        level: 1,
        name: /Bonds & Fixed Income Mastery/i
      });
      expect(mainHeading).toBeInTheDocument();
      
      const subHeadings = screen.getAllByRole('heading', { level: 2 });
      expect(subHeadings.length).toBeGreaterThan(0);
    });

    it('has accessible navigation', () => {
      render(<Chapter14Page />);
      
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
      render(<Chapter14Page />);
      
      const tabs = screen.getAllByRole('tab');
      const firstTab = tabs[0];
      const secondTab = tabs[1];
      
      firstTab.focus();
      expect(firstTab).toHaveFocus();
      
      await userEvent.keyboard('{arrowright}');
      expect(secondTab).toHaveFocus();
    });
  });

  describe('Advanced Bond Pricing Calculator', () => {
    it('has accessible form controls', () => {
      render(<AdvancedBondPricingCalculator />);
      
      const inputs = screen.getAllByRole('spinbutton');
      inputs.forEach(input => {
        expect(input).toHaveAttribute('aria-label');
        expect(input).toHaveAttribute('aria-describedby');
      });
    });

    it('calculates bond price and yield', async () => {
      render(<AdvancedBondPricingCalculator />);
      
      // Fill required inputs
      const inputs = {
        'Face Value': '1000',
        'Coupon Rate': '5',
        'Years to Maturity': '10',
        'Market Interest Rate': '4',
      };

      for (const [label, value] of Object.entries(inputs)) {
        const input = screen.getByLabelText(new RegExp(label, 'i'));
        await userEvent.clear(input);
        await userEvent.type(input, value);
      }

      // Calculate
      const calculateButton = screen.getByRole('button', { name: /calculate/i });
      await userEvent.click(calculateButton);

      // Check results
      await waitFor(() => {
        expect(screen.getByText(/Bond Price/i)).toBeInTheDocument();
        expect(screen.getByText(/Yield to Maturity/i)).toBeInTheDocument();
      });
    });

    it('calculates duration and convexity', async () => {
      render(<AdvancedBondPricingCalculator />);
      
      // Fill inputs
      const inputs = {
        'Face Value': '1000',
        'Coupon Rate': '5',
        'Years to Maturity': '10',
        'Market Interest Rate': '4',
      };

      for (const [label, value] of Object.entries(inputs)) {
        const input = screen.getByLabelText(new RegExp(label, 'i'));
        await userEvent.clear(input);
        await userEvent.type(input, value);
      }

      // Calculate
      const calculateButton = screen.getByRole('button', { name: /calculate/i });
      await userEvent.click(calculateButton);

      // Check advanced metrics
      await waitFor(() => {
        expect(screen.getByText(/Modified Duration/i)).toBeInTheDocument();
        expect(screen.getByText(/Convexity/i)).toBeInTheDocument();
      });
    });
  });

  describe('Yield Curve Analyzer', () => {
    it('has accessible chart controls', () => {
      render(<YieldCurveAnalyzer />);
      
      const controls = screen.getAllByRole('button');
      controls.forEach(control => {
        expect(control).toHaveAttribute('aria-label');
      });
    });

    it('displays yield curve data', async () => {
      render(<YieldCurveAnalyzer />);
      
      // Select time period
      const periodSelect = screen.getByLabelText(/Time Period/i);
      await userEvent.selectOptions(periodSelect, ['1Y']);

      // Check for chart
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });

    it('provides curve analysis', async () => {
      render(<YieldCurveAnalyzer />);
      
      // Analyze curve
      const analyzeButton = screen.getByRole('button', { name: /analyze/i });
      await userEvent.click(analyzeButton);

      // Check analysis results
      await waitFor(() => {
        expect(screen.getByText(/Curve Shape/i)).toBeInTheDocument();
        expect(screen.getByText(/Economic Implications/i)).toBeInTheDocument();
      });
    });
  });

  describe('Bond Ladder Builder', () => {
    it('has accessible ladder configuration', () => {
      render(<BondLadderBuilder />);
      
      const form = screen.getByRole('form');
      expect(form).toHaveAttribute('aria-label');
      
      const inputs = screen.getAllByRole('spinbutton');
      inputs.forEach(input => {
        expect(input).toHaveAttribute('aria-label');
      });
    });

    it('builds bond ladder', async () => {
      render(<BondLadderBuilder />);
      
      // Configure ladder
      const inputs = {
        'Total Investment': '100000',
        'Number of Rungs': '5',
        'Maximum Maturity': '10',
      };

      for (const [label, value] of Object.entries(inputs)) {
        const input = screen.getByLabelText(new RegExp(label, 'i'));
        await userEvent.clear(input);
        await userEvent.type(input, value);
      }

      // Build ladder
      const buildButton = screen.getByRole('button', { name: /build ladder/i });
      await userEvent.click(buildButton);

      // Check ladder structure
      await waitFor(() => {
        expect(screen.getByText(/Ladder Structure/i)).toBeInTheDocument();
        expect(screen.getByText(/Income Schedule/i)).toBeInTheDocument();
      });
    });

    it('shows reinvestment opportunities', async () => {
      render(<BondLadderBuilder />);
      
      // Configure and build ladder
      const inputs = {
        'Total Investment': '100000',
        'Number of Rungs': '5',
      };

      for (const [label, value] of Object.entries(inputs)) {
        const input = screen.getByLabelText(new RegExp(label, 'i'));
        await userEvent.clear(input);
        await userEvent.type(input, value);
      }

      const buildButton = screen.getByRole('button', { name: /build ladder/i });
      await userEvent.click(buildButton);

      // Check reinvestment analysis
      await waitFor(() => {
        expect(screen.getByText(/Reinvestment Schedule/i)).toBeInTheDocument();
        expect(screen.getByText(/Interest Rate Scenarios/i)).toBeInTheDocument();
      });
    });
  });

  describe('Fixed Income Portfolio Optimizer', () => {
    it('has accessible portfolio input form', () => {
      render(<FixedIncomePortfolioOptimizer />);
      
      const form = screen.getByRole('form');
      expect(form).toHaveAttribute('aria-label');
      
      const inputs = screen.getAllByRole('spinbutton');
      inputs.forEach(input => {
        expect(input).toHaveAttribute('aria-label');
      });
    });

    it('optimizes portfolio allocation', async () => {
      render(<FixedIncomePortfolioOptimizer />);
      
      // Add bonds
      const addBondButton = screen.getByRole('button', { name: /add bond/i });
      await userEvent.click(addBondButton);
      await userEvent.click(addBondButton);

      // Fill bond details
      const bonds = [
        {
          'Bond Name': 'Treasury 10Y',
          'Yield': '4',
          'Duration': '9.5',
          'Credit Rating': 'AAA',
        },
        {
          'Bond Name': 'Corporate 5Y',
          'Yield': '5.5',
          'Duration': '4.8',
          'Credit Rating': 'BBB',
        },
      ];

      for (const [index, bond] of bonds.entries()) {
        for (const [label, value] of Object.entries(bond)) {
          const inputs = screen.getAllByLabelText(new RegExp(label, 'i'));
          await userEvent.type(inputs[index], value);
        }
      }

      // Optimize portfolio
      const optimizeButton = screen.getByRole('button', { name: /optimize/i });
      await userEvent.click(optimizeButton);

      // Check optimization results
      await waitFor(() => {
        expect(screen.getByText(/Optimal Allocation/i)).toBeInTheDocument();
        expect(screen.getByText(/Portfolio Metrics/i)).toBeInTheDocument();
      });
    });

    it('performs risk analysis', async () => {
      render(<FixedIncomePortfolioOptimizer />);
      
      // Add bonds and optimize
      const addBondButton = screen.getByRole('button', { name: /add bond/i });
      await userEvent.click(addBondButton);

      const inputs = {
        'Bond Name': 'Treasury 10Y',
        'Yield': '4',
        'Duration': '9.5',
      };

      for (const [label, value] of Object.entries(inputs)) {
        const input = screen.getByLabelText(new RegExp(label, 'i'));
        await userEvent.type(input, value);
      }

      const optimizeButton = screen.getByRole('button', { name: /optimize/i });
      await userEvent.click(optimizeButton);

      // Check risk metrics
      await waitFor(() => {
        expect(screen.getByText(/Interest Rate Risk/i)).toBeInTheDocument();
        expect(screen.getByText(/Credit Risk/i)).toBeInTheDocument();
      });
    });
  });

  describe('Lesson Component', () => {
    it('has accessible content structure', () => {
      render(<BondFixedIncomeLessonEnhanced />);
      
      const sections = screen.getAllByRole('region');
      sections.forEach(section => {
        expect(section).toHaveAttribute('aria-label');
      });
    });

    it('tracks progress accessibly', async () => {
      render(<BondFixedIncomeLessonEnhanced />);
      
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow');
      expect(progressBar).toHaveAttribute('aria-valuemin');
      expect(progressBar).toHaveAttribute('aria-valuemax');
    });
  });

  describe('Quiz Component', () => {
    it('has accessible quiz form', () => {
      render(<BondFixedIncomeQuizEnhanced />);
      
      const form = screen.getByRole('form');
      expect(form).toHaveAttribute('aria-label');
      
      const radioGroups = screen.getAllByRole('radiogroup');
      radioGroups.forEach(group => {
        expect(group).toHaveAttribute('aria-label');
      });
    });

    it('provides accessible feedback', async () => {
      render(<BondFixedIncomeQuizEnhanced />);
      
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
      render(<Chapter14Page />);
      
      // Start with Bond Pricing
      const bondTab = screen.getByRole('tab', { name: /Bond Pricing/i });
      await userEvent.click(bondTab);
      
      // Enter some data
      const input = screen.getByLabelText(/Face Value/i);
      await userEvent.type(input, '1000');

      // Switch to Yield Curve
      const yieldTab = screen.getByRole('tab', { name: /Yield Curve/i });
      await userEvent.click(yieldTab);

      // Switch back to Bond Pricing
      await userEvent.click(bondTab);

      // Check if data persists
      expect(input).toHaveValue(1000);
    });

    it('synchronizes yield curve data with portfolio optimizer', async () => {
      render(<Chapter14Page />);
      
      // Analyze yield curve
      const yieldTab = screen.getByRole('tab', { name: /Yield Curve/i });
      await userEvent.click(yieldTab);
      
      const analyzeButton = screen.getByRole('button', { name: /analyze/i });
      await userEvent.click(analyzeButton);

      // Switch to Portfolio Optimizer
      const portfolioTab = screen.getByRole('tab', { name: /Portfolio Optimizer/i });
      await userEvent.click(portfolioTab);

      // Check if yield data is reflected
      await waitFor(() => {
        expect(screen.getByText(/Market Environment/i)).toBeInTheDocument();
      });
    });

    it('updates bond ladder based on yield curve changes', async () => {
      render(<Chapter14Page />);
      
      // Set yield curve
      const yieldTab = screen.getByRole('tab', { name: /Yield Curve/i });
      await userEvent.click(yieldTab);
      
      const periodSelect = screen.getByLabelText(/Time Period/i);
      await userEvent.selectOptions(periodSelect, ['1Y']);

      // Switch to Bond Ladder
      const ladderTab = screen.getByRole('tab', { name: /Bond Ladder/i });
      await userEvent.click(ladderTab);

      // Check if yields are reflected
      await waitFor(() => {
        expect(screen.getByText(/Current Yields/i)).toBeInTheDocument();
      });
    });
  });
});

