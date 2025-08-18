import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Debt,
  DebtType,
  PayoffStrategy,
  ValidationError,
  DebtPayoffState,
  DebtPayoffActions,
  UseDebtPayoffCalculator
} from './types';
import {
  DEBT_TYPES,
  safeParseFloat,
  validateDebt,
  calculatePayoffSchedule
} from './utils';

const createInitialDebt = (): Debt => ({
  id: uuidv4(),
  name: '',
  type: 'credit_card',
  balance: 0,
  interestRate: DEBT_TYPES.credit_card.defaultInterestRate,
  minimumPayment: 0
});

const initialState: DebtPayoffState = {
  debts: [createInitialDebt()],
  extraPayment: '0',
  payoffStrategy: 'avalanche',
  validationErrors: [],
  results: null
};

export const useDebtPayoffCalculator: UseDebtPayoffCalculator = () => {
  const [state, setState] = useState<DebtPayoffState>(initialState);

  const validateInputs = useCallback((debts: Debt[], extraPayment: string): ValidationError[] => {
    const errors: ValidationError[] = [];

    // Validate debts
    debts.forEach((debt, index) => {
      if (!validateDebt(debt)) {
        if (debt.balance <= 0) {
          errors.push({
            field: `debt-${debt.id}-balance`,
            message: `Debt ${index + 1}: Balance must be greater than $0`
          });
        }
        if (debt.minimumPayment <= 0) {
          errors.push({
            field: `debt-${debt.id}-minimum`,
            message: `Debt ${index + 1}: Minimum payment must be greater than $0`
          });
        }
        if (debt.minimumPayment > debt.balance) {
          errors.push({
            field: `debt-${debt.id}-minimum`,
            message: `Debt ${index + 1}: Minimum payment cannot exceed balance`
          });
        }
        if (debt.interestRate < 0 || debt.interestRate > 100) {
          errors.push({
            field: `debt-${debt.id}-rate`,
            message: `Debt ${index + 1}: Interest rate must be between 0-100%`
          });
        }
        if (!debt.name.trim()) {
          errors.push({
            field: `debt-${debt.id}-name`,
            message: `Debt ${index + 1}: Name is required`
          });
        }
      }
    });

    // Validate extra payment
    const extraPaymentNum = parseFloat(extraPayment);
    if (isNaN(extraPaymentNum) || extraPaymentNum < 0) {
      errors.push({
        field: 'extra-payment',
        message: 'Extra payment must be $0 or greater'
      });
    }

    return errors;
  }, []);

  const addDebt = useCallback((): void => {
    setState(prevState => ({
      ...prevState,
      debts: [...prevState.debts, createInitialDebt()]
    }));
  }, []);

  const removeDebt = useCallback((id: string): void => {
    setState(prevState => ({
      ...prevState,
      debts: prevState.debts.filter(debt => debt.id !== id)
    }));
  }, []);

  const updateDebt = useCallback((id: string, field: keyof Debt, value: string | number): void => {
    setState(prevState => {
      const newDebts = prevState.debts.map(debt => {
        if (debt.id !== id) return debt;

        let processedValue: string | number = value;
        if (field === 'type') {
          processedValue = value as DebtType;
          // Update interest rate to default for new type if it hasn't been manually changed
          if (debt.interestRate === DEBT_TYPES[debt.type].defaultInterestRate) {
            debt.interestRate = DEBT_TYPES[processedValue].defaultInterestRate;
          }
        } else if (field !== 'name') {
          processedValue = safeParseFloat(value as string);
        }

        return {
          ...debt,
          [field]: processedValue
        };
      });

      const newErrors = validateInputs(newDebts, prevState.extraPayment);

      return {
        ...prevState,
        debts: newDebts,
        validationErrors: newErrors,
        results: null // Clear results when inputs change
      };
    });
  }, [validateInputs]);

  const updateExtraPayment = useCallback((value: string): void => {
    setState(prevState => {
      const newErrors = validateInputs(prevState.debts, value);
      return {
        ...prevState,
        extraPayment: value,
        validationErrors: newErrors,
        results: null // Clear results when inputs change
      };
    });
  }, [validateInputs]);

  const updatePayoffStrategy = useCallback((strategy: PayoffStrategy): void => {
    setState(prevState => ({
      ...prevState,
      payoffStrategy: strategy,
      results: null // Clear results when strategy changes
    }));
  }, []);

  const calculatePayoff = useCallback((): void => {
    setState(prevState => {
      const errors = validateInputs(prevState.debts, prevState.extraPayment);
      if (errors.length > 0) {
        return {
          ...prevState,
          validationErrors: errors,
          results: null
        };
      }

      const results = calculatePayoffSchedule(
        prevState.debts,
        safeParseFloat(prevState.extraPayment),
        prevState.payoffStrategy
      );

      return {
        ...prevState,
        validationErrors: [],
        results
      };
    });
  }, [validateInputs]);

  const reset = useCallback((): void => {
    setState(initialState);
  }, []);

  const actions: DebtPayoffActions = {
    addDebt,
    removeDebt,
    updateDebt,
    updateExtraPayment,
    updatePayoffStrategy,
    calculatePayoff,
    reset
  };

  return [state, actions];
};
