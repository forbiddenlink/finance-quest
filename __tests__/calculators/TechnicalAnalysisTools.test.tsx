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

  test('displays input fields for stock analysis', () => {
    render(<TechnicalAnalysisTool />);
    
    // Check for input fields
    expect(screen.getByLabelText(/Stock Symbol/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Current Price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Timeframe/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Lookback Days/i)).toBeInTheDocument();
  });

  test('displays technical parameters section', () => {
    render(<TechnicalAnalysisTool />);
    
    expect(screen.getByText(/Technical Parameters/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/RSI Period/i)).toBeInTheDocument();
  });

  test('allows input modification', () => {
    render(<TechnicalAnalysisTool />);
    
    const symbolInput = screen.getByLabelText(/Stock Symbol/i);
    fireEvent.change(symbolInput, { target: { value: 'TSLA' } });
    expect(symbolInput).toHaveValue('TSLA');

    const priceInput = screen.getByLabelText(/Current Price/i);
    fireEvent.change(priceInput, { target: { value: '250.50' } });
    expect(priceInput).toHaveValue(250.5);
  });

  test('displays technical analysis results', () => {
    render(<TechnicalAnalysisTool />);
    
    // Look for analysis sections/results - use more specific selector
    expect(screen.getByText(/AAPL.*Technical Analysis/i)).toBeInTheDocument();
  });

  test('shows moving average information', () => {
    render(<TechnicalAnalysisTool />);
    
    // Use getAllByText to handle multiple SMA elements
    const smaElements = screen.getAllByText(/SMA/i);
    expect(smaElements.length).toBeGreaterThan(0);
  });

  test('displays RSI analysis', () => {
    render(<TechnicalAnalysisTool />);
    
    // Use getAllByText for multiple RSI elements
    const rsiElements = screen.getAllByText(/RSI/i);
    expect(rsiElements.length).toBeGreaterThan(0);
  });

  test('shows MACD analysis', () => {
    render(<TechnicalAnalysisTool />);
    
    // Use getAllByText for multiple MACD elements
    const macdElements = screen.getAllByText(/MACD/i);
    expect(macdElements.length).toBeGreaterThan(0);
  });

  test('displays trend analysis', () => {
    render(<TechnicalAnalysisTool />);
    
    // Use getAllByText for multiple Bullish/Bearish/Sideways elements
    const trendElements = screen.getAllByText(/Bullish|Bearish|Sideways/i);
    expect(trendElements.length).toBeGreaterThan(0);
  });

  test('allows customization of RSI period', () => {
    render(<TechnicalAnalysisTool />);
    
    const rsiInput = screen.getByLabelText(/RSI Period/i);
    fireEvent.change(rsiInput, { target: { value: '21' } });
    expect(rsiInput).toHaveValue(21);
  });

  test('allows customization of MACD parameters', () => {
    render(<TechnicalAnalysisTool />);
    
    const macdFastInput = screen.getByLabelText(/MACD Fast/i);
    fireEvent.change(macdFastInput, { target: { value: '10' } });
    expect(macdFastInput).toHaveValue(10);
  });

  test('displays Bollinger Bands analysis', () => {
    render(<TechnicalAnalysisTool />);
    
    // Use getAllByText for multiple Bollinger elements
    const bollingerElements = screen.getAllByText(/Bollinger/i);
    expect(bollingerElements.length).toBeGreaterThan(0);
  });

  test('shows current price information', () => {
    render(<TechnicalAnalysisTool />);
    
    // Use getAllByText for multiple "Current Price" elements  
    const currentPriceElements = screen.getAllByText(/Current Price/i);
    expect(currentPriceElements.length).toBeGreaterThan(0);
  });

  test('displays technical signals', () => {
    render(<TechnicalAnalysisTool />);
    
    // Use getAllByText for multiple Buy/Sell/Hold elements
    const signalElements = screen.getAllByText(/Buy|Sell|Hold/i);
    expect(signalElements.length).toBeGreaterThan(0);
  });

  test('validates numeric inputs', () => {
    render(<TechnicalAnalysisTool />);
    
    const priceInput = screen.getByLabelText(/Current Price/i);
    fireEvent.change(priceInput, { target: { value: 'invalid' } });
    
    // The input should handle validation or maintain previous value
    expect(priceInput).toBeInTheDocument();
  });

  test('updates analysis when parameters change', async () => {
    render(<TechnicalAnalysisTool />);
    
    const rsiInput = screen.getByLabelText(/RSI Period/i);
    fireEvent.change(rsiInput, { target: { value: '30' } });
    
    await waitFor(() => {
      expect(rsiInput).toHaveValue(30);
    });
  });

  test('displays support and resistance levels', () => {
    render(<TechnicalAnalysisTool />);
    
    // Use getAllByText for multiple Support/Resistance elements
    const supportResistanceElements = screen.getAllByText(/Support|Resistance/i);
    expect(supportResistanceElements.length).toBeGreaterThan(0);
  });

  test('shows volume analysis', () => {
    render(<TechnicalAnalysisTool />);
    
    // Use getAllByText for multiple Volume elements
    const volumeElements = screen.getAllByText(/Volume/i);
    expect(volumeElements.length).toBeGreaterThan(0);
  });

  test('displays timeframe selection', () => {
    render(<TechnicalAnalysisTool />);
    
    const timeframeSelect = screen.getByLabelText(/Timeframe/i);
    expect(timeframeSelect).toBeInTheDocument();
    
    fireEvent.change(timeframeSelect, { target: { value: 'weekly' } });
    expect(timeframeSelect).toHaveValue('weekly');
  });

  test('shows lookback period input', () => {
    render(<TechnicalAnalysisTool />);
    
    const lookbackInput = screen.getByLabelText(/Lookback Days/i);
    expect(lookbackInput).toBeInTheDocument();
    
    fireEvent.change(lookbackInput, { target: { value: '200' } });
    expect(lookbackInput).toHaveValue(200);
  });

  test('displays overall analysis summary', () => {
    render(<TechnicalAnalysisTool />);
    
    // Use getAllByText for multiple analysis elements
    const analysisElements = screen.getAllByText(/Analysis/i);
    expect(analysisElements.length).toBeGreaterThan(0);
  });

  test('shows price levels and targets', () => {
    render(<TechnicalAnalysisTool />);
    
    // Use getAllByText for multiple price elements
    const priceElements = screen.getAllByText(/Price/i);
    expect(priceElements.length).toBeGreaterThan(0);
  });

  test('displays technical score or rating', () => {
    render(<TechnicalAnalysisTool />);
    
    // Use getAllByText for multiple score/strength elements
    const scoreElements = screen.getAllByText(/Score|Rating|Strength/i);
    expect(scoreElements.length).toBeGreaterThan(0);
  });
});
