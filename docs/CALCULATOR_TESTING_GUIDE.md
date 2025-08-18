# Calculator Testing Guide

## Overview

This guide outlines our testing strategy for financial calculators, ensuring accuracy, consistency, and reliability across all calculator implementations.

## Table of Contents

- [Testing Levels](#testing-levels)
- [Test Utilities](#test-utilities)
- [Common Test Patterns](#common-test-patterns)
- [Cross-Calculator Testing](#cross-calculator-testing)
- [Edge Cases](#edge-cases)
- [Performance Testing](#performance-testing)

## Testing Levels

### 1. Unit Tests

Each calculator should have comprehensive unit tests covering:

```typescript
describe("Calculator Unit Tests", () => {
  // Core calculations
  it("should perform basic calculations correctly", () => {
    const result = calculate(input);
    expect(result).toBe(expected);
  });

  // Input validation
  it("should validate inputs correctly", () => {
    expect(() => validate(invalidInput)).toThrow();
  });

  // Edge cases
  it("should handle edge cases gracefully", () => {
    const result = calculate(edgeCase);
    expect(result).toBeDefined();
  });
});
```

### 2. Integration Tests

Test calculator interactions with shared utilities and other calculators:

```typescript
describe("Calculator Integration", () => {
  // Shared utility integration
  it("should use shared financial utilities correctly", () => {
    const result = calculator.useSharedUtil(input);
    expect(result).toMatchSharedUtil(input);
  });

  // Cross-calculator consistency
  it("should maintain consistency with related calculators", () => {
    const result1 = calculator1.calculate(input);
    const result2 = calculator2.calculate(input);
    expect(result1).toBeConsistentWith(result2);
  });
});
```

### 3. End-to-End Tests

Test complete calculator workflows:

```typescript
describe("Calculator E2E", () => {
  // Full workflow
  it("should complete full calculation workflow", async () => {
    await enterInputs(testData);
    await calculateResults();
    await verifyOutputs(expectedResults);
  });

  // State management
  it("should maintain state correctly", async () => {
    await performActions(actions);
    expect(getState()).toMatchExpectedState();
  });
});
```

## Test Utilities

### 1. Common Test Functions

```typescript
// Test utility for running common calculator tests
export function runCommonCalculatorTests({
  hook,
  validInputs,
  invalidInputs,
  expectedResults,
}: TestConfig): void {
  describe("Common Calculator Tests", () => {
    // Input validation
    testInputValidation(hook, validInputs, invalidInputs);

    // Basic calculations
    testBasicCalculations(hook, validInputs, expectedResults);

    // State management
    testStateManagement(hook, validInputs);
  });
}

// Test utility for validating calculator insights
export function testCalculatorInsights(
  insights: CalculatorInsight[],
  expectedInsights: ExpectedInsight[]
): void {
  expectedInsights.forEach((expected) => {
    expect(insights).toContainEqual(
      expect.objectContaining({
        type: expected.type,
        message: expect.stringContaining(expected.messageIncludes),
      })
    );
  });
}
```

### 2. Financial Test Utilities

```typescript
export const financialTestUtils = {
  // Calculate future value for testing
  calculateFutureValue(
    principal: number,
    rate: number,
    years: number,
    monthlyContribution?: number
  ): number {
    // Test implementation
    return futureValue;
  },

  // Calculate loan payments for testing
  calculateLoanPayment(principal: number, rate: number, term: number): number {
    // Test implementation
    return payment;
  },

  // Compare floating point numbers with tolerance
  expectMoneyEqual(
    actual: number,
    expected: number,
    precision: number = 2
  ): void {
    expect(actual).toBeCloseTo(expected, precision);
  },
};
```

## Common Test Patterns

### 1. Input Validation

```typescript
describe("Input Validation", () => {
  // Required fields
  it("should require necessary fields", () => {
    const { errors } = validate({});
    expect(errors).toContain("required field");
  });

  // Type checking
  it("should validate input types", () => {
    const { errors } = validate({ amount: "invalid" });
    expect(errors).toContain("must be a number");
  });

  // Range validation
  it("should validate value ranges", () => {
    const { errors } = validate({ percentage: 150 });
    expect(errors).toContain("must be between 0 and 100");
  });
});
```

### 2. Calculation Accuracy

```typescript
describe("Calculation Accuracy", () => {
  // Basic calculations
  it("should calculate correctly with simple inputs", () => {
    const result = calculate(simpleInput);
    expectMoneyEqual(result, expectedOutput);
  });

  // Complex scenarios
  it("should handle complex calculations", () => {
    const result = calculate(complexInput);
    expectMoneyEqual(result, expectedOutput);
  });

  // Rounding behavior
  it("should round results appropriately", () => {
    const result = calculate(input);
    expect(result).toBeCloseTo(expected, 2);
  });
});
```

### 3. State Management

```typescript
describe("State Management", () => {
  // State updates
  it("should update state correctly", () => {
    const { result } = renderHook(() => useCalculator());
    act(() => {
      result.current.updateField("amount", 100);
    });
    expect(result.current.values.amount).toBe(100);
  });

  // Dependent calculations
  it("should recalculate dependent values", () => {
    const { result } = renderHook(() => useCalculator());
    act(() => {
      result.current.updateField("principal", 1000);
      result.current.updateField("rate", 5);
    });
    expect(result.current.result.interest).toBeDefined();
  });
});
```

## Cross-Calculator Testing

### 1. Shared Metrics

```typescript
describe("Shared Metrics", () => {
  // DTI consistency
  it("should calculate consistent DTI across calculators", () => {
    const budget = useBudgetCalculator();
    const mortgage = useMortgageCalculator();
    expect(budget.dti).toBeCloseTo(mortgage.dti);
  });

  // Risk assessment
  it("should maintain consistent risk assessment", () => {
    const investment = useInvestmentCalculator();
    const retirement = useRetirementCalculator();
    expect(investment.riskScore).toBeConsistentWith(retirement.riskScore);
  });
});
```

### 2. Data Flow

```typescript
describe("Data Flow", () => {
  // Update propagation
  it("should propagate updates correctly", () => {
    const source = useSourceCalculator();
    const target = useTargetCalculator();
    source.update(change);
    expect(target.result).toReflectChange(change);
  });

  // Circular dependencies
  it("should handle circular dependencies", () => {
    const calc1 = useCalculator1();
    const calc2 = useCalculator2();
    calc1.update(change);
    expect(() => calc2.update(change)).not.toThrow();
  });
});
```

## Edge Cases

### 1. Numerical Edge Cases

```typescript
describe("Edge Cases", () => {
  // Zero values
  it("should handle zero values", () => {
    expect(calculate({ amount: 0 })).toBeDefined();
  });

  // Very large numbers
  it("should handle large numbers", () => {
    expect(calculate({ amount: 1e9 })).toBeDefined();
  });

  // Negative numbers
  it("should handle negative inputs", () => {
    expect(() => calculate({ amount: -100 })).toThrow();
  });
});
```

### 2. Special Scenarios

```typescript
describe("Special Scenarios", () => {
  // Early payoff
  it("should handle early payoff scenarios", () => {
    const result = calculate({
      ...loanData,
      extraPayment: payment,
    });
    expect(result.term).toBeLessThan(originalTerm);
  });

  // Market conditions
  it("should handle extreme market conditions", () => {
    const result = calculate({
      ...investmentData,
      marketReturn: -30,
    });
    expect(result).toHandleMarketStress();
  });
});
```

## Performance Testing

### 1. Calculation Speed

```typescript
describe("Performance", () => {
  // Complex calculations
  it("should complete complex calculations quickly", () => {
    const start = performance.now();
    calculate(complexInput);
    const duration = performance.now() - start;
    expect(duration).toBeLessThan(100);
  });

  // Multiple updates
  it("should handle rapid updates efficiently", () => {
    const calculator = useCalculator();
    const updates = generateManyUpdates();
    expect(() => {
      updates.forEach((u) => calculator.update(u));
    }).toCompleteQuickly();
  });
});
```

### 2. Memory Usage

```typescript
describe("Memory Usage", () => {
  // Large datasets
  it("should handle large datasets efficiently", () => {
    const result = calculate(largeDataset);
    expect(process.memoryUsage()).toBeWithinLimits();
  });

  // Memory leaks
  it("should not leak memory during updates", () => {
    const calculator = useCalculator();
    const before = process.memoryUsage();
    performManyUpdates(calculator);
    const after = process.memoryUsage();
    expect(after.heapUsed - before.heapUsed).toBeLessThan(threshold);
  });
});
```

For more examples and specific test cases, refer to the test implementations in `__tests__/calculators/`.
