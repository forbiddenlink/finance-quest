import { renderHook, act } from '@testing-library/react';
import { Decimal } from 'decimal.js';

// Configure Decimal.js for consistent test results
Decimal.set({
  precision: 20,
  rounding: Decimal.ROUND_HALF_UP,
  toExpNeg: -7,
  toExpPos: 21
});

/**
 * Common test cases for all calculators
 */
export interface CommonCalculatorTests<V, R> {
  hook: () => {
    values: V;
    result: R | null;
    errors: Array<{ field: keyof V; message: string }>;
    isValid: boolean;
    updateField: (field: keyof V, value: any) => void;
    reset: () => void;
  };
  validInputs: V;
  invalidInputs: Partial<Record<keyof V, any>>;
  expectedResults: R;
  fieldValidations?: Partial<Record<keyof V, Array<{
    value: any;
    error: string | null;
  }>>>;
}

/**
 * Runs common test cases that should pass for all calculators
 */
export function runCommonCalculatorTests<V, R>({
  hook,
  validInputs,
  invalidInputs,
  expectedResults,
  fieldValidations
}: CommonCalculatorTests<V, R>) {
  describe('Common Calculator Behavior', () => {
    describe('Initialization', () => {
      it('should initialize with default values', () => {
        const { result } = renderHook(() => hook());
        expect(result.current.values).toBeDefined();
        expect(result.current.errors).toEqual([]);
        expect(result.current.isValid).toBe(true);
      });

      it('should start with no validation errors', () => {
        const { result } = renderHook(() => hook());
        expect(result.current.errors).toHaveLength(0);
      });
    });

    describe('Field Updates', () => {
      it('should update fields correctly', () => {
        const { result } = renderHook(() => hook());

        // Update each field with valid input
        Object.entries(validInputs).forEach(([field, value]) => {
          act(() => {
            result.current.updateField(field as keyof V, value);
          });
          expect(result.current.values[field as keyof V]).toEqual(value);
        });
      });

      it('should handle invalid inputs', () => {
        const { result } = renderHook(() => hook());

        // Try each invalid input
        Object.entries(invalidInputs).forEach(([field, value]) => {
          act(() => {
            result.current.updateField(field as keyof V, value);
          });
          expect(result.current.errors).toContainEqual(
            expect.objectContaining({
              field: field
            })
          );
        });
      });
    });

    describe('Validation', () => {
      if (fieldValidations) {
        Object.entries(fieldValidations).forEach(([field, tests]) => {
          describe(`${field} validation`, () => {
            tests.forEach(({ value, error }) => {
              it(`should ${error ? 'reject' : 'accept'} ${value}`, () => {
                const { result } = renderHook(() => hook());

                act(() => {
                  result.current.updateField(field as keyof V, value);
                });

                if (error) {
                  expect(result.current.errors).toContainEqual(
                    expect.objectContaining({
                      field,
                      message: error
                    })
                  );
                } else {
                  expect(result.current.errors).not.toContainEqual(
                    expect.objectContaining({
                      field
                    })
                  );
                }
              });
            });
          });
        });
      }
    });

    describe('Computation', () => {
      it('should compute expected results with valid inputs', () => {
        const { result } = renderHook(() => hook());

        // Set all valid inputs
        act(() => {
          Object.entries(validInputs).forEach(([field, value]) => {
            result.current.updateField(field as keyof V, value);
          });
        });

        // Check each expected result
        Object.entries(expectedResults).forEach(([key, value]) => {
          if (typeof value === 'number') {
            expect(result.current.result?.[key as keyof R]).toBeCloseTo(value, 2);
          } else {
            expect(result.current.result?.[key as keyof R]).toEqual(value);
          }
        });
      });

      it('should not compute results with invalid inputs', () => {
        const { result } = renderHook(() => hook());

        // Set one invalid input
        const [field, value] = Object.entries(invalidInputs)[0];
        act(() => {
          result.current.updateField(field as keyof V, value);
        });

        expect(result.current.isValid).toBe(false);
      });
    });

    describe('Reset', () => {
      it('should reset to initial values', () => {
        const { result } = renderHook(() => hook());
        const initialValues = { ...result.current.values };

        // Change some values
        act(() => {
          Object.entries(validInputs).forEach(([field, value]) => {
            result.current.updateField(field as keyof V, value);
          });
        });

        // Reset
        act(() => {
          result.current.reset();
        });

        expect(result.current.values).toEqual(initialValues);
        expect(result.current.errors).toHaveLength(0);
        expect(result.current.isValid).toBe(true);
      });
    });
  });
}

/**
 * Helper for testing financial calculations
 */
