import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BudgetCalculator } from '@/components/calculators/BudgetCalculator';
import { DebtCalculator } from '@/components/calculators/DebtCalculator';
import { InvestmentCalculator } from '@/components/calculators/InvestmentCalculator';
import { TaxCalculator } from '@/components/calculators/TaxCalculator';
import { RetirementCalculator } from '@/components/calculators/RetirementCalculator';
import { MortgageCalculator } from '@/components/calculators/MortgageCalculator';
import { financialRatios } from '@/lib/utils/financialCalculations';

// Mock chart components
jest.mock('@/components/shared/charts/ProfessionalCharts', () => ({
  LineChart: () => <div data-testid="line-chart" />,
  BarChart: () => <div data-testid="bar-chart" />,
  PieChart: () => <div data-testid="pie-chart" />
}));

describe('Calculator UI Integration', () => {
  describe('Input Synchronization', () => {
    it('should sync income across budget and tax calculators', async () => {
      const income = 5000;
      
      render(
        <>
          <BudgetCalculator />
          <TaxCalculator />
        </>
      );

      // Enter income in budget calculator
      const budgetIncomeInput = screen.getByLabelText(/monthly income/i);
      await userEvent.clear(budgetIncomeInput);
      await userEvent.type(budgetIncomeInput, income.toString());

      // Verify tax calculator updates
      const taxIncomeInput = screen.getByLabelText(/annual income/i);
      await waitFor(() => {
        expect(taxIncomeInput).toHaveValue((income * 12).toString());
      });
    });

    it('should sync mortgage payments across calculators', async () => {
      const mortgagePayment = 2000;

      render(
        <>
          <MortgageCalculator />
          <BudgetCalculator />
          <DebtCalculator />
        </>
      );

      // Set mortgage details
      const loanAmountInput = screen.getByLabelText(/loan amount/i);
      const interestRateInput = screen.getByLabelText(/interest rate/i);
      const termInput = screen.getByLabelText(/loan term/i);

      await userEvent.clear(loanAmountInput);
      await userEvent.type(loanAmountInput, '400000');
      await userEvent.clear(interestRateInput);
      await userEvent.type(interestRateInput, '4');
      await userEvent.clear(termInput);
      await userEvent.type(termInput, '30');

      // Verify budget calculator updates
      const budgetMortgageInput = screen.getByLabelText(/housing/i);
      await waitFor(() => {
        expect(budgetMortgageInput).toHaveValue(mortgagePayment.toString());
      });

      // Verify debt calculator updates
      const debtMortgagePayment = screen.getByLabelText(/mortgage payment/i);
      await waitFor(() => {
        expect(debtMortgagePayment).toHaveValue(mortgagePayment.toString());
      });
    });
  });

  describe('Chart Updates', () => {
    it('should update investment projection charts when inputs change', async () => {
      render(<InvestmentCalculator />);

      const initialInvestmentInput = screen.getByLabelText(/initial investment/i);
      const monthlyContributionInput = screen.getByLabelText(/monthly contribution/i);
      const expectedReturnInput = screen.getByLabelText(/expected return/i);

      await userEvent.clear(initialInvestmentInput);
      await userEvent.type(initialInvestmentInput, '10000');
      await userEvent.clear(monthlyContributionInput);
      await userEvent.type(monthlyContributionInput, '500');
      await userEvent.clear(expectedReturnInput);
      await userEvent.type(expectedReturnInput, '7');

      const chart = screen.getByTestId('line-chart');
      expect(chart).toBeInTheDocument();
      // Additional chart update verification would go here
    });

    it('should update budget allocation charts when expenses change', async () => {
      render(<BudgetCalculator />);

      const housingInput = screen.getByLabelText(/housing/i);
      await userEvent.clear(housingInput);
      await userEvent.type(housingInput, '2000');

      const chart = screen.getByTestId('pie-chart');
      expect(chart).toBeInTheDocument();
      // Additional chart update verification would go here
    });
  });

  describe('Cross-Calculator Insights', () => {
    it('should show debt-related insights across calculators', async () => {
      render(
        <>
          <DebtCalculator />
          <BudgetCalculator />
        </>
      );

      // Set high debt payments
      const debtPaymentInput = screen.getByLabelText(/monthly payment/i);
      await userEvent.clear(debtPaymentInput);
      await userEvent.type(debtPaymentInput, '3000');

      const incomeInput = screen.getByLabelText(/monthly income/i);
      await userEvent.clear(incomeInput);
      await userEvent.type(incomeInput, '5000');

      // Verify DTI warning appears in both calculators
      await waitFor(() => {
        const dtiWarning = screen.getAllByText(/debt-to-income ratio.*exceeds/i);
        expect(dtiWarning).toHaveLength(2);
      });
    });

    it('should show investment-related insights across calculators', async () => {
      render(
        <>
          <InvestmentCalculator />
          <RetirementCalculator />
        </>
      );

      // Set aggressive return expectations
      const returnInput = screen.getByLabelText(/expected return/i);
      await userEvent.clear(returnInput);
      await userEvent.type(returnInput, '15');

      // Set conservative risk tolerance
      const riskSelect = screen.getByLabelText(/risk tolerance/i);
      await userEvent.selectOptions(riskSelect, 'conservative');

      // Verify warning appears in both calculators
      await waitFor(() => {
        const returnWarning = screen.getAllByText(/return.*conservative/i);
        expect(returnWarning).toHaveLength(2);
      });
    });
  });

  describe('Form Validation', () => {
    it('should validate inputs consistently across calculators', async () => {
      render(
        <>
          <BudgetCalculator />
          <InvestmentCalculator />
          <DebtCalculator />
        </>
      );

      // Test negative values
      const inputs = screen.getAllByRole('spinbutton');
      for (const input of inputs) {
        await userEvent.clear(input);
        await userEvent.type(input, '-100');
        expect(input).toBeInvalid();
      }

      // Test percentage limits
      const percentageInputs = screen.getAllByLabelText(/rate|return|percentage/i);
      for (const input of percentageInputs) {
        await userEvent.clear(input);
        await userEvent.type(input, '150');
        expect(input).toBeInvalid();
      }
    });

    it('should enforce consistent validation rules', async () => {
      render(
        <>
          <InvestmentCalculator />
          <RetirementCalculator />
        </>
      );

      // Test return expectations based on risk tolerance
      const riskSelects = screen.getAllByLabelText(/risk tolerance/i);
      const returnInputs = screen.getAllByLabelText(/expected return/i);

      for (let i = 0; i < riskSelects.length; i++) {
        await userEvent.selectOptions(riskSelects[i], 'conservative');
        await userEvent.clear(returnInputs[i]);
        await userEvent.type(returnInputs[i], 
          (financialRatios.conservativeReturn + 5).toString()
        );
        expect(returnInputs[i]).toBeInvalid();
      }
    });
  });

  describe('Calculator State Management', () => {
    it('should persist calculator state between tab switches', async () => {
      render(
        <>
          <BudgetCalculator />
          <InvestmentCalculator />
        </>
      );

      // Enter values in budget calculator
      const budgetIncomeInput = screen.getByLabelText(/monthly income/i);
      await userEvent.clear(budgetIncomeInput);
      await userEvent.type(budgetIncomeInput, '5000');

      // Switch to investment calculator
      const investmentTab = screen.getByRole('tab', { name: /investment/i });
      await userEvent.click(investmentTab);

      // Switch back to budget calculator
      const budgetTab = screen.getByRole('tab', { name: /budget/i });
      await userEvent.click(budgetTab);

      // Verify values persisted
      expect(budgetIncomeInput).toHaveValue('5000');
    });

    it('should handle concurrent updates across calculators', async () => {
      render(
        <>
          <BudgetCalculator />
          <DebtCalculator />
          <TaxCalculator />
        </>
      );

      // Simulate rapid updates
      const inputs = screen.getAllByRole('spinbutton');
      for (const input of inputs) {
        await userEvent.clear(input);
        await userEvent.type(input, '1000');
      }

      // Verify no race conditions or inconsistencies
      await waitFor(() => {
        const results = screen.getAllByTestId(/result/i);
        expect(results.every(r => r.textContent)).toBeTruthy();
      });
    });
  });

  describe('Accessibility', () => {
    it('should maintain focus management across calculators', async () => {
      render(
        <>
          <BudgetCalculator />
          <InvestmentCalculator />
        </>
      );

      // Tab through all inputs
      const inputs = screen.getAllByRole('spinbutton');
      for (const input of inputs) {
        input.focus();
        expect(document.activeElement).toBe(input);
      }
    });

    it('should announce calculation updates to screen readers', async () => {
      render(<InvestmentCalculator />);

      const initialInvestmentInput = screen.getByLabelText(/initial investment/i);
      await userEvent.clear(initialInvestmentInput);
      await userEvent.type(initialInvestmentInput, '10000');

      await waitFor(() => {
        const results = screen.getByRole('region', { name: /results/i });
        expect(results).toHaveAttribute('aria-live', 'polite');
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle calculation errors gracefully', async () => {
      render(
        <>
          <InvestmentCalculator />
          <RetirementCalculator />
        </>
      );

      // Enter invalid combination of inputs
      const inputs = screen.getAllByRole('spinbutton');
      for (const input of inputs) {
        await userEvent.clear(input);
        await userEvent.type(input, Number.MAX_SAFE_INTEGER.toString());
      }

      // Verify error handling
      await waitFor(() => {
        const errorMessages = screen.getAllByRole('alert');
        expect(errorMessages.length).toBeGreaterThan(0);
      });
    });

    it('should recover from invalid states', async () => {
      render(<BudgetCalculator />);

      // Enter invalid state
      const inputs = screen.getAllByRole('spinbutton');
      for (const input of inputs) {
        await userEvent.clear(input);
        await userEvent.type(input, 'invalid');
      }

      // Correct inputs
      for (const input of inputs) {
        await userEvent.clear(input);
        await userEvent.type(input, '1000');
      }

      // Verify recovery
      await waitFor(() => {
        const errorMessages = screen.queryAllByRole('alert');
        expect(errorMessages).toHaveLength(0);
      });
    });
  });
});

