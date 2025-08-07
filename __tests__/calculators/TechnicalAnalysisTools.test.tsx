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
    render(<TechnicalAnalysisTools />);
    
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
    render(<TechnicalAnalysisTools />);
    
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
    render(<TechnicalAnalysisTools />);
    
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
    render(<TechnicalAnalysisTools />);
    
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
    render(<TechnicalAnalysisTools />);
    
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

  test('calculates Stochastic Oscillator', async () => {
    render(<TechnicalAnalysisTools />);
    
    // Select Stochastic tool
    const stochasticOption = screen.getByText(/Stochastic|%K|%D/i);
    fireEvent.click(stochasticOption);
    
    // Input high, low, close data
    const highInput = screen.getByLabelText(/High Prices/i);
    const lowInput = screen.getByLabelText(/Low Prices/i);
    const closeInput = screen.getByLabelText(/Close Prices/i);
    
    fireEvent.change(highInput, { target: { value: '105,110,108,112,115' } });
    fireEvent.change(lowInput, { target: { value: '100,105,103,108,110' } });
    fireEvent.change(closeInput, { target: { value: '103,108,106,111,113' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/%K|%D|Stochastic/i)).toBeInTheDocument();
      expect(screen.getByText(/Overbought|Oversold/i)).toBeInTheDocument();
    });
  });

  test('provides support and resistance levels', async () => {
    render(<TechnicalAnalysisTools />);
    
    // Select support/resistance tool
    const supportResistanceOption = screen.getByText(/Support|Resistance/i);
    fireEvent.click(supportResistanceOption);
    
    // Input price data with clear levels
    const priceInput = screen.getByLabelText(/Price Data|Stock Prices/i);
    fireEvent.change(priceInput, { target: { value: '100,102,100,105,103,100,108,106,100' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Support Level|Resistance Level/i)).toBeInTheDocument();
      expect(screen.getByText(/100|Key Level/i)).toBeInTheDocument();
    });
  });

  test('calculates Fibonacci retracement levels', async () => {
    render(<TechnicalAnalysisTools />);
    
    // Select Fibonacci tool
    const fibonacciOption = screen.getByText(/Fibonacci|Fib/i);
    fireEvent.click(fibonacciOption);
    
    // Input high and low prices
    const highInput = screen.getByLabelText(/High Price|Swing High/i);
    const lowInput = screen.getByLabelText(/Low Price|Swing Low/i);
    
    fireEvent.change(highInput, { target: { value: '120' } });
    fireEvent.change(lowInput, { target: { value: '100' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/23.6%|38.2%|50%|61.8%/i)).toBeInTheDocument();
      expect(screen.getByText(/Retracement|Fibonacci/i)).toBeInTheDocument();
    });
  });

  test('shows trend analysis', async () => {
    render(<TechnicalAnalysisTools />);
    
    // Select trend analysis
    const trendOption = screen.getByText(/Trend|Trend Analysis/i);
    fireEvent.click(trendOption);
    
    // Input trending price data
    const priceInput = screen.getByLabelText(/Price Data|Stock Prices/i);
    fireEvent.change(priceInput, { target: { value: '100,102,105,108,110,113,115,118' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Uptrend|Downtrend|Sideways/i)).toBeInTheDocument();
      expect(screen.getByText(/Trend Strength|Trend Direction/i)).toBeInTheDocument();
    });
  });

  test('calculates volume indicators', async () => {
    render(<TechnicalAnalysisTools />);
    
    // Select volume analysis
    const volumeOption = screen.getByText(/Volume|OBV|On Balance/i);
    fireEvent.click(volumeOption);
    
    // Input price and volume data
    const priceInput = screen.getByLabelText(/Price Data|Close Prices/i);
    const volumeInput = screen.getByLabelText(/Volume Data|Volume/i);
    
    fireEvent.change(priceInput, { target: { value: '100,105,103,108,110' } });
    fireEvent.change(volumeInput, { target: { value: '1000,1200,800,1500,1100' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/OBV|On Balance Volume|Volume Trend/i)).toBeInTheDocument();
    });
  });

  test('provides buy/sell signals', async () => {
    render(<TechnicalAnalysisTools />);
    
    // Use any indicator that provides signals
    const rsiOption = screen.getByText(/RSI|Relative Strength/i);
    fireEvent.click(rsiOption);
    
    // Input data that would generate oversold signal
    const priceInput = screen.getByLabelText(/Price Data|Stock Prices/i);
    const decreasingPrices = Array.from({length: 20}, (_, i) => 120 - i * 2).join(',');
    fireEvent.change(priceInput, { target: { value: decreasingPrices } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Buy Signal|Sell Signal|Hold/i)).toBeInTheDocument();
    });
  });

  test('shows technical pattern recognition', async () => {
    render(<TechnicalAnalysisTools />);
    
    // Select pattern recognition
    const patternOption = screen.getByText(/Pattern|Chart Pattern/i);
    fireEvent.click(patternOption);
    
    // Input price data that could form a pattern
    const priceInput = screen.getByLabelText(/Price Data|Stock Prices/i);
    fireEvent.change(priceInput, { target: { value: '100,105,110,105,100,105,110,115' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Head and Shoulders|Double Top|Triangle|Wedge/i)).toBeInTheDocument();
    });
  });

  test('validates input data format', async () => {
    render(<TechnicalAnalysisTools />);
    
    // Select any tool
    const smaOption = screen.getByText(/Simple Moving Average|SMA/i);
    fireEvent.click(smaOption);
    
    // Input invalid data
    const priceInput = screen.getByLabelText(/Price Data|Stock Prices/i);
    fireEvent.change(priceInput, { target: { value: 'invalid,data,format' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/invalid|error|format|number/i)).toBeInTheDocument();
    });
  });

  test('provides educational explanations for each indicator', async () => {
    render(<TechnicalAnalysisTools />);
    
    // Select RSI and check for explanation
    const rsiOption = screen.getByText(/RSI|Relative Strength/i);
    fireEvent.click(rsiOption);
    
    expect(screen.getByText(/measures|momentum|overbought|oversold/i)).toBeInTheDocument();
  });

  test('displays charts and visualizations', async () => {
    render(<TechnicalAnalysisTools />);
    
    // Select any indicator
    const macdOption = screen.getByText(/MACD/i);
    fireEvent.click(macdOption);
    
    // Fill in data
    const priceInput = screen.getByLabelText(/Price Data|Stock Prices/i);
    fireEvent.change(priceInput, { target: { value: '100,102,105,103,108,110' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Chart|Graph|Visualization/i)).toBeInTheDocument();
    });
  });

  test('allows customization of indicator parameters', () => {
    render(<TechnicalAnalysisTools />);
    
    // Select moving average
    const smaOption = screen.getByText(/Simple Moving Average|SMA/i);
    fireEvent.click(smaOption);
    
    // Check for customizable period
    const periodInput = screen.getByLabelText(/Period|Days|Length/i);
    expect(periodInput).toBeInTheDocument();
    
    fireEvent.change(periodInput, { target: { value: '20' } });
    expect(periodInput).toHaveValue('20');
  });

  test('compares multiple indicators', async () => {
    render(<TechnicalAnalysisTools />);
    
    // Look for comparison feature
    expect(screen.getByText(/Compare|Multiple|Overlay/i)).toBeInTheDocument();
  });

  test('provides backtesting capabilities', async () => {
    render(<TechnicalAnalysisTools />);
    
    // Select any strategy
    const macdOption = screen.getByText(/MACD/i);
    fireEvent.click(macdOption);
    
    // Fill in historical data
    const priceInput = screen.getByLabelText(/Price Data|Stock Prices/i);
    const historicalData = Array.from({length: 50}, (_, i) => 100 + Math.sin(i/5) * 10).join(',');
    fireEvent.change(priceInput, { target: { value: historicalData } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Backtest|Historical Performance|Strategy Results/i)).toBeInTheDocument();
    });
  });

  test('handles real-time data input', () => {
    render(<TechnicalAnalysisTools />);
    
    // Check for real-time or live data option
    expect(screen.getByText(/Real.?time|Live|Current/i)).toBeInTheDocument();
  });

  test('exports analysis results', async () => {
    render(<TechnicalAnalysisTools />);
    
    // Perform analysis first
    const smaOption = screen.getByText(/Simple Moving Average|SMA/i);
    fireEvent.click(smaOption);
    
    const priceInput = screen.getByLabelText(/Price Data|Stock Prices/i);
    fireEvent.change(priceInput, { target: { value: '100,105,102,108,110' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Export|Download|Save/i)).toBeInTheDocument();
    });
  });
});
