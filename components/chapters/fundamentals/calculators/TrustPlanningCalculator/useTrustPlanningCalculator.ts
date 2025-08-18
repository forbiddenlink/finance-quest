import { useState, useCallback, useMemo } from 'react';
import { useCalculatorBase } from '@/lib/hooks/useCalculatorBase';
import {
  TrustPlanningInputs,
  TrustPlanningResults,
  TrustPlanningError,
  TrustAsset,
  TrustBeneficiary
} from './types';
import { calculateTrustPlan, validateTrustInputs } from './utils';

const DEFAULT_INPUTS: TrustPlanningInputs = {
  trustType: 'revocable',
  assets: [],
  beneficiaries: [],
  grantor: {
    age: 0,
    maritalStatus: 'single',
    state: '',
  },
  trustDuration: 30,
  distributionStrategy: 'staged',
  retainControl: true
};

export function useTrustPlanningCalculator() {
  const [localInputs, setLocalInputs] = useState<TrustPlanningInputs>(DEFAULT_INPUTS);
  const [errors, setErrors] = useState<TrustPlanningError[]>([]);

  const {
    calculate,
    isCalculating,
    lastCalculated,
    resetCalculator,
    saveToHistory,
    history
  } = useCalculatorBase<TrustPlanningInputs, TrustPlanningResults>({
    calculateFn: calculateTrustPlan,
    validateFn: validateTrustInputs
  });

  const addAsset = useCallback((asset: TrustAsset) => {
    setLocalInputs(prev => ({
      ...prev,
      assets: [...prev.assets, asset]
    }));
  }, []);

  const updateAsset = useCallback((index: number, asset: TrustAsset) => {
    setLocalInputs(prev => ({
      ...prev,
      assets: prev.assets.map((a, i) => i === index ? asset : a)
    }));
  }, []);

  const removeAsset = useCallback((index: number) => {
    setLocalInputs(prev => ({
      ...prev,
      assets: prev.assets.filter((_, i) => i !== index)
    }));
  }, []);

  const addBeneficiary = useCallback((beneficiary: TrustBeneficiary) => {
    setLocalInputs(prev => ({
      ...prev,
      beneficiaries: [...prev.beneficiaries, beneficiary]
    }));
  }, []);

  const updateBeneficiary = useCallback((index: number, beneficiary: TrustBeneficiary) => {
    setLocalInputs(prev => ({
      ...prev,
      beneficiaries: prev.beneficiaries.map((b, i) => i === index ? beneficiary : b)
    }));
  }, []);

  const removeBeneficiary = useCallback((index: number) => {
    setLocalInputs(prev => ({
      ...prev,
      beneficiaries: prev.beneficiaries.filter((_, i) => i !== index)
    }));
  }, []);

  const updateTrustType = useCallback((trustType: TrustPlanningInputs['trustType']) => {
    setLocalInputs(prev => ({ ...prev, trustType }));
  }, []);

  const updateGrantorInfo = useCallback((
    field: keyof TrustPlanningInputs['grantor'],
    value: string | number
  ) => {
    setLocalInputs(prev => ({
      ...prev,
      grantor: {
        ...prev.grantor,
        [field]: value
      }
    }));
  }, []);

  const updateTrustDuration = useCallback((duration: number) => {
    setLocalInputs(prev => ({ ...prev, trustDuration: duration }));
  }, []);

  const updateDistributionStrategy = useCallback((
    strategy: TrustPlanningInputs['distributionStrategy']
  ) => {
    setLocalInputs(prev => ({ ...prev, distributionStrategy: strategy }));
  }, []);

  const updateRetainControl = useCallback((retain: boolean) => {
    setLocalInputs(prev => ({ ...prev, retainControl: retain }));
  }, []);

  const updateCharitableIntent = useCallback((intent: boolean) => {
    setLocalInputs(prev => ({ ...prev, charitableIntent: intent }));
  }, []);

  const validateInputs = useCallback(() => {
    const newErrors: TrustPlanningError[] = [];

    if (localInputs.assets.length === 0) {
      newErrors.push({
        field: 'assets',
        message: 'At least one asset is required',
        type: 'error'
      });
    }

    if (localInputs.beneficiaries.length === 0) {
      newErrors.push({
        field: 'beneficiaries',
        message: 'At least one beneficiary is required',
        type: 'error'
      });
    }

    const totalPercentage = localInputs.beneficiaries.reduce(
      (sum, b) => sum + b.distributionPercentage,
      0
    );

    if (Math.abs(totalPercentage - 100) > 0.01) {
      newErrors.push({
        field: 'beneficiaries',
        message: 'Total distribution percentage must equal 100%',
        type: 'error'
      });
    }

    if (!localInputs.grantor.state) {
      newErrors.push({
        field: 'grantor.state',
        message: 'State is required',
        type: 'error'
      });
    }

    if (localInputs.grantor.age <= 0) {
      newErrors.push({
        field: 'grantor.age',
        message: 'Valid age is required',
        type: 'error'
      });
    }

    setErrors(newErrors);
    return newErrors.length === 0;
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
      totalAssets: lastCalculated.totalAssetValue,
      projectedGrowth: lastCalculated.projectedGrowth,
      taxSavings: lastCalculated.estateTaxSavings,
      annualCost: lastCalculated.annualMaintenanceCost
    };
  }, [lastCalculated]);

  return {
    inputs: localInputs,
    results: lastCalculated,
    errors,
    isCalculating,
    history,
    summaryStats,
    addAsset,
    updateAsset,
    removeAsset,
    addBeneficiary,
    updateBeneficiary,
    removeBeneficiary,
    updateTrustType,
    updateGrantorInfo,
    updateTrustDuration,
    updateDistributionStrategy,
    updateRetainControl,
    updateCharitableIntent,
    calculate: handleCalculate,
    reset
  };
}
