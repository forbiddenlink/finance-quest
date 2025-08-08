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
    
    // Check for strategy selection
    expect(screen.getByLabelText(/Options Strategy/i)).toBeInTheDocument();
    // Check that strategy options exist in the select
    const strategySelect = screen.getByLabelText(/Options Strategy/i);
    expect(strategySelect).toContainHTML('Long Call');
    expect(strategySelect).toContainHTML('Long Put');
    expect(strategySelect).toContainHTML('Covered Call');
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

  test('accepts days to expiration input', async () => {
    render(<OptionsStrategyCalculator />);
    
    const expiryInput = screen.getByLabelText(/Days to Expiration/i);
    fireEvent.change(expiryInput, { target: { value: '30' } });
    
    await waitFor(() => {
      expect(expiryInput).toHaveValue(30);
    });
  });

  test('accepts implied volatility input', async () => {
    render(<OptionsStrategyCalculator />);
    
    const volatilityInput = screen.getByLabelText(/Implied Volatility/i);
    fireEvent.change(volatilityInput, { target: { value: '25' } });
    
    await waitFor(() => {
      expect(volatilityInput).toHaveValue(25);
    });
  });

  test('shows option type selection', () => {
    render(<OptionsStrategyCalculator />);
    
    expect(screen.getByLabelText(/Option Type/i)).toBeInTheDocument();
    // Use more specific selector to avoid multiple matches
    const optionTypeSelect = screen.getByLabelText(/Option Type/i);
    expect(optionTypeSelect).toContainHTML('Call');
    expect(optionTypeSelect).toContainHTML('Put');
  });

  test('shows position selection', () => {
    render(<OptionsStrategyCalculator />);
    
    expect(screen.getByLabelText(/Position/i)).toBeInTheDocument();
    // Use more specific selector to avoid multiple matches
    const positionSelect = screen.getByLabelText(/Position/i);
    expect(positionSelect).toContainHTML('Long');
  });

  test('allows changing option type', async () => {
    render(<OptionsStrategyCalculator />);
    
    const optionTypeSelect = screen.getByLabelText(/Option Type/i);
    fireEvent.change(optionTypeSelect, { target: { value: 'put' } });
    
    await waitFor(() => {
      expect(optionTypeSelect).toHaveValue('put');
    });
  });

  test('allows changing position', async () => {
    render(<OptionsStrategyCalculator />);
    
    const positionSelect = screen.getByLabelText(/Position/i);
    fireEvent.change(positionSelect, { target: { value: 'long' } });
    
    await waitFor(() => {
      expect(positionSelect).toHaveValue('long');
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
    
    fireEvent.change(strategySelect, { target: { value: 'iron-condor' } });
    expect(strategySelect).toHaveValue('iron-condor');
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

  test('displays risk-free rate input', () => {
    render(<OptionsStrategyCalculator />);
    
    expect(screen.getByLabelText(/Risk-Free Rate/i)).toBeInTheDocument();
  });

  test('displays dividend yield input', () => {
    render(<OptionsStrategyCalculator />);
    
    expect(screen.getByLabelText(/Dividend Yield/i)).toBeInTheDocument();
  });

  test('accepts risk-free rate input', async () => {
    render(<OptionsStrategyCalculator />);
    
    const riskFreeRateInput = screen.getByLabelText(/Risk-Free Rate/i);
    fireEvent.change(riskFreeRateInput, { target: { value: '5' } });
    
    await waitFor(() => {
      expect(riskFreeRateInput).toHaveValue(5);
    });
  });

  test('accepts dividend yield input', async () => {
    render(<OptionsStrategyCalculator />);
    
    const dividendYieldInput = screen.getByLabelText(/Dividend Yield/i);
    fireEvent.change(dividendYieldInput, { target: { value: '2' } });
    
    await waitFor(() => {
      expect(dividendYieldInput).toHaveValue(2);
    });
  });

  test('displays number of contracts input', () => {
    render(<OptionsStrategyCalculator />);
    
    expect(screen.getByLabelText(/Number of Contracts/i)).toBeInTheDocument();
  });

  test('accepts number of contracts input', async () => {
    render(<OptionsStrategyCalculator />);
    
    const contractsInput = screen.getByLabelText(/Number of Contracts/i);
    fireEvent.change(contractsInput, { target: { value: '5' } });
    
    await waitFor(() => {
      expect(contractsInput).toHaveValue(5);
    });
  });

  test('displays results sections', async () => {
    render(<OptionsStrategyCalculator />);
    
    // Wait for calculations to complete and check for section headers
    await waitFor(() => {
      expect(screen.getByText(/Strategy Selection/i)).toBeInTheDocument();
      expect(screen.getByText(/Market Data/i)).toBeInTheDocument();
    });
  });

  test('component renders without errors', () => {
    const { container } = render(<OptionsStrategyCalculator />);
    expect(container.firstChild).toBeInTheDocument();
  });
});