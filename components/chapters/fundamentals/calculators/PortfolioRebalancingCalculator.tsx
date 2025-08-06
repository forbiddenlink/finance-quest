'use client';

import React, { useState, useEffect } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import {
  Target,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Calendar,
  Scale
} from 'lucide-react';

interface ValidationError {
  field: string;
  message: string;
}

interface InputValidation {
  isValid: boolean;
  errors: ValidationError[];
}

interface HoldingInput {
  name: string;
  currentValue: number;
  targetPercentage: number;
  currentPercentage: number;
  deviation: number;
}

interface RebalanceAction {
  action: 'buy' | 'sell';
  amount: number;
  holding: string;
  reason: string;
}

const PortfolioRebalancingCalculator: React.FC = () => {
  const { recordCalculatorUsage } = useProgressStore();
  
  const [totalPortfolioValue, setTotalPortfolioValue] = useState<number>(100000);
  const [rebalanceThreshold, setRebalanceThreshold] = useState<number>(5);
  const [holdings, setHoldings] = useState<HoldingInput[]>([
    { name: 'US Total Market', currentValue: 65000, targetPercentage: 60, currentPercentage: 65, deviation: 5 },
    { name: 'International Developed', currentValue: 15000, targetPercentage: 20, currentPercentage: 15, deviation: -5 },
    { name: 'Emerging Markets', currentValue: 8000, targetPercentage: 10, currentPercentage: 8, deviation: -2 },
    { name: 'Bonds', currentValue: 12000, targetPercentage: 10, currentPercentage: 12, deviation: 2 }
  ]);
  
  const [rebalanceActions, setRebalanceActions] = useState<RebalanceAction[]>([]);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  useEffect(() => {
    recordCalculatorUsage('portfolio-rebalancing-calculator');
  }, [recordCalculatorUsage]);

  // Safe parsing utility
  const safeParseFloat = (value: string): number => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Validation functions
  const validateInput = React.useCallback((): InputValidation => {
    const errors: ValidationError[] = [];

    if (totalPortfolioValue <= 0 || totalPortfolioValue > 10000000) {
      errors.push({
        field: 'totalPortfolioValue',
        message: 'Portfolio value must be between $1 and $10,000,000'
      });
    }

    if (rebalanceThreshold < 1 || rebalanceThreshold > 50) {
      errors.push({
        field: 'rebalanceThreshold',
        message: 'Rebalance threshold must be between 1% and 50%'
      });
    }

    holdings.forEach((holding, index) => {
      if (holding.currentValue < 0) {
        errors.push({
          field: `holding-${index}-value`,
          message: `${holding.name} value cannot be negative`
        });
      }

      if (holding.targetPercentage < 0 || holding.targetPercentage > 100) {
        errors.push({
          field: `holding-${index}-target`,
          message: `${holding.name} target must be between 0% and 100%`
        });
      }
    });

    const totalTargetPercentage = holdings.reduce((sum, holding) => sum + holding.targetPercentage, 0);
    if (Math.abs(totalTargetPercentage - 100) > 0.1) {
      errors.push({
        field: 'total-percentage',
        message: 'Target allocations must sum to 100%'
      });
    }

    setValidationErrors(errors);
    return { isValid: errors.length === 0, errors };
  }, [totalPortfolioValue, rebalanceThreshold, holdings]);

  const getValidationError = (field: string): string | null => {
    const error = validationErrors.find(err => err.field === field);
    return error ? error.message : null;
  };

  useEffect(() => {
    recordCalculatorUsage('portfolio-rebalancing-calculator');
  }, [recordCalculatorUsage]);

  const calculateRebalancing = React.useCallback(() => {
    validateInput();
    const actions: RebalanceAction[] = [];
    let estimatedCost = 0;

    holdings.forEach(holding => {
      const absoluteDeviation = Math.abs(holding.deviation);
      
      if (absoluteDeviation >= rebalanceThreshold) {
        const targetValue = (holding.targetPercentage / 100) * totalPortfolioValue;
        const difference = targetValue - holding.currentValue;
        
        if (difference > 0) {
          actions.push({
            action: 'buy',
            amount: Math.abs(difference),
            holding: holding.name,
            reason: `Currently ${holding.currentPercentage.toFixed(1)}%, target ${holding.targetPercentage}%`
          });
        } else {
          actions.push({
            action: 'sell',
            amount: Math.abs(difference),
            holding: holding.name,
            reason: `Currently ${holding.currentPercentage.toFixed(1)}%, target ${holding.targetPercentage}%`
          });
        }
        
        // Estimate transaction costs (0.1% per trade)
        estimatedCost += Math.abs(difference) * 0.001;
      }
    });

    setRebalanceActions(actions);
    setTotalCost(estimatedCost);
  }, [holdings, totalPortfolioValue, rebalanceThreshold, validateInput]);

  useEffect(() => {
    calculateRebalancing();
  }, [calculateRebalancing]);

  const updateHolding = (index: number, field: string, value: string | number) => {
    const newHoldings = [...holdings];
    newHoldings[index] = { ...newHoldings[index], [field]: value };
    
    // Recalculate current percentages and deviations
    newHoldings[index].currentPercentage = (newHoldings[index].currentValue / totalPortfolioValue) * 100;
    newHoldings[index].deviation = newHoldings[index].currentPercentage - newHoldings[index].targetPercentage;
    
    setHoldings(newHoldings);
  };

  const addHolding = () => {
    const newHolding: HoldingInput = {
      name: 'New Asset',
      currentValue: 0,
      targetPercentage: 0,
      currentPercentage: 0,
      deviation: 0
    };
    setHoldings([...holdings, newHolding]);
  };

  const removeHolding = (index: number) => {
    if (holdings.length > 1) {
      const newHoldings = holdings.filter((_, i) => i !== index);
      setHoldings(newHoldings);
    }
  };

  const getDeviationColor = (deviation: number) => {
    const absDeviation = Math.abs(deviation);
    if (absDeviation < 2) return theme.status.success.text;
    if (absDeviation < 5) return theme.status.warning.text;
    return theme.status.error.text;
  };

  const getRebalanceUrgency = () => {
    const maxDeviation = Math.max(...holdings.map(h => Math.abs(h.deviation)));
    if (maxDeviation < 2) return { level: 'Good', color: theme.status.success.text, icon: CheckCircle };
    if (maxDeviation < 5) return { level: 'Monitor', color: theme.status.warning.text, icon: AlertTriangle };
    return { level: 'Rebalance Needed', color: theme.status.error.text, icon: AlertTriangle };
  };

  const urgency = getRebalanceUrgency();
  const UrgencyIcon = urgency.icon;

  return (
    <div className={`p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
      <div className="flex items-center gap-3 mb-6">
        <Scale className="w-6 h-6 text-blue-400" />
        <h2 className={`text-xl font-bold ${theme.textColors.primary}`}>
          Portfolio Rebalancing Calculator
        </h2>
      </div>

      {/* Portfolio Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label 
            htmlFor="total-portfolio-value"
            className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}
          >
            Total Portfolio Value
          </label>
          <div className="relative">
            <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted}`} aria-hidden="true">$</span>
            <input
              id="total-portfolio-value"
              type="number"
              value={totalPortfolioValue}
              onChange={(e) => setTotalPortfolioValue(safeParseFloat(e.target.value))}
              className={`pl-10 w-full px-3 py-2 border rounded-lg ${theme.backgrounds.card} ${theme.textColors.primary} ${
                getValidationError('totalPortfolioValue') ? 'border-red-500' : ''
              }`}
              placeholder="100000"
              min="1"
              max="10000000"
              aria-describedby={getValidationError('totalPortfolioValue') ? 'total-portfolio-value-error' : 'total-portfolio-value-help'}
              aria-invalid={!!getValidationError('totalPortfolioValue')}
            />
          </div>
          <div id="total-portfolio-value-help" className={`mt-1 text-xs ${theme.textColors.muted}`}>
            Enter value between $1 - $10,000,000
          </div>
          {getValidationError('totalPortfolioValue') && (
            <div id="total-portfolio-value-error" role="alert" className="mt-1 text-sm text-red-500">
              {getValidationError('totalPortfolioValue')}
            </div>
          )}
        </div>
        
        <div>
          <label 
            htmlFor="rebalance-threshold"
            className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}
          >
            Rebalance Threshold (%)
          </label>
          <div className="relative">
            <input
              id="rebalance-threshold"
              type="number"
              value={rebalanceThreshold}
              onChange={(e) => setRebalanceThreshold(safeParseFloat(e.target.value))}
              className={`w-full px-3 py-2 pr-8 border rounded-lg ${theme.backgrounds.card} ${theme.textColors.primary} ${
                getValidationError('rebalanceThreshold') ? 'border-red-500' : ''
              }`}
              placeholder="5"
              min="1"
              max="50"
              aria-describedby={getValidationError('rebalanceThreshold') ? 'rebalance-threshold-error' : 'rebalance-threshold-help'}
              aria-invalid={!!getValidationError('rebalanceThreshold')}
            />
            <span className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted}`} aria-hidden="true">%</span>
          </div>
          <div id="rebalance-threshold-help" className={`mt-1 text-xs ${theme.textColors.muted}`}>
            Rebalance when allocation deviates by this percentage
          </div>
          {getValidationError('rebalanceThreshold') && (
            <div id="rebalance-threshold-error" role="alert" className="mt-1 text-sm text-red-500">
              {getValidationError('rebalanceThreshold')}
            </div>
          )}
        </div>
      </div>

      {/* Current Portfolio Status */}
      <div className={`mb-6 p-4 rounded-lg border ${urgency.color === theme.status.success.text ? theme.status.success.bg : urgency.color === theme.status.warning.text ? theme.status.warning.bg : theme.status.error.bg}`}>
        <div className="flex items-center gap-2 mb-2">
          <UrgencyIcon className={`w-5 h-5 ${urgency.color}`} />
          <span className={`font-semibold ${urgency.color}`}>
            Portfolio Status: {urgency.level}
          </span>
        </div>
        {rebalanceActions.length > 0 && (
          <p className={`text-sm ${theme.textColors.secondary}`}>
            {rebalanceActions.length} rebalancing action(s) recommended • Estimated cost: ${totalCost.toFixed(2)}
          </p>
        )}
      </div>

      {/* Holdings Table */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>Asset Holdings</h3>
          <button
            onClick={addHolding}
            className={`px-4 py-2 ${theme.buttons.primary} text-white rounded-lg hover:opacity-90 transition-opacity`}
            aria-label="Add new asset to portfolio holdings"
          >
            Add Asset
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse" role="table" aria-label="Portfolio holdings for rebalancing analysis">
            <thead>
              <tr className={`border-b ${theme.borderColors.primary}`}>
                <th className={`text-left p-3 ${theme.textColors.secondary} font-medium`} scope="col">Asset</th>
                <th className={`text-left p-3 ${theme.textColors.secondary} font-medium`} scope="col">Current Value</th>
                <th className={`text-left p-3 ${theme.textColors.secondary} font-medium`} scope="col">Current %</th>
                <th className={`text-left p-3 ${theme.textColors.secondary} font-medium`} scope="col">Target %</th>
                <th className={`text-left p-3 ${theme.textColors.secondary} font-medium`} scope="col">Deviation</th>
                <th className={`text-left p-3 ${theme.textColors.secondary} font-medium`} scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((holding, index) => (
                <tr key={index} className={`border-b ${theme.borderColors.primary}`}>
                  <td className="p-3">
                    <label className="sr-only" htmlFor={`asset-name-${index}`}>
                      Asset name for holding {index + 1}
                    </label>
                    <input
                      id={`asset-name-${index}`}
                      type="text"
                      value={holding.name}
                      onChange={(e) => updateHolding(index, 'name', e.target.value)}
                      className={`w-full px-2 py-1 border rounded ${theme.backgrounds.card} ${theme.textColors.primary}`}
                      aria-label={`Asset name for holding ${index + 1}`}
                      placeholder="e.g., S&P 500"
                    />
                  </td>
                  <td className="p-3">
                    <div className="relative">
                      <label className="sr-only" htmlFor={`asset-value-${index}`}>
                        Current value for {holding.name || `holding ${index + 1}`}
                      </label>
                      <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                      <input
                        id={`asset-value-${index}`}
                        type="number"
                        value={holding.currentValue}
                        onChange={(e) => updateHolding(index, 'currentValue', Number(e.target.value))}
                        className={`pl-6 w-full px-2 py-1 border rounded ${theme.backgrounds.card} ${theme.textColors.primary}`}
                        aria-label={`Current value for ${holding.name || `holding ${index + 1}`}`}
                        min="0"
                        step="0.01"
                        placeholder="10000"
                      />
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`font-medium ${theme.textColors.primary}`} aria-label={`Current allocation: ${holding.currentPercentage.toFixed(1)} percent`}>
                      {holding.currentPercentage.toFixed(1)}%
                    </span>
                  </td>
                  <td className="p-3">
                    <label className="sr-only" htmlFor={`asset-target-${index}`}>
                      Target percentage for {holding.name || `holding ${index + 1}`}
                    </label>
                    <input
                      id={`asset-target-${index}`}
                      type="number"
                      value={holding.targetPercentage}
                      onChange={(e) => updateHolding(index, 'targetPercentage', Number(e.target.value))}
                      className={`w-16 px-2 py-1 border rounded ${theme.backgrounds.card} ${theme.textColors.primary}`}
                      min="0"
                      max="100"
                      step="0.1"
                      aria-label={`Target percentage for ${holding.name || `holding ${index + 1}`}`}
                      placeholder="25"
                    />
                  </td>
                  <td className="p-3">
                    <span 
                      className={`font-semibold ${getDeviationColor(holding.deviation)}`}
                      aria-label={`Deviation from target: ${holding.deviation > 0 ? 'positive' : 'negative'} ${Math.abs(holding.deviation).toFixed(1)} percent`}
                    >
                      {holding.deviation > 0 ? '+' : ''}{holding.deviation.toFixed(1)}%
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => removeHolding(index)}
                      className={`px-2 py-1 ${theme.status.error.bg} ${theme.status.error.text} rounded hover:opacity-80 transition-opacity`}
                      disabled={holdings.length <= 1}
                      aria-label={`Remove ${holding.name || `holding ${index + 1}`} from portfolio`}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rebalancing Actions */}
      {rebalanceActions.length > 0 && (
        <div className="mb-8" role="region" aria-labelledby="rebalancing-actions-heading">
          <h3 id="rebalancing-actions-heading" className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
            <Target className="w-5 h-5" aria-hidden="true" />
            Recommended Rebalancing Actions
          </h3>
          
          <div className="space-y-3" role="list" aria-label="List of recommended rebalancing actions">
            {rebalanceActions.map((action, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg border ${action.action === 'buy' ? theme.status.success.bg : theme.status.warning.bg}`}
                role="listitem"
                aria-label={`${action.action === 'buy' ? 'Buy' : 'Sell'} $${action.amount.toFixed(0)} of ${action.holding}. ${action.reason}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`font-semibold ${action.action === 'buy' ? theme.status.success.text : theme.status.warning.text} capitalize`}>
                      {action.action} ${action.amount.toFixed(0)} of {action.holding}
                    </span>
                    <p className={`text-sm ${theme.textColors.secondary} mt-1`}>
                      {action.reason}
                    </p>
                  </div>
                  <div className={`text-2xl ${action.action === 'buy' ? theme.status.success.text : theme.status.warning.text}`} aria-hidden="true">
                    {action.action === 'buy' ? '+' : '-'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={`mt-4 p-3 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg`} role="note" aria-label="Rebalancing strategy tip">
            <p className={`text-sm ${theme.status.info.text} font-medium`}>
              💡 <strong>Rebalancing Strategy:</strong> Consider tax implications and transaction costs. 
              For taxable accounts, use new contributions to rebalance rather than selling appreciated assets.
            </p>
          </div>
        </div>
      )}

      {/* Rebalancing Education */}
      <div className={`p-4 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`} role="region" aria-labelledby="rebalancing-education-heading">
        <h4 id="rebalancing-education-heading" className={`font-semibold ${theme.textColors.primary} mb-3 flex items-center gap-2`}>
          <Calendar className="w-4 h-4" aria-hidden="true" />
          Rebalancing Best Practices
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>When to Rebalance:</h5>
            <ul className={`space-y-1 ${theme.textColors.secondary}`} role="list">
              <li role="listitem">• Quarterly or semi-annually</li>
              <li role="listitem">• When deviation exceeds 5-10%</li>
              <li role="listitem">• During major life changes</li>
              <li role="listitem">• After significant market moves</li>
            </ul>
          </div>
          <div>
            <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>Cost Considerations:</h5>
            <ul className={`space-y-1 ${theme.textColors.secondary}`} role="list">
              <li role="listitem">• Transaction fees and spreads</li>
              <li role="listitem">• Tax implications (capital gains)</li>
              <li role="listitem">• Market impact on large trades</li>
              <li role="listitem">• Use new contributions first</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioRebalancingCalculator;
