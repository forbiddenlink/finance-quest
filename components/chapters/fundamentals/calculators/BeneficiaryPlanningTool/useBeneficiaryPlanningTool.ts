import { useState, useCallback, useMemo } from 'react';
import { useCalculatorBase } from '@/lib/hooks/useCalculatorBase';
import {
  BeneficiaryPlanningInputs,
  BeneficiaryPlanningResults,
  BeneficiaryPlanningError,
  Account,
  Beneficiary
} from './types';
import { calculateBeneficiaryPlan, validateBeneficiaryPlanningInputs } from './utils';

const DEFAULT_INPUTS: BeneficiaryPlanningInputs = {
  accounts: [],
  reviewFrequency: 'annual',
  upcomingLifeEvents: []
};

export function useBeneficiaryPlanningTool() {
  const [localInputs, setLocalInputs] = useState<BeneficiaryPlanningInputs>(DEFAULT_INPUTS);
  const [errors, setErrors] = useState<BeneficiaryPlanningError[]>([]);

  const {
    calculate,
    isCalculating,
    lastCalculated,
    resetCalculator,
    saveToHistory,
    history
  } = useCalculatorBase<BeneficiaryPlanningInputs, BeneficiaryPlanningResults>({
    calculateFn: calculateBeneficiaryPlan,
    validateFn: validateBeneficiaryPlanningInputs
  });

  const addAccount = useCallback((account: Account) => {
    setLocalInputs(prev => ({
      ...prev,
      accounts: [...prev.accounts, account]
    }));
  }, []);

  const updateAccount = useCallback((index: number, account: Account) => {
    setLocalInputs(prev => ({
      ...prev,
      accounts: prev.accounts.map((a, i) => i === index ? account : a)
    }));
  }, []);

  const removeAccount = useCallback((index: number) => {
    setLocalInputs(prev => ({
      ...prev,
      accounts: prev.accounts.filter((_, i) => i !== index)
    }));
  }, []);

  const addBeneficiary = useCallback((accountIndex: number, beneficiary: Beneficiary) => {
    setLocalInputs(prev => ({
      ...prev,
      accounts: prev.accounts.map((account, i) => {
        if (i === accountIndex) {
          return {
            ...account,
            beneficiaries: [...account.beneficiaries, beneficiary]
          };
        }
        return account;
      })
    }));
  }, []);

  const updateBeneficiary = useCallback((
    accountIndex: number,
    beneficiaryIndex: number,
    beneficiary: Beneficiary
  ) => {
    setLocalInputs(prev => ({
      ...prev,
      accounts: prev.accounts.map((account, i) => {
        if (i === accountIndex) {
          return {
            ...account,
            beneficiaries: account.beneficiaries.map((b, j) =>
              j === beneficiaryIndex ? beneficiary : b
            )
          };
        }
        return account;
      })
    }));
  }, []);

  const removeBeneficiary = useCallback((accountIndex: number, beneficiaryIndex: number) => {
    setLocalInputs(prev => ({
      ...prev,
      accounts: prev.accounts.map((account, i) => {
        if (i === accountIndex) {
          return {
            ...account,
            beneficiaries: account.beneficiaries.filter((_, j) => j !== beneficiaryIndex)
          };
        }
        return account;
      })
    }));
  }, []);

  const updateDefaultContingent = useCallback((beneficiary: Beneficiary) => {
    setLocalInputs(prev => ({
      ...prev,
      defaultContingent: beneficiary
    }));
  }, []);

  const updateReviewFrequency = useCallback((
    frequency: BeneficiaryPlanningInputs['reviewFrequency']
  ) => {
    setLocalInputs(prev => ({
      ...prev,
      reviewFrequency: frequency
    }));
  }, []);

  const updateLastFullReview = useCallback((date: string) => {
    setLocalInputs(prev => ({
      ...prev,
      lastFullReview: date
    }));
  }, []);

  const addLifeEvent = useCallback((event: {
    event: string;
    date: string;
    impactedAccounts: string[];
  }) => {
    setLocalInputs(prev => ({
      ...prev,
      upcomingLifeEvents: [...prev.upcomingLifeEvents, event]
    }));
  }, []);

  const updateLifeEvent = useCallback((index: number, event: {
    event: string;
    date: string;
    impactedAccounts: string[];
  }) => {
    setLocalInputs(prev => ({
      ...prev,
      upcomingLifeEvents: prev.upcomingLifeEvents.map((e, i) =>
        i === index ? event : e
      )
    }));
  }, []);

  const removeLifeEvent = useCallback((index: number) => {
    setLocalInputs(prev => ({
      ...prev,
      upcomingLifeEvents: prev.upcomingLifeEvents.filter((_, i) => i !== index)
    }));
  }, []);

  const validateInputs = useCallback(() => {
    const newErrors: BeneficiaryPlanningError[] = [];

    if (localInputs.accounts.length === 0) {
      newErrors.push({
        field: 'accounts',
        message: 'At least one account is required',
        type: 'error'
      });
    }

    localInputs.accounts.forEach((account, accountIndex) => {
      if (account.requiresDesignation && account.beneficiaries.length === 0) {
        newErrors.push({
          field: `accounts[${accountIndex}].beneficiaries`,
          message: `Beneficiary designation required for ${account.description}`,
          type: 'error'
        });
      }

      const primaryTotal = account.beneficiaries
        .filter(b => b.type === 'primary')
        .reduce((sum, b) => sum + b.percentage, 0);
      
      if (account.beneficiaries.length > 0 && Math.abs(primaryTotal - 100) > 0.01) {
        newErrors.push({
          field: `accounts[${accountIndex}].beneficiaries`,
          message: `Primary beneficiary percentages must total 100% for ${account.description}`,
          type: 'error'
        });
      }

      if (!account.beneficiaries.some(b => b.type === 'contingent')) {
        newErrors.push({
          field: `accounts[${accountIndex}].beneficiaries`,
          message: `No contingent beneficiaries for ${account.description}`,
          type: 'warning'
        });
      }
    });

    setErrors(newErrors);
    return newErrors.filter(e => e.type === 'error').length === 0;
  }, [localInputs]);

  const handleCalculate = useCallback(async () => {
    if (!validateInputs()) return;
    
    const results = await calculate(localInputs);
    if (results) {
      saveToHistory(localInputs, results);
    }
  }, [localInputs, calculate, saveToHistory, validateInputs]);

  const reset = useCallback(() => {
    setLocalInputs(DEFAULT_INPUTS);
    setErrors([]);
    resetCalculator();
  }, [resetCalculator]);

  const summaryStats = useMemo(() => {
    if (!lastCalculated) return null;

    return {
      totalAssets: lastCalculated.totalAssets,
      totalBeneficiaries: lastCalculated.beneficiarySummary.length,
      incompleteDesignations: lastCalculated.designationStatus.filter(
        s => s.status === 'incomplete'
      ).length,
      highPriorityReviews: lastCalculated.reviewSchedule.filter(
        r => r.priority === 'high'
      ).length
    };
  }, [lastCalculated]);

  return {
    inputs: localInputs,
    results: lastCalculated,
    errors,
    isCalculating,
    history,
    summaryStats,
    addAccount,
    updateAccount,
    removeAccount,
    addBeneficiary,
    updateBeneficiary,
    removeBeneficiary,
    updateDefaultContingent,
    updateReviewFrequency,
    updateLastFullReview,
    addLifeEvent,
    updateLifeEvent,
    removeLifeEvent,
    calculate: handleCalculate,
    reset
  };
}
