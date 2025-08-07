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

  test('displays call option strategy', () => {
    render(<OptionsStrategyCalculator />);
    expect(screen.getByText(/Call Option/i)).toBeInTheDocument();
    expect(screen.getByText(/bullish/i)).toBeInTheDocument();
  });

  test('shows put option strategy', () => {
    render(<OptionsStrategyCalculator />);
    expect(screen.getByText(/Put Option/i)).toBeInTheDocument();
    expect(screen.getByText(/bearish/i)).toBeInTheDocument();
  });

  test('includes covered call strategy', () => {
    render(<OptionsStrategyCalculator />);
    expect(screen.getByText(/Covered Call/i)).toBeInTheDocument();
    expect(screen.getByText(/income/i)).toBeInTheDocument();
  });

  test('shows straddle strategy', () => {
    render(<OptionsStrategyCalculator />);
    expect(screen.getByText(/Straddle/i)).toBeInTheDocument();
    expect(screen.getByText(/volatility/i)).toBeInTheDocument();
  });

  test('records calculator usage on mount', () => {
    render(<OptionsStrategyCalculator />);
    expect(mockRecordCalculatorUsage).toHaveBeenCalledWith('options-strategy-calculator');
  });

  test('allows input for option parameters', () => {
    render(<OptionsStrategyCalculator />);
    
    const strikeInput = screen.getByLabelText(/Strike Price/i) || screen.getByPlaceholderText(/strike/i);
    fireEvent.change(strikeInput, { target: { value: '100' } });
    
    expect((strikeInput as HTMLInputElement).value).toBe('100');
  });

  test('calculates call option profit/loss', async () => {
    render(<OptionsStrategyCalculator />);
    
    // Select call option
    const callOption = screen.getByText(/Call Option/i) || screen.getByRole('button', { name: /call/i });
    fireEvent.click(callOption);
    
    // Fill in inputs
    const strikeInput = screen.getByLabelText(/Strike Price/i) || screen.getByPlaceholderText(/strike/i);
    const premiumInput = screen.getByLabelText(/Premium/i) || screen.getByPlaceholderText(/premium/i);
    const currentPriceInput = screen.getByLabelText(/Current Price/i) || screen.getByPlaceholderText(/current/i);
    
    fireEvent.change(strikeInput, { target: { value: '100' } });
    fireEvent.change(premiumInput, { target: { value: '5' } });
    fireEvent.change(currentPriceInput, { target: { value: '110' } });
    
    // Calculate
    const calculateButton = screen.getByText(/Calculate/i) || screen.getByRole('button', { name: /calculate/i });
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Profit/i) || screen.getByText(/Loss/i)).toBeInTheDocument();
    });
  });

  test('shows put option calculation', async () => {
    render(<OptionsStrategyCalculator />);
    
    // Select put option
    const putOption = screen.getByText(/Put Option/i) || screen.getByRole('button', { name: /put/i });
    fireEvent.click(putOption);
    
    // Fill in inputs
    const strikeInput = screen.getByLabelText(/Strike Price/i) || screen.getByPlaceholderText(/strike/i);
    const premiumInput = screen.getByLabelText(/Premium/i) || screen.getByPlaceholderText(/premium/i);
    
    fireEvent.change(strikeInput, { target: { value: '100' } });
    fireEvent.change(premiumInput, { target: { value: '3' } });
    
    // Calculate
    const calculateButton = screen.getByText(/Calculate/i) || screen.getByRole('button', { name: /calculate/i });
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/breakeven/i) || screen.getByText(/97/)).toBeInTheDocument(); // 100 - 3 = 97
    });
  });

  test('displays covered call strategy', async () => {
    render(<OptionsStrategyCalculator />);
    
    // Select covered call
    const coveredCallOption = screen.getByText(/Covered Call/i);
    fireEvent.click(coveredCallOption);
    
    // Fill in inputs
    const stockPriceInput = screen.getByLabelText(/Stock Price/i) || screen.getByPlaceholderText(/stock/i);
    const callPremiumInput = screen.getByLabelText(/Call Premium/i) || screen.getByPlaceholderText(/premium/i);
    
    fireEvent.change(stockPriceInput, { target: { value: '50' } });
    fireEvent.change(callPremiumInput, { target: { value: '2' } });
    
    // Calculate
    const calculateButton = screen.getByText(/Calculate/i) || screen.getByRole('button', { name: /calculate/i });
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/income/i) || screen.getByText(/yield/i)).toBeInTheDocument();
    });
  });

  test('shows straddle strategy calculation', async () => {
    render(<OptionsStrategyCalculator />);
    
    // Select straddle
    const straddleOption = screen.getByText(/Straddle/i);
    fireEvent.click(straddleOption);
    
    // Fill in inputs
    const strikeInput = screen.getByLabelText(/Strike Price/i) || screen.getByPlaceholderText(/strike/i);
    const callPremiumInput = screen.getByLabelText(/Call Premium/i) || screen.getByPlaceholderText(/call premium/i);
    const putPremiumInput = screen.getByLabelText(/Put Premium/i) || screen.getByPlaceholderText(/put premium/i);
    
    fireEvent.change(strikeInput, { target: { value: '100' } });
    fireEvent.change(callPremiumInput, { target: { value: '4' } });
    fireEvent.change(putPremiumInput, { target: { value: '3' } });
    
    // Calculate
    const calculateButton = screen.getByText(/Calculate/i) || screen.getByRole('button', { name: /calculate/i });
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/107/i) || screen.getByText(/93/i)).toBeInTheDocument(); // Breakeven points
    });
  });

  test('displays risk/reward analysis', async () => {
    render(<OptionsStrategyCalculator />);
    
    const strikeInput = screen.getByLabelText(/Strike Price/i) || screen.getByPlaceholderText(/strike/i);
    fireEvent.change(strikeInput, { target: { value: '100' } });
    
    const calculateButton = screen.getByText(/Calculate/i) || screen.getByRole('button', { name: /calculate/i });
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/risk/i) && screen.getByText(/reward/i)).toBeInTheDocument();
      expect(screen.getByText(/maximum/i)).toBeInTheDocument();
    });
  });

  test('shows breakeven analysis', async () => {
    render(<OptionsStrategyCalculator />);
    
    const strikeInput = screen.getByLabelText(/Strike Price/i) || screen.getByPlaceholderText(/strike/i);
    const premiumInput = screen.getByLabelText(/Premium/i) || screen.getByPlaceholderText(/premium/i);
    
    fireEvent.change(strikeInput, { target: { value: '50' } });
    fireEvent.change(premiumInput, { target: { value: '2' } });
    
    const calculateButton = screen.getByText(/Calculate/i) || screen.getByRole('button', { name: /calculate/i });
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/breakeven/i)).toBeInTheDocument();
    });
  });

  test('handles input validation', () => {
    render(<OptionsStrategyCalculator />);
    
    const strikeInput = screen.getByLabelText(/Strike Price/i) || screen.getByPlaceholderText(/strike/i);
    
    // Test negative input
    fireEvent.change(strikeInput, { target: { value: '-50' } });
    
    const calculateButton = screen.getByText(/Calculate/i) || screen.getByRole('button', { name: /calculate/i });
    fireEvent.click(calculateButton);
    
    // Should show validation message
    expect(screen.getByText(/positive/i) || screen.getByText(/valid/i)).toBeInTheDocument();
  });

  test('displays educational content', () => {
    render(<OptionsStrategyCalculator />);
    
    expect(screen.getByText(/Options/i)).toBeInTheDocument();
    expect(screen.getByText(/strategy/i)).toBeInTheDocument();
    expect(screen.getByText(/Greeks/i) || screen.getByText(/time decay/i)).toBeInTheDocument();
  });

  test('shows strategy comparisons', () => {
    render(<OptionsStrategyCalculator />);
    
    expect(screen.getByText(/Call/i)).toBeInTheDocument();
    expect(screen.getByText(/Put/i)).toBeInTheDocument();
    expect(screen.getByText(/Covered/i)).toBeInTheDocument();
    expect(screen.getByText(/Straddle/i)).toBeInTheDocument();
  });

  test('provides time value analysis', async () => {
    render(<OptionsStrategyCalculator />);
    
    const timeInput = screen.queryByLabelText(/Time to Expiration/i) || screen.queryByPlaceholderText(/days/i);
    if (timeInput) {
      fireEvent.change(timeInput, { target: { value: '30' } });
    }
    
    const calculateButton = screen.getByText(/Calculate/i) || screen.getByRole('button', { name: /calculate/i });
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/time/i) || screen.getByText(/decay/i)).toBeInTheDocument();
    });
  });

  test('displays real-world examples', () => {
    render(<OptionsStrategyCalculator />);
    
    expect(screen.getByText(/example/i)).toBeInTheDocument();
    expect(screen.getByText(/AAPL/i) || screen.getByText(/SPY/i) || screen.getByText(/scenario/i)).toBeInTheDocument();
  });

  test('shows volatility impact', () => {
    render(<OptionsStrategyCalculator />);
    
    expect(screen.getByText(/volatility/i)).toBeInTheDocument();
    expect(screen.getByText(/implied/i) || screen.getByText(/IV/i)).toBeInTheDocument();
  });

  test('provides strategy recommendations', async () => {
    render(<OptionsStrategyCalculator />);
    
    const strikeInput = screen.getByLabelText(/Strike Price/i) || screen.getByPlaceholderText(/strike/i);
    fireEvent.change(strikeInput, { target: { value: '100' } });
    
    const calculateButton = screen.getByText(/Calculate/i) || screen.getByRole('button', { name: /calculate/i });
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/recommend/i) || screen.getByText(/suitable/i) || screen.getByText(/best/i)).toBeInTheDocument();
    });
  });
});
