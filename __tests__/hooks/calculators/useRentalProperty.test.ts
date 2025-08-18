import { renderHook, act } from '@testing-library/react';
import { useRentalProperty } from '@/lib/hooks/calculators/useRentalProperty';
import { runCommonCalculatorTests } from '@/lib/utils/calculatorTestUtils';

// Mock progressStore
jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: () => (calculatorId: string) => {}
}));

describe('useRentalProperty', () => {
  // Run common calculator tests
  runCommonCalculatorTests({
    hook: useRentalProperty,
    validInputs: {
      propertyValue: 350000,
      monthlyRent: 2800,
      parkingFees: 100,
      storageFees: 50,
      laundryIncome: 0,
      mortgage: 1800,
      propertyTaxes: 400,
      insurance: 150,
      maintenance: 200,
      utilities: 80,
      propertyManagement: 280,
      advertising: 50,
      legal: 30,
      accounting: 25,
      hoaFees: 0,
      capitalExpenditures: 150,
      otherExpenses: 50,
      vacancyRate: 6,
      turnoverRate: 20,
      downPayment: 70000,
      closingCosts: 8000,
      initialRepairs: 5000
    },
    invalidInputs: {
      propertyValue: -350000,
      monthlyRent: -2800,
      parkingFees: -100,
      storageFees: -50,
      laundryIncome: -100,
      mortgage: -1800,
      propertyTaxes: -400,
      insurance: -150,
      maintenance: -200,
      utilities: -80,
      propertyManagement: -280,
      advertising: -50,
      legal: -30,
      accounting: -25,
      hoaFees: -100,
      capitalExpenditures: -150,
      otherExpenses: -50,
      vacancyRate: -6,
      turnoverRate: -20,
      downPayment: -70000,
      closingCosts: -8000,
      initialRepairs: -5000
    },
    expectedResults: {
      grossRentalIncome: 2950,
      effectiveGrossIncome: 2773,
      totalOperatingExpenses: 1415,
      netOperatingIncome: 1358,
      cashFlow: -442
    },
    fieldValidations: {
      propertyValue: [
        { value: 350000, error: null },
        { value: 25000, error: 'Value must be at least 50000' },
        { value: 15000000, error: 'Value must be no more than 10000000' }
      ],
      monthlyRent: [
        { value: 2800, error: null },
        { value: 50, error: 'Value must be at least 100' },
        { value: 150000, error: 'Value must be no more than 100000' }
      ],
      vacancyRate: [
        { value: 6, error: null },
        { value: -1, error: 'Value must be between 0 and 100' },
        { value: 120, error: 'Value must be between 0 and 100' }
      ]
    }
  });

  describe('Income Calculations', () => {
    it('should calculate gross rental income correctly', () => {
      const { result } = renderHook(() => useRentalProperty());
      
      act(() => {
        result.current[1].setValues({
          monthlyRent: 3000,
          parkingFees: 150,
          storageFees: 75,
          laundryIncome: 50
        });
      });

      expect(result.current[0].result?.grossRentalIncome).toBe(3275);
    });

    it('should calculate vacancy loss correctly', () => {
      const { result } = renderHook(() => useRentalProperty());
      
      act(() => {
        result.current[1].setValues({
          monthlyRent: 3000,
          parkingFees: 0,
          storageFees: 0,
          laundryIncome: 0,
          vacancyRate: 10
        });
      });

      expect(result.current[0].result?.vacancyLoss).toBe(300);
      expect(result.current[0].result?.effectiveGrossIncome).toBe(2700);
    });
  });

  describe('Expense Calculations', () => {
    it('should calculate operating expenses correctly', () => {
      const { result } = renderHook(() => useRentalProperty());
      
      const expenses = {
        propertyTaxes: 500,
        insurance: 200,
        maintenance: 250,
        utilities: 100,
        propertyManagement: 300,
        advertising: 50,
        legal: 40,
        accounting: 30,
        hoaFees: 150,
        capitalExpenditures: 200,
        otherExpenses: 75
      };

      act(() => {
        result.current[1].setValues(expenses);
      });

      const totalExpenses = Object.values(expenses).reduce((sum, value) => sum + value, 0);
      expect(result.current[0].result?.totalOperatingExpenses).toBe(totalExpenses);
    });

    it('should calculate net operating income correctly', () => {
      const { result } = renderHook(() => useRentalProperty());
      
      act(() => {
        result.current[1].setValues({
          monthlyRent: 3000,
          vacancyRate: 5,
          propertyTaxes: 400,
          insurance: 150,
          maintenance: 200,
          utilities: 100,
          propertyManagement: 300,
          advertising: 50,
          legal: 30,
          accounting: 25,
          hoaFees: 0,
          capitalExpenditures: 150,
          otherExpenses: 50
        });
      });

      // NOI = Effective Gross Income - Operating Expenses
      // EGI = 3000 * 0.95 = 2850
      // OpEx = 1455
      // NOI = 2850 - 1455 = 1395
      expect(result.current[0].result?.netOperatingIncome).toBeCloseTo(1395, 0);
    });
  });

  describe('Investment Metrics', () => {
    it('should calculate cap rate correctly', () => {
      const { result } = renderHook(() => useRentalProperty());
      
      act(() => {
        result.current[1].setValues({
          propertyValue: 300000,
          monthlyRent: 3000,
          vacancyRate: 5,
          totalOperatingExpenses: 1200
        });
      });

      // Cap Rate = (NOI * 12) / Property Value * 100
      // NOI = (3000 * 0.95 - 1200) = 1650
      // Annual NOI = 1650 * 12 = 19800
      // Cap Rate = 19800 / 300000 * 100 = 6.6%
      expect(result.current[0].result?.capRate).toBeCloseTo(6.6, 1);
    });

    it('should calculate cash-on-cash return correctly', () => {
      const { result } = renderHook(() => useRentalProperty());
      
      act(() => {
        result.current[1].setValues({
          downPayment: 60000,
          closingCosts: 5000,
          initialRepairs: 3000,
          monthlyRent: 3000,
          mortgage: 1500,
          totalOperatingExpenses: 1000,
          vacancyRate: 5
        });
      });

      // Cash on Cash = Annual Cash Flow / Total Investment * 100
      // Monthly Cash Flow = (3000 * 0.95 - 1000 - 1500) = 350
      // Annual Cash Flow = 350 * 12 = 4200
      // Total Investment = 68000
      // CoC Return = 4200 / 68000 * 100 = 6.18%
      expect(result.current[0].result?.cashOnCashReturn).toBeCloseTo(6.18, 1);
    });
  });

  describe('Risk Analysis', () => {
    it('should calculate debt service coverage ratio correctly', () => {
      const { result } = renderHook(() => useRentalProperty());
      
      act(() => {
        result.current[1].setValues({
          monthlyRent: 3000,
          mortgage: 1500,
          totalOperatingExpenses: 1000,
          vacancyRate: 5
        });
      });

      // DSCR = NOI / Annual Debt Service
      // NOI = (3000 * 0.95 - 1000) = 1850
      // Annual NOI = 1850 * 12 = 22200
      // Annual Debt Service = 1500 * 12 = 18000
      // DSCR = 22200 / 18000 = 1.23
      expect(result.current[0].result?.debtServiceCoverageRatio).toBeCloseTo(1.23, 2);
    });

    it('should generate appropriate warnings', () => {
      const { result } = renderHook(() => useRentalProperty());
      
      // Test negative cash flow warning
      act(() => {
        result.current[1].setValues({
          monthlyRent: 2000,
          mortgage: 1500,
          totalOperatingExpenses: 800
        });
      });

      expect(result.current[0].result?.warnings).toContain('Property is cash flow negative');

      // Test low DSCR warning
      act(() => {
        result.current[1].setValues({
          monthlyRent: 2500,
          mortgage: 2000,
          totalOperatingExpenses: 400
        });
      });

      expect(result.current[0].result?.insights).toContainEqual(
        expect.objectContaining({
          type: 'warning',
          message: expect.stringContaining('debt service coverage ratio')
        })
      );
    });
  });

  describe('Financial Projections', () => {
    it('should calculate five-year equity build correctly', () => {
      const { result } = renderHook(() => useRentalProperty());
      
      act(() => {
        result.current[1].setValues({
          propertyValue: 300000,
          mortgage: 1800
        });
      });

      // 5-year appreciation (3% annually) = 300000 * 0.03 * 5
      // 5-year mortgage paydown = 1800 * 0.2 * 12 * 5
      const expectedEquityBuild = (300000 * 0.03 + 1800 * 0.2 * 12) * 5;
      expect(result.current[0].result?.fiveYearEquityBuild).toBeCloseTo(expectedEquityBuild, 0);
    });

    it('should calculate total return correctly', () => {
      const { result } = renderHook(() => useRentalProperty());
      
      act(() => {
        result.current[1].setValues({
          propertyValue: 300000,
          downPayment: 60000,
          closingCosts: 5000,
          initialRepairs: 3000,
          monthlyRent: 3000,
          mortgage: 1500,
          totalOperatingExpenses: 1000,
          vacancyRate: 5
        });
      });

      expect(result.current[0].result?.totalReturn).toBeGreaterThan(0);
      expect(result.current[0].result?.totalReturn).toBeLessThan(100);
    });
  });
});

