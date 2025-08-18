# TypeScript Type Safety Guidelines

## Overview

This document outlines our best practices and guidelines for maintaining type safety across our codebase, particularly in our financial calculator components. These guidelines are based on our experience refactoring multiple calculators and aim to prevent common type-related issues.

## Table of Contents

1. [Type Definitions](#type-definitions)
2. [Component Organization](#component-organization)
3. [State Management](#state-management)
4. [Utility Functions](#utility-functions)
5. [Common Patterns](#common-patterns)
6. [Type Safety Checks](#type-safety-checks)
7. [Testing](#testing)

## Type Definitions

### Basic Rules

1. **Always define explicit interfaces** for component props and state:

   ```typescript
   interface CalculatorProps {
     initialValue?: number;
     onChange: (value: number) => void;
   }
   ```

2. **Use discriminated unions** for complex state:

   ```typescript
   type CalculatorState =
     | { status: "idle" }
     | { status: "calculating"; input: number }
     | { status: "error"; message: string }
     | { status: "success"; result: number };
   ```

3. **Avoid `any` type**:
   - Use `unknown` for truly unknown types
   - Use generics for flexible typing
   - Define specific types for API responses

### Domain-Specific Types

1. **Financial Values**:

   ```typescript
   interface MonetaryValue {
     amount: number;
     currency: string;
   }

   interface Percentage {
     value: number;
     basis?: number;
   }
   ```

2. **Calculator Results**:
   ```typescript
   interface CalculationResult<T> {
     value: T;
     metadata: {
       timestamp: Date;
       precision: number;
     };
   }
   ```

## Component Organization

### File Structure

```
ComponentName/
├── types.ts           # Type definitions
├── constants.ts       # Constants and defaults
├── utils.ts          # Utility functions
├── useComponent.ts   # Custom hook
├── components/       # Sub-components
│   ├── index.ts
│   └── ...
└── index.tsx         # Main component
```

### Type Exports

1. **Centralize types** in `types.ts`:

   ```typescript
   // types.ts
   export interface ComponentProps {...}
   export interface ComponentState {...}
   export type ComponentAction = {...}
   ```

2. **Re-export components** through index:
   ```typescript
   // index.ts
   export * from "./types";
   export * from "./components";
   export { default } from "./ComponentName";
   ```

## State Management

### Hook State Types

1. **Define state interface**:

   ```typescript
   interface CalculatorState {
     values: InputValues;
     errors: ValidationError[];
     result: CalculationResult | null;
     status: "idle" | "calculating" | "error" | "success";
   }
   ```

2. **Type state updates**:
   ```typescript
   const updateField = (field: keyof InputValues, value: number) => {
     setValues((prev) => ({ ...prev, [field]: value }));
   };
   ```

### Custom Hooks

1. **Return typed tuples**:

   ```typescript
   function useCalculator(): [CalculatorState, CalculatorActions] {
     // Implementation
   }
   ```

2. **Type action creators**:
   ```typescript
   interface CalculatorActions {
     updateField: (field: keyof InputValues, value: number) => void;
     reset: () => void;
     calculate: () => Promise<void>;
   }
   ```

## Utility Functions

### Type Guards

1. **Create custom type guards**:

   ```typescript
   function isValidResult(value: unknown): value is CalculationResult {
     return (
       typeof value === "object" &&
       value !== null &&
       "value" in value &&
       "metadata" in value
     );
   }
   ```

2. **Use assertion functions**:
   ```typescript
   function assertValidInput(input: unknown): asserts input is InputValues {
     if (!isValidInput(input)) {
       throw new Error("Invalid input values");
     }
   }
   ```

### Generic Utilities

1. **Type safe formatters**:

   ```typescript
   function formatCurrency(amount: number, currency: string = "USD"): string {
     return new Intl.NumberFormat("en-US", {
       style: "currency",
       currency,
     }).format(amount);
   }
   ```

2. **Generic error handlers**:
   ```typescript
   function handleError<T>(error: unknown): Result<T> {
     if (error instanceof ValidationError) {
       return { type: "validation", errors: error.errors };
     }
     return { type: "unknown", message: String(error) };
   }
   ```

## Common Patterns

### Enum-like Constants

```typescript
const CALCULATOR_STATUS = {
  IDLE: "idle",
  CALCULATING: "calculating",
  ERROR: "error",
  SUCCESS: "success",
} as const;

type CalculatorStatus =
  (typeof CALCULATOR_STATUS)[keyof typeof CALCULATOR_STATUS];
```

### Mapped Types

```typescript
type ValidationRules<T> = {
  [K in keyof T]: {
    required?: boolean;
    min?: number;
    max?: number;
    validate?: (value: T[K]) => boolean;
  };
};
```

### Builder Pattern

```typescript
class CalculationBuilder<T> {
  private result: Partial<CalculationResult<T>> = {};

  withValue(value: T): this {
    this.result.value = value;
    return this;
  }

  withMetadata(metadata: Metadata): this {
    this.result.metadata = metadata;
    return this;
  }

  build(): CalculationResult<T> {
    if (!this.result.value || !this.result.metadata) {
      throw new Error("Missing required fields");
    }
    return this.result as CalculationResult<T>;
  }
}
```

## Type Safety Checks

### Runtime Validation

1. **Input validation**:

   ```typescript
   function validateInput<T>(input: unknown, schema: Schema<T>): T {
     if (!isValid(input, schema)) {
       throw new ValidationError("Invalid input");
     }
     return input as T;
   }
   ```

2. **Result validation**:
   ```typescript
   function validateResult<T>(result: unknown): CalculationResult<T> {
     assertValidResult(result);
     return result;
   }
   ```

### Compile-Time Checks

1. **Strict configuration** in `tsconfig.json`:

   ```json
   {
     "compilerOptions": {
       "strict": true,
       "noImplicitAny": true,
       "strictNullChecks": true,
       "strictFunctionTypes": true,
       "strictBindCallApply": true,
       "strictPropertyInitialization": true,
       "noImplicitThis": true,
       "useUnknownInCatchVariables": true,
       "alwaysStrict": true,
       "noUncheckedIndexedAccess": true,
       "noImplicitReturns": true,
       "noFallthroughCasesInSwitch": true,
       "noImplicitOverride": true,
       "allowUnreachableCode": false
     }
   }
   ```

2. **ESLint rules** for type safety:
   ```json
   {
     "rules": {
       "@typescript-eslint/explicit-function-return-type": "error",
       "@typescript-eslint/no-explicit-any": "error",
       "@typescript-eslint/no-unsafe-assignment": "error",
       "@typescript-eslint/no-unsafe-member-access": "error",
       "@typescript-eslint/no-unsafe-return": "error",
       "@typescript-eslint/restrict-template-expressions": "error",
       "@typescript-eslint/unbound-method": "error"
     }
   }
   ```

## Testing

### Type Testing

1. **Test type definitions**:

   ```typescript
   // @ts-expect-error
   const invalidInput: InputValues = { amount: "not-a-number" };
   ```

2. **Test type guards**:
   ```typescript
   describe("isValidResult", () => {
     it("should type guard valid results", () => {
       const result = { value: 42, metadata: { timestamp: new Date() } };
       if (isValidResult(result)) {
         expect(result.value).toBe(42);
       }
     });
   });
   ```

### Integration Testing

1. **Test type safety across boundaries**:

   ```typescript
   it("should maintain type safety through calculation pipeline", async () => {
     const input: InputValues = { amount: 100 };
     const result = await calculateWithValidation(input);
     expectTypeOf(result).toMatchTypeOf<CalculationResult>();
   });
   ```

2. **Test error handling**:
   ```typescript
   it("should handle type errors gracefully", async () => {
     const invalidInput = { amount: "invalid" };
     await expect(calculateWithValidation(invalidInput as any)).rejects.toThrow(
       ValidationError
     );
   });
   ```

## Best Practices Summary

1. Always define explicit types for props, state, and function parameters/returns
2. Use discriminated unions for complex state management
3. Avoid `any` type, prefer `unknown` with type guards
4. Centralize type definitions in dedicated files
5. Use strict TypeScript configuration
6. Implement runtime type validation
7. Write tests that verify type safety
8. Use ESLint to enforce type safety rules
9. Document type usage and patterns
10. Review type safety during code reviews

