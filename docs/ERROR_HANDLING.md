# Error Handling System Documentation

## Overview

The error handling system provides a standardized way to handle, track, and display errors across the calculator components. It includes custom error types, utility functions, an error boundary component, and a dedicated hook for error management.

## Table of Contents

1. [Error Types](#error-types)
2. [Error Utilities](#error-utilities)
3. [Error Boundary](#error-boundary)
4. [Error Hook](#error-hook)
5. [Integration with Calculators](#integration-with-calculators)
6. [Best Practices](#best-practices)
7. [Examples](#examples)

## Error Types

### Base Error Type

\`\`\`typescript
interface AppError {
message: string;
code: string;
severity: 'error' | 'warning' | 'info';
context?: Record<string, unknown>;
timestamp: number;
}
\`\`\`

### Calculator-Specific Error Types

\`\`\`typescript
interface CalculatorError extends AppError {
calculatorId: string;
inputField?: string;
validationRule?: string;
}

interface ValidationError extends CalculatorError {
severity: 'warning';
validationRule: string;
expectedValue?: unknown;
actualValue?: unknown;
}

interface CalculationError extends CalculatorError {
severity: 'error';
operation: string;
parameters?: Record<string, unknown>;
}
\`\`\`

## Error Utilities

### Creating Errors

\`\`\`typescript
// Create a validation error
const error = createValidationError({
message: 'Interest rate must be between 0 and 100',
code: 'INVALID_INTEREST_RATE',
calculatorId: 'investment',
inputField: 'interestRate',
validationRule: 'range',
expectedValue: { min: 0, max: 100 },
actualValue: 150
});

// Create a calculation error
const error = createCalculationError({
message: 'Division by zero',
code: 'CALCULATION_ERROR',
calculatorId: 'investment',
operation: 'calculateReturn',
parameters: { principal: 1000, rate: 0 }
});
\`\`\`

### Error Formatting

\`\`\`typescript
// Format error for display
const formatted = formatError(error);
// Returns: { title: 'Invalid Interest Rate', message: '...', severity: 'warning' }
\`\`\`

## Error Boundary

The \`CalculatorErrorBoundary\` component provides a fallback UI when unhandled errors occur in calculator components.

### Usage

\`\`\`tsx
<CalculatorErrorBoundary
fallback={({ error, resetError }) => (
<div>
<h3>Something went wrong</h3>
<p>{error.message}</p>
<button onClick={resetError}>Try again</button>
</div>
)}

>   <CalculatorComponent />
> </CalculatorErrorBoundary>
> \`\`\`

### Features

- Catches JavaScript errors in child components
- Provides error recovery mechanisms
- Logs errors to monitoring system
- Preserves calculator state during recovery
- Supports custom fallback UI

## Error Hook

The \`useCalculatorErrors\` hook provides error management capabilities to calculator components.

### Usage

\`\`\`typescript
const {
errors,
addError,
clearErrors,
hasErrors,
getFieldErrors
} = useCalculatorErrors('investment');

// Add an error
addError({
message: 'Invalid input',
code: 'VALIDATION_ERROR',
severity: 'warning',
inputField: 'amount'
});

// Get errors for a specific field
const amountErrors = getFieldErrors('amount');

// Check for errors
if (hasErrors()) {
// Handle errors
}

// Clear all errors
clearErrors();
\`\`\`

### Features

- Type-safe error management
- Field-level error tracking
- Error severity levels
- Error aggregation
- Error persistence
- Integration with form validation

## Integration with Calculators

### Base Calculator Hook Integration

\`\`\`typescript
function useCalculatorBase<T, R>(config: CalculatorConfig<T, R>) {
const { addError, clearErrors } = useCalculatorErrors(config.id);

const validate = (values: T) => {
clearErrors();

    for (const [field, rules] of Object.entries(config.validation)) {
      const value = values[field];
      const error = rules.validate(value);

      if (error) {
        addError({
          message: error.message,
          code: \`INVALID_\${field.toUpperCase()}\`,
          severity: 'warning',
          inputField: field,
          validationRule: error.rule
        });
      }
    }

};

// ... rest of hook implementation
}
\`\`\`

### Component Integration

\`\`\`tsx
function InvestmentCalculator() {
const { errors, getFieldErrors } = useCalculatorErrors('investment');

return (
<CalculatorErrorBoundary>
<form>
<InputField
name="amount"
errors={getFieldErrors('amount')}
/>
{errors.length > 0 && (
<ErrorSummary errors={errors} />
)}
</form>
</CalculatorErrorBoundary>
);
}
\`\`\`

## Best Practices

1. **Error Categories**

   - Use validation errors for input validation
   - Use calculation errors for computation failures
   - Use app errors for system-level issues

2. **Error Codes**

   - Use consistent naming: \`CATEGORY_SPECIFIC_ERROR\`
   - Include calculator ID in context
   - Make codes searchable and meaningful

3. **Error Messages**

   - Be specific and actionable
   - Include expected vs actual values
   - Use user-friendly language
   - Support internationalization

4. **Error Recovery**

   - Provide clear recovery actions
   - Preserve user input when possible
   - Log unrecoverable errors
   - Implement graceful degradation

5. **Error Monitoring**
   - Log errors to monitoring system
   - Track error frequencies
   - Set up alerts for critical errors
   - Analyze error patterns

## Examples

### Validation Example

\`\`\`typescript
const validateInvestmentAmount = (amount: number): ValidationError | null => {
if (amount < 0) {
return createValidationError({
message: 'Investment amount must be positive',
code: 'INVALID_INVESTMENT_AMOUNT',
calculatorId: 'investment',
inputField: 'amount',
validationRule: 'positive',
actualValue: amount
});
}
return null;
};
\`\`\`

### Calculation Example

\`\`\`typescript
const calculateReturn = (principal: number, rate: number): number => {
if (rate === 0) {
throw createCalculationError({
message: 'Interest rate cannot be zero',
code: 'ZERO_INTEREST_RATE',
calculatorId: 'investment',
operation: 'calculateReturn',
parameters: { principal, rate }
});
}
return principal \* (1 + rate);
};
\`\`\`

### Error Boundary Example

\`\`\`tsx
function CalculatorWrapper() {
return (
<CalculatorErrorBoundary
fallback={({ error, resetError }) => (
<ErrorCard
title="Calculator Error"
message={error.message}
action={{
            label: 'Reset Calculator',
            onClick: resetError
          }}
/>
)}
onError={(error) => {
// Log to monitoring system
monitoringService.logError(error);
}} >
<Calculator />
</CalculatorErrorBoundary>
);
}
\`\`\`

### Complete Error Handling Example

\`\`\`tsx
function InvestmentCalculator() {
const {
errors,
addError,
clearErrors,
getFieldErrors
} = useCalculatorErrors('investment');

const handleCalculate = async (values: InvestmentValues) => {
try {
clearErrors();

      // Validate inputs
      const validationError = validateInvestmentAmount(values.amount);
      if (validationError) {
        addError(validationError);
        return;
      }

      // Perform calculation
      const result = await calculateInvestmentReturn(values);

      // Update state with result
      setResult(result);

    } catch (error) {
      if (isCalculatorError(error)) {
        addError(error);
      } else {
        addError(createCalculationError({
          message: 'An unexpected error occurred',
          code: 'CALCULATION_FAILED',
          calculatorId: 'investment',
          operation: 'calculateInvestmentReturn'
        }));
      }
    }

};

return (
<CalculatorErrorBoundary>
<CalculatorForm
        onSubmit={handleCalculate}
        errors={errors}
        getFieldErrors={getFieldErrors}
      />
</CalculatorErrorBoundary>
);
}
\`\`\`

