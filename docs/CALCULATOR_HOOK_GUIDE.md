# Calculator Hook Guide

## Overview

The `useCalculatorBase` hook provides a standardized way to implement financial calculators with built-in validation, error handling, and precise decimal calculations. This guide explains how to use the hook and implement new calculators.

## Table of Contents

- [Quick Start](#quick-start)
- [Core Concepts](#core-concepts)
- [API Reference](#api-reference)
- [Common Patterns](#common-patterns)
- [Best Practices](#best-practices)
- [Migration Guide](#migration-guide)
- [Examples](#examples)

## Quick Start

```typescript
import {
  useCalculatorBase,
  commonValidations,
} from "@/lib/hooks/useCalculatorBase";

// 1. Define your calculator's types
interface MyCalculatorValues {
  principal: number;
  rate: number;
  years: number;
}

interface MyCalculatorResult {
  finalAmount: number;
  totalInterest: number;
}

// 2. Create your calculator hook
export function useMyCalculator() {
  const [state, actions] = useCalculatorBase<
    MyCalculatorValues,
    MyCalculatorResult
  >({
    id: "my-calculator",
    initialValues: {
      principal: 1000,
      rate: 5,
      years: 1,
    },
    validation: {
      principal: [commonValidations.required(), commonValidations.positive()],
      rate: [commonValidations.required(), commonValidations.percentage()],
      years: [commonValidations.required(), commonValidations.min(1)],
    },
    compute: (values) => ({
      finalAmount: values.principal * (1 + values.rate / 100) ** values.years,
      totalInterest:
        values.principal * (1 + values.rate / 100) ** values.years -
        values.principal,
    }),
  });

  return {
    values: state.values,
    result: state.result,
    errors: state.errors,
    isValid: state.isValid,
    updateField: actions.updateField,
    reset: actions.reset,
  };
}
```

## Core Concepts

### 1. Type Safety

The calculator hook is fully type-safe and requires two generic types:

- `Values`: The shape of your calculator's input values
- `Result`: The shape of your calculator's computed results

### 2. Validation

Validation is handled through rules that can be:

- Field-specific
- Cross-field dependent
- Asynchronous (for API-dependent validation)

### 3. Computation

Calculations are:

- Automatically memoized
- Precise using Decimal.js
- Only run when inputs are valid
- Error-protected

### 4. State Management

The hook manages:

- Input values
- Validation state
- Computation results
- Error messages
- Dirty state

## API Reference

### Hook Configuration

```typescript
interface CalculatorConfig<T, R> {
  // Unique identifier for the calculator
  id: string;

  // Initial values for all fields
  initialValues: T;

  // Validation rules for each field
  validation: ValidationRules<T>;

  // Function to compute results
  compute: (values: T) => R | null;

  // Optional field dependencies
  dependencies?: CalculatorDependencies<T>;

  // Optional value formatters
  formatters?: {
    [K in keyof T]?: (value: T[K]) => string;
  };

  // Optional value parsers
  parsers?: {
    [K in keyof T]?: (value: string) => T[K];
  };
}
```

### Common Validations

```typescript
commonValidations.required(message?: string)
commonValidations.min(min: number, message?: string)
commonValidations.max(max: number, message?: string)
commonValidations.positive(message?: string)
commonValidations.integer(message?: string)
commonValidations.percentage(message?: string)
```

### Hook Return Value

```typescript
interface CalculatorState<T, R> {
  values: T;
  errors: ValidationError[];
  result: R | null;
  isValid: boolean;
  isDirty: boolean;
}

interface CalculatorActions<T> {
  updateField: (field: keyof T, value: any) => void;
  validateField: (field: keyof T) => boolean;
  validateAll: () => boolean;
  reset: () => void;
  setValues: (values: Partial<T>) => void;
}
```

## Common Patterns

### 1. Field Dependencies

```typescript
const config = {
  // ... other config
  dependencies: {
    endDate: ["startDate"], // endDate validation depends on startDate
    monthlyPayment: ["loanAmount", "interestRate"], // payment depends on loan and rate
  },
};
```

### 2. Custom Validation

```typescript
const validation = {
  endDate: [
    {
      validate: (value, allValues) =>
        new Date(value) > new Date(allValues.startDate),
      message: "End date must be after start date",
    },
  ],
};
```

### 3. Custom Formatting

```typescript
const config = {
  // ... other config
  formatters: {
    amount: (value) =>
      value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
      }),
    percentage: (value) => `${value.toFixed(2)}%`,
  },
};
```

## Best Practices

1. **Type Safety**

   - Always define explicit interfaces for Values and Result
   - Use strict TypeScript settings
   - Avoid any type

2. **Validation**

   - Validate all inputs
   - Provide clear error messages
   - Consider field dependencies
   - Use common validations when possible

3. **Computation**

   - Use Decimal.js for financial calculations
   - Handle edge cases
   - Protect against invalid inputs
   - Document assumptions

4. **State Management**
   - Keep computed values in result
   - Don't duplicate state
   - Use formatters for display
   - Reset state appropriately

## Migration Guide

### From Old Calculator to New Hook

1. **Identify Types**

   ```typescript
   // Old
   const [principal, setPrincipal] = useState(0);
   const [rate, setRate] = useState(0);

   // New
   interface Values {
     principal: number;
     rate: number;
   }
   ```

2. **Convert Validation**

   ```typescript
   // Old
   if (principal <= 0) setError("Invalid principal");

   // New
   validation: {
     principal: [commonValidations.positive()];
   }
   ```

3. **Move Calculations**

   ```typescript
   // Old
   useEffect(() => {
     const result = principal * (1 + rate);
     setTotal(result);
   }, [principal, rate]);

   // New
   compute: (values) => ({
     total: values.principal * (1 + values.rate),
   });
   ```

## Examples

### 1. Simple Interest Calculator

```typescript
interface Values {
  principal: number;
  rate: number;
  years: number;
}

interface Result {
  interest: number;
  total: number;
}

export function useSimpleInterestCalculator() {
  return useCalculatorBase<Values, Result>({
    id: "simple-interest",
    initialValues: {
      principal: 1000,
      rate: 5,
      years: 1,
    },
    validation: {
      principal: [commonValidations.required(), commonValidations.positive()],
      rate: [commonValidations.required(), commonValidations.percentage()],
      years: [commonValidations.required(), commonValidations.positive()],
    },
    compute: (values) => {
      const interest = values.principal * (values.rate / 100) * values.years;
      return {
        interest,
        total: values.principal + interest,
      };
    },
  });
}
```

### 2. Loan Calculator with Dependencies

```typescript
interface Values {
  loanAmount: number;
  interestRate: number;
  years: number;
  monthlyIncome: number;
  monthlyPayment?: number;
}

interface Result {
  monthlyPayment: number;
  totalInterest: number;
  debtToIncome: number;
  isAffordable: boolean;
}

export function useLoanCalculator() {
  return useCalculatorBase<Values, Result>({
    id: "loan-calculator",
    initialValues: {
      loanAmount: 100000,
      interestRate: 4.5,
      years: 30,
      monthlyIncome: 5000,
    },
    validation: {
      loanAmount: [
        commonValidations.required(),
        commonValidations.positive(),
        {
          validate: (value, allValues) => {
            const payment = calculateMonthlyPayment(
              value,
              allValues.interestRate,
              allValues.years
            );
            return payment <= allValues.monthlyIncome * 0.43;
          },
          message: "Loan amount too high for income",
        },
      ],
      // ... other validations
    },
    dependencies: {
      loanAmount: ["monthlyIncome", "interestRate", "years"],
      monthlyPayment: ["loanAmount", "interestRate", "years"],
    },
    compute: (values) => {
      const monthlyPayment = calculateMonthlyPayment(
        values.loanAmount,
        values.interestRate,
        values.years
      );
      const totalInterest =
        monthlyPayment * values.years * 12 - values.loanAmount;
      const debtToIncome = (monthlyPayment / values.monthlyIncome) * 100;

      return {
        monthlyPayment,
        totalInterest,
        debtToIncome,
        isAffordable: debtToIncome <= 43,
      };
    },
  });
}
```

For more examples, see the `examples/` directory in the codebase.
