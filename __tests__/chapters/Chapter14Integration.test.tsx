import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Chapter14Page from '@/app/chapter14/page';
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

// Mock Recharts to avoid canvas issues in tests
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="chart-container" aria-label="Bond yield curve chart">{children}</div>,
  LineChart: ({ children }: { children: React.ReactNode }) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  Area: () => <div data-testid="area" />,
  AreaChart: ({ children }: { children: React.ReactNode }) => <div data-testid="area-chart">{children}</div>,
  Pie: () => <div data-testid="pie" />,
  PieChart: ({ children }: { children: React.ReactNode }) => <div data-testid="pie-chart">{children}</div>,
  Cell: () => <div data-testid="cell" />,
  Bar: () => <div data-testid="bar" />,
  BarChart: ({ children }: { children: React.ReactNode }) => <div data-testid="bar-chart">{children}</div>,
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

describe('Chapter 14: Bonds & Fixed Income Mastery - Integration', () => {
  // Setup and cleanup
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Page Structure', () => {
    test('renders all main sections', () => {
      render(<Chapter14Page />);
      
      // Check for main headings
      const mainHeading = screen.getByRole('heading', { level: 1, name: /Bonds & Fixed Income Mastery/i });
      expect(mainHeading).toBeInTheDocument();
      
      const subHeadings = screen.getAllByRole('heading', { level: 2 });
      expect(subHeadings.length).toBeGreaterThan(0);
      
      // Check for calculator tabs
      const tablist = screen.getByRole('tablist');
      expect(tablist).toBeInTheDocument();
      
      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(4);
      
      // Check for calculator descriptions
      const bondPricingTab = screen.getByRole('tab', { name: /Bond Pricing/i });
      expect(bondPricingTab).toBeInTheDocument();
      
      const yieldCurveTab = screen.getByRole('tab', { name: /Yield Curve/i });
      expect(yieldCurveTab).toBeInTheDocument();
      
      const bondLadderTab = screen.getByRole('tab', { name: /Bond Ladder/i });
      expect(bondLadderTab).toBeInTheDocument();
      
      const portfolioOptimizerTab = screen.getByRole('tab', { name: /Portfolio Optimizer/i });
      expect(portfolioOptimizerTab).toBeInTheDocument();
    });

    test('calculator tabs switch content correctly', async () => {
      render(<Chapter14Page />);
      const user = userEvent.setup();
      
      // Check initial calculator (Bond Pricing)
      expect(screen.getByRole('heading', { name: /Advanced Bond Pricing Calculator/i })).toBeInTheDocument();
      
      // Switch to Yield Curve
      const yieldCurveTab = screen.getByRole('tab', { name: /Yield Curve/i });
      await user.click(yieldCurveTab);
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Yield Curve Analyzer/i })).toBeInTheDocument();
      });
      
      // Switch to Bond Ladder
      const bondLadderTab = screen.getByRole('tab', { name: /Bond Ladder/i });
      await user.click(bondLadderTab);
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Bond Ladder Builder/i })).toBeInTheDocument();
      });
      
      // Switch to Portfolio Optimizer
      const portfolioOptimizerTab = screen.getByRole('tab', { name: /Portfolio Optimizer/i });
      await user.click(portfolioOptimizerTab);
      
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Fixed Income Portfolio Optimizer/i })).toBeInTheDocument();
      });
    });
  });

  describe('Calculator Integration', () => {
    test('AdvancedBondPricingCalculator updates calculations correctly', async () => {
      render(<AdvancedBondPricingCalculator />);
      const user = userEvent.setup();
      
      // Fill in bond details
      const faceValueInput = screen.getByLabelText(/Face Value/i);
      const couponRateInput = screen.getByLabelText(/Coupon Rate/i);
      const yearsToMaturityInput = screen.getByLabelText(/Years to Maturity/i);
      const marketYieldInput = screen.getByLabelText(/Market Yield/i);
      
      await user.clear(faceValueInput);
      await user.type(faceValueInput, '1000');
      await user.clear(couponRateInput);
      await user.type(couponRateInput, '5');
      await user.clear(yearsToMaturityInput);
      await user.type(yearsToMaturityInput, '10');
      await user.clear(marketYieldInput);
      await user.type(marketYieldInput, '6');
      
      // Calculate bond metrics
      const calculateButton = screen.getByRole('button', { name: /Calculate Bond Metrics/i });
      await user.click(calculateButton);
      
      // Check results
      await waitFor(() => {
        const bondPrice = screen.getByText(/Bond Price/i).nextElementSibling;
        expect(bondPrice).toBeInTheDocument();
        expect(parseFloat(bondPrice?.textContent || '0')).toBeLessThan(1000); // Price should be less than par when yield > coupon
      });
    });

    test('YieldCurveAnalyzer displays curve data correctly', async () => {
      render(<YieldCurveAnalyzer />);
      const user = userEvent.setup();
      
      // Check for chart container
      const chartContainer = screen.getByTestId('chart-container');
      expect(chartContainer).toBeInTheDocument();
      expect(chartContainer).toHaveAttribute('aria-label', 'Bond yield curve chart');
      
      // Check for yield data points
      const yieldInputs = screen.getAllByRole('spinbutton');
      expect(yieldInputs.length).toBeGreaterThan(0);
      
      // Analyze curve
      const analyzeButton = screen.getByRole('button', { name: /Analyze Yield Curve/i });
      await user.click(analyzeButton);
      
      // Check for curve analysis
      await waitFor(() => {
        const analysisSection = screen.getByRole('heading', { name: /Yield Curve Analysis/i });
        expect(analysisSection).toBeInTheDocument();
      });
    });

    test('BondLadderBuilder creates ladder strategy correctly', async () => {
      render(<BondLadderBuilder />);
      const user = userEvent.setup();
      
      // Fill in ladder parameters
      const principalInputs = screen.getAllByLabelText(/Principal/i);
      const maturityInputs = screen.getAllByLabelText(/Maturity/i);
      
      await user.clear(principalInputs[0]);
      await user.type(principalInputs[0], '10000');
      await user.clear(maturityInputs[0]);
      await user.type(maturityInputs[0], '1');
      
      // Analyze ladder
      const analyzeButton = screen.getByRole('button', { name: /Analyze Bond Ladder/i });
      await user.click(analyzeButton);
      
      // Check ladder allocation
      await waitFor(() => {
        const allocationTable = screen.getByRole('heading', { name: /Ladder Analysis Results/i });
        expect(allocationTable).toBeInTheDocument();
      });
    });

    test('FixedIncomePortfolioOptimizer generates portfolio recommendations', async () => {
      render(<FixedIncomePortfolioOptimizer />);
      const user = userEvent.setup();
      
      // Fill in portfolio parameters
      const portfolioValueInput = screen.getByLabelText(/Portfolio Value/i);
      const incomeNeedsInput = screen.getByLabelText(/Annual Income Needs/i);
      const riskToleranceSelect = screen.getByLabelText(/Risk Tolerance/i);
      
      await user.clear(portfolioValueInput);
      await user.type(portfolioValueInput, '500000');
      await user.clear(incomeNeedsInput);
      await user.type(incomeNeedsInput, '30000');
      await user.selectOptions(riskToleranceSelect, 'Moderate');
      
      // Optimize portfolio
      const optimizeButton = screen.getByRole('button', { name: /Optimize Portfolio/i });
      await user.click(optimizeButton);
      
      // Check portfolio allocation
      await waitFor(() => {
        const allocationChart = screen.getByTestId('pie-chart');
        expect(allocationChart).toBeInTheDocument();
        
        const recommendationsSection = screen.getByRole('heading', { name: /Portfolio Analysis Results/i });
        expect(recommendationsSection).toBeInTheDocument();
      });
    });
  });

  describe('Navigation and Progress', () => {
    test('lesson completion updates progress', async () => {
      const mockCompleteLesson = jest.fn();
      const mockRecordCalculatorUsage = jest.fn();
      
      jest.spyOn(require('@/lib/store/progressStore'), 'useProgressStore').mockImplementation(() => ({
        recordCalculatorUsage: mockRecordCalculatorUsage,
        userProgress: {
          completedLessons: [],
          completedChapters: [],
          unlockedChapters: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
          calculatorUsage: {},
          quizScores: {},
        },
        isChapterUnlocked: () => true,
        completeLesson: mockCompleteLesson,
        getPersonalizedEncouragement: () => 'Keep going!',
        getStudyRecommendation: () => ({ priority: 'low', message: 'Keep learning!' }),
        checkLevelUp: () => false,
      }));
      
      render(<Chapter14Page />);
      const user = userEvent.setup();
      
      // Complete lesson
      const completeButton = screen.getByRole('button', { name: /Complete Lesson/i });
      await user.click(completeButton);
      
      expect(mockCompleteLesson).toHaveBeenCalledWith(14);
    });

    test('calculator usage is recorded', async () => {
      const mockRecordCalculatorUsage = jest.fn();
      
      jest.spyOn(require('@/lib/store/progressStore'), 'useProgressStore').mockImplementation(() => ({
        recordCalculatorUsage: mockRecordCalculatorUsage,
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
      }));
      
      render(<Chapter14Page />);
      const user = userEvent.setup();
      
      // Use calculator
      const calculateButton = screen.getByRole('button', { name: /Calculate Bond Metrics/i });
      await user.click(calculateButton);
      
      expect(mockRecordCalculatorUsage).toHaveBeenCalledWith('advanced-bond-pricing-calculator');
    });
  });
});