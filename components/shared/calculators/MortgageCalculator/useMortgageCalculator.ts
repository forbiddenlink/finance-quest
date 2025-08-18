import { useState, useCallback } from 'react';
import {
  MortgageValues,
  MortgageState,
  MortgageActions,
  ValidationError,
  UseMortgageCalculator
} from './types';
import {
  safeParseFloat,
  validateInputs,
  calculateMortgage,
  calculateDownPaymentAmount,
  calculateDownPaymentPercentage
} from './utils';
import { MORTGAGE_CONSTANTS } from './constants';

const initialValues: MortgageValues = {
  homePrice: 0,
  downPayment: 0,
  interestRate: 5.5,
  termYears: '30',
  propertyTax: 3600,
  homeInsurance: 1200,
  pmi: 0,
  hoaFees: 0
};

const initialState: MortgageState = {
  values: initialValues,
  errors: [],
  result: null,
  downPaymentType: 'percentage',
  includeExtras: false
};

export const useMortgageCalculator: UseMortgageCalculator = () => {
  const [state, setState] = useState<MortgageState>(initialState);

  const updateValue = useCallback((field: keyof MortgageValues, value: string | number): void => {
    setState(prevState => {
      const newValues = { ...prevState.values };

      if (field === 'termYears') {
        newValues[field] = value as string;
      } else {
        const numericValue = safeParseFloat(value);
        newValues[field] = numericValue;

        // Update down payment when home price changes
        if (field === 'homePrice' && prevState.downPaymentType === 'percentage') {
          const currentPercentage = calculateDownPaymentPercentage(
            prevState.values.homePrice,
            prevState.values.downPayment
          );
          newValues.downPayment = calculateDownPaymentAmount(numericValue, currentPercentage);
        }
      }

      const newErrors = validateInputs(newValues);

      let newResult = null;
      if (newErrors.length === 0) {
        try {
          newResult = calculateMortgage(newValues);
        } catch (error) {
          console.error('Calculation error:', error);
          newErrors.push({
            field: 'calculation',
            message: 'Error calculating mortgage. Please check your inputs.'
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

  const setDownPaymentType = useCallback((type: 'percentage' | 'amount'): void => {
    setState(prevState => {
      let newDownPayment = prevState.values.downPayment;

      if (type === 'percentage') {
        const currentPercentage = calculateDownPaymentPercentage(
          prevState.values.homePrice,
          prevState.values.downPayment
        );
        newDownPayment = calculateDownPaymentAmount(prevState.values.homePrice, currentPercentage);
      }

      const newValues = {
        ...prevState.values,
        downPayment: newDownPayment
      };

      const newErrors = validateInputs(newValues);

      return {
        ...prevState,
        values: newValues,
        errors: newErrors,
        downPaymentType: type
      };
    });
  }, []);

  const setIncludeExtras = useCallback((include: boolean): void => {
    setState(prevState => ({
      ...prevState,
      includeExtras: include
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
        const result = calculateMortgage(prevState.values);
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
            message: 'Error calculating mortgage. Please check your inputs.'
          }],
          result: null
        };
      }
    });
  }, []);

  const reset = useCallback((): void => {
    setState(initialState);
  }, []);

  const actions: MortgageActions = {
    updateValue,
    setDownPaymentType,
    setIncludeExtras,
    calculate,
    reset
  };

  return [state, actions];
};
