import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import OptionsStrategyCalculator from '@/components/chapters/fundamentals/calculators/OptionsStrategyCalculator';

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

describe('OptionsStrategyCalculator', () => {
  test('renders the calculator component', () => {
    render(<OptionsStrategyCalculator />);
    expect(screen.getByText(/Options Strategy Calculator/i)).toBeInTheDocument();
  });

  test('records calculator usage on mount', () => {
    render(<OptionsStrategyCalculator />);
    expect(mockRecordCalculatorUsage).toHaveBeenCalledWith('options-strategy-calculator');
  });

  test('displays strategy selection dropdown', () => {
    render(<OptionsStrategyCalculator />);
    
    expect(screen.getByLabelText(/Options Strategy/i)).toBeInTheDocument();
    // Check that strategy options exist in the select
    const strategySelect = screen.getByLabelText(/Options Strategy/i);
    expect(strategySelect).toContainHTML('Long Call');
    expect(strategySelect).toContainHTML('Long Put');
    expect(strategySelect).toContainHTML('Covered Call');
    expect(strategySelect).toContainHTML('Straddle');
  });

  test('shows basic option inputs', () => {
    render(<OptionsStrategyCalculator />);
    
    // Check for actual field labels that exist in the component
    expect(screen.getByLabelText(/Current Stock Price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Strike Price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Option Premium/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Days to Expiration/i)).toBeInTheDocument();
  });

  test('allows strategy selection', async () => {
    render(<OptionsStrategyCalculator />);
    
    const strategySelect = screen.getByLabelText(/Options Strategy/i);
    fireEvent.change(strategySelect, { target: { value: 'long-call' } });
    
    await waitFor(() => {
      expect(strategySelect).toHaveValue('long-call');
    });
  });

  test('accepts stock price input', async () => {
    render(<OptionsStrategyCalculator />);
    
    const stockPriceInput = screen.getByLabelText(/Current Stock Price/i);
    fireEvent.change(stockPriceInput, { target: { value: '105' } });
    
    await waitFor(() => {
      expect(stockPriceInput).toHaveValue(105);
    });
  });

  test('accepts strike price input', async () => {
    render(<OptionsStrategyCalculator />);
    
    const strikePriceInput = screen.getByLabelText(/Strike Price/i);
    fireEvent.change(strikePriceInput, { target: { value: '100' } });
    
    await waitFor(() => {
      expect(strikePriceInput).toHaveValue(100);
    });
  });

  test('accepts premium input', async () => {
    render(<OptionsStrategyCalculator />);
    
    const premiumInput = screen.getByLabelText(/Option Premium/i);
    fireEvent.change(premiumInput, { target: { value: '3' } });
    
    await waitFor(() => {
      expect(premiumInput).toHaveValue(3);
    });
  });

  test('accepts volatility input', async () => {
    render(<OptionsStrategyCalculator />);
    
    const volatilityInput = screen.getByLabelText(/Implied Volatility/i);
    fireEvent.change(volatilityInput, { target: { value: '25' } });
    
    await waitFor(() => {
      expect(volatilityInput).toHaveValue(25);
    });
  });

  test('displays strategy sections when component loads', async () => {
    render(<OptionsStrategyCalculator />);
    
    // Check for section headers that actually exist
    await waitFor(() => {
      expect(screen.getByText(/Strategy Selection/i)).toBeInTheDocument();
      expect(screen.getByText(/Market Data/i)).toBeInTheDocument();
    });
  });

  test('handles different strategy selections', async () => {
    render(<OptionsStrategyCalculator />);
    
    const strategySelect = screen.getByLabelText(/Options Strategy/i);
    
    // Test different strategy selections
    fireEvent.change(strategySelect, { target: { value: 'covered-call' } });
    expect(strategySelect).toHaveValue('covered-call');
    
    fireEvent.change(strategySelect, { target: { value: 'straddle' } });
    expect(strategySelect).toHaveValue('straddle');
  });

  test('maintains form state when switching strategies', async () => {
    render(<OptionsStrategyCalculator />);
    
    const strategySelect = screen.getByLabelText(/Options Strategy/i);
    const stockPriceInput = screen.getByLabelText(/Current Stock Price/i);
    
    // Set a stock price
    fireEvent.change(stockPriceInput, { target: { value: '150' } });
    expect(stockPriceInput).toHaveValue(150);
    
    // Change strategy
    fireEvent.change(strategySelect, { target: { value: 'long-put' } });
    
    // Verify form state is maintained
    await waitFor(() => {
      expect(strategySelect).toHaveValue('long-put');
      expect(stockPriceInput).toHaveValue(150);
    });
  });

  test('displays option type and position controls', () => {
    render(<OptionsStrategyCalculator />);
    
    expect(screen.getByLabelText(/Option Type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Position/i)).toBeInTheDocument();
  });

  test('shows additional market parameters', () => {
    render(<OptionsStrategyCalculator />);
    
    expect(screen.getByLabelText(/Risk-Free Rate/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Dividend Yield/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Number of Contracts/i)).toBeInTheDocument();
  });

  test('component renders without errors', () => {
    const { container } = render(<OptionsStrategyCalculator />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
