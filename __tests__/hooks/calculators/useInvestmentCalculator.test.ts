import { renderHook, act } from '@testing-library/react';
import { useInvestmentCalculator } from '@/lib/hooks/calculators/useInvestmentCalculator';
import {
  runCommonCalculatorTests,
  financialTestUtils,
  testCalculatorInsights
} from '@/test/utils/calculatorTestUtils';
import { financialRatios } from '@/lib/utils/financialCalculations';

// Mock the progress store
jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: () => (calculatorId: string) => {}
}));

describe('useInvestmentCalculator', () => {
  // Run common calculator tests
  runCommonCalculatorTests({
    hook: useInvestmentCalculator,
    validInputs: {
      initialInvestment: 10000,
      monthlyContribution: 500,
      expectedReturn: 7,
      years: 10,
      riskTolerance: 'moderate',
      inflationRate: 2.5,
      fees: 0.5,
      taxRate: 25,
      reinvestDividends: true,
      dividendYield: 2
    },
    invalidInputs: {
      initialInvestment: -1000,
      monthlyContribution: -100,
      expectedReturn: -5,
      years: 0,
      inflationRate: -1,
      fees: -0.5,
      taxRate: -10,
      dividendYield: -2
    },
    expectedResults: {
      riskScore: 50,
      effectiveAnnualReturn: 7
    },
    fieldValidations: {
      expectedReturn: [
        { value: 7, error: null },
        { value: 15, error: 'Return expectation too high for selected risk tolerance' },
        { value: -1, error: 'Value must be between 0 and 100' }
      ],
      fees: [
        { value: 0.5, error: null },
        { value: 2, error: `Value must be no more than ${financialRatios.maxExpenseRatio}` }
      ]
    }
  });

  describe('Investment Calculations', () => {
    it('should calculate future value correctly', () => {
      const { result } = renderHook(() => useInvestmentCalculator());

      const testValues = {
        initialInvestment: 10000,
        monthlyContribution: 500,
        expectedReturn: 7,
        years: 10
      };

      act(() => {
        result.current.updateField('initialInvestment', testValues.initialInvestment);
        result.current.updateField('monthlyContribution', testValues.monthlyContribution);
        result.current.updateField('expectedReturn', testValues.expectedReturn);
        result.current.updateField('years', testValues.years);
      });

      const expectedFutureValue = financialTestUtils.calculateFutureValue(
        testValues.initialInvestment,
        testValues.expectedReturn,
        testValues.years,
        testValues.monthlyContribution
      );

      expect(result.current.result?.futureValue).toBeCloseTo(expectedFutureValue, -2);
    });

    it('should calculate inflation-adjusted value correctly', () => {
      const { result } = renderHook(() => useInvestmentCalculator());

      act(() => {
        result.current.updateField('initialInvestment', 10000);
        result.current.updateField('expectedReturn', 7);
        result.current.updateField('inflationRate', 2);
        result.current.updateField('years', 10);
      });

      const realReturn = 7 - 2; // Expected return - inflation
      const expectedRealValue = financialTestUtils.calculateFutureValue(
        10000,
        realReturn,
        10
      );

      expect(result.current.result?.inflationAdjustedValue).toBeCloseTo(expectedRealValue, -2);
    });

    it('should calculate total fees correctly', () => {
      const { result } = renderHook(() => useInvestmentCalculator());

      act(() => {
        result.current.updateField('initialInvestment', 100000);
        result.current.updateField('fees', 1);
        result.current.updateField('years', 1);
      });

      // Approximate fee calculation (1% of average balance)
      const expectedFees = 1000; // 1% of 100,000
      expect(result.current.result?.totalFees).toBeCloseTo(expectedFees, -2);
    });

    it('should handle dividend reinvestment correctly', () => {
      const { result } = renderHook(() => useInvestmentCalculator());

      // Test with reinvestment
      act(() => {
        result.current.updateField('initialInvestment', 100000);
        result.current.updateField('dividendYield', 3);
        result.current.updateField('reinvestDividends', true);
      });

      const withReinvestment = result.current.result?.futureValue;

      // Test without reinvestment
      act(() => {
        result.current.updateField('reinvestDividends', false);
      });

      const withoutReinvestment = result.current.result?.futureValue;

      expect(withReinvestment).toBeGreaterThan(withoutReinvestment);
    });
  });

  describe('Risk Assessment', () => {
    it('should assign correct risk scores', () => {
      const { result } = renderHook(() => useInvestmentCalculator());

      // Test conservative
      act(() => {
        result.current.updateField('riskTolerance', 'conservative');
      });
      expect(result.current.result?.riskScore).toBe(25);

      // Test moderate
      act(() => {
        result.current.updateField('riskTolerance', 'moderate');
      });
      expect(result.current.result?.riskScore).toBe(50);

      // Test aggressive
      act(() => {
        result.current.updateField('riskTolerance', 'aggressive');
      });
      expect(result.current.result?.riskScore).toBe(75);
    });

    it('should validate return expectations against risk tolerance', () => {
      const { result } = renderHook(() => useInvestmentCalculator());

      // Test conservative limits
      act(() => {
        result.current.updateField('riskTolerance', 'conservative');
        result.current.updateField('expectedReturn', financialRatios.conservativeReturn + 1);
      });
      expect(result.current.errors).toContainEqual(
        expect.objectContaining({
          field: 'expectedReturn',
          message: expect.stringContaining('too high for selected risk tolerance')
        })
      );

      // Test aggressive limits
      act(() => {
        result.current.updateField('riskTolerance', 'aggressive');
        result.current.updateField('expectedReturn', financialRatios.aggressiveReturn - 1);
      });
      expect(result.current.errors).not.toContainEqual(
        expect.objectContaining({
          field: 'expectedReturn'
        })
      );
    });
  });

  describe('Insights Generation', () => {
    it('should warn about high fees', () => {
      const { result } = renderHook(() => useInvestmentCalculator());

      act(() => {
        result.current.updateField('fees', 1.5);
      });

      testCalculatorInsights(result.current.result?.insights || [], [
        {
          type: 'warning',
          messageIncludes: 'High fees'
        }
      ]);
    });

    it('should suggest dividend reinvestment', () => {
      const { result } = renderHook(() => useInvestmentCalculator());

      act(() => {
        result.current.updateField('reinvestDividends', false);
      });

      testCalculatorInsights(result.current.result?.insights || [], [
        {
          type: 'info',
          messageIncludes: 'Reinvesting dividends'
        }
      ]);
    });

    it('should suggest more aggressive allocation for long term', () => {
      const { result } = renderHook(() => useInvestmentCalculator());

      act(() => {
        result.current.updateField('riskTolerance', 'conservative');
        result.current.updateField('years', 20);
      });

      testCalculatorInsights(result.current.result?.insights || [], [
        {
          type: 'info',
          messageIncludes: 'more aggressive allocation'
        }
      ]);
    });

    it('should warn about negative real returns', () => {
      const { result } = renderHook(() => useInvestmentCalculator());

      act(() => {
        result.current.updateField('expectedReturn', 4);
        result.current.updateField('inflationRate', 3);
        result.current.updateField('fees', 1.5);
      });

      testCalculatorInsights(result.current.result?.insights || [], [
        {
          type: 'warning',
          messageIncludes: 'keep pace with inflation'
        }
      ]);
    });
  });
});
