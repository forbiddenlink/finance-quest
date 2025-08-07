import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MoneyMindsetCalculatorSuite from '@/components/chapters/fundamentals/calculators/MoneyMindsetCalculatorSuite';

// Mock the progress store with proper Zustand state selector pattern
jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: (selector: any) => {
    const mockState = {
      recordCalculatorUsage: jest.fn(),
      userProgress: {
        lessonsCompleted: [],
        quizScores: {},
        calculatorUsage: {},
        financialLiteracyScore: 750,
      },
    };
    return selector ? selector(mockState) : mockState;
  }
}));

// Mock guided tour
jest.mock('@/components/shared/ui/GuidedTour', () => ({
  __esModule: true,
  default: ({ children }: any) => <div data-testid="guided-tour">{children}</div>,
  hasTourBeenCompleted: jest.fn(() => true), // Skip tours in tests
}));

// Mock achievement system
jest.mock('@/components/shared/ui/AchievementSystem', () => ({
  __esModule: true,
  default: ({ children }: any) => <div data-testid="achievement-system">{children}</div>,
  triggerCalculatorUsage: jest.fn(),
  triggerPaycheckOptimization: jest.fn(),
  triggerTaxOptimization: jest.fn(),
}));

// Mock toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock Recharts components
jest.mock('recharts', () => ({
  PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
  Pie: ({ children }: any) => <div data-testid="pie">{children}</div>,
  Cell: () => <div data-testid="cell" />,
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  Tooltip: () => <div data-testid="tooltip" />,
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div data-testid="bar" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
}));

// Mock calculator components that MoneyMindsetCalculatorSuite imports
jest.mock('@/components/chapters/fundamentals/calculators/PaycheckCalculator', () => {
  return function MockPaycheckCalculator() {
    return (
      <div data-testid="paycheck-calculator">
        <h3>Monthly Income</h3>
        <p>Calculate your take-home pay</p>
      </div>
    );
  };
});

jest.mock('@/components/chapters/fundamentals/calculators/MoneyPersonalityAssessment', () => {
  return function MockMoneyPersonalityAssessment() {
    return (
      <div data-testid="money-personality-assessment">
        <h3>What's Your Money Personality?</h3>
        <p>Discover your financial behavior patterns</p>
      </div>
    );
  };
});

jest.mock('@/components/chapters/fundamentals/calculators/FinancialGoalPrioritizer', () => {
  return function MockFinancialGoalPrioritizer() {
    return (
      <div data-testid="financial-goal-prioritizer">
        <h3>Financial Goal Priority Matrix</h3>
        <p>Prioritize your financial objectives</p>
      </div>
    );
  };
});

