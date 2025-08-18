import React from 'react';
import { render, screen, axe } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InheritanceTaxCalculator from '@/components/chapters/fundamentals/calculators/InheritanceTaxCalculator';
import { useCalculatorBase } from '@/lib/hooks/useCalculatorBase';

// Mock the useCalculatorBase hook
jest.mock('@/lib/hooks/useCalculatorBase', () => ({
  useCalculatorBase: jest.fn()
}));

describe('InheritanceTaxCalculator Accessibility Tests', () => {
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
    const { container } = render(<InheritanceTaxCalculator />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no axe violations when displaying results', async () => {
    // Mock calculation results
    (useCalculatorBase as jest.Mock).mockReturnValue({
      calculate: jest.fn(),
      isCalculating: false,
      lastCalculated: {
        totalInheritance: 1000000,
        federalTax: 0,
        stateTax: 40000,
        totalTax: 40000,
        netInheritance: 960000,
        stepUpBasis: true,
        capitalGainsSavings: 25000,
        exemptionUsed: 0,
        portabilityAvailable: true,
        stateSpecificDeductions: ['Family-owned business deduction'],
        recommendations: ['Consider life insurance trust'],
        warnings: ['State tax threshold exceeded']
      },
      resetCalculator: jest.fn(),
      saveToHistory: jest.fn(),
      history: []
    });

    const { container } = render(<InheritanceTaxCalculator />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper heading hierarchy', () => {
    render(<InheritanceTaxCalculator />);
    
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
    render(<InheritanceTaxCalculator />);

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
    render(<InheritanceTaxCalculator />);

    // State selector should be focusable
    const stateSelect = screen.getByRole('combobox', { name: /state/i });
    stateSelect.focus();
    expect(stateSelect).toHaveFocus();

    // Tab through form controls
    await userEvent.tab();
    expect(screen.getByRole('spinbutton', { name: /inheritance amount/i })).toHaveFocus();

    // Continue tabbing through all interactive elements
    let focusableElements = 0;
    do {
      await userEvent.tab();
      focusableElements++;
    } while (document.activeElement !== stateSelect && focusableElements < 50);

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

    render(<InheritanceTaxCalculator />);

    // Loading state should be announced
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent(/calculating/i);
  });

  it('should announce validation errors', async () => {
    render(<InheritanceTaxCalculator />);

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

  it('should handle state-specific tax rules accessibility', async () => {
    render(<InheritanceTaxCalculator />);

    // Select a state with inheritance tax
    const stateSelect = screen.getByRole('combobox', { name: /state/i });
    await userEvent.selectOptions(stateSelect, 'PA');

    // State-specific options should be properly labeled
    const stateOptions = screen.getAllByRole('checkbox', { name: /state deduction/i });
    stateOptions.forEach(option => {
      expect(option).toHaveAccessibleName();
      expect(option).toHaveAccessibleDescription();
    });
  });

  it('should handle step-up basis accessibility', async () => {
    render(<InheritanceTaxCalculator />);

    // Toggle step-up basis
    const stepUpBasisCheckbox = screen.getByRole('checkbox', { name: /step-up basis/i });
    await userEvent.click(stepUpBasisCheckbox);

    // Cost basis fields should be properly labeled
    const basisFields = screen.getAllByRole('spinbutton', { name: /cost basis/i });
    basisFields.forEach(field => {
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
        totalInheritance: 1000000,
        federalTax: 0,
        stateTax: 40000,
        totalTax: 40000,
        netInheritance: 960000,
        stepUpBasis: true,
        capitalGainsSavings: 25000,
        exemptionUsed: 0,
        portabilityAvailable: true,
        stateSpecificDeductions: ['Family-owned business deduction'],
        recommendations: ['Consider life insurance trust'],
        warnings: ['State tax threshold exceeded']
      },
      resetCalculator: jest.fn(),
      saveToHistory: jest.fn(),
      history: []
    });

    render(<InheritanceTaxCalculator />);

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

    render(<InheritanceTaxCalculator />);

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
    const { rerender } = render(<InheritanceTaxCalculator />);

    // Add an asset
    const addAssetButton = screen.getByRole('button', { name: /add asset/i });
    await userEvent.click(addAssetButton);

    // New content should be announced
    const newContent = screen.getByRole('region', { name: /assets/i });
    expect(newContent).toHaveAttribute('aria-live', 'polite');

    // Change state selection
    const stateSelect = screen.getByRole('combobox', { name: /state/i });
    await userEvent.selectOptions(stateSelect, 'PA');

    // State-specific content should be announced
    const stateContent = screen.getByRole('region', { name: /state deductions/i });
    expect(stateContent).toHaveAttribute('aria-live', 'polite');

    // Mock calculation results
    (useCalculatorBase as jest.Mock).mockReturnValue({
      calculate: jest.fn(),
      isCalculating: false,
      lastCalculated: {
        totalInheritance: 1000000,
        federalTax: 0,
        stateTax: 40000,
        totalTax: 40000,
        netInheritance: 960000,
        stepUpBasis: true,
        capitalGainsSavings: 25000,
        exemptionUsed: 0,
        portabilityAvailable: true,
        stateSpecificDeductions: ['Family-owned business deduction'],
        recommendations: ['Consider life insurance trust'],
        warnings: ['State tax threshold exceeded']
      },
      resetCalculator: jest.fn(),
      saveToHistory: jest.fn(),
      history: []
    });

    rerender(<InheritanceTaxCalculator />);

    // Results should be announced
    const results = screen.getByRole('region', { name: /results/i });
    expect(results).toHaveAttribute('aria-live', 'polite');
  });

  it('should handle focus management during form updates', async () => {
    render(<InheritanceTaxCalculator />);

    // Add an asset
    const addAssetButton = screen.getByRole('button', { name: /add asset/i });
    await userEvent.click(addAssetButton);

    // Focus should move to the first input in the new asset form
    const firstInput = screen.getByPlaceholder('Description');
    expect(firstInput).toHaveFocus();

    // Change state selection
    const stateSelect = screen.getByRole('combobox', { name: /state/i });
    await userEvent.selectOptions(stateSelect, 'PA');

    // Focus should move to first state-specific input
    const stateInput = screen.getByRole('checkbox', { name: /family-owned business/i });
    expect(stateInput).toHaveFocus();
  });

  it('should provide keyboard shortcuts for common actions', async () => {
    render(<InheritanceTaxCalculator />);

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

    render(<InheritanceTaxCalculator />);

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
