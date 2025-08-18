# Calculator Implementation Guide

## Overview

This guide explains how to implement financial calculators using our standardized framework, base hook, and shared utilities. Following these patterns ensures consistency, accuracy, and maintainability across all calculators.

## Table of Contents

- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Financial Utilities](#financial-utilities)
- [Best Practices](#best-practices)
- [Examples](#examples)

## Quick Start

```typescript
import {
  useCalculatorBase,
  commonValidations,
} from "@/lib/hooks/useCalculatorBase";
import {
  calculateFutureValue,
  formatCurrency,
  formatPercentage,
  financialRatios,
} from "@/lib/utils/financialCalculations";

interface MyCalculatorValues {
  principal: number;
  rate: number;
  years: number;
}

interface MyCalculatorResult {
  futureValue: number;
  totalInterest: number;
  annualReturn: number;
  insights: Array<{
    type: "success" | "warning" | "info";
    message: string;
  }>;
}

export function useMyCalculator() {
  return useCalculatorBase<MyCalculatorValues, MyCalculatorResult>({
    id: "my-calculator",
    initialValues: {
      principal: 1000,
      rate: 7,
      years: 10,
    },
    validation: {
      principal: [commonValidations.required(), commonValidations.positive()],
      rate: [commonValidations.required(), commonValidations.percentage()],
      years: [commonValidations.required(), commonValidations.min(1)],
    },
    compute: (values) => {
      const futureValue = calculateFutureValue(
        values.principal,
        values.rate,
        values.years
      );

      const totalInterest = futureValue - values.principal;
      const annualReturn =
        (futureValue / values.principal) ** (1 / values.years) - 1;

      const insights = [];
      if (values.rate > financialRatios.moderateReturn) {
        insights.push({
          type: "warning",
          message: "Return assumption may be optimistic",
        });
      }

      return {
        futureValue,
        totalInterest,
        annualReturn,
        insights,
      };
    },
    formatters: {
      principal: formatCurrency,
      rate: (value) => formatPercentage(value, 1),
    },
  });
}
```

## Architecture

### Base Calculator Hook

The `useCalculatorBase` hook provides:

- Type-safe state management
- Field validation
- Value formatting
- Error handling
- Progress tracking

```typescript
interface CalculatorConfig<V, R> {
  // Unique identifier for the calculator
  id: string;

  // Initial values for all fields
  initialValues: V;

  // Validation rules for each field
  validation: ValidationRules<V>;

  // Function to compute results
  compute: (values: V) => R | null;

  // Optional field dependencies
  dependencies?: CalculatorDependencies<V>;

  // Optional value formatters
  formatters?: {
    [K in keyof V]?: (value: V[K]) => string;
  };
}
```

### Financial Utilities

The `financialCalculations` module provides:

1. **Core Calculations**

```typescript
// Calculate loan payments
calculateMonthlyPayment(principal, rate, years);

// Calculate investment growth
calculateFutureValue(principal, rate, years, monthlyContribution?);

// Calculate present value
calculatePresentValue(futureValue, rate, years);

// Calculate required savings
calculateRequiredMonthlySavings(goal, rate, years, currentSavings?);

// Calculate internal rate of return
calculateIRR(cashflows, guess?);
```

2. **Amortization Schedules**

```typescript
generateAmortizationSchedule(principal, rate, years);
```

3. **Formatting**

```typescript
formatCurrency(value, options?);
formatPercentage(value, decimals?);
```

4. **Financial Ratios**

```typescript
financialRatios.maxDTI; // Maximum debt-to-income ratio
financialRatios.minDownPayment; // Minimum down payment percentage
financialRatios.safeWithdrawalRate; // Safe retirement withdrawal rate
// ... and more
```

## Best Practices

### 1. Type Safety

```typescript
// Define explicit interfaces
interface CalculatorValues {
  // Use specific types
  amount: number;
  rate: number;
  term: number;
}

interface CalculatorResult {
  // Include all possible results
  payment: number;
  total: number;
  insights: Array<{ type: string; message: string }>;
}
```

### 2. Validation

```typescript
validation: {
  amount: [
    // Use common validations where possible
    commonValidations.required(),
    commonValidations.positive(),
    // Add custom validations as needed
    {
      validate: (value, allValues) => value <= allValues?.maxAmount,
      message: "Amount exceeds maximum",
    },
  ];
}
```

### 3. Financial Calculations

```typescript
// Use provided utilities for consistency
const payment = calculateMonthlyPayment(principal, rate, years);

// Use Decimal.js for precision when needed
const total = new Decimal(principal).plus(new Decimal(interest)).toNumber();
```

### 4. Insights Generation

```typescript
const insights = [];

// Use standard thresholds
if (dti > financialRatios.maxDTI) {
  insights.push({
    type: "warning",
    message: `DTI ratio exceeds ${financialRatios.maxDTI}% maximum`,
  });
}

// Provide actionable recommendations
if (savingsRate < financialRatios.minSavingsRate) {
  insights.push({
    type: "info",
    message: "Consider increasing your savings rate",
  });
}
```

## Examples

### 1. Investment Calculator

```typescript
interface InvestmentCalculatorValues {
  initialInvestment: number;
  monthlyContribution: number;
  expectedReturn: number;
  years: number;
  riskTolerance: "conservative" | "moderate" | "aggressive";
}

export function useInvestmentCalculator() {
  return useCalculatorBase<InvestmentCalculatorValues, InvestmentResult>({
    // ... configuration
    compute: (values) => {
      const futureValue = calculateFutureValue(
        values.initialInvestment,
        values.expectedReturn,
        values.years,
        values.monthlyContribution
      );

      // Generate insights based on risk tolerance
      const insights = [];
      if (
        values.expectedReturn > financialRatios.moderateReturn &&
        values.riskTolerance === "conservative"
      ) {
        insights.push({
          type: "warning",
          message: "Return expectations high for conservative portfolio",
        });
      }

      return {
        futureValue,
        insights,
        // ... other results
      };
    },
  });
}
```

### 2. Retirement Calculator

```typescript
interface RetirementCalculatorValues {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  monthlyContribution: number;
  expectedReturn: number;
  desiredIncome: number;
}

export function useRetirementCalculator() {
  return useCalculatorBase<RetirementCalculatorValues, RetirementResult>({
    // ... configuration
    compute: (values) => {
      const yearsToRetirement = values.retirementAge - values.currentAge;

      // Calculate future portfolio value
      const projectedSavings = calculateFutureValue(
        values.currentSavings,
        values.expectedReturn,
        yearsToRetirement,
        values.monthlyContribution
      );

      // Calculate required savings using safe withdrawal rate
      const requiredSavings =
        values.desiredIncome / (financialRatios.safeWithdrawalRate / 100);

      return {
        projectedSavings,
        requiredSavings,
        // ... other results
      };
    },
  });
}
```

### 3. Mortgage Calculator

```typescript
interface MortgageCalculatorValues {
  homePrice: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
  monthlyIncome: number;
}

export function useMortgageCalculator() {
  return useCalculatorBase<MortgageCalculatorValues, MortgageResult>({
    // ... configuration
    compute: (values) => {
      const loanAmount = values.homePrice - values.downPayment;

      // Calculate monthly payment
      const monthlyPayment = calculateMonthlyPayment(
        loanAmount,
        values.interestRate,
        values.loanTerm
      );

      // Generate amortization schedule
      const schedule = generateAmortizationSchedule(
        loanAmount,
        values.interestRate,
        values.loanTerm
      );

      // Calculate affordability ratios
      const dti = (monthlyPayment / values.monthlyIncome) * 100;
      const isAffordable = dti <= financialRatios.maxDTI;

      return {
        monthlyPayment,
        schedule,
        isAffordable,
        // ... other results
      };
    },
  });
}
```

For more examples, see the calculator implementations in the `lib/hooks/calculators/` directory.
