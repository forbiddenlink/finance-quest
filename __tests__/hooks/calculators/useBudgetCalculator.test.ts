import { renderHook, act } from '@testing-library/react';
import { useBudgetCalculator } from '@/lib/hooks/calculators/useBudgetCalculator';
import {
  runCommonCalculatorTests,
  testCalculatorInsights
} from '@/test/utils/calculatorTestUtils';
import { financialRatios } from '@/lib/utils/financialCalculations';

// Mock the progress store
jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: () => (calculatorId: string) => {}
}));

describe('useBudgetCalculator', () => {
  // Run common calculator tests
  runCommonCalculatorTests({
    hook: useBudgetCalculator,
    validInputs: {
      monthlyIncome: 5000,
      additionalIncome: 1000,
      savingsGoal: 20000,
      emergencyFundTarget: 15000,
      debtPayments: 500,
      taxRate: 25
    },
    invalidInputs: {
      monthlyIncome: -1000,
      additionalIncome: -500,
      savingsGoal: -5000,
      emergencyFundTarget: -1000,
      debtPayments: -200,
      taxRate: -10
    }
  });

  describe('Income Calculations', () => {
    it('should calculate total income correctly', () => {
      const { result } = renderHook(() => useBudgetCalculator());

      act(() => {
        result.current.updateField('monthlyIncome', 5000);
        result.current.updateField('additionalIncome', 1000);
      });

      expect(result.current.result?.totalIncome.monthly).toBe(6000);
      expect(result.current.result?.totalIncome.annual).toBe(72000);
    });

    it('should calculate after-tax income correctly', () => {
      const { result } = renderHook(() => useBudgetCalculator());

      act(() => {
        result.current.updateField('monthlyIncome', 5000);
        result.current.updateField('taxRate', 20);
        result.current.updateField('includeTaxes', true);
      });

      expect(result.current.result?.totalIncome.afterTax).toBe(4000); // 5000 * 0.8
    });
  });

  describe('Expense Categories', () => {
    it('should calculate category totals correctly', () => {
      const { result } = renderHook(() => useBudgetCalculator());

      const testCategories = [
        { name: 'Test1', amount: 1000, type: 'essential', frequency: 'monthly' },
        { name: 'Test2', amount: 12000, type: 'essential', frequency: 'annual' }
      ];

      act(() => {
        result.current.updateField('categories', testCategories);
      });

      expect(result.current.result?.expenses.essential.monthlyAmount).toBe(2000); // 1000 + (12000/12)
      expect(result.current.result?.expenses.essential.annualAmount).toBe(24000); // (1000 * 12) + 12000
    });

    it('should handle empty categories', () => {
      const { result } = renderHook(() => useBudgetCalculator());

      act(() => {
        result.current.updateField('categories', []);
      });

      expect(result.current.result?.expenses.total.monthlyAmount).toBe(0);
      expect(result.current.result?.expenses.total.annualAmount).toBe(0);
    });
  });

  describe('Financial Metrics', () => {
    it('should calculate savings rate correctly', () => {
      const { result } = renderHook(() => useBudgetCalculator());

      act(() => {
        result.current.updateField('monthlyIncome', 5000);
        result.current.updateField('categories', [
          { name: 'Savings', amount: 1000, type: 'savings', frequency: 'monthly' }
        ]);
      });

      expect(result.current.result?.metrics.savingsRate).toBe(20); // (1000 / 5000) * 100
    });

    it('should calculate debt-to-income ratio correctly', () => {
      const { result } = renderHook(() => useBudgetCalculator());

      act(() => {
        result.current.updateField('monthlyIncome', 5000);
        result.current.updateField('debtPayments', 1000);
      });

      expect(result.current.result?.metrics.debtToIncome).toBe(20); // (1000 / 5000) * 100
    });

    it('should calculate emergency fund months correctly', () => {
      const { result } = renderHook(() => useBudgetCalculator());

      act(() => {
        result.current.updateField('emergencyFundTarget', 15000);
        result.current.updateField('categories', [
          { name: 'Essential', amount: 3000, type: 'essential', frequency: 'monthly' }
        ]);
      });

      expect(result.current.result?.metrics.emergencyFundMonths).toBe(5); // 15000 / 3000
    });
  });

  describe('Cash Flow', () => {
    it('should calculate cash flow correctly', () => {
      const { result } = renderHook(() => useBudgetCalculator());

      act(() => {
        result.current.updateField('monthlyIncome', 5000);
        result.current.updateField('categories', [
          { name: 'Expense', amount: 3000, type: 'essential', frequency: 'monthly' }
        ]);
      });

      expect(result.current.result?.cashFlow.monthly).toBe(2000); // 5000 - 3000
      expect(result.current.result?.cashFlow.annual).toBe(24000); // 2000 * 12
    });

    it('should handle negative cash flow', () => {
      const { result } = renderHook(() => useBudgetCalculator());

      act(() => {
        result.current.updateField('monthlyIncome', 3000);
        result.current.updateField('categories', [
          { name: 'Expense', amount: 4000, type: 'essential', frequency: 'monthly' }
        ]);
      });

      expect(result.current.result?.cashFlow.monthly).toBeLessThan(0);
      testCalculatorInsights(result.current.result?.insights || [], [
        {
          type: 'warning',
          messageIncludes: 'Negative monthly cash flow'
        }
      ]);
    });
  });

  describe('Projections', () => {
    it('should generate 12-month projections', () => {
      const { result } = renderHook(() => useBudgetCalculator());

      act(() => {
        result.current.updateField('monthlyIncome', 5000);
        result.current.updateField('categories', [
          { name: 'Savings', amount: 1000, type: 'savings', frequency: 'monthly' }
        ]);
      });

      expect(result.current.result?.projections).toHaveLength(12);
      expect(result.current.result?.projections[11].savings).toBe(12000); // 1000 * 12
    });

    it('should prioritize emergency fund in projections', () => {
      const { result } = renderHook(() => useBudgetCalculator());

      act(() => {
        result.current.updateField('emergencyFundTarget', 10000);
        result.current.updateField('monthlyIncome', 5000);
        result.current.updateField('categories', [
          { name: 'Emergency', amount: 2000, type: 'savings', frequency: 'monthly' }
        ]);
      });

      const finalProjection = result.current.result?.projections[11];
      expect(finalProjection?.emergencyFund).toBe(10000); // Should be fully funded
    });
  });

  describe('Insights Generation', () => {
    it('should warn about low savings rate', () => {
      const { result } = renderHook(() => useBudgetCalculator());

      act(() => {
        result.current.updateField('monthlyIncome', 5000);
        result.current.updateField('categories', [
          { name: 'Savings', amount: 100, type: 'savings', frequency: 'monthly' }
        ]);
      });

      testCalculatorInsights(result.current.result?.insights || [], [
        {
          type: 'warning',
          messageIncludes: 'Savings rate'
        }
      ]);
    });

    it('should warn about high debt-to-income ratio', () => {
      const { result } = renderHook(() => useBudgetCalculator());

      act(() => {
        result.current.updateField('monthlyIncome', 5000);
        result.current.updateField('debtPayments', 2500); // 50% DTI
      });

      testCalculatorInsights(result.current.result?.insights || [], [
        {
          type: 'warning',
          messageIncludes: 'Debt-to-income ratio'
        }
      ]);
    });

    it('should warn about low emergency fund', () => {
      const { result } = renderHook(() => useBudgetCalculator());

      act(() => {
        result.current.updateField('emergencyFundTarget', 3000);
        result.current.updateField('categories', [
          { name: 'Essential', amount: 2000, type: 'essential', frequency: 'monthly' }
        ]);
      });

      testCalculatorInsights(result.current.result?.insights || [], [
        {
          type: 'warning',
          messageIncludes: 'Emergency fund'
        }
      ]);
    });

    it('should warn about high housing costs', () => {
      const { result } = renderHook(() => useBudgetCalculator());

      act(() => {
        result.current.updateField('monthlyIncome', 5000);
        result.current.updateField('categories', [
          { name: 'Housing', amount: 2000, type: 'essential', frequency: 'monthly' }
        ]);
      });

      testCalculatorInsights(result.current.result?.insights || [], [
        {
          type: 'warning',
          messageIncludes: 'Housing costs'
        }
      ]);
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero income', () => {
      const { result } = renderHook(() => useBudgetCalculator());

      act(() => {
        result.current.updateField('monthlyIncome', 0);
        result.current.updateField('additionalIncome', 0);
      });

      expect(result.current.result?.totalIncome.monthly).toBe(0);
      expect(result.current.result?.totalIncome.annual).toBe(0);
      expect(result.current.result?.metrics.savingsRate).toBe(0);
    });

    it('should handle very large numbers', () => {
      const { result } = renderHook(() => useBudgetCalculator());

      act(() => {
        result.current.updateField('monthlyIncome', 1000000);
        result.current.updateField('categories', [
          { name: 'Test', amount: 500000, type: 'essential', frequency: 'monthly' }
        ]);
      });

      expect(result.current.result?.totalIncome.annual).toBe(12000000);
      expect(result.current.result?.expenses.essential.annualAmount).toBe(6000000);
    });

    it('should handle all zeros in categories', () => {
      const { result } = renderHook(() => useBudgetCalculator());

      act(() => {
        result.current.updateField('categories', [
          { name: 'Test1', amount: 0, type: 'essential', frequency: 'monthly' },
          { name: 'Test2', amount: 0, type: 'discretionary', frequency: 'monthly' },
          { name: 'Test3', amount: 0, type: 'savings', frequency: 'monthly' }
        ]);
      });

      expect(result.current.result?.expenses.total.monthlyAmount).toBe(0);
      expect(result.current.result?.expenses.total.annualAmount).toBe(0);
    });
  });
});