export const financialTestUtils = {
  /**
   * Calculates monthly payment for a loan
   */
  calculateMonthlyPayment: (
    principal: number,
    annualRate: number,
    years: number
  ): number => {
    const P = new Decimal(principal);
    const r = new Decimal(annualRate).div(100).div(12);
    const n = new Decimal(years).times(12);

    if (r.equals(0)) {
      return P.div(n).toNumber();
    }

    return P.times(r.times(Decimal.pow(r.plus(1), n)))
      .div(Decimal.pow(r.plus(1), n).minus(1))
      .toNumber();
  },

  /**
   * Calculates future value with compound interest
   */
  calculateFutureValue: (
    principal: number,
    annualRate: number,
    years: number,
    compoundingFrequency: number = 12
  ): number => {
    const P = new Decimal(principal);
    const r = new Decimal(annualRate).div(100);
    const t = new Decimal(years);
    const n = new Decimal(compoundingFrequency);

    return P.times(
      Decimal.pow(
        Decimal.add(1, r.div(n)),
        n.times(t)
      )
    ).toNumber();
  },

  /**
   * Calculates present value
   */
  calculatePresentValue: (
    futureValue: number,
    annualRate: number,
    years: number,
    compoundingFrequency: number = 12
  ): number => {
    const FV = new Decimal(futureValue);
    const r = new Decimal(annualRate).div(100);
    const t = new Decimal(years);
    const n = new Decimal(compoundingFrequency);

    return FV.div(
      Decimal.pow(
        Decimal.add(1, r.div(n)),
        n.times(t)
      )
    ).toNumber();
  },

  /**
   * Formats currency for comparison
   */
  formatCurrency: (amount: number): string => {
    return new Decimal(amount).toFixed(2);
  },

  /**
   * Formats percentage for comparison
   */
  formatPercentage: (value: number): string => {
    return new Decimal(value).toFixed(4);
  },

  /**
   * Common validation test cases
   */
  commonValidationTests: {
    positiveNumber: [
      { value: 100, error: null },
      { value: 0, error: 'Value must be positive' },
      { value: -100, error: 'Value must be positive' }
    ],
    percentage: [
      { value: 50, error: null },
      { value: 0, error: null },
      { value: 100, error: null },
      { value: -1, error: 'Value must be between 0 and 100' },
      { value: 101, error: 'Value must be between 0 and 100' }
    ],
    required: [
      { value: 'test', error: null },
      { value: '', error: 'This field is required' },
      { value: null, error: 'This field is required' }
    ]
  }
};

/**
 * Helper for testing calculator insights
 */
export interface InsightTest {
  type: 'success' | 'warning' | 'info';
  messageIncludes: string;
}

export function testCalculatorInsights(
  insights: Array<{ type: string; message: string }>,
  expectedInsights: InsightTest[]
) {
  expectedInsights.forEach(expected => {
    expect(insights).toContainEqual(
      expect.objectContaining({
        type: expected.type,
        message: expect.stringContaining(expected.messageIncludes)
      })
    );
  });
}

/**
 * Helper for testing amortization schedules
 */
export function testAmortizationSchedule(
  schedule: Array<{
    month: number;
    payment: number;
    principal: number;
    interest: number;
    balance: number;
  }>,
  {
    loanAmount,
    monthlyPayment,
    annualRate,
    totalMonths
  }: {
    loanAmount: number;
    monthlyPayment: number;
    annualRate: number;
    totalMonths: number;
  }
) {
  // Check schedule length
  expect(schedule).toHaveLength(totalMonths);

  // Check first payment
  const firstPayment = schedule[0];
  const monthlyRate = annualRate / 100 / 12;
  const expectedFirstInterest = loanAmount * monthlyRate;
  const expectedFirstPrincipal = monthlyPayment - expectedFirstInterest;

  expect(firstPayment.payment).toBeCloseTo(monthlyPayment, 2);
  expect(firstPayment.interest).toBeCloseTo(expectedFirstInterest, 2);
  expect(firstPayment.principal).toBeCloseTo(expectedFirstPrincipal, 2);
  expect(firstPayment.balance).toBeCloseTo(loanAmount - expectedFirstPrincipal, 2);

  // Check last payment
  const lastPayment = schedule[totalMonths - 1];
  expect(lastPayment.balance).toBeCloseTo(0, 2);

  // Check running balance
  let runningBalance = new Decimal(loanAmount);
  schedule.forEach(payment => {
    const expectedInterest = runningBalance.mul(monthlyRate);
    const expectedPrincipal = new Decimal(monthlyPayment).minus(expectedInterest);
    runningBalance = runningBalance.minus(expectedPrincipal);

    expect(payment.interest).toBeCloseTo(expectedInterest.toNumber(), 2);
    expect(payment.principal).toBeCloseTo(expectedPrincipal.toNumber(), 2);
    expect(payment.balance).toBeCloseTo(runningBalance.toNumber(), 2);
  });
}
