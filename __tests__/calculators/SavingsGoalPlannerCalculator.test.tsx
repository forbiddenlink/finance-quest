import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SavingsGoalPlannerCalculator from '@/components/chapters/fundamentals/calculators/SavingsGoalPlannerCalculator';

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

describe('SavingsGoalPlannerCalculator', () => {
  it('renders calculator title and description', () => {
    render(<SavingsGoalPlannerCalculator />);
    
    expect(screen.getByText('Savings Goal Planner Calculator')).toBeInTheDocument();
    expect(screen.getByText(/Set financial goals/)).toBeInTheDocument();
  });

  it('displays budget settings', () => {
    render(<SavingsGoalPlannerCalculator />);
    
    expect(screen.getByText('Monthly Savings Budget')).toBeInTheDocument();
    expect(screen.getByText('Expected Annual Interest Rate (%)')).toBeInTheDocument();
  });

  it('shows create new goal form', () => {
    render(<SavingsGoalPlannerCalculator />);
    
    expect(screen.getByText('Create New Goal')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g., Emergency Fund, Vacation')).toBeInTheDocument();
  });

  it('displays default savings goals', () => {
    render(<SavingsGoalPlannerCalculator />);
    
    expect(screen.getByText('Emergency Fund')).toBeInTheDocument();
    expect(screen.getByText('Vacation to Europe')).toBeInTheDocument();
    expect(screen.getByText('New Car Down Payment')).toBeInTheDocument();
  });

  it('shows allocation summary', () => {
    render(<SavingsGoalPlannerCalculator />);
    
    expect(screen.getByText('Allocation Summary')).toBeInTheDocument();
    expect(screen.getByText('Monthly Budget')).toBeInTheDocument();
    expect(screen.getByText('Total Allocated')).toBeInTheDocument();
    expect(screen.getByText('Remaining Budget')).toBeInTheDocument();
  });

  it('displays your goals section', () => {
    render(<SavingsGoalPlannerCalculator />);
    
    expect(screen.getByText('Your Goals')).toBeInTheDocument();
  });

  it('has priority level options', () => {
    render(<SavingsGoalPlannerCalculator />);
    
    expect(screen.getByText('High Priority')).toBeInTheDocument();
    expect(screen.getByText('Medium Priority')).toBeInTheDocument();
    expect(screen.getByText('Low Priority')).toBeInTheDocument();
  });

  it('shows goal setting best practices', () => {
    render(<SavingsGoalPlannerCalculator />);
    
    expect(screen.getByText('Goal Setting Best Practices')).toBeInTheDocument();
    expect(screen.getByText('SMART Goals')).toBeInTheDocument();
    expect(screen.getByText('Automate Savings')).toBeInTheDocument();
    expect(screen.getByText('Celebrate Milestones')).toBeInTheDocument();
  });

  it('displays smart tips section', () => {
    render(<SavingsGoalPlannerCalculator />);
    
    expect(screen.getByText('Smart Tips')).toBeInTheDocument();
  });

  it('allows monthly budget adjustment', () => {
    render(<SavingsGoalPlannerCalculator />);
    
    const budgetInput = screen.getByDisplayValue('1000');
    fireEvent.change(budgetInput, { target: { value: '1500' } });
    
    expect(budgetInput).toHaveValue(1500);
  });

  it('shows add savings goal button', () => {
    render(<SavingsGoalPlannerCalculator />);
    
    const addButton = screen.getByText('Add Savings Goal');
    expect(addButton).toBeInTheDocument();
  });

  it('displays goal progress tracking', () => {
    render(<SavingsGoalPlannerCalculator />);
    
    expect(screen.getAllByText('Progress')).toHaveLength(3); // One for each default goal
    expect(screen.getAllByText('Required/month')).toHaveLength(3);
    expect(screen.getAllByText('Allocated')).toHaveLength(3);
  });

  it('shows target dates for goals', () => {
    render(<SavingsGoalPlannerCalculator />);
    
    expect(screen.getAllByText('Target date')).toHaveLength(3); // One for each default goal
    expect(screen.getAllByText('Time left')).toHaveLength(3);
  });
});
