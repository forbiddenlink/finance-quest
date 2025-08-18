import {
  calculateMonthlyPayment,
  generateAmortizationSchedule,
  calculateFutureValue,
  calculatePresentValue,
  calculateRequiredMonthlySavings,
  calculateIRR,
  formatCurrency,
  formatPercentage
} from '@/lib/utils/financialCalculations';
import { Decimal } from 'decimal.js';

describe('Financial Calculations', () => {
  describe('calculateMonthlyPayment', () => {
    it('should calculate monthly payment correctly', () => {
      // $300,000 loan at 4.5% for 30 years
      const payment = calculateMonthlyPayment(300000, 4.5, 30);
      expect(payment).toBeCloseTo(1520.06, 2);
    });

    it('should handle zero interest rate', () => {
      // $12,000 loan at 0% for 1 year
      const payment = calculateMonthlyPayment(12000, 0, 1);
      expect(payment).toBeCloseTo(1000, 2); // $1,000 per month
    });

    it('should accept Decimal inputs', () => {
      const payment = calculateMonthlyPayment(
        new Decimal(300000),
        new Decimal(4.5),
        new Decimal(30)
      );
      expect(payment).toBeCloseTo(1520.06, 2);
    });

    it('should handle string inputs', () => {
      const payment = calculateMonthlyPayment('300000', '4.5', '30');
      expect(payment).toBeCloseTo(1520.06, 2);
    });
  });

  describe('generateAmortizationSchedule', () => {
    it('should generate correct amortization schedule', () => {
      const schedule = generateAmortizationSchedule(300000, 4.5, 30);
      
      // Check schedule length
      expect(schedule).toHaveLength(360); // 30 years * 12 months

      // Check first payment
      const firstPayment = schedule[0];
      expect(firstPayment.payment).toBeCloseTo(1520.06, 2);
      expect(firstPayment.interest).toBeCloseTo(1125.00, 2); // First month's interest
      expect(firstPayment.principal).toBeCloseTo(395.06, 2); // First month's principal

      // Check last payment
      const lastPayment = schedule[359];
      expect(lastPayment.balance).toBeCloseTo(0, 2); // Should be fully amortized
      expect(lastPayment.totalInterest).toBeCloseTo(247220.00, 0); // Total interest paid
    });

    it('should handle zero interest rate', () => {
      const schedule = generateAmortizationSchedule(12000, 0, 1);
      
      expect(schedule).toHaveLength(12); // 1 year
      expect(schedule[0].payment).toBeCloseTo(1000, 2);
      expect(schedule[0].interest).toBe(0);
      expect(schedule[0].principal).toBeCloseTo(1000, 2);
    });
  });

  describe('calculateFutureValue', () => {
    it('should calculate future value with no contributions', () => {
      // $10,000 at 7% for 10 years, no contributions
      const fv = calculateFutureValue(10000, 7, 10);
      expect(fv).toBeCloseTo(19671.51, 2);
    });

    it('should calculate future value with monthly contributions', () => {
      // $10,000 initial + $100 monthly at 7% for 10 years
      const fv = calculateFutureValue(10000, 7, 10, 100);
      expect(fv).toBeCloseTo(34798.55, 2);
    });

    it('should handle different compounding frequencies', () => {
      // Same investment, annual vs monthly compounding
      const annualFV = calculateFutureValue(10000, 7, 10, 0, 1);
      const monthlyFV = calculateFutureValue(10000, 7, 10, 0, 12);
      
      expect(monthlyFV).toBeGreaterThan(annualFV);
    });
  });

  describe('calculatePresentValue', () => {
    it('should calculate present value correctly', () => {
      // Need $100,000 in 10 years at 7%
      const pv = calculatePresentValue(100000, 7, 10);
      expect(pv).toBeCloseTo(50833.78, 2);
    });

    it('should be inverse of future value', () => {
      const amount = 50000;
      const rate = 7;
      const years = 10;

      const fv = calculateFutureValue(amount, rate, years);
      const pv = calculatePresentValue(fv, rate, years);

      expect(pv).toBeCloseTo(amount, 2);
    });
  });

  describe('calculateRequiredMonthlySavings', () => {
    it('should calculate required savings for a goal', () => {
      // Need $100,000 in 10 years at 7%, starting from $0
      const monthlySavings = calculateRequiredMonthlySavings(100000, 7, 10, 0);
      expect(monthlySavings).toBeCloseTo(593.26, 2);
    });

    it('should account for current savings', () => {
      // Same goal but with $20,000 already saved
      const monthlySavings = calculateRequiredMonthlySavings(100000, 7, 10, 20000);
      expect(monthlySavings).toBeCloseTo(474.61, 2);
    });

    it('should return 0 if current savings will meet goal', () => {
      // Goal will be met by current savings growth alone
      const monthlySavings = calculateRequiredMonthlySavings(100000, 7, 10, 90000);
      expect(monthlySavings).toBe(0);
    });
  });

  describe('calculateIRR', () => {
    it('should calculate IRR for simple investment', () => {
      // Investment of $1000, returns of $600 and $600 in following years
      const cashflows = [-1000, 600, 600];
      const irr = calculateIRR(cashflows);
      expect(irr).toBeCloseTo(13.07, 2);
    });

    it('should handle multiple cashflows', () => {
      // More complex investment pattern
      const cashflows = [-1000, 200, 300, 400, 500];
      const irr = calculateIRR(cashflows);
      expect(irr).toBeCloseTo(15.79, 2);
    });

    it('should throw error if no solution found', () => {
      // All positive cashflows have no solution
      const cashflows = [1000, 500, 500];
      expect(() => calculateIRR(cashflows)).toThrow();
    });
  });

  describe('formatCurrency', () => {
    it('should format currency with default options', () => {
      expect(formatCurrency(1234567.89)).toBe('$1,234,568');
      expect(formatCurrency(-1234.56)).toBe('-$1,235');
    });

    it('should respect decimal places option', () => {
      expect(formatCurrency(1234.56, { maximumFractionDigits: 2 })).toBe('$1,234.56');
    });

    it('should handle string and Decimal inputs', () => {
      expect(formatCurrency('1234.56')).toBe('$1,235');
      expect(formatCurrency(new Decimal('1234.56'))).toBe('$1,235');
    });
  });

  describe('formatPercentage', () => {
    it('should format percentage with default decimals', () => {
      expect(formatPercentage(12.345)).toBe('12.3%');
    });

    it('should respect decimal places parameter', () => {
      expect(formatPercentage(12.345, 2)).toBe('12.35%');
      expect(formatPercentage(12.345, 0)).toBe('12%');
    });

    it('should handle string and Decimal inputs', () => {
      expect(formatPercentage('12.345')).toBe('12.3%');
      expect(formatPercentage(new Decimal('12.345'))).toBe('12.3%');
    });
  });
});
