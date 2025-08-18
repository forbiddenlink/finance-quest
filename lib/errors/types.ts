/**
 * Base error class for all calculator errors
 */
export class CalculatorError extends Error {
  constructor(
    message: string,
    public code: string,
    public severity: 'error' | 'warning' | 'info' = 'error',
    public field?: string,
    public value?: unknown
  ) {
    super(message);
    this.name = 'CalculatorError';
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      severity: this.severity,
      field: this.field,
      value: this.value
    };
  }
}

/**
 * Validation error for invalid input values
 */
export class ValidationError extends CalculatorError {
  constructor(message: string, field: string, value?: unknown) {
    super(message, 'VALIDATION_ERROR', 'error', field, value);
    this.name = 'ValidationError';
  }
}

/**
 * Calculation error for mathematical or logical errors
 */
export class CalculationError extends CalculatorError {
  constructor(message: string, code = 'CALCULATION_ERROR', field?: string) {
    super(message, code, 'error', field);
    this.name = 'CalculationError';
  }
}

/**
 * Data error for issues with external data or API calls
 */
export class DataError extends CalculatorError {
  constructor(
    message: string,
    public statusCode?: number,
    public endpoint?: string
  ) {
    super(message, 'DATA_ERROR', 'error');
    this.name = 'DataError';
  }

  toJSON() {
    return {
      ...super.toJSON(),
      statusCode: this.statusCode,
      endpoint: this.endpoint
    };
  }
}

/**
 * Warning for non-critical issues that should be brought to user's attention
 */
export class CalculatorWarning extends CalculatorError {
  constructor(message: string, code = 'WARNING', field?: string) {
    super(message, code, 'warning', field);
    this.name = 'CalculatorWarning';
  }
}

/**
 * Informational message for user guidance
 */
export class CalculatorInfo extends CalculatorError {
  constructor(message: string, code = 'INFO', field?: string) {
    super(message, code, 'info', field);
    this.name = 'CalculatorInfo';
  }
}

/**
 * Error codes for specific calculator error scenarios
 */
export const ErrorCodes = {
  // Validation Errors
  REQUIRED_FIELD: 'REQUIRED_FIELD',
  INVALID_NUMBER: 'INVALID_NUMBER',
  OUT_OF_RANGE: 'OUT_OF_RANGE',
  INVALID_DATE: 'INVALID_DATE',
  INVALID_FORMAT: 'INVALID_FORMAT',
  DEPENDENCY_ERROR: 'DEPENDENCY_ERROR',

  // Calculation Errors
  DIVISION_BY_ZERO: 'DIVISION_BY_ZERO',
  OVERFLOW_ERROR: 'OVERFLOW_ERROR',
  NEGATIVE_ROOT: 'NEGATIVE_ROOT',
  INVALID_OPERATION: 'INVALID_OPERATION',
  CONVERGENCE_ERROR: 'CONVERGENCE_ERROR',

  // Data Errors
  API_ERROR: 'API_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',

  // Business Logic Errors
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  EXCEEDS_LIMIT: 'EXCEEDS_LIMIT',
  INVALID_STATE: 'INVALID_STATE',
  UNSUPPORTED_OPERATION: 'UNSUPPORTED_OPERATION',

  // System Errors
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  CONFIGURATION_ERROR: 'CONFIGURATION_ERROR',
  DEPENDENCY_MISSING: 'DEPENDENCY_MISSING'
} as const;

/**
 * Type for error code strings
 */
export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];

/**
 * Type for calculator error severity levels
 */
export type ErrorSeverity = 'error' | 'warning' | 'info';

/**
 * Interface for error context data
 */
export interface ErrorContext {
  calculatorId: string;
  operation?: string;
  timestamp: number;
  input?: Record<string, unknown>;
  stack?: string;
  [key: string]: unknown;
}

/**
 * Interface for error reporting options
 */
export interface ErrorReportingOptions {
  includeStack?: boolean;
  includeInput?: boolean;
  includeTiming?: boolean;
  tags?: Record<string, string>;
}

