import { renderHook, act } from '@testing-library/react';
import { useRetirementCalculator } from '@/lib/hooks/calculators/useRetirementCalculator';
import {
  runCommonCalculatorTests,
  financialTestUtils,
  testCalculatorInsights
} from '@/test/utils/calculatorTestUtils';

// Mock the progress store
jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: () => (calculatorId: string) => {}
}));

describe('useRetirementCalculator', () => {
  // Run common calculator tests
  runCommonCalculatorTests({
    hook: useRetirementCalculator,
    validInputs: {
      currentAge: 30,
      retirementAge: 65,
      lifeExpectancy: 90,
      currentSavings: 50000,
      monthlyContribution: 1000,
      expectedReturn: 7,
      inflationRate: 2.5,
      desiredIncome: 80000,
      socialSecurityIncome: 24000,
      otherIncome: 0
    },
    invalidInputs: {
      currentAge: 15,
      retirementAge: 30,
      lifeExpectancy: 40,
      currentSavings: -1000,
      monthlyContribution: -100,
      expectedReturn: 20,
      inflationRate: 15,
      desiredIncome: 5000,
      socialSecurityIncome: -1000,
      otherIncome: -500
    },
    expectedResults: {
      yearsToRetirement: 35,
      retirementDuration: 25,
      savingsRate: 15,
      replacementRate: 100
    },
    fieldValidations: {
      currentAge: [
        { value: 30, error: null },
        { value: 15, error: 'Current age must be at least 18' },
        { value: 120, error: 'Current age cannot exceed 100' }
      ],
      retirementAge: [
        { value: 65, error: null },
        { value: 30, error: 'Retirement age must be at least 40' },
        { value: 25, error: 'Retirement age must be greater than current age' }
      ],
      expectedReturn: [
        { value: 7, error: null },
        { value: 0, error: 'Expected return must be at least 1%' },
        { value: 20, error: 'Expected return cannot exceed 15%' }
      ]
    }
  });

  describe('Retirement Calculations', () => {
    it('should calculate savings needed using 4% rule', () => {
      const { result } = renderHook(() => useRetirementCalculator());

      act(() => {
        result.current.updateField('desiredIncome', 100000);
        result.current.updateField('socialSecurityIncome', 24000);
        result.current.updateField('otherIncome', 0);
      });

      // Need 25x annual withdrawal rate
      const annualFromSavings = 100000 - 24000;
      const expectedSavingsNeeded = annualFromSavings * 25;

      expect(result.current.result?.totalSavingsNeeded).toBeCloseTo(expectedSavingsNeeded, -3);
    });

    it('should calculate inflation-adjusted income', () => {
      const { result } = renderHook(() => useRetirementCalculator());

      const testValues = {
        desiredIncome: 100000,
        inflationRate: 2.5,
        yearsToRetirement: 35
      };

      act(() => {
        result.current.updateField('desiredIncome', testValues.desiredIncome);
        result.current.updateField('inflationRate', testValues.inflationRate);
        result.current.updateField('currentAge', 30);
        result.current.updateField('retirementAge', 65);
      });

      const expectedInflatedIncome = testValues.desiredIncome * 
        Math.pow(1 + testValues.inflationRate / 100, testValues.yearsToRetirement);

      expect(result.current.result?.inflationAdjustedIncome).toBeCloseTo(expectedInflatedIncome, -3);
    });

    it('should project portfolio growth correctly', () => {
      const { result } = renderHook(() => useRetirementCalculator());

      const testValues = {
        currentSavings: 50000,
        monthlyContribution: 1000,
        expectedReturn: 7,
        yearsToRetirement: 35
      };

      act(() => {
        result.current.updateField('currentSavings', testValues.currentSavings);
        result.current.updateField('monthlyContribution', testValues.monthlyContribution);
        result.current.updateField('expectedReturn', testValues.expectedReturn);
        result.current.updateField('currentAge', 30);
        result.current.updateField('retirementAge', 65);
      });

      const portfolio = result.current.result?.projectedPortfolio;
      expect(portfolio).toBeDefined();
      expect(portfolio?.length).toBe(testValues.yearsToRetirement + 1);

      // Check first year
      const firstYear = portfolio?.[1];
      const yearlyContribution = testValues.monthlyContribution * 12;
      const yearlyReturn = testValues.currentSavings * (testValues.expectedReturn / 100);
      const expectedFirstYearTotal = testValues.currentSavings + yearlyContribution + yearlyReturn;

      expect(firstYear?.total).toBeCloseTo(expectedFirstYearTotal, -2);
    });

    it('should calculate required additional savings', () => {
      const { result } = renderHook(() => useRetirementCalculator());

      act(() => {
        result.current.updateField('currentSavings', 0);
        result.current.updateField('monthlyContribution', 500);
        result.current.updateField('desiredIncome', 100000);
        result.current.updateField('socialSecurityIncome', 24000);
      });

      expect(result.current.result?.savingsGap).toBeGreaterThan(0);
      expect(result.current.result?.requiredMonthlyContribution).toBeGreaterThan(500);
    });
  });

  describe('Insights Generation', () => {
    it('should warn about low savings rate', () => {
      const { result } = renderHook(() => useRetirementCalculator());

      act(() => {
        result.current.updateField('monthlyContribution', 500);
        result.current.updateField('desiredIncome', 100000);
      });

      testCalculatorInsights(result.current.result?.insights || [], [
        {
          type: 'warning',
          messageIncludes: 'savings rate'
        }
      ]);
    });

    it('should warn about optimistic returns', () => {
      const { result } = renderHook(() => useRetirementCalculator());

      act(() => {
        result.current.updateField('expectedReturn', 10);
      });

      testCalculatorInsights(result.current.result?.insights || [], [
        {
          type: 'warning',
          messageIncludes: 'optimistic'
        }
      ]);
    });

    it('should note long retirement duration', () => {
      const { result } = renderHook(() => useRetirementCalculator());

      act(() => {
        result.current.updateField('retirementAge', 55);
        result.current.updateField('lifeExpectancy', 95);
      });

      testCalculatorInsights(result.current.result?.insights || [], [
        {
          type: 'info',
          messageIncludes: 'long retirement'
        }
      ]);
    });

    it('should show success message when on track', () => {
      const { result } = renderHook(() => useRetirementCalculator());

      act(() => {
        result.current.updateField('currentSavings', 1000000);
        result.current.updateField('monthlyContribution', 5000);
        result.current.updateField('desiredIncome', 80000);
      });

      testCalculatorInsights(result.current.result?.insights || [], [
        {
          type: 'success',
          messageIncludes: 'on track'
        }
      ]);
    });
  });
});
