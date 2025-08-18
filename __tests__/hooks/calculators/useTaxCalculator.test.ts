import { renderHook, act } from '@testing-library/react';
import { useTaxCalculator } from '@/lib/hooks/calculators/useTaxCalculator';
import {
  runCommonCalculatorTests,
  financialTestUtils,
  testCalculatorInsights
} from '@/test/utils/calculatorTestUtils';

// Mock the progress store
jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: () => (calculatorId: string) => {}
}));

describe('useTaxCalculator', () => {
  // Run common calculator tests
  runCommonCalculatorTests({
    hook: useTaxCalculator,
    validInputs: {
      income: 75000,
      filingStatus: 'single',
      age: 30,
      dependents: 0,
      itemizedDeductions: 0,
      retirement401k: 5000,
      traditionalIRA: 2000,
      rothIRA: 2000,
      hsa: 2000,
      stateTaxRate: 5,
      selfEmployed: false,
      capitalGains: 1000,
      dividendIncome: 500,
      rentalIncome: 0,
      otherIncome: 0
    },
    invalidInputs: {
      income: -1000,
      age: -1,
      dependents: -1,
      itemizedDeductions: -500,
      retirement401k: -1000,
      traditionalIRA: -500,
      rothIRA: -500,
      hsa: -200,
      stateTaxRate: -5,
      capitalGains: -1000,
      dividendIncome: -500,
      rentalIncome: -1000,
      otherIncome: -100
    }
  });

  describe('Tax Calculations', () => {
    it('should calculate federal tax correctly for single filer', () => {
      const { result } = renderHook(() => useTaxCalculator());

      act(() => {
        result.current.updateField('income', 50000);
        result.current.updateField('filingStatus', 'single');
      });

      // Manual calculation for 2024 single brackets
      // First $11,600 @ 10% = $1,160
      // Next $35,550 ($47,150 - $11,600) @ 12% = $4,266
      // Remaining $2,850 @ 22% = $627
      // Total = $6,053
      expect(result.current.result?.federalTax).toBeCloseTo(6053, -1);
    });

    it('should handle standard vs itemized deductions correctly', () => {
      const { result } = renderHook(() => useTaxCalculator());

      // Test with itemized less than standard
      act(() => {
        result.current.updateField('income', 100000);
        result.current.updateField('itemizedDeductions', 10000);
      });

      const withLowerItemized = result.current.result?.taxableIncome;

      // Test with itemized more than standard
      act(() => {
        result.current.updateField('itemizedDeductions', 20000);
      });

      const withHigherItemized = result.current.result?.taxableIncome;

      expect(withHigherItemized).toBeLessThan(withLowerItemized);
    });

    it('should calculate self-employment tax correctly', () => {
      const { result } = renderHook(() => useTaxCalculator());

      act(() => {
        result.current.updateField('income', 100000);
        result.current.updateField('selfEmployed', true);
      });

      // Self-employment tax is 15.3% of income
      expect(result.current.result?.selfEmploymentTax).toBeCloseTo(15300, -1);
    });

    it('should enforce retirement contribution limits', () => {
      const { result } = renderHook(() => useTaxCalculator());

      // Test 401(k) limit
      act(() => {
        result.current.updateField('retirement401k', 25000); // Over limit
      });

      expect(result.current.errors).toContainEqual(
        expect.objectContaining({
          field: 'retirement401k'
        })
      );

      // Test combined IRA limit
      act(() => {
        result.current.updateField('traditionalIRA', 4000);
        result.current.updateField('rothIRA', 4000);
      });

      expect(result.current.errors).toContainEqual(
        expect.objectContaining({
          field: 'rothIRA'
        })
      );
    });

    it('should calculate HSA limits based on family status', () => {
      const { result } = renderHook(() => useTaxCalculator());

      // Test single limit
      act(() => {
        result.current.updateField('dependents', 0);
        result.current.updateField('hsa', 5000); // Over single limit
      });

      expect(result.current.errors).toContainEqual(
        expect.objectContaining({
          field: 'hsa'
        })
      );

      // Test family limit
      act(() => {
        result.current.updateField('dependents', 1);
        result.current.updateField('hsa', 7000); // Under family limit
      });

      expect(result.current.errors).not.toContainEqual(
        expect.objectContaining({
          field: 'hsa'
        })
      );
    });
  });

  describe('Tax Insights', () => {
    it('should suggest increasing retirement contributions', () => {
      const { result } = renderHook(() => useTaxCalculator());

      act(() => {
        result.current.updateField('income', 100000);
        result.current.updateField('retirement401k', 5000);
        result.current.updateField('traditionalIRA', 0);
        result.current.updateField('rothIRA', 0);
      });

      testCalculatorInsights(result.current.result?.insights || [], [
        {
          type: 'info',
          messageIncludes: 'increasing retirement contributions'
        }
      ]);
    });

    it('should suggest HSA contributions', () => {
      const { result } = renderHook(() => useTaxCalculator());

      act(() => {
        result.current.updateField('hsa', 0);
      });

      testCalculatorInsights(result.current.result?.insights || [], [
        {
          type: 'info',
          messageIncludes: 'HSA'
        }
      ]);
    });

    it('should warn about quarterly payments for self-employed', () => {
      const { result } = renderHook(() => useTaxCalculator());

      act(() => {
        result.current.updateField('selfEmployed', true);
      });

      testCalculatorInsights(result.current.result?.insights || [], [
        {
          type: 'warning',
          messageIncludes: 'quarterly estimated tax payments'
        }
      ]);
    });

    it('should provide next tax bracket information', () => {
      const { result } = renderHook(() => useTaxCalculator());

      act(() => {
        result.current.updateField('income', 45000);
        result.current.updateField('filingStatus', 'single');
      });

      testCalculatorInsights(result.current.result?.insights || [], [
        {
          type: 'info',
          messageIncludes: 'next tax bracket'
        }
      ]);
    });

    it('should suggest standard deduction when beneficial', () => {
      const { result } = renderHook(() => useTaxCalculator());

      act(() => {
        result.current.updateField('itemizedDeductions', 10000); // Less than standard deduction
      });

      testCalculatorInsights(result.current.result?.insights || [], [
        {
          type: 'info',
          messageIncludes: 'Standard deduction provides more'
        }
      ]);
    });
  });

  describe('Edge Cases', () => {
    it('should handle zero income correctly', () => {
      const { result } = renderHook(() => useTaxCalculator());

      act(() => {
        result.current.updateField('income', 0);
      });

      expect(result.current.result?.totalTax).toBe(0);
      expect(result.current.result?.takeHomePay).toBe(0);
    });

    it('should handle very high income correctly', () => {
      const { result } = renderHook(() => useTaxCalculator());

      act(() => {
        result.current.updateField('income', 1000000);
      });

      expect(result.current.result?.marginalTaxRate).toBe(37);
    });

    it('should handle all income types', () => {
      const { result } = renderHook(() => useTaxCalculator());

      act(() => {
        result.current.updateField('income', 50000);
        result.current.updateField('capitalGains', 10000);
        result.current.updateField('dividendIncome', 5000);
        result.current.updateField('rentalIncome', 15000);
        result.current.updateField('otherIncome', 2000);
      });

      const totalIncome = 50000 + 10000 + 5000 + 15000 + 2000;
      expect(result.current.result?.taxableIncome).toBeCloseTo(
        totalIncome - result.current.result?.deductions.total,
        -1
      );
    });
  });
});
