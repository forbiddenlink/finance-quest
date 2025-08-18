import { useState, useCallback, useRef, useEffect } from 'react';
import {
  CalculatorError,
  ErrorContext,
  ErrorReportingOptions,
  ErrorSeverity
} from '../errors/types';
import {
  createErrorContext,
  groupErrorsBySeverity,
  prepareErrorReport
} from '../errors/utils';

interface ErrorState {
  errors: CalculatorError[];
  lastError: CalculatorError | null;
  hasErrors: boolean;
  hasWarnings: boolean;
  hasInfo: boolean;
}

interface ErrorHandlerOptions {
  /**
   * Maximum number of errors to keep in history
   */
  maxErrors?: number;

  /**
   * Whether to automatically clear errors when inputs change
   */
  autoClear?: boolean;

  /**
   * Error reporting options
   */
  reporting?: ErrorReportingOptions;

  /**
   * Callback when errors change
   */
  onError?: (error: CalculatorError) => void;
}

export function useCalculatorErrors(
  calculatorId: string,
  options: ErrorHandlerOptions = {}
) {
  const {
    maxErrors = 10,
    autoClear = true,
    reporting = {},
    onError
  } = options;

  const [state, setState] = useState<ErrorState>({
    errors: [],
    lastError: null,
    hasErrors: false,
    hasWarnings: false,
    hasInfo: false
  });

  // Keep track of operation context
  const contextRef = useRef<ErrorContext>();

  // Start operation tracking
  const startOperation = useCallback((operation: string, input?: Record<string, unknown>) => {
    contextRef.current = createErrorContext(calculatorId, operation, input);
  }, [calculatorId]);

  // End operation tracking
  const endOperation = useCallback(() => {
    contextRef.current = undefined;
  }, []);

  // Add a new error
  const addError = useCallback((error: CalculatorError) => {
    setState(prev => {
      const newErrors = [...prev.errors, error].slice(-maxErrors);
      const groups = groupErrorsBySeverity(newErrors);

      return {
        errors: newErrors,
        lastError: error,
        hasErrors: groups.error.length > 0,
        hasWarnings: groups.warning.length > 0,
        hasInfo: groups.info.length > 0
      };
    });

    // Report error if handler provided
    if (onError) {
      onError(error);
    }

    // Prepare and log error report
    if (contextRef.current) {
      const report = prepareErrorReport(error, contextRef.current, reporting);
      console.error('Calculator Error:', report);
    }
  }, [maxErrors, onError, reporting]);

  // Clear all errors
  const clearErrors = useCallback(() => {
    setState({
      errors: [],
      lastError: null,
      hasErrors: false,
      hasWarnings: false,
      hasInfo: false
    });
  }, []);

  // Clear errors of specific severity
  const clearErrorsBySeverity = useCallback((severity: ErrorSeverity) => {
    setState(prev => {
      const newErrors = prev.errors.filter(e => e.severity !== severity);
      const groups = groupErrorsBySeverity(newErrors);

      return {
        errors: newErrors,
        lastError: prev.lastError?.severity === severity ? null : prev.lastError,
        hasErrors: groups.error.length > 0,
        hasWarnings: groups.warning.length > 0,
        hasInfo: groups.info.length > 0
      };
    });
  }, []);

  // Handle error with context
  const handleError = useCallback((
    error: unknown,
    operation?: string,
    input?: Record<string, unknown>
  ) => {
    // Create operation context if not already started
    if (!contextRef.current && operation) {
      startOperation(operation, input);
    }

    // Convert error to CalculatorError if needed
    let calcError: CalculatorError;
    if (error instanceof CalculatorError) {
      calcError = error;
    } else if (error instanceof Error) {
      calcError = new CalculatorError(
        error.message,
        'INTERNAL_ERROR',
        'error'
      );
    } else {
      calcError = new CalculatorError(
        'An unknown error occurred',
        'UNKNOWN_ERROR',
        'error'
      );
    }

    // Add error to state
    addError(calcError);

    // End operation tracking
    if (operation) {
      endOperation();
    }

    return calcError;
  }, [startOperation, addError, endOperation]);

  // Get errors by severity
  const getErrorsBySeverity = useCallback((severity: ErrorSeverity) => {
    return state.errors.filter(e => e.severity === severity);
  }, [state.errors]);

  // Get errors for specific field
  const getFieldErrors = useCallback((field: string) => {
    return state.errors.filter(e => e.field === field);
  }, [state.errors]);

  // Auto-clear errors when component unmounts
  useEffect(() => {
    return () => {
      if (autoClear) {
        clearErrors();
      }
    };
  }, [autoClear, clearErrors]);

  return {
    // State
    errors: state.errors,
    lastError: state.lastError,
    hasErrors: state.hasErrors,
    hasWarnings: state.hasWarnings,
    hasInfo: state.hasInfo,

    // Error Management
    addError,
    handleError,
    clearErrors,
    clearErrorsBySeverity,
    getErrorsBySeverity,
    getFieldErrors,

    // Operation Context
    startOperation,
    endOperation
  };
}

