import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { BudgetCalculator } from '@/components/calculators/BudgetCalculator';
import { DebtCalculator } from '@/components/calculators/DebtCalculator';
import { InvestmentCalculator } from '@/components/calculators/InvestmentCalculator';
import { TaxCalculator } from '@/components/calculators/TaxCalculator';
import { RetirementCalculator } from '@/components/calculators/RetirementCalculator';
import { MortgageCalculator } from '@/components/calculators/MortgageCalculator';

expect.extend(toHaveNoViolations);

// Mock chart components
jest.mock('@/components/shared/charts/ProfessionalCharts', () => ({
  LineChart: () => <div data-testid="line-chart" role="img" aria-label="Chart visualization" />,
  BarChart: () => <div data-testid="bar-chart" role="img" aria-label="Chart visualization" />,
  PieChart: () => <div data-testid="pie-chart" role="img" aria-label="Chart visualization" />
}));

describe('Calculator Accessibility', () => {
  describe('ARIA Landmarks and Structure', () => {
    it('should have proper landmark regions', async () => {
      const { container } = render(<BudgetCalculator />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();

      // Check for main landmarks
      expect(screen.getByRole('main')).toBeInTheDocument();
      expect(screen.getByRole('form')).toBeInTheDocument();
      expect(screen.getByRole('region', { name: /results/i })).toBeInTheDocument();
    });

    it('should have proper heading hierarchy', () => {
      render(<InvestmentCalculator />);
      
      const headings = screen.getAllByRole('heading');
      const levels = headings.map(h => parseInt(h.getAttribute('aria-level') || '0'));
      
      // Verify heading levels are sequential
      levels.reduce((prev, current) => {
        expect(current - prev).toBeLessThanOrEqual(1);
        return current;
      });
    });

    it('should have descriptive section labels', () => {
      render(<DebtCalculator />);
      
      const regions = screen.getAllByRole('region');
      regions.forEach(region => {
        expect(region).toHaveAttribute('aria-label');
      });
    });
  });

  describe('Form Controls and Labels', () => {
    it('should have properly labeled form controls', async () => {
      const { container } = render(<MortgageCalculator />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();

      const inputs = screen.getAllByRole('spinbutton');
      inputs.forEach(input => {
        expect(input).toHaveAccessibleName();
      });

      const selects = screen.getAllByRole('combobox');
      selects.forEach(select => {
        expect(select).toHaveAccessibleName();
      });
    });

    it('should have clear error messages', async () => {
      render(<TaxCalculator />);
      
      const incomeInput = screen.getByLabelText(/income/i);
      await userEvent.clear(incomeInput);
      await userEvent.type(incomeInput, '-1000');

      const errorMessage = screen.getByRole('alert');
      expect(errorMessage).toHaveAttribute('aria-live', 'polite');
      expect(errorMessage).toBeVisible();
    });

    it('should group related controls', () => {
      render(<RetirementCalculator />);
      
      const fieldsets = screen.getAllByRole('group');
      fieldsets.forEach(fieldset => {
        expect(fieldset).toHaveAccessibleName();
        const legend = within(fieldset).getByRole('heading');
        expect(legend).toBeVisible();
      });
    });
  });

  describe('Dynamic Content Updates', () => {
    it('should announce calculation results', async () => {
      render(<InvestmentCalculator />);
      
      const resultsRegion = screen.getByRole('region', { name: /results/i });
      expect(resultsRegion).toHaveAttribute('aria-live', 'polite');

      const initialInvestment = screen.getByLabelText(/initial investment/i);
      await userEvent.clear(initialInvestment);
      await userEvent.type(initialInvestment, '10000');

      // Verify results update announcement
      const results = within(resultsRegion).getByRole('status');
      expect(results).toBeVisible();
    });

    it('should announce validation status changes', async () => {
      render(<BudgetCalculator />);
      
      const incomeInput = screen.getByLabelText(/monthly income/i);
      await userEvent.clear(incomeInput);
      await userEvent.type(incomeInput, '-500');

      const validationMessage = screen.getByRole('alert');
      expect(validationMessage).toHaveAttribute('aria-live', 'assertive');
    });

    it('should handle focus management during updates', async () => {
      render(<DebtCalculator />);
      
      const addDebtButton = screen.getByRole('button', { name: /add debt/i });
      await userEvent.click(addDebtButton);

      const newDebtName = screen.getByLabelText(/debt name/i);
      expect(document.activeElement).toBe(newDebtName);
    });
  });

  describe('Keyboard Navigation', () => {
    it('should have logical tab order', async () => {
      render(<BudgetCalculator />);
      
      const tabbableElements = screen.getAllByRole('textbox, spinbutton, button, link');
      let previousTabIndex = -1;

      tabbableElements.forEach(element => {
        const tabIndex = parseInt(element.getAttribute('tabindex') || '0');
        expect(tabIndex).toBeGreaterThanOrEqual(previousTabIndex);
        previousTabIndex = tabIndex;
      });
    });

    it('should support keyboard shortcuts', async () => {
      render(<InvestmentCalculator />);
      
      const calculateButton = screen.getByRole('button', { name: /calculate/i });
      await userEvent.type(document.body, '{Enter}');
      
      expect(calculateButton).toHaveAttribute('aria-pressed', 'true');
    });

    it('should have focusable chart elements', () => {
      render(<RetirementCalculator />);
      
      const charts = screen.getAllByRole('img', { name: /chart/i });
      charts.forEach(chart => {
        expect(chart).toHaveAttribute('tabindex', '0');
      });
    });
  });

  describe('Color and Contrast', () => {
    it('should have sufficient color contrast', async () => {
      const { container } = render(<TaxCalculator />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('should not rely solely on color for information', () => {
      render(<DebtCalculator />);
      
      const statusIndicators = screen.getAllByRole('status');
      statusIndicators.forEach(indicator => {
        expect(indicator).toHaveAccessibleName();
        expect(indicator).not.toHaveAttribute('aria-label', /red|green|yellow/i);
      });
    });
  });

  describe('Screen Reader Support', () => {
    it('should provide context for numerical values', () => {
      render(<MortgageCalculator />);
      
      const results = screen.getByRole('region', { name: /results/i });
      const numbers = within(results).getAllByRole('text');
      
      numbers.forEach(number => {
        expect(number).toHaveAccessibleName();
        expect(number.getAttribute('aria-label')).toMatch(/\d+.*(?:dollars|percent|months|years)/i);
      });
    });

    it('should describe charts and visualizations', () => {
      render(<InvestmentCalculator />);
      
      const charts = screen.getAllByRole('img', { name: /chart/i });
      charts.forEach(chart => {
        expect(chart).toHaveAccessibleDescription();
      });
    });

    it('should announce important status changes', async () => {
      render(<BudgetCalculator />);
      
      const savingsInput = screen.getByLabelText(/savings goal/i);
      await userEvent.clear(savingsInput);
      await userEvent.type(savingsInput, '10000');

      const statusUpdate = screen.getByRole('status');
      expect(statusUpdate).toHaveAttribute('aria-live', 'polite');
      expect(statusUpdate).toHaveTextContent(/goal progress/i);
    });
  });

  describe('Complex Interactions', () => {
    it('should handle modal dialogs accessibly', async () => {
      render(<DebtCalculator />);
      
      const helpButton = screen.getByRole('button', { name: /help/i });
      await userEvent.click(helpButton);

      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(document.activeElement).toBeInTheDocument();
    });

    it('should manage focus in complex forms', async () => {
      render(<BudgetCalculator />);
      
      const addCategoryButton = screen.getByRole('button', { name: /add category/i });
      await userEvent.click(addCategoryButton);

      const newFields = screen.getAllByRole('textbox, spinbutton');
      expect(document.activeElement).toBe(newFields[0]);
    });

    it('should handle expandable sections properly', async () => {
      render(<TaxCalculator />);
      
      const expandButton = screen.getByRole('button', { name: /advanced options/i });
      expect(expandButton).toHaveAttribute('aria-expanded', 'false');

      await userEvent.click(expandButton);
      expect(expandButton).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('Cross-Calculator Accessibility', () => {
    it('should maintain consistent patterns across calculators', async () => {
      const calculators = [
        <BudgetCalculator />,
        <InvestmentCalculator />,
        <DebtCalculator />,
        <TaxCalculator />,
        <RetirementCalculator />,
        <MortgageCalculator />
      ];

      for (const calculator of calculators) {
        const { container } = render(calculator);
        const results = await axe(container);
        expect(results).toHaveNoViolations();

        // Check common patterns
        expect(screen.getByRole('main')).toBeInTheDocument();
        expect(screen.getByRole('form')).toBeInTheDocument();
        expect(screen.getByRole('region', { name: /results/i })).toBeInTheDocument();
      }
    });

    it('should handle focus management between calculators', async () => {
      render(
        <>
          <BudgetCalculator />
          <InvestmentCalculator />
        </>
      );

      const switchButton = screen.getByRole('button', { name: /switch calculator/i });
      await userEvent.click(switchButton);

      // Verify focus is properly managed
      const newCalculator = screen.getByRole('main', { name: /investment calculator/i });
      expect(within(newCalculator).getByRole('textbox')).toHaveFocus();
    });
  });

  describe('Responsive Accessibility', () => {
    it('should maintain accessibility at different viewport sizes', async () => {
      const { container } = render(<BudgetCalculator />);
      
      // Test at different viewport sizes
      const viewports = [
        { width: 320, height: 568 },  // Mobile
        { width: 768, height: 1024 }, // Tablet
        { width: 1024, height: 768 }, // Landscape tablet
        { width: 1440, height: 900 }  // Desktop
      ];

      for (const viewport of viewports) {
        window.innerWidth = viewport.width;
        window.innerHeight = viewport.height;
        window.dispatchEvent(new Event('resize'));

        const results = await axe(container);
        expect(results).toHaveNoViolations();
      }
    });

    it('should handle touch interactions accessibly', async () => {
      render(<InvestmentCalculator />);
      
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAttribute('aria-valuemin');
      expect(slider).toHaveAttribute('aria-valuemax');
      expect(slider).toHaveAttribute('aria-valuenow');
      expect(slider).toHaveAttribute('aria-valuetext');
    });
  });
});

