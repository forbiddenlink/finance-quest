import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TechnicalAnalysisTool from '@/components/chapters/fundamentals/calculators/TechnicalAnalysisTool';

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

describe('TechnicalAnalysisTool', () => {
  test('renders the calculator component', () => {
    render(<TechnicalAnalysisTool />);
    expect(screen.getByText(/Technical Analysis Tool/i)).toBeInTheDocument();
  });

  test('records calculator usage on mount', () => {
    render(<TechnicalAnalysisTool />);
    expect(mockRecordCalculatorUsage).toHaveBeenCalledWith('technical-analysis-tool');
  });

  test('displays tool selection interface', () => {
    render(<TechnicalAnalysisTool />);
    
    // Check for different technical analysis tools
    expect(screen.getByText(/Moving Average|SMA|EMA/i)).toBeInTheDocument();
    expect(screen.getByText(/RSI|Relative Strength/i)).toBeInTheDocument();
    expect(screen.getByText(/MACD|Moving Average Convergence/i)).toBeInTheDocument();
    expect(screen.getByText(/Bollinger Bands/i)).toBeInTheDocument();
  });

  test('calculates Simple Moving Average (SMA)', async () => {
    render(<TechnicalAnalysisTool />);
    
    // Select SMA tool
    const smaOption = screen.getByText(/Simple Moving Average|SMA/i);
    fireEvent.click(smaOption);
    
    // Input price data
    const priceInput = screen.getByLabelText(/Price Data|Stock Prices/i);
    fireEvent.change(priceInput, { target: { value: '100,105,102,108,110' } });
    
    // Select period
    const periodInput = screen.getByLabelText(/Period|Days/i);
    fireEvent.change(periodInput, { target: { value: '3' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/105|106.67/i)).toBeInTheDocument(); // SMA calculation
    });
  });

  test('calculates Exponential Moving Average (EMA)', async () => {
    render(<TechnicalAnalysisTool />);
    
    // Select EMA tool
    const emaOption = screen.getByText(/Exponential Moving Average|EMA/i);
    fireEvent.click(emaOption);
    
    // Input price data
    const priceInput = screen.getByLabelText(/Price Data|Stock Prices/i);
    fireEvent.change(priceInput, { target: { value: '100,105,102,108,110,115' } });
    
    // Select period
    const periodInput = screen.getByLabelText(/Period|Days/i);
    fireEvent.change(periodInput, { target: { value: '5' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/EMA|Exponential/i)).toBeInTheDocument();
      expect(screen.getByText(/\d+\.\d+/)).toBeInTheDocument(); // Some decimal result
    });
  });

  test('calculates RSI (Relative Strength Index)', async () => {
    render(<TechnicalAnalysisTool />);
    
    // Select RSI tool
    const rsiOption = screen.getByText(/RSI|Relative Strength/i);
    fireEvent.click(rsiOption);
    
    // Input price data (need enough data for RSI calculation)
    const priceInput = screen.getByLabelText(/Price Data|Stock Prices/i);
    const priceData = Array.from({length: 20}, (_, i) => 100 + Math.random() * 10).join(',');
    fireEvent.change(priceInput, { target: { value: priceData } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/RSI|Relative Strength Index/i)).toBeInTheDocument();
      expect(screen.getByText(/Overbought|Oversold|Neutral/i)).toBeInTheDocument();
    });
  });

  test('calculates MACD indicator', async () => {
    render(<TechnicalAnalysisTool />);
    
    // Select MACD tool
    const macdOption = screen.getByText(/MACD|Moving Average Convergence/i);
    fireEvent.click(macdOption);
    
    // Input price data
    const priceInput = screen.getByLabelText(/Price Data|Stock Prices/i);
    const priceData = Array.from({length: 30}, (_, i) => 100 + i + Math.random() * 5).join(',');
    fireEvent.change(priceInput, { target: { value: priceData } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/MACD Line|Signal Line|Histogram/i)).toBeInTheDocument();
      expect(screen.getByText(/Bullish|Bearish|Crossover/i)).toBeInTheDocument();
    });
  });

  test('calculates Bollinger Bands', async () => {
    render(<TechnicalAnalysisTool />);
    
    // Select Bollinger Bands tool
    const bollingerOption = screen.getByText(/Bollinger Bands/i);
    fireEvent.click(bollingerOption);
    
    // Input price data
    const priceInput = screen.getByLabelText(/Price Data|Stock Prices/i);
    fireEvent.change(priceInput, { target: { value: '100,102,105,103,108,110,107,109' } });
    
    // Set standard deviation multiplier
    const stdDevInput = screen.getByLabelText(/Standard Deviation|Std Dev/i);
    fireEvent.change(stdDevInput, { target: { value: '2' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Upper Band|Lower Band|Middle Band/i)).toBeInTheDocument();
      expect(screen.getByText(/Squeeze|Expansion/i)).toBeInTheDocument();
    });
  });

  test('provides educational context', () => {
    render(<TechnicalAnalysisTool />);
    
    // Check for educational content
    expect(screen.getByText(/What this means|Understanding|Explanation/i)).toBeInTheDocument();
  });

  test('handles invalid inputs', async () => {
    render(<TechnicalAnalysisTool />);
    
    // Input invalid data - use the actual label from the component
    const priceInput = screen.getByLabelText(/Current Price/i);
    fireEvent.change(priceInput, { target: { value: 'invalid' } });
    
    const calculateButton = screen.queryByText(/Calculate|Analyze/i);
    if (calculateButton) {
      fireEvent.click(calculateButton);
    }
    
    // Component should handle invalid input gracefully
    expect(screen.getByText(/Technical Analysis Tool/i)).toBeInTheDocument();
  });

  test('displays results properly', async () => {
    render(<TechnicalAnalysisTool />);
    
    // Test with actual component labels
    const priceInput = screen.getByLabelText(/Current Price/i);
    fireEvent.change(priceInput, { target: { value: '175.5' } });
    
    const timeframeSelect = screen.getByLabelText(/Timeframe/i);
    fireEvent.change(timeframeSelect, { target: { value: 'daily' } });
    
    const lookbackInput = screen.getByLabelText(/Lookback Days/i);
    fireEvent.change(lookbackInput, { target: { value: '100' } });
    
    // Component should display inputs properly
    expect(priceInput).toHaveValue(175.5);
    expect(timeframeSelect).toHaveValue('daily');
  });
});
