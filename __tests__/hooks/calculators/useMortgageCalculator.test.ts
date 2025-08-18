import { renderHook, act } from '@testing-library/react';
import { useMortgageCalculator } from '@/lib/hooks/calculators/useMortgageCalculator';
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

describe('useMortgageCalculator', () => {
  // Run common calculator tests
  runCommonCalculatorTests({
    hook: useMortgageCalculator,
    validInputs: {
      homePrice: 300000,
      downPayment: 60000,
      interestRate: 4.5,
      loanTerm: 30,
      propertyTax: 3000,
      homeInsurance: 1200,
      pmi: 0.5,
      hoa: 0,
      monthlyIncome: 7500,
      otherDebt: 500
    },
    invalidInputs: {
      homePrice: 25000,
      downPayment: -1000,
      interestRate: -1,
      loanTerm: 2,
      propertyTax: -100,
      homeInsurance: -50,
      pmi: 10,
      hoa: -25,
      monthlyIncome: 500,
      otherDebt: -100
    },
    expectedResults: {
      loanAmount: 240000,
      downPaymentPercent: 20,
      loanToValue: 80,
      isAffordable: true
    },
    fieldValidations: {
      homePrice: [
        { value: 300000, error: null },
        { value: 25000, error: 'Home price must be at least $50,000' },
        { value: 0, error: 'Value must be positive' }
      ],
      downPayment: [
        { value: 60000, error: null },
        { value: -1000, error: 'Value must be greater than or equal to 0' },
        { value: 350000, error: 'Down payment cannot exceed home price' }
      ],
      interestRate: [
        { value: 4.5, error: null },
        { value: 0, error: 'Interest rate must be at least 0.1%' },
        { value: 30, error: 'Interest rate cannot exceed 25%' }
      ]
    }
  });

  describe('Mortgage Payment Calculations', () => {
    it('should calculate monthly principal and interest correctly', () => {
      const { result } = renderHook(() => useMortgageCalculator());

      const testValues = {
        homePrice: 300000,
        downPayment: 60000,
        interestRate: 4.5,
        loanTerm: 30
      };

      act(() => {
        result.current.updateField('homePrice', testValues.homePrice);
        result.current.updateField('downPayment', testValues.downPayment);
        result.current.updateField('interestRate', testValues.interestRate);
        result.current.updateField('loanTerm', testValues.loanTerm);
      });

      const loanAmount = testValues.homePrice - testValues.downPayment;
      const expectedPayment = financialTestUtils.calculateMonthlyPayment(
        loanAmount,
        testValues.interestRate,
        testValues.loanTerm
      );

      expect(result.current.result?.monthlyPrincipalAndInterest).toBeCloseTo(expectedPayment, 2);
    });

    it('should calculate total monthly payment with escrows', () => {
      const { result } = renderHook(() => useMortgageCalculator());

      act(() => {
        result.current.updateField('propertyTax', 3600); // $300/month
        result.current.updateField('homeInsurance', 1200); // $100/month
        result.current.updateField('hoa', 200); // $200/month
      });

      const basePayment = result.current.result?.monthlyPrincipalAndInterest || 0;
      const expectedTotal = basePayment + 300 + 100 + 200;

      expect(result.current.result?.totalMonthlyPayment).toBeCloseTo(expectedTotal, 2);
    });

    it('should calculate PMI when down payment is less than 20%', () => {
      const { result } = renderHook(() => useMortgageCalculator());

      act(() => {
        result.current.updateField('homePrice', 300000);
        result.current.updateField('downPayment', 30000); // 10% down
        result.current.updateField('pmi', 0.5); // 0.5% annual PMI
      });

      const loanAmount = 270000; // 90% of home price
      const expectedMonthlyPMI = (loanAmount * 0.005) / 12;

      expect(result.current.result?.monthlyPMI).toBeCloseTo(expectedMonthlyPMI, 2);
    });

    it('should not include PMI when down payment is 20% or more', () => {
      const { result } = renderHook(() => useMortgageCalculator());

      act(() => {
        result.current.updateField('homePrice', 300000);
        result.current.updateField('downPayment', 60000); // 20% down
        result.current.updateField('pmi', 0.5);
      });

      expect(result.current.result?.monthlyPMI).toBe(0);
    });
  });

  describe('Affordability Calculations', () => {
    it('should calculate payment-to-income ratio', () => {
      const { result } = renderHook(() => useMortgageCalculator());

      act(() => {
        result.current.updateField('monthlyIncome', 10000);
      });

      const monthlyPayment = result.current.result?.totalMonthlyPayment || 0;
      const expectedRatio = (monthlyPayment / 10000) * 100;

      expect(result.current.result?.totalPaymentToIncome).toBeCloseTo(expectedRatio, 2);
    });

    it('should calculate debt-to-income ratio', () => {
      const { result } = renderHook(() => useMortgageCalculator());

      act(() => {
        result.current.updateField('monthlyIncome', 10000);
        result.current.updateField('otherDebt', 1000);
      });

      const totalDebt = (result.current.result?.totalMonthlyPayment || 0) + 1000;
      const expectedRatio = (totalDebt / 10000) * 100;

      expect(result.current.result?.debtToIncome).toBeCloseTo(expectedRatio, 2);
    });

    it('should determine affordability based on DTI', () => {
      const { result } = renderHook(() => useMortgageCalculator());

      // Test affordable scenario
      act(() => {
        result.current.updateField('monthlyIncome', 15000);
        result.current.updateField('otherDebt', 500);
      });

      expect(result.current.result?.isAffordable).toBe(true);

      // Test unaffordable scenario
      act(() => {
        result.current.updateField('monthlyIncome', 5000);
        result.current.updateField('otherDebt', 1500);
      });

      expect(result.current.result?.isAffordable).toBe(false);
    });
  });

  describe('Amortization Schedule', () => {
    it('should generate accurate amortization schedule', () => {
      const { result } = renderHook(() => useMortgageCalculator());

      const testParams = {
        loanAmount: 240000, // $300k home with 20% down
        annualRate: 4.5,
        years: 30
      };

      act(() => {
        result.current.updateField('homePrice', 300000);
        result.current.updateField('downPayment', 60000);
        result.current.updateField('interestRate', testParams.annualRate);
        result.current.updateField('loanTerm', testParams.years);
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

    it('should calculate total interest correctly', () => {
      const { result } = renderHook(() => useMortgageCalculator());

      act(() => {
        result.current.updateField('homePrice', 300000);
        result.current.updateField('downPayment', 60000);
        result.current.updateField('interestRate', 4.5);
        result.current.updateField('loanTerm', 30);
      });

      const schedule = result.current.result?.amortizationSchedule || [];
      const lastEntry = schedule[schedule.length - 1];

      expect(result.current.result?.totalInterest).toBeCloseTo(lastEntry.totalInterest, 2);
    });
  });

  describe('Insights Generation', () => {
    it('should warn about PMI requirement', () => {
      const { result } = renderHook(() => useMortgageCalculator());

      act(() => {
        result.current.updateField('homePrice', 300000);
        result.current.updateField('downPayment', 30000); // 10% down
      });

      testCalculatorInsights(result.current.result?.insights || [], [
        {
          type: 'warning',
          messageIncludes: 'PMI'
        }
      ]);
    });

    it('should warn about high DTI', () => {
      const { result } = renderHook(() => useMortgageCalculator());

      act(() => {
        result.current.updateField('monthlyIncome', 5000);
        result.current.updateField('otherDebt', 1500);
      });

      testCalculatorInsights(result.current.result?.insights || [], [
        {
          type: 'warning',
          messageIncludes: 'debt-to-income ratio exceeds 43%'
        }
      ]);
    });

    it('should note high housing payment ratio', () => {
      const { result } = renderHook(() => useMortgageCalculator());

      act(() => {
        result.current.updateField('monthlyIncome', 5000);
      });

      testCalculatorInsights(result.current.result?.insights || [], [
        {
          type: 'info',
          messageIncludes: 'exceeds 28% of income'
        }
      ]);
    });

    it('should highlight low interest rate', () => {
      const { result } = renderHook(() => useMortgageCalculator());

      act(() => {
        result.current.updateField('interestRate', 3.5);
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
