import { useState, useCallback } from 'react';
import {
  ExistingDebt,
  BalanceTransferCard,
  BalanceTransferState,
  BalanceTransferActions,
  UseBalanceTransferCalculator
} from './types';
import { POPULAR_TRANSFER_CARDS } from './constants';
import {
  validateInputs,
  generateDebtAnalysis
} from './utils';

const initialState: BalanceTransferState = {
  existingDebts: [],
  availableCards: POPULAR_TRANSFER_CARDS,
  selectedCard: null,
  selectedDebts: [],
  monthlyPayment: undefined,
  analysis: null,
  errors: [],
  isCalculating: false
};

export const useBalanceTransferCalculator: UseBalanceTransferCalculator = () => {
  const [state, setState] = useState<BalanceTransferState>(initialState);

  const addDebt = useCallback((debt: ExistingDebt) => {
    setState(prev => {
      const newDebts = [...prev.existingDebts, debt];
      const errors = validateInputs(
        newDebts,
        prev.selectedDebts,
        prev.selectedCard ?? undefined,
        prev.monthlyPayment
      );

      return {
        ...prev,
        existingDebts: newDebts,
        errors,
        // Reset analysis when debts change
        analysis: null
      };
    });
  }, []);

  const removeDebt = useCallback((debtId: string) => {
    setState(prev => {
      const newDebts = prev.existingDebts.filter(debt => debt.id !== debtId);
      const newSelectedDebts = prev.selectedDebts.filter(id => id !== debtId);
      const errors = validateInputs(
        newDebts,
        newSelectedDebts,
        prev.selectedCard ?? undefined,
        prev.monthlyPayment
      );

      return {
        ...prev,
        existingDebts: newDebts,
        selectedDebts: newSelectedDebts,
        errors,
        // Reset analysis when debts change
        analysis: null
      };
    });
  }, []);

  const updateDebt = useCallback((debtId: string, updates: Partial<ExistingDebt>) => {
    setState(prev => {
      const newDebts = prev.existingDebts.map(debt =>
        debt.id === debtId ? { ...debt, ...updates } : debt
      );
      const errors = validateInputs(
        newDebts,
        prev.selectedDebts,
        prev.selectedCard ?? undefined,
        prev.monthlyPayment
      );

      return {
        ...prev,
        existingDebts: newDebts,
        errors,
        // Reset analysis when debts change
        analysis: null
      };
    });
  }, []);

  const selectCard = useCallback((cardId: string) => {
    setState(prev => {
      const card = prev.availableCards.find(c => c.id === cardId) || null;
      const errors = validateInputs(
        prev.existingDebts,
        prev.selectedDebts,
        card ?? undefined,
        prev.monthlyPayment
      );

      return {
        ...prev,
        selectedCard: card,
        errors,
        // Reset analysis when card changes
        analysis: null
      };
    });
  }, []);

  const selectDebts = useCallback((debtIds: string[]) => {
    setState(prev => {
      const errors = validateInputs(
        prev.existingDebts,
        debtIds,
        prev.selectedCard ?? undefined,
        prev.monthlyPayment
      );

      return {
        ...prev,
        selectedDebts: debtIds,
        errors,
        // Reset analysis when selected debts change
        analysis: null
      };
    });
  }, []);

  const setMonthlyPayment = useCallback((amount: number) => {
    setState(prev => {
      const errors = validateInputs(
        prev.existingDebts,
        prev.selectedDebts,
        prev.selectedCard ?? undefined,
        amount
      );

      return {
        ...prev,
        monthlyPayment: amount,
        errors,
        // Reset analysis when payment changes
        analysis: null
      };
    });
  }, []);

  const calculateTransfer = useCallback(() => {
    setState(prev => {
      // Validate inputs first
      const errors = validateInputs(
        prev.existingDebts,
        prev.selectedDebts,
        prev.selectedCard ?? undefined,
        prev.monthlyPayment
      );

      if (errors.length > 0 || !prev.selectedCard) {
        return {
          ...prev,
          errors,
          analysis: null
        };
      }

      // Start calculation
      const analysis = generateDebtAnalysis(
        prev.existingDebts,
        prev.selectedDebts,
        prev.selectedCard ?? undefined,
        prev.monthlyPayment
      );

      return {
        ...prev,
        analysis,
        errors: [],
        isCalculating: false
      };
    });
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  const actions: BalanceTransferActions = {
    addDebt,
    removeDebt,
    updateDebt,
    selectCard,
    selectDebts,
    setMonthlyPayment,
    calculateTransfer,
    reset
  };

  return [state, actions];
};
