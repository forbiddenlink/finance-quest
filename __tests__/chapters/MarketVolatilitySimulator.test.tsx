import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import MarketVolatilitySimulator from '@/components/chapters/fundamentals/lessons/MarketVolatilitySimulator';

// Mock useProgressStore
const mockUseProgressStore = {
  userProgress: {
    completedLessons: [],
    completedQuizzes: [],
    unlockedChapters: [1, 2, 3, 4, 5, 6, 7]
  },
  recordCalculatorUsage: jest.fn(),
  recordSimulationResult: jest.fn()
};

jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: () => mockUseProgressStore
}));

// Mock Framer Motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, whileHover, whileTap, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, whileHover, whileTap, ...props }: any) => <button {...props}>{children}</button>,
    h3: ({ children, whileHover, whileTap, ...props }: any) => <h3 {...props}>{children}</h3>,
    p: ({ children, whileHover, whileTap, ...props }: any) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock Recharts
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  AreaChart: ({ children }: any) => <div data-testid="area-chart">{children}</div>,
  Area: () => <div data-testid="area" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  Legend: () => <div data-testid="legend" />,
}));

// Mock Decimal.js
jest.mock('decimal.js', () => {
  return class MockDecimal {
    constructor(value: any) {
      this.value = parseFloat(value) || 0;
    }
    
    value: number;
    
    mul(other: any): MockDecimal {
      const otherValue = typeof other === 'object' ? other.value : parseFloat(other);
      return new MockDecimal(this.value * otherValue);
    }
    
    add(other: any): MockDecimal {
      const otherValue = typeof other === 'object' ? other.value : parseFloat(other);
      return new MockDecimal(this.value + otherValue);
    }
    
    sub(other: any): MockDecimal {
      const otherValue = typeof other === 'object' ? other.value : parseFloat(other);
      return new MockDecimal(this.value - otherValue);
    }
    
    div(other: any): MockDecimal {
      const otherValue = typeof other === 'object' ? other.value : parseFloat(other);
      return new MockDecimal(this.value / otherValue);
    }
    
    toNumber(): number {
      return this.value;
    }
    
    toString(): string {
      return this.value.toString();
    }
    
    toFixed(places: number): string {
      return this.value.toFixed(places);
    }
  };
});

