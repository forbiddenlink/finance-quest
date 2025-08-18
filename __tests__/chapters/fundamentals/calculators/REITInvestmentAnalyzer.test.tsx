import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import REITInvestmentAnalyzer from '@/components/shared/calculators/REITInvestmentAnalyzer';

// Mock the progress store
jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: () => ({
    recordCalculatorUsage: jest.fn(),
  }),
}));

describe('REITInvestmentAnalyzer', () => {
  describe('Edge Cases and Boundary Conditions', () => {
    it('handles zero values correctly', async () => {
      render(<REITInvestmentAnalyzer />);
      
      // Fill all inputs with zero
      const inputs = {
        'Share Price': '0',
        'Annual Dividend': '0',
        'FFO per Share': '0',
        'Occupancy Rate': '0',
      };

      for (const [label, value] of Object.entries(inputs)) {
        const input = screen.getByLabelText(new RegExp(label, 'i'));
        await userEvent.clear(input);
        await userEvent.type(input, value);
      }

      // Calculate metrics
      const calculateButton = screen.getByRole('button', { name: /analyze/i });
      await userEvent.click(calculateButton);

      // Check for appropriate warning messages
      await waitFor(() => {
        expect(screen.getByText(/cannot be zero/i)).toBeInTheDocument();
      });
    });

    it('handles negative values appropriately', async () => {
      render(<REITInvestmentAnalyzer />);
      
      // Try to enter negative values
      const inputs = {
        'Share Price': '-100',
        'Annual Dividend': '-5',
      };

      for (const [label, value] of Object.entries(inputs)) {
        const input = screen.getByLabelText(new RegExp(label, 'i'));
        await userEvent.clear(input);
        await userEvent.type(input, value);
      }

      // Check for validation messages
      await waitFor(() => {
        expect(screen.getByText(/must be positive/i)).toBeInTheDocument();
      });
    });

    it('validates maximum value constraints', async () => {
      render(<REITInvestmentAnalyzer />);
      
      // Try to enter unreasonably large values
      const inputs = {
        'Share Price': '1000000000',
        'Occupancy Rate': '101',
      };

      for (const [label, value] of Object.entries(inputs)) {
        const input = screen.getByLabelText(new RegExp(label, 'i'));
        await userEvent.clear(input);
        await userEvent.type(input, value);
      }

      // Check for validation messages
      await waitFor(() => {
        expect(screen.getByText(/exceeds maximum/i)).toBeInTheDocument();
        expect(screen.getByText(/cannot exceed 100/i)).toBeInTheDocument();
      });
    });
  });

  describe('Numerical Precision', () => {
    it('maintains precision in dividend yield calculations', async () => {
      render(<REITInvestmentAnalyzer />);
      
      // Enter values that could cause precision issues
      const inputs = {
        'Share Price': '33.33',
        'Annual Dividend': '1.67',
      };

      for (const [label, value] of Object.entries(inputs)) {
        const input = screen.getByLabelText(new RegExp(label, 'i'));
        await userEvent.clear(input);
        await userEvent.type(input, value);
      }

      // Calculate metrics
      const calculateButton = screen.getByRole('button', { name: /analyze/i });
      await userEvent.click(calculateButton);

      // Check for precise calculation (5.01%)
      await waitFor(() => {
        const yieldElement = screen.getByText(/5.01%/);
        expect(yieldElement).toBeInTheDocument();
      });
    });

    it('handles fractional occupancy rates correctly', async () => {
      render(<REITInvestmentAnalyzer />);
      
      // Enter fractional occupancy rate
      const input = screen.getByLabelText(/Occupancy Rate/i);
      await userEvent.clear(input);
      await userEvent.type(input, '97.5');

      // Calculate metrics
      const calculateButton = screen.getByRole('button', { name: /analyze/i });
      await userEvent.click(calculateButton);

      // Check for correct handling of fractional rate
      await waitFor(() => {
        expect(screen.getByText(/97.5%/)).toBeInTheDocument();
      });
    });
  });

  describe('Complex Calculations', () => {
    it('calculates adjusted funds from operations (AFFO) correctly', async () => {
      render(<REITInvestmentAnalyzer />);
      
      // Enter values for AFFO calculation
      const inputs = {
        'FFO per Share': '2.50',
        'Maintenance Capex': '0.30',
        'Leasing Costs': '0.20',
      };

      for (const [label, value] of Object.entries(inputs)) {
        const input = screen.getByLabelText(new RegExp(label, 'i'));
        await userEvent.clear(input);
        await userEvent.type(input, value);
      }

      // Calculate metrics
      const calculateButton = screen.getByRole('button', { name: /analyze/i });
      await userEvent.click(calculateButton);

      // Check AFFO calculation (2.50 - 0.30 - 0.20 = 2.00)
      await waitFor(() => {
        expect(screen.getByText(/AFFO: \$2.00/)).toBeInTheDocument();
      });
    });

    it('performs comprehensive property analysis', async () => {
      render(<REITInvestmentAnalyzer />);
      
      // Add property details
      const addPropertyButton = screen.getByRole('button', { name: /add property/i });
      await userEvent.click(addPropertyButton);

      // Fill property details
      const inputs = {
        'Property Type': 'Commercial',
        'Square Footage': '50000',
        'Annual Revenue': '1000000',
        'Operating Expenses': '400000',
        'Occupancy Rate': '95',
      };

      for (const [label, value] of Object.entries(inputs)) {
        const input = screen.getByLabelText(new RegExp(label, 'i'));
        await userEvent.type(input, value);
      }

      // Analyze property
      const analyzeButton = screen.getByRole('button', { name: /analyze property/i });
      await userEvent.click(analyzeButton);

      // Check detailed metrics
      await waitFor(() => {
        // Revenue per Square Foot ($1,000,000 / 50,000 = $20)
        expect(screen.getByText(/\$20.00 per sq ft/i)).toBeInTheDocument();
        
        // Net Operating Income ($1,000,000 - $400,000 = $600,000)
        expect(screen.getByText(/\$600,000/i)).toBeInTheDocument();
        
        // Operating Margin (($1,000,000 - $400,000) / $1,000,000 = 60%)
        expect(screen.getByText(/60%/i)).toBeInTheDocument();
      });
    });
  });

  describe('Error Boundary Testing', () => {
    it('handles calculation errors gracefully', async () => {
      render(<REITInvestmentAnalyzer />);
      
      // Enter invalid combination of values
      const inputs = {
        'Share Price': '0.001',
        'Annual Dividend': '1000',
      };

      for (const [label, value] of Object.entries(inputs)) {
        const input = screen.getByLabelText(new RegExp(label, 'i'));
        await userEvent.clear(input);
        await userEvent.type(input, value);
      }

      // Calculate metrics
      const calculateButton = screen.getByRole('button', { name: /analyze/i });
      await userEvent.click(calculateButton);

      // Check for error message
      await waitFor(() => {
        expect(screen.getByText(/invalid yield calculation/i)).toBeInTheDocument();
      });
    });

    it('recovers from failed property analysis', async () => {
      render(<REITInvestmentAnalyzer />);
      
      // Add property with invalid data
      const addPropertyButton = screen.getByRole('button', { name: /add property/i });
      await userEvent.click(addPropertyButton);

      // Enter invalid revenue/expense ratio
      const inputs = {
        'Annual Revenue': '100000',
        'Operating Expenses': '200000', // Expenses > Revenue
      };

      for (const [label, value] of Object.entries(inputs)) {
        const input = screen.getByLabelText(new RegExp(label, 'i'));
        await userEvent.type(input, value);
      }

      // Try to analyze
      const analyzeButton = screen.getByRole('button', { name: /analyze property/i });
      await userEvent.click(analyzeButton);

      // Check for error handling
      await waitFor(() => {
        expect(screen.getByText(/expenses cannot exceed revenue/i)).toBeInTheDocument();
      });

      // Verify can still add new property
      await userEvent.click(addPropertyButton);
      expect(screen.getAllByRole('textbox')).toHaveLength(expect.any(Number));
    });
  });

  describe('State Management', () => {
    it('preserves input values during tab switching', async () => {
      render(<REITInvestmentAnalyzer />);
      
      // Enter values
      const sharePrice = screen.getByLabelText(/Share Price/i);
      await userEvent.clear(sharePrice);
      await userEvent.type(sharePrice, '50');

      // Switch tabs
      const propertyTab = screen.getByRole('tab', { name: /property analysis/i });
      await userEvent.click(propertyTab);

      const overviewTab = screen.getByRole('tab', { name: /overview/i });
      await userEvent.click(overviewTab);

      // Check if value persists
      expect(sharePrice).toHaveValue(50);
    });

    it('maintains calculation results during property additions', async () => {
      render(<REITInvestmentAnalyzer />);
      
      // Calculate initial metrics
      const inputs = {
        'Share Price': '50',
        'Annual Dividend': '2.5',
      };

      for (const [label, value] of Object.entries(inputs)) {
        const input = screen.getByLabelText(new RegExp(label, 'i'));
        await userEvent.clear(input);
        await userEvent.type(input, value);
      }

      const calculateButton = screen.getByRole('button', { name: /analyze/i });
      await userEvent.click(calculateButton);

      // Add property
      const addPropertyButton = screen.getByRole('button', { name: /add property/i });
      await userEvent.click(addPropertyButton);

      // Verify initial results still displayed
      expect(screen.getByText(/5%/)).toBeInTheDocument(); // Dividend Yield
    });
  });
});

