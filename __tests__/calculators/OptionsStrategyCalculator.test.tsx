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
    expect(screen.getByText(/Strategy|Select Strategy/i)).toBeInTheDocument();
    expect(screen.getByText(/Call|Put|Covered Call|Protective Put|Straddle|Strangle/i)).toBeInTheDocument();
  });

  test('shows basic option inputs', () => {
    render(<OptionsStrategyCalculator />);
    
    // Check for basic option parameters
    expect(screen.getByLabelText(/Stock Price|Underlying Price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Strike Price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Premium|Option Price/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Expiration|Days to Expiry/i)).toBeInTheDocument();
  });

  test('calculates call option profit/loss correctly', async () => {
    render(<OptionsStrategyCalculator />);
    
    // Select call option strategy
    const strategySelect = screen.getByLabelText(/Strategy/i);
    fireEvent.change(strategySelect, { target: { value: 'long-call' } });
    
    // Fill in call option parameters
    const stockPriceInput = screen.getByLabelText(/Stock Price|Underlying Price/i);
    const strikePriceInput = screen.getByLabelText(/Strike Price/i);
    const premiumInput = screen.getByLabelText(/Premium|Option Price/i);
    
    fireEvent.change(stockPriceInput, { target: { value: '105' } });
    fireEvent.change(strikePriceInput, { target: { value: '100' } });
    fireEvent.change(premiumInput, { target: { value: '3' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      // Call profit = (105 - 100) - 3 = $2
      expect(screen.getByText(/\$2|Profit.*2/i)).toBeInTheDocument();
    });
  });

  test('calculates put option profit/loss correctly', async () => {
    render(<OptionsStrategyCalculator />);
    
    // Select put option strategy
    const strategySelect = screen.getByLabelText(/Strategy/i);
    fireEvent.change(strategySelect, { target: { value: 'long-put' } });
    
    // Fill in put option parameters
    const stockPriceInput = screen.getByLabelText(/Stock Price|Underlying Price/i);
    const strikePriceInput = screen.getByLabelText(/Strike Price/i);
    const premiumInput = screen.getByLabelText(/Premium|Option Price/i);
    
    fireEvent.change(stockPriceInput, { target: { value: '95' } });
    fireEvent.change(strikePriceInput, { target: { value: '100' } });
    fireEvent.change(premiumInput, { target: { value: '4' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      // Put profit = (100 - 95) - 4 = $1
      expect(screen.getByText(/\$1|Profit.*1/i)).toBeInTheDocument();
    });
  });

  test('calculates covered call strategy', async () => {
    render(<OptionsStrategyCalculator />);
    
    // Select covered call strategy
    const strategySelect = screen.getByLabelText(/Strategy/i);
    fireEvent.change(strategySelect, { target: { value: 'covered-call' } });
    
    // Fill in covered call parameters
    const stockPriceInput = screen.getByLabelText(/Stock Price|Underlying Price/i);
    const strikePriceInput = screen.getByLabelText(/Strike Price/i);
    const premiumInput = screen.getByLabelText(/Premium|Option Price/i);
    const sharesInput = screen.getByLabelText(/Shares|Number of Shares/i);
    
    fireEvent.change(stockPriceInput, { target: { value: '102' } });
    fireEvent.change(strikePriceInput, { target: { value: '105' } });
    fireEvent.change(premiumInput, { target: { value: '2' } });
    fireEvent.change(sharesInput, { target: { value: '100' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Covered Call|Premium Collected/i)).toBeInTheDocument();
      expect(screen.getByText(/\$200/i)).toBeInTheDocument(); // Premium = $2 * 100 shares
    });
  });

  test('calculates protective put strategy', async () => {
    render(<OptionsStrategyCalculator />);
    
    // Select protective put strategy
    const strategySelect = screen.getByLabelText(/Strategy/i);
    fireEvent.change(strategySelect, { target: { value: 'protective-put' } });
    
    // Fill in protective put parameters
    const stockPriceInput = screen.getByLabelText(/Stock Price|Underlying Price/i);
    const strikePriceInput = screen.getByLabelText(/Strike Price/i);
    const premiumInput = screen.getByLabelText(/Premium|Option Price/i);
    
    fireEvent.change(stockPriceInput, { target: { value: '95' } });
    fireEvent.change(strikePriceInput, { target: { value: '90' } });
    fireEvent.change(premiumInput, { target: { value: '3' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Protective Put|Insurance/i)).toBeInTheDocument();
      expect(screen.getByText(/Maximum Loss/i)).toBeInTheDocument();
    });
  });

  test('calculates straddle strategy', async () => {
    render(<OptionsStrategyCalculator />);
    
    // Select straddle strategy
    const strategySelect = screen.getByLabelText(/Strategy/i);
    fireEvent.change(strategySelect, { target: { value: 'long-straddle' } });
    
    // Fill in straddle parameters
    const stockPriceInput = screen.getByLabelText(/Stock Price|Underlying Price/i);
    const strikePriceInput = screen.getByLabelText(/Strike Price/i);
    const callPremiumInput = screen.getByLabelText(/Call Premium/i);
    const putPremiumInput = screen.getByLabelText(/Put Premium/i);
    
    fireEvent.change(stockPriceInput, { target: { value: '110' } });
    fireEvent.change(strikePriceInput, { target: { value: '100' } });
    fireEvent.change(callPremiumInput, { target: { value: '4' } });
    fireEvent.change(putPremiumInput, { target: { value: '2' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      // Straddle profit = (110 - 100) - (4 + 2) = $4
      expect(screen.getByText(/\$4|Profit.*4/i)).toBeInTheDocument();
      expect(screen.getByText(/Breakeven/i)).toBeInTheDocument();
    });
  });

  test('shows breakeven analysis', async () => {
    render(<OptionsStrategyCalculator />);
    
    // Fill in basic parameters
    const stockPriceInput = screen.getByLabelText(/Stock Price|Underlying Price/i);
    const strikePriceInput = screen.getByLabelText(/Strike Price/i);
    const premiumInput = screen.getByLabelText(/Premium|Option Price/i);
    
    fireEvent.change(stockPriceInput, { target: { value: '100' } });
    fireEvent.change(strikePriceInput, { target: { value: '105' } });
    fireEvent.change(premiumInput, { target: { value: '3' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Breakeven|Break-even/i)).toBeInTheDocument();
      expect(screen.getByText(/\$108/i)).toBeInTheDocument(); // Strike + Premium = 105 + 3
    });
  });

  test('displays profit/loss diagram', async () => {
    render(<OptionsStrategyCalculator />);
    
    // Fill in parameters and calculate
    const stockPriceInput = screen.getByLabelText(/Stock Price|Underlying Price/i);
    const strikePriceInput = screen.getByLabelText(/Strike Price/i);
    const premiumInput = screen.getByLabelText(/Premium|Option Price/i);
    
    fireEvent.change(stockPriceInput, { target: { value: '100' } });
    fireEvent.change(strikePriceInput, { target: { value: '100' } });
    fireEvent.change(premiumInput, { target: { value: '5' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Profit\/Loss|P&L|Payoff/i)).toBeInTheDocument();
      expect(screen.getByText(/Chart|Diagram|Graph/i)).toBeInTheDocument();
    });
  });

  test('calculates maximum profit and loss', async () => {
    render(<OptionsStrategyCalculator />);
    
    // Fill in call option parameters
    const stockPriceInput = screen.getByLabelText(/Stock Price|Underlying Price/i);
    const strikePriceInput = screen.getByLabelText(/Strike Price/i);
    const premiumInput = screen.getByLabelText(/Premium|Option Price/i);
    
    fireEvent.change(stockPriceInput, { target: { value: '100' } });
    fireEvent.change(strikePriceInput, { target: { value: '105' } });
    fireEvent.change(premiumInput, { target: { value: '3' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Maximum Profit|Max Profit/i)).toBeInTheDocument();
      expect(screen.getByText(/Maximum Loss|Max Loss/i)).toBeInTheDocument();
      expect(screen.getByText(/\$3/i)).toBeInTheDocument(); // Max loss = premium paid
    });
  });

  test('shows time decay analysis', async () => {
    render(<OptionsStrategyCalculator />);
    
    // Fill in parameters including time to expiration
    const stockPriceInput = screen.getByLabelText(/Stock Price|Underlying Price/i);
    const strikePriceInput = screen.getByLabelText(/Strike Price/i);
    const premiumInput = screen.getByLabelText(/Premium|Option Price/i);
    const daysInput = screen.getByLabelText(/Days|Expiration/i);
    
    fireEvent.change(stockPriceInput, { target: { value: '100' } });
    fireEvent.change(strikePriceInput, { target: { value: '100' } });
    fireEvent.change(premiumInput, { target: { value: '5' } });
    fireEvent.change(daysInput, { target: { value: '30' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Time Decay|Theta|Time Value/i)).toBeInTheDocument();
    });
  });

  test('provides educational context for each strategy', async () => {
    render(<OptionsStrategyCalculator />);
    
    // Select a strategy and check for educational content
    const strategySelect = screen.getByLabelText(/Strategy/i);
    fireEvent.change(strategySelect, { target: { value: 'covered-call' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/strategy is used|This approach|When to use/i)).toBeInTheDocument();
    });
  });

  test('handles invalid inputs appropriately', async () => {
    render(<OptionsStrategyCalculator />);
    
    // Input negative premium
    const premiumInput = screen.getByLabelText(/Premium|Option Price/i);
    fireEvent.change(premiumInput, { target: { value: '-5' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/invalid|error|positive/i)).toBeInTheDocument();
    });
  });

  test('calculates return on investment', async () => {
    render(<OptionsStrategyCalculator />);
    
    // Fill in parameters
    const stockPriceInput = screen.getByLabelText(/Stock Price|Underlying Price/i);
    const strikePriceInput = screen.getByLabelText(/Strike Price/i);
    const premiumInput = screen.getByLabelText(/Premium|Option Price/i);
    
    fireEvent.change(stockPriceInput, { target: { value: '110' } });
    fireEvent.change(strikePriceInput, { target: { value: '100' } });
    fireEvent.change(premiumInput, { target: { value: '5' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/ROI|Return|Percentage/i)).toBeInTheDocument();
      expect(screen.getByText(/100%|200%/i)).toBeInTheDocument(); // (10-5)/5 = 100%
    });
  });

  test('shows Greeks analysis for advanced users', async () => {
    render(<OptionsStrategyCalculator />);
    
    // Fill in parameters and look for Greeks
    const stockPriceInput = screen.getByLabelText(/Stock Price|Underlying Price/i);
    const strikePriceInput = screen.getByLabelText(/Strike Price/i);
    const premiumInput = screen.getByLabelText(/Premium|Option Price/i);
    const volatilityInput = screen.getByLabelText(/Volatility|IV/i);
    
    fireEvent.change(stockPriceInput, { target: { value: '100' } });
    fireEvent.change(strikePriceInput, { target: { value: '100' } });
    fireEvent.change(premiumInput, { target: { value: '5' } });
    fireEvent.change(volatilityInput, { target: { value: '25' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Delta|Gamma|Theta|Vega|Greeks/i)).toBeInTheDocument();
    });
  });

  test('provides risk warnings for complex strategies', async () => {
    render(<OptionsStrategyCalculator />);
    
    // Select a complex strategy
    const strategySelect = screen.getByLabelText(/Strategy/i);
    fireEvent.change(strategySelect, { target: { value: 'iron-condor' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/warning|risk|caution|advanced/i)).toBeInTheDocument();
    });
  });

  test('allows comparison of multiple strategies', () => {
    render(<OptionsStrategyCalculator />);
    
    // Check for comparison feature
    expect(screen.getByText(/Compare|vs|Alternative/i)).toBeInTheDocument();
  });

  test('shows real-time P&L with price changes', async () => {
    render(<OptionsStrategyCalculator />);
    
    // Fill in parameters
    const stockPriceInput = screen.getByLabelText(/Stock Price|Underlying Price/i);
    const strikePriceInput = screen.getByLabelText(/Strike Price/i);
    const premiumInput = screen.getByLabelText(/Premium|Option Price/i);
    
    fireEvent.change(stockPriceInput, { target: { value: '100' } });
    fireEvent.change(strikePriceInput, { target: { value: '105' } });
    fireEvent.change(premiumInput, { target: { value: '3' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    // Change stock price and see updated P&L
    fireEvent.change(stockPriceInput, { target: { value: '110' } });
    
    await waitFor(() => {
      expect(screen.getByText(/\$2|Profit.*2/i)).toBeInTheDocument(); // (110-105)-3 = $2
    });
  });
});
