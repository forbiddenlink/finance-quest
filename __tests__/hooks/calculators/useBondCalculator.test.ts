import { renderHook, act } from '@testing-library/react';
import { useBondCalculator } from '@/lib/hooks/calculators/useBondCalculator';

// Mock the progress store
jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: () => (calculatorId: string) => {}
}));

describe('useBondCalculator', () => {
  describe('Initialization', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useBondCalculator());
      
      expect(result.current.values).toEqual({
        faceValue: 1000,
        couponRate: 5,
        yearsToMaturity: 10,
        marketRate: 5,
        currentPrice: 1000,
        paymentFrequency: 2
      });
      expect(result.current.errors).toEqual([]);
      expect(result.current.isValid).toBe(true);
    });
  });

  describe('Validation', () => {
    it('should validate face value constraints', () => {
      const { result } = renderHook(() => useBondCalculator());

      act(() => {
        result.current.updateField('faceValue', -1000);
      });

      expect(result.current.errors).toContainEqual(
        expect.objectContaining({
          field: 'faceValue',
          message: 'Face value must be positive'
        })
      );
    });

    it('should validate coupon rate range', () => {
      const { result } = renderHook(() => useBondCalculator());

      act(() => {
        result.current.updateField('couponRate', 150);
      });

      expect(result.current.errors).toContainEqual(
        expect.objectContaining({
          field: 'couponRate',
          message: 'Value must be between 0 and 100'
        })
      );
    });

    it('should validate payment frequency values', () => {
      const { result } = renderHook(() => useBondCalculator());

      act(() => {
        result.current.updateField('paymentFrequency', 3);
      });

      expect(result.current.errors).toContainEqual(
        expect.objectContaining({
          field: 'paymentFrequency',
          message: 'Payment frequency must be 1, 2, 4, or 12'
        })
      );
    });
  });

  describe('Calculations', () => {
    it('should calculate bond metrics correctly for par bond', () => {
      const { result } = renderHook(() => useBondCalculator());
      
      // Par bond: coupon rate equals market rate
      act(() => {
        result.current.updateField('faceValue', 1000);
        result.current.updateField('couponRate', 5);
        result.current.updateField('marketRate', 5);
        result.current.updateField('currentPrice', 1000);
        result.current.updateField('yearsToMaturity', 10);
        result.current.updateField('paymentFrequency', 2);
      });

      expect(result.current.result).toBeTruthy();
      if (result.current.result) {
        expect(result.current.result.bondPrice).toBeCloseTo(1000, 2);
        expect(result.current.result.currentYield).toBeCloseTo(5, 2);
        expect(result.current.result.annualCoupon).toBeCloseTo(50, 2);
      }
    });

    it('should calculate premium bond metrics correctly', () => {
      const { result } = renderHook(() => useBondCalculator());
      
      // Premium bond: coupon rate higher than market rate
      act(() => {
        result.current.updateField('faceValue', 1000);
        result.current.updateField('couponRate', 7);
        result.current.updateField('marketRate', 5);
        result.current.updateField('currentPrice', 1150);
        result.current.updateField('yearsToMaturity', 10);
        result.current.updateField('paymentFrequency', 2);
      });

      expect(result.current.result).toBeTruthy();
      if (result.current.result) {
        expect(result.current.result.bondPrice).toBeGreaterThan(1000);
        expect(result.current.result.currentYield).toBeLessThan(7);
      }
    });

    it('should calculate discount bond metrics correctly', () => {
      const { result } = renderHook(() => useBondCalculator());
      
      // Discount bond: coupon rate lower than market rate
      act(() => {
        result.current.updateField('faceValue', 1000);
        result.current.updateField('couponRate', 3);
        result.current.updateField('marketRate', 5);
        result.current.updateField('currentPrice', 850);
        result.current.updateField('yearsToMaturity', 10);
        result.current.updateField('paymentFrequency', 2);
      });

      expect(result.current.result).toBeTruthy();
      if (result.current.result) {
        expect(result.current.result.bondPrice).toBeLessThan(1000);
        expect(result.current.result.currentYield).toBeGreaterThan(3);
      }
    });

    it('should handle zero-coupon bond', () => {
      const { result } = renderHook(() => useBondCalculator());
      
      act(() => {
        result.current.updateField('faceValue', 1000);
        result.current.updateField('couponRate', 0);
        result.current.updateField('marketRate', 5);
        result.current.updateField('currentPrice', 600);
        result.current.updateField('yearsToMaturity', 10);
        result.current.updateField('paymentFrequency', 1);
      });

      expect(result.current.result).toBeTruthy();
      if (result.current.result) {
        expect(result.current.result.annualCoupon).toBe(0);
        expect(result.current.result.currentYield).toBe(0);
        expect(result.current.result.bondPrice).toBeLessThan(1000);
      }
    });
  });

  describe('Reset Functionality', () => {
    it('should reset to initial values', () => {
      const { result } = renderHook(() => useBondCalculator());
      
      act(() => {
        result.current.updateField('faceValue', 2000);
        result.current.updateField('couponRate', 8);
      });

      expect(result.current.values.faceValue).toBe(2000);
      expect(result.current.values.couponRate).toBe(8);

      act(() => {
        result.current.reset();
      });

      expect(result.current.values).toEqual({
        faceValue: 1000,
        couponRate: 5,
        yearsToMaturity: 10,
        marketRate: 5,
        currentPrice: 1000,
        paymentFrequency: 2
      });
    });
  });
});
