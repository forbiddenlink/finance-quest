import { renderHook, act } from '@testing-library/react';
import { usePropertyInvestment } from '@/lib/hooks/calculators/usePropertyInvestment';
import { runCommonCalculatorTests } from '@/lib/utils/calculatorTestUtils';

// Mock progressStore
jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: () => (calculatorId: string) => {}
}));

describe('usePropertyInvestment', () => {
  // Run common calculator tests
  runCommonCalculatorTests({
    hook: usePropertyInvestment,
    validInputs: {
      purchasePrice: 300000,
      downPaymentPercent: 20,
      interestRate: 7.0,
      loanTerm: 30,
      closingCosts: 8000,
      rehabCosts: 0,
      monthlyRent: 2500,
      vacancyRate: 5,
      otherIncome: 0,
      propertyTaxes: 3600,
      insurance: 1200,
      maintenance: 1800,
      propertyManagement: 0,
      utilities: 0,
      hoaFees: 0,
      otherExpenses: 600,
      rentGrowthRate: 3.0,
      propertyAppreciationRate: 3.5,
      expenseGrowthRate: 2.5
    },
    invalidInputs: {
      purchasePrice: -300000,
      downPaymentPercent: -20,
      interestRate: -7.0,
      loanTerm: 0,
      closingCosts: -8000,
      rehabCosts: -5000,
      monthlyRent: -2500,
      vacancyRate: -5,
      otherIncome: -100,
      propertyTaxes: -3600,
      insurance: -1200,
      maintenance: -1800,
      propertyManagement: -500,
      utilities: -200,
      hoaFees: -300,
      otherExpenses: -600,
      rentGrowthRate: -3.0,
      propertyAppreciationRate: -3.5,
      expenseGrowthRate: -2.5
    },
    expectedResults: {
      loanAmount: 240000,
      downPayment: 60000,
      totalInvestment: 68000,
      effectiveGrossIncome: 2375,
      capRate: 6.5
    },
    fieldValidations: {
      purchasePrice: [
        { value: 300000, error: null },
        { value: 25000, error: 'Value must be at least 50000' },
        { value: 15000000, error: 'Value must be no more than 10000000' }
      ],
      downPaymentPercent: [
        { value: 20, error: null },
        { value: -5, error: 'Value must be between 0 and 100' },
        { value: 120, error: 'Value must be between 0 and 100' }
      ],
      interestRate: [
        { value: 7.0, error: null },
        { value: -1, error: 'Value must be between 0 and 20' },
        { value: 25, error: 'Value must be no more than 20' }
      ]
    }
  });

  describe('Loan Calculations', () => {
    it('should calculate loan details correctly', () => {
      const { result } = renderHook(() => usePropertyInvestment());
      
      act(() => {
        result.current[1].setValues({
          purchasePrice: 300000,
          downPaymentPercent: 20,
          interestRate: 7.0,
          loanTerm: 30,
          closingCosts: 8000,
          rehabCosts: 0
        });
      });

      expect(result.current[0].result?.loanAmount).toBe(240000);
      expect(result.current[0].result?.downPayment).toBe(60000);
      expect(result.current[0].result?.totalInvestment).toBe(68000);
      expect(result.current[0].result?.monthlyMortgage).toBeCloseTo(1596.71, 2);
    });
  });

  describe('Income Analysis', () => {
    it('should calculate income metrics correctly', () => {
      const { result } = renderHook(() => usePropertyInvestment());
      
      act(() => {
        result.current[1].setValues({
          monthlyRent: 2500,
          vacancyRate: 5,
          otherIncome: 100,
          propertyTaxes: 3600,
          insurance: 1200,
          maintenance: 1800,
          propertyManagement: 0,
          utilities: 0,
          hoaFees: 0,
          otherExpenses: 600
        });
      });

      const expectedGrossIncome = 2600; // 2500 + 100
      const expectedEffectiveIncome = 2470; // 2600 * 0.95
      const expectedMonthlyExpenses = 600; // (3600 + 1200 + 1800 + 600) / 12
      
      expect(result.current[0].result?.effectiveGrossIncome).toBeCloseTo(expectedEffectiveIncome, 2);
      expect(result.current[0].result?.totalOperatingExpenses).toBeCloseTo(expectedMonthlyExpenses, 2);
    });
  });

  describe('Investment Metrics', () => {
    it('should calculate investment metrics correctly', () => {
      const { result } = renderHook(() => usePropertyInvestment());
      
      act(() => {
        result.current[1].setValues({
          purchasePrice: 300000,
          downPaymentPercent: 20,
          monthlyRent: 2500,
          vacancyRate: 5,
          propertyTaxes: 3600,
          insurance: 1200,
          maintenance: 1800,
          otherExpenses: 600,
          propertyAppreciationRate: 3.5
        });
      });

      expect(result.current[0].result?.capRate).toBeGreaterThan(0);
      expect(result.current[0].result?.cashOnCashReturn).toBeGreaterThan(0);
      expect(result.current[0].result?.returnOnInvestment).toBeGreaterThan(0);
    });
  });

  describe('Risk Analysis', () => {
    it('should calculate risk metrics correctly', () => {
      const { result } = renderHook(() => usePropertyInvestment());
      
      act(() => {
        result.current[1].setValues({
          purchasePrice: 300000,
          monthlyRent: 2500,
          propertyTaxes: 3600,
          insurance: 1200,
          maintenance: 1800,
          otherExpenses: 600
        });
      });

      expect(result.current[0].result?.debtServiceCoverageRatio).toBeGreaterThan(0);
      expect(result.current[0].result?.operatingExpenseRatio).toBeGreaterThan(0);
      expect(result.current[0].result?.priceToRentRatio).toBeCloseTo(10, 1); // 300000 / (2500 * 12)
    });

    it('should generate appropriate warnings', () => {
      const { result } = renderHook(() => usePropertyInvestment());
      
      // Test low DSCR warning
      act(() => {
        result.current[1].setValues({
          monthlyRent: 2000,
          propertyTaxes: 4800,
          insurance: 1800,
          maintenance: 2400
        });
      });

      expect(result.current[0].result?.insights).toContainEqual(
        expect.objectContaining({
          type: 'warning',
          message: expect.stringContaining('debt service coverage ratio')
        })
      );

      // Test high price-to-rent ratio warning
      act(() => {
        result.current[1].setValues({
          purchasePrice: 500000,
          monthlyRent: 2000
        });
      });

      expect(result.current[0].result?.insights).toContainEqual(
        expect.objectContaining({
          type: 'warning',
          message: expect.stringContaining('price-to-rent ratio')
        })
      );
    });
  });

  describe('Projections', () => {
    it('should calculate five-year projections correctly', () => {
      const { result } = renderHook(() => usePropertyInvestment());
      
      act(() => {
        result.current[1].setValues({
          purchasePrice: 300000,
          monthlyRent: 2500,
          propertyAppreciationRate: 3.5,
          rentGrowthRate: 3.0,
          expenseGrowthRate: 2.5
        });
      });

      const projections = result.current[0].result?.fiveYearProjections;
      expect(projections).toHaveLength(5);

      // Test first year
      expect(projections?.[0].propertyValue).toBeCloseTo(310500, 0); // 300000 * 1.035
      expect(projections?.[0].year).toBe(1);

      // Test fifth year (compound growth)
      const year5PropertyValue = 300000 * Math.pow(1.035, 5);
      expect(projections?.[4].propertyValue).toBeCloseTo(year5PropertyValue, 0);
      expect(projections?.[4].year).toBe(5);

      // Verify increasing trends
      for (let i = 1; i < 5; i++) {
        expect(projections?.[i].propertyValue).toBeGreaterThan(projections?.[i-1].propertyValue || 0);
        expect(projections?.[i].equity).toBeGreaterThan(projections?.[i-1].equity || 0);
      }
    });
  });
});

