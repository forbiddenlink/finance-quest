import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DollarCostAveragingCalculator from '@/components/chapters/fundamentals/calculators/DollarCostAveragingCalculator';

// Mock the progress store
const mockRecordCalculatorUsage = jest.fn();
jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: () => ({
    recordCalculatorUsage: mockRecordCalculatorUsage,
  }),
}));

// Mock recharts components for testing
jest.mock('recharts', () => ({
  LineChart: ({ children }: any) => <div data-testid="line-chart">{children}</div>,
  Line: () => <div data-testid="line" />,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="cartesian-grid" />,
  Tooltip: () => <div data-testid="tooltip" />,
  ResponsiveContainer: ({ children }: any) => <div data-testid="responsive-container">{children}</div>,
  ReferenceLine: () => <div data-testid="reference-line" />,
}));

describe('DollarCostAveragingCalculator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component without crashing', () => {
    render(<DollarCostAveragingCalculator />);
    
    expect(screen.getByText('Dollar Cost Averaging Calculator')).toBeInTheDocument();
    expect(screen.getByText('Discover how consistent investing smooths market volatility and builds wealth')).toBeInTheDocument();
  });

  it('records calculator usage on mount', () => {
    render(<DollarCostAveragingCalculator />);
    
    expect(mockRecordCalculatorUsage).toHaveBeenCalledWith('dollar-cost-averaging-calculator');
  });

  it('displays investment parameter controls', () => {
    render(<DollarCostAveragingCalculator />);
    
    expect(screen.getByText('Investment Parameters')).toBeInTheDocument();
    expect(screen.getByLabelText(/monthly investment amount/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/investment period in months/i)).toBeInTheDocument();
    expect(screen.getByText('Market Scenario')).toBeInTheDocument();
  });

  it('displays market scenario options', () => {
    render(<DollarCostAveragingCalculator />);
    
    expect(screen.getByText('Bull Market')).toBeInTheDocument();
    expect(screen.getByText('Bear Market')).toBeInTheDocument();
    expect(screen.getByText('Volatile Market')).toBeInTheDocument();
    expect(screen.getByText('Steady Growth')).toBeInTheDocument();
  });

  it('allows input changes for monthly investment', async () => {
    render(<DollarCostAveragingCalculator />);
    
    const monthlyInput = screen.getByLabelText(/monthly investment amount/i);
    fireEvent.change(monthlyInput, { target: { value: '1000' } });
    
    await waitFor(() => {
      expect(monthlyInput).toHaveValue(1000);
    });
  });

  it('allows input changes for investment period', async () => {
    render(<DollarCostAveragingCalculator />);
    
    const periodInput = screen.getByLabelText(/investment period in months/i);
    fireEvent.change(periodInput, { target: { value: '36' } });
    
    await waitFor(() => {
      expect(periodInput).toHaveValue(36);
    });
  });

  it('displays years calculation for investment period', () => {
    render(<DollarCostAveragingCalculator />);
    
    // Default is 24 months = 2.0 years
    expect(screen.getByText('24 months = 2.0 years')).toBeInTheDocument();
  });

  it('allows scenario selection', async () => {
    render(<DollarCostAveragingCalculator />);
    
    const bullMarketButton = screen.getByText('Bull Market').closest('button');
    expect(bullMarketButton).toBeInTheDocument();
    
    fireEvent.click(bullMarketButton!);
    
    await waitFor(() => {
      // Bull market button should be selected (has primary button styling)
      expect(bullMarketButton).toHaveClass('border-blue-500');
    });
  });

  it('displays key metrics cards', () => {
    render(<DollarCostAveragingCalculator />);
    
    expect(screen.getByText('Final Portfolio Value')).toBeInTheDocument();
    expect(screen.getByText('Total Invested')).toBeInTheDocument();
    expect(screen.getByText('Average Cost/Share')).toBeInTheDocument();
  });

  it('shows portfolio growth chart', () => {
    render(<DollarCostAveragingCalculator />);
    
    expect(screen.getByText('Portfolio Growth Over Time')).toBeInTheDocument();
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  it('displays lump sum comparison toggle', () => {
    render(<DollarCostAveragingCalculator />);
    
    expect(screen.getByText('Compare with Lump Sum')).toBeInTheDocument();
    
    const toggleButton = screen.getByLabelText(/toggle lump sum comparison/i);
    expect(toggleButton).toBeInTheDocument();
    expect(toggleButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('toggles lump sum comparison', async () => {
    render(<DollarCostAveragingCalculator />);
    
    const toggleButton = screen.getByLabelText(/toggle lump sum comparison/i);
    
    // Initially enabled
    expect(toggleButton).toHaveAttribute('aria-pressed', 'true');
    
    fireEvent.click(toggleButton);
    
    await waitFor(() => {
      expect(toggleButton).toHaveAttribute('aria-pressed', 'false');
    });
  });

  it('shows lump sum comparison when enabled', () => {
    render(<DollarCostAveragingCalculator />);
    
    expect(screen.getByText('DCA vs. Lump Sum Comparison')).toBeInTheDocument();
    expect(screen.getByText('Dollar Cost Averaging')).toBeInTheDocument();
    expect(screen.getByText('Lump Sum Investment')).toBeInTheDocument();
  });

  it('hides lump sum comparison when disabled', async () => {
    render(<DollarCostAveragingCalculator />);
    
    const toggleButton = screen.getByLabelText(/toggle lump sum comparison/i);
    fireEvent.click(toggleButton);
    
    await waitFor(() => {
      expect(screen.queryByText('DCA vs. Lump Sum Comparison')).not.toBeInTheDocument();
    });
  });

  it('displays educational content', () => {
    render(<DollarCostAveragingCalculator />);
    
    expect(screen.getByText('Dollar Cost Averaging Benefits')).toBeInTheDocument();
    expect(screen.getByText('🎯 Reduces Timing Risk')).toBeInTheDocument();
    expect(screen.getByText('📈 Smooths Volatility')).toBeInTheDocument();
    expect(screen.getByText('💪 Builds Discipline')).toBeInTheDocument();
  });

  it('shows pro tip section', () => {
    render(<DollarCostAveragingCalculator />);
    
    expect(screen.getByText('Pro Tip: When to Use DCA vs. Lump Sum')).toBeInTheDocument();
    expect(screen.getByText(/Use DCA when:/)).toBeInTheDocument();
    expect(screen.getByText(/Use Lump Sum when:/)).toBeInTheDocument();
  });

  it('enforces minimum values for inputs', async () => {
    render(<DollarCostAveragingCalculator />);
    
    const monthlyInput = screen.getByLabelText(/monthly investment amount/i);
    fireEvent.change(monthlyInput, { target: { value: '25' } });
    
    await waitFor(() => {
      expect(monthlyInput).toHaveValue(50); // Should enforce minimum of 50
    });
  });

  it('enforces maximum values for investment period', async () => {
    render(<DollarCostAveragingCalculator />);
    
    const periodInput = screen.getByLabelText(/investment period in months/i);
    fireEvent.change(periodInput, { target: { value: '150' } });
    
    await waitFor(() => {
      expect(periodInput).toHaveValue(120); // Should enforce maximum of 120
    });
  });

  it('updates calculations when inputs change', async () => {
    render(<DollarCostAveragingCalculator />);
    
    const monthlyInput = screen.getByLabelText(/monthly investment amount/i);
    
    // Change the monthly investment
    fireEvent.change(monthlyInput, { target: { value: '1000' } });
    
    await waitFor(() => {
      // Should show updated total invested calculation
      expect(screen.getByText('1000 × 24 months')).toBeInTheDocument();
    });
  });

  it('displays different scenarios with emoji icons', () => {
    render(<DollarCostAveragingCalculator />);
    
    expect(screen.getByText('📈')).toBeInTheDocument(); // Bull market
    expect(screen.getByText('📉')).toBeInTheDocument(); // Bear market
    expect(screen.getByText('🎢')).toBeInTheDocument(); // Volatile market
    expect(screen.getByText('📊')).toBeInTheDocument(); // Steady growth
  });

  it('shows currency formatting in results', () => {
    render(<DollarCostAveragingCalculator />);
    
    // Should show dollar signs in the metrics
    const dollarSigns = screen.getAllByText(/\$/);
    expect(dollarSigns.length).toBeGreaterThan(0);
  });

  it('provides accessible labels for all inputs', () => {
    render(<DollarCostAveragingCalculator />);
    
    const monthlyInput = screen.getByLabelText(/monthly investment amount/i);
    const periodInput = screen.getByLabelText(/investment period in months/i);
    const toggleButton = screen.getByLabelText(/toggle lump sum comparison/i);
    
    expect(monthlyInput).toHaveAttribute('aria-label');
    expect(periodInput).toHaveAttribute('aria-label');
    expect(toggleButton).toHaveAttribute('aria-label');
  });

  it('has proper ARIA attributes for toggle button', () => {
    render(<DollarCostAveragingCalculator />);
    
    const toggleButton = screen.getByLabelText(/toggle lump sum comparison/i);
    
    expect(toggleButton).toHaveAttribute('aria-pressed');
    expect(toggleButton).toHaveAttribute('title');
  });

  it('handles error states gracefully', () => {
    render(<DollarCostAveragingCalculator />);
    
    // Component should render without throwing errors
    expect(screen.getByText('Dollar Cost Averaging Calculator')).toBeInTheDocument();
  });

  it('unmounts without errors', () => {
    const { unmount } = render(<DollarCostAveragingCalculator />);
    expect(() => unmount()).not.toThrow();
  });
});
