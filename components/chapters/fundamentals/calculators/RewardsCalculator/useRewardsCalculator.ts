import { useState, useCallback } from 'react';
import {
  CreditCard,
  MonthlySpending,
  RewardsCalculatorState,
  RewardsCalculatorActions,
  UseRewardsCalculator
} from './types';
import { DEFAULT_MONTHLY_SPENDING } from './constants';
import { analyzeRewards, validateInputs } from './utils';

const initialState: RewardsCalculatorState = {
  selectedCards: [],
  monthlySpending: DEFAULT_MONTHLY_SPENDING,
  analysis: null,
  errors: [],
  isCalculating: false
};

export const useRewardsCalculator: UseRewardsCalculator = () => {
  const [state, setState] = useState<RewardsCalculatorState>(initialState);

  const addCard = useCallback((card: CreditCard) => {
    setState(prev => {
      // Don't add if card is already selected
      if (prev.selectedCards.some(c => c.id === card.id)) {
        return prev;
      }

      const newCards = [...prev.selectedCards, card];
      const errors = validateInputs(newCards, prev.monthlySpending);

      return {
        ...prev,
        selectedCards: newCards,
        errors,
        // Reset analysis when cards change
        analysis: null
      };
    });
  }, []);

  const removeCard = useCallback((cardId: string) => {
    setState(prev => {
      const newCards = prev.selectedCards.filter(card => card.id !== cardId);
      const errors = validateInputs(newCards, prev.monthlySpending);

      return {
        ...prev,
        selectedCards: newCards,
        errors,
        // Reset analysis when cards change
        analysis: null
      };
    });
  }, []);

  const updateSpending = useCallback((spending: MonthlySpending[]) => {
    setState(prev => {
      const errors = validateInputs(prev.selectedCards, spending);

      return {
        ...prev,
        monthlySpending: spending,
        errors,
        // Reset analysis when spending changes
        analysis: null
      };
    });
  }, []);

  const calculateRewards = useCallback(() => {
    setState(prev => {
      // Validate inputs first
      const errors = validateInputs(prev.selectedCards, prev.monthlySpending);
      if (errors.length > 0) {
        return {
          ...prev,
          errors,
          analysis: null
        };
      }

      // Start calculation
      const analysis = analyzeRewards(prev.selectedCards, prev.monthlySpending);

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

  const actions: RewardsCalculatorActions = {
    addCard,
    removeCard,
    updateSpending,
    calculateRewards,
    reset
  };

  return [state, actions];
};
