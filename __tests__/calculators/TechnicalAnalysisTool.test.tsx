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

// Mock recharts components
jest.mock('recharts', () => ({
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
  Line: () => <div data-testid="line" />,
  Bar: () => <div data-testid="bar" />,
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
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

  test('displays stock symbol and price inputs', () => {
    render(<TechnicalAnalysisTool />);
    
    expect(screen.getByLabelText(/Stock Symbol/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Current Price/i)).toBeInTheDocument();
  });

  test('displays technical parameters', () => {
    render(<TechnicalAnalysisTool />);
    
    expect(screen.getByLabelText(/RSI Period/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/MACD Fast/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/MACD Slow/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Bollinger Period/i)).toBeInTheDocument();
  });

  test('updates stock symbol input', () => {
    render(<TechnicalAnalysisTool />);
    
    const symbolInput = screen.getByLabelText(/Stock Symbol/i);
    fireEvent.change(symbolInput, { target: { value: 'MSFT' } });
    
    expect(symbolInput).toHaveValue('MSFT');
  });

  test('updates current price input', () => {
    render(<TechnicalAnalysisTool />);
    
    const priceInput = screen.getByLabelText(/Current Price/i);
    fireEvent.change(priceInput, { target: { value: '250.75' } });
    
    expect(priceInput).toHaveValue(250.75);
  });

  test('calculates and displays technical analysis', async () => {
    render(<TechnicalAnalysisTool />);
    
    // Wait for analysis to be performed automatically
    await waitFor(() => {
      expect(screen.getByText(/AAPL.*Technical Analysis/i)).toBeInTheDocument();
    });
  });

  test('displays RSI indicator', async () => {
    render(<TechnicalAnalysisTool />);
    
    await waitFor(() => {
      expect(screen.getAllByText(/RSI/i).length).toBeGreaterThan(0);
    });
  });

  test('displays MACD analysis', async () => {
    render(<TechnicalAnalysisTool />);
    
    await waitFor(() => {
      expect(screen.getByText(/MACD Analysis/i)).toBeInTheDocument();
      expect(screen.getAllByText(/MACD Line/i).length).toBeGreaterThan(0);
    });
  });

  test('displays Bollinger Bands information', async () => {
    render(<TechnicalAnalysisTool />);
    
    await waitFor(() => {
      expect(screen.getAllByText(/Bollinger/i).length).toBeGreaterThan(0);
    });
  });

  test('displays moving averages', async () => {
    render(<TechnicalAnalysisTool />);
    
    await waitFor(() => {
      expect(screen.getAllByText(/Moving Averages/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/SMA 20/i)).toBeInTheDocument();
      expect(screen.getByText(/SMA 50/i)).toBeInTheDocument();
    });
  });

  test('provides educational content', async () => {
    render(<TechnicalAnalysisTool />);
    
    await waitFor(() => {
      expect(screen.getByText(/Technical Analysis Concepts/i)).toBeInTheDocument();
    });
  });

  test('handles invalid inputs gracefully', () => {
    render(<TechnicalAnalysisTool />);
    
    const priceInput = screen.getByLabelText(/Current Price/i);
    fireEvent.change(priceInput, { target: { value: '-100' } });
    
    // Component should handle negative prices gracefully
    expect(priceInput).toHaveValue(-100);
  });
});
