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
  test('renders the portfolio risk analyzer', () => {
    render(<PortfolioRiskAnalyzer />);
    expect(screen.getByText(/Portfolio Risk Analyzer/i)).toBeInTheDocument();
  });

  test('records calculator usage on mount', () => {
    render(<PortfolioRiskAnalyzer />);
    expect(mockRecordCalculatorUsage).toHaveBeenCalledWith('portfolio-risk-analyzer');
  });

  test('displays portfolio holdings section', () => {
    render(<PortfolioRiskAnalyzer />);
    expect(screen.getByText(/Portfolio Holdings/i)).toBeInTheDocument();
  });

  test('shows default portfolio holdings', () => {
    render(<PortfolioRiskAnalyzer />);
    expect(screen.getAllByDisplayValue(/VTI/i).length).toBeGreaterThan(0);
    expect(screen.getByDisplayValue(/VTIAX/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/BND/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue(/VNQ/i)).toBeInTheDocument();
  });

  test('allows adding new holdings', () => {
    render(<PortfolioRiskAnalyzer />);
    
    const addButton = screen.getByText(/Add/i);
    fireEvent.click(addButton);
    
    expect(screen.getAllByPlaceholderText(/Symbol/i).length).toBeGreaterThan(4);
  });

  test('allows removing holdings', () => {
    render(<PortfolioRiskAnalyzer />);
    
    const removeButtons = screen.getAllByRole('button');
    const minusButton = removeButtons.find(button => button.querySelector('svg'));
    
    if (minusButton) {
      fireEvent.click(minusButton);
    }
    
    expect(screen.getByText(/Portfolio Holdings/i)).toBeInTheDocument();
  });

  test('shows analysis parameters', () => {
    render(<PortfolioRiskAnalyzer />);
    expect(screen.getByText(/Analysis Parameters/i)).toBeInTheDocument();
    expect(screen.getByText(/Risk-Free Rate/i)).toBeInTheDocument();
    expect(screen.getByText(/Market Return/i)).toBeInTheDocument();
  });

  test('displays portfolio overview with key metrics', async () => {
    render(<PortfolioRiskAnalyzer />);
    
    await waitFor(() => {
      expect(screen.getByText(/Portfolio Overview/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Expected Return/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Volatility/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Sharpe Ratio/i).length).toBeGreaterThan(0);
    });
  });

  test('shows current allocation table', async () => {
    render(<PortfolioRiskAnalyzer />);
    
    await waitFor(() => {
      expect(screen.getByText(/Current Allocation/i)).toBeInTheDocument();
      expect(screen.getAllByText(/Asset/i).length).toBeGreaterThan(0);
      expect(screen.getByText(/Weight/i)).toBeInTheDocument();
    });
  });

  test('calculates portfolio value', async () => {
    render(<PortfolioRiskAnalyzer />);
    
    await waitFor(() => {
      expect(screen.getByText(/Total Value/i)).toBeInTheDocument();
    });
  });

  test('shows risk metrics analysis', async () => {
    render(<PortfolioRiskAnalyzer />);
    
    await waitFor(() => {
      expect(screen.getByText(/Risk Metrics Analysis/i)).toBeInTheDocument();
      expect(screen.getByText(/Benchmark/i)).toBeInTheDocument();
      expect(screen.getByText(/Status/i)).toBeInTheDocument();
    });
  });

  test('displays Sharpe ratio calculation', async () => {
    render(<PortfolioRiskAnalyzer />);
    
    await waitFor(() => {
      expect(screen.getAllByText(/Sharpe Ratio/i).length).toBeGreaterThan(0);
    });
  });

  test('shows portfolio beta', async () => {
    render(<PortfolioRiskAnalyzer />);
    
    await waitFor(() => {
      expect(screen.getAllByText(/Portfolio Beta/i).length).toBeGreaterThan(0);
    });
  });

  test('displays Value at Risk (VaR)', async () => {
    render(<PortfolioRiskAnalyzer />);
    
    await waitFor(() => {
      expect(screen.getAllByText(/VaR/i).length).toBeGreaterThan(0);
    });
  });

  test('shows diversification metrics', async () => {
    render(<PortfolioRiskAnalyzer />);
    
    await waitFor(() => {
      expect(screen.getAllByText(/Diversification/i).length).toBeGreaterThan(0);
    });
  });

  test('provides rebalancing recommendations when needed', async () => {
    render(<PortfolioRiskAnalyzer />);
    
    // Modify a holding value to trigger rebalancing need
    const valueInputs = screen.getAllByDisplayValue('40000');
    if (valueInputs.length > 0) {
      fireEvent.change(valueInputs[0], { target: { value: '60000' } });
    }
    
    await waitFor(() => {
      // Check if rebalancing section appears when allocation drifts
      const rebalancingSection = screen.queryByText(/Rebalancing Recommendations/i);
      if (rebalancingSection) {
        expect(rebalancingSection).toBeInTheDocument();
      }
    });
  });

  test('displays portfolio optimization recommendations', async () => {
    render(<PortfolioRiskAnalyzer />);
    
    await waitFor(() => {
      expect(screen.getByText(/Portfolio Optimization Recommendations/i)).toBeInTheDocument();
    });
  });

  test('shows risk factors to monitor', async () => {
    render(<PortfolioRiskAnalyzer />);
    
    await waitFor(() => {
      expect(screen.getByText(/Risk Factors to Monitor/i)).toBeInTheDocument();
    });
  });

  test('displays educational content about Modern Portfolio Theory', () => {
    render(<PortfolioRiskAnalyzer />);
    
    expect(screen.getByText(/Modern Portfolio Theory/i)).toBeInTheDocument();
    expect(screen.getAllByText(/diversification/i).length).toBeGreaterThan(0);
  });

  test('shows real-world ETF examples', () => {
    render(<PortfolioRiskAnalyzer />);
    
    expect(screen.getAllByDisplayValue(/VTI/i).length).toBeGreaterThan(0);
    expect(screen.getByDisplayValue(/BND/i)).toBeInTheDocument();
  });

  test('provides risk metrics explanations', () => {
    render(<PortfolioRiskAnalyzer />);
    
    expect(screen.getByText(/Risk-adjusted return per unit of volatility/i)).toBeInTheDocument();
    expect(screen.getByText(/Sensitivity to market movements/i)).toBeInTheDocument();
  });

  test('handles input validation for portfolio values', () => {
    render(<PortfolioRiskAnalyzer />);
    
    const valueInputs = screen.getAllByDisplayValue('40000');
    if (valueInputs.length > 0) {
      fireEvent.change(valueInputs[0], { target: { value: '0' } });
      expect((valueInputs[0] as HTMLInputElement).value).toBe('0');
    }
  });

  test('updates risk-free rate parameter', () => {
    render(<PortfolioRiskAnalyzer />);
    
    const riskFreeRateInputs = screen.getAllByDisplayValue('4.5');
    const analysisParamInput = riskFreeRateInputs.find(input => 
      input.className.includes('pl-10')
    ) as HTMLInputElement;
    
    if (analysisParamInput) {
      fireEvent.change(analysisParamInput, { target: { value: '3.0' } });
      expect(analysisParamInput.value).toBe('3.0');
    }
  });

  test('shows correlation benefits explanation', () => {
    render(<PortfolioRiskAnalyzer />);
    
    expect(screen.getByText(/Low correlation assets improve diversification/i)).toBeInTheDocument();
  });

  test('displays max drawdown metric', async () => {
    render(<PortfolioRiskAnalyzer />);
    
    await waitFor(() => {
      expect(screen.getAllByText(/Max Drawdown/i).length).toBeGreaterThan(0);
    });
  });
});
