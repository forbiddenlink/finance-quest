import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Chapter13Page from '@/app/chapter13/page';
import StockMarketMasteryLessonEnhanced from '@/components/chapters/fundamentals/lessons/StockMarketMasteryLessonEnhanced';
import StockMarketMasteryQuizEnhanced from '@/components/chapters/fundamentals/quizzes/StockMarketMasteryQuizEnhanced';
import StockValuationCalculator from '@/components/chapters/fundamentals/calculators/StockValuationCalculator';
import OptionsStrategyCalculator from '@/components/chapters/fundamentals/calculators/OptionsStrategyCalculator';
import PortfolioRiskAnalyzer from '@/components/chapters/fundamentals/calculators/PortfolioRiskAnalyzer';
import TechnicalAnalysisTool from '@/components/chapters/fundamentals/calculators/TechnicalAnalysisTool';

// Mock the progress store
jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: () => ({
    recordCalculatorUsage: jest.fn(),
    userProgress: {
      completedLessons: [],
      completedChapters: [],
      unlockedChapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
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

describe('Chapter 13: Stock Market Mastery & Advanced Trading', () => {
  describe('Accessibility and Structure', () => {
    it('has proper heading hierarchy', () => {
      render(<Chapter13Page />);
      
      const mainHeading = screen.getByRole('heading', {
        level: 1,
        name: /Stock Market Mastery & Advanced Trading/i
      });
      expect(mainHeading).toBeInTheDocument();
      
      const subHeadings = screen.getAllByRole('heading', { level: 2 });
      expect(subHeadings.length).toBeGreaterThan(0);
    });

    it('has accessible navigation', () => {
      render(<Chapter13Page />);
      
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
      render(<Chapter13Page />);
      
      const tabs = screen.getAllByRole('tab');
      const firstTab = tabs[0];
      const secondTab = tabs[1];
      
      // Focus first tab
      firstTab.focus();
      expect(firstTab).toHaveFocus();
      
      // Navigate with arrow keys
      await userEvent.keyboard('{arrowright}');
      expect(secondTab).toHaveFocus();
    });
  });

  describe('Stock Valuation Calculator', () => {
    it('has accessible form controls', () => {
      render(<StockValuationCalculator />);
      
      const inputs = screen.getAllByRole('spinbutton');
      inputs.forEach(input => {
        expect(input).toHaveAttribute('aria-label');
        expect(input).toHaveAttribute('aria-describedby');
      });
    });

    it('handles DCF calculation', async () => {
      render(<StockValuationCalculator />);
      
      // Fill required inputs
      const inputs = {
        'Current Free Cash Flow': '1000000',
        'Growth Rate': '10',
        'Discount Rate': '8',
        'Terminal Growth Rate': '2',
      };

      for (const [label, value] of Object.entries(inputs)) {
        const input = screen.getByLabelText(new RegExp(label, 'i'));
        await userEvent.clear(input);
        await userEvent.type(input, value);
      }

      // Calculate valuation
      const calculateButton = screen.getByRole('button', { name: /calculate/i });
      await userEvent.click(calculateButton);

      // Check results
      await waitFor(() => {
        expect(screen.getByText(/Intrinsic Value/i)).toBeInTheDocument();
      });
    });

    it('provides error feedback', async () => {
      render(<StockValuationCalculator />);
      
      // Enter invalid input
      const input = screen.getByLabelText(/Growth Rate/i);
      await userEvent.clear(input);
      await userEvent.type(input, '1000');

      // Try to calculate
      const calculateButton = screen.getByRole('button', { name: /calculate/i });
      await userEvent.click(calculateButton);

      // Check for error message
      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });
    });
  });

  describe('Options Strategy Calculator', () => {
    it('has accessible option chain display', () => {
      render(<OptionsStrategyCalculator />);
      
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
      expect(table).toHaveAttribute('aria-label');
    });

    it('calculates option prices', async () => {
      render(<OptionsStrategyCalculator />);
      
      // Fill required inputs
      const inputs = {
        'Stock Price': '100',
        'Strike Price': '105',
        'Time to Expiration': '30',
        'Volatility': '25',
        'Risk-Free Rate': '2',
      };

      for (const [label, value] of Object.entries(inputs)) {
        const input = screen.getByLabelText(new RegExp(label, 'i'));
        await userEvent.clear(input);
        await userEvent.type(input, value);
      }

      // Calculate option price
      const calculateButton = screen.getByRole('button', { name: /calculate/i });
      await userEvent.click(calculateButton);

      // Check results
      await waitFor(() => {
        expect(screen.getByText(/Call Price/i)).toBeInTheDocument();
        expect(screen.getByText(/Put Price/i)).toBeInTheDocument();
      });
    });

    it('displays strategy payoff diagram', async () => {
      render(<OptionsStrategyCalculator />);
      
      // Select strategy
      const strategySelect = screen.getByLabelText(/Strategy/i);
      await userEvent.selectOptions(strategySelect, ['Bull Call Spread']);

      // Check for chart
      expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    });
  });

  describe('Portfolio Risk Analyzer', () => {
    it('has accessible portfolio input form', () => {
      render(<PortfolioRiskAnalyzer />);
      
      const form = screen.getByRole('form');
      expect(form).toHaveAttribute('aria-label');
      
      const inputs = screen.getAllByRole('spinbutton');
      inputs.forEach(input => {
        expect(input).toHaveAttribute('aria-label');
      });
    });

    it('calculates portfolio metrics', async () => {
      render(<PortfolioRiskAnalyzer />);
      
      // Add assets
      const addAssetButton = screen.getByRole('button', { name: /add asset/i });
      await userEvent.click(addAssetButton);
      await userEvent.click(addAssetButton);

      // Fill asset details
      const weightInputs = screen.getAllByLabelText(/Weight/i);
      const returnInputs = screen.getAllByLabelText(/Expected Return/i);
      const riskInputs = screen.getAllByLabelText(/Risk/i);

      await userEvent.type(weightInputs[0], '60');
      await userEvent.type(returnInputs[0], '8');
      await userEvent.type(riskInputs[0], '15');

      await userEvent.type(weightInputs[1], '40');
      await userEvent.type(returnInputs[1], '4');
      await userEvent.type(riskInputs[1], '8');

      // Calculate metrics
      const calculateButton = screen.getByRole('button', { name: /analyze/i });
      await userEvent.click(calculateButton);

      // Check results
      await waitFor(() => {
        expect(screen.getByText(/Portfolio Return/i)).toBeInTheDocument();
        expect(screen.getByText(/Portfolio Risk/i)).toBeInTheDocument();
        expect(screen.getByText(/Sharpe Ratio/i)).toBeInTheDocument();
      });
    });
  });

  describe('Technical Analysis Tool', () => {
    it('has accessible chart controls', () => {
      render(<TechnicalAnalysisTool />);
      
      const controls = screen.getAllByRole('button');
      controls.forEach(control => {
        expect(control).toHaveAttribute('aria-label');
      });
    });

    it('displays technical indicators', async () => {
      render(<TechnicalAnalysisTool />);
      
      // Select indicators
      const rsiCheckbox = screen.getByLabelText(/RSI/i);
      const macdCheckbox = screen.getByLabelText(/MACD/i);
      
      await userEvent.click(rsiCheckbox);
      await userEvent.click(macdCheckbox);

      // Check for indicator displays
      expect(screen.getByText(/RSI/i)).toBeInTheDocument();
      expect(screen.getByText(/MACD/i)).toBeInTheDocument();
    });

    it('generates trading signals', async () => {
      render(<TechnicalAnalysisTool />);
      
      // Configure signals
      const periodInput = screen.getByLabelText(/Period/i);
      await userEvent.clear(periodInput);
      await userEvent.type(periodInput, '14');

      // Generate signals
      const generateButton = screen.getByRole('button', { name: /generate signals/i });
      await userEvent.click(generateButton);

      // Check for signals
      await waitFor(() => {
        expect(screen.getByText(/Buy Signal/i)).toBeInTheDocument();
        expect(screen.getByText(/Sell Signal/i)).toBeInTheDocument();
      });
    });
  });

  describe('Lesson Component', () => {
    it('has accessible content structure', () => {
      render(<StockMarketMasteryLessonEnhanced />);
      
      const sections = screen.getAllByRole('region');
      sections.forEach(section => {
        expect(section).toHaveAttribute('aria-label');
      });
    });

    it('tracks progress accessibly', async () => {
      render(<StockMarketMasteryLessonEnhanced />);
      
      const progressBar = screen.getByRole('progressbar');
      expect(progressBar).toHaveAttribute('aria-valuenow');
      expect(progressBar).toHaveAttribute('aria-valuemin');
      expect(progressBar).toHaveAttribute('aria-valuemax');
    });
  });

  describe('Quiz Component', () => {
    it('has accessible quiz form', () => {
      render(<StockMarketMasteryQuizEnhanced />);
      
      const form = screen.getByRole('form');
      expect(form).toHaveAttribute('aria-label');
      
      const radioGroups = screen.getAllByRole('radiogroup');
      radioGroups.forEach(group => {
        expect(group).toHaveAttribute('aria-label');
      });
    });

    it('provides accessible feedback', async () => {
      render(<StockMarketMasteryQuizEnhanced />);
      
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
      render(<Chapter13Page />);
      
      // Start with Stock Valuation
      const stockTab = screen.getByRole('tab', { name: /Stock Valuation/i });
      await userEvent.click(stockTab);
      
      // Enter some data
      const input = screen.getByLabelText(/Current Free Cash Flow/i);
      await userEvent.type(input, '1000000');

      // Switch to Options Strategy
      const optionsTab = screen.getByRole('tab', { name: /Options Strategy/i });
      await userEvent.click(optionsTab);

      // Switch back to Stock Valuation
      await userEvent.click(stockTab);

      // Check if data persists
      expect(input).toHaveValue(1000000);
    });

    it('synchronizes related calculations', async () => {
      render(<Chapter13Page />);
      
      // Calculate stock value
      const stockTab = screen.getByRole('tab', { name: /Stock Valuation/i });
      await userEvent.click(stockTab);
      
      const priceInput = screen.getByLabelText(/Current Free Cash Flow/i);
      await userEvent.type(priceInput, '1000000');
      
      const calculateButton = screen.getByRole('button', { name: /calculate/i });
      await userEvent.click(calculateButton);

      // Switch to Options and check if stock price is pre-filled
      const optionsTab = screen.getByRole('tab', { name: /Options Strategy/i });
      await userEvent.click(optionsTab);

      await waitFor(() => {
        const stockPriceInput = screen.getByLabelText(/Stock Price/i);
        expect(stockPriceInput).not.toHaveValue('0');
      });
    });

    it('updates portfolio risk when market data changes', async () => {
      render(<Chapter13Page />);
      
      // Go to Portfolio Risk
      const portfolioTab = screen.getByRole('tab', { name: /Portfolio Risk/i });
      await userEvent.click(portfolioTab);

      // Add market data
      const addAssetButton = screen.getByRole('button', { name: /add asset/i });
      await userEvent.click(addAssetButton);
      
      const weightInput = screen.getByLabelText(/Weight/i);
      const returnInput = screen.getByLabelText(/Expected Return/i);
      await userEvent.type(weightInput, '100');
      await userEvent.type(returnInput, '10');

      // Switch to Technical Analysis
      const technicalTab = screen.getByRole('tab', { name: /Technical Analysis/i });
      await userEvent.click(technicalTab);

      // Generate signals
      const generateButton = screen.getByRole('button', { name: /generate signals/i });
      await userEvent.click(generateButton);

      // Check if Portfolio Risk updates
      await userEvent.click(portfolioTab);
      
      await waitFor(() => {
        expect(screen.getByText(/Market Conditions/i)).toBeInTheDocument();
      });
    });
  });
});

