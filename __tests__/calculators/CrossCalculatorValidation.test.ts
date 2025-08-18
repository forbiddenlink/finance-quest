import { renderHook, act } from '@testing-library/react';
import { useBudgetCalculator } from '@/lib/hooks/calculators/useBudgetCalculator';
import { useDebtCalculator } from '@/lib/hooks/calculators/useDebtCalculator';
import { useTaxCalculator } from '@/lib/hooks/calculators/useTaxCalculator';
import { useInvestmentCalculator } from '@/lib/hooks/calculators/useInvestmentCalculator';
import { useMortgageCalculator } from '@/lib/hooks/calculators/useMortgageCalculator';
import { useRetirementCalculator } from '@/lib/hooks/calculators/useRetirementCalculator';
import { financialRatios } from '@/lib/utils/financialCalculations';

// Mock the progress store
jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: () => (calculatorId: string) => {}
}));

describe('Cross Calculator Validation', () => {
  describe('Debt-to-Income Calculations', () => {
    it('should calculate consistent DTI across calculators', () => {
      const income = 5000;
      const mortgagePayment = 1500;
      const carLoan = 400;
      const creditCard = 200;

      // Budget Calculator DTI
      const { result: budgetResult } = renderHook(() => useBudgetCalculator());
      act(() => {
        budgetResult.current.updateField('monthlyIncome', income);
        budgetResult.current.updateField('categories', [
          { name: 'Mortgage', amount: mortgagePayment, type: 'essential', frequency: 'monthly' },
          { name: 'Car Loan', amount: carLoan, type: 'essential', frequency: 'monthly' },
          { name: 'Credit Card', amount: creditCard, type: 'essential', frequency: 'monthly' }
        ]);
      });

      // Debt Calculator DTI
      const { result: debtResult } = renderHook(() => useDebtCalculator());
      act(() => {
        debtResult.current.updateField('monthlyIncome', income);
        debtResult.current.updateField('debts', [
          {
            name: 'Mortgage',
            balance: 300000,
            interestRate: 4,
            minimumPayment: mortgagePayment,
            type: 'mortgage',
            isDeductible: true
          },
          {
            name: 'Car Loan',
            balance: 20000,
            interestRate: 5,
            minimumPayment: carLoan,
            type: 'auto_loan',
            isDeductible: false
          },
          {
            name: 'Credit Card',
            balance: 5000,
            interestRate: 18,
            minimumPayment: creditCard,
            type: 'credit_card',
            isDeductible: false
          }
        ]);
      });

      const budgetDTI = budgetResult.current.result?.metrics.debtToIncome;
      const debtDTI = debtResult.current.result?.metrics.debtServiceRatio;

      expect(budgetDTI).toBeCloseTo(debtDTI!, 1);
    });
  });

  describe('Tax Deduction Integration', () => {
    it('should handle mortgage interest deductions consistently', () => {
      const income = 100000;
      const mortgageBalance = 300000;
      const mortgageRate = 4;

      // Mortgage Calculator
      const { result: mortgageResult } = renderHook(() => useMortgageCalculator());
      act(() => {
        mortgageResult.current.updateField('loanAmount', mortgageBalance);
        mortgageResult.current.updateField('interestRate', mortgageRate);
        mortgageResult.current.updateField('loanTerm', 30);
      });

      // Tax Calculator
      const { result: taxResult } = renderHook(() => useTaxCalculator());
      act(() => {
        taxResult.current.updateField('income', income);
        taxResult.current.updateField('filingStatus', 'single');
        taxResult.current.updateField('itemizedDeductions', 
          mortgageResult.current.result?.firstYearInterest || 0
        );
      });

      // Debt Calculator
      const { result: debtResult } = renderHook(() => useDebtCalculator());
      act(() => {
        debtResult.current.updateField('debts', [{
          name: 'Mortgage',
          balance: mortgageBalance,
          interestRate: mortgageRate,
          minimumPayment: mortgageResult.current.result?.monthlyPayment || 0,
          type: 'mortgage',
          isDeductible: true
        }]);
      });

      const mortgageInterest = mortgageResult.current.result?.firstYearInterest;
      const debtInterest = debtResult.current.result?.summary.taxDeductibleInterest;
      const taxDeduction = taxResult.current.result?.deductions.itemized;

      expect(mortgageInterest).toBeCloseTo(debtInterest!, -2);
      expect(taxDeduction).toBeCloseTo(mortgageInterest!, -2);
    });
  });

  describe('Investment and Retirement Integration', () => {
    it('should calculate consistent returns across calculators', () => {
      const initialAmount = 100000;
      const monthlyContribution = 1000;
      const expectedReturn = 7;
      const years = 20;

      // Investment Calculator
      const { result: investmentResult } = renderHook(() => useInvestmentCalculator());
      act(() => {
        investmentResult.current.updateField('initialInvestment', initialAmount);
        investmentResult.current.updateField('monthlyContribution', monthlyContribution);
        investmentResult.current.updateField('expectedReturn', expectedReturn);
        investmentResult.current.updateField('years', years);
        investmentResult.current.updateField('fees', 0);
        investmentResult.current.updateField('inflationRate', 0);
      });

      // Retirement Calculator
      const { result: retirementResult } = renderHook(() => useRetirementCalculator());
      act(() => {
        retirementResult.current.updateField('currentSavings', initialAmount);
        retirementResult.current.updateField('monthlyContribution', monthlyContribution);
        retirementResult.current.updateField('expectedReturn', expectedReturn);
        retirementResult.current.updateField('yearsToRetirement', years);
        retirementResult.current.updateField('inflationRate', 0);
      });

      const investmentFutureValue = investmentResult.current.result?.futureValue;
      const retirementFutureValue = retirementResult.current.result?.projectedSavings;

      expect(investmentFutureValue).toBeCloseTo(retirementFutureValue!, -2);
    });
  });

  describe('Budget and Investment Integration', () => {
    it('should handle savings rate consistently', () => {
      const income = 5000;
      const savings = 1000;

      // Budget Calculator
      const { result: budgetResult } = renderHook(() => useBudgetCalculator());
      act(() => {
        budgetResult.current.updateField('monthlyIncome', income);
        budgetResult.current.updateField('categories', [
          { name: 'Investment', amount: savings, type: 'savings', frequency: 'monthly' }
        ]);
      });

      // Investment Calculator
      const { result: investmentResult } = renderHook(() => useInvestmentCalculator());
      act(() => {
        investmentResult.current.updateField('monthlyContribution', savings);
      });

      const budgetSavingsRate = budgetResult.current.result?.metrics.savingsRate;
      const expectedRate = (savings / income) * 100;

      expect(budgetSavingsRate).toBeCloseTo(expectedRate, 1);
      expect(investmentResult.current.result?.insights).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: budgetSavingsRate! < financialRatios.minSavingsRate ? 'warning' : 'success'
          })
        ])
      );
    });
  });

  describe('Emergency Fund Calculations', () => {
    it('should calculate consistent emergency fund requirements', () => {
      const monthlyExpenses = 3000;
      const targetMonths = 6;

      // Budget Calculator
      const { result: budgetResult } = renderHook(() => useBudgetCalculator());
      act(() => {
        budgetResult.current.updateField('categories', [
          { name: 'Rent', amount: 1500, type: 'essential', frequency: 'monthly' },
          { name: 'Utilities', amount: 300, type: 'essential', frequency: 'monthly' },
          { name: 'Food', amount: 600, type: 'essential', frequency: 'monthly' },
          { name: 'Insurance', amount: 400, type: 'essential', frequency: 'monthly' },
          { name: 'Transportation', amount: 200, type: 'essential', frequency: 'monthly' }
        ]);
        budgetResult.current.updateField('emergencyFundTarget', monthlyExpenses * targetMonths);
      });

      // Investment Calculator (Emergency Fund)
      const { result: investmentResult } = renderHook(() => useInvestmentCalculator());
      act(() => {
        investmentResult.current.updateField('initialInvestment', monthlyExpenses * targetMonths);
        investmentResult.current.updateField('riskTolerance', 'conservative');
      });

      const budgetEmergencyMonths = budgetResult.current.result?.metrics.emergencyFundMonths;
      expect(budgetEmergencyMonths).toBe(targetMonths);

      // Conservative investment for emergency fund
      expect(investmentResult.current.result?.insights).toEqual(
        expect.arrayContaining([
          expect.not.objectContaining({
            type: 'warning',
            message: expect.stringContaining('risk tolerance')
          })
        ])
      );
    });
  });

  describe('Debt and Investment Priority', () => {
    it('should provide consistent recommendations for debt vs investment', () => {
      const highInterestDebt = 18;
      const expectedReturn = 7;

      // Debt Calculator
      const { result: debtResult } = renderHook(() => useDebtCalculator());
      act(() => {
        debtResult.current.updateField('debts', [{
          name: 'Credit Card',
          balance: 10000,
          interestRate: highInterestDebt,
          minimumPayment: 300,
          type: 'credit_card',
          isDeductible: false
        }]);
      });

      // Investment Calculator
      const { result: investmentResult } = renderHook(() => useInvestmentCalculator());
      act(() => {
        investmentResult.current.updateField('expectedReturn', expectedReturn);
      });

      // High interest debt should be prioritized
      expect(debtResult.current.result?.insights).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'warning',
            message: expect.stringContaining('refinancing')
          })
        ])
      );

      // Investment return expectations should be reasonable
      expect(investmentResult.current.result?.insights).toEqual(
        expect.arrayContaining([
          expect.not.objectContaining({
            type: 'warning',
            message: expect.stringContaining('Return assumption may be optimistic')
          })
        ])
      );
    });
  });

  describe('Tax Impact on Investment Returns', () => {
    it('should calculate after-tax returns consistently', () => {
      const income = 100000;
      const investmentReturn = 7;
      const taxRate = 25;

      // Tax Calculator
      const { result: taxResult } = renderHook(() => useTaxCalculator());
      act(() => {
        taxResult.current.updateField('income', income);
        taxResult.current.updateField('filingStatus', 'single');
      });

      // Investment Calculator
      const { result: investmentResult } = renderHook(() => useInvestmentCalculator());
      act(() => {
        investmentResult.current.updateField('expectedReturn', investmentReturn);
        investmentResult.current.updateField('taxRate', taxRate);
      });

      const effectiveTaxRate = taxResult.current.result?.effectiveTaxRate;
      const afterTaxReturn = investmentResult.current.result?.effectiveAnnualReturn;

      expect(afterTaxReturn).toBeLessThan(investmentReturn);
      expect(afterTaxReturn).toBeCloseTo(
        investmentReturn * (1 - effectiveTaxRate! / 100),
        1
      );
    });
  });

  describe('Risk Assessment Consistency', () => {
    it('should maintain consistent risk assessments across calculators', () => {
      // Investment Calculator
      const { result: investmentResult } = renderHook(() => useInvestmentCalculator());
      act(() => {
        investmentResult.current.updateField('riskTolerance', 'conservative');
        investmentResult.current.updateField('expectedReturn', 12); // High for conservative
      });

      // Retirement Calculator
      const { result: retirementResult } = renderHook(() => useRetirementCalculator());
      act(() => {
        retirementResult.current.updateField('riskTolerance', 'conservative');
        retirementResult.current.updateField('expectedReturn', 12); // High for conservative
      });

      // Both calculators should warn about high returns for conservative risk
      expect(investmentResult.current.result?.insights).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'warning',
            message: expect.stringContaining('Return')
          })
        ])
      );

      expect(retirementResult.current.result?.insights).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            type: 'warning',
            message: expect.stringContaining('Return')
          })
        ])
      );
    });
  });
});

