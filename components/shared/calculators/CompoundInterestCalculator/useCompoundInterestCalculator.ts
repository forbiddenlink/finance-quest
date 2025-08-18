import { useState, useCallback } from 'react';
import {
  CompoundInterestValues,
  CompoundInterestState,
  CompoundInterestActions,
  UseCompoundInterestCalculator
} from './types';
import {
  safeParseFloat,
  validateInputs,
  calculateCompoundInterest
} from './utils';
import { COMPOUND_INTEREST_CONSTANTS } from './constants';

const initialValues: CompoundInterestValues = {
  initialInvestment: 0,
  monthlyContribution: 0,
  annualInterestRate: 7,
  timeHorizonYears: 30,
  contributionFrequency: 'monthly',
  compoundingFrequency: 'monthly',
  investmentGoal: 'retirement',
  inflationRate: 2.5,
  taxRate: 25
};

const initialState: CompoundInterestState = {
  values: initialValues,
  errors: [],
  result: null,
  showAdvancedOptions: false
};

export const useCompoundInterestCalculator: UseCompoundInterestCalculator = () => {
  const [state, setState] = useState<CompoundInterestState>(initialState);

  const updateValue = useCallback((field: keyof CompoundInterestValues, value: string | number): void => {
    setState(prevState => {
      const newValues = { ...prevState.values };

      if (field === 'investmentGoal') {
        newValues[field] = value as CompoundInterestValues['investmentGoal'];
        newValues.timeHorizonYears = COMPOUND_INTEREST_CONSTANTS.investmentGoals[value as CompoundInterestValues['investmentGoal']].defaultTimeHorizon;
      } else if (field === 'contributionFrequency' || field === 'compoundingFrequency') {
        newValues[field] = value as CompoundInterestValues[typeof field];
      } else {
        newValues[field] = safeParseFloat(value);
      }

      const newErrors = validateInputs(newValues);

      let newResult = null;
      if (newErrors.length === 0) {
        try {
          newResult = calculateCompoundInterest(newValues);
        } catch (error) {
          console.error('Calculation error:', error);
          newErrors.push({
            field: 'calculation',
            message: 'Error calculating compound interest. Please check your inputs.'
          });
        }
      }

      return {
        ...prevState,
        values: newValues,
        errors: newErrors,
        result: newResult
      };
    });
  }, []);

  const setShowAdvancedOptions = useCallback((show: boolean): void => {
    setState(prevState => ({
      ...prevState,
      showAdvancedOptions: show
    }));
  }, []);

  const calculate = useCallback((): void => {
    setState(prevState => {
      const errors = validateInputs(prevState.values);
      if (errors.length > 0) {
        return {
          ...prevState,
          errors,
          result: null
        };
      }

      try {
        const result = calculateCompoundInterest(prevState.values);
        return {
          ...prevState,
          errors: [],
          result
        };
      } catch (error) {
        console.error('Calculation error:', error);
        return {
          ...prevState,
          errors: [{
            field: 'calculation',
            message: 'Error calculating compound interest. Please check your inputs.'
          }],
          result: null
        };
      }
    });
  }, []);

  const reset = useCallback((): void => {
    setState(initialState);
  }, []);

  const actions: CompoundInterestActions = {
    updateValue,
    setShowAdvancedOptions,
    calculate,
    reset
  };

  return [state, actions];
};
