import { renderHook, act } from '@testing-library/react';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  CalculatorError,
  ValidationError,
  CalculationError,
  DataError,
  CalculatorWarning,
  CalculatorInfo,
  ErrorCodes
} from '@/lib/errors/types';
import {
  createValidationError,
  createCalculationError,
  createDataError,
  createWarning,
  createInfo,
  validateNumber,
  validateDate,
  validateFields
} from '@/lib/errors/utils';
import { useCalculatorErrors } from '@/lib/hooks/useCalculatorErrors';
import { CalculatorErrorBoundary } from '@/components/shared/calculators/ui/CalculatorErrorBoundary';

describe('Error Types', () => {
  it('creates validation error correctly', () => {
    const error = new ValidationError('Invalid value', 'testField', 123);
    expect(error.message).toBe('Invalid value');
    expect(error.field).toBe('testField');
    expect(error.value).toBe(123);
    expect(error.severity).toBe('error');
  });

  it('creates calculation error correctly', () => {
    const error = new CalculationError('Calculation failed', ErrorCodes.DIVISION_BY_ZERO);
    expect(error.message).toBe('Calculation failed');
    expect(error.code).toBe('DIVISION_BY_ZERO');
    expect(error.severity).toBe('error');
  });

  it('creates data error correctly', () => {
    const error = new DataError('API error', 404, '/api/data');
    expect(error.message).toBe('API error');
    expect(error.statusCode).toBe(404);
    expect(error.endpoint).toBe('/api/data');
    expect(error.severity).toBe('error');
  });

  it('creates warning correctly', () => {
    const warning = new CalculatorWarning('High risk', 'RISK_WARNING');
    expect(warning.message).toBe('High risk');
    expect(warning.severity).toBe('warning');
  });

  it('creates info message correctly', () => {
    const info = new CalculatorInfo('Helpful tip');
    expect(info.message).toBe('Helpful tip');
    expect(info.severity).toBe('info');
  });
});

describe('Error Utils', () => {
  describe('Error Creation', () => {
    it('creates validation error with formatted message', () => {
      const error = createValidationError('Must be positive', 'amount', -10);
      expect(error.message).toBe('amount: Must be positive (received: -10)');
    });

    it('creates calculation error with field', () => {
      const error = createCalculationError('Division by zero', 'dividend');
      expect(error.message).toBe('Division by zero');
      expect(error.field).toBe('dividend');
    });

    it('creates data error with status', () => {
      const error = createDataError('Not found', 404, '/api/data');
      expect(error.statusCode).toBe(404);
      expect(error.endpoint).toBe('/api/data');
    });

    it('creates warning with field', () => {
      const warning = createWarning('High risk detected', 'investment');
      expect(warning.message).toBe('High risk detected');
      expect(warning.field).toBe('investment');
    });

    it('creates info message', () => {
      const info = createInfo('Tip: Consider diversifying');
      expect(info.message).toBe('Tip: Consider diversifying');
    });
  });

  describe('Validation Functions', () => {
    describe('validateNumber', () => {
      it('validates required numbers', () => {
        expect(validateNumber(undefined, 'test', { required: true })).toBeTruthy();
        expect(validateNumber(null, 'test', { required: true })).toBeTruthy();
        expect(validateNumber('', 'test', { required: true })).toBeTruthy();
        expect(validateNumber(0, 'test', { required: true })).toBeNull();
      });

      it('validates number range', () => {
        expect(validateNumber(5, 'test', { min: 0, max: 10 })).toBeNull();
        expect(validateNumber(-1, 'test', { min: 0 })).toBeTruthy();
        expect(validateNumber(11, 'test', { max: 10 })).toBeTruthy();
      });

      it('validates integers', () => {
        expect(validateNumber(5, 'test', { integer: true })).toBeNull();
        expect(validateNumber(5.5, 'test', { integer: true })).toBeTruthy();
      });
    });

    describe('validateDate', () => {
      it('validates required dates', () => {
        expect(validateDate(undefined, 'test', { required: true })).toBeTruthy();
        expect(validateDate(null, 'test', { required: true })).toBeTruthy();
        expect(validateDate('', 'test', { required: true })).toBeTruthy();
        expect(validateDate('2024-01-01', 'test', { required: true })).toBeNull();
      });

      it('validates date range', () => {
        const min = new Date('2024-01-01');
        const max = new Date('2024-12-31');
        expect(validateDate('2024-06-01', 'test', { min, max })).toBeNull();
        expect(validateDate('2023-12-31', 'test', { min })).toBeTruthy();
        expect(validateDate('2025-01-01', 'test', { max })).toBeTruthy();
      });
    });

    describe('validateFields', () => {
      it('validates multiple fields', () => {
        const values = {
          amount: 100,
          date: '2024-01-01'
        };

        const validations = {
          amount: (value: unknown) => validateNumber(value, 'amount', { min: 0 }),
          date: (value: unknown) => validateDate(value, 'date')
        };

        const errors = validateFields(values, validations);
        expect(errors).toHaveLength(0);
      });

      it('collects all validation errors', () => {
        const values = {
          amount: -100,
          date: 'invalid'
        };

        const validations = {
          amount: (value: unknown) => validateNumber(value, 'amount', { min: 0 }),
          date: (value: unknown) => validateDate(value, 'date')
        };

        const errors = validateFields(values, validations);
        expect(errors).toHaveLength(2);
      });
    });
  });
});

