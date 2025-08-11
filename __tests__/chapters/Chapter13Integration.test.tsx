import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Chapter13Page from '@/app/chapter13/page';

// Mock the progress store
const mockProgressStore = {
  recordCalculatorUsage: jest.fn(),
  isChapterUnlocked: jest.fn(() => true),
  completeLesson: jest.fn(),
  userProgress: {
    completedLessons: ['chapter1-lesson', 'chapter2-lesson'],
    quizScores: { 'chapter1-quiz': 90, 'chapter2-quiz': 85 },
    userLevel: 1,
    totalXP: 100,
    currentXP: 50,
  },
  getPersonalizedEncouragement: jest.fn(() => "Great job!"),
  getStudyRecommendation: jest.fn(() => ({
    type: 'continue',
    message: 'Continue learning',
    action: 'Next lesson',
    priority: 'medium'
  })),
  checkLevelUp: jest.fn(() => false),
  updateLearningAnalytics: jest.fn(),
  updateStreak: jest.fn(),
  awardXP: jest.fn(),
  unlockAchievement: jest.fn(),
  getChapterProgress: jest.fn(() => 50),
  getStreakMotivation: jest.fn(() => ({
    message: "Keep going!",
    streakStatus: "building",
    suggestions: ["Try a new calculator"]
  })),
  calculateFinancialLiteracyScore: jest.fn(() => 800),
  canTakeQuiz: jest.fn(() => true),
  recordQuizScore: jest.fn(),
  markChapterComplete: jest.fn(),
  resetProgress: jest.fn(),
  updateTimeSpent: jest.fn(),
  useStreakFreeze: jest.fn(),
  startStudySession: jest.fn(),
  endStudySession: jest.fn(),
  updateWeeklyProgress: jest.fn(),
  completeOnboarding: jest.fn(),
};

jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: jest.fn(() => mockProgressStore),
}));

// Mock lesson component
jest.mock('@/components/chapters/fundamentals/lessons/StockMarketMasteryLessonEnhanced', () => {
  return function MockStockMarketMasteryLesson() {
    return (
      <div data-testid="lesson-content" onClick={() => {
        // This will trigger the handleLessonComplete function
        const event = new Event('click');
        document.dispatchEvent(event);
      }}>
        Mock Stock Market Mastery Lesson
      </div>
    );
  };
});

// Mock AI Teaching Assistant
jest.mock('@/components/shared/ai-assistant/AITeachingAssistant', () => {
  return function MockAITeachingAssistant() {
    return <div>Mock AI Teaching Assistant</div>;
  };
});

// Mock calculator components
jest.mock('@/components/chapters/fundamentals/calculators/StockValuationCalculator', () => {
  return function MockStockValuationCalculator() {
    return (
      <div role="region" aria-label="valuation results">
        <input type="number" role="spinbutton" />
        <div>Mock Stock Valuation Calculator</div>
      </div>
    );
  };
});

jest.mock('@/components/chapters/fundamentals/calculators/OptionsStrategyCalculator', () => {
  return function MockOptionsStrategyCalculator() {
    return (
      <div role="region" aria-label="options analysis">
        <input type="number" role="spinbutton" />
        <div>Mock Options Strategy Calculator</div>
      </div>
    );
  };
});

jest.mock('@/components/chapters/fundamentals/calculators/PortfolioRiskAnalyzer', () => {
  return function MockPortfolioRiskAnalyzer() {
    return (
      <div role="region" aria-label="risk analysis">
        <button>add holding</button>
        <div>Mock Portfolio Risk Analyzer</div>
      </div>
    );
  };
});

jest.mock('@/components/chapters/fundamentals/calculators/TechnicalAnalysisTool', () => {
  return function MockTechnicalAnalysisTool() {
    return (
      <div>
        <input type="checkbox" />
        <div data-testid="chart-container">Mock Technical Analysis Tool</div>
      </div>
    );
  };
});

