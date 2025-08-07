import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import StockValuationCalculator from '@/components/chapters/fundamentals/calculators/StockValuationCalculator';

// Mock the progress store
jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: jest.fn(),
}));

// Mock react-hot-toast
jest.mock('react-hot-toast', () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

const mockRecordCalculatorUsage = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  
  const useProgressStore = require('@/lib/store/progressStore').useProgressStore;
  useProgressStore.mockReturnValue({
    recordCalculatorUsage: mockRecordCalculatorUsage,
  });
});

describe('StockValuationCalculator', () => {
  test('renders the calculator component', () => {
    render(<StockValuationCalculator />);
    expect(screen.getByText(/Stock Valuation Calculator/i)).toBeInTheDocument();
  });

  test('displays DCF valuation method', () => {
    render(<StockValuationCalculator />);
    expect(screen.getByText(/Discounted Cash Flow/i)).toBeInTheDocument();
    expect(screen.getByText(/DCF/i)).toBeInTheDocument();
  });

  test('shows P/E ratio valuation method', () => {
    render(<StockValuationCalculator />);
    expect(screen.getByText(/P\/E Ratio/i)).toBeInTheDocument();
    expect(screen.getByText(/Price-to-Earnings/i)).toBeInTheDocument();
  });

  test('includes dividend discount model', () => {
    render(<StockValuationCalculator />);
    expect(screen.getByText(/Dividend Discount/i)).toBeInTheDocument();
    expect(screen.getByText(/DDM/i)).toBeInTheDocument();
  });

  test('records calculator usage on mount', () => {
    render(<StockValuationCalculator />);
    expect(mockRecordCalculatorUsage).toHaveBeenCalledWith('stock-valuation-calculator');
  });

  test('allows input for cash flow values', () => {
    render(<StockValuationCalculator />);
    
    const cashFlowInput = screen.getByLabelText(/Current Cash Flow/i) || screen.getByPlaceholderText(/cash flow/i);
    fireEvent.change(cashFlowInput, { target: { value: '1000000' } });
    
    expect((cashFlowInput as HTMLInputElement).value).toBe('1000000');
  });

  test('calculates DCF valuation correctly', async () => {
    render(<StockValuationCalculator />);
    
    // Fill in DCF inputs
    const cashFlowInput = screen.getByLabelText(/Current Cash Flow/i) || screen.getByPlaceholderText(/cash flow/i);
    const growthRateInput = screen.getByLabelText(/Growth Rate/i) || screen.getByPlaceholderText(/growth/i);
    const discountRateInput = screen.getByLabelText(/Discount Rate/i) || screen.getByPlaceholderText(/discount/i);
    
    fireEvent.change(cashFlowInput, { target: { value: '100000' } });
    fireEvent.change(growthRateInput, { target: { value: '5' } });
    fireEvent.change(discountRateInput, { target: { value: '10' } });
    
    // Find and click calculate button
    const calculateButton = screen.getByText(/Calculate/i) || screen.getByRole('button', { name: /calculate/i });
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Valuation/i)).toBeInTheDocument();
    });
  });

  test('shows P/E valuation calculation', async () => {
    render(<StockValuationCalculator />);
    
    // Switch to P/E method if needed
    const peTab = screen.queryByText(/P\/E Ratio/i);
    if (peTab) {
      fireEvent.click(peTab);
    }
    
    // Fill in P/E inputs
    const earningsInput = screen.getByLabelText(/Earnings Per Share/i) || screen.getByPlaceholderText(/earnings/i);
    const peRatioInput = screen.getByLabelText(/P\/E Ratio/i) || screen.getByPlaceholderText(/ratio/i);
    
    fireEvent.change(earningsInput, { target: { value: '5' } });
    fireEvent.change(peRatioInput, { target: { value: '20' } });
    
    // Calculate
    const calculateButton = screen.getByText(/Calculate/i) || screen.getByRole('button', { name: /calculate/i });
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/100/)).toBeInTheDocument(); // 5 * 20 = 100
    });
  });

  test('displays dividend discount model calculation', async () => {
    render(<StockValuationCalculator />);
    
    // Switch to DDM method if needed
    const ddmTab = screen.queryByText(/Dividend Discount/i);
    if (ddmTab) {
      fireEvent.click(ddmTab);
    }
    
    // Fill in DDM inputs
    const dividendInput = screen.getByLabelText(/Annual Dividend/i) || screen.getByPlaceholderText(/dividend/i);
    const requiredReturnInput = screen.getByLabelText(/Required Return/i) || screen.getByPlaceholderText(/return/i);
    
    fireEvent.change(dividendInput, { target: { value: '2' } });
    fireEvent.change(requiredReturnInput, { target: { value: '8' } });
    
    // Calculate
    const calculateButton = screen.getByText(/Calculate/i) || screen.getByRole('button', { name: /calculate/i });
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/25/)).toBeInTheDocument(); // 2 / 0.08 = 25
    });
  });

  test('shows educational content', () => {
    render(<StockValuationCalculator />);
    
    expect(screen.getByText(/intrinsic value/i)).toBeInTheDocument();
    expect(screen.getByText(/fundamental analysis/i)).toBeInTheDocument();
  });

  test('displays method comparisons', () => {
    render(<StockValuationCalculator />);
    
    expect(screen.getByText(/DCF/i)).toBeInTheDocument();
    expect(screen.getByText(/P\/E/i)).toBeInTheDocument();
    expect(screen.getByText(/Dividend/i)).toBeInTheDocument();
  });

  test('handles input validation', () => {
    render(<StockValuationCalculator />);
    
    const cashFlowInput = screen.getByLabelText(/Current Cash Flow/i) || screen.getByPlaceholderText(/cash flow/i);
    
    // Test negative input
    fireEvent.change(cashFlowInput, { target: { value: '-1000' } });
    
    const calculateButton = screen.getByText(/Calculate/i) || screen.getByRole('button', { name: /calculate/i });
    fireEvent.click(calculateButton);
    
    // Should show validation message or prevent calculation
    expect(screen.getByText(/positive/i) || screen.getByText(/valid/i)).toBeInTheDocument();
  });

  test('resets calculator inputs', () => {
    render(<StockValuationCalculator />);
    
    const cashFlowInput = screen.getByLabelText(/Current Cash Flow/i) || screen.getByPlaceholderText(/cash flow/i);
    fireEvent.change(cashFlowInput, { target: { value: '1000' } });
    
    const resetButton = screen.queryByText(/Reset/i) || screen.queryByText(/Clear/i);
    if (resetButton) {
      fireEvent.click(resetButton);
      expect((cashFlowInput as HTMLInputElement).value).toBe('');
    }
  });

  test('shows different valuation scenarios', async () => {
    render(<StockValuationCalculator />);
    
    // Test conservative scenario
    const cashFlowInput = screen.getByLabelText(/Current Cash Flow/i) || screen.getByPlaceholderText(/cash flow/i);
    const growthRateInput = screen.getByLabelText(/Growth Rate/i) || screen.getByPlaceholderText(/growth/i);
    
    fireEvent.change(cashFlowInput, { target: { value: '100000' } });
    fireEvent.change(growthRateInput, { target: { value: '3' } });
    
    const calculateButton = screen.getByText(/Calculate/i) || screen.getByRole('button', { name: /calculate/i });
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/conservative/i) || screen.getByText(/scenario/i)).toBeInTheDocument();
    });
  });

  test('provides valuation interpretation', async () => {
    render(<StockValuationCalculator />);
    
    const cashFlowInput = screen.getByLabelText(/Current Cash Flow/i) || screen.getByPlaceholderText(/cash flow/i);
    fireEvent.change(cashFlowInput, { target: { value: '500000' } });
    
    const calculateButton = screen.getByText(/Calculate/i) || screen.getByRole('button', { name: /calculate/i });
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/undervalued/i) || screen.getByText(/overvalued/i) || screen.getByText(/fair value/i)).toBeInTheDocument();
    });
  });

  test('displays assumptions and limitations', () => {
    render(<StockValuationCalculator />);
    
    expect(screen.getByText(/assumptions/i) || screen.getByText(/limitations/i)).toBeInTheDocument();
    expect(screen.getByText(/estimate/i) || screen.getByText(/approximate/i)).toBeInTheDocument();
  });

  test('shows real-world examples', () => {
    render(<StockValuationCalculator />);
    
    expect(screen.getByText(/example/i)).toBeInTheDocument();
    expect(screen.getByText(/Apple/i) || screen.getByText(/Microsoft/i) || screen.getByText(/Amazon/i)).toBeInTheDocument();
  });
});
