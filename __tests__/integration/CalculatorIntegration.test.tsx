import { renderHook, act } from '@testing-library/react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import {
  CalculatorProvider,
  useCalculatorActions,
  useCalculatorState
} from '@/lib/context/CalculatorContext';
import { CalculatorPersistenceProvider } from '@/lib/context/CalculatorPersistence';
import { useInvestmentCalculator } from '@/lib/hooks/calculators/useInvestmentCalculator';
import { useTaxCalculator } from '@/lib/hooks/calculators/useTaxCalculator';
import { useRetirementCalculator } from '@/lib/hooks/calculators/useRetirementCalculator';
import { useMortgageCalculator } from '@/lib/hooks/calculators/useMortgageCalculator';
import { useDebtCalculator } from '@/lib/hooks/calculators/useDebtCalculator';
import { useBudgetCalculator } from '@/lib/hooks/calculators/useBudgetCalculator';

// Test wrapper component
function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <CalculatorProvider>
      <CalculatorPersistenceProvider>
        {children}
      </CalculatorPersistenceProvider>
    </CalculatorProvider>
  );
}

describe('Calculator Integration', () => {
  describe('Investment and Tax Calculator Integration', () => {
    it('shares tax rate between investment and tax calculators', async () => {
      const { result: investmentResult } = renderHook(() => useInvestmentCalculator(), {
        wrapper: TestWrapper
      });

      const { result: taxResult } = renderHook(() => useTaxCalculator(), {
        wrapper: TestWrapper
      });

      const { result: actionsResult } = renderHook(() => useCalculatorActions(), {
        wrapper: TestWrapper
      });

      // Set tax rate in common inputs
      act(() => {
        actionsResult.current.updateCommonInput('taxRate', 25);
      });

      // Update investment values
      act(() => {
        investmentResult.current.setValues({
          initialInvestment: 10000,
          monthlyContribution: 500,
          annualReturn: 8,
          investmentPeriod: 10
        });
      });

      // Calculate investment results
      await act(async () => {
        await investmentResult.current.calculate();
      });

      // Verify investment results use common tax rate
      expect(investmentResult.current.state.result?.afterTaxReturn).toBeDefined();
      const investmentTaxImpact = investmentResult.current.state.result?.taxableAmount * 0.25;
      expect(investmentResult.current.state.result?.taxAmount).toBeCloseTo(investmentTaxImpact);

      // Update tax calculator values
      act(() => {
        taxResult.current.setValues({
          income: 75000,
          deductions: 12000,
          credits: 1000
        });
      });

      // Calculate tax results
      await act(async () => {
        await taxResult.current.calculate();
      });

      // Verify tax results use common tax rate
      expect(taxResult.current.state.result?.effectiveTaxRate).toBeCloseTo(25, 1);
    });
  });

  describe('Retirement and Investment Calculator Integration', () => {
    it('shares investment returns and inflation assumptions', async () => {
      const { result: retirementResult } = renderHook(() => useRetirementCalculator(), {
        wrapper: TestWrapper
      });

      const { result: investmentResult } = renderHook(() => useInvestmentCalculator(), {
        wrapper: TestWrapper
      });

      const { result: actionsResult } = renderHook(() => useCalculatorActions(), {
        wrapper: TestWrapper
      });

      // Set common inputs
      act(() => {
        actionsResult.current.updateCommonInput('inflationRate', 3);
        actionsResult.current.updateCommonInput('riskTolerance', 'moderate');
      });

      // Update retirement values
      act(() => {
        retirementResult.current.setValues({
          currentAge: 30,
          retirementAge: 65,
          currentSavings: 50000,
          monthlyContribution: 1000,
          desiredRetirementIncome: 80000
        });
      });

      // Calculate retirement results
      await act(async () => {
        await retirementResult.current.calculate();
      });

      // Update investment values with same timeframe
      act(() => {
        investmentResult.current.setValues({
          initialInvestment: 50000,
          monthlyContribution: 1000,
          annualReturn: retirementResult.current.state.result?.projectedReturn,
          investmentPeriod: 35
        });
      });

      // Calculate investment results
      await act(async () => {
        await investmentResult.current.calculate();
      });

      // Verify both calculators use same return assumptions
      expect(investmentResult.current.state.result?.projectedValue).toBeCloseTo(
        retirementResult.current.state.result?.projectedPortfolioValue,
        -3 // Allow for small differences due to compounding calculations
      );
    });
  });

  describe('Mortgage and Budget Calculator Integration', () => {
    it('shares housing expenses between mortgage and budget calculators', async () => {
      const { result: mortgageResult } = renderHook(() => useMortgageCalculator(), {
        wrapper: TestWrapper
      });

      const { result: budgetResult } = renderHook(() => useBudgetCalculator(), {
        wrapper: TestWrapper
      });

      // Update mortgage values
      act(() => {
        mortgageResult.current.setValues({
          homePrice: 300000,
          downPayment: 60000,
          interestRate: 4.5,
          loanTerm: 30,
          propertyTax: 3000,
          homeInsurance: 1200
        });
      });

      // Calculate mortgage results
      await act(async () => {
        await mortgageResult.current.calculate();
      });

      const monthlyMortgagePayment = mortgageResult.current.state.result?.monthlyPayment;
      const totalHousingCost = monthlyMortgagePayment +
        (mortgageResult.current.state.values.propertyTax / 12) +
        (mortgageResult.current.state.values.homeInsurance / 12);

      // Update budget values
      act(() => {
        budgetResult.current.setValues({
          monthlyIncome: 8000,
          expenses: {
            housing: totalHousingCost,
            utilities: 200,
            food: 600,
            transportation: 400,
            other: 1000
          }
        });
      });

      // Calculate budget results
      await act(async () => {
        await budgetResult.current.calculate();
      });

      // Verify housing expense ratio
      const housingRatio = (totalHousingCost / budgetResult.current.state.values.monthlyIncome) * 100;
      expect(budgetResult.current.state.result?.housingExpenseRatio).toBeCloseTo(housingRatio);
    });
  });

  describe('Debt and Budget Calculator Integration', () => {
    it('shares debt payments between debt and budget calculators', async () => {
      const { result: debtResult } = renderHook(() => useDebtCalculator(), {
        wrapper: TestWrapper
      });

      const { result: budgetResult } = renderHook(() => useBudgetCalculator(), {
        wrapper: TestWrapper
      });

      // Update debt values
      act(() => {
        debtResult.current.setValues({
          debts: [
            { type: 'credit-card', balance: 5000, interestRate: 18, minimumPayment: 150 },
            { type: 'personal-loan', balance: 10000, interestRate: 12, minimumPayment: 300 },
            { type: 'student-loan', balance: 20000, interestRate: 6, minimumPayment: 250 }
          ]
        });
      });

      // Calculate debt results
      await act(async () => {
        await debtResult.current.calculate();
      });

      const totalMinimumPayments = debtResult.current.state.values.debts.reduce(
        (total, debt) => total + debt.minimumPayment,
        0
      );

      // Update budget values
      act(() => {
        budgetResult.current.setValues({
          monthlyIncome: 5000,
          expenses: {
            housing: 1500,
            utilities: 200,
            food: 500,
            transportation: 300,
            debtPayments: totalMinimumPayments,
            other: 500
          }
        });
      });

      // Calculate budget results
      await act(async () => {
        await budgetResult.current.calculate();
      });

      // Verify debt-to-income ratio
      const dti = (totalMinimumPayments / budgetResult.current.state.values.monthlyIncome) * 100;
      expect(budgetResult.current.state.result?.debtToIncomeRatio).toBeCloseTo(dti);

      // Verify available debt payment in budget matches debt calculator's recommended payment
      expect(budgetResult.current.state.result?.availableForDebtPayment).toBeCloseTo(
        debtResult.current.state.result?.recommendedMonthlyPayment,
        -1 // Allow for small rounding differences
      );
    });
  });

  describe('Multi-Calculator Workflow', () => {
    it('handles a complete financial planning workflow', async () => {
      const { result: budgetResult } = renderHook(() => useBudgetCalculator(), {
        wrapper: TestWrapper
      });
      const { result: investmentResult } = renderHook(() => useInvestmentCalculator(), {
        wrapper: TestWrapper
      });
      const { result: retirementResult } = renderHook(() => useRetirementCalculator(), {
        wrapper: TestWrapper
      });
      const { result: actionsResult } = renderHook(() => useCalculatorActions(), {
        wrapper: TestWrapper
      });

      // Set common inputs
      act(() => {
        actionsResult.current.updateCommonInput('inflationRate', 2.5);
        actionsResult.current.updateCommonInput('taxRate', 22);
        actionsResult.current.updateCommonInput('riskTolerance', 'moderate');
      });

      // Step 1: Budget Analysis
      act(() => {
        budgetResult.current.setValues({
          monthlyIncome: 6000,
          expenses: {
            housing: 1800,
            utilities: 200,
            food: 500,
            transportation: 400,
            savings: 1000,
            other: 800
          }
        });
      });

      await act(async () => {
        await budgetResult.current.calculate();
      });

      const monthlySavings = budgetResult.current.state.result?.availableForSavings;
      expect(monthlySavings).toBeDefined();

      // Step 2: Investment Planning
      act(() => {
        investmentResult.current.setValues({
          initialInvestment: 10000,
          monthlyContribution: monthlySavings,
          annualReturn: 7,
          investmentPeriod: 30
        });
      });

      await act(async () => {
        await investmentResult.current.calculate();
      });

      const projectedInvestmentValue = investmentResult.current.state.result?.projectedValue;
      expect(projectedInvestmentValue).toBeDefined();

      // Step 3: Retirement Planning
      act(() => {
        retirementResult.current.setValues({
          currentAge: 35,
          retirementAge: 65,
          currentSavings: 10000,
          monthlyContribution: monthlySavings,
          desiredRetirementIncome: 72000 // Annual income
        });
      });

      await act(async () => {
        await retirementResult.current.calculate();
      });

      // Verify integration points
      expect(retirementResult.current.state.result?.projectedPortfolioValue).toBeCloseTo(
        projectedInvestmentValue,
        -3 // Allow for differences in calculation methods
      );

      expect(retirementResult.current.state.result?.monthlyContributionRequired).toBeLessThanOrEqual(
        budgetResult.current.state.result?.availableForSavings
      );

      // Verify shared assumptions are used consistently
      expect(retirementResult.current.state.result?.inflationAdjustedReturn).toBeCloseTo(
        7 - 2.5, // annualReturn - inflationRate
        1
      );
    });
  });
});

