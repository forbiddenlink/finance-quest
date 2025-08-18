import { useState, useCallback, useEffect } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { PortfolioHolding, PortfolioState, PortfolioActions, AnalysisParameters } from './types';
import { DEFAULT_HOLDINGS, DEFAULT_PARAMETERS } from './constants';
import { calculatePortfolioMetrics } from './utils';

export function usePortfolioRiskAnalyzer(): [PortfolioState, PortfolioActions] {
  const { recordCalculatorUsage } = useProgressStore();

  const [holdings, setHoldings] = useState<PortfolioHolding[]>(DEFAULT_HOLDINGS);
  const [parameters, setParameters] = useState<AnalysisParameters>(DEFAULT_PARAMETERS);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    recordCalculatorUsage('portfolio-risk-analyzer');
  }, [recordCalculatorUsage]);

  const calculateResults = useCallback(() => {
    const newMetrics = calculatePortfolioMetrics(holdings, parameters);
    setMetrics(newMetrics);
  }, [holdings, parameters]);

  useEffect(() => {
    calculateResults();
  }, [calculateResults]);

  const addHolding = useCallback(() => {
    const newHolding: PortfolioHolding = {
      id: Date.now().toString(),
      symbol: '',
      name: '',
      allocation: 0,
      expectedReturn: 8.0,
      volatility: 15.0,
      beta: 1.0,
      marketValue: 0
    };
    setHoldings(prev => [...prev, newHolding]);
  }, []);

  const removeHolding = useCallback((id: string) => {
    setHoldings(prev => prev.filter(h => h.id !== id));
  }, []);

  const updateHolding = useCallback((id: string, field: keyof PortfolioHolding, value: string | number) => {
    setHoldings(prev => prev.map(h => 
      h.id === id ? { ...h, [field]: value } : h
    ));
  }, []);

  const updateParameter = useCallback((field: keyof AnalysisParameters, value: number) => {
    setParameters(prev => ({ ...prev, [field]: value }));
  }, []);

  const reset = useCallback(() => {
    setHoldings(DEFAULT_HOLDINGS);
    setParameters(DEFAULT_PARAMETERS);
  }, []);

  const state: PortfolioState = {
    holdings,
    parameters,
    metrics
  };

  const actions: PortfolioActions = {
    addHolding,
    removeHolding,
    updateHolding,
    updateParameter,
    reset
  };

  return [state, actions];
}

