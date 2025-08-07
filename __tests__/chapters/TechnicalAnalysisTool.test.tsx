import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TechnicalAnalysisTool from '@/components/chapters/fundamentals/calculators/TechnicalAnalysisTool';

// Mock Recharts components to prevent SVG rendering issues
jest.mock('recharts', () => ({
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => null,
}));

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
  test('renders the technical analysis tool', () => {
    render(<TechnicalAnalysisTool />);
    expect(screen.getByText(/Technical Analysis Tool/i)).toBeInTheDocument();
  });

  test('records calculator usage on mount', () => {
    render(<TechnicalAnalysisTool />);
    expect(mockRecordCalculatorUsage).toHaveBeenCalledWith('technical-analysis-tool');
  });

  test('displays stock symbol input', () => {
    render(<TechnicalAnalysisTool />);
    const stockSymbolElements = screen.getAllByText(/Stock Symbol/i);
    expect(stockSymbolElements.length).toBeGreaterThan(0);
    expect(screen.getByDisplayValue(/AAPL/i)).toBeInTheDocument();
  });

  test('shows current price input', () => {
    render(<TechnicalAnalysisTool />);
    const currentPriceElements = screen.getAllByText(/Current Price/i);
    expect(currentPriceElements.length).toBeGreaterThan(0);
  });

  test('displays timeframe selection', () => {
    render(<TechnicalAnalysisTool />);
    expect(screen.getByText(/Timeframe/i)).toBeInTheDocument();
    expect(screen.getByText(/Daily/i)).toBeInTheDocument();
  });

  test('shows technical parameters section', () => {
    render(<TechnicalAnalysisTool />);
    expect(screen.getByText(/Technical Parameters/i)).toBeInTheDocument();
  });

  test('allows input for stock symbol', () => {
    render(<TechnicalAnalysisTool />);
    
    const symbolInput = screen.getByDisplayValue(/AAPL/i) as HTMLInputElement;
    fireEvent.change(symbolInput, { target: { value: 'MSFT' } });
    
    expect(symbolInput.value).toBe('MSFT');
  });

  test('handles price input changes', () => {
    render(<TechnicalAnalysisTool />);
    
    const priceInput = screen.getByDisplayValue('175.5') as HTMLInputElement;
    fireEvent.change(priceInput, { target: { value: '180.25' } });
    
    expect(priceInput.value).toBe('180.25');
  });

  test('displays analysis results section', () => {
    render(<TechnicalAnalysisTool />);
    const analysisElements = screen.getAllByText(/Analysis/i);
    expect(analysisElements.length).toBeGreaterThan(0);
  });

  test('shows moving average information', () => {
    render(<TechnicalAnalysisTool />);
    const movingAverageElements = screen.getAllByText(/Moving/i);
    expect(movingAverageElements.length).toBeGreaterThan(0);
  });

  test('displays RSI indicator', () => {
    render(<TechnicalAnalysisTool />);
    const rsiElements = screen.getAllByText(/RSI/i);
    expect(rsiElements.length).toBeGreaterThan(0);
  });

  test('shows trend analysis', () => {
    render(<TechnicalAnalysisTool />);
    const trendElements = screen.getAllByText(/trend/i);
    expect(trendElements.length).toBeGreaterThan(0);
  });

  test('displays signal information', () => {
    render(<TechnicalAnalysisTool />);
    const signalElements = screen.getAllByText(/Signal/i);
    expect(signalElements.length).toBeGreaterThan(0);
  });

  test('shows volatility analysis', () => {
    render(<TechnicalAnalysisTool />);
    const volatilityElements = screen.getAllByText(/Volatility/i);
    expect(volatilityElements.length).toBeGreaterThan(0);
  });

  test('provides educational content', () => {
    render(<TechnicalAnalysisTool />);
    const technicalAnalysisElements = screen.getAllByText(/Technical Analysis/i);
    expect(technicalAnalysisElements.length).toBeGreaterThan(0);
  });

  test('shows indicator explanations', () => {
    render(<TechnicalAnalysisTool />);
    const indicatorElements = screen.getAllByText(/indicators/i);
    expect(indicatorElements.length).toBeGreaterThan(0);
  });

  test('displays real-world examples', () => {
    render(<TechnicalAnalysisTool />);
    expect(screen.getByDisplayValue(/AAPL/i)).toBeInTheDocument();
  });

  test('shows technical analysis components', () => {
    render(<TechnicalAnalysisTool />);
    const movingElements = screen.getAllByText(/Moving/i);
    expect(movingElements.length).toBeGreaterThan(0);
  });

  test('provides risk information', () => {
    render(<TechnicalAnalysisTool />);
    const riskElements = screen.getAllByText(/Risk/i);
    expect(riskElements.length).toBeGreaterThan(0);
  });
});
