import { useState, useCallback, useMemo, useEffect } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { Decimal } from 'decimal.js';

// Decimal.js is configured in lib/utils/financialCalculations.ts

export interface ValidationRule {
  validate: (value: any, allValues?: any) => boolean;
  message: string;
}

export interface ValidationRules<T> {
  [K in keyof T]?: ValidationRule[];
}

export interface CalculatorDependencies<T> {
  [K in keyof T]?: Array<keyof T>;
}

export interface CalculatorConfig<T, R> {
  id: string;
  initialValues: T;
  validation: ValidationRules<T>;
  compute: (values: T) => R | null;
  dependencies?: CalculatorDependencies<T>;
  formatters?: {
    [K in keyof T]?: (value: T[K]) => string;
  };
  parsers?: {
    [K in keyof T]?: (value: string) => T[K];
  };
}

export interface ValidationError {
  field: keyof any;
  message: string;
}

export interface CalculatorState<T, R> {
  values: T;
  errors: ValidationError[];
  result: R | null;
  isValid: boolean;
  isDirty: boolean;
}

export interface CalculatorActions<T> {
  updateField: (field: keyof T, value: any) => void;
  validateField: (field: keyof T) => boolean;
  validateAll: () => boolean;
  reset: () => void;
  setValues: (values: Partial<T>) => void;
}

const defaultFormatters = {
  number: (value: number) => value.toString(),
  string: (value: string) => value,
  boolean: (value: boolean) => value.toString()
};

const defaultParsers = {
  number: (value: string) => {
    const parsed = new Decimal(value.replace(/[^0-9.-]/g, '')).toNumber();
    return isNaN(parsed) ? 0 : parsed;
  },
  string: (value: string) => value,
  boolean: (value: string) => value === 'true'
};

export function useCalculatorBase<T extends Record<string, any>, R>(
  config: CalculatorConfig<T, R>
): [CalculatorState<T, R>, CalculatorActions<T>] {
  // Initialize state
  const [state, setState] = useState<CalculatorState<T, R>>({
    values: config.initialValues,
    errors: [],
    result: null,
    isValid: true,
    isDirty: false
  });

  // Get progress store function
  const recordCalculatorUsage = useProgressStore(state => state.recordCalculatorUsage);

  // Validate a single field
  const validateField = useCallback((field: keyof T) => {
    const fieldRules = config.validation[field] || [];
    const fieldErrors: ValidationError[] = [];

    for (const rule of fieldRules) {
      if (!rule.validate(state.values[field], state.values)) {
        fieldErrors.push({
          field,
          message: rule.message
        });
      }
    }

    // Check dependent fields
    const dependencies = config.dependencies?.[field] || [];
    for (const dependentField of dependencies) {
      const dependentRules = config.validation[dependentField] || [];
      for (const rule of dependentRules) {
        if (!rule.validate(state.values[dependentField], state.values)) {
          fieldErrors.push({
            field: dependentField,
            message: rule.message
          });
        }
      }
    }

    setState(prev => ({
      ...prev,
      errors: [...prev.errors.filter(e => e.field !== field), ...fieldErrors],
      isValid: fieldErrors.length === 0
    }));

    return fieldErrors.length === 0;
  }, [state.values, config.validation, config.dependencies]);

  // Validate all fields
  const validateAll = useCallback(() => {
    const allErrors: ValidationError[] = [];
    const fields = Object.keys(config.validation) as Array<keyof T>;

    for (const field of fields) {
      const fieldRules = config.validation[field] || [];
      for (const rule of fieldRules) {
        if (!rule.validate(state.values[field], state.values)) {
          allErrors.push({
            field,
            message: rule.message
          });
        }
      }
    }

    setState(prev => ({
      ...prev,
      errors: allErrors,
      isValid: allErrors.length === 0
    }));

    return allErrors.length === 0;
  }, [state.values, config.validation]);

  // Update a field value
  const updateField = useCallback((field: keyof T, value: any) => {
    const parser = config.parsers?.[field] || defaultParsers[typeof config.initialValues[field]];
    const parsedValue = parser(value.toString());

    setState(prev => ({
      ...prev,
      values: {
        ...prev.values,
        [field]: parsedValue
      },
      isDirty: true
    }));

    validateField(field);
  }, [validateField, config.parsers, config.initialValues]);

  // Reset calculator state
  const reset = useCallback(() => {
    setState({
      values: config.initialValues,
      errors: [],
      result: null,
      isValid: true,
      isDirty: false
    });
  }, [config.initialValues]);

  // Set multiple values at once
  const setValues = useCallback((values: Partial<T>) => {
    setState(prev => ({
      ...prev,
      values: {
        ...prev.values,
        ...values
      },
      isDirty: true
    }));
    validateAll();
  }, [validateAll]);

  // Compute result when values change and valid
  useEffect(() => {
    if (state.isDirty && state.isValid) {
      const result = config.compute(state.values);
      setState(prev => ({
        ...prev,
        result
      }));
    }
  }, [state.values, state.isValid, state.isDirty, config.compute]);

  // Record calculator usage
  useEffect(() => {
    recordCalculatorUsage(config.id);
  }, [config.id, recordCalculatorUsage]);

  return [
    state,
    {
      updateField,
      validateField,
      validateAll,
      reset,
      setValues
    }
  ];
}

// Common validation rules
export const commonValidations = {
  required: (message: string = 'This field is required'): ValidationRule => ({
    validate: value => value !== undefined && value !== null && value !== '',
    message
  }),
  min: (min: number, message?: string): ValidationRule => ({
    validate: value => new Decimal(value).gte(min),
    message: message || `Value must be at least ${min}`
  }),
  max: (max: number, message?: string): ValidationRule => ({
    validate: value => new Decimal(value).lte(max),
    message: message || `Value must be no more than ${max}`
  }),
  positive: (message: string = 'Value must be positive'): ValidationRule => ({
    validate: value => new Decimal(value).gt(0),
    message
  }),
  integer: (message: string = 'Value must be a whole number'): ValidationRule => ({
    validate: value => Number.isInteger(Number(value)),
    message
  }),
  percentage: (message: string = 'Value must be between 0 and 100'): ValidationRule => ({
    validate: value => new Decimal(value).gte(0) && new Decimal(value).lte(100),
    message
  })
};
