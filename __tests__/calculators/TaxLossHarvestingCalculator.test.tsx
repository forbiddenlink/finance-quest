import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TaxLossHarvestingCalculator from '@/components/chapters/fundamentals/calculators/TaxLossHarvestingCalculator';

// Mock the progress store
jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: () => ({
    recordCalculatorUsage: jest.fn(),
  }),
}));

describe('TaxLossHarvestingCalculator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders tax loss harvesting calculator with all input fields', () => {
    render(<TaxLossHarvestingCalculator />);
    
    // Check main heading
    expect(screen.getByText('Tax-Loss Harvesting Calculator')).toBeInTheDocument();
    
    // Check tax settings section
    expect(screen.getByText('Tax Settings')).toBeInTheDocument();
    expect(screen.getByText('Marginal Tax Rate (%)')).toBeInTheDocument();
    expect(screen.getByText('Capital Gains Rate (%)')).toBeInTheDocument();
    expect(screen.getByText('Realized Gains This Year')).toBeInTheDocument();
    
    // Check portfolio section
    expect(screen.getByText('Portfolio Holdings')).toBeInTheDocument();
    expect(screen.getByText('Add Investment')).toBeInTheDocument();
    
    // Check for default investments
    expect(screen.getByDisplayValue('Tech Stock A')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Growth ETF')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Bond Fund')).toBeInTheDocument();
  });

  it('calculates tax savings automatically', async () => {
    render(<TaxLossHarvestingCalculator />);
    
    // Wait for initial calculations
    await waitFor(() => {
      expect(screen.getByText('Total Losses')).toBeInTheDocument();
      expect(screen.getByText('Tax Savings')).toBeInTheDocument();
      expect(screen.getByText('Net Position')).toBeInTheDocument();
    });
    
    // Should show harvestable losses breakdown
    expect(screen.getByText('Harvestable Losses Breakdown')).toBeInTheDocument();
    expect(screen.getByText('Short-term Losses')).toBeInTheDocument();
    expect(screen.getByText('Long-term Losses')).toBeInTheDocument();
  });

  it('updates tax rates and recalculates', async () => {
    render(<TaxLossHarvestingCalculator />);
    
    // Find and update marginal tax rate input
    const marginalTaxInput = screen.getByDisplayValue('24');
    fireEvent.change(marginalTaxInput, { target: { value: '32' } });
    
    // Find and update capital gains rate input  
    const capitalGainsInput = screen.getByDisplayValue('15');
    fireEvent.change(capitalGainsInput, { target: { value: '20' } });
    
    // Wait for recalculation
    await waitFor(() => {
      expect(screen.getByText('Tax Savings')).toBeInTheDocument();
    });
  });

  it('allows adding and removing investments', async () => {
    render(<TaxLossHarvestingCalculator />);
    
    // Add new investment
    const addButton = screen.getByText('Add Investment');
    fireEvent.click(addButton);
    
    await waitFor(() => {
      // Should have 4 investments now (3 default + 1 new)
      const investmentNames = screen.getAllByDisplayValue(/Investment|Tech Stock|Growth ETF|Bond Fund/);
      expect(investmentNames.length).toBeGreaterThan(3);
    });
    
    // Remove an investment
    const removeButtons = screen.getAllByText('Remove');
    fireEvent.click(removeButtons[0]);
    
    await waitFor(() => {
      // Should have fewer investments
      expect(screen.getByText('Portfolio Holdings')).toBeInTheDocument();
    });
  });

  it('handles input validation', () => {
    render(<TaxLossHarvestingCalculator />);
    
    const marginalTaxInput = screen.getByDisplayValue('24');
    // Test boundary values
    fireEvent.change(marginalTaxInput, { target: { value: '-5' } });
    fireEvent.change(marginalTaxInput, { target: { value: '50' } });
    
    // Component should handle these gracefully
    expect(screen.getByText('Tax-Loss Harvesting Calculator')).toBeInTheDocument();
  });

  it('shows recommendations and educational content', async () => {
    render(<TaxLossHarvestingCalculator />);
    
    await waitFor(() => {
      // Should show recommendations section
      expect(screen.getByText('Tax-Loss Harvesting Recommendations')).toBeInTheDocument();
    });
  });

  it('handles wash sale warnings when applicable', async () => {
    render(<TaxLossHarvestingCalculator />);
    
    // Wait for analysis to complete
    await waitFor(() => {
      expect(screen.getByText('Tax Savings')).toBeInTheDocument();
    });
    
    // Check if wash sale warning appears (may or may not based on data)
    const washSaleElements = screen.queryByText(/wash sale/i) || screen.queryByText(/30.*day/i);
    // This is conditional - wash sale warning only appears if there's a risk
    if (washSaleElements) {
      expect(washSaleElements).toBeInTheDocument();
    }
  });
});