jest.mock('@/components/chapters/fundamentals/calculators/SpendingMindsetAnalyzer', () => {
  return function MockSpendingMindsetAnalyzer() {
    return (
      <div data-testid="spending-mindset-analyzer">
        <h3>What Triggers Your Spending?</h3>
        <p>Analyze your spending patterns</p>
      </div>
    );
  };
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('MoneyMindsetCalculatorSuite', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders calculator suite with overview section', () => {
    render(<MoneyMindsetCalculatorSuite />);
    
    expect(screen.getByText('Money Mindset Calculator Suite')).toBeInTheDocument();
    expect(screen.getByText(/Build a healthy relationship with money through 4 comprehensive tools/)).toBeInTheDocument();
  });

  test('displays all four calculator preview cards', () => {
    render(<MoneyMindsetCalculatorSuite />);
    
    // Use getAllByText for duplicate text, then check count
    expect(screen.getAllByText('Paycheck Calculator')).toHaveLength(3); // Preview card + tab + active calculator title
    expect(screen.getAllByText('Money Personality')).toHaveLength(2); // Preview card + tab
    expect(screen.getAllByText('Goal Prioritizer')).toHaveLength(2); // Preview card + tab
    expect(screen.getAllByText('Spending Mindset')).toHaveLength(2); // Preview card + tab
  });

  test('shows tab navigation with all four calculators', () => {
    render(<MoneyMindsetCalculatorSuite />);
    
    const tabs = screen.getAllByRole('button');
    expect(tabs.length).toBeGreaterThanOrEqual(4);
    
    expect(screen.getByRole('button', { name: /Paycheck Calculator/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Money Personality/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Goal Prioritizer/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Spending Mindset/ })).toBeInTheDocument();
  });

  test('switches to money personality tab when clicked', async () => {
    render(<MoneyMindsetCalculatorSuite />);
    
    const personalityTab = screen.getByRole('button', { name: /Money Personality/ });
    fireEvent.click(personalityTab);
    
    await waitFor(() => {
      expect(screen.getByText("What's Your Money Personality?")).toBeInTheDocument();
    });
  });

  test('switches to goal prioritizer tab when clicked', async () => {
    render(<MoneyMindsetCalculatorSuite />);
    
    const goalTab = screen.getByRole('button', { name: /Goal Prioritizer/ });
    fireEvent.click(goalTab);
    
    await waitFor(() => {
      expect(screen.getByText('Financial Goal Priority Matrix')).toBeInTheDocument();
      expect(screen.getByText('Prioritize your financial objectives')).toBeInTheDocument(); 
    });
  });

  test('switches to spending mindset tab when clicked', async () => {
    render(<MoneyMindsetCalculatorSuite />);
    
    const spendingTab = screen.getByRole('button', { name: /Spending Mindset/ });
    fireEvent.click(spendingTab);
    
    await waitFor(() => {
      expect(screen.getByText('What Triggers Your Spending?')).toBeInTheDocument();
      expect(screen.getByText('Analyze your spending patterns')).toBeInTheDocument();
    });
  });

  test('highlights active tab correctly', () => {
    render(<MoneyMindsetCalculatorSuite />);
    
    const personalityTab = screen.getByRole('button', { name: /Money Personality/ });
    fireEvent.click(personalityTab);
    
    // The active tab should have different styling (contains 'text-white' class)
    expect(personalityTab.className).toContain('text-white');
  });

  test('preview cards are clickable and switch tabs', async () => {
    render(<MoneyMindsetCalculatorSuite />);
    
    // Use more specific selector for the preview card (not the tab button)
    const personalityCards = screen.getAllByText('Money Personality');
    const personalityCard = personalityCards[0].closest('div'); // Get first (preview card)
    expect(personalityCard).toBeInTheDocument();
    
    if (personalityCard) {
      fireEvent.click(personalityCard);
      
      await waitFor(() => {
        expect(screen.getByText("What's Your Money Personality?")).toBeInTheDocument();
      });
    }
  });

  test('renders active calculator content', () => {
    render(<MoneyMindsetCalculatorSuite />);
    
    // Default should show PaycheckCalculator content
    expect(screen.getByText('Monthly Income')).toBeInTheDocument();
  });

  test('has proper accessibility attributes', () => {
    render(<MoneyMindsetCalculatorSuite />);
    
    // Check that buttons have proper text content
    const tabs = screen.getAllByRole('button');
    tabs.forEach(tab => {
      expect(tab).toHaveTextContent(/\w+/); // Should have some text content
    });
  });

  test('component structure follows framework patterns', () => {
    const { container } = render(<MoneyMindsetCalculatorSuite />);
    
    // Should have the main container with proper spacing
    expect(container.firstChild).toHaveClass('space-y-8');
    
    // Should have overview section
    const overviewSection = container.querySelector('.space-y-8 > div:first-child');
    expect(overviewSection).toBeInTheDocument();
  });

  test('maintains consistent theme classes', () => {
    const { container } = render(<MoneyMindsetCalculatorSuite />);
    
    // Check for consistent theme usage
    expect(container.innerHTML).toContain('text-blue-400');
    expect(container.innerHTML).toContain('bg-gradient-to-r');
  });
});

// Test individual calculator components are properly integrated
describe('MoneyMindsetCalculatorSuite - Calculator Integration', () => {
  test('paycheck calculator loads by default', () => {
    render(<MoneyMindsetCalculatorSuite />);
    
    // PaycheckCalculator should be loaded by default
    expect(screen.getByText('Monthly Income')).toBeInTheDocument();
  });

  test('money personality assessment loads when selected', async () => {
    render(<MoneyMindsetCalculatorSuite />);
    
    const personalityTab = screen.getByRole('button', { name: /Money Personality/ });
    fireEvent.click(personalityTab);
    
    await waitFor(() => {
      expect(screen.getByText("What's Your Money Personality?")).toBeInTheDocument();
    });
  });

  test('goal prioritizer loads when selected', async () => {
    render(<MoneyMindsetCalculatorSuite />);
    
    const goalTab = screen.getByRole('button', { name: /Goal Prioritizer/ });
    fireEvent.click(goalTab);
    
    await waitFor(() => {
      expect(screen.getByText('Financial Goal Priority Matrix')).toBeInTheDocument();
    });
  });

  test('spending mindset analyzer loads when selected', async () => {
    render(<MoneyMindsetCalculatorSuite />);
    
    const spendingTab = screen.getByRole('button', { name: /Spending Mindset/ });
    fireEvent.click(spendingTab);
    
    await waitFor(() => {
      expect(screen.getByText('What Triggers Your Spending?')).toBeInTheDocument();
    });
  });
});
