import {
  CalculatorError,
  ValidationError,
  CalculationError,
  DataError,
  CalculatorWarning,
  CalculatorInfo,
  ErrorCodes,
  ErrorContext,
  ErrorReportingOptions
} from './types';

/**
 * Creates an error context object with standard fields
 */
export function createErrorContext(
  calculatorId: string,
  operation?: string,
  input?: Record<string, unknown>
): ErrorContext {
  return {
    calculatorId,
    operation,
    timestamp: Date.now(),
    input,
    stack: new Error().stack
  };
}

/**
 * Formats an error message with field and value information
 */
export function formatErrorMessage(
  message: string,
  field?: string,
  value?: unknown
): string {
  let formattedMessage = message;
  if (field) {
    formattedMessage = `${field}: ${formattedMessage}`;
  }
  if (value !== undefined) {
    formattedMessage = `${formattedMessage} (received: ${JSON.stringify(value)})`;
  }
  return formattedMessage;
}

/**
 * Creates a validation error with formatted message
 */
export function createValidationError(
  message: string,
  field: string,
  value?: unknown
): ValidationError {
  return new ValidationError(
    formatErrorMessage(message, field, value),
    field,
    value
  );
}

/**
 * Creates a calculation error with optional field
 */
export function createCalculationError(
  message: string,
  field?: string
): CalculationError {
  return new CalculationError(message, ErrorCodes.INVALID_OPERATION, field);
}

/**
 * Creates a data error from API response
 */
export function createDataError(
  message: string,
  statusCode?: number,
  endpoint?: string
): DataError {
  return new DataError(message, statusCode, endpoint);
}

/**
 * Creates a warning with formatted message
 */
export function createWarning(
  message: string,
  field?: string
): CalculatorWarning {
  return new CalculatorWarning(message, ErrorCodes.WARNING, field);
}

/**
 * Creates an info message with formatted message
 */
export function createInfo(
  message: string,
  field?: string
): CalculatorInfo {
  return new CalculatorInfo(message, ErrorCodes.INFO, field);
}

/**
 * Checks if an error is a specific calculator error type
 */
export function isCalculatorError(error: unknown): error is CalculatorError {
  return error instanceof CalculatorError;
}

/**
 * Checks if an error is a validation error
 */
export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

/**
 * Checks if an error is a calculation error
 */
export function isCalculationError(error: unknown): error is CalculationError {
  return error instanceof CalculationError;
}

/**
 * Checks if an error is a data error
 */
export function isDataError(error: unknown): error is DataError {
  return error instanceof DataError;
}

/**
 * Checks if an error is a warning
 */
export function isWarning(error: unknown): error is CalculatorWarning {
  return error instanceof CalculatorWarning;
}

/**
 * Checks if an error is an info message
 */
export function isInfo(error: unknown): error is CalculatorInfo {
  return error instanceof CalculatorInfo;
}

/**
 * Safely extracts error message from any error type
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
}

/**
 * Groups errors by severity
 */
export function groupErrorsBySeverity(errors: CalculatorError[]) {
  return errors.reduce(
    (groups, error) => {
      groups[error.severity].push(error);
      return groups;
    },
    { error: [], warning: [], info: [] } as Record<ErrorSeverity, CalculatorError[]>
  );
}

/**
 * Formats errors for display
 */
export function formatErrors(errors: CalculatorError[]) {
  const groups = groupErrorsBySeverity(errors);
  return {
    errors: groups.error.map(e => e.message),
    warnings: groups.warning.map(e => e.message),
    info: groups.info.map(e => e.message)
  };
}

/**
 * Prepares error for reporting
 */
export function prepareErrorReport(
  error: unknown,
  context: ErrorContext,
  options: ErrorReportingOptions = {}
) {
  const report: Record<string, unknown> = {
    timestamp: context.timestamp,
    calculatorId: context.calculatorId,
    operation: context.operation
  };

  if (isCalculatorError(error)) {
    report.error = error.toJSON();
  } else {
    report.error = {
      message: getErrorMessage(error),
      name: error instanceof Error ? error.name : 'UnknownError'
    };
  }

  if (options.includeStack && context.stack) {
    report.stack = context.stack;
  }

  if (options.includeInput && context.input) {
    report.input = context.input;
  }

  if (options.includeTiming) {
    report.duration = Date.now() - context.timestamp;
  }

  if (options.tags) {
    report.tags = options.tags;
  }

  return report;
}

/**
 * Validates a number value with common checks
 */
export function validateNumber(
  value: unknown,
  field: string,
  options: {
    required?: boolean;
    min?: number;
    max?: number;
    integer?: boolean;
  } = {}
): CalculatorError | null {
  if (options.required && (value === undefined || value === null || value === '')) {
    return createValidationError('Value is required', field, value);
  }

  if (value === undefined || value === null || value === '') {
    return null;
  }

  const num = Number(value);
  if (isNaN(num)) {
    return createValidationError('Must be a valid number', field, value);
  }

  if (options.integer && !Number.isInteger(num)) {
    return createValidationError('Must be a whole number', field, value);
  }

  if (options.min !== undefined && num < options.min) {
    return createValidationError(`Must be at least ${options.min}`, field, value);
  }

  if (options.max !== undefined && num > options.max) {
    return createValidationError(`Must be no more than ${options.max}`, field, value);
  }

  return null;
}

/**
 * Validates a date value with common checks
 */
export function validateDate(
  value: unknown,
  field: string,
  options: {
    required?: boolean;
    min?: Date;
    max?: Date;
  } = {}
): CalculatorError | null {
  if (options.required && (value === undefined || value === null || value === '')) {
    return createValidationError('Value is required', field, value);
  }

  if (value === undefined || value === null || value === '') {
    return null;
  }

  const date = new Date(value as string);
  if (isNaN(date.getTime())) {
    return createValidationError('Must be a valid date', field, value);
  }

  if (options.min && date < options.min) {
    return createValidationError(`Must be after ${options.min.toLocaleDateString()}`, field, value);
  }

  if (options.max && date > options.max) {
    return createValidationError(`Must be before ${options.max.toLocaleDateString()}`, field, value);
  }

  return null;
}

/**
 * Validates multiple fields at once
 */
export function validateFields(
  values: Record<string, unknown>,
  validations: Record<string, (value: unknown) => CalculatorError | null>
): CalculatorError[] {
  const errors: CalculatorError[] = [];

  for (const [field, validate] of Object.entries(validations)) {
    const error = validate(values[field]);
    if (error) {
      errors.push(error);
    }
  }

  return errors;
}

