import { useState, useCallback, useMemo } from 'react';
import { useCalculatorBase } from '@/lib/hooks/useCalculatorBase';
import {
  InheritanceTaxInputs,
  InheritanceTaxResults,
  InheritanceTaxError,
  InheritedAsset,
  Deduction
} from './types';
import { calculateInheritanceTax, validateInheritanceTaxInputs } from './utils';

const DEFAULT_INPUTS: InheritanceTaxInputs = {
  decedent: {
    state: '',
    dateOfDeath: '',
    maritalStatus: 'single'
  },
  heir: {
    relationship: 'other',
    state: '',
    adjustedGrossIncome: 0
  },
  assets: [],
  deductions: [],
  priorGifts: 0,
  portabilityElection: false
};

export function useInheritanceTaxCalculator() {
  const [localInputs, setLocalInputs] = useState<InheritanceTaxInputs>(DEFAULT_INPUTS);
  const [errors, setErrors] = useState<InheritanceTaxError[]>([]);

  const {
    calculate,
    isCalculating,
    lastCalculated,
    resetCalculator,
    saveToHistory,
    history
  } = useCalculatorBase<InheritanceTaxInputs, InheritanceTaxResults>({
    calculateFn: calculateInheritanceTax,
    validateFn: validateInheritanceTaxInputs
  });

  const addAsset = useCallback((asset: InheritedAsset) => {
    setLocalInputs(prev => ({
      ...prev,
      assets: [...prev.assets, asset]
    }));
  }, []);

  const updateAsset = useCallback((index: number, asset: InheritedAsset) => {
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

  const addDeduction = useCallback((deduction: Deduction) => {
    setLocalInputs(prev => ({
      ...prev,
      deductions: [...prev.deductions, deduction]
    }));
  }, []);

  const updateDeduction = useCallback((index: number, deduction: Deduction) => {
    setLocalInputs(prev => ({
      ...prev,
      deductions: prev.deductions.map((d, i) => i === index ? deduction : d)
    }));
  }, []);

  const removeDeduction = useCallback((index: number) => {
    setLocalInputs(prev => ({
      ...prev,
      deductions: prev.deductions.filter((_, i) => i !== index)
    }));
  }, []);

  const updateDecedentInfo = useCallback((
    field: keyof InheritanceTaxInputs['decedent'],
    value: string
  ) => {
    setLocalInputs(prev => ({
      ...prev,
      decedent: {
        ...prev.decedent,
        [field]: value
      }
    }));
  }, []);

  const updateHeirInfo = useCallback((
    field: keyof InheritanceTaxInputs['heir'],
    value: string | number
  ) => {
    setLocalInputs(prev => ({
      ...prev,
      heir: {
        ...prev.heir,
        [field]: value
      }
    }));
  }, []);

  const updatePriorGifts = useCallback((amount: number) => {
    setLocalInputs(prev => ({
      ...prev,
      priorGifts: amount
    }));
  }, []);

  const updatePortabilityElection = useCallback((elected: boolean) => {
    setLocalInputs(prev => ({
      ...prev,
      portabilityElection: elected
    }));
  }, []);

  const updateDeceasedSpouseExemption = useCallback((amount: number) => {
    setLocalInputs(prev => ({
      ...prev,
      deceasedSpouseExemption: amount
    }));
  }, []);

  const validateInputs = useCallback(() => {
    const newErrors: InheritanceTaxError[] = [];

    if (!localInputs.decedent.state) {
      newErrors.push({
        field: 'decedent.state',
        message: 'Decedent\'s state is required',
        type: 'error'
      });
    }

    if (!localInputs.decedent.dateOfDeath) {
      newErrors.push({
        field: 'decedent.dateOfDeath',
        message: 'Date of death is required',
        type: 'error'
      });
    }

    if (!localInputs.heir.state) {
      newErrors.push({
        field: 'heir.state',
        message: 'Heir\'s state is required',
        type: 'error'
      });
    }

    if (localInputs.assets.length === 0) {
      newErrors.push({
        field: 'assets',
        message: 'At least one asset is required',
        type: 'error'
      });
    }

    if (localInputs.portabilityElection && !localInputs.deceasedSpouseExemption) {
      newErrors.push({
        field: 'deceasedSpouseExemption',
        message: 'Deceased spouse\'s exemption amount is required when electing portability',
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
      grossEstate: lastCalculated.grossEstate,
      totalTax: lastCalculated.totalTaxLiability,
      netInheritance: lastCalculated.netInheritance,
      effectiveRate: lastCalculated.effectiveTaxRate
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
    addDeduction,
    updateDeduction,
    removeDeduction,
    updateDecedentInfo,
    updateHeirInfo,
    updatePriorGifts,
    updatePortabilityElection,
    updateDeceasedSpouseExemption,
    calculate: handleCalculate,
    reset
  };
}
