import { renderHook, act } from '@testing-library/react';
import { useCalculatorBase, commonValidations } from '@/lib/hooks/useCalculatorBase';
import { Decimal } from 'decimal.js';

// Mock the progress store
jest.mock('@/lib/store/progressStore', () => ({
  useProgressStore: () => (calculatorId: string) => {}
}));

// Test calculator types
interface TestCalculatorValues {
  value1: number;
  value2: number;
  value3: string;
}

interface TestCalculatorResult {
  sum: number;
  product: number;
  isValid: boolean;
}

describe('useCalculatorBase', () => {
  // Basic calculator configuration for tests
  const baseConfig = {
    id: 'test-calculator',
    initialValues: {
      value1: 0,
      value2: 0,
      value3: ''
    },
    validation: {
      value1: [
        commonValidations.required(),
        commonValidations.min(0),
        commonValidations.max(100)
      ],
      value2: [
        commonValidations.required(),
        commonValidations.positive()
      ],
      value3: [
        commonValidations.required('Text is required')
      ]
    },
    compute: (values: TestCalculatorValues): TestCalculatorResult => ({
      sum: new Decimal(values.value1).plus(values.value2).toNumber(),
      product: new Decimal(values.value1).times(values.value2).toNumber(),
      isValid: values.value3.length > 0
    })
  };

  describe('Initialization', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useCalculatorBase(baseConfig));
      const [state] = result.current;

      expect(state.values).toEqual(baseConfig.initialValues);
      expect(state.errors).toEqual([]);
      expect(state.isValid).toBe(true);
      expect(state.isDirty).toBe(false);
      expect(state.result).toBe(null);
    });

    it('should record calculator usage', () => {
      const mockRecordUsage = jest.fn();
      jest.spyOn(require('@/lib/store/progressStore'), 'useProgressStore')
        .mockImplementation(() => mockRecordUsage);

      renderHook(() => useCalculatorBase(baseConfig));
      expect(mockRecordUsage).toHaveBeenCalledWith('test-calculator');
    });
  });

  describe('Field Updates', () => {
    it('should update field values', () => {
      const { result } = renderHook(() => useCalculatorBase(baseConfig));
      const [, actions] = result.current;

      act(() => {
        actions.updateField('value1', 50);
      });

      expect(result.current[0].values.value1).toBe(50);
      expect(result.current[0].isDirty).toBe(true);
    });

    it('should handle multiple field updates', () => {
      const { result } = renderHook(() => useCalculatorBase(baseConfig));
      const [, actions] = result.current;

      act(() => {
        actions.setValues({
          value1: 25,
          value2: 75
        });
      });

      expect(result.current[0].values.value1).toBe(25);
      expect(result.current[0].values.value2).toBe(75);
      expect(result.current[0].isDirty).toBe(true);
    });

    it('should parse values correctly', () => {
      const { result } = renderHook(() => useCalculatorBase({
        ...baseConfig,
        parsers: {
          value1: (value: string) => parseInt(value) * 2
        }
      }));
      const [, actions] = result.current;

      act(() => {
        actions.updateField('value1', '25');
      });

      expect(result.current[0].values.value1).toBe(50);
    });
  });

  describe('Validation', () => {
    it('should validate required fields', () => {
      const { result } = renderHook(() => useCalculatorBase(baseConfig));
      const [, actions] = result.current;

      act(() => {
        actions.updateField('value3', '');
        actions.validateField('value3');
      });

      expect(result.current[0].errors).toContainEqual({
        field: 'value3',
        message: 'Text is required'
      });
      expect(result.current[0].isValid).toBe(false);
    });

    it('should validate numeric constraints', () => {
      const { result } = renderHook(() => useCalculatorBase(baseConfig));
      const [, actions] = result.current;

      act(() => {
        actions.updateField('value1', 150);
        actions.validateField('value1');
      });

      expect(result.current[0].errors).toContainEqual({
        field: 'value1',
        message: 'Value must be no more than 100'
      });
    });

    it('should validate dependent fields', () => {
      const configWithDependencies = {
        ...baseConfig,
        dependencies: {
          value1: ['value2']
        },
        validation: {
          ...baseConfig.validation,
          value2: [
            {
              validate: (value: number, allValues: TestCalculatorValues) => 
                value <= allValues.value1,
              message: 'Value2 must be less than or equal to Value1'
            }
          ]
        }
      };

      const { result } = renderHook(() => useCalculatorBase(configWithDependencies));
      const [, actions] = result.current;

      act(() => {
        actions.updateField('value1', 50);
        actions.updateField('value2', 75);
        actions.validateField('value1');
      });

      expect(result.current[0].errors).toContainEqual({
        field: 'value2',
        message: 'Value2 must be less than or equal to Value1'
      });
    });

    it('should clear errors when field becomes valid', () => {
      const { result } = renderHook(() => useCalculatorBase(baseConfig));
      const [, actions] = result.current;

      act(() => {
        actions.updateField('value1', -10);
        actions.validateField('value1');
      });

      expect(result.current[0].errors.length).toBeGreaterThan(0);

      act(() => {
        actions.updateField('value1', 50);
        actions.validateField('value1');
      });

      expect(result.current[0].errors.length).toBe(0);
    });
  });

  describe('Computation', () => {
    it('should compute results when values are valid', () => {
      const { result } = renderHook(() => useCalculatorBase(baseConfig));
      const [, actions] = result.current;

      act(() => {
        actions.setValues({
          value1: 25,
          value2: 75,
          value3: 'valid'
        });
      });

      expect(result.current[0].result).toEqual({
        sum: 100,
        product: 1875,
        isValid: true
      });
    });

    it('should not compute results when values are invalid', () => {
      const { result } = renderHook(() => useCalculatorBase(baseConfig));
      const [, actions] = result.current;

      act(() => {
        actions.setValues({
          value1: -25, // Invalid: must be positive
          value2: 75,
          value3: 'valid'
        });
      });

      expect(result.current[0].result).toBe(null);
    });

    it('should handle computation errors gracefully', () => {
      const configWithError = {
        ...baseConfig,
        compute: () => {
          throw new Error('Computation failed');
        }
      };

      const { result } = renderHook(() => useCalculatorBase(configWithError));
      const [, actions] = result.current;

      act(() => {
        actions.setValues({
          value1: 25,
          value2: 75,
          value3: 'valid'
        });
      });

      expect(result.current[0].result).toBe(null);
    });
  });

  describe('Reset Functionality', () => {
    it('should reset to initial values', () => {
      const { result } = renderHook(() => useCalculatorBase(baseConfig));
      const [, actions] = result.current;

      act(() => {
        actions.setValues({
          value1: 25,
          value2: 75,
          value3: 'changed'
        });
      });

      expect(result.current[0].values).not.toEqual(baseConfig.initialValues);

      act(() => {
        actions.reset();
      });

      expect(result.current[0].values).toEqual(baseConfig.initialValues);
      expect(result.current[0].errors).toEqual([]);
      expect(result.current[0].isDirty).toBe(false);
      expect(result.current[0].result).toBe(null);
    });
  });

  describe('Common Validations', () => {
    it('should validate required fields correctly', () => {
      const required = commonValidations.required();
      expect(required.validate('')).toBe(false);
      expect(required.validate(0)).toBe(true);
      expect(required.validate(null)).toBe(false);
      expect(required.validate(undefined)).toBe(false);
      expect(required.validate('test')).toBe(true);
    });

    it('should validate numeric ranges correctly', () => {
      const min = commonValidations.min(10);
      const max = commonValidations.max(100);
      
      expect(min.validate(5)).toBe(false);
      expect(min.validate(15)).toBe(true);
      expect(max.validate(150)).toBe(false);
      expect(max.validate(50)).toBe(true);
    });

    it('should validate percentages correctly', () => {
      const percentage = commonValidations.percentage();
      
      expect(percentage.validate(-10)).toBe(false);
      expect(percentage.validate(150)).toBe(false);
      expect(percentage.validate(75)).toBe(true);
      expect(percentage.validate(0)).toBe(true);
      expect(percentage.validate(100)).toBe(true);
    });
  });
});
