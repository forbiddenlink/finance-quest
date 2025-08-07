import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MoneyMindsetCalculatorSuite from '@/components/chapters/fundamentals/calculators/MoneyMindsetCalculatorSuite';

// Mock the progress store
jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: () => ({
    recordCalculatorUsage: jest.fn(),
  })
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
    
    expect(screen.getByText('Paycheck Calculator')).toBeInTheDocument();
    expect(screen.getByText('Money Personality')).toBeInTheDocument();
    expect(screen.getByText('Goal Prioritizer')).toBeInTheDocument();
    expect(screen.getByText('Spending Mindset')).toBeInTheDocument();
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
      expect(screen.getByText('Question 1 of 5')).toBeInTheDocument();
    });
  });

  test('switches to goal prioritizer tab when clicked', async () => {
    render(<MoneyMindsetCalculatorSuite />);
    
    const goalTab = screen.getByRole('button', { name: /Goal Prioritizer/ });
    fireEvent.click(goalTab);
    
    await waitFor(() => {
      expect(screen.getByText('Monthly Financial Overview')).toBeInTheDocument();
      expect(screen.getByText('Your Financial Goals')).toBeInTheDocument();
    });
  });

  test('switches to spending mindset tab when clicked', async () => {
    render(<MoneyMindsetCalculatorSuite />);
    
    const spendingTab = screen.getByRole('button', { name: /Spending Mindset/ });
    fireEvent.click(spendingTab);
    
    await waitFor(() => {
      expect(screen.getByText('Monthly Income')).toBeInTheDocument();
      expect(screen.getByText('Monthly Spending by Category')).toBeInTheDocument();
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
    
    const personalityCard = screen.getByText('Money Personality').closest('div');
    expect(personalityCard).toBeInTheDocument();
    
    if (personalityCard) {
      fireEvent.click(personalityCard);
      
      await waitFor(() => {
        expect(screen.getByText('Question 1 of 5')).toBeInTheDocument();
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
      expect(screen.getByText(/When you receive unexpected money/)).toBeInTheDocument();
    });
  });

  test('goal prioritizer loads when selected', async () => {
    render(<MoneyMindsetCalculatorSuite />);
    
    const goalTab = screen.getByRole('button', { name: /Goal Prioritizer/ });
    fireEvent.click(goalTab);
    
    await waitFor(() => {
      expect(screen.getByText('Add Goal')).toBeInTheDocument();
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
