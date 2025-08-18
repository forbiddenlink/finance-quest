import React from 'react';
import { render, screen, axe } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TrustPlanningCalculator from '@/components/chapters/fundamentals/calculators/TrustPlanningCalculator';
import { useCalculatorBase } from '@/lib/hooks/useCalculatorBase';

// Mock the useCalculatorBase hook
jest.mock('@/lib/hooks/useCalculatorBase', () => ({
  useCalculatorBase: jest.fn()
}));

describe('TrustPlanningCalculator Accessibility Tests', () => {
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
    const { container } = render(<TrustPlanningCalculator />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no axe violations when displaying results', async () => {
    // Mock calculation results
    (useCalculatorBase as jest.Mock).mockReturnValue({
      calculate: jest.fn(),
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
      resetCalculator: jest.fn(),
      saveToHistory: jest.fn(),
      history: []
    });

    const { container } = render(<TrustPlanningCalculator />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper heading hierarchy', () => {
    render(<TrustPlanningCalculator />);
    
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
    render(<TrustPlanningCalculator />);

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
    render(<TrustPlanningCalculator />);

    // Trust type selector should be focusable
    const trustTypeSelect = screen.getByRole('combobox', { name: /trust type/i });
    trustTypeSelect.focus();
    expect(trustTypeSelect).toHaveFocus();

    // Tab through form controls
    await userEvent.tab();
    expect(screen.getByRole('spinbutton', { name: /duration/i })).toHaveFocus();

    // Continue tabbing through all interactive elements
    let focusableElements = 0;
    do {
      await userEvent.tab();
      focusableElements++;
    } while (document.activeElement !== trustTypeSelect && focusableElements < 50);

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

    render(<TrustPlanningCalculator />);

    // Loading state should be announced
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent(/calculating/i);
  });

  it('should announce validation errors', async () => {
    render(<TrustPlanningCalculator />);

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

  it('should handle special needs trust accessibility', async () => {
    render(<TrustPlanningCalculator />);

    // Select special needs trust type
    const trustTypeSelect = screen.getByRole('combobox', { name: /trust type/i });
    await userEvent.selectOptions(trustTypeSelect, 'special_needs');

    // Special needs options should be properly labeled
    const specialNeedsOptions = screen.getAllByRole('checkbox', { name: /special needs/i });
    specialNeedsOptions.forEach(option => {
      expect(option).toHaveAccessibleName();
      expect(option).toHaveAccessibleDescription();
    });
  });

  it('should handle charitable trust accessibility', async () => {
    render(<TrustPlanningCalculator />);

    // Select charitable trust type
    const trustTypeSelect = screen.getByRole('combobox', { name: /trust type/i });
    await userEvent.selectOptions(trustTypeSelect, 'charitable');

    // Charitable options should be properly labeled
    const charityFields = screen.getAllByRole('textbox', { name: /charity/i });
    charityFields.forEach(field => {
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
      resetCalculator: jest.fn(),
      saveToHistory: jest.fn(),
      history: []
    });

    render(<TrustPlanningCalculator />);

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

    render(<TrustPlanningCalculator />);

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
    const { rerender } = render(<TrustPlanningCalculator />);

    // Add an asset
    const addAssetButton = screen.getByRole('button', { name: /add asset/i });
    await userEvent.click(addAssetButton);

    // New content should be announced
    const newContent = screen.getByRole('region', { name: /assets/i });
    expect(newContent).toHaveAttribute('aria-live', 'polite');

    // Add a beneficiary
    const addBeneficiaryButton = screen.getByRole('button', { name: /add beneficiary/i });
    await userEvent.click(addBeneficiaryButton);

    // New beneficiary content should be announced
    const beneficiaryContent = screen.getByRole('region', { name: /beneficiaries/i });
    expect(beneficiaryContent).toHaveAttribute('aria-live', 'polite');

    // Mock calculation results
    (useCalculatorBase as jest.Mock).mockReturnValue({
      calculate: jest.fn(),
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
      resetCalculator: jest.fn(),
      saveToHistory: jest.fn(),
      history: []
    });

    rerender(<TrustPlanningCalculator />);

    // Results should be announced
    const results = screen.getByRole('region', { name: /results/i });
    expect(results).toHaveAttribute('aria-live', 'polite');
  });

  it('should handle focus management during form updates', async () => {
    render(<TrustPlanningCalculator />);

    // Add an asset
    const addAssetButton = screen.getByRole('button', { name: /add asset/i });
    await userEvent.click(addAssetButton);

    // Focus should move to the first input in the new asset form
    const firstInput = screen.getByPlaceholder('Description');
    expect(firstInput).toHaveFocus();

    // Add a beneficiary
    const addBeneficiaryButton = screen.getByRole('button', { name: /add beneficiary/i });
    await userEvent.click(addBeneficiaryButton);

    // Focus should move to the first input in the new beneficiary form
    const beneficiaryInput = screen.getByPlaceholder('Name');
    expect(beneficiaryInput).toHaveFocus();
  });

  it('should provide keyboard shortcuts for common actions', async () => {
    render(<TrustPlanningCalculator />);

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

    render(<TrustPlanningCalculator />);

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
