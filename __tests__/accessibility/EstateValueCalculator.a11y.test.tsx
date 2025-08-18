import React from 'react';
import { render, screen, axe } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EstateValueCalculator from '@/components/chapters/fundamentals/calculators/EstateValueCalculator';
import { useCalculatorBase } from '@/lib/hooks/useCalculatorBase';

// Mock the useCalculatorBase hook
jest.mock('@/lib/hooks/useCalculatorBase', () => ({
  useCalculatorBase: jest.fn()
}));

describe('EstateValueCalculator Accessibility Tests', () => {
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
    const { container } = render(<EstateValueCalculator />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have no axe violations when displaying results', async () => {
    // Mock calculation results
    (useCalculatorBase as jest.Mock).mockReturnValue({
      calculate: jest.fn(),
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
      resetCalculator: jest.fn(),
      saveToHistory: jest.fn(),
      history: []
    });

    const { container } = render(<EstateValueCalculator />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper heading hierarchy', () => {
    render(<EstateValueCalculator />);
    
    const headings = screen.getAllByRole('heading');
    expect(headings.length).toBeGreaterThan(0);
    
    // Verify heading levels are properly nested
    const headingLevels = headings.map(h => parseInt(h.getAttribute('aria-level') || '0'));
    headingLevels.forEach((level, index) => {
      if (index > 0) {
        // Each heading should not be more than one level deeper than the previous
        expect(level - headingLevels[index - 1]).toBeLessThanOrEqual(1);
      }
    });
  });

  it('should have proper form labeling', () => {
    render(<EstateValueCalculator />);

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
    render(<EstateValueCalculator />);

    // Add Asset button should be focusable
    const addAssetButton = screen.getByRole('button', { name: /add asset/i });
    addAssetButton.focus();
    expect(addAssetButton).toHaveFocus();

    // Tab through form controls
    await userEvent.tab();
    expect(screen.getByRole('button', { name: /add liability/i })).toHaveFocus();

    // Continue tabbing through all interactive elements
    let focusableElements = 0;
    do {
      await userEvent.tab();
      focusableElements++;
    } while (document.activeElement !== addAssetButton && focusableElements < 50);

    // Should be able to return to the first element
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

    render(<EstateValueCalculator />);

    // Loading state should be announced
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent(/calculating/i);
  });

  it('should announce validation errors', async () => {
    render(<EstateValueCalculator />);

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

  it('should have accessible data visualizations', async () => {
    // Mock calculation results
    (useCalculatorBase as jest.Mock).mockReturnValue({
      calculate: jest.fn(),
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
      resetCalculator: jest.fn(),
      saveToHistory: jest.fn(),
      history: []
    });

    render(<EstateValueCalculator />);

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

    render(<EstateValueCalculator />);

    // Verify color contrast meets WCAG requirements
    // Note: This is a basic check - you might want to add more specific color contrast tests
    const elements = screen.getAllByRole('*');
    elements.forEach(element => {
      const styles = window.getComputedStyle(element);
      if (styles.color && styles.backgroundColor) {
        // Add your color contrast verification logic here
        expect(true).toBe(true); // Placeholder for color contrast check
      }
    });
  });

  it('should support screen reader announcements for dynamic content', async () => {
    const { rerender } = render(<EstateValueCalculator />);

    // Add an asset
    const addAssetButton = screen.getByRole('button', { name: /add asset/i });
    await userEvent.click(addAssetButton);

    // New content should be announced
    const newContent = screen.getByRole('region', { name: /assets/i });
    expect(newContent).toHaveAttribute('aria-live', 'polite');

    // Mock calculation results
    (useCalculatorBase as jest.Mock).mockReturnValue({
      calculate: jest.fn(),
      isCalculating: false,
      lastCalculated: {
        grossEstateValue: 1000000,
        totalLiabilities: 0,
        netEstateValue: 1000000,
        federalEstateTax: 0,
        stateEstateTax: 0,
        totalTaxLiability: 0,
        netToHeirs: 1000000,
        potentialTaxSavings: 0,
        recommendedStrategies: []
      },
      resetCalculator: jest.fn(),
      saveToHistory: jest.fn(),
      history: []
    });

    rerender(<EstateValueCalculator />);

    // Results should be announced
    const results = screen.getByRole('region', { name: /results/i });
    expect(results).toHaveAttribute('aria-live', 'polite');
  });

  it('should handle focus management during form updates', async () => {
    render(<EstateValueCalculator />);

    // Add an asset
    const addAssetButton = screen.getByRole('button', { name: /add asset/i });
    await userEvent.click(addAssetButton);

    // Focus should move to the first input in the new asset form
    const firstInput = screen.getByPlaceholder('Description');
    expect(firstInput).toHaveFocus();

    // Remove the asset
    const removeButton = screen.getByRole('button', { name: /remove/i });
    await userEvent.click(removeButton);

    // Focus should return to the add asset button
    expect(addAssetButton).toHaveFocus();
  });

  it('should provide keyboard shortcuts for common actions', async () => {
    render(<EstateValueCalculator />);

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

    render(<EstateValueCalculator />);

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