describe('useCalculatorErrors Hook', () => {
  it('initializes with empty state', () => {
    const { result } = renderHook(() => useCalculatorErrors('test-calculator'));
    
    expect(result.current.errors).toHaveLength(0);
    expect(result.current.lastError).toBeNull();
    expect(result.current.hasErrors).toBe(false);
    expect(result.current.hasWarnings).toBe(false);
    expect(result.current.hasInfo).toBe(false);
  });

  it('adds and manages errors', () => {
    const { result } = renderHook(() => useCalculatorErrors('test-calculator'));
    
    act(() => {
      result.current.addError(new ValidationError('Test error', 'field'));
    });

    expect(result.current.errors).toHaveLength(1);
    expect(result.current.hasErrors).toBe(true);
    expect(result.current.lastError).toBeTruthy();
  });

  it('clears errors', () => {
    const { result } = renderHook(() => useCalculatorErrors('test-calculator'));
    
    act(() => {
      result.current.addError(new ValidationError('Test error', 'field'));
      result.current.clearErrors();
    });

    expect(result.current.errors).toHaveLength(0);
    expect(result.current.hasErrors).toBe(false);
    expect(result.current.lastError).toBeNull();
  });

  it('manages operation context', () => {
    const { result } = renderHook(() => useCalculatorErrors('test-calculator'));
    
    act(() => {
      result.current.startOperation('calculate', { value: 100 });
      result.current.handleError(new Error('Test error'));
      result.current.endOperation();
    });

    expect(result.current.errors).toHaveLength(1);
    expect(result.current.lastError?.message).toBe('Test error');
  });

  it('filters errors by severity', () => {
    const { result } = renderHook(() => useCalculatorErrors('test-calculator'));
    
    act(() => {
      result.current.addError(new ValidationError('Error', 'field1'));
      result.current.addError(new CalculatorWarning('Warning', 'WARNING'));
      result.current.addError(new CalculatorInfo('Info'));
    });

    expect(result.current.getErrorsBySeverity('error')).toHaveLength(1);
    expect(result.current.getErrorsBySeverity('warning')).toHaveLength(1);
    expect(result.current.getErrorsBySeverity('info')).toHaveLength(1);
  });

  it('filters errors by field', () => {
    const { result } = renderHook(() => useCalculatorErrors('test-calculator'));
    
    act(() => {
      result.current.addError(new ValidationError('Error 1', 'field1'));
      result.current.addError(new ValidationError('Error 2', 'field1'));
      result.current.addError(new ValidationError('Error 3', 'field2'));
    });

    expect(result.current.getFieldErrors('field1')).toHaveLength(2);
    expect(result.current.getFieldErrors('field2')).toHaveLength(1);
  });
});

describe('CalculatorErrorBoundary', () => {
  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders children when no error', () => {
    render(
      <CalculatorErrorBoundary calculatorId="test">
        <div>Test Content</div>
      </CalculatorErrorBoundary>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders error UI when error occurs', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <CalculatorErrorBoundary calculatorId="test">
        <ThrowError />
      </CalculatorErrorBoundary>
    );

    expect(screen.getByText('Calculator Error')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('calls error handler when provided', () => {
    const onError = jest.fn();
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <CalculatorErrorBoundary calculatorId="test" onError={onError}>
        <ThrowError />
      </CalculatorErrorBoundary>
    );

    expect(onError).toHaveBeenCalled();
  });

  it('resets on try again click', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };

    render(
      <CalculatorErrorBoundary calculatorId="test">
        <ThrowError />
      </CalculatorErrorBoundary>
    );

    expect(screen.getByText('Calculator Error')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Try Again'));

    // Error should still show since the component will throw again
    expect(screen.getByText('Calculator Error')).toBeInTheDocument();
  });
});

