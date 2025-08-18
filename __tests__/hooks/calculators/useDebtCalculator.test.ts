import { renderHook, act } from '@testing-library/react';
import { useDebtCalculator } from '@/lib/hooks/calculators/useDebtCalculator';
import {
  runCommonCalculatorTests,
  testCalculatorInsights
} from '@/test/utils/calculatorTestUtils';
import { financialRatios } from '@/lib/utils/financialCalculations';

// Mock the progress store
jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: () => (calculatorId: string) => {}
}));

describe('useDebtCalculator', () => {
  // Run common calculator tests
  runCommonCalculatorTests({
    hook: useDebtCalculator,
    validInputs: {
      monthlyIncome: 5000,
      extraPayment: 200,
      monthlyExpenses: 3000,
      creditScore: 700,
      consolidationRate: 10
    },
    invalidInputs: {
      monthlyIncome: -1000,
      extraPayment: -100,
      monthlyExpenses: -500,
      creditScore: 200,
      consolidationRate: -5
    }
  });

  describe('Debt Calculations', () => {
    it('should calculate total debt and payments correctly', () => {
      const { result } = renderHook(() => useDebtCalculator());

      const testDebts = [
        {
          name: 'Test1',
          balance: 10000,
          interestRate: 5,
          minimumPayment: 200,
          type: 'personal_loan',
          isDeductible: false
        },
        {
          name: 'Test2',
          balance: 5000,
          interestRate: 15,
          minimumPayment: 150,
          type: 'credit_card',
          isDeductible: false
        }
      ];

      act(() => {
        result.current.updateField('debts', testDebts);
      });

      expect(result.current.result?.summary.totalDebt).toBe(15000);
      expect(result.current.result?.summary.totalMinimumPayment).toBe(350);
    });

    it('should calculate weighted average rate correctly', () => {
      const { result } = renderHook(() => useDebtCalculator());

      const testDebts = [
        {
          name: 'Test1',
          balance: 10000,
          interestRate: 5,
          minimumPayment: 200,
          type: 'personal_loan',
          isDeductible: false
        },
        {
          name: 'Test2',
          balance: 5000,
          interestRate: 15,
          minimumPayment: 150,
          type: 'credit_card',
          isDeductible: false
        }
      ];

      act(() => {
        result.current.updateField('debts', testDebts);
      });

      // (10000 * 5 + 5000 * 15) / 15000 = 8.33%
      expect(result.current.result?.summary.weightedAverageRate).toBeCloseTo(8.33, 1);
    });
  });

  describe('Payment Strategies', () => {
    it('should order debts correctly for avalanche strategy', () => {
      const { result } = renderHook(() => useDebtCalculator());

      const testDebts = [
        {
          name: 'LowRate',
          balance: 10000,
          interestRate: 5,
          minimumPayment: 200,
          type: 'personal_loan',
          isDeductible: false
        },
        {
          name: 'HighRate',
          balance: 5000,
          interestRate: 15,
          minimumPayment: 150,
          type: 'credit_card',
          isDeductible: false
        }
      ];

      act(() => {
        result.current.updateField('debts', testDebts);
        result.current.updateField('paymentStrategy', 'avalanche');
      });

      expect(result.current.result?.payoffStrategy.order[0]).toBe('HighRate');
    });

    it('should order debts correctly for snowball strategy', () => {
      const { result } = renderHook(() => useDebtCalculator());

      const testDebts = [
        {
          name: 'LargeDebt',
          balance: 10000,
          interestRate: 15,
          minimumPayment: 200,
          type: 'personal_loan',
          isDeductible: false
        },
        {
          name: 'SmallDebt',
          balance: 5000,
          interestRate: 5,
          minimumPayment: 150,
          type: 'credit_card',
          isDeductible: false
        }
      ];

      act(() => {
        result.current.updateField('debts', testDebts);
        result.current.updateField('paymentStrategy', 'snowball');
      });

      expect(result.current.result?.payoffStrategy.order[0]).toBe('SmallDebt');
    });

    it('should allocate extra payment to first debt in strategy', () => {
      const { result } = renderHook(() => useDebtCalculator());

      const testDebts = [
        {
          name: 'Test1',
          balance: 10000,
          interestRate: 5,
          minimumPayment: 200,
          type: 'personal_loan',
          isDeductible: false
        },
        {
          name: 'Test2',
          balance: 5000,
          interestRate: 15,
          minimumPayment: 150,
          type: 'credit_card',
          isDeductible: false
        }
      ];

      act(() => {
        result.current.updateField('debts', testDebts);
        result.current.updateField('extraPayment', 100);
      });

      const firstDebtAllocation = result.current.result?.payoffStrategy.monthlyAllocation[
        result.current.result.payoffStrategy.order[0]
      ];
      const secondDebtAllocation = result.current.result?.payoffStrategy.monthlyAllocation[
        result.current.result.payoffStrategy.order[1]
      ];

      expect(firstDebtAllocation).toBe(250); // minimum + extra
      expect(secondDebtAllocation).toBe(150); // minimum only
    });
  });

  describe('Consolidation Analysis', () => {
    it('should recommend consolidation when beneficial', () => {
      const { result } = renderHook(() => useDebtCalculator());

      const highInterestDebts = [
        {
          name: 'CC1',
          balance: 5000,
          interestRate: 20,
          minimumPayment: 150,
          type: 'credit_card',
          isDeductible: false
        },
        {
          name: 'CC2',
          balance: 5000,
          interestRate: 22,
          minimumPayment: 150,
          type: 'credit_card',
          isDeductible: false
        }
      ];

      act(() => {
        result.current.updateField('debts', highInterestDebts);
        result.current.updateField('consolidationRate', 10);
      });

      expect(result.current.result?.consolidation.isRecommended).toBe(true);
      expect(result.current.result?.consolidation.potentialSavings).toBeGreaterThan(0);
    });

    it('should not recommend consolidation when not beneficial', () => {
      const { result } = renderHook(() => useDebtCalculator());

      const lowInterestDebts = [
        {
          name: 'Loan1',
          balance: 5000,
          interestRate: 5,
          minimumPayment: 150,
          type: 'personal_loan',
          isDeductible: false
        },
        {
          name: 'Loan2',
          balance: 5000,
          interestRate: 6,
          minimumPayment: 150,
          type: 'personal_loan',
          isDeductible: false
        }
      ];

      act(() => {
        result.current.updateField('debts', lowInterestDebts);
        result.current.updateField('consolidationRate', 8);
      });

      expect(result.current.result?.consolidation.isRecommended).toBe(false);
    });
  });

  describe('Financial Metrics', () => {
    it('should calculate utilization rate correctly', () => {
      const { result } = renderHook(() => useDebtCalculator());

      const creditCardDebt = [
        {
          name: 'CC1',
          balance: 2500,
          interestRate: 15,
          minimumPayment: 75,
          type: 'credit_card',
          isDeductible: false
        }
      ];

      act(() => {
        result.current.updateField('debts', creditCardDebt);
      });

      // 2500 / (2500 + 5000) = 33.33%
      expect(result.current.result?.metrics.utilizationRate).toBeCloseTo(33.33, 1);
    });

    it('should calculate debt service ratio correctly', () => {
      const { result } = renderHook(() => useDebtCalculator());

      act(() => {
        result.current.updateField('monthlyIncome', 5000);
        result.current.updateField('debts', [
          {
            name: 'Test',
            balance: 10000,
            interestRate: 5,
            minimumPayment: 500,
            type: 'personal_loan',
            isDeductible: false
          }
        ]);
      });

      // 500 / 5000 = 10%
      expect(result.current.result?.metrics.debtServiceRatio).toBe(10);
    });
  });

  describe('Insights Generation', () => {
    it('should warn about high debt-to-income ratio', () => {
      const { result } = renderHook(() => useDebtCalculator());

      act(() => {
        result.current.updateField('monthlyIncome', 5000);
        result.current.updateField('debts', [
          {
            name: 'Test',
            balance: 10000,
            interestRate: 5,
            minimumPayment: 2500,
            type: 'personal_loan',
            isDeductible: false
          }
        ]);
      });

      testCalculatorInsights(result.current.result?.insights || [], [
        {
          type: 'warning',
          messageIncludes: 'Debt-to-income ratio'
        }
      ]);
    });

    it('should warn about high credit utilization', () => {
      const { result } = renderHook(() => useDebtCalculator());

      act(() => {
        result.current.updateField('debts', [
          {
            name: 'CC',
            balance: 4000,
            interestRate: 15,
            minimumPayment: 120,
            type: 'credit_card',
            isDeductible: false
          }
        ]);
      });

      testCalculatorInsights(result.current.result?.insights || [], [
        {
          type: 'warning',
          messageIncludes: 'credit utilization'
        }
      ]);
    });

    it('should suggest refinancing high interest debt', () => {
      const { result } = renderHook(() => useDebtCalculator());

      act(() => {
        result.current.updateField('debts', [
          {
            name: 'HighAPR',
            balance: 5000,
            interestRate: 25,
            minimumPayment: 150,
            type: 'credit_card',
            isDeductible: false
          }
        ]);
      });

      testCalculatorInsights(result.current.result?.insights || [], [
        {
          type: 'warning',
          messageIncludes: 'refinancing'
        }
      ]);
    });

    it('should highlight tax-deductible interest', () => {
      const { result } = renderHook(() => useDebtCalculator());

      act(() => {
        result.current.updateField('debts', [
          {
            name: 'Mortgage',
            balance: 200000,
            interestRate: 4,
            minimumPayment: 1000,
            type: 'mortgage',
            isDeductible: true
          }
        ]);
      });

      testCalculatorInsights(result.current.result?.insights || [], [
        {
          type: 'info',
          messageIncludes: 'tax-deductible interest'
        }
      ]);
    });
  });

  describe('Edge Cases', () => {
    it('should handle no debts', () => {
      const { result } = renderHook(() => useDebtCalculator());

      act(() => {
        result.current.updateField('debts', []);
      });

      expect(result.current.result?.summary.totalDebt).toBe(0);
      expect(result.current.result?.summary.totalMinimumPayment).toBe(0);
      expect(result.current.result?.summary.monthsToPayoff).toBe(0);
    });

    it('should handle very large debts', () => {
      const { result } = renderHook(() => useDebtCalculator());

      act(() => {
        result.current.updateField('debts', [
          {
            name: 'Large',
            balance: 1000000,
            interestRate: 5,
            minimumPayment: 5000,
            type: 'mortgage',
            isDeductible: true
          }
        ]);
      });

      expect(result.current.result?.summary.totalDebt).toBe(1000000);
      expect(result.current.result?.debtDetails.Large.schedule).toBeDefined();
    });

    it('should handle zero minimum payments', () => {
      const { result } = renderHook(() => useDebtCalculator());

      act(() => {
        result.current.updateField('debts', [
          {
            name: 'Test',
            balance: 1000,
            interestRate: 5,
            minimumPayment: 0,
            type: 'personal_loan',
            isDeductible: false
          }
        ]);
      });

      expect(result.current.result?.summary.monthsToPayoff).toBe(360); // Max months
    });
  });
});
