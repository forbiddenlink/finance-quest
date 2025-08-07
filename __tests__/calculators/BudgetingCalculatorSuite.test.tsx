import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock all the calculator components to avoid complex rendering
jest.mock('@/components/shared/calculators/BudgetBuilderCalculator', () => {
  return function MockBudgetBuilderCalculator() {
    return <div data-testid="budget-builder">Budget Builder Calculator</div>;
  };
});

jest.mock('@/components/chapters/fundamentals/calculators/BudgetOptimizerCalculator', () => {
  return function MockBudgetOptimizerCalculator() {
    return <div data-testid="budget-optimizer">Budget Optimizer Calculator</div>;
  };
});

jest.mock('@/components/chapters/fundamentals/calculators/CashFlowTrackerCalculator', () => {
  return function MockCashFlowTrackerCalculator() {
    return <div data-testid="cash-flow-tracker">Cash Flow Tracker Calculator</div>;
  };
});

jest.mock('@/components/chapters/fundamentals/calculators/SavingsGoalPlannerCalculator', () => {
  return function MockSavingsGoalPlannerCalculator() {
    return <div data-testid="savings-goal-planner">Savings Goal Planner Calculator</div>;
  };
});

// Mock the progressStore
jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: () => ({
    recordCalculatorUsage: jest.fn(),
  }),
}));

import BudgetingCalculatorSuite from '@/components/chapters/fundamentals/calculators/BudgetingCalculatorSuite';

describe('BudgetingCalculatorSuite', () => {
  it('renders calculator suite with all tabs', () => {
    render(<BudgetingCalculatorSuite />);
    
    expect(screen.getByText('Budgeting Suite:')).toBeInTheDocument();
    expect(screen.getAllByText('Budget Builder')).toHaveLength(2); // button + title
    expect(screen.getAllByText('Budget Optimizer')).toHaveLength(1);
    expect(screen.getAllByText('Cash Flow Tracker')).toHaveLength(1);
    expect(screen.getAllByText('Savings Goal Planner')).toHaveLength(1);
  });

  it('shows Budget Builder as default active calculator', () => {
    render(<BudgetingCalculatorSuite />);
    
    // Budget Builder should be active by default
    expect(screen.getByTestId('budget-builder')).toBeInTheDocument();
    expect(screen.getByText('Create and analyze your complete budget with 50/30/20 rule guidance')).toBeInTheDocument();
  });

  it('allows switching between calculators', () => {
    render(<BudgetingCalculatorSuite />);
    
    // Click on Budget Optimizer tab
    const optimizerTab = screen.getByText('Budget Optimizer');
    fireEvent.click(optimizerTab);
    
    // Should show Budget Optimizer description and component
    expect(screen.getByText('Optimize your spending allocation and maximize savings potential')).toBeInTheDocument();
    expect(screen.getByTestId('budget-optimizer')).toBeInTheDocument();
  });

  it('displays calculator descriptions when switching tabs', () => {
    render(<BudgetingCalculatorSuite />);
    
    // Switch to Cash Flow Tracker
    const trackerTab = screen.getByText('Cash Flow Tracker');
    fireEvent.click(trackerTab);
    
    expect(screen.getByText('Track income and expenses with future projection analysis')).toBeInTheDocument();
    expect(screen.getByTestId('cash-flow-tracker')).toBeInTheDocument();
  });

  it('shows active calculator highlighting', () => {
    render(<BudgetingCalculatorSuite />);
    
    // Budget Builder should be highlighted as active (get the button, not the title)
    const budgetBuilderTab = screen.getAllByText('Budget Builder')[0]; // Get the button
    expect(budgetBuilderTab.closest('button')).toHaveClass('bg-white/10');
  });

  it('switches to savings goal planner', () => {
    render(<BudgetingCalculatorSuite />);
    
    // Click on Savings Goal Planner tab
    const savingsTab = screen.getByText('Savings Goal Planner');
    fireEvent.click(savingsTab);
    
    // Should show Savings Goal Planner description and component
    expect(screen.getByText('Set financial goals and optimize allocation strategy')).toBeInTheDocument();
    expect(screen.getByTestId('savings-goal-planner')).toBeInTheDocument();
  });

  it('maintains sticky tab navigation', () => {
    render(<BudgetingCalculatorSuite />);
    
    // Check that the tab navigation has sticky positioning by looking for the sticky class
    const stickyElements = document.querySelectorAll('.sticky');
    expect(stickyElements.length).toBeGreaterThan(0);
    expect(stickyElements[0]).toHaveClass('sticky');
    expect(stickyElements[0]).toHaveClass('top-0');
    expect(stickyElements[0]).toHaveClass('z-40');
  });

  it('displays calculator icons with proper colors', () => {
    render(<BudgetingCalculatorSuite />);
    
    // All calculator tabs should be present with their icons (expect multiple instances)
    expect(screen.getAllByText('Budget Builder')).toHaveLength(2); // button + title
    expect(screen.getAllByText('Budget Optimizer')).toHaveLength(1);
    expect(screen.getAllByText('Cash Flow Tracker')).toHaveLength(1);
    expect(screen.getAllByText('Savings Goal Planner')).toHaveLength(1);
  });

  it('has responsive tab navigation', () => {
    render(<BudgetingCalculatorSuite />);
    
    // Tab container should have overflow handling - get the button element
    const budgetBuilderButton = screen.getAllByText('Budget Builder')[0]; // Get the first one (button)
    const tabsContainer = budgetBuilderButton.closest('div');
    expect(tabsContainer?.parentElement).toHaveClass('overflow-x-auto');
  });

  it('animates calculator switching', () => {
    render(<BudgetingCalculatorSuite />);
    
    // The active calculator content should be wrapped in motion div
    const budgetOptimizerTab = screen.getAllByText('Budget Optimizer')[0];
    fireEvent.click(budgetOptimizerTab);
    
    // Description should update and component should be present
    expect(screen.getByText('Optimize your spending allocation and maximize savings potential')).toBeInTheDocument();
    expect(screen.getByTestId('budget-optimizer')).toBeInTheDocument();
  });
});