describe('MarketVolatilitySimulator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the simulator with initial interface', () => {
    render(<MarketVolatilitySimulator />);
    
    expect(screen.getByText('Market Volatility Simulator')).toBeInTheDocument();
    expect(screen.getByText(/Test your investment strategies during historical market crises/)).toBeInTheDocument();
  });

  it('displays investment amount input field', () => {
    render(<MarketVolatilitySimulator />);
    
    const investmentInput = screen.getByLabelText(/Initial Investment Amount/i);
    expect(investmentInput).toBeInTheDocument();
    expect(investmentInput).toHaveValue(10000);
  });

  it('shows historical market events selection', () => {
    render(<MarketVolatilitySimulator />);
    
    expect(screen.getByText(/Select Market Crisis/i)).toBeInTheDocument();
    expect(screen.getByText(/2008 Financial Crisis/)).toBeInTheDocument();
    expect(screen.getByText(/2020 COVID-19 Crash/)).toBeInTheDocument();
    expect(screen.getByText(/2000 Dot-Com Bubble/)).toBeInTheDocument();
  });

  it('displays investment strategy options', () => {
    render(<MarketVolatilitySimulator />);
    
    expect(screen.getByText(/Investment Strategy/i)).toBeInTheDocument();
    expect(screen.getByText(/Panic Sell/)).toBeInTheDocument();
    expect(screen.getByText(/Hold Steady/)).toBeInTheDocument();
    expect(screen.getByText(/Buy the Dip/)).toBeInTheDocument();
    expect(screen.getByText(/Dollar Cost Average/)).toBeInTheDocument();
  });

  it('runs simulation when parameters are selected', async () => {
    render(<MarketVolatilitySimulator />);
    
    // Change investment amount
    const investmentInput = screen.getByLabelText(/Initial Investment Amount/i);
    fireEvent.change(investmentInput, { target: { value: '5000' } });
    
    // Select market event
    const financialCrisisButton = screen.getByText(/2008 Financial Crisis/);
    fireEvent.click(financialCrisisButton);
    
    // Select strategy
    const holdSteadyButton = screen.getByText(/Hold Steady/);
    fireEvent.click(holdSteadyButton);
    
    // Run simulation
    const runButton = screen.getByText(/Run Simulation/i);
    fireEvent.click(runButton);
    
    // Check simulation runs
    await waitFor(() => {
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });
  });

  it('displays simulation results after running', async () => {
    render(<MarketVolatilitySimulator />);
    
    // Run a simulation
    const financialCrisisButton = screen.getByText(/2008 Financial Crisis/);
    fireEvent.click(financialCrisisButton);
    
    const holdSteadyButton = screen.getByText(/Hold Steady/);
    fireEvent.click(holdSteadyButton);
    
    const runButton = screen.getByText(/Run Simulation/i);
    fireEvent.click(runButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Simulation Results/i)).toBeInTheDocument();
      expect(screen.getByText(/Portfolio Value Timeline/i)).toBeInTheDocument();
    });
  });

  it('shows strategy comparison when multiple strategies selected', async () => {
    render(<MarketVolatilitySimulator />);
    
    // Select crisis
    const covidCrashButton = screen.getByText(/2020 COVID-19 Crash/);
    fireEvent.click(covidCrashButton);
    
    // Select multiple strategies
    const panicSellButton = screen.getByText(/Panic Sell/);
    const buyTheDipButton = screen.getByText(/Buy the Dip/);
    
    fireEvent.click(panicSellButton);
    fireEvent.click(buyTheDipButton);
    
    const runButton = screen.getByText(/Run Simulation/i);
    fireEvent.click(runButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Strategy Comparison/i)).toBeInTheDocument();
    });
  });

  it('displays educational insights based on simulation results', async () => {
    render(<MarketVolatilitySimulator />);
    
    // Run simulation
    const dotComBubbleButton = screen.getByText(/2000 Dot-Com Bubble/);
    fireEvent.click(dotComBubbleButton);
    
    const dollarCostAverageButton = screen.getByText(/Dollar Cost Average/);
    fireEvent.click(dollarCostAverageButton);
    
    const runButton = screen.getByText(/Run Simulation/i);
    fireEvent.click(runButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Key Insights/i)).toBeInTheDocument();
      expect(screen.getByText(/What This Teaches Us/i)).toBeInTheDocument();
    });
  });

  it('tracks calculator usage for analytics', () => {
    render(<MarketVolatilitySimulator />);
    
    expect(mockUseProgressStore.recordCalculatorUsage).toHaveBeenCalledWith('market-volatility-simulator');
  });

  it('records simulation results to progress store', async () => {
    render(<MarketVolatilitySimulator />);
    
    // Run complete simulation
    const financialCrisisButton = screen.getByText(/2008 Financial Crisis/);
    fireEvent.click(financialCrisisButton);
    
    const holdSteadyButton = screen.getByText(/Hold Steady/);
    fireEvent.click(holdSteadyButton);
    
    const runButton = screen.getByText(/Run Simulation/i);
    fireEvent.click(runButton);
    
    await waitFor(() => {
      expect(mockUseProgressStore.recordSimulationResult).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'market-volatility',
          event: '2008 Financial Crisis',
          strategy: 'Hold Steady'
        })
      );
    });
  });

  it('handles invalid investment amounts gracefully', () => {
    render(<MarketVolatilitySimulator />);
    
    const investmentInput = screen.getByLabelText(/Initial Investment Amount/i);
    
    // Test negative amount
    fireEvent.change(investmentInput, { target: { value: '-1000' } });
    expect(investmentInput).toHaveValue(1000); // Should correct to minimum
    
    // Test zero amount
    fireEvent.change(investmentInput, { target: { value: '0' } });
    expect(investmentInput).toHaveValue(1000); // Should correct to minimum
  });

  it('shows appropriate warnings for high-risk strategies', async () => {
    render(<MarketVolatilitySimulator />);
    
    // Select panic sell strategy
    const panicSellButton = screen.getByText(/Panic Sell/);
    fireEvent.click(panicSellButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Warning/i)).toBeInTheDocument();
    });
  });

  it('displays performance metrics correctly', async () => {
    render(<MarketVolatilitySimulator />);
    
    // Run simulation
    const financialCrisisButton = screen.getByText(/2008 Financial Crisis/);
    fireEvent.click(financialCrisisButton);
    
    const buyTheDipButton = screen.getByText(/Buy the Dip/);
    fireEvent.click(buyTheDipButton);
    
    const runButton = screen.getByText(/Run Simulation/i);
    fireEvent.click(runButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Total Return/i)).toBeInTheDocument();
      expect(screen.getByText(/Maximum Drawdown/i)).toBeInTheDocument();
      expect(screen.getByText(/Recovery Time/i)).toBeInTheDocument();
    });
  });

  it('shows historical context for each market event', () => {
    render(<MarketVolatilitySimulator />);
    
    // Select 2008 Financial Crisis
    const financialCrisisButton = screen.getByText(/2008 Financial Crisis/);
    fireEvent.click(financialCrisisButton);
    
    expect(screen.getByText(/caused by subprime mortgage crisis/i)).toBeInTheDocument();
    
    // Select COVID-19 Crash
    const covidCrashButton = screen.getByText(/2020 COVID-19 Crash/);
    fireEvent.click(covidCrashButton);
    
    expect(screen.getByText(/global pandemic lockdowns/i)).toBeInTheDocument();
  });

  it('handles reset functionality', async () => {
    render(<MarketVolatilitySimulator />);
    
    // Run a simulation first
    const financialCrisisButton = screen.getByText(/2008 Financial Crisis/);
    fireEvent.click(financialCrisisButton);
    
    const holdSteadyButton = screen.getByText(/Hold Steady/);
    fireEvent.click(holdSteadyButton);
    
    const runButton = screen.getByText(/Run Simulation/i);
    fireEvent.click(runButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Simulation Results/i)).toBeInTheDocument();
    });
    
    // Reset simulation
    const resetButton = screen.getByText(/Reset/i);
    fireEvent.click(resetButton);
    
    // Should return to initial state
    expect(screen.queryByText(/Simulation Results/i)).not.toBeInTheDocument();
  });

  it('validates investment amount constraints', () => {
    render(<MarketVolatilitySimulator />);
    
    const investmentInput = screen.getByLabelText(/Initial Investment Amount/i);
    
    // Test maximum amount
    fireEvent.change(investmentInput, { target: { value: '2000000' } });
    expect(investmentInput).toHaveValue(1000000); // Should be capped at maximum
    
    // Test normal amount
    fireEvent.change(investmentInput, { target: { value: '50000' } });
    expect(investmentInput).toHaveValue(50000);
  });

  it('displays proper loading states during simulation', async () => {
    render(<MarketVolatilitySimulator />);
    
    const financialCrisisButton = screen.getByText(/2008 Financial Crisis/);
    fireEvent.click(financialCrisisButton);
    
    const holdSteadyButton = screen.getByText(/Hold Steady/);
    fireEvent.click(holdSteadyButton);
    
    const runButton = screen.getByText(/Run Simulation/i);
    fireEvent.click(runButton);
    
    // Should show loading state
    expect(screen.getByText(/Running Simulation/i)).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.queryByText(/Running Simulation/i)).not.toBeInTheDocument();
    });
  });

  it('provides educational content about market volatility', () => {
    render(<MarketVolatilitySimulator />);
    
    expect(screen.getByText(/Market volatility is normal/i)).toBeInTheDocument();
    expect(screen.getByText(/Time in the market beats timing the market/i)).toBeInTheDocument();
  });

  it('handles multiple strategy selection correctly', () => {
    render(<MarketVolatilitySimulator />);
    
    const panicSellButton = screen.getByText(/Panic Sell/);
    const holdSteadyButton = screen.getByText(/Hold Steady/);
    const buyTheDipButton = screen.getByText(/Buy the Dip/);
    
    // Select multiple strategies
    fireEvent.click(panicSellButton);
    fireEvent.click(holdSteadyButton);
    fireEvent.click(buyTheDipButton);
    
    // All should be selected
    expect(panicSellButton).toHaveClass('bg-blue-500');
    expect(holdSteadyButton).toHaveClass('bg-blue-500');
    expect(buyTheDipButton).toHaveClass('bg-blue-500');
  });

  it('shows accurate historical market data', async () => {
    render(<MarketVolatilitySimulator />);
    
    const financialCrisisButton = screen.getByText(/2008 Financial Crisis/);
    fireEvent.click(financialCrisisButton);
    
    // Should show accurate decline percentages
    expect(screen.getByText(/-56.8%/)).toBeInTheDocument(); // S&P 500 peak to trough
    
    const covidCrashButton = screen.getByText(/2020 COVID-19 Crash/);
    fireEvent.click(covidCrashButton);
    
    expect(screen.getByText(/-33.9%/)).toBeInTheDocument(); // COVID crash magnitude
  });

  it('demonstrates compound growth over recovery periods', async () => {
    render(<MarketVolatilitySimulator />);
    
    // Run long-term simulation
    const financialCrisisButton = screen.getByText(/2008 Financial Crisis/);
    fireEvent.click(financialCrisisButton);
    
    const holdSteadyButton = screen.getByText(/Hold Steady/);
    fireEvent.click(holdSteadyButton);
    
    const runButton = screen.getByText(/Run Simulation/i);
    fireEvent.click(runButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Long-term recovery shows the power of staying invested/i)).toBeInTheDocument();
    });
  });

  it('provides actionable lessons from simulation results', async () => {
    render(<MarketVolatilitySimulator />);
    
    const covidCrashButton = screen.getByText(/2020 COVID-19 Crash/);
    fireEvent.click(covidCrashButton);
    
    const dollarCostAverageButton = screen.getByText(/Dollar Cost Average/);
    fireEvent.click(dollarCostAverageButton);
    
    const runButton = screen.getByText(/Run Simulation/i);
    fireEvent.click(runButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Key Takeaway/i)).toBeInTheDocument();
      expect(screen.getByText(/Systematic investing reduces emotional decision-making/i)).toBeInTheDocument();
    });
  });

  it('handles edge case scenarios', () => {
    render(<MarketVolatilitySimulator />);
    
    // Test with no crisis selected
    const runButton = screen.getByText(/Run Simulation/i);
    fireEvent.click(runButton);
    
    expect(screen.getByText(/Please select a market crisis/i)).toBeInTheDocument();
    
    // Test with no strategy selected
    const financialCrisisButton = screen.getByText(/2008 Financial Crisis/);
    fireEvent.click(financialCrisisButton);
    fireEvent.click(runButton);
    
    expect(screen.getByText(/Please select at least one strategy/i)).toBeInTheDocument();
  });

  it('unmounts without errors', () => {
    const { unmount } = render(<MarketVolatilitySimulator />);
    expect(() => unmount()).not.toThrow();
  });
});
