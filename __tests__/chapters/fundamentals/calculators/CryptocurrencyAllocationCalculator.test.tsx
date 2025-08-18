import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CryptocurrencyAllocationCalculator from '@/components/shared/calculators/CryptocurrencyAllocationCalculator';

// Mock the progress store
jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: () => ({
    recordCalculatorUsage: jest.fn(),
  }),
}));

describe('CryptocurrencyAllocationCalculator', () => {
  describe('Portfolio Risk Assessment', () => {
    it('calculates risk-adjusted allocation based on portfolio size', async () => {
      render(<CryptocurrencyAllocationCalculator />);
      
      // Fill portfolio details
      const inputs = {
        'Total Portfolio Value': '1000000',
        'Risk Tolerance': 'Moderate',
        'Investment Horizon': '5',
      };

      for (const [label, value] of Object.entries(inputs)) {
        const input = screen.getByLabelText(new RegExp(label, 'i'));
        if (input.tagName === 'SELECT') {
          await userEvent.selectOptions(input, value);
        } else {
          await userEvent.clear(input);
          await userEvent.type(input, value);
        }
      }

      // Calculate allocation
      const calculateButton = screen.getByRole('button', { name: /calculate/i });
      await userEvent.click(calculateButton);

      // Check risk-adjusted allocation (typically 1-5% for moderate risk)
      await waitFor(() => {
        const allocation = screen.getByText(/Recommended Allocation/i);
        expect(allocation).toBeInTheDocument();
        const percentage = parseFloat(allocation.textContent?.match(/\d+(\.\d+)?%/)?.[0] ?? '0');
        expect(percentage).toBeGreaterThanOrEqual(1);
        expect(percentage).toBeLessThanOrEqual(5);
      });
    });

    it('adjusts allocation based on risk tolerance', async () => {
      render(<CryptocurrencyAllocationCalculator />);
      
      // Test different risk tolerances
      const riskLevels = ['Conservative', 'Moderate', 'Aggressive'];
      const allocations: number[] = [];

      for (const risk of riskLevels) {
        // Set portfolio value and risk tolerance
        await userEvent.clear(screen.getByLabelText(/Total Portfolio Value/i));
        await userEvent.type(screen.getByLabelText(/Total Portfolio Value/i), '1000000');
        await userEvent.selectOptions(screen.getByLabelText(/Risk Tolerance/i), risk);

        // Calculate allocation
        const calculateButton = screen.getByRole('button', { name: /calculate/i });
        await userEvent.click(calculateButton);

        // Store allocation percentage
        await waitFor(() => {
          const allocation = screen.getByText(/Recommended Allocation/i);
          const percentage = parseFloat(allocation.textContent?.match(/\d+(\.\d+)?%/)?.[0] ?? '0');
          allocations.push(percentage);
        });
      }

      // Verify allocations increase with risk tolerance
      expect(allocations[0]).toBeLessThan(allocations[1]); // Conservative < Moderate
      expect(allocations[1]).toBeLessThan(allocations[2]); // Moderate < Aggressive
    });
  });

  describe('Volatility Analysis', () => {
    it('calculates portfolio impact of crypto volatility', async () => {
      render(<CryptocurrencyAllocationCalculator />);
      
      // Add crypto asset
      const addAssetButton = screen.getByRole('button', { name: /add asset/i });
      await userEvent.click(addAssetButton);

      // Fill asset details
      const inputs = {
        'Asset Name': 'Bitcoin',
        'Allocation': '5',
        'Historical Volatility': '75',
        'Current Price': '50000',
      };

      for (const [label, value] of Object.entries(inputs)) {
        const input = screen.getByLabelText(new RegExp(label, 'i'));
        await userEvent.type(input, value);
      }

      // Analyze volatility
      const analyzeButton = screen.getByRole('button', { name: /analyze volatility/i });
      await userEvent.click(analyzeButton);

      // Check volatility impact metrics
      await waitFor(() => {
        expect(screen.getByText(/Portfolio Volatility Impact/i)).toBeInTheDocument();
        expect(screen.getByText(/Value at Risk/i)).toBeInTheDocument();
      });
    });

    it('handles extreme volatility scenarios', async () => {
      render(<CryptocurrencyAllocationCalculator />);
      
      // Add asset with extreme volatility
      const addAssetButton = screen.getByRole('button', { name: /add asset/i });
      await userEvent.click(addAssetButton);

      // Fill asset details with extreme values
      const inputs = {
        'Asset Name': 'Volatile Token',
        'Allocation': '10',
        'Historical Volatility': '200', // Extreme volatility
        'Current Price': '1000',
      };

      for (const [label, value] of Object.entries(inputs)) {
        const input = screen.getByLabelText(new RegExp(label, 'i'));
        await userEvent.type(input, value);
      }

      // Analyze volatility
      const analyzeButton = screen.getByRole('button', { name: /analyze volatility/i });
      await userEvent.click(analyzeButton);

      // Check for risk warnings
      await waitFor(() => {
        expect(screen.getByText(/High Risk Warning/i)).toBeInTheDocument();
        expect(screen.getByText(/Extreme Volatility/i)).toBeInTheDocument();
      });
    });
  });

  describe('Correlation Analysis', () => {
    it('calculates portfolio diversification benefits', async () => {
      render(<CryptocurrencyAllocationCalculator />);
      
      // Add multiple assets
      const addAssetButton = screen.getByRole('button', { name: /add asset/i });
      await userEvent.click(addAssetButton);
      await userEvent.click(addAssetButton);

      // Fill asset details
      const assets = [
        {
          'Asset Name': 'Bitcoin',
          'Allocation': '3',
          'Correlation': '-0.2', // Negative correlation with traditional assets
        },
        {
          'Asset Name': 'Ethereum',
          'Allocation': '2',
          'Correlation': '-0.1',
        },
      ];

      for (const [index, asset] of assets.entries()) {
        for (const [label, value] of Object.entries(asset)) {
          const inputs = screen.getAllByLabelText(new RegExp(label, 'i'));
          await userEvent.type(inputs[index], value);
        }
      }

      // Analyze diversification
      const analyzeButton = screen.getByRole('button', { name: /analyze diversification/i });
      await userEvent.click(analyzeButton);

      // Check diversification metrics
      await waitFor(() => {
        expect(screen.getByText(/Diversification Benefit/i)).toBeInTheDocument();
        expect(screen.getByText(/Portfolio Efficiency/i)).toBeInTheDocument();
      });
    });

    it('identifies concentration risks', async () => {
      render(<CryptocurrencyAllocationCalculator />);
      
      // Add highly correlated assets
      const addAssetButton = screen.getByRole('button', { name: /add asset/i });
      await userEvent.click(addAssetButton);
      await userEvent.click(addAssetButton);

      // Fill asset details with high correlation
      const assets = [
        {
          'Asset Name': 'Token1',
          'Allocation': '5',
          'Correlation': '0.9', // High correlation
        },
        {
          'Asset Name': 'Token2',
          'Allocation': '5',
          'Correlation': '0.9',
        },
      ];

      for (const [index, asset] of assets.entries()) {
        for (const [label, value] of Object.entries(asset)) {
          const inputs = screen.getAllByLabelText(new RegExp(label, 'i'));
          await userEvent.type(inputs[index], value);
        }
      }

      // Analyze concentration
      const analyzeButton = screen.getByRole('button', { name: /analyze concentration/i });
      await userEvent.click(analyzeButton);

      // Check for concentration warnings
      await waitFor(() => {
        expect(screen.getByText(/High Correlation Warning/i)).toBeInTheDocument();
        expect(screen.getByText(/Concentration Risk/i)).toBeInTheDocument();
      });
    });
  });

  describe('Rebalancing Analysis', () => {
    it('generates rebalancing recommendations', async () => {
      render(<CryptocurrencyAllocationCalculator />);
      
      // Set initial allocation
      const inputs = {
        'Total Portfolio Value': '1000000',
        'Current Crypto Allocation': '8', // Above target
        'Target Allocation': '5',
      };

      for (const [label, value] of Object.entries(inputs)) {
        const input = screen.getByLabelText(new RegExp(label, 'i'));
        await userEvent.clear(input);
        await userEvent.type(input, value);
      }

      // Generate rebalancing plan
      const rebalanceButton = screen.getByRole('button', { name: /rebalance/i });
      await userEvent.click(rebalanceButton);

      // Check rebalancing recommendations
      await waitFor(() => {
        expect(screen.getByText(/Rebalancing Required/i)).toBeInTheDocument();
        expect(screen.getByText(/\$30,000/i)).toBeInTheDocument(); // Amount to reduce
      });
    });

    it('considers tax implications in rebalancing', async () => {
      render(<CryptocurrencyAllocationCalculator />);
      
      // Set allocation with gains
      const inputs = {
        'Total Portfolio Value': '1000000',
        'Current Crypto Allocation': '10',
        'Target Allocation': '5',
        'Unrealized Gains': '50000',
      };

      for (const [label, value] of Object.entries(inputs)) {
        const input = screen.getByLabelText(new RegExp(label, 'i'));
        await userEvent.clear(input);
        await userEvent.type(input, value);
      }

      // Generate tax-aware rebalancing plan
      const rebalanceButton = screen.getByRole('button', { name: /tax-aware rebalance/i });
      await userEvent.click(rebalanceButton);

      // Check tax implications
      await waitFor(() => {
        expect(screen.getByText(/Tax Impact/i)).toBeInTheDocument();
        expect(screen.getByText(/Staged Reduction/i)).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('validates maximum allocation limits', async () => {
      render(<CryptocurrencyAllocationCalculator />);
      
      // Try to set excessive allocation
      const inputs = {
        'Total Portfolio Value': '1000000',
        'Target Allocation': '25', // Above recommended maximum
      };

      for (const [label, value] of Object.entries(inputs)) {
        const input = screen.getByLabelText(new RegExp(label, 'i'));
        await userEvent.clear(input);
        await userEvent.type(input, value);
      }

      // Calculate allocation
      const calculateButton = screen.getByRole('button', { name: /calculate/i });
      await userEvent.click(calculateButton);

      // Check for warning
      await waitFor(() => {
        expect(screen.getByText(/Exceeds Maximum Recommendation/i)).toBeInTheDocument();
        expect(screen.getByText(/High Risk Alert/i)).toBeInTheDocument();
      });
    });

    it('handles invalid correlation inputs', async () => {
      render(<CryptocurrencyAllocationCalculator />);
      
      // Add asset with invalid correlation
      const addAssetButton = screen.getByRole('button', { name: /add asset/i });
      await userEvent.click(addAssetButton);

      // Try to enter invalid correlation
      const correlationInput = screen.getByLabelText(/Correlation/i);
      await userEvent.clear(correlationInput);
      await userEvent.type(correlationInput, '1.5'); // Correlation > 1

      // Check validation
      await waitFor(() => {
        expect(screen.getByText(/Invalid Correlation/i)).toBeInTheDocument();
        expect(screen.getByText(/Must be between -1 and 1/i)).toBeInTheDocument();
      });
    });
  });

  describe('State Management', () => {
    it('persists analysis results during asset additions', async () => {
      render(<CryptocurrencyAllocationCalculator />);
      
      // Perform initial analysis
      const inputs = {
        'Total Portfolio Value': '1000000',
        'Target Allocation': '5',
      };

      for (const [label, value] of Object.entries(inputs)) {
        const input = screen.getByLabelText(new RegExp(label, 'i'));
        await userEvent.clear(input);
        await userEvent.type(input, value);
      }

      const calculateButton = screen.getByRole('button', { name: /calculate/i });
      await userEvent.click(calculateButton);

      // Add new asset
      const addAssetButton = screen.getByRole('button', { name: /add asset/i });
      await userEvent.click(addAssetButton);

      // Verify initial results still displayed
      expect(screen.getByText(/Recommended Allocation: 5%/i)).toBeInTheDocument();
    });

    it('maintains asset list during tab switching', async () => {
      render(<CryptocurrencyAllocationCalculator />);
      
      // Add assets
      const addAssetButton = screen.getByRole('button', { name: /add asset/i });
      await userEvent.click(addAssetButton);
      await userEvent.click(addAssetButton);

      // Switch tabs
      const correlationTab = screen.getByRole('tab', { name: /correlation/i });
      await userEvent.click(correlationTab);

      const allocationTab = screen.getByRole('tab', { name: /allocation/i });
      await userEvent.click(allocationTab);

      // Verify assets preserved
      const assetInputs = screen.getAllByLabelText(/Asset Name/i);
      expect(assetInputs).toHaveLength(2);
    });
  });
});

