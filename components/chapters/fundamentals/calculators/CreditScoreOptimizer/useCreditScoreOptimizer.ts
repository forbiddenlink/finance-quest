import { useState, useCallback, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  CreditScoreState,
  CreditScoreActions,
  CreditAccount,
  ScoreGoal,
  UseCreditScoreOptimizer
} from './types';
import {
  validateInputs,
  analyzeFactors,
  generateOptimizationPlan,
  calculateUtilizationStrategies,
  generateDebtPaydownPlan
} from './utils';

const initialState: CreditScoreState = {
  currentScore: 0,
  accounts: [],
  goals: [],
  factorAnalysis: [],
  optimizationActions: [],
  utilizationStrategies: [],
  debtPaydownPlan: null,
  errors: [],
  showAdvancedOptions: false
};

export const useCreditScoreOptimizer: UseCreditScoreOptimizer = () => {
  const [state, setState] = useState<CreditScoreState>(initialState);

  useEffect(() => {
    const errors = validateInputs(state);
    setState(prev => ({
      ...prev,
      errors
    }));
  }, [state.accounts, state.goals, state.debtPaydownPlan]);

  const addAccount = useCallback((account: CreditAccount) => {
    setState(prev => ({
      ...prev,
      accounts: [...prev.accounts, { ...account, id: uuidv4() }]
    }));
  }, []);

  const removeAccount = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      accounts: prev.accounts.filter(account => account.id !== id)
    }));
  }, []);

  const updateAccount = useCallback((id: string, updates: Partial<CreditAccount>) => {
    setState(prev => ({
      ...prev,
      accounts: prev.accounts.map(account =>
        account.id === id ? { ...account, ...updates } : account
      )
    }));
  }, []);

  const addGoal = useCallback((goal: ScoreGoal) => {
    setState(prev => ({
      ...prev,
      goals: [...prev.goals, { ...goal, id: uuidv4() }]
    }));
  }, []);

  const removeGoal = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      goals: prev.goals.filter(goal => goal.id !== id)
    }));
  }, []);

  const updateGoal = useCallback((id: string, updates: Partial<ScoreGoal>) => {
    setState(prev => ({
      ...prev,
      goals: prev.goals.map(goal =>
        goal.id === id ? { ...goal, ...updates } : goal
      )
    }));
  }, []);

  const completeAction = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      optimizationActions: prev.optimizationActions.map(action =>
        action.id === id ? { ...action, completed: true } : action
      )
    }));
  }, []);

  const setSelectedPaydownStrategy = useCallback((strategyName: string) => {
    setState(prev => ({
      ...prev,
      debtPaydownPlan: prev.debtPaydownPlan
        ? { ...prev.debtPaydownPlan, selectedStrategy: strategyName }
        : null
    }));
  }, []);

  const updateMonthlyBudget = useCallback((amount: number) => {
    setState(prev => {
      if (!prev.debtPaydownPlan) return prev;

      const newPlan = generateDebtPaydownPlan(prev.accounts, amount);
      return {
        ...prev,
        debtPaydownPlan: {
          ...newPlan,
          selectedStrategy: prev.debtPaydownPlan.selectedStrategy
        }
      };
    });
  }, []);

  const setShowAdvancedOptions = useCallback((show: boolean) => {
    setState(prev => ({
      ...prev,
      showAdvancedOptions: show
    }));
  }, []);

  const analyze = useCallback(() => {
    setState(prev => {
      const factorAnalysis = analyzeFactors(prev);
      const utilizationStrategies = calculateUtilizationStrategies(prev.accounts);
      const debtPaydownPlan = generateDebtPaydownPlan(
        prev.accounts,
        prev.debtPaydownPlan?.monthlyBudget || 500
      );

      const optimizationActions = prev.goals.length > 0
        ? generateOptimizationPlan(prev, prev.goals[0])
        : [];

      return {
        ...prev,
        factorAnalysis,
        optimizationActions,
        utilizationStrategies,
        debtPaydownPlan
      };
    });
  }, []);

  const reset = useCallback(() => {
    setState(initialState);
  }, []);

  const actions: CreditScoreActions = {
    addAccount,
    removeAccount,
    updateAccount,
    addGoal,
    removeGoal,
    updateGoal,
    completeAction,
    setSelectedPaydownStrategy,
    updateMonthlyBudget,
    setShowAdvancedOptions,
    analyze,
    reset
  };

  return [state, actions];
};
