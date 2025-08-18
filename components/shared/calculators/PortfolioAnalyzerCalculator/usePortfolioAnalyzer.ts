import { useState, useCallback } from 'react';
import { Decimal } from 'decimal.js';
import {
  PortfolioValues,
  ValidationError,
  PortfolioAnalyzerState,
  PortfolioAnalyzerActions,
  UsePortfolioAnalyzer
} from './types';
import {
  calculateProjectedReturns,
  calculateRiskMetrics,
  validateAllocations,
  generateRebalancingSchedule,
  generateRecommendations
} from './utils';

const initialValues: PortfolioValues = {
  cashAllocation: 10,
  bondAllocation: 30,
  stockAllocation: 40,
  realEstateAllocation: 15,
  alternativeAllocation: 5,
  riskTolerance: 'moderate',
  expectedVolatility: 15,
  investmentTimeframe: 10,
  rebalancingFrequency: 3
};

export const usePortfolioAnalyzer: UsePortfolioAnalyzer = () => {
  const [values, setValues] = useState<PortfolioValues>(initialValues);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [result, setResult] = useState<PortfolioAnalyzerState['result']>(null);
  const [isValid, setIsValid] = useState<boolean>(true);

  const validateInputs = useCallback((newValues: PortfolioValues): ValidationError[] => {
    const newErrors: ValidationError[] = [];

    // Validate individual allocations
    const allocationFields: Array<keyof PortfolioValues> = [
      'cashAllocation',
      'bondAllocation',
      'stockAllocation',
      'realEstateAllocation',
      'alternativeAllocation'
    ];

    allocationFields.forEach((field) => {
      const value = newValues[field];
      if (typeof value !== 'number' || isNaN(value) || value < 0 || value > 100) {
        newErrors.push({
          field,
          message: `${field} must be between 0 and 100`
        });
      }
    });

    // Validate total allocation
    const totalAllocation = new Decimal(newValues.cashAllocation)
      .plus(newValues.bondAllocation)
      .plus(newValues.stockAllocation)
      .plus(newValues.realEstateAllocation)
      .plus(newValues.alternativeAllocation)
      .toNumber();

    if (totalAllocation !== 100) {
      newErrors.push({
        field: 'totalAllocation',
        message: 'Total allocation must equal 100%'
      });
    }

    // Validate other numeric fields
    if (newValues.expectedVolatility < 0 || newValues.expectedVolatility > 100) {
      newErrors.push({
        field: 'expectedVolatility',
        message: 'Expected volatility must be between 0 and 100'
      });
    }

    if (newValues.investmentTimeframe < 1 || newValues.investmentTimeframe > 50) {
      newErrors.push({
        field: 'investmentTimeframe',
        message: 'Investment timeframe must be between 1 and 50 years'
      });
    }

    if (newValues.rebalancingFrequency < 1 || newValues.rebalancingFrequency > 12) {
      newErrors.push({
        field: 'rebalancingFrequency',
        message: 'Rebalancing frequency must be between 1 and 12 months'
      });
    }

    return newErrors;
  }, []);

  const updateField = useCallback((field: keyof PortfolioValues, value: string): void => {
    const numericValue = field === 'riskTolerance' ? value : Number(value);
    const newValues = { ...values, [field]: numericValue };
    const newErrors = validateInputs(newValues);
    
    setValues(newValues);
    setErrors(newErrors);
    setIsValid(newErrors.length === 0 && validateAllocations(newValues));
  }, [values, validateInputs]);

  const calculate = useCallback((): void => {
    if (!isValid) return;

    const projectedReturns = calculateProjectedReturns(values);
    const riskMetrics = calculateRiskMetrics(values);
    const rebalancingSchedule = generateRebalancingSchedule(values);
    const recommendations = generateRecommendations(values, riskMetrics);

    setResult({
      projectedReturns,
      riskMetrics,
      recommendations,
      rebalancingSchedule
    });
  }, [values, isValid]);

  const reset = useCallback((): void => {
    setValues(initialValues);
    setErrors([]);
    setResult(null);
    setIsValid(true);
  }, []);

  return [
    { values, errors, result, isValid },
    { updateField, reset, calculate }
  ];
};