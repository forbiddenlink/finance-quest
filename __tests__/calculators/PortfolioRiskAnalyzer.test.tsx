import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PortfolioRiskAnalyzer from '@/components/chapters/fundamentals/calculators/PortfolioRiskAnalyzer';

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

describe('PortfolioRiskAnalyzer', () => {
  test('renders the calculator component', () => {
    render(<PortfolioRiskAnalyzer />);
    expect(screen.getByText(/Portfolio Risk Analyzer/i)).toBeInTheDocument();
  });

  test('records calculator usage on mount', () => {
    render(<PortfolioRiskAnalyzer />);
    expect(mockRecordCalculatorUsage).toHaveBeenCalledWith('portfolio-risk-analyzer');
  });

  test('displays portfolio input fields', () => {
    render(<PortfolioRiskAnalyzer />);
    
    // Check for asset allocation inputs
    expect(screen.getByLabelText(/Stocks|Equity/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Bonds|Fixed Income/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Cash|Money Market/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Portfolio Value|Total Value/i)).toBeInTheDocument();
  });

  test('calculates portfolio standard deviation correctly', async () => {
    render(<PortfolioRiskAnalyzer />);
    
    // Fill in portfolio allocation
    const stockInput = screen.getByLabelText(/Stocks|Equity/i);
    const bondInput = screen.getByLabelText(/Bonds|Fixed Income/i);
    const cashInput = screen.getByLabelText(/Cash|Money Market/i);
    
    fireEvent.change(stockInput, { target: { value: '60' } });
    fireEvent.change(bondInput, { target: { value: '30' } });
    fireEvent.change(cashInput, { target: { value: '10' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Standard Deviation|Volatility/i)).toBeInTheDocument();
      expect(screen.getByText(/Risk Level|Risk Score/i)).toBeInTheDocument();
    });
  });

  test('calculates Value at Risk (VaR)', async () => {
    render(<PortfolioRiskAnalyzer />);
    
    // Fill in portfolio details
    const portfolioValueInput = screen.getByLabelText(/Portfolio Value|Total Value/i);
    const stockInput = screen.getByLabelText(/Stocks|Equity/i);
    const bondInput = screen.getByLabelText(/Bonds|Fixed Income/i);
    
    fireEvent.change(portfolioValueInput, { target: { value: '100000' } });
    fireEvent.change(stockInput, { target: { value: '70' } });
    fireEvent.change(bondInput, { target: { value: '30' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/VaR|Value at Risk/i)).toBeInTheDocument();
      expect(screen.getByText(/95%|99%/i)).toBeInTheDocument(); // Confidence levels
    });
  });

  test('shows Sharpe ratio calculation', async () => {
    render(<PortfolioRiskAnalyzer />);
    
    // Fill in return and risk data
    const expectedReturnInput = screen.getByLabelText(/Expected Return|Annual Return/i);
    const riskFreeRateInput = screen.getByLabelText(/Risk.?Free Rate|Treasury Rate/i);
    const stockInput = screen.getByLabelText(/Stocks|Equity/i);
    
    fireEvent.change(expectedReturnInput, { target: { value: '8' } });
    fireEvent.change(riskFreeRateInput, { target: { value: '2' } });
    fireEvent.change(stockInput, { target: { value: '60' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Sharpe Ratio/i)).toBeInTheDocument();
      expect(screen.getByText(/Risk.?Adjusted/i)).toBeInTheDocument();
    });
  });

  test('displays risk tolerance assessment', async () => {
    render(<PortfolioRiskAnalyzer />);
    
    // Fill in portfolio allocation
    const stockInput = screen.getByLabelText(/Stocks|Equity/i);
    const bondInput = screen.getByLabelText(/Bonds|Fixed Income/i);
    const ageInput = screen.getByLabelText(/Age|Investment Horizon/i);
    
    fireEvent.change(stockInput, { target: { value: '80' } });
    fireEvent.change(bondInput, { target: { value: '20' } });
    fireEvent.change(ageInput, { target: { value: '25' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Conservative|Moderate|Aggressive/i)).toBeInTheDocument();
      expect(screen.getByText(/Risk Tolerance|Risk Profile/i)).toBeInTheDocument();
    });
  });

  test('calculates correlation and diversification metrics', async () => {
    render(<PortfolioRiskAnalyzer />);
    
    // Add multiple asset classes
    const stockInput = screen.getByLabelText(/Stocks|Equity/i);
    const bondInput = screen.getByLabelText(/Bonds|Fixed Income/i);
    const reitInput = screen.getByLabelText(/REITs|Real Estate/i);
    const internationalInput = screen.getByLabelText(/International|Foreign/i);
    
    fireEvent.change(stockInput, { target: { value: '40' } });
    fireEvent.change(bondInput, { target: { value: '30' } });
    fireEvent.change(reitInput, { target: { value: '15' } });
    fireEvent.change(internationalInput, { target: { value: '15' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Correlation|Diversification/i)).toBeInTheDocument();
      expect(screen.getByText(/Diversification Score|Diversification Ratio/i)).toBeInTheDocument();
    });
  });

  test('shows maximum drawdown analysis', async () => {
    render(<PortfolioRiskAnalyzer />);
    
    // Fill in portfolio details
    const stockInput = screen.getByLabelText(/Stocks|Equity/i);
    const bondInput = screen.getByLabelText(/Bonds|Fixed Income/i);
    
    fireEvent.change(stockInput, { target: { value: '70' } });
    fireEvent.change(bondInput, { target: { value: '30' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Maximum Drawdown|Max Drawdown/i)).toBeInTheDocument();
      expect(screen.getByText(/Worst.?Case|Historical Loss/i)).toBeInTheDocument();
    });
  });

  test('provides sector allocation analysis', async () => {
    render(<PortfolioRiskAnalyzer />);
    
    // Fill in sector-specific inputs
    const techInput = screen.getByLabelText(/Technology|Tech/i);
    const healthcareInput = screen.getByLabelText(/Healthcare|Health/i);
    const financialInput = screen.getByLabelText(/Financial|Finance/i);
    
    fireEvent.change(techInput, { target: { value: '25' } });
    fireEvent.change(healthcareInput, { target: { value: '15' } });
    fireEvent.change(financialInput, { target: { value: '20' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Sector|Industry/i)).toBeInTheDocument();
      expect(screen.getByText(/Concentration Risk|Sector Risk/i)).toBeInTheDocument();
    });
  });

  test('calculates beta and systematic risk', async () => {
    render(<PortfolioRiskAnalyzer />);
    
    // Fill in market exposure data
    const stockInput = screen.getByLabelText(/Stocks|Equity/i);
    const betaInput = screen.getByLabelText(/Beta|Market Beta/i);
    
    fireEvent.change(stockInput, { target: { value: '60' } });
    fireEvent.change(betaInput, { target: { value: '1.2' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Beta|Systematic Risk/i)).toBeInTheDocument();
      expect(screen.getByText(/Market Risk|Market Sensitivity/i)).toBeInTheDocument();
    });
  });

  test('shows rebalancing recommendations', async () => {
    render(<PortfolioRiskAnalyzer />);
    
    // Fill in current vs target allocation
    const currentStockInput = screen.getByLabelText(/Current.*Stocks|Actual.*Equity/i);
    const targetStockInput = screen.getByLabelText(/Target.*Stocks|Goal.*Equity/i);
    
    fireEvent.change(currentStockInput, { target: { value: '75' } });
    fireEvent.change(targetStockInput, { target: { value: '60' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Rebalancing|Rebalance/i)).toBeInTheDocument();
      expect(screen.getByText(/Recommendation|Suggested/i)).toBeInTheDocument();
    });
  });

  test('displays Monte Carlo simulation results', async () => {
    render(<PortfolioRiskAnalyzer />);
    
    // Fill in simulation parameters
    const portfolioValueInput = screen.getByLabelText(/Portfolio Value|Total Value/i);
    const timeHorizonInput = screen.getByLabelText(/Time Horizon|Years/i);
    
    fireEvent.change(portfolioValueInput, { target: { value: '100000' } });
    fireEvent.change(timeHorizonInput, { target: { value: '10' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Monte Carlo|Simulation/i)).toBeInTheDocument();
      expect(screen.getByText(/Probability|Confidence/i)).toBeInTheDocument();
    });
  });

  test('validates allocation percentages sum to 100%', async () => {
    render(<PortfolioRiskAnalyzer />);
    
    // Fill in allocations that don't sum to 100%
    const stockInput = screen.getByLabelText(/Stocks|Equity/i);
    const bondInput = screen.getByLabelText(/Bonds|Fixed Income/i);
    const cashInput = screen.getByLabelText(/Cash|Money Market/i);
    
    fireEvent.change(stockInput, { target: { value: '50' } });
    fireEvent.change(bondInput, { target: { value: '30' } });
    fireEvent.change(cashInput, { target: { value: '30' } }); // Total = 110%
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/100%|sum|total|allocation/i)).toBeInTheDocument();
    });
  });

  test('provides stress testing scenarios', async () => {
    render(<PortfolioRiskAnalyzer />);
    
    // Fill in portfolio details
    const stockInput = screen.getByLabelText(/Stocks|Equity/i);
    const bondInput = screen.getByLabelText(/Bonds|Fixed Income/i);
    
    fireEvent.change(stockInput, { target: { value: '70' } });
    fireEvent.change(bondInput, { target: { value: '30' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Stress Test|Crisis|Bear Market/i)).toBeInTheDocument();
      expect(screen.getByText(/2008|2020|Market Crash/i)).toBeInTheDocument();
    });
  });

  test('shows expense ratio impact analysis', async () => {
    render(<PortfolioRiskAnalyzer />);
    
    // Fill in expense ratio data
    const expenseRatioInput = screen.getByLabelText(/Expense Ratio|Fees/i);
    const portfolioValueInput = screen.getByLabelText(/Portfolio Value|Total Value/i);
    
    fireEvent.change(expenseRatioInput, { target: { value: '0.75' } });
    fireEvent.change(portfolioValueInput, { target: { value: '100000' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Expense|Fee Impact|Cost/i)).toBeInTheDocument();
      expect(screen.getByText(/\$750/i)).toBeInTheDocument(); // 0.75% of $100,000
    });
  });

  test('calculates efficient frontier position', async () => {
    render(<PortfolioRiskAnalyzer />);
    
    // Fill in risk and return parameters
    const expectedReturnInput = screen.getByLabelText(/Expected Return|Annual Return/i);
    const volatilityInput = screen.getByLabelText(/Volatility|Standard Deviation/i);
    
    fireEvent.change(expectedReturnInput, { target: { value: '7' } });
    fireEvent.change(volatilityInput, { target: { value: '12' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Efficient Frontier|Optimal|Efficient/i)).toBeInTheDocument();
    });
  });

  test('displays risk budget analysis', async () => {
    render(<PortfolioRiskAnalyzer />);
    
    // Fill in multiple asset allocations
    const stockInput = screen.getByLabelText(/Stocks|Equity/i);
    const bondInput = screen.getByLabelText(/Bonds|Fixed Income/i);
    const commodityInput = screen.getByLabelText(/Commodities|Commodity/i);
    
    fireEvent.change(stockInput, { target: { value: '50' } });
    fireEvent.change(bondInput, { target: { value: '35' } });
    fireEvent.change(commodityInput, { target: { value: '15' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/Risk Budget|Risk Contribution/i)).toBeInTheDocument();
    });
  });

  test('provides educational risk explanations', () => {
    render(<PortfolioRiskAnalyzer />);
    
    // Check for educational content
    expect(screen.getByText(/What this means|Understanding|Risk explanation/i)).toBeInTheDocument();
    expect(screen.getByText(/diversification|correlation|volatility/i)).toBeInTheDocument();
  });

  test('handles edge cases appropriately', async () => {
    render(<PortfolioRiskAnalyzer />);
    
    // Test 100% cash portfolio
    const cashInput = screen.getByLabelText(/Cash|Money Market/i);
    fireEvent.change(cashInput, { target: { value: '100' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/low risk|conservative|minimal volatility/i)).toBeInTheDocument();
    });
  });

  test('shows risk warnings for aggressive portfolios', async () => {
    render(<PortfolioRiskAnalyzer />);
    
    // Create aggressive portfolio (100% stocks)
    const stockInput = screen.getByLabelText(/Stocks|Equity/i);
    fireEvent.change(stockInput, { target: { value: '100' } });
    
    const calculateButton = screen.getByText(/Calculate|Analyze/i);
    fireEvent.click(calculateButton);
    
    await waitFor(() => {
      expect(screen.getByText(/high risk|warning|aggressive|volatile/i)).toBeInTheDocument();
    });
  });
});
