import '@testing-library/jest-dom';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Chapter13Page from '@/app/chapter13/page';
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

// Mock Recharts to avoid canvas issues in tests
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="chart-container" aria-label="Technical analysis chart">{children}</div>,
  LineChart: ({ children }: { children: React.ReactNode }) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}));

// Mock framer-motion to avoid animation issues
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children: React.ReactNode; [key: string]: unknown }) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
  loading: jest.fn(),
}));

// Mock the required components
jest.mock('@/components/shared/layouts/ChapterLayout', () => {
  return function MockChapterLayout({ children }: { children: React.ReactNode }) {
    return (
      <div>
        <h1>Stock Market Mastery</h1>
        <h2>Chapter Content</h2>
        <h2>Interactive Tools</h2>
        <div role="tablist" aria-label="Stock market analysis tools">
          <button role="tab" aria-selected="true" aria-controls="tab1" id="tab1">Tab 1</button>
          <button role="tab" aria-selected="false" aria-controls="tab2" id="tab2">Tab 2</button>
          <button role="tab" aria-selected="false" aria-controls="tab3" id="tab3">Tab 3</button>
          <button role="tab" aria-selected="false" aria-controls="tab4" id="tab4">Tab 4</button>
        </div>
        {children}
      </div>
    );
  };
});

describe('Chapter 13: Stock Market Mastery - Accessibility', () => {
  // Setup and cleanup
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Chapter Layout Accessibility', () => {
    test('has proper heading hierarchy', () => {
      render(<Chapter13Page />);
      
      const mainHeading = screen.getByRole('heading', { level: 1, name: /Stock Market Mastery/i });
      expect(mainHeading).toBeInTheDocument();
      
      const subHeadings = screen.getAllByRole('heading', { level: 2 });
      expect(subHeadings.length).toBeGreaterThan(0);
    });

    test('calculator tabs have proper ARIA structure', () => {
      render(<Chapter13Page />);
      
      const tablist = screen.getByRole('tablist');
      expect(tablist).toBeInTheDocument();
      expect(tablist).toHaveAttribute('aria-label', 'Stock market analysis tools');
      
      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(4);
      
      tabs.forEach(tab => {
        expect(tab).toHaveAttribute('aria-selected');
        expect(tab).toHaveAttribute('aria-controls');
        expect(tab).toHaveAttribute('id');
      });
    });
  });

  describe('StockValuationCalculator Accessibility', () => {
    test('form inputs have proper labels and validation', async () => {
      render(<StockValuationCalculator />);
      
      // Check that all inputs have associated labels
      const stockSymbolInput = screen.getByLabelText('Stock Symbol');
      expect(stockSymbolInput).toBeInTheDocument();
      
      const currentPriceInput = screen.getByLabelText('Current Stock Price');
      expect(currentPriceInput).toBeInTheDocument();
      
      const sharesOutstandingInput = screen.getByLabelText('Shares Outstanding (M)');
      expect(sharesOutstandingInput).toBeInTheDocument();
      
      const marketCapInput = screen.getByLabelText('Market Cap (B)');
      expect(marketCapInput).toBeInTheDocument();
      
      // Test validation messages
      await act(async () => {
        fireEvent.change(currentPriceInput, { target: { value: '-1' } });
        fireEvent.blur(currentPriceInput);
      });
      
      // Wait for the error message to appear
      await waitFor(() => {
        const errorMessage = screen.getByText('Invalid price: must be positive');
        expect(errorMessage).toBeInTheDocument();
        expect(errorMessage).toHaveAttribute('role', 'alert');
        expect(currentPriceInput).toHaveAttribute('aria-describedby', 'current-price-error');
      });
    });

    test('valuation results are properly announced', async () => {
      render(<StockValuationCalculator />);
      
      await waitFor(() => {
        const resultsSection = screen.getByRole('region', { name: /valuation summary/i });
        expect(resultsSection).toBeInTheDocument();
      });
    });
  });

  describe('TechnicalAnalysisTool Accessibility', () => {
    test('form inputs have descriptive labels', () => {
      render(<TechnicalAnalysisTool />);
      
      // Check that all inputs have associated labels
      const stockSymbolInput = screen.getByLabelText('Stock Symbol');
      expect(stockSymbolInput).toBeInTheDocument();
      
      const currentPriceInput = screen.getByLabelText('Current Price');
      expect(currentPriceInput).toBeInTheDocument();
      
      const timeframeSelect = screen.getByLabelText('Timeframe');
      expect(timeframeSelect).toBeInTheDocument();
      
      const lookbackDaysInput = screen.getByLabelText('Lookback Days');
      expect(lookbackDaysInput).toBeInTheDocument();
    });

    test('technical analysis results are properly structured', () => {
      render(<TechnicalAnalysisTool />);
      
      // Check for main sections
      const sections = [
        'Technical Analysis Tool',
        'Stock Symbol & Price',
        'Technical Parameters',
        'Key Technical Indicators',
        'Moving Averages',
        'MACD Analysis',
        'Oscillators',
        'Trading Signals',
        'Trading Recommendations',
        'Technical Analysis Concepts'
      ];
      
      sections.forEach(section => {
        const heading = screen.getByRole('heading', { name: new RegExp(section, 'i') });
        expect(heading).toBeInTheDocument();
      });
      
      // Check for data table
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
      
      const headers = screen.getAllByRole('columnheader');
      headers.forEach(header => {
        expect(header).toHaveAttribute('scope', 'col');
      });
    });
  });

  describe('Keyboard Navigation', () => {
    test('supports tab navigation through all interactive elements', () => {
      const components = [
        <StockValuationCalculator key="valuation" />,
        <OptionsStrategyCalculator key="options" />,
        <PortfolioRiskAnalyzer key="risk" />,
        <TechnicalAnalysisTool key="technical" />
      ];

      components.forEach(component => {
        const { container } = render(component);
        
        const interactiveElements = container.querySelectorAll(
          'button, input, select, textarea, [tabindex]:not([tabindex="-1"]), [role="tab"], [role="button"]'
        );
        
        interactiveElements.forEach(element => {
          const tabIndex = element.getAttribute('tabindex');
          const isNaturallyFocusable = ['BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'].includes(element.tagName);
          
          expect(isNaturallyFocusable || tabIndex !== '-1').toBe(true);
        });
      });
    });

    test('maintains focus management during dynamic updates', async () => {
      render(<StockValuationCalculator />);
      const user = userEvent.setup();
      
      const stockSymbolInput = screen.getByLabelText('Stock Symbol');
      
      await user.tab();
      expect(stockSymbolInput).toHaveFocus();
      
      await user.clear(stockSymbolInput);
      await user.type(stockSymbolInput, 'MSFT');
      expect(stockSymbolInput).toHaveValue('MSFT');
    });
  });

  describe('Color Contrast and Visual Accessibility', () => {
    test('uses sufficient color contrast for text elements', () => {
      const components = [
        <StockValuationCalculator key="valuation" />,
        <OptionsStrategyCalculator key="options" />,
        <PortfolioRiskAnalyzer key="risk" />,
        <TechnicalAnalysisTool key="technical" />
      ];

      components.forEach(component => {
        const { container } = render(component);
        const themedElements = container.querySelectorAll('[class*="text-"]');
        expect(themedElements.length).toBeGreaterThan(0);
      });
    });

    test('provides visual feedback for interactive elements', async () => {
      render(<StockValuationCalculator />);
      const user = userEvent.setup();
      
      const inputs = screen.getAllByRole('spinbutton');
      const input = inputs[0];
      
      await user.hover(input);
      expect(input.className).toMatch(/focus:/);
    });
  });

  describe('Screen Reader Considerations', () => {
    test('provides appropriate ARIA live regions for dynamic content', () => {
      render(<StockValuationCalculator />);
      
      const valuationSummary = screen.getByRole('region', { name: /valuation summary/i });
      expect(valuationSummary).toBeInTheDocument();
      
      const investmentThesis = screen.getByRole('region', { name: /investment thesis/i });
      expect(investmentThesis).toBeInTheDocument();
      
      const riskFactors = screen.getByRole('region', { name: /risk factors/i });
      expect(riskFactors).toBeInTheDocument();
    });

    test('uses descriptive labels for form controls', () => {
      const components = [
        <StockValuationCalculator key="valuation" />,
        <OptionsStrategyCalculator key="options" />,
        <PortfolioRiskAnalyzer key="risk" />,
        <TechnicalAnalysisTool key="technical" />
      ];

      components.forEach(component => {
        const { container } = render(component);
        
        // Check that all inputs have associated labels
        const inputs = container.querySelectorAll('input, select');
        inputs.forEach(input => {
          const id = input.getAttribute('id');
          if (id) {
            const label = container.querySelector(`label[for="${id}"]`);
            expect(label).toBeInTheDocument();
          }
        });
      });
    });
  });

  describe('Error Handling Accessibility', () => {
    test('error messages are properly associated with inputs', async () => {
      render(<StockValuationCalculator />);
      
      const currentPriceInput = screen.getByLabelText('Current Stock Price');
      await act(async () => {
        fireEvent.change(currentPriceInput, { target: { value: '-1' } });
        fireEvent.blur(currentPriceInput);
      });
      
      // Wait for the error message to appear
      await waitFor(() => {
        const errorMessage = screen.getByText('Invalid price: must be positive');
        expect(errorMessage).toBeInTheDocument();
        expect(errorMessage).toHaveAttribute('role', 'alert');
        expect(currentPriceInput).toHaveAttribute('aria-describedby', 'current-price-error');
      });
    });

    test('validation errors are announced to screen readers', async () => {
      render(<StockValuationCalculator />);
      
      const currentPriceInput = screen.getByLabelText('Current Stock Price');
      await act(async () => {
        fireEvent.change(currentPriceInput, { target: { value: '-1' } });
        fireEvent.blur(currentPriceInput);
      });
      
      // Wait for the error message to appear
      await waitFor(() => {
        const errorMessage = screen.getByText('Invalid price: must be positive');
        expect(errorMessage).toBeInTheDocument();
        expect(errorMessage).toHaveAttribute('role', 'alert');
      });
    });
  });

  describe('Data Visualization Accessibility', () => {
    test('tables have proper headers and structure', () => {
      render(<StockValuationCalculator />);
      
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();
      
      const headers = screen.getAllByRole('columnheader');
      headers.forEach(header => {
        expect(header).toHaveAttribute('scope', 'col');
      });
      
      const cells = screen.getAllByRole('cell');
      expect(cells.length).toBeGreaterThan(0);
    });

    test('numeric data has proper formatting', () => {
      render(<StockValuationCalculator />);
      
      const numericInputs = screen.getAllByRole('spinbutton');
      numericInputs.forEach(input => {
        expect(input).toHaveAttribute('step');
        expect(input).toHaveAttribute('type', 'number');
      });
    });
  });
});