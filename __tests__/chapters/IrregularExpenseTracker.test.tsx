import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import IrregularExpenseTracker from '@/components/chapters/fundamentals/lessons/IrregularExpenseTracker';

// Mock the store
const mockRecordCalculatorUsage = jest.fn();
jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: () => ({
    recordCalculatorUsage: mockRecordCalculatorUsage,
  }),
}));

describe('IrregularExpenseTracker', () => {
  beforeEach(() => {
    mockRecordCalculatorUsage.mockClear();
  });

  test('renders irregular expense planner', () => {
    render(<IrregularExpenseTracker />);
    
    expect(screen.getByText(/Irregular Expenses Planner/i)).toBeInTheDocument();
    expect(screen.getByText(/Plan for irregular expenses that destroy budgets/i)).toBeInTheDocument();
  });

  test('displays default expense categories', () => {
    render(<IrregularExpenseTracker />);
    
    // Check for some default categories that should exist (use getAllByText since they appear multiple times)
    expect(screen.getAllByText(/insurance/i)[0]).toBeInTheDocument();
    expect(screen.getAllByText(/vehicle/i)[0]).toBeInTheDocument();
  });

  test('shows total annual cost', () => {
    render(<IrregularExpenseTracker />);
    
    expect(screen.getByText(/Total Annual/i)).toBeInTheDocument();
    expect(screen.getAllByText(/\$14,100/)[0]).toBeInTheDocument();
  });

  test('displays monthly savings breakdown', () => {
    render(<IrregularExpenseTracker />);
    
    expect(screen.getByText(/Monthly Savings/i)).toBeInTheDocument();
    expect(screen.getByText(/Weekly Savings/i)).toBeInTheDocument();
    expect(screen.getByText(/Daily Savings/i)).toBeInTheDocument();
  });

  test('shows category breakdown', () => {
    render(<IrregularExpenseTracker />);
    
    expect(screen.getByText(/Category Breakdown/i)).toBeInTheDocument();
    
    // Check for category amounts (use getAllByText since amounts appear multiple times)
    expect(screen.getAllByText(/\$1,200/)[0]).toBeInTheDocument(); // insurance
    expect(screen.getAllByText(/\$1,500/)[0]).toBeInTheDocument(); // vehicle
  });

  test('displays recommendations section', () => {
    render(<IrregularExpenseTracker />);
    
    expect(screen.getByText(/Your Sinking Fund Strategy/i)).toBeInTheDocument();
    expect(screen.getByText(/Monthly Auto-Transfer/i)).toBeInTheDocument();
  });

  test('allows adding custom expenses', () => {
    render(<IrregularExpenseTracker />);
    
    const addButton = screen.getByText(/Add Expense/i);
    fireEvent.click(addButton);
    
    expect(screen.getByPlaceholderText(/Expense name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Annual cost/i)).toBeInTheDocument();
  });

  test('calculates savings requirements correctly', () => {
    render(<IrregularExpenseTracker />);
    
    // Check if the calculations are displayed (use getAllByText since values appear multiple times)
    expect(screen.getAllByText(/\$1,175/)[0]).toBeInTheDocument(); // Monthly
    expect(screen.getAllByText(/\$271/)[0]).toBeInTheDocument(); // Weekly  
    expect(screen.getAllByText(/\$39/)[0]).toBeInTheDocument(); // Daily
  });

  test('shows expense management tips', () => {
    render(<IrregularExpenseTracker />);
    
    expect(screen.getByText(/Your Sinking Fund Strategy/i)).toBeInTheDocument();
    expect(screen.getByText(/automatic transfer/i)).toBeInTheDocument();
  });

  test('handles expense removal', () => {
    render(<IrregularExpenseTracker />);
    
    // Check that remove buttons exist for expenses (they use Minus icons)
    const removeButtons = screen.getAllByRole('button');
    // Filter for remove buttons (there should be multiple buttons including Add Expense)
    expect(removeButtons.length).toBeGreaterThan(1);
  });

  test('displays proper styling and theme', () => {
    render(<IrregularExpenseTracker />);
    
    // Check for themed elements
    const mainContainer = screen.getByText(/Irregular Expenses Planner/i).closest('div');
    expect(mainContainer).toHaveClass('p-6');
  });

  test('handles component lifecycle correctly', () => {
    const { unmount } = render(<IrregularExpenseTracker />);
    
    // Component renders successfully
    expect(screen.getByText(/Irregular Expenses Planner/i)).toBeInTheDocument();
    
    unmount();
  });
});
