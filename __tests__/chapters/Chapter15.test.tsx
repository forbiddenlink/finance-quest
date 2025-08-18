import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Chapter15Page from '@/app/chapter15/page';
import AlternativeInvestmentsLessonEnhanced from '@/components/chapters/fundamentals/lessons/AlternativeInvestmentsLessonEnhanced';
import AlternativeInvestmentsQuizEnhanced from '@/components/chapters/fundamentals/quizzes/AlternativeInvestmentsQuizEnhanced';
import REITInvestmentAnalyzer from '@/components/shared/calculators/REITInvestmentAnalyzer';
import CommodityPortfolioBuilder from '@/components/shared/calculators/CommodityPortfolioBuilder';
import CryptocurrencyAllocationCalculator from '@/components/shared/calculators/CryptocurrencyAllocationCalculator';
import PortfolioAnalyzerCalculator from '@/components/shared/calculators/PortfolioAnalyzerCalculator';

// Mock the progress store
jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: () => ({
    recordCalculatorUsage: jest.fn(),
    userProgress: {
      completedLessons: [],
      completedChapters: [],
      unlockedChapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
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

describe('Chapter 15: Alternative Investments', () => {
  describe('Accessibility and Structure', () => {
    it('has proper heading hierarchy', () => {
      render(<Chapter15Page />);
      
      const mainHeading = screen.getByRole('heading', {
        level: 1,
        name: /Alternative Investments/i
      });
      expect(mainHeading).toBeInTheDocument();
      
      const subHeadings = screen.getAllByRole('heading', { level: 2 });
      expect(subHeadings.length).toBeGreaterThan(0);
    });

    it('has accessible navigation', () => {
      render(<Chapter15Page />);
      
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
      render(<Chapter15Page />);
      
      const tabs = screen.getAllByRole('tab');
      const firstTab = tabs[0];
      const secondTab = tabs[1];
      
      firstTab.focus();
      expect(firstTab).toHaveFocus();
      
      await userEvent.keyboard('{arrowright}');
      expect(secondTab).toHaveFocus();
    });
  });

  describe('REIT Investment Analyzer', () => {
    it('has accessible form controls', () => {
      render(<REITInvestmentAnalyzer />);
      
      const inputs = screen.getAllByRole('spinbutton');
      inputs.forEach(input => {
        expect(input).toHaveAttribute('aria-label');
        expect(input).toHaveAttribute('aria-describedby');
      });
    });

    it('calculates REIT metrics', async () => {
      render(<REITInvestmentAnalyzer />);
      
      // Fill required inputs
      const inputs = {
        'Share Price': '100',
        'Annual Dividend': '5',
        'FFO per Share': '8',
        'Occupancy Rate': '95',
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
        expect(screen.getByText(/Dividend Yield/i)).toBeInTheDocument();
        expect(screen.getByText(/P\/FFO Ratio/i)).toBeInTheDocument();
      });
    });

    it('performs property analysis', async () => {
      render(<REITInvestmentAnalyzer />);
      
      // Add property
      const addPropertyButton = screen.getByRole('button', { name: /add property/i });
      await userEvent.click(addPropertyButton);

      // Fill property details
      const inputs = {
        'Property Type': 'Commercial',
        'Square Footage': '50000',
        'Annual Revenue': '1000000',
      };

      for (const [label, value] of Object.entries(inputs)) {
        const input = screen.getByLabelText(new RegExp(label, 'i'));
        await userEvent.type(input, value);
      }

      // Analyze property
      const analyzeButton = screen.getByRole('button', { name: /analyze property/i });
      await userEvent.click(analyzeButton);

      // Check analysis results
      await waitFor(() => {
        expect(screen.getByText(/Revenue per Square Foot/i)).toBeInTheDocument();
        expect(screen.getByText(/Property Performance/i)).toBeInTheDocument();
      });
    });
  });

  describe('Commodity Portfolio Builder', () => {
    it('has accessible portfolio configuration', () => {
      render(<CommodityPortfolioBuilder />);
      
      const form = screen.getByRole('form');
      expect(form).toHaveAttribute('aria-label');
      
      const inputs = screen.getAllByRole('spinbutton');
      inputs.forEach(input => {
        expect(input).toHaveAttribute('aria-label');
      });
    });

    it('builds commodity portfolio', async () => {
      render(<CommodityPortfolioBuilder />);
      
      // Add commodities
      const addCommodityButton = screen.getByRole('button', { name: /add commodity/i });
      await userEvent.click(addCommodityButton);
      await userEvent.click(addCommodityButton);

      // Fill commodity details
      const commodities = [
        {
          'Commodity': 'Gold',
          'Allocation': '40',
          'Expected Return': '5',
        },
        {
          'Commodity': 'Silver',
          'Allocation': '60',
          'Expected Return': '7',
        },
      ];

      for (const [index, commodity] of commodities.entries()) {
        for (const [label, value] of Object.entries(commodity)) {
          const inputs = screen.getAllByLabelText(new RegExp(label, 'i'));
          await userEvent.type(inputs[index], value);
        }
      }

      // Build portfolio
      const buildButton = screen.getByRole('button', { name: /build portfolio/i });
      await userEvent.click(buildButton);

      // Check portfolio metrics
      await waitFor(() => {
        expect(screen.getByText(/Portfolio Return/i)).toBeInTheDocument();
        expect(screen.getByText(/Volatility/i)).toBeInTheDocument();
      });
    });

    it('shows correlation analysis', async () => {
      render(<CommodityPortfolioBuilder />);
      
      // Add commodities and build portfolio
      const addCommodityButton = screen.getByRole('button', { name: /add commodity/i });
      await userEvent.click(addCommodityButton);

      const inputs = {
        'Commodity': 'Gold',
        'Allocation': '100',
      };

      for (const [label, value] of Object.entries(inputs)) {
        const input = screen.getByLabelText(new RegExp(label, 'i'));
        await userEvent.type(input, value);
      }

      const buildButton = screen.getByRole('button', { name: /build portfolio/i });
      await userEvent.click(buildButton);

      // Check correlation analysis
      await waitFor(() => {
        expect(screen.getByText(/Market Correlation/i)).toBeInTheDocument();
        expect(screen.getByText(/Inflation Correlation/i)).toBeInTheDocument();
      });
    });
  });

  describe('Cryptocurrency Allocation Calculator', () => {
    it('has accessible risk assessment form', () => {
      render(<CryptocurrencyAllocationCalculator />);
      
      const form = screen.getByRole('form');
      expect(form).toHaveAttribute('aria-label');
      
      const riskInputs = screen.getAllByRole('radio');
      riskInputs.forEach(input => {
        expect(input).toHaveAttribute('aria-label');
      });
    });

    it('calculates crypto allocation', async () => {
      render(<CryptocurrencyAllocationCalculator />);
      
      // Fill portfolio details
      const inputs = {
        'Total Portfolio Value': '100000',
        'Risk Tolerance': 'Moderate',
        'Investment Horizon': '5',
      };

      for (const [label, value] of Object.entries(inputs)) {
        const input = screen.getByLabelText(new RegExp(label, 'i'));
        if (input.type === 'radio') {
          await userEvent.click(input);
        } else {
          await userEvent.clear(input);
          await userEvent.type(input, value);
        }
      }

      // Calculate allocation
      const calculateButton = screen.getByRole('button', { name: /calculate/i });
      await userEvent.click(calculateButton);

      // Check allocation results
      await waitFor(() => {
        expect(screen.getByText(/Recommended Allocation/i)).toBeInTheDocument();
        expect(screen.getByText(/Risk Analysis/i)).toBeInTheDocument();
      });
    });

    it('performs volatility analysis', async () => {
      render(<CryptocurrencyAllocationCalculator />);
      
      // Add crypto assets
      const addAssetButton = screen.getByRole('button', { name: /add asset/i });
      await userEvent.click(addAssetButton);

      // Fill asset details
      const inputs = {
        'Asset Name': 'Bitcoin',
        'Allocation': '5',
        'Historical Volatility': '75',
      };

      for (const [label, value] of Object.entries(inputs)) {
        const input = screen.getByLabelText(new RegExp(label, 'i'));
        await userEvent.type(input, value);
      }

      // Analyze volatility
      const analyzeButton = screen.getByRole('button', { name: /analyze volatility/i });
      await userEvent.click(analyzeButton);

      // Check analysis results
      await waitFor(() => {
        expect(screen.getByText(/Portfolio Impact/i)).toBeInTheDocument();
        expect(screen.getByText(/Risk Metrics/i)).toBeInTheDocument();
      });
    });
  });

  describe('Portfolio Analyzer Calculator', () => {
    it('has accessible portfolio input form', () => {
      render(<PortfolioAnalyzerCalculator />);
      
      const form = screen.getByRole('form');
      expect(form).toHaveAttribute('aria-label');
      
      const inputs = screen.getAllByRole('spinbutton');
      inputs.forEach(input => {
        expect(input).toHaveAttribute('aria-label');
      });
    });

    it('optimizes portfolio with alternatives', async () => {
      render(<PortfolioAnalyzerCalculator />);
      
      // Add assets
      const addAssetButton = screen.getByRole('button', { name: /add asset/i });
      await userEvent.click(addAssetButton);
      await userEvent.click(addAssetButton);

      // Fill asset details
      const assets = [
        {
          'Asset Type': 'REIT',
          'Allocation': '30',
          'Expected Return': '8',
        },
        {
          'Asset Type': 'Commodity',
          'Allocation': '20',
          'Expected Return': '6',
        },
      ];

      for (const [index, asset] of assets.entries()) {
        for (const [label, value] of Object.entries(asset)) {
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
      render(<PortfolioAnalyzerCalculator />);
      
      // Add asset and optimize
      const addAssetButton = screen.getByRole('button', { name: /add asset/i });
      await userEvent.click(addAssetButton);

      const inputs = {
        'Asset Type': 'REIT',
        'Allocation': '100',
      };

      for (const [label, value] of Object.entries(inputs)) {
        const input = screen.getByLabelText(new RegExp(label, 'i'));
        await userEvent.type(input, value);
      }

      const optimizeButton = screen.getByRole('button', { name: /optimize/i });
      await userEvent.click(optimizeButton);

      // Check risk metrics
      await waitFor(() => {
        expect(screen.getByText(/Risk Contribution/i)).toBeInTheDocument();
        expect(screen.getByText(/Diversification Score/i)).toBeInTheDocument();
      });
    });
  });

  describe('Lesson Component', () => {
    it('has accessible content structure', () => {
      render(<AlternativeInvestmentsLessonEnhanced />);
      
      const sections = screen.getAllByRole('region');
      sections.forEach(section => {
        expect(section).toHaveAttribute('aria-label');
      });
    });

    it('tracks progress accessibly', async () => {
      render(<AlternativeInvestmentsLessonEnhanced />);
      
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow');
      expect(progressBar).toHaveAttribute('aria-valuemin');
      expect(progressBar).toHaveAttribute('aria-valuemax');
    });
  });

  describe('Quiz Component', () => {
    it('has accessible quiz form', () => {
      render(<AlternativeInvestmentsQuizEnhanced />);
      
      const form = screen.getByRole('form');
      expect(form).toHaveAttribute('aria-label');
      
      const radioGroups = screen.getAllByRole('radiogroup');
      radioGroups.forEach(group => {
        expect(group).toHaveAttribute('aria-label');
      });
    });

    it('provides accessible feedback', async () => {
      render(<AlternativeInvestmentsQuizEnhanced />);
      
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
      render(<Chapter15Page />);
      
      // Start with REIT Analysis
      const reitTab = screen.getByRole('tab', { name: /REIT Analysis/i });
      await userEvent.click(reitTab);
      
      // Enter some data
      const input = screen.getByLabelText(/Share Price/i);
      await userEvent.type(input, '100');

      // Switch to Commodities
      const commoditiesTab = screen.getByRole('tab', { name: /Commodities/i });
      await userEvent.click(commoditiesTab);

      // Switch back to REIT Analysis
      await userEvent.click(reitTab);

      // Check if data persists
      expect(input).toHaveValue(100);
    });

    it('synchronizes portfolio data across calculators', async () => {
      render(<Chapter15Page />);
      
      // Add REIT to portfolio
      const reitTab = screen.getByRole('tab', { name: /REIT Analysis/i });
      await userEvent.click(reitTab);
      
      const addToPortfolioButton = screen.getByRole('button', { name: /add to portfolio/i });
      await userEvent.click(addToPortfolioButton);

      // Switch to Portfolio Optimizer
      const portfolioTab = screen.getByRole('tab', { name: /Portfolio Optimizer/i });
      await userEvent.click(portfolioTab);

      // Check if REIT data is reflected
      await waitFor(() => {
        expect(screen.getByText(/REIT Allocation/i)).toBeInTheDocument();
      });
    });

    it('updates risk metrics when adding crypto', async () => {
      render(<Chapter15Page />);
      
      // Configure crypto allocation
      const cryptoTab = screen.getByRole('tab', { name: /Cryptocurrency/i });
      await userEvent.click(cryptoTab);
      
      const allocationInput = screen.getByLabelText(/Allocation/i);
      await userEvent.type(allocationInput, '5');

      // Switch to Portfolio Optimizer
      const portfolioTab = screen.getByRole('tab', { name: /Portfolio Optimizer/i });
      await userEvent.click(portfolioTab);

      // Check if risk metrics update
      await waitFor(() => {
        expect(screen.getByText(/Updated Risk Profile/i)).toBeInTheDocument();
      });
    });
  });
});

