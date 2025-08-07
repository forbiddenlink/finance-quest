import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BudgetOptimizerCalculator from '@/components/chapters/fundamentals/calculators/BudgetOptimizerCalculator';

// Mock the progressStore
jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: () => ({
    recordCalculatorUsage: jest.fn(),
  }),
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('BudgetOptimizerCalculator', () => {
  it('renders calculator title and description', () => {
    render(<BudgetOptimizerCalculator />);
    
    expect(screen.getByText('Budget Optimizer Calculator')).toBeInTheDocument();
    expect(screen.getByText(/Optimize your budget allocation/)).toBeInTheDocument();
  });

  it('displays default budget categories', () => {
    render(<BudgetOptimizerCalculator />);
    
    expect(screen.getAllByText('Housing')).toHaveLength(2); // label + span
    expect(screen.getAllByText('Transportation')).toHaveLength(2); // label + span  
    expect(screen.getAllByText('Food')).toHaveLength(2); // label + span
    expect(screen.getAllByText('Savings')).toHaveLength(2); // label + span
  });

  it('allows monthly income adjustment', () => {
    render(<BudgetOptimizerCalculator />);
    
    const incomeInput = screen.getByDisplayValue('5000');
    fireEvent.change(incomeInput, { target: { value: '6000' } });
    
    expect(incomeInput).toHaveValue(6000);
  });

  it('shows budget summary calculations', () => {
    render(<BudgetOptimizerCalculator />);
    
    expect(screen.getByText('Total Spending')).toBeInTheDocument();
    expect(screen.getByText('Remaining')).toBeInTheDocument();
    expect(screen.getByText('Savings Rate')).toBeInTheDocument();
  });

  it('displays optimization tips section', () => {
    render(<BudgetOptimizerCalculator />);
    
    expect(screen.getByText('Optimization Tips')).toBeInTheDocument();
  });

  it('shows budget optimization strategies', () => {
    render(<BudgetOptimizerCalculator />);
    
    expect(screen.getByText('50/30/20 Rule')).toBeInTheDocument();
    expect(screen.getByText('Priority-Based')).toBeInTheDocument();
    expect(screen.getByText('Zero-Based')).toBeInTheDocument();
  });

  it('has auto-optimize button', () => {
    render(<BudgetOptimizerCalculator />);
    
    const optimizeButton = screen.getByText('Auto-Optimize Budget');
    expect(optimizeButton).toBeInTheDocument();
  });

  it('calculates savings rate correctly', () => {
    render(<BudgetOptimizerCalculator />);
    
    // With default values: 200 savings out of 5000 income = 4%
    expect(screen.getByText('4.0%')).toBeInTheDocument();
  });

  it('shows budget breakdown visualization', () => {
    render(<BudgetOptimizerCalculator />);
    
    expect(screen.getByText('Budget Breakdown')).toBeInTheDocument();
  });

  it('displays category priorities', () => {
    render(<BudgetOptimizerCalculator />);
    
    expect(screen.getAllByText('high priority')).toHaveLength(5); // Housing, Transportation, Food, Savings, Debt Payments
    expect(screen.getAllByText('medium priority')).toHaveLength(2); // Entertainment, Personal Care
    expect(screen.getAllByText('low priority')).toHaveLength(1); // Shopping
  });
});