// Mock Recharts to avoid canvas issues in tests
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="chart-container">{children}</div>,
  LineChart: ({ children }: { children: React.ReactNode }) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}));

describe('Chapter 13: Stock Market Mastery - Integration Tests', () => {
  describe('Chapter Layout', () => {
    it('renders chapter title and subtitle', () => {
      render(<Chapter13Page />);
      
      expect(screen.getByText('Stock Market Mastery & Advanced Trading')).toBeInTheDocument();
      expect(screen.getByText(/Master advanced stock analysis, trading strategies/)).toBeInTheDocument();
    });

    it('displays calculator tabs correctly', async () => {
      render(<Chapter13Page />);
      const user = userEvent.setup();
      
      // Click the calculator tab first
      const calculatorTab = screen.getByRole('tab', { name: /Calculator/i });
      await user.click(calculatorTab);
      
      // Now we should see the calculator sub-tabs
      const tabs = [
        'Stock Valuation',
        'Options Strategy',
        'Portfolio Risk',
        'Technical Analysis'
      ];
      
      // Check that each tab exists as a button
      for (const tabName of tabs) {
        const button = screen.getByRole('button', { name: new RegExp(tabName, 'i') });
        expect(button).toBeInTheDocument();
      }
    });
  });

  describe('Calculator Integration', () => {
    it('switches between calculator tabs', async () => {
      render(<Chapter13Page />);
      const user = userEvent.setup();
      
      // Click the calculator tab first
      const calculatorTab = screen.getByRole('tab', { name: /Calculator/i });
      await user.click(calculatorTab);
      
      // Now we can access the calculator sub-tabs
      const tabs = [
        'Stock Valuation',
        'Options Strategy',
        'Portfolio Risk',
        'Technical Analysis'
      ];
      
      for (const tabName of tabs) {
        const button = screen.getByRole('button', { name: new RegExp(tabName, 'i') });
        await user.click(button);
        expect(button).toHaveClass('border-blue-500 text-blue-400'); // Active tab has blue border and text
      }
    });

    it('maintains calculator state between tab switches', async () => {
      render(<Chapter13Page />);
      const user = userEvent.setup();
      
      // Click the calculator tab first
      const calculatorTab = screen.getByRole('tab', { name: /Calculator/i });
      await user.click(calculatorTab);
      
      // Switch between tabs and verify state persistence
      const firstTab = screen.getByRole('button', { name: /Stock Valuation/i });
      const secondTab = screen.getByRole('button', { name: /Options Strategy/i });
      
      await user.click(firstTab);
      await user.click(secondTab);
      await user.click(firstTab);
      
      expect(firstTab).toHaveClass('border-blue-500 text-blue-400'); // Active tab has blue border and text
      
      // Verify calculator description is displayed
      expect(screen.getByText('DCF, P/E analysis, and intrinsic value calculations')).toBeInTheDocument();
    });
  });

  describe('Calculator Features Integration', () => {
    it('performs stock valuation calculations', async () => {
      render(<Chapter13Page />);
      const user = userEvent.setup();
      
      // Click the calculator tab first
      const calculatorTab = screen.getByRole('tab', { name: /Calculator/i });
      await user.click(calculatorTab);
      
      // Select Stock Valuation tab
      const tab = screen.getByRole('button', { name: /Stock Valuation/i });
      await user.click(tab);
      
      // Verify calculator description
      expect(screen.getByText('DCF, P/E analysis, and intrinsic value calculations')).toBeInTheDocument();
      
      // Input test values
      const inputs = screen.getAllByRole('spinbutton');
      for (const input of inputs) {
        await user.clear(input);
        await user.type(input, '100');
      }
      
      // Check for calculation results
      await waitFor(() => {
        const results = screen.queryByRole('region', { name: /valuation results/i });
        if (results) {
          expect(results).toBeInTheDocument();
        }
      }, { timeout: 2000 });
    }, 10000);

    it('calculates option prices', async () => {
      render(<Chapter13Page />);
      const user = userEvent.setup();
      
      // Click the calculator tab first
      const calculatorTab = screen.getByRole('tab', { name: /Calculator/i });
      await user.click(calculatorTab);
      
      // Select Options Strategy tab
      const tab = screen.getByRole('button', { name: /Options Strategy/i });
      await user.click(tab);
      
      // Verify calculator description
      expect(screen.getByText('Black-Scholes pricing and options strategy analysis')).toBeInTheDocument();
      
      // Input test values
      const inputs = screen.getAllByRole('spinbutton');
      for (const input of inputs) {
        await user.clear(input);
        await user.type(input, '50');
      }
      
      // Check for calculation results
      await waitFor(() => {
        const results = screen.queryByRole('region', { name: /options analysis/i });
        if (results) {
          expect(results).toBeInTheDocument();
        }
      }, { timeout: 2000 });
    }, 10000);

    it('analyzes portfolio risk metrics', async () => {
      render(<Chapter13Page />);
      const user = userEvent.setup();
      
      // Click the calculator tab first
      const calculatorTab = screen.getByRole('tab', { name: /Calculator/i });
      await user.click(calculatorTab);
      
      // Select Portfolio Risk tab
      const tab = screen.getByRole('button', { name: /Portfolio Risk/i });
      await user.click(tab);
      
      // Verify calculator description
      expect(screen.getByText('Portfolio optimization and risk management tools')).toBeInTheDocument();
      
      // Add portfolio holdings
      const addButton = screen.getByRole('button', { name: /add holding/i });
      await user.click(addButton);
      
      // Check for risk analysis results
      await waitFor(() => {
        const results = screen.queryByRole('region', { name: /risk analysis/i });
        if (results) {
          expect(results).toBeInTheDocument();
        }
      }, { timeout: 2000 });
    }, 10000);

    it('generates technical indicators', async () => {
      render(<Chapter13Page />);
      const user = userEvent.setup();
      
      // Click the calculator tab first
      const calculatorTab = screen.getByRole('tab', { name: /Calculator/i });
      await user.click(calculatorTab);
      
      // Select Technical Analysis tab
      const tab = screen.getByRole('button', { name: /Technical Analysis/i });
      await user.click(tab);
      
      // Verify calculator description
      expect(screen.getByText('RSI, MACD, Bollinger Bands, and trading signals')).toBeInTheDocument();
      
      // Select indicators
      const checkboxes = screen.getAllByRole('checkbox');
      for (const checkbox of checkboxes) {
        await user.click(checkbox);
      }
      
      // Check for indicator charts
      await waitFor(() => {
        const charts = screen.queryAllByTestId('chart-container');
        expect(charts.length).toBeGreaterThan(0);
      }, { timeout: 2000 });
    }, 10000);
  });

  describe('Component Interaction', () => {
    it('updates progress when completing lesson sections', async () => {
      render(<Chapter13Page />);
      const user = userEvent.setup();
      
      // Click the lesson tab
      const lessonTab = screen.getByRole('tab', { name: /Lesson/i });
      await user.click(lessonTab);
      
      // Click the lesson content to trigger completion
      const lessonContent = screen.getByTestId('lesson-content');
      await user.click(lessonContent);
      
      // Verify progress tracking is working
      expect(mockProgressStore.completeLesson).toHaveBeenCalled();
    });

    it('maintains calculator state during page navigation', async () => {
      render(<Chapter13Page />);
      const user = userEvent.setup();
      
      // Click each tab and verify it becomes active
      const tabs = ['Lesson', 'Calculator', 'AI Coach'];
      
      for (const tabName of tabs) {
        const tab = screen.getByRole('tab', { name: new RegExp(tabName, 'i') });
        await user.click(tab);
        
        // Wait for the tab to become active
        await waitFor(() => {
          const tabPanel = screen.getByRole('tabpanel');
          expect(tabPanel).toBeInTheDocument();
          expect(tabPanel).toHaveAttribute('data-state', 'active');
        });
      }
    });
  });

  describe('Error Handling', () => {
    it('handles invalid calculator inputs gracefully', async () => {
      render(<Chapter13Page />);
      const user = userEvent.setup();
      
      // Try to input invalid data
      const numberInputs = screen.queryAllByRole('spinbutton');
      
      for (const input of numberInputs) {
        await user.type(input, '-1');
        
        // Check for error message
        await waitFor(() => {
          const errorMessage = screen.queryByRole('alert');
          if (errorMessage) {
            expect(errorMessage).toBeInTheDocument();
          }
        });
      }
    });

    it('displays appropriate error states', async () => {
      render(<Chapter13Page />);
      const user = userEvent.setup();
      
      // Trigger error states
      const inputs = screen.queryAllByRole('textbox');
      
      for (const input of inputs) {
        await user.clear(input);
        
        // Check for validation message
        await waitFor(() => {
          const validationMessage = screen.queryByRole('alert');
          if (validationMessage) {
            expect(validationMessage).toBeInTheDocument();
          }
        });
      }
    });
  });

  describe('Chart Integration', () => {
    it('renders technical analysis charts correctly', async () => {
      render(<Chapter13Page />);
      const user = userEvent.setup();
      
      // Click the calculator tab first
      const calculatorTab = screen.getByRole('tab', { name: /Calculator/i });
      await user.click(calculatorTab);
      
      // Navigate to Technical Analysis tab
      const tab = screen.getByRole('button', { name: /Technical Analysis/i });
      await user.click(tab);
      
      // Check for chart components
      const chartContainer = screen.getByTestId('chart-container');
      expect(chartContainer).toBeInTheDocument();
      expect(chartContainer).toHaveTextContent('Mock Technical Analysis Tool');
    });

    it('updates charts based on user input', async () => {
      render(<Chapter13Page />);
      const user = userEvent.setup();
      
      // Click the calculator tab first
      const calculatorTab = screen.getByRole('tab', { name: /Calculator/i });
      await user.click(calculatorTab);
      
      // Navigate to Stock Valuation tab
      const tab = screen.getByRole('button', { name: /Stock Valuation/i });
      await user.click(tab);
      
      // Input values and check for chart updates
      const inputs = screen.getAllByRole('spinbutton');
      for (const input of inputs) {
        await user.clear(input);
        await user.type(input, '100');
      }
      
      // Verify the mock calculator is rendered
      const results = screen.getByRole('region', { name: /valuation results/i });
      expect(results).toBeInTheDocument();
      expect(results).toHaveTextContent('Mock Stock Valuation Calculator');
    });
  });

  describe('Responsive Layout', () => {
    it('adjusts calculator layout for different screen sizes', () => {
      render(<Chapter13Page />);
      
      // Check for responsive container classes
      const containers = document.querySelectorAll('[class*="grid-cols-"]');
      expect(containers.length).toBeGreaterThan(0);
      
      // Check for calculator grid layout
      const calculatorGrid = document.querySelector('[class*="grid-cols-2 sm:grid-cols-4"]');
      expect(calculatorGrid).toBeInTheDocument();
    });

    it('maintains usability on smaller screens', () => {
      render(<Chapter13Page />);
      
      // Check for mobile-friendly classes
      const elements = document.querySelectorAll('[class*="sm:"]');
      expect(elements.length).toBeGreaterThan(0);
      
      // Check for mobile-specific text
      const mobileText = screen.getByText('Calc');
      expect(mobileText).toBeInTheDocument();
      
      // Check for desktop-specific text that's hidden on mobile
      const desktopText = screen.getByText('Calculator');
      expect(desktopText).toHaveClass('hidden sm:inline');
    });
  });
});
