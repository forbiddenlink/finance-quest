import { renderHook, act } from '@testing-library/react';
import { useLoanCalculator } from '@/lib/hooks/calculators/examples/useLoanCalculator';
import {
  runCommonCalculatorTests,
  financialTestUtils,
  testCalculatorInsights,
  testAmortizationSchedule
} from '@/test/utils/calculatorTestUtils';

// Mock the progress store
jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: () => (calculatorId: string) => {}
}));

describe('useLoanCalculator', () => {
  // Run common calculator tests
  runCommonCalculatorTests({
    hook: useLoanCalculator,
    validInputs: {
      loanAmount: 300000,
      interestRate: 4.5,
      years: 30,
      monthlyIncome: 7500,
      downPayment: 60000,
      propertyValue: 375000,
      propertyTax: 3000,
      insurance: 1200
    },
    invalidInputs: {
      loanAmount: -100000,
      interestRate: -1,
      years: 0,
      monthlyIncome: 0,
      downPayment: -1000
    },
    expectedResults: {
      monthlyPayment: financialTestUtils.calculateMonthlyPayment(300000, 4.5, 30) + (3000 + 1200) / 12,
      loanToValue: 80,
      isPmiRequired: false,
      debtToIncome: 20.27
    },
    fieldValidations: {
      loanAmount: [
        { value: 300000, error: null },
        { value: -100000, error: 'Value must be positive' },
        { value: 0, error: 'Value must be positive' },
        { value: 1000000, error: null }
      ],
      interestRate: [
        { value: 4.5, error: null },
        { value: -1, error: 'Value must be between 0 and 100' },
        { value: 101, error: 'Value must be between 0 and 100' },
        { value: 0, error: 'Interest rate must be at least 0.1%' }
      ],
      years: [
        { value: 30, error: null },
        { value: 0, error: 'Value must be positive' },
        { value: 51, error: 'Value must be no more than 50' }
      ]
    }
  });

  describe('Loan-Specific Calculations', () => {
    it('should calculate PMI requirement correctly', () => {
      const { result } = renderHook(() => useLoanCalculator());

      // Test with 5% down payment
      act(() => {
        result.current.updateField('propertyValue', 400000);
        result.current.updateField('downPayment', 20000);
      });

      expect(result.current.result?.isPmiRequired).toBe(true);
      expect(result.current.result?.loanToValue).toBeCloseTo(95, 2);

      // Test with 20% down payment
      act(() => {
        result.current.updateField('downPayment', 80000);
      });

      expect(result.current.result?.isPmiRequired).toBe(false);
      expect(result.current.result?.loanToValue).toBeCloseTo(80, 2);
    });

    it('should calculate affordability correctly', () => {
      const { result } = renderHook(() => useLoanCalculator());

      // Test affordable scenario
      act(() => {
        result.current.updateField('loanAmount', 300000);
        result.current.updateField('monthlyIncome', 10000);
      });

      expect(result.current.result?.debtToIncome).toBeLessThan(43);
      expect(result.current.result?.isAffordable).toBe(true);

      // Test unaffordable scenario
      act(() => {
        result.current.updateField('monthlyIncome', 4000);
      });

      expect(result.current.result?.debtToIncome).toBeGreaterThan(43);
      expect(result.current.result?.isAffordable).toBe(false);
    });

    it('should calculate total costs correctly', () => {
      const { result } = renderHook(() => useLoanCalculator());

      const loanAmount = 300000;
      const years = 30;
      const rate = 4.5;

      act(() => {
        result.current.updateField('loanAmount', loanAmount);
        result.current.updateField('years', years);
        result.current.updateField('interestRate', rate);
      });

      const monthlyPI = financialTestUtils.calculateMonthlyPayment(loanAmount, rate, years);
      const totalPayments = monthlyPI * years * 12;
      const totalInterest = totalPayments - loanAmount;

      expect(result.current.result?.principalAndInterest).toBeCloseTo(monthlyPI, 2);
      expect(result.current.result?.totalInterest).toBeCloseTo(totalInterest, 2);
    });
  });

  describe('Amortization Schedule', () => {
    it('should generate accurate amortization schedule', () => {
      const { result } = renderHook(() => useLoanCalculator());

      const testParams = {
        loanAmount: 300000,
        annualRate: 4.5,
        years: 30
      };

      act(() => {
        result.current.updateField('loanAmount', testParams.loanAmount);
        result.current.updateField('interestRate', testParams.annualRate);
        result.current.updateField('years', testParams.years);
      });

      const monthlyPayment = financialTestUtils.calculateMonthlyPayment(
        testParams.loanAmount,
        testParams.annualRate,
        testParams.years
      );

      testAmortizationSchedule(
        result.current.result?.amortizationSchedule || [],
        {
          ...testParams,
          monthlyPayment,
          totalMonths: testParams.years * 12
        }
      );
    });
  });

  describe('Insights Generation', () => {
    it('should generate appropriate insights based on loan parameters', () => {
      const { result } = renderHook(() => useLoanCalculator());

      // Test high DTI scenario
      act(() => {
        result.current.updateField('loanAmount', 500000);
        result.current.updateField('monthlyIncome', 7500);
      });

      testCalculatorInsights(result.current.result?.insights || [], [
        {
          type: 'warning',
          messageIncludes: 'debt-to-income ratio exceeds 43%'
        }
      ]);

      // Test low down payment scenario
      act(() => {
        result.current.updateField('propertyValue', 400000);
        result.current.updateField('downPayment', 20000);
      });

      testCalculatorInsights(result.current.result?.insights || [], [
        {
          type: 'info',
          messageIncludes: 'PMI'
        }
      ]);

      // Test low rate scenario
      act(() => {
        result.current.updateField('interestRate', 2.75);
      });

      testCalculatorInsights(result.current.result?.insights || [], [
        {
          type: 'success',
          messageIncludes: 'historically low'
        }
      ]);
    });
  });
});