import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UmbrellaPolicyCalculator from '@/components/chapters/fundamentals/calculators/UmbrellaPolicyCalculator';
import { useProgressStore } from '@/lib/store/progressStore';

// Mock the progress store
jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: jest.fn()
}));

describe('UmbrellaPolicyCalculator', () => {
  // Setup mock for useProgressStore
  beforeEach(() => {
    (useProgressStore as jest.Mock).mockReturnValue({
      recordCalculatorUsage: jest.fn()
    });
  });

  it('renders calculator with initial values', () => {
    render(<UmbrellaPolicyCalculator />);
    
    // Check for main title
    expect(screen.getByText('Umbrella Policy Calculator')).toBeInTheDocument();
    
    // Check for initial input values
    const incomeInput = screen.getByRole('spinbutton', { name: /Annual Income/i });
    const netWorthInput = screen.getByRole('spinbutton', { name: /Net Worth/i });
    const familySizeInput = screen.getByRole('spinbutton', { name: /Family Size/i });
    const teenDriversInput = screen.getByRole('spinbutton', { name: /Teen Drivers/i });

    expect(incomeInput).toHaveValue(150000);
    expect(netWorthInput).toHaveValue(750000);
    expect(familySizeInput).toHaveValue(4);
    expect(teenDriversInput).toHaveValue(0);
  });

  it('updates personal profile inputs correctly', async () => {
    render(<UmbrellaPolicyCalculator />);
    const user = userEvent.setup();
    
    // Test annual income update
    const incomeInput = screen.getByRole('spinbutton', { name: /Annual Income/i });
    await user.clear(incomeInput);
    await user.type(incomeInput, '200000');
    expect(incomeInput).toHaveValue(200000);

    // Test net worth update
    const netWorthInput = screen.getByRole('spinbutton', { name: /Net Worth/i });
    await user.clear(netWorthInput);
    await user.type(netWorthInput, '1000000');
    expect(netWorthInput).toHaveValue(1000000);

    // Test occupation selection
    const occupationSelect = screen.getByRole('combobox', { name: /Occupation/i });
    await user.selectOptions(occupationSelect, 'executive');
    expect(occupationSelect).toHaveValue('executive');

    // Test public profile selection
    const profileSelect = screen.getByRole('combobox', { name: /Public Profile/i });
    await user.selectOptions(profileSelect, 'high');
    expect(profileSelect).toHaveValue('high');
  });

  it('handles asset management correctly', async () => {
    render(<UmbrellaPolicyCalculator />);
    const user = userEvent.setup();
    
    // Check initial assets
    const assetInputs = screen.getAllByRole('textbox');
    const assetNames = assetInputs.map(input => input.getAttribute('value'));
    expect(assetNames).toContain('Primary Home');
    expect(assetNames).toContain('Auto Insurance');
    expect(assetNames).toContain('Investment Property');
    
    // Add new asset
    const addButton = screen.getByRole('button', { name: /Add Asset/i });
    await user.click(addButton);
    
    // Should now have 4 assets
    const removeButtons = screen.getAllByRole('button', { name: /Remove/i });
    expect(removeButtons).toHaveLength(4);
    
    // Remove an asset
    await user.click(removeButtons[0]);
    
    // Should now have 3 assets
    expect(screen.getAllByRole('button', { name: /Remove/i })).toHaveLength(3);
  });

  it('calculates and displays analysis correctly', async () => {
    render(<UmbrellaPolicyCalculator />);
    
    // Wait for analysis to be calculated and displayed
    await waitFor(() => {
      expect(screen.getByText('Asset Protection Analysis')).toBeInTheDocument();
    });

    // Check for key analysis components
    expect(screen.getByText('Recommended')).toBeInTheDocument();
    expect(screen.getByText('Est. Premium')).toBeInTheDocument();
    expect(screen.getByText('Coverage Gap')).toBeInTheDocument();
    expect(screen.getByText('Risk Score')).toBeInTheDocument();
  });

  it('handles liability risk factors selection', async () => {
    render(<UmbrellaPolicyCalculator />);
    const user = userEvent.setup();
    
    // Find and click risk checkboxes
    const homeCheckbox = screen.getByRole('checkbox', { name: /Home/i });
    const autoCheckbox = screen.getByRole('checkbox', { name: /Auto/i });
    
    await user.click(homeCheckbox);
    await user.click(autoCheckbox);
    
    // Verify checkboxes are checked/unchecked
    expect(homeCheckbox).not.toBeChecked();
    expect(autoCheckbox).not.toBeChecked();
  });

  it('updates coverage options correctly', async () => {
    render(<UmbrellaPolicyCalculator />);
    const user = userEvent.setup();
    
    // Test current coverage selection
    const currentCoverageSelect = screen.getByRole('combobox', { name: /Current Umbrella Coverage/i });
    await user.selectOptions(currentCoverageSelect, '2000000');
    expect(currentCoverageSelect).toHaveValue('2000000');
    
    // Test desired coverage selection
    const desiredCoverageSelect = screen.getByRole('combobox', { name: /Desired Coverage/i });
    await user.selectOptions(desiredCoverageSelect, '5000000');
    expect(desiredCoverageSelect).toHaveValue('5000000');
  });

  it('displays educational content', () => {
    render(<UmbrellaPolicyCalculator />);
    
    // Check for educational content
    expect(screen.getByText('Umbrella Policy Essentials')).toBeInTheDocument();
    expect(screen.getByText(/Umbrella policies require minimum underlying auto\/home liability limits/)).toBeInTheDocument();
  });

  it('records calculator usage', () => {
    const mockRecordUsage = jest.fn();
    (useProgressStore as jest.Mock).mockReturnValue({
      recordCalculatorUsage: mockRecordUsage
    });

    render(<UmbrellaPolicyCalculator />);
    
    expect(mockRecordUsage).toHaveBeenCalledWith('umbrella-policy-calculator');
  });
});