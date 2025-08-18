import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CommodityPortfolioBuilder from '@/components/shared/calculators/CommodityPortfolioBuilder';

// Mock the progress store
jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: () => ({
    recordCalculatorUsage: jest.fn(),
  }),
}));

describe('CommodityPortfolioBuilder', () => {
  describe('Portfolio Construction', () => {
    it('builds balanced commodity portfolio', async () => {
      render(<CommodityPortfolioBuilder />);
      
      // Add multiple commodities
      const addCommodityButton = screen.getByRole('button', { name: /add commodity/i });
      await userEvent.click(addCommodityButton);
      await userEvent.click(addCommodityButton);
      await userEvent.click(addCommodityButton);

      // Fill commodity details
      const commodities = [
        {
          'Commodity': 'Gold',
          'Allocation': '40',
          'Historical Volatility': '15',
          'Inflation Beta': '0.8',
        },
        {
          'Commodity': 'Silver',
          'Allocation': '30',
          'Historical Volatility': '25',
          'Inflation Beta': '0.7',
        },
        {
          'Commodity': 'Oil',
          'Allocation': '30',
          'Historical Volatility': '35',
          'Inflation Beta': '0.9',
        },
      ];

      for (const [index, commodity] of commodities.entries()) {
        for (const [label, value] of Object.entries(commodity)) {
          const inputs = screen.getAllByLabelText(new RegExp(label, 'i'));
          await userEvent.type(inputs[index], value);
        }
      }

      // Build portfolio
      const buildButton = screen.getByRole('button', { name: /build portfolio/i });
      await userEvent.click(buildButton);

      // Check portfolio metrics
      await waitFor(() => {
        expect(screen.getByText(/Portfolio Volatility/i)).toBeInTheDocument();
        expect(screen.getByText(/Inflation Protection/i)).toBeInTheDocument();
        expect(screen.getByText(/Diversification Score/i)).toBeInTheDocument();
      });
    });

    it('validates allocation percentages sum to 100', async () => {
      render(<CommodityPortfolioBuilder />);
      
      // Add commodities with invalid total allocation
      const addCommodityButton = screen.getByRole('button', { name: /add commodity/i });
      await userEvent.click(addCommodityButton);
      await userEvent.click(addCommodityButton);

      // Fill commodity details
      const commodities = [
        {
          'Commodity': 'Gold',
          'Allocation': '60',
        },
        {
          'Commodity': 'Silver',
          'Allocation': '60',
        },
      ];

      for (const [index, commodity] of commodities.entries()) {
        for (const [label, value] of Object.entries(commodity)) {
          const inputs = screen.getAllByLabelText(new RegExp(label, 'i'));
          await userEvent.type(inputs[index], value);
        }
      }

      // Try to build portfolio
      const buildButton = screen.getByRole('button', { name: /build portfolio/i });
      await userEvent.click(buildButton);

      // Check for validation error
      await waitFor(() => {
        expect(screen.getByText(/Allocations must sum to 100%/i)).toBeInTheDocument();
      });
    });
  });

  describe('Risk Analysis', () => {
    it('calculates portfolio risk metrics', async () => {
      render(<CommodityPortfolioBuilder />);
      
      // Add commodity with high volatility
      const addCommodityButton = screen.getByRole('button', { name: /add commodity/i });
      await userEvent.click(addCommodityButton);

      // Fill commodity details
      const inputs = {
        'Commodity': 'Oil',
        'Allocation': '100',
        'Historical Volatility': '35',
        'Maximum Drawdown': '60',
      };

      for (const [label, value] of Object.entries(inputs)) {
        const input = screen.getByLabelText(new RegExp(label, 'i'));
        await userEvent.type(input, value);
      }

      // Analyze risk
      const analyzeButton = screen.getByRole('button', { name: /analyze risk/i });
      await userEvent.click(analyzeButton);

      // Check risk metrics
      await waitFor(() => {
        expect(screen.getByText(/Value at Risk/i)).toBeInTheDocument();
        expect(screen.getByText(/Expected Shortfall/i)).toBeInTheDocument();
        expect(screen.getByText(/Risk Warning/i)).toBeInTheDocument();
      });
    });

    it('handles stress test scenarios', async () => {
      render(<CommodityPortfolioBuilder />);
      
      // Add commodity
      const addCommodityButton = screen.getByRole('button', { name: /add commodity/i });
      await userEvent.click(addCommodityButton);

      // Fill commodity details
      const inputs = {
        'Commodity': 'Gold',
        'Allocation': '100',
        'Historical Volatility': '15',
      };

      for (const [label, value] of Object.entries(inputs)) {
        const input = screen.getByLabelText(new RegExp(label, 'i'));
        await userEvent.type(input, value);
      }

      // Run stress test
      const stressTestButton = screen.getByRole('button', { name: /stress test/i });
      await userEvent.click(stressTestButton);

      // Check stress test results
      await waitFor(() => {
        expect(screen.getByText(/Recession Scenario/i)).toBeInTheDocument();
        expect(screen.getByText(/Inflation Shock/i)).toBeInTheDocument();
        expect(screen.getByText(/Currency Crisis/i)).toBeInTheDocument();
      });
    });
  });

  describe('Correlation Analysis', () => {
    it('analyzes cross-commodity correlations', async () => {
      render(<CommodityPortfolioBuilder />);
      
      // Add multiple commodities
      const addCommodityButton = screen.getByRole('button', { name: /add commodity/i });
      await userEvent.click(addCommodityButton);
      await userEvent.click(addCommodityButton);

      // Fill commodity details
      const commodities = [
        {
          'Commodity': 'Gold',
          'Allocation': '50',
        },
        {
          'Commodity': 'Oil',
          'Allocation': '50',
        },
      ];

      for (const [index, commodity] of commodities.entries()) {
        for (const [label, value] of Object.entries(commodity)) {
          const inputs = screen.getAllByLabelText(new RegExp(label, 'i'));
          await userEvent.type(inputs[index], value);
        }
      }

      // Analyze correlations
      const correlationButton = screen.getByRole('button', { name: /analyze correlations/i });
      await userEvent.click(correlationButton);

      // Check correlation analysis
      await waitFor(() => {
        expect(screen.getByText(/Correlation Matrix/i)).toBeInTheDocument();
        expect(screen.getByText(/Diversification Benefit/i)).toBeInTheDocument();
      });
    });

    it('identifies correlation clusters', async () => {
      render(<CommodityPortfolioBuilder />);
      
      // Add energy commodities
      const addCommodityButton = screen.getByRole('button', { name: /add commodity/i });
      await userEvent.click(addCommodityButton);
      await userEvent.click(addCommodityButton);

      // Fill commodity details
      const commodities = [
        {
          'Commodity': 'Oil',
          'Allocation': '50',
          'Sector': 'Energy',
        },
        {
          'Commodity': 'Natural Gas',
          'Allocation': '50',
          'Sector': 'Energy',
        },
      ];

      for (const [index, commodity] of commodities.entries()) {
        for (const [label, value] of Object.entries(commodity)) {
          const inputs = screen.getAllByLabelText(new RegExp(label, 'i'));
          await userEvent.type(inputs[index], value);
        }
      }

      // Analyze clusters
      const clusterButton = screen.getByRole('button', { name: /analyze clusters/i });
      await userEvent.click(clusterButton);

      // Check cluster analysis
      await waitFor(() => {
        expect(screen.getByText(/Sector Concentration/i)).toBeInTheDocument();
        expect(screen.getByText(/High Energy Exposure/i)).toBeInTheDocument();
      });
    });
  });

  describe('Inflation Protection', () => {
    it('calculates inflation hedging metrics', async () => {
      render(<CommodityPortfolioBuilder />);
      
      // Add inflation-sensitive commodity
      const addCommodityButton = screen.getByRole('button', { name: /add commodity/i });
      await userEvent.click(addCommodityButton);

      // Fill commodity details
      const inputs = {
        'Commodity': 'Gold',
        'Allocation': '100',
        'Inflation Beta': '0.8',
        'Crisis Beta': '0.3',
      };

      for (const [label, value] of Object.entries(inputs)) {
        const input = screen.getByLabelText(new RegExp(label, 'i'));
        await userEvent.type(input, value);
      }

      // Analyze inflation protection
      const inflationButton = screen.getByRole('button', { name: /analyze inflation/i });
      await userEvent.click(inflationButton);

      // Check inflation metrics
      await waitFor(() => {
        expect(screen.getByText(/Inflation Protection Score/i)).toBeInTheDocument();
        expect(screen.getByText(/Crisis Protection/i)).toBeInTheDocument();
      });
    });

    it('simulates inflation scenarios', async () => {
      render(<CommodityPortfolioBuilder />);
      
      // Add commodity mix
      const addCommodityButton = screen.getByRole('button', { name: /add commodity/i });
      await userEvent.click(addCommodityButton);
      await userEvent.click(addCommodityButton);

      // Fill commodity details
      const commodities = [
        {
          'Commodity': 'Gold',
          'Allocation': '60',
          'Inflation Beta': '0.8',
        },
        {
          'Commodity': 'Oil',
          'Allocation': '40',
          'Inflation Beta': '0.9',
        },
      ];

      for (const [index, commodity] of commodities.entries()) {
        for (const [label, value] of Object.entries(commodity)) {
          const inputs = screen.getAllByLabelText(new RegExp(label, 'i'));
          await userEvent.type(inputs[index], value);
        }
      }

      // Run inflation simulation
      const simulateButton = screen.getByRole('button', { name: /simulate inflation/i });
      await userEvent.click(simulateButton);

      // Check simulation results
      await waitFor(() => {
        expect(screen.getByText(/Moderate Inflation/i)).toBeInTheDocument();
        expect(screen.getByText(/High Inflation/i)).toBeInTheDocument();
        expect(screen.getByText(/Stagflation/i)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('validates minimum position sizes', async () => {
      render(<CommodityPortfolioBuilder />);
      
      // Add commodity with small allocation
      const addCommodityButton = screen.getByRole('button', { name: /add commodity/i });
      await userEvent.click(addCommodityButton);

      // Fill commodity details with small allocation
      const inputs = {
        'Commodity': 'Silver',
        'Allocation': '0.1', // Too small
      };

      for (const [label, value] of Object.entries(inputs)) {
        const input = screen.getByLabelText(new RegExp(label, 'i'));
        await userEvent.type(input, value);
      }

      // Try to build portfolio
      const buildButton = screen.getByRole('button', { name: /build portfolio/i });
      await userEvent.click(buildButton);

      // Check for validation error
      await waitFor(() => {
        expect(screen.getByText(/Minimum allocation 1%/i)).toBeInTheDocument();
      });
    });

    it('handles invalid volatility inputs', async () => {
      render(<CommodityPortfolioBuilder />);
      
      // Add commodity with invalid volatility
      const addCommodityButton = screen.getByRole('button', { name: /add commodity/i });
      await userEvent.click(addCommodityButton);

      // Fill commodity details with invalid volatility
      const inputs = {
        'Commodity': 'Oil',
        'Allocation': '100',
        'Historical Volatility': '200', // Too high
      };

      for (const [label, value] of Object.entries(inputs)) {
        const input = screen.getByLabelText(new RegExp(label, 'i'));
        await userEvent.type(input, value);
      }

      // Try to analyze risk
      const analyzeButton = screen.getByRole('button', { name: /analyze risk/i });
      await userEvent.click(analyzeButton);

      // Check for validation error
      await waitFor(() => {
        expect(screen.getByText(/Invalid volatility value/i)).toBeInTheDocument();
      });
    });
  });

  describe('State Management', () => {
    it('preserves portfolio during analysis mode switches', async () => {
      render(<CommodityPortfolioBuilder />);
      
      // Add commodity
      const addCommodityButton = screen.getByRole('button', { name: /add commodity/i });
      await userEvent.click(addCommodityButton);

      // Fill commodity details
      const inputs = {
        'Commodity': 'Gold',
        'Allocation': '100',
      };

      for (const [label, value] of Object.entries(inputs)) {
        const input = screen.getByLabelText(new RegExp(label, 'i'));
        await userEvent.type(input, value);
      }

      // Switch analysis modes
      const riskTab = screen.getByRole('tab', { name: /risk analysis/i });
      await userEvent.click(riskTab);

      const portfolioTab = screen.getByRole('tab', { name: /portfolio/i });
      await userEvent.click(portfolioTab);

      // Verify commodity data preserved
      const commodityInput = screen.getByLabelText(/Commodity/i);
      expect(commodityInput).toHaveValue('Gold');
    });

    it('maintains analysis results during commodity additions', async () => {
      render(<CommodityPortfolioBuilder />);
      
      // Add first commodity and analyze
      const addCommodityButton = screen.getByRole('button', { name: /add commodity/i });
      await userEvent.click(addCommodityButton);

      // Fill commodity details
      const inputs = {
        'Commodity': 'Gold',
        'Allocation': '100',
      };

      for (const [label, value] of Object.entries(inputs)) {
        const input = screen.getByLabelText(new RegExp(label, 'i'));
        await userEvent.type(input, value);
      }

      const analyzeButton = screen.getByRole('button', { name: /analyze risk/i });
      await userEvent.click(analyzeButton);

      // Add another commodity
      await userEvent.click(addCommodityButton);

      // Verify initial analysis results still displayed
      expect(screen.getByText(/Risk Analysis Results/i)).toBeInTheDocument();
    });
  });
});

