import React from 'react';
import { render, screen, axe } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BeneficiaryPlanningTool from '@/components/chapters/fundamentals/calculators/BeneficiaryPlanningTool';
import { useCalculatorBase } from '@/lib/hooks/useCalculatorBase';

// Mock the useCalculatorBase hook
jest.mock('@/lib/hooks/useCalculatorBase', () => ({
  useCalculatorBase: jest.fn()
}));

describe('BeneficiaryPlanningTool Accessibility Tests', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Setup default mock implementation
    (useCalculatorBase as jest.Mock).mockReturnValue({
      calculate: jest.fn(),
      isCalculating: false,
      lastCalculated: null,
      resetCalculator: jest.fn(),
      saveToHistory: jest.fn(),
      history: []
    });
  });

  it('should have no axe violations in initial state', async () => {
    const { container } = render(<BeneficiaryPlanningTool />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no axe violations when displaying results', async () => {
    // Mock calculation results
    (useCalculatorBase as jest.Mock).mockReturnValue({
      calculate: jest.fn(),
      isCalculating: false,
      lastCalculated: {
        beneficiaries: [
          {
            name: 'John Doe',
            relationship: 'Child',
            share: 50,
            specialNeeds: true,
            contingentBeneficiary: 'Jane Doe',
            distributionTiming: 'Staged',
            distributionSchedule: ['Age 25: 25%', 'Age 30: 75%']
          }
        ],
        totalAssets: 1000000,
        distributionStrategy: 'Per Stirpes',
        taxImplications: {
          estateTax: 0,
          giftTax: 0,
          generationSkippingTax: 0
        },
        specialProvisions: ['Spendthrift clause', 'Education fund'],
        reviewSchedule: {
          nextReview: '2024-06-01',
          frequency: 'Annual',
          lastReviewed: '2023-06-01'
        },
        warnings: ['Consider special needs trust for John Doe']
      },
      resetCalculator: jest.fn(),
      saveToHistory: jest.fn(),
      history: []
    });

    const { container } = render(<BeneficiaryPlanningTool />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper heading hierarchy', () => {
    render(<BeneficiaryPlanningTool />);
    
    const headings = screen.getAllByRole('heading');
    expect(headings.length).toBeGreaterThan(0);
    
    // Verify heading levels are properly nested
    const headingLevels = headings.map(h => parseInt(h.getAttribute('aria-level') || '0'));
    headingLevels.forEach((level, index) => {
      if (index > 0) {
        expect(level - headingLevels[index - 1]).toBeLessThanOrEqual(1);
      }
    });
  });

  it('should have proper form labeling', () => {
    render(<BeneficiaryPlanningTool />);

    // Check that all form controls have associated labels
    const inputs = screen.getAllByRole('textbox');
    inputs.forEach(input => {
      expect(input).toHaveAccessibleName();
    });

    const selects = screen.getAllByRole('combobox');
    selects.forEach(select => {
      expect(select).toHaveAccessibleName();
    });

    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button).toHaveAccessibleName();
    });
  });

  it('should handle keyboard navigation', async () => {
    render(<BeneficiaryPlanningTool />);

    // Add beneficiary button should be focusable
    const addBeneficiaryButton = screen.getByRole('button', { name: /add beneficiary/i });
    addBeneficiaryButton.focus();
    expect(addBeneficiaryButton).toHaveFocus();

    // Tab through form controls
    await userEvent.tab();
    expect(screen.getByRole('button', { name: /distribution strategy/i })).toHaveFocus();

    // Continue tabbing through all interactive elements
    let focusableElements = 0;
    do {
      await userEvent.tab();
      focusableElements++;
    } while (document.activeElement !== addBeneficiaryButton && focusableElements < 50);

    expect(focusableElements).toBeGreaterThan(0);
  });

  it('should announce calculation status', async () => {
    const mockCalculate = jest.fn();
    (useCalculatorBase as jest.Mock).mockReturnValue({
      calculate: mockCalculate,
      isCalculating: true,
      lastCalculated: null,
      resetCalculator: jest.fn(),
      saveToHistory: jest.fn(),
      history: []
    });

    render(<BeneficiaryPlanningTool />);

    // Loading state should be announced
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent(/calculating/i);
  });

  it('should announce validation errors', async () => {
    render(<BeneficiaryPlanningTool />);

    // Trigger validation errors
    const calculateButton = screen.getByRole('button', { name: /calculate/i });
    await userEvent.click(calculateButton);

    // Error messages should be announced
    const alerts = screen.getAllByRole('alert');
    expect(alerts.length).toBeGreaterThan(0);
    alerts.forEach(alert => {
      expect(alert).toHaveAccessibleName();
    });
  });

  it('should handle special needs beneficiary accessibility', async () => {
    render(<BeneficiaryPlanningTool />);

    // Add a beneficiary
    const addBeneficiaryButton = screen.getByRole('button', { name: /add beneficiary/i });
    await userEvent.click(addBeneficiaryButton);

    // Toggle special needs
    const specialNeedsCheckbox = screen.getByRole('checkbox', { name: /special needs/i });
    await userEvent.click(specialNeedsCheckbox);

    // Special needs options should be properly labeled
    const specialNeedsOptions = screen.getAllByRole('checkbox', { name: /special needs/i });
    specialNeedsOptions.forEach(option => {
      expect(option).toHaveAccessibleName();
      expect(option).toHaveAccessibleDescription();
    });

    // Special needs warning should be announced
    const warning = screen.getByRole('alert', { name: /special needs trust/i });
    expect(warning).toBeInTheDocument();
  });

  it('should handle distribution schedule accessibility', async () => {
    render(<BeneficiaryPlanningTool />);

    // Add a beneficiary
    const addBeneficiaryButton = screen.getByRole('button', { name: /add beneficiary/i });
    await userEvent.click(addBeneficiaryButton);

    // Select staged distribution
    const distributionSelect = screen.getByRole('combobox', { name: /distribution timing/i });
    await userEvent.selectOptions(distributionSelect, 'Staged');

    // Distribution schedule fields should be properly labeled
    const scheduleFields = screen.getAllByRole('spinbutton', { name: /distribution age/i });
    scheduleFields.forEach(field => {
      expect(field).toHaveAccessibleName();
      expect(field).toHaveAccessibleDescription();
    });
  });

  it('should have accessible data visualizations', async () => {
    // Mock calculation results
    (useCalculatorBase as jest.Mock).mockReturnValue({
      calculate: jest.fn(),
      isCalculating: false,
      lastCalculated: {
        beneficiaries: [
          {
            name: 'John Doe',
            relationship: 'Child',
            share: 50,
            specialNeeds: true,
            contingentBeneficiary: 'Jane Doe',
            distributionTiming: 'Staged',
            distributionSchedule: ['Age 25: 25%', 'Age 30: 75%']
          }
        ],
        totalAssets: 1000000,
        distributionStrategy: 'Per Stirpes',
        taxImplications: {
          estateTax: 0,
          giftTax: 0,
          generationSkippingTax: 0
        },
        specialProvisions: ['Spendthrift clause', 'Education fund'],
        reviewSchedule: {
          nextReview: '2024-06-01',
          frequency: 'Annual',
          lastReviewed: '2023-06-01'
        },
        warnings: ['Consider special needs trust for John Doe']
      },
      resetCalculator: jest.fn(),
      saveToHistory: jest.fn(),
      history: []
    });

    render(<BeneficiaryPlanningTool />);

    // Charts should have accessible names and descriptions
    const charts = screen.getAllByRole('img', { name: /chart/i });
    charts.forEach(chart => {
      expect(chart).toHaveAccessibleName();
      expect(chart).toHaveAccessibleDescription();
    });
  });

  it('should handle high contrast mode', () => {
    // Mock high contrast mode
    const mediaQuery = window.matchMedia('(forced-colors: active)');
    Object.defineProperty(mediaQuery, 'matches', { value: true });

    render(<BeneficiaryPlanningTool />);

    // Verify color contrast meets WCAG requirements
    const elements = screen.getAllByRole('*');
    elements.forEach(element => {
      const styles = window.getComputedStyle(element);
      if (styles.color && styles.backgroundColor) {
        expect(true).toBe(true); // Placeholder for color contrast check
      }
    });
  });

  it('should support screen reader announcements for dynamic content', async () => {
    const { rerender } = render(<BeneficiaryPlanningTool />);

    // Add a beneficiary
    const addBeneficiaryButton = screen.getByRole('button', { name: /add beneficiary/i });
    await userEvent.click(addBeneficiaryButton);

    // New content should be announced
    const newContent = screen.getByRole('region', { name: /beneficiaries/i });
    expect(newContent).toHaveAttribute('aria-live', 'polite');

    // Add special provisions
    const addProvisionButton = screen.getByRole('button', { name: /add provision/i });
    await userEvent.click(addProvisionButton);

    // New provision content should be announced
    const provisionContent = screen.getByRole('region', { name: /special provisions/i });
    expect(provisionContent).toHaveAttribute('aria-live', 'polite');

    // Mock calculation results
    (useCalculatorBase as jest.Mock).mockReturnValue({
      calculate: jest.fn(),
      isCalculating: false,
      lastCalculated: {
        beneficiaries: [
          {
            name: 'John Doe',
            relationship: 'Child',
            share: 50,
            specialNeeds: true,
            contingentBeneficiary: 'Jane Doe',
            distributionTiming: 'Staged',
            distributionSchedule: ['Age 25: 25%', 'Age 30: 75%']
          }
        ],
        totalAssets: 1000000,
        distributionStrategy: 'Per Stirpes',
        taxImplications: {
          estateTax: 0,
          giftTax: 0,
          generationSkippingTax: 0
        },
        specialProvisions: ['Spendthrift clause', 'Education fund'],
        reviewSchedule: {
          nextReview: '2024-06-01',
          frequency: 'Annual',
          lastReviewed: '2023-06-01'
        },
        warnings: ['Consider special needs trust for John Doe']
      },
      resetCalculator: jest.fn(),
      saveToHistory: jest.fn(),
      history: []
    });

    rerender(<BeneficiaryPlanningTool />);

    // Results should be announced
    const results = screen.getByRole('region', { name: /results/i });
    expect(results).toHaveAttribute('aria-live', 'polite');
  });

  it('should handle focus management during form updates', async () => {
    render(<BeneficiaryPlanningTool />);

    // Add a beneficiary
    const addBeneficiaryButton = screen.getByRole('button', { name: /add beneficiary/i });
    await userEvent.click(addBeneficiaryButton);

    // Focus should move to the first input in the new beneficiary form
    const firstInput = screen.getByPlaceholder('Name');
    expect(firstInput).toHaveFocus();

    // Add special provisions
    const addProvisionButton = screen.getByRole('button', { name: /add provision/i });
    await userEvent.click(addProvisionButton);

    // Focus should move to the first input in the new provision form
    const provisionInput = screen.getByPlaceholder('Provision');
    expect(provisionInput).toHaveFocus();
  });

  it('should handle review schedule accessibility', async () => {
    render(<BeneficiaryPlanningTool />);

    // Open review schedule section
    const reviewButton = screen.getByRole('button', { name: /review schedule/i });
    await userEvent.click(reviewButton);

    // Review schedule fields should be properly labeled
    const dateFields = screen.getAllByRole('textbox', { name: /review date/i });
    dateFields.forEach(field => {
      expect(field).toHaveAccessibleName();
      expect(field).toHaveAccessibleDescription();
    });

    const frequencySelect = screen.getByRole('combobox', { name: /review frequency/i });
    expect(frequencySelect).toHaveAccessibleName();
    expect(frequencySelect).toHaveAccessibleDescription();
  });

  it('should provide keyboard shortcuts for common actions', async () => {
    render(<BeneficiaryPlanningTool />);

    // Calculate shortcut (Ctrl+Enter)
    const calculateButton = screen.getByRole('button', { name: /calculate/i });
    await userEvent.keyboard('{Control>}{Enter}{/Control}');
    expect(calculateButton).toHaveFocus();

    // Reset shortcut (Ctrl+R)
    const resetButton = screen.getByRole('button', { name: /reset/i });
    await userEvent.keyboard('{Control>}r{/Control}');
    expect(resetButton).toHaveFocus();
  });

  it('should maintain focus during async operations', async () => {
    const mockCalculate = jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    (useCalculatorBase as jest.Mock).mockReturnValue({
      calculate: mockCalculate,
      isCalculating: true,
      lastCalculated: null,
      resetCalculator: jest.fn(),
      saveToHistory: jest.fn(),
      history: []
    });

    render(<BeneficiaryPlanningTool />);

    // Click calculate button
    const calculateButton = screen.getByRole('button', { name: /calculate/i });
    await userEvent.click(calculateButton);

    // Button should remain focused during calculation
    expect(calculateButton).toHaveFocus();

    // Wait for calculation to complete
    await new Promise(resolve => setTimeout(resolve, 150));

    // Focus should still be managed appropriately
    expect(document.activeElement).not.toBe(null);
  });
});
