import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EstateValueCalculator from '@/components/chapters/fundamentals/calculators/EstateValueCalculator';
import { useCalculatorBase } from '@/lib/hooks/useCalculatorBase';

// Mock the useCalculatorBase hook
jest.mock('@/lib/hooks/useCalculatorBase', () => ({
  useCalculatorBase: jest.fn()
}));

describe('EstateValueCalculator', () => {
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
    render(<EstateValueCalculator />);

    // Check for main sections
    expect(screen.getByText('Assets')).toBeInTheDocument();
    expect(screen.getByText('Liabilities')).toBeInTheDocument();
    expect(screen.getByText('Personal Information')).toBeInTheDocument();
  });

  it('allows adding and removing assets', async () => {
    render(<EstateValueCalculator />);

    // Add asset button should be present
    const addAssetButton = screen.getByRole('button', { name: /add asset/i });
    expect(addAssetButton).toBeInTheDocument();

    // Click to add an asset
    await userEvent.click(addAssetButton);

    // Should see asset input fields
    expect(screen.getByPlaceholder('Description')).toBeInTheDocument();
    expect(screen.getByPlaceholder('Value')).toBeInTheDocument();

    // Remove asset button should be present
    const removeButton = screen.getByRole('button', { name: /remove/i });
    expect(removeButton).toBeInTheDocument();

    // Click to remove the asset
    await userEvent.click(removeButton);

    // Asset inputs should be removed
    expect(screen.queryByPlaceholder('Description')).not.toBeInTheDocument();
  });

  it('allows adding and removing liabilities', async () => {
    render(<EstateValueCalculator />);

    // Add liability button should be present
    const addLiabilityButton = screen.getByRole('button', { name: /add liability/i });
    expect(addLiabilityButton).toBeInTheDocument();

    // Click to add a liability
    await userEvent.click(addLiabilityButton);

    // Should see liability input fields
    const descriptionInput = screen.getAllByPlaceholder('Description')[1]; // Second one is for liabilities
    const amountInput = screen.getAllByPlaceholder('Amount')[0];
    expect(descriptionInput).toBeInTheDocument();
    expect(amountInput).toBeInTheDocument();

    // Remove liability button should be present
    const removeButtons = screen.getAllByRole('button', { name: /remove/i });
    const removeLiabilityButton = removeButtons[removeButtons.length - 1];
    expect(removeLiabilityButton).toBeInTheDocument();

    // Click to remove the liability
    await userEvent.click(removeLiabilityButton);

    // Liability inputs should be removed
    expect(screen.queryByPlaceholder('Amount')).not.toBeInTheDocument();
  });

  it('validates required fields before calculation', async () => {
    render(<EstateValueCalculator />);

    // Try to calculate without any inputs
    const calculateButton = screen.getByRole('button', { name: /calculate/i });
    await userEvent.click(calculateButton);

    // Should see error messages
    expect(screen.getByText(/at least one asset is required/i)).toBeInTheDocument();
    expect(screen.getByText(/state is required/i)).toBeInTheDocument();

    // Verify calculate was not called
    expect(mockCalculate).not.toHaveBeenCalled();
  });

  it('performs calculation with valid inputs', async () => {
    render(<EstateValueCalculator />);

    // Add an asset
    await userEvent.click(screen.getByRole('button', { name: /add asset/i }));
    await userEvent.type(screen.getByPlaceholder('Description'), 'House');
    await userEvent.type(screen.getByPlaceholder('Value'), '500000');

    // Select state
    const stateSelect = screen.getByRole('combobox', { name: /state/i });
    await userEvent.selectOptions(stateSelect, 'WA');

    // Mock successful calculation
    mockCalculate.mockResolvedValueOnce({
      grossEstateValue: 500000,
      totalLiabilities: 0,
      netEstateValue: 500000,
      federalEstateTax: 0,
      stateEstateTax: 0,
      totalTaxLiability: 0,
      netToHeirs: 500000,
      potentialTaxSavings: 0,
      recommendedStrategies: []
    });

    // Calculate
    await userEvent.click(screen.getByRole('button', { name: /calculate/i }));

    // Verify calculate was called with correct inputs
    expect(mockCalculate).toHaveBeenCalledWith(expect.objectContaining({
      assets: [expect.objectContaining({
        description: 'House',
        value: 500000
      })],
      state: 'WA'
    }));
  });

  it('displays calculation results correctly', async () => {
    // Mock calculation results
    (useCalculatorBase as jest.Mock).mockReturnValue({
      calculate: mockCalculate,
      isCalculating: false,
      lastCalculated: {
        grossEstateValue: 1000000,
        totalLiabilities: 200000,
        netEstateValue: 800000,
        federalEstateTax: 50000,
        stateEstateTax: 30000,
        totalTaxLiability: 80000,
        netToHeirs: 720000,
        potentialTaxSavings: 20000,
        recommendedStrategies: ['Consider establishing a trust']
      },
      resetCalculator: mockResetCalculator,
      saveToHistory: mockSaveToHistory,
      history: []
    });

    render(<EstateValueCalculator />);

    // Verify results are displayed
    expect(screen.getByText('$1,000,000')).toBeInTheDocument(); // Gross Estate
    expect(screen.getByText('$200,000')).toBeInTheDocument(); // Liabilities
    expect(screen.getByText('$800,000')).toBeInTheDocument(); // Net Estate
    expect(screen.getByText('$80,000')).toBeInTheDocument(); // Tax Liability
    expect(screen.getByText('$720,000')).toBeInTheDocument(); // Net to Heirs
    expect(screen.getByText('Consider establishing a trust')).toBeInTheDocument();
  });

  it('handles reset functionality', async () => {
    render(<EstateValueCalculator />);

    // Add some data
    await userEvent.click(screen.getByRole('button', { name: /add asset/i }));
    await userEvent.type(screen.getByPlaceholder('Description'), 'House');
    await userEvent.type(screen.getByPlaceholder('Value'), '500000');

    // Reset
    await userEvent.click(screen.getByRole('button', { name: /reset/i }));

    // Verify inputs are cleared
    expect(screen.queryByDisplayValue('House')).not.toBeInTheDocument();
    expect(screen.queryByDisplayValue('500000')).not.toBeInTheDocument();

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

    render(<EstateValueCalculator />);

    // Calculate button should be disabled during calculation
    const calculateButton = screen.getByRole('button', { name: /calculate/i });
    expect(calculateButton).toBeDisabled();
  });

  it('saves results to history after successful calculation', async () => {
    render(<EstateValueCalculator />);

    // Add valid inputs
    await userEvent.click(screen.getByRole('button', { name: /add asset/i }));
    await userEvent.type(screen.getByPlaceholder('Description'), 'House');
    await userEvent.type(screen.getByPlaceholder('Value'), '500000');
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: /state/i }),
      'WA'
    );

    // Mock successful calculation
    const results = {
      grossEstateValue: 500000,
      totalLiabilities: 0,
      netEstateValue: 500000,
      federalEstateTax: 0,
      stateEstateTax: 0,
      totalTaxLiability: 0,
      netToHeirs: 500000,
      potentialTaxSavings: 0,
      recommendedStrategies: []
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
