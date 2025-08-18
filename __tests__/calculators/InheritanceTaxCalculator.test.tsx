import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InheritanceTaxCalculator from '@/components/chapters/fundamentals/calculators/InheritanceTaxCalculator';
import { useCalculatorBase } from '@/lib/hooks/useCalculatorBase';

// Mock the useCalculatorBase hook
jest.mock('@/lib/hooks/useCalculatorBase', () => ({
  useCalculatorBase: jest.fn()
}));

describe('InheritanceTaxCalculator', () => {
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
    render(<InheritanceTaxCalculator />);

    // Check for main sections
    expect(screen.getByText('Decedent Information')).toBeInTheDocument();
    expect(screen.getByText('Heir Information')).toBeInTheDocument();
    expect(screen.getByText('Inherited Assets')).toBeInTheDocument();
    expect(screen.getByText('Deductions')).toBeInTheDocument();
  });

  it('allows adding and removing assets', async () => {
    render(<InheritanceTaxCalculator />);

    // Add asset button should be present
    const addAssetButton = screen.getByRole('button', { name: /add asset/i });
    expect(addAssetButton).toBeInTheDocument();

    // Click to add an asset
    await userEvent.click(addAssetButton);

    // Should see asset input fields
    expect(screen.getByPlaceholder('Description')).toBeInTheDocument();
    expect(screen.getByPlaceholder('Value')).toBeInTheDocument();
    expect(screen.getByPlaceholder('Cost Basis')).toBeInTheDocument();

    // Fill in asset details
    await userEvent.type(screen.getByPlaceholder('Description'), 'Stock Portfolio');
    await userEvent.type(screen.getByPlaceholder('Value'), '500000');
    await userEvent.type(screen.getByPlaceholder('Cost Basis'), '200000');

    // Remove asset button should be present
    const removeButton = screen.getByRole('button', { name: /remove/i });
    expect(removeButton).toBeInTheDocument();

    // Click to remove the asset
    await userEvent.click(removeButton);

    // Asset inputs should be removed
    expect(screen.queryByDisplayValue('Stock Portfolio')).not.toBeInTheDocument();
  });

  it('allows adding and removing deductions', async () => {
    render(<InheritanceTaxCalculator />);

    // Add deduction button should be present
    const addDeductionButton = screen.getByRole('button', { name: /add deduction/i });
    expect(addDeductionButton).toBeInTheDocument();

    // Click to add a deduction
    await userEvent.click(addDeductionButton);

    // Should see deduction input fields
    expect(screen.getByPlaceholder('Description')).toBeInTheDocument();
    expect(screen.getByPlaceholder('Amount')).toBeInTheDocument();

    // Fill in deduction details
    await userEvent.type(screen.getByPlaceholder('Description'), 'Funeral Expenses');
    await userEvent.type(screen.getByPlaceholder('Amount'), '15000');

    // Remove deduction button should be present
    const removeButtons = screen.getAllByRole('button', { name: /remove/i });
    const removeDeductionButton = removeButtons[removeButtons.length - 1];
    expect(removeDeductionButton).toBeInTheDocument();

    // Click to remove the deduction
    await userEvent.click(removeDeductionButton);

    // Deduction inputs should be removed
    expect(screen.queryByDisplayValue('Funeral Expenses')).not.toBeInTheDocument();
  });

  it('validates required fields before calculation', async () => {
    render(<InheritanceTaxCalculator />);

    // Try to calculate without any inputs
    const calculateButton = screen.getByRole('button', { name: /calculate/i });
    await userEvent.click(calculateButton);

    // Should see error messages
    expect(screen.getByText(/decedent's state is required/i)).toBeInTheDocument();
    expect(screen.getByText(/date of death is required/i)).toBeInTheDocument();
    expect(screen.getByText(/heir's state is required/i)).toBeInTheDocument();

    // Verify calculate was not called
    expect(mockCalculate).not.toHaveBeenCalled();
  });

  it('performs calculation with valid inputs', async () => {
    render(<InheritanceTaxCalculator />);

    // Fill in decedent information
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: /decedent.*state/i }),
      'WA'
    );
    await userEvent.type(
      screen.getByRole('textbox', { name: /date of death/i }),
      '2024-01-01'
    );
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: /marital status/i }),
      'single'
    );

    // Fill in heir information
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: /heir.*state/i }),
      'OR'
    );
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: /relationship/i }),
      'child'
    );
    await userEvent.type(
      screen.getByRole('spinbutton', { name: /adjusted gross income/i }),
      '75000'
    );

    // Add an asset
    await userEvent.click(screen.getByRole('button', { name: /add asset/i }));
    await userEvent.type(screen.getByPlaceholder('Description'), 'Stock Portfolio');
    await userEvent.type(screen.getByPlaceholder('Value'), '500000');
    await userEvent.type(screen.getByPlaceholder('Cost Basis'), '200000');

    // Add a deduction
    await userEvent.click(screen.getByRole('button', { name: /add deduction/i }));
    await userEvent.type(screen.getByPlaceholder('Description'), 'Funeral Expenses');
    await userEvent.type(screen.getByPlaceholder('Amount'), '15000');

    // Mock successful calculation
    mockCalculate.mockResolvedValueOnce({
      grossEstate: 500000,
      totalDeductions: 15000,
      taxableEstate: 485000,
      federalEstateTax: 0,
      stateEstateTax: 0,
      stateInheritanceTax: 0,
      totalTaxLiability: 0,
      effectiveTaxRate: 0,
      netInheritance: 485000,
      stepUpBasis: [
        {
          asset: 'Stock Portfolio',
          oldBasis: 200000,
          newBasis: 500000,
          taxSavings: 60000
        }
      ],
      taxSavingOpportunities: [],
      warnings: []
    });

    // Calculate
    await userEvent.click(screen.getByRole('button', { name: /calculate/i }));

    // Verify calculate was called with correct inputs
    expect(mockCalculate).toHaveBeenCalledWith(expect.objectContaining({
      decedent: {
        state: 'WA',
        dateOfDeath: '2024-01-01',
        maritalStatus: 'single'
      },
      heir: {
        state: 'OR',
        relationship: 'child',
        adjustedGrossIncome: 75000
      },
      assets: [expect.objectContaining({
        description: 'Stock Portfolio',
        value: 500000,
        basis: 200000
      })],
      deductions: [expect.objectContaining({
        description: 'Funeral Expenses',
        amount: 15000
      })]
    }));
  });

  it('displays calculation results correctly', async () => {
    // Mock calculation results
    (useCalculatorBase as jest.Mock).mockReturnValue({
      calculate: mockCalculate,
      isCalculating: false,
      lastCalculated: {
        grossEstate: 500000,
        totalDeductions: 15000,
        taxableEstate: 485000,
        federalEstateTax: 0,
        stateEstateTax: 0,
        stateInheritanceTax: 0,
        totalTaxLiability: 0,
        effectiveTaxRate: 0,
        netInheritance: 485000,
        stepUpBasis: [
          {
            asset: 'Stock Portfolio',
            oldBasis: 200000,
            newBasis: 500000,
            taxSavings: 60000
          }
        ],
        taxSavingOpportunities: [
          {
            strategy: 'Portability Election',
            potentialSavings: 100000,
            description: 'Consider filing Form 706'
          }
        ],
        warnings: []
      },
      resetCalculator: mockResetCalculator,
      saveToHistory: mockSaveToHistory,
      history: []
    });

    render(<InheritanceTaxCalculator />);

    // Verify results are displayed
    expect(screen.getByText('$500,000')).toBeInTheDocument(); // Gross Estate
    expect(screen.getByText('$15,000')).toBeInTheDocument(); // Deductions
    expect(screen.getByText('$485,000')).toBeInTheDocument(); // Net Inheritance
    expect(screen.getByText('$60,000')).toBeInTheDocument(); // Tax Savings
    expect(screen.getByText('Portability Election')).toBeInTheDocument();
    expect(screen.getByText('Consider filing Form 706')).toBeInTheDocument();
  });

  it('handles step-up in basis calculations', async () => {
    // Mock calculation results with step-up basis
    (useCalculatorBase as jest.Mock).mockReturnValue({
      calculate: mockCalculate,
      isCalculating: false,
      lastCalculated: {
        grossEstate: 1000000,
        totalDeductions: 0,
        taxableEstate: 1000000,
        federalEstateTax: 0,
        stateEstateTax: 0,
        stateInheritanceTax: 0,
        totalTaxLiability: 0,
        effectiveTaxRate: 0,
        netInheritance: 1000000,
        stepUpBasis: [
          {
            asset: 'Stock Portfolio',
            oldBasis: 200000,
            newBasis: 500000,
            taxSavings: 60000
          },
          {
            asset: 'Rental Property',
            oldBasis: 300000,
            newBasis: 800000,
            taxSavings: 100000
          }
        ],
        taxSavingOpportunities: [],
        warnings: []
      },
      resetCalculator: mockResetCalculator,
      saveToHistory: mockSaveToHistory,
      history: []
    });

    render(<InheritanceTaxCalculator />);

    // Verify step-up basis table is displayed
    expect(screen.getByText('Step-Up in Basis Benefits')).toBeInTheDocument();
    expect(screen.getByText('Stock Portfolio')).toBeInTheDocument();
    expect(screen.getByText('Rental Property')).toBeInTheDocument();
    expect(screen.getByText('$60,000')).toBeInTheDocument();
    expect(screen.getByText('$100,000')).toBeInTheDocument();
  });

  it('handles reset functionality', async () => {
    render(<InheritanceTaxCalculator />);

    // Add some data
    await userEvent.click(screen.getByRole('button', { name: /add asset/i }));
    await userEvent.type(screen.getByPlaceholder('Description'), 'Stock Portfolio');
    await userEvent.type(screen.getByPlaceholder('Value'), '500000');

    // Reset
    await userEvent.click(screen.getByRole('button', { name: /reset/i }));

    // Verify inputs are cleared
    expect(screen.queryByDisplayValue('Stock Portfolio')).not.toBeInTheDocument();
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

    render(<InheritanceTaxCalculator />);

    // Calculate button should be disabled during calculation
    const calculateButton = screen.getByRole('button', { name: /calculate/i });
    expect(calculateButton).toBeDisabled();
  });

  it('saves results to history after successful calculation', async () => {
    render(<InheritanceTaxCalculator />);

    // Add valid inputs
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: /decedent.*state/i }),
      'WA'
    );
    await userEvent.type(
      screen.getByRole('textbox', { name: /date of death/i }),
      '2024-01-01'
    );

    await userEvent.click(screen.getByRole('button', { name: /add asset/i }));
    await userEvent.type(screen.getByPlaceholder('Description'), 'Stock Portfolio');
    await userEvent.type(screen.getByPlaceholder('Value'), '500000');

    // Mock successful calculation
    const results = {
      grossEstate: 500000,
      totalDeductions: 0,
      taxableEstate: 500000,
      federalEstateTax: 0,
      stateEstateTax: 0,
      stateInheritanceTax: 0,
      totalTaxLiability: 0,
      effectiveTaxRate: 0,
      netInheritance: 500000,
      stepUpBasis: [],
      taxSavingOpportunities: [],
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

  it('handles state-specific inheritance tax calculations', async () => {
    render(<InheritanceTaxCalculator />);

    // Select a state with inheritance tax
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: /heir.*state/i }),
      'PA'
    );

    // Add an asset
    await userEvent.click(screen.getByRole('button', { name: /add asset/i }));
    await userEvent.type(screen.getByPlaceholder('Description'), 'Stock Portfolio');
    await userEvent.type(screen.getByPlaceholder('Value'), '500000');

    // Mock calculation with inheritance tax
    mockCalculate.mockResolvedValueOnce({
      grossEstate: 500000,
      totalDeductions: 0,
      taxableEstate: 500000,
      federalEstateTax: 0,
      stateEstateTax: 0,
      stateInheritanceTax: 22500, // PA inheritance tax rate
      totalTaxLiability: 22500,
      effectiveTaxRate: 0.045,
      netInheritance: 477500,
      stepUpBasis: [],
      taxSavingOpportunities: [],
      warnings: [
        'State inheritance tax applies in PA - consider impact on distributions'
      ]
    });

    // Calculate
    await userEvent.click(screen.getByRole('button', { name: /calculate/i }));

    // Verify inheritance tax is displayed
    await waitFor(() => {
      expect(screen.getByText('$22,500')).toBeInTheDocument(); // Inheritance Tax
      expect(screen.getByText('4.5%')).toBeInTheDocument(); // Effective Rate
      expect(screen.getByText(/state inheritance tax applies in PA/i)).toBeInTheDocument();
    });
  });
});
