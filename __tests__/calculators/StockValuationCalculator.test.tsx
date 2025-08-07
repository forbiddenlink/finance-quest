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

  test('records calculator usage on mount', () => {
    render(<StockValuationCalculator />);
    expect(mockRecordCalculatorUsage).toHaveBeenCalledWith('stock-valuation-calculator');
  });

  test('displays input fields for stock valuation', () => {
    render(<StockValuationCalculator />);
    
    // Check for key input fields
    expect(screen.getByLabelText(/Current Price|Stock Price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/P\/E Ratio|Price to Earnings/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Earnings|EPS/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Dividend|Dividend Yield/i)).toBeInTheDocument();
  });

  test('calculates DCF valuation correctly', async () => {
    render(<StockValuationCalculator />);
    
    // Fill in DCF inputs
    const fcfInput = screen.getByLabelText(/Free Cash Flow|FCF/i);
    const growthInput = screen.getByLabelText(/Growth Rate/i);
    const discountInput = screen.getByLabelText(/Discount Rate/i);
    
    fireEvent.change(fcfInput, { target: { value: '1000' } });
    fireEvent.change(growthInput, { target: { value: '5' } });
    fireEvent.change(discountInput, { target: { value: '10' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Intrinsic Value|Fair Value/i)).toBeInTheDocument();
      expect(screen.getByText(/\$|USD/i)).toBeInTheDocument();
    });
  });

  test('calculates P/E based valuation', async () => {
    render(<StockValuationCalculator />);
    
    // Fill in P/E valuation inputs
    const epsInput = screen.getByLabelText(/EPS|Earnings Per Share/i);
    const peInput = screen.getByLabelText(/P\/E|Price to Earnings/i);
    
    fireEvent.change(epsInput, { target: { value: '5.50' } });
    fireEvent.change(peInput, { target: { value: '20' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/110/i)).toBeInTheDocument(); // 5.50 * 20 = 110
    });
  });

  test('calculates dividend discount model', async () => {
    render(<StockValuationCalculator />);
    
    // Fill in dividend model inputs
    const dividendInput = screen.getByLabelText(/Dividend|Annual Dividend/i);
    const growthInput = screen.getByLabelText(/Dividend Growth|Growth Rate/i);
    const requiredReturnInput = screen.getByLabelText(/Required Return|Discount Rate/i);
    
    fireEvent.change(dividendInput, { target: { value: '2.00' } });
    fireEvent.change(growthInput, { target: { value: '3' } });
    fireEvent.change(requiredReturnInput, { target: { value: '8' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      // Gordon Growth Model: D1 / (r - g) = 2.06 / (0.08 - 0.03) = 41.2
      expect(screen.getByText(/41|42/i)).toBeInTheDocument();
    });
  });

  test('shows comparative valuation analysis', async () => {
    render(<StockValuationCalculator />);
    
    // Fill in all inputs for comprehensive analysis
    const priceInput = screen.getByLabelText(/Current Price|Stock Price/i);
    const epsInput = screen.getByLabelText(/EPS|Earnings Per Share/i);
    const peInput = screen.getByLabelText(/P\/E|Price to Earnings/i);
    
    fireEvent.change(priceInput, { target: { value: '100' } });
    fireEvent.change(epsInput, { target: { value: '5' } });
    fireEvent.change(peInput, { target: { value: '18' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Overvalued|Undervalued|Fair Value/i)).toBeInTheDocument();
      expect(screen.getByText(/Recommendation|Analysis/i)).toBeInTheDocument();
    });
  });

  test('displays valuation multiples correctly', async () => {
    render(<StockValuationCalculator />);
    
    // Input company metrics
    const priceInput = screen.getByLabelText(/Current Price|Stock Price/i);
    const salesInput = screen.getByLabelText(/Sales|Revenue/i);
    const bookValueInput = screen.getByLabelText(/Book Value|Shareholder Equity/i);
    
    fireEvent.change(priceInput, { target: { value: '50' } });
    fireEvent.change(salesInput, { target: { value: '10' } });
    fireEvent.change(bookValueInput, { target: { value: '25' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/P\/S|Price to Sales/i)).toBeInTheDocument();
      expect(screen.getByText(/P\/B|Price to Book/i)).toBeInTheDocument();
      expect(screen.getByText(/5\.0|2\.0/i)).toBeInTheDocument(); // P/S = 5, P/B = 2
    });
  });

  test('provides educational context and explanations', () => {
    render(<StockValuationCalculator />);
    
    // Check for educational content
    expect(screen.getByText(/DCF|Discounted Cash Flow/i)).toBeInTheDocument();
    expect(screen.getByText(/intrinsic value/i)).toBeInTheDocument();
    expect(screen.getByText(/What this means|Why this matters/i)).toBeInTheDocument();
  });

  test('shows warnings for extreme valuations', async () => {
    render(<StockValuationCalculator />);
    
    // Input extreme P/E ratio
    const peInput = screen.getByLabelText(/P\/E|Price to Earnings/i);
    const epsInput = screen.getByLabelText(/EPS|Earnings Per Share/i);
    
    fireEvent.change(peInput, { target: { value: '150' } }); // Very high P/E
    fireEvent.change(epsInput, { target: { value: '1' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/warning|caution|high risk/i)).toBeInTheDocument();
    });
  });

  test('handles negative or zero inputs appropriately', async () => {
    render(<StockValuationCalculator />);
    
    // Input invalid values
    const epsInput = screen.getByLabelText(/EPS|Earnings Per Share/i);
    fireEvent.change(epsInput, { target: { value: '-5' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/invalid|error|positive/i)).toBeInTheDocument();
    });
  });

  test('displays results in organized sections', async () => {
    render(<StockValuationCalculator />);
    
    // Fill in basic inputs
    const priceInput = screen.getByLabelText(/Current Price|Stock Price/i);
    const epsInput = screen.getByLabelText(/EPS|Earnings Per Share/i);
    
    fireEvent.change(priceInput, { target: { value: '100' } });
    fireEvent.change(epsInput, { target: { value: '5' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Valuation Results|Analysis Results/i)).toBeInTheDocument();
      expect(screen.getByText(/Key Metrics|Summary/i)).toBeInTheDocument();
    });
  });

  test('includes peer comparison functionality', async () => {
    render(<StockValuationCalculator />);
    
    // Look for industry/peer comparison features
    const industryPeInput = screen.getByLabelText(/Industry P\/E|Sector P\/E/i);
    fireEvent.change(industryPeInput, { target: { value: '22' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/vs Industry|vs Peers|Relative/i)).toBeInTheDocument();
    });
  });

  test('provides investment recommendation', async () => {
    render(<StockValuationCalculator />);
    
    // Fill comprehensive inputs
    const priceInput = screen.getByLabelText(/Current Price|Stock Price/i);
    const epsInput = screen.getByLabelText(/EPS|Earnings Per Share/i);
    const peInput = screen.getByLabelText(/P\/E|Price to Earnings/i);
    
    fireEvent.change(priceInput, { target: { value: '80' } });
    fireEvent.change(epsInput, { target: { value: '5' } });
    fireEvent.change(peInput, { target: { value: '15' } }); // Fair value = 75, so overvalued
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Buy|Hold|Sell|Strong Buy|Strong Sell/i)).toBeInTheDocument();
    });
  });

  test('shows growth assumptions clearly', async () => {
    render(<StockValuationCalculator />);
    
    // Fill in growth-related inputs
    const growthInput = screen.getByLabelText(/Growth Rate|Revenue Growth/i);
    fireEvent.change(growthInput, { target: { value: '15' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Assuming|Based on|Growth assumption/i)).toBeInTheDocument();
    });
  });

  test('validates all required fields', async () => {
    render(<StockValuationCalculator />);
    
    // Try to calculate without filling required fields
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/required|fill|complete/i)).toBeInTheDocument();
    });
  });

  test('formats currency values correctly', async () => {
    render(<StockValuationCalculator />);
    
    // Fill inputs and check currency formatting
    const priceInput = screen.getByLabelText(/Current Price|Stock Price/i);
    const epsInput = screen.getByLabelText(/EPS|Earnings Per Share/i);
    
    fireEvent.change(priceInput, { target: { value: '123.45' } });
    fireEvent.change(epsInput, { target: { value: '6.78' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/\$123\.45|\$135\.60/i)).toBeInTheDocument();
    });
  });

  test('supports different valuation methods selection', () => {
    render(<StockValuationCalculator />);
    
    // Check for method selection (DCF, P/E, Dividend Model, etc.)
    expect(screen.getByText(/DCF|P\/E|Dividend|Asset|Method/i)).toBeInTheDocument();
  });
});
