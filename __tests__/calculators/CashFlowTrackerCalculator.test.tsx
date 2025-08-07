import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CashFlowTrackerCalculator from '@/components/chapters/fundamentals/calculators/CashFlowTrackerCalculator';

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

describe('CashFlowTrackerCalculator', () => {
  it('renders calculator title and description', () => {
    render(<CashFlowTrackerCalculator />);
    
    expect(screen.getByText('Cash Flow Tracker Calculator')).toBeInTheDocument();
    expect(screen.getByText(/Track your income and expenses/)).toBeInTheDocument();
  });

  it('displays starting balance input', () => {
    render(<CashFlowTrackerCalculator />);
    
    expect(screen.getByText('Starting Balance')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1000')).toBeInTheDocument();
  });

  it('shows add cash flow item form', () => {
    render(<CashFlowTrackerCalculator />);
    
    expect(screen.getByText('Add Cash Flow Item')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('e.g., Salary, Rent, Groceries')).toBeInTheDocument();
  });

  it('displays default cash flow items', () => {
    render(<CashFlowTrackerCalculator />);
    
    expect(screen.getByText('Salary')).toBeInTheDocument();
    expect(screen.getByText('Rent')).toBeInTheDocument();
    expect(screen.getByText('Groceries')).toBeInTheDocument();
    expect(screen.getByText('Car Payment')).toBeInTheDocument();
  });

  it('shows monthly summary section', () => {
    render(<CashFlowTrackerCalculator />);
    
    expect(screen.getByText('Monthly Summary')).toBeInTheDocument();
    expect(screen.getByText('Total Income')).toBeInTheDocument();
    expect(screen.getByText('Total Expenses')).toBeInTheDocument();
    expect(screen.getByText('Net Cash Flow')).toBeInTheDocument();
  });

  it('displays cash flow health section', () => {
    render(<CashFlowTrackerCalculator />);
    
    expect(screen.getByText('Cash Flow Health')).toBeInTheDocument();
  });

  it('shows cash flow projections', () => {
    render(<CashFlowTrackerCalculator />);
    
    expect(screen.getByText('Cash Flow Projections')).toBeInTheDocument();
  });

  it('allows adjustment of projection period', () => {
    render(<CashFlowTrackerCalculator />);
    
    const projectionInput = screen.getByDisplayValue('12');
    fireEvent.change(projectionInput, { target: { value: '24' } });
    
    expect(projectionInput).toHaveValue(24);
  });

  it('has frequency selection options', () => {
    render(<CashFlowTrackerCalculator />);
    
    expect(screen.getByText('Weekly')).toBeInTheDocument();
    expect(screen.getByText('Bi-weekly')).toBeInTheDocument();
    expect(screen.getByText('Monthly')).toBeInTheDocument();
    expect(screen.getByText('Quarterly')).toBeInTheDocument();
    expect(screen.getByText('Annually')).toBeInTheDocument();
  });

  it('displays cash flow management tips', () => {
    render(<CashFlowTrackerCalculator />);
    
    expect(screen.getByText('Cash Flow Management Tips')).toBeInTheDocument();
    expect(screen.getByText('Monitor Timing')).toBeInTheDocument();
    expect(screen.getByText('Build Buffers')).toBeInTheDocument();
    expect(screen.getByText('Plan Ahead')).toBeInTheDocument();
  });

  it('calculates positive net cash flow correctly', () => {
    render(<CashFlowTrackerCalculator />);
    
    // Default: 5000 income - 2250 expenses = 2750 positive flow
    expect(screen.getByText('$2,750')).toBeInTheDocument();
  });
});
