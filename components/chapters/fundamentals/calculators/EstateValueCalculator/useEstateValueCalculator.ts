import { useState, useCallback, useMemo } from 'react';
import { EstateValueInputs, EstateValueResults, EstateValueError, Asset, Liability } from './types';
import { calculateEstateValue, validateEstateInputs } from './utils';

const DEFAULT_INPUTS: EstateValueInputs = {
  assets: [],
  liabilities: [],
  state: '',
  maritalStatus: 'single',
  hasChildren: false,
  hasTrust: false
};

export function useEstateValueCalculator() {
  const [localInputs, setLocalInputs] = useState<EstateValueInputs>(DEFAULT_INPUTS);
  const [errors, setErrors] = useState<EstateValueError[]>([]);
  const [results, setResults] = useState<EstateValueResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [history, setHistory] = useState<Array<{ inputs: EstateValueInputs; results: EstateValueResults; timestamp: number }>>([]);

  const addAsset = useCallback((asset: Asset) => {
    setLocalInputs(prev => ({
      ...prev,
      assets: [...prev.assets, asset]
    }));
  }, []);

  const updateAsset = useCallback((index: number, asset: Asset) => {
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

  const addLiability = useCallback((liability: Liability) => {
    setLocalInputs(prev => ({
      ...prev,
      liabilities: [...prev.liabilities, liability]
    }));
  }, []);

  const updateLiability = useCallback((index: number, liability: Liability) => {
    setLocalInputs(prev => ({
      ...prev,
      liabilities: prev.liabilities.map((l, i) => i === index ? liability : l)
    }));
  }, []);

  const removeLiability = useCallback((index: number) => {
    setLocalInputs(prev => ({
      ...prev,
      liabilities: prev.liabilities.filter((_, i) => i !== index)
    }));
  }, []);

  const updateState = useCallback((state: string) => {
    setLocalInputs(prev => ({ ...prev, state }));
  }, []);

  const updateMaritalStatus = useCallback((maritalStatus: EstateValueInputs['maritalStatus']) => {
    setLocalInputs(prev => ({ ...prev, maritalStatus }));
  }, []);

  const updateHasChildren = useCallback((hasChildren: boolean) => {
    setLocalInputs(prev => ({ ...prev, hasChildren }));
  }, []);

  const updateHasTrust = useCallback((hasTrust: boolean) => {
    setLocalInputs(prev => ({ ...prev, hasTrust }));
  }, []);

  const validateInputs = useCallback(() => {
    const newErrors: EstateValueError[] = [];

    if (localInputs.assets.length === 0) {
      newErrors.push({
        field: 'assets',
        message: 'At least one asset is required',
        type: 'error'
      });
    }

    localInputs.assets.forEach((asset, index) => {
      if (asset.value <= 0) {
        newErrors.push({
          field: `assets[${index}].value`,
          message: 'Asset value must be greater than 0',
          type: 'error'
        });
      }
    });

    localInputs.liabilities.forEach((liability, index) => {
      if (liability.amount < 0) {
        newErrors.push({
          field: `liabilities[${index}].amount`,
          message: 'Liability amount cannot be negative',
          type: 'error'
        });
      }
    });

    if (!localInputs.state) {
      newErrors.push({
        field: 'state',
        message: 'State is required',
        type: 'error'
      });
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  }, [localInputs]);

  const handleCalculate = useCallback(async () => {
    if (!validateInputs()) return;

    setIsCalculating(true);
    try {
      const calculatedResults = await calculateEstateValue(localInputs);
      setResults(calculatedResults);
      setHistory(prev => [...prev, { inputs: localInputs, results: calculatedResults, timestamp: Date.now() }]);
    } finally {
      setIsCalculating(false);
    }
  }, [localInputs, validateInputs]);

  const reset = useCallback(() => {
    setLocalInputs(DEFAULT_INPUTS);
    setErrors([]);
    setResults(null);
  }, []);

  const summaryStats = useMemo(() => {
    if (!results) return null;

    return {
      totalAssets: results.grossEstateValue,
      totalLiabilities: results.totalLiabilities,
      netEstate: results.netEstateValue,
      totalTax: results.totalTaxLiability,
      netToHeirs: results.netToHeirs,
      potentialSavings: results.potentialTaxSavings
    };
  }, [results]);

  return {
    inputs: localInputs,
    results,
    errors,
    isCalculating,
    history,
    summaryStats,
    addAsset,
    updateAsset,
    removeAsset,
    addLiability,
    updateLiability,
    removeLiability,
    updateState,
    updateMaritalStatus,
    updateHasChildren,
    updateHasTrust,
    calculate: handleCalculate,
    reset
  };
}
