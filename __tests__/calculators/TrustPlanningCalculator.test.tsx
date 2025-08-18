import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TrustPlanningCalculator from '@/components/chapters/fundamentals/calculators/TrustPlanningCalculator';
import { useCalculatorBase } from '@/lib/hooks/useCalculatorBase';

// Mock the useCalculatorBase hook
jest.mock('@/lib/hooks/useCalculatorBase', () => ({
  useCalculatorBase: jest.fn()
}));

describe('TrustPlanningCalculator', () => {
  const mockCalculate = jest.fn();
  const mockSaveToHistory = jest.fn();
  const mockResetCalculator = jest.fn();

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Setup default mock implementation
    (useCalculatorBase as jest.Mock).mockReturnValue({
      calculate: mockCalculate,
      isCalculating: false,
      lastCalculated: null,
      resetCalculator: mockResetCalculator,
      saveToHistory: mockSaveToHistory,
      history: []
    });
  });

  it('renders all required input sections', () => {
    render(<TrustPlanningCalculator />);

    // Check for main sections
    expect(screen.getByText('Trust Type')).toBeInTheDocument();
    expect(screen.getByText('Trust Assets')).toBeInTheDocument();
    expect(screen.getByText('Beneficiaries')).toBeInTheDocument();
    expect(screen.getByText('Distribution Strategy')).toBeInTheDocument();
  });

  it('allows selecting different trust types', async () => {
    render(<TrustPlanningCalculator />);

    // Trust type selector should be present
    const trustTypeSelect = screen.getByRole('combobox', { name: /trust type/i });
    expect(trustTypeSelect).toBeInTheDocument();

    // Should be able to select different trust types
    await userEvent.selectOptions(trustTypeSelect, 'revocable');
    expect(trustTypeSelect).toHaveValue('revocable');

    await userEvent.selectOptions(trustTypeSelect, 'irrevocable');
    expect(trustTypeSelect).toHaveValue('irrevocable');
  });

  it('allows adding and removing assets', async () => {
    render(<TrustPlanningCalculator />);

    // Add asset button should be present
    const addAssetButton = screen.getByRole('button', { name: /add asset/i });
    expect(addAssetButton).toBeInTheDocument();

    // Click to add an asset
    await userEvent.click(addAssetButton);

    // Should see asset input fields
    expect(screen.getByPlaceholder('Description')).toBeInTheDocument();
    expect(screen.getByPlaceholder('Value')).toBeInTheDocument();

    // Fill in asset details
    await userEvent.type(screen.getByPlaceholder('Description'), 'Investment Account');
    await userEvent.type(screen.getByPlaceholder('Value'), '100000');

    // Remove asset button should be present
    const removeButton = screen.getByRole('button', { name: /remove/i });
    expect(removeButton).toBeInTheDocument();

    // Click to remove the asset
    await userEvent.click(removeButton);

    // Asset inputs should be removed
    expect(screen.queryByDisplayValue('Investment Account')).not.toBeInTheDocument();
  });

  it('allows adding and managing beneficiaries', async () => {
    render(<TrustPlanningCalculator />);

    // Add asset first (required for beneficiaries)
    await userEvent.click(screen.getByRole('button', { name: /add asset/i }));
    await userEvent.type(screen.getByPlaceholder('Description'), 'Trust Asset');
    await userEvent.type(screen.getByPlaceholder('Value'), '500000');

    // Add beneficiary button should be present
    const addBeneficiaryButton = screen.getByRole('button', { name: /add beneficiary/i });
    expect(addBeneficiaryButton).toBeInTheDocument();

    // Click to add a beneficiary
    await userEvent.click(addBeneficiaryButton);

    // Should see beneficiary input fields
    expect(screen.getByPlaceholder('Name')).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: /distribution/i })).toBeInTheDocument();

    // Fill in beneficiary details
    await userEvent.type(screen.getByPlaceholder('Name'), 'John Doe');
    await userEvent.type(screen.getByRole('spinbutton', { name: /distribution/i }), '100');

    // Remove beneficiary button should be present
    const removeButtons = screen.getAllByRole('button', { name: /remove/i });
    const removeBeneficiaryButton = removeButtons[removeButtons.length - 1];
    expect(removeBeneficiaryButton).toBeInTheDocument();

    // Click to remove the beneficiary
    await userEvent.click(removeBeneficiaryButton);

    // Beneficiary inputs should be removed
    expect(screen.queryByDisplayValue('John Doe')).not.toBeInTheDocument();
  });

  it('validates required fields before calculation', async () => {
    render(<TrustPlanningCalculator />);

    // Try to calculate without any inputs
    const calculateButton = screen.getByRole('button', { name: /calculate/i });
    await userEvent.click(calculateButton);

    // Should see error messages
    expect(screen.getByText(/at least one asset is required/i)).toBeInTheDocument();

    // Verify calculate was not called
    expect(mockCalculate).not.toHaveBeenCalled();
  });

  it('performs calculation with valid inputs', async () => {
    render(<TrustPlanningCalculator />);

    // Add an asset
    await userEvent.click(screen.getByRole('button', { name: /add asset/i }));
    await userEvent.type(screen.getByPlaceholder('Description'), 'Trust Fund');
    await userEvent.type(screen.getByPlaceholder('Value'), '1000000');

    // Add a beneficiary
    await userEvent.click(screen.getByRole('button', { name: /add beneficiary/i }));
    await userEvent.type(screen.getByPlaceholder('Name'), 'John Doe');
    await userEvent.type(screen.getByRole('spinbutton', { name: /distribution/i }), '100');

    // Select trust type and distribution strategy
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: /trust type/i }),
      'revocable'
    );
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: /distribution method/i }),
      'staged'
    );

    // Mock successful calculation
    mockCalculate.mockResolvedValueOnce({
      totalAssetValue: 1000000,
      projectedGrowth: 50000,
      estateTaxSavings: 0,
      incomeTaxImpact: -10000,
      beneficiaryDistributions: [
        { beneficiaryName: 'John Doe', amount: 1000000, timing: 'Staged distribution' }
      ],
      controlRetained: true,
      assetProtectionLevel: 'low',
      flexibilityLevel: 'high',
      annualMaintenanceCost: 1500,
      recommendedFeatures: ['Privacy protection', 'Smooth transition'],
      warnings: []
    });

    // Calculate
    await userEvent.click(screen.getByRole('button', { name: /calculate/i }));

    // Verify calculate was called with correct inputs
    expect(mockCalculate).toHaveBeenCalledWith(expect.objectContaining({
      trustType: 'revocable',
      assets: [expect.objectContaining({
        description: 'Trust Fund',
        value: 1000000
      })],
      beneficiaries: [expect.objectContaining({
        name: 'John Doe',
        percentage: 100
      })]
    }));
  });

  it('displays calculation results correctly', async () => {
    // Mock calculation results
    (useCalculatorBase as jest.Mock).mockReturnValue({
      calculate: mockCalculate,
      isCalculating: false,
      lastCalculated: {
        totalAssetValue: 1000000,
        projectedGrowth: 50000,
        estateTaxSavings: 0,
        incomeTaxImpact: -10000,
        beneficiaryDistributions: [
          { beneficiaryName: 'John Doe', amount: 1000000, timing: 'Staged distribution' }
        ],
        controlRetained: true,
        assetProtectionLevel: 'low',
        flexibilityLevel: 'high',
        annualMaintenanceCost: 1500,
        recommendedFeatures: ['Privacy protection', 'Smooth transition'],
        warnings: []
      },
      resetCalculator: mockResetCalculator,
      saveToHistory: mockSaveToHistory,
      history: []
    });

    render(<TrustPlanningCalculator />);

    // Verify results are displayed
    expect(screen.getByText('$1,000,000')).toBeInTheDocument(); // Total Assets
    expect(screen.getByText('$50,000')).toBeInTheDocument(); // Projected Growth
    expect(screen.getByText('$1,500')).toBeInTheDocument(); // Annual Cost
    expect(screen.getByText('Privacy protection')).toBeInTheDocument();
    expect(screen.getByText('Smooth transition')).toBeInTheDocument();
  });

  it('handles reset functionality', async () => {
    render(<TrustPlanningCalculator />);

    // Add some data
    await userEvent.click(screen.getByRole('button', { name: /add asset/i }));
    await userEvent.type(screen.getByPlaceholder('Description'), 'Trust Fund');
    await userEvent.type(screen.getByPlaceholder('Value'), '1000000');

    // Reset
    await userEvent.click(screen.getByRole('button', { name: /reset/i }));

    // Verify inputs are cleared
    expect(screen.queryByDisplayValue('Trust Fund')).not.toBeInTheDocument();
    expect(screen.queryByDisplayValue('1000000')).not.toBeInTheDocument();

    // Verify resetCalculator was called
    expect(mockResetCalculator).toHaveBeenCalled();
  });

  it('shows loading state during calculation', async () => {
    // Mock loading state
    (useCalculatorBase as jest.Mock).mockReturnValue({
      calculate: mockCalculate,
      isCalculating: true,
      lastCalculated: null,
      resetCalculator: mockResetCalculator,
      saveToHistory: mockSaveToHistory,
      history: []
    });

    render(<TrustPlanningCalculator />);

    // Calculate button should be disabled during calculation
    const calculateButton = screen.getByRole('button', { name: /calculate/i });
    expect(calculateButton).toBeDisabled();
  });

  it('saves results to history after successful calculation', async () => {
    render(<TrustPlanningCalculator />);

    // Add valid inputs
    await userEvent.click(screen.getByRole('button', { name: /add asset/i }));
    await userEvent.type(screen.getByPlaceholder('Description'), 'Trust Fund');
    await userEvent.type(screen.getByPlaceholder('Value'), '1000000');

    await userEvent.click(screen.getByRole('button', { name: /add beneficiary/i }));
    await userEvent.type(screen.getByPlaceholder('Name'), 'John Doe');
    await userEvent.type(screen.getByRole('spinbutton', { name: /distribution/i }), '100');

    // Mock successful calculation
    const results = {
      totalAssetValue: 1000000,
      projectedGrowth: 50000,
      estateTaxSavings: 0,
      incomeTaxImpact: -10000,
      beneficiaryDistributions: [
        { beneficiaryName: 'John Doe', amount: 1000000, timing: 'Staged distribution' }
      ],
      controlRetained: true,
      assetProtectionLevel: 'low',
      flexibilityLevel: 'high',
      annualMaintenanceCost: 1500,
      recommendedFeatures: ['Privacy protection', 'Smooth transition'],
      warnings: []
    };
    mockCalculate.mockResolvedValueOnce(results);

    // Calculate
    await userEvent.click(screen.getByRole('button', { name: /calculate/i }));

    // Verify results were saved to history
    await waitFor(() => {
      expect(mockSaveToHistory).toHaveBeenCalledWith(
        expect.any(Object),
        results
      );
    });
  });
});
