import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BeneficiaryPlanningTool from '@/components/chapters/fundamentals/calculators/BeneficiaryPlanningTool';
import { useCalculatorBase } from '@/lib/hooks/useCalculatorBase';

// Mock the useCalculatorBase hook
jest.mock('@/lib/hooks/useCalculatorBase', () => ({
  useCalculatorBase: jest.fn()
}));

describe('BeneficiaryPlanningTool', () => {
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
    render(<BeneficiaryPlanningTool />);

    // Check for main sections
    expect(screen.getByText('Review Settings')).toBeInTheDocument();
    expect(screen.getByText('Accounts')).toBeInTheDocument();
    expect(screen.getByText('Upcoming Life Events')).toBeInTheDocument();
  });

  it('allows selecting review frequency', async () => {
    render(<BeneficiaryPlanningTool />);

    // Review frequency selector should be present
    const frequencySelect = screen.getByRole('combobox', { name: /review frequency/i });
    expect(frequencySelect).toBeInTheDocument();

    // Should be able to select different frequencies
    await userEvent.selectOptions(frequencySelect, 'quarterly');
    expect(frequencySelect).toHaveValue('quarterly');

    await userEvent.selectOptions(frequencySelect, 'biannual');
    expect(frequencySelect).toHaveValue('biannual');

    await userEvent.selectOptions(frequencySelect, 'annual');
    expect(frequencySelect).toHaveValue('annual');
  });

  it('allows adding and managing accounts', async () => {
    render(<BeneficiaryPlanningTool />);

    // Add account button should be present
    const addAccountButton = screen.getByRole('button', { name: /add account/i });
    expect(addAccountButton).toBeInTheDocument();

    // Click to add an account
    await userEvent.click(addAccountButton);

    // Should see account input fields
    expect(screen.getByPlaceholder('Description')).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: /value/i })).toBeInTheDocument();

    // Fill in account details
    await userEvent.type(screen.getByPlaceholder('Description'), '401(k) Account');
    await userEvent.type(screen.getByRole('spinbutton', { name: /value/i }), '500000');
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: /type/i }),
      'retirement'
    );

    // Toggle switches should be present
    const todSwitch = screen.getByRole('switch', { name: /transfer on death/i });
    const requiresDesignationSwitch = screen.getByRole('switch', { name: /requires designation/i });
    expect(todSwitch).toBeInTheDocument();
    expect(requiresDesignationSwitch).toBeInTheDocument();

    // Toggle switches
    await userEvent.click(todSwitch);
    await userEvent.click(requiresDesignationSwitch);
    expect(todSwitch).toBeChecked();
    expect(requiresDesignationSwitch).toBeChecked();

    // Remove account button should be present
    const removeButton = screen.getByRole('button', { name: /remove/i });
    expect(removeButton).toBeInTheDocument();

    // Click to remove the account
    await userEvent.click(removeButton);

    // Account inputs should be removed
    expect(screen.queryByDisplayValue('401(k) Account')).not.toBeInTheDocument();
  });

  it('allows adding and managing beneficiaries', async () => {
    render(<BeneficiaryPlanningTool />);

    // Add account first
    await userEvent.click(screen.getByRole('button', { name: /add account/i }));
    await userEvent.type(screen.getByPlaceholder('Description'), '401(k) Account');
    await userEvent.type(screen.getByRole('spinbutton', { name: /value/i }), '500000');

    // Add beneficiary button should be present
    const addBeneficiaryButton = screen.getByRole('button', { name: /add beneficiary/i });
    expect(addBeneficiaryButton).toBeInTheDocument();

    // Click to add a beneficiary
    await userEvent.click(addBeneficiaryButton);

    // Should see beneficiary input fields
    expect(screen.getByPlaceholder('Name')).toBeInTheDocument();
    expect(screen.getByRole('spinbutton', { name: /percentage/i })).toBeInTheDocument();

    // Fill in beneficiary details
    await userEvent.type(screen.getByPlaceholder('Name'), 'John Doe');
    await userEvent.type(screen.getByRole('spinbutton', { name: /percentage/i }), '100');
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: /relationship/i }),
      'child'
    );
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: /type/i }),
      'primary'
    );

    // Special needs and trust switches should be present
    const specialNeedsSwitch = screen.getByRole('switch', { name: /special needs/i });
    const trustSwitch = screen.getByRole('switch', { name: /trust beneficiary/i });
    expect(specialNeedsSwitch).toBeInTheDocument();
    expect(trustSwitch).toBeInTheDocument();

    // Toggle switches
    await userEvent.click(specialNeedsSwitch);
    await userEvent.click(trustSwitch);
    expect(specialNeedsSwitch).toBeChecked();
    expect(trustSwitch).toBeChecked();

    // Remove beneficiary button should be present
    const removeButtons = screen.getAllByRole('button', { name: /remove/i });
    const removeBeneficiaryButton = removeButtons[removeButtons.length - 1];
    expect(removeBeneficiaryButton).toBeInTheDocument();

    // Click to remove the beneficiary
    await userEvent.click(removeBeneficiaryButton);

    // Beneficiary inputs should be removed
    expect(screen.queryByDisplayValue('John Doe')).not.toBeInTheDocument();
  });

  it('allows adding and managing life events', async () => {
    render(<BeneficiaryPlanningTool />);

    // Add account first for reference
    await userEvent.click(screen.getByRole('button', { name: /add account/i }));
    await userEvent.type(screen.getByPlaceholder('Description'), '401(k) Account');

    // Add life event button should be present
    const addEventButton = screen.getByRole('button', { name: /add life event/i });
    expect(addEventButton).toBeInTheDocument();

    // Click to add a life event
    await userEvent.click(addEventButton);

    // Should see life event input fields
    const eventInput = screen.getByPlaceholder('Event Description');
    const dateInput = screen.getByRole('textbox', { name: /date/i });
    expect(eventInput).toBeInTheDocument();
    expect(dateInput).toBeInTheDocument();

    // Fill in life event details
    await userEvent.type(eventInput, 'Retirement');
    await userEvent.type(dateInput, '2025-01-01');

    // Select impacted accounts
    const accountSelect = screen.getByRole('listbox', { name: /impacted accounts/i });
    await userEvent.selectOptions(accountSelect, ['401(k) Account']);

    // Remove life event button should be present
    const removeButtons = screen.getAllByRole('button', { name: /remove/i });
    const removeEventButton = removeButtons[removeButtons.length - 1];
    expect(removeEventButton).toBeInTheDocument();

    // Click to remove the life event
    await userEvent.click(removeEventButton);

    // Life event inputs should be removed
    expect(screen.queryByDisplayValue('Retirement')).not.toBeInTheDocument();
  });

  it('validates required fields before calculation', async () => {
    render(<BeneficiaryPlanningTool />);

    // Try to calculate without any inputs
    const calculateButton = screen.getByRole('button', { name: /analyze/i });
    await userEvent.click(calculateButton);

    // Should see error messages
    expect(screen.getByText(/at least one account is required/i)).toBeInTheDocument();

    // Verify calculate was not called
    expect(mockCalculate).not.toHaveBeenCalled();
  });

  it('performs calculation with valid inputs', async () => {
    render(<BeneficiaryPlanningTool />);

    // Add an account
    await userEvent.click(screen.getByRole('button', { name: /add account/i }));
    await userEvent.type(screen.getByPlaceholder('Description'), '401(k) Account');
    await userEvent.type(screen.getByRole('spinbutton', { name: /value/i }), '500000');
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: /type/i }),
      'retirement'
    );

    // Add a beneficiary
    await userEvent.click(screen.getByRole('button', { name: /add beneficiary/i }));
    await userEvent.type(screen.getByPlaceholder('Name'), 'John Doe');
    await userEvent.type(screen.getByRole('spinbutton', { name: /percentage/i }), '100');

    // Add a life event
    await userEvent.click(screen.getByRole('button', { name: /add life event/i }));
    await userEvent.type(screen.getByPlaceholder('Event Description'), 'Retirement');
    await userEvent.type(screen.getByRole('textbox', { name: /date/i }), '2025-01-01');

    // Mock successful calculation
    mockCalculate.mockResolvedValueOnce({
      totalAssets: 500000,
      beneficiarySummary: [
        {
          beneficiaryName: 'John Doe',
          totalValue: 500000,
          percentageOfEstate: 100,
          accountTypes: ['retirement'],
          isContingent: false
        }
      ],
      designationStatus: [
        {
          accountDescription: '401(k) Account',
          status: 'complete',
          issues: []
        }
      ],
      distributionAnalysis: [
        {
          category: 'Retirement Accounts',
          analysis: 'Beneficiary designations in place',
          recommendations: ['Review required distribution rules']
        }
      ],
      reviewSchedule: [
        {
          accountDescription: '401(k) Account',
          lastReview: '2024-01-01',
          nextReview: '2024-07-01',
          priority: 'medium'
        }
      ],
      warnings: []
    });

    // Calculate
    await userEvent.click(screen.getByRole('button', { name: /analyze/i }));

    // Verify calculate was called with correct inputs
    expect(mockCalculate).toHaveBeenCalledWith(expect.objectContaining({
      accounts: [expect.objectContaining({
        description: '401(k) Account',
        value: 500000,
        type: 'retirement',
        beneficiaries: [expect.objectContaining({
          name: 'John Doe',
          percentage: 100
        })]
      })],
      upcomingLifeEvents: [expect.objectContaining({
        event: 'Retirement',
        date: '2025-01-01'
      })]
    }));
  });

  it('displays calculation results correctly', async () => {
    // Mock calculation results
    (useCalculatorBase as jest.Mock).mockReturnValue({
      calculate: mockCalculate,
      isCalculating: false,
      lastCalculated: {
        totalAssets: 500000,
        beneficiarySummary: [
          {
            beneficiaryName: 'John Doe',
            totalValue: 500000,
            percentageOfEstate: 100,
            accountTypes: ['retirement'],
            isContingent: false
          }
        ],
        designationStatus: [
          {
            accountDescription: '401(k) Account',
            status: 'complete',
            issues: []
          }
        ],
        distributionAnalysis: [
          {
            category: 'Retirement Accounts',
            analysis: 'Beneficiary designations in place',
            recommendations: ['Review required distribution rules']
          }
        ],
        reviewSchedule: [
          {
            accountDescription: '401(k) Account',
            lastReview: '2024-01-01',
            nextReview: '2024-07-01',
            priority: 'medium'
          }
        ],
        warnings: []
      },
      resetCalculator: mockResetCalculator,
      saveToHistory: mockSaveToHistory,
      history: []
    });

    render(<BeneficiaryPlanningTool />);

    // Verify results are displayed
    expect(screen.getByText('$500,000')).toBeInTheDocument(); // Total Assets
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('Review required distribution rules')).toBeInTheDocument();
  });

  it('handles special needs beneficiaries correctly', async () => {
    render(<BeneficiaryPlanningTool />);

    // Add an account
    await userEvent.click(screen.getByRole('button', { name: /add account/i }));
    await userEvent.type(screen.getByPlaceholder('Description'), 'Trust Account');
    await userEvent.type(screen.getByRole('spinbutton', { name: /value/i }), '1000000');

    // Add a special needs beneficiary
    await userEvent.click(screen.getByRole('button', { name: /add beneficiary/i }));
    await userEvent.type(screen.getByPlaceholder('Name'), 'Jane Doe');
    await userEvent.type(screen.getByRole('spinbutton', { name: /percentage/i }), '100');
    await userEvent.click(screen.getByRole('switch', { name: /special needs/i }));

    // Mock calculation with special needs warning
    mockCalculate.mockResolvedValueOnce({
      totalAssets: 1000000,
      beneficiarySummary: [
        {
          beneficiaryName: 'Jane Doe',
          totalValue: 1000000,
          percentageOfEstate: 100,
          accountTypes: ['trust'],
          isContingent: false
        }
      ],
      designationStatus: [
        {
          accountDescription: 'Trust Account',
          status: 'review_needed',
          issues: ['Special needs beneficiary requires trust review']
        }
      ],
      distributionAnalysis: [
        {
          category: 'Special Needs Planning',
          analysis: 'Direct inheritance may affect government benefits',
          recommendations: [
            'Consider special needs trust',
            'Review impact on government benefits'
          ]
        }
      ],
      reviewSchedule: [],
      warnings: [
        {
          severity: 'high',
          message: 'Special needs beneficiary should inherit through a trust',
          accountsAffected: ['Trust Account']
        }
      ]
    });

    // Calculate
    await userEvent.click(screen.getByRole('button', { name: /analyze/i }));

    // Verify special needs considerations are displayed
    await waitFor(() => {
      expect(screen.getByText(/special needs beneficiary should inherit through a trust/i)).toBeInTheDocument();
      expect(screen.getByText(/consider special needs trust/i)).toBeInTheDocument();
      expect(screen.getByText(/review impact on government benefits/i)).toBeInTheDocument();
    });
  });

  it('handles review schedule calculations', async () => {
    // Mock current date
    const mockDate = new Date('2024-01-01');
    jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

    render(<BeneficiaryPlanningTool />);

    // Add an account with last review date
    await userEvent.click(screen.getByRole('button', { name: /add account/i }));
    await userEvent.type(screen.getByPlaceholder('Description'), '401(k) Account');
    await userEvent.type(screen.getByRole('textbox', { name: /last reviewed/i }), '2023-01-01');

    // Set quarterly review frequency
    await userEvent.selectOptions(
      screen.getByRole('combobox', { name: /review frequency/i }),
      'quarterly'
    );

    // Mock calculation with review schedule
    mockCalculate.mockResolvedValueOnce({
      totalAssets: 500000,
      beneficiarySummary: [],
      designationStatus: [],
      distributionAnalysis: [],
      reviewSchedule: [
        {
          accountDescription: '401(k) Account',
          lastReview: '2023-01-01',
          nextReview: '2024-04-01',
          priority: 'high'
        }
      ],
      warnings: [
        {
          severity: 'medium',
          message: 'Review overdue by 12 months',
          accountsAffected: ['401(k) Account']
        }
      ]
    });

    // Calculate
    await userEvent.click(screen.getByRole('button', { name: /analyze/i }));

    // Verify review schedule is displayed
    await waitFor(() => {
      expect(screen.getByText('2023-01-01')).toBeInTheDocument(); // Last Review
      expect(screen.getByText('2024-04-01')).toBeInTheDocument(); // Next Review
      expect(screen.getByText('HIGH')).toBeInTheDocument(); // Priority
      expect(screen.getByText(/review overdue by 12 months/i)).toBeInTheDocument();
    });

    // Restore Date
    jest.restoreAllMocks();
  });

  it('handles reset functionality', async () => {
    render(<BeneficiaryPlanningTool />);

    // Add some data
    await userEvent.click(screen.getByRole('button', { name: /add account/i }));
    await userEvent.type(screen.getByPlaceholder('Description'), '401(k) Account');
    await userEvent.type(screen.getByRole('spinbutton', { name: /value/i }), '500000');

    // Reset
    await userEvent.click(screen.getByRole('button', { name: /reset/i }));

    // Verify inputs are cleared
    expect(screen.queryByDisplayValue('401(k) Account')).not.toBeInTheDocument();
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

    render(<BeneficiaryPlanningTool />);

    // Calculate button should be disabled during calculation
    const calculateButton = screen.getByRole('button', { name: /analyze/i });
    expect(calculateButton).toBeDisabled();
  });

  it('saves results to history after successful calculation', async () => {
    render(<BeneficiaryPlanningTool />);

    // Add valid inputs
    await userEvent.click(screen.getByRole('button', { name: /add account/i }));
    await userEvent.type(screen.getByPlaceholder('Description'), '401(k) Account');
    await userEvent.type(screen.getByRole('spinbutton', { name: /value/i }), '500000');

    // Mock successful calculation
    const results = {
      totalAssets: 500000,
      beneficiarySummary: [],
      designationStatus: [],
      distributionAnalysis: [],
      reviewSchedule: [],
      warnings: []
    };
    mockCalculate.mockResolvedValueOnce(results);

    // Calculate
    await userEvent.click(screen.getByRole('button', { name: /analyze/i }));

    // Verify results were saved to history
    await waitFor(() => {
      expect(mockSaveToHistory).toHaveBeenCalledWith(
        expect.any(Object),
        results
      );
    });
  });
});
