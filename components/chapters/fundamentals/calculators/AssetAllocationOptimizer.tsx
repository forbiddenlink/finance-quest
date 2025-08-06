'use client';

import React, { useState, useEffect } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import {
  PieChart,
  Target,
  BarChart3,
  RefreshCw,
  CheckCircle,
  Globe,
  Shield
} from 'lucide-react';

interface ValidationError {
  field: string;
  message: string;
}

interface InputValidation {
  isValid: boolean;
  errors: ValidationError[];
}

interface AssetClass {
  id: string;
  name: string;
  percentage: number;
  expectedReturn: number;
  volatility: number;
  description: string;
  color: string;
}

interface PortfolioMetrics {
  expectedReturn: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
}

interface RebalancingSuggestion {
  asset: string;
  currentWeight: number;
  targetWeight: number;
  action: 'buy' | 'sell' | 'hold';
  amount: number;
}

export default function AssetAllocationOptimizer() {
  const { recordCalculatorUsage } = useProgressStore();
  
  const [portfolioValue, setPortfolioValue] = useState(100000);
  const [age, setAge] = useState(35);
  const [riskLevel, setRiskLevel] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate');
  const [rebalanceThreshold, setRebalanceThreshold] = useState(5);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  // Validation functions
  const safeParseFloat = (value: string, min: number = 0, max: number = Infinity): number => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? min : Math.max(min, Math.min(max, parsed));
  };

  const validateInput = (field: string, value: string): InputValidation => {
    const errors: ValidationError[] = [];
    
    switch (field) {
      case 'portfolioValue':
        const portfolioVal = safeParseFloat(value, 1, 10000000);
        if (portfolioVal < 1) {
          errors.push({ field, message: 'Portfolio value must be at least $1' });
        }
        if (portfolioVal > 10000000) {
          errors.push({ field, message: 'Portfolio value cannot exceed $10,000,000' });
        }
        break;
      case 'age':
        const ageVal = safeParseFloat(value, 18, 100);
        if (ageVal < 18) {
          errors.push({ field, message: 'Age must be at least 18' });
        }
        if (ageVal > 100) {
          errors.push({ field, message: 'Age cannot exceed 100' });
        }
        break;
      case 'rebalanceThreshold':
        const thresholdVal = safeParseFloat(value, 1, 50);
        if (thresholdVal < 1) {
          errors.push({ field, message: 'Threshold must be at least 1%' });
        }
        if (thresholdVal > 50) {
          errors.push({ field, message: 'Threshold cannot exceed 50%' });
        }
        break;
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  };

  // const clearValidationError = (field: string) => {
  //   setValidationErrors(prev => prev.filter(error => error.field !== field));
  // };

  const getValidationError = (field: string): string | undefined => {
    return validationErrors.find(error => error.field === field)?.message;
  };

  // Helper function to get CSS class for asset colors
  const getAssetColorClass = (assetId: string, type: 'bg' | 'accent'): string => {
    const colorMap: Record<string, string> = {
      'us_stocks': 'stocks',
      'intl_stocks': 'stocks', 
      'bonds': 'bonds',
      'reits': 'reits',
      'commodities': 'commodities'
    };
    const colorType = colorMap[assetId] || 'stocks';
    return `asset-${colorType}-${type}`;
  };
  
  const [assetClasses, setAssetClasses] = useState<AssetClass[]>([
    {
      id: 'us_stocks',
      name: 'US Stocks',
      percentage: 60,
      expectedReturn: 10.0,
      volatility: 16,
      description: 'S&P 500 and Total Stock Market index funds',
      color: '#10B981'
    },
    {
      id: 'intl_stocks',
      name: 'International Stocks',
      percentage: 20,
      expectedReturn: 8.5,
      volatility: 18,
      description: 'Developed and emerging market stocks',
      color: '#3B82F6'
    },
    {
      id: 'bonds',
      name: 'Bonds',
      percentage: 15,
      expectedReturn: 4.5,
      volatility: 4,
      description: 'Government and corporate bonds',
      color: '#F59E0B'
    },
    {
      id: 'reits',
      name: 'REITs',
      percentage: 5,
      expectedReturn: 8.0,
      volatility: 20,
      description: 'Real Estate Investment Trusts',
      color: '#EF4444'
    }
  ]);

  useEffect(() => {
    recordCalculatorUsage('asset-allocation-optimizer');
  }, [recordCalculatorUsage]);

  const calculatePortfolioMetrics = (): PortfolioMetrics => {
    const totalPercentage = assetClasses.reduce((sum, asset) => sum + asset.percentage, 0);
    
    // Normalize percentages if they don't add up to 100
    const normalizedAssets = assetClasses.map(asset => ({
      ...asset,
      weight: asset.percentage / totalPercentage
    }));
    
    // Portfolio expected return
    const expectedReturn = normalizedAssets.reduce(
      (sum, asset) => sum + (asset.expectedReturn * asset.weight), 0
    );
    
    // Portfolio volatility (simplified calculation)
    const volatility = Math.sqrt(
      normalizedAssets.reduce((sum, asset) => 
        sum + Math.pow(asset.volatility * asset.weight, 2), 0
      )
    );
    
    // Sharpe ratio (assuming 2% risk-free rate)
    const riskFreeRate = 2.0;
    const sharpeRatio = (expectedReturn - riskFreeRate) / volatility;
    
    // Estimated max drawdown based on volatility
    const maxDrawdown = volatility * 2.5; // Rough approximation
    
    return {
      expectedReturn,
      volatility,
      sharpeRatio,
      maxDrawdown
    };
  };

  const getTargetAllocation = () => {
    const stockPercentage = Math.max(20, Math.min(90, 120 - age));
    
    const allocations = {
      conservative: {
        us_stocks: stockPercentage * 0.6,
        intl_stocks: stockPercentage * 0.25,
        bonds: 100 - stockPercentage,
        reits: stockPercentage * 0.15
      },
      moderate: {
        us_stocks: stockPercentage * 0.7,
        intl_stocks: stockPercentage * 0.2,
        bonds: 100 - stockPercentage,
        reits: stockPercentage * 0.1
      },
      aggressive: {
        us_stocks: stockPercentage * 0.75,
        intl_stocks: stockPercentage * 0.2,
        bonds: Math.max(5, 100 - stockPercentage),
        reits: stockPercentage * 0.05
      }
    };
    
    return allocations[riskLevel];
  };

  const generateRebalancingSuggestions = (): RebalancingSuggestion[] => {
    const targetAllocation = getTargetAllocation();
    const suggestions: RebalancingSuggestion[] = [];
    
    assetClasses.forEach(asset => {
      const targetWeight = targetAllocation[asset.id as keyof typeof targetAllocation] || 0;
      const currentWeight = asset.percentage;
      const difference = Math.abs(currentWeight - targetWeight);
      
      if (difference >= rebalanceThreshold) {
        const action = currentWeight > targetWeight ? 'sell' : 'buy';
        const amount = (Math.abs(currentWeight - targetWeight) / 100) * portfolioValue;
        
        suggestions.push({
          asset: asset.name,
          currentWeight,
          targetWeight,
          action,
          amount
        });
      }
    });
    
    return suggestions;
  };

  const applyTargetAllocation = () => {
    const targetAllocation = getTargetAllocation();
    
    setAssetClasses(prev => prev.map(asset => ({
      ...asset,
      percentage: targetAllocation[asset.id as keyof typeof targetAllocation] || 0
    })));
  };

  const updateAssetPercentage = (id: string, percentage: number) => {
    setAssetClasses(prev => prev.map(asset =>
      asset.id === id ? { ...asset, percentage: Math.max(0, Math.min(100, percentage)) } : asset
    ));
  };

  const normalizePercentages = () => {
    const total = assetClasses.reduce((sum, asset) => sum + asset.percentage, 0);
    if (total !== 100 && total > 0) {
      setAssetClasses(prev => prev.map(asset => ({
        ...asset,
        percentage: (asset.percentage / total) * 100
      })));
    }
  };

  const metrics = calculatePortfolioMetrics();
  const rebalancingSuggestions = generateRebalancingSuggestions();
  const targetAllocation = getTargetAllocation();
  const totalPercentage = assetClasses.reduce((sum, asset) => sum + asset.percentage, 0);

  return (
    <div className={`max-w-7xl mx-auto ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg shadow-lg p-6`}>
      <div className="mb-6">
        <h2 className={`${theme.typography.heading2} ${theme.textColors.primary} mb-2 flex items-center gap-3`}>
          <div className={`${theme.status.success.bg} p-2 rounded-lg`}>
            <PieChart className={`w-6 h-6 ${theme.status.success.text}`} />
          </div>
          Asset Allocation Optimizer
        </h2>
        <p className={`${theme.textColors.secondary}`}>
          Build and optimize your investment portfolio allocation based on your age, risk tolerance, and goals
        </p>
      </div>

      {/* Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-4`}>
          <label 
            htmlFor="portfolio-value-input"
            className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}
          >
            Portfolio Value
          </label>
          <div className="relative">
            <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted}`} aria-hidden="true">$</span>
            <input
              id="portfolio-value-input"
              type="number"
              value={portfolioValue}
              onChange={(e) => {
                const validation = validateInput('portfolioValue', e.target.value);
                setValidationErrors(prev => prev.filter(error => error.field !== 'portfolioValue').concat(validation.errors));
                setPortfolioValue(safeParseFloat(e.target.value, 1, 10000000));
              }}
              onBlur={(e) => {
                const validation = validateInput('portfolioValue', e.target.value);
                setValidationErrors(prev => prev.filter(error => error.field !== 'portfolioValue').concat(validation.errors));
              }}
              aria-describedby={getValidationError('portfolioValue') ? 'portfolio-value-error' : 'portfolio-value-help'}
              aria-invalid={getValidationError('portfolioValue') ? "true" : "false"}
              className={`w-full pl-8 pr-4 py-2 border ${getValidationError('portfolioValue') ? 'border-red-500' : theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-blue-500 ${theme.textColors.primary} bg-slate-800`}
              min="1"
              max="10000000"
              step="1000"
            />
          </div>
          <div id="portfolio-value-help" className={`mt-1 text-xs ${theme.textColors.muted}`}>
            Enter value between $1 - $10,000,000
          </div>
          {getValidationError('portfolioValue') && (
            <div id="portfolio-value-error" role="alert" className="mt-1 text-sm text-red-500">
              {getValidationError('portfolioValue')}
            </div>
          )}
        </div>

        <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-4`}>
          <label 
            htmlFor="age-input"
            className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}
          >
            Your Age
          </label>
          <input
            id="age-input"
            type="number"
            value={age}
            onChange={(e) => {
              const validation = validateInput('age', e.target.value);
              setValidationErrors(prev => prev.filter(error => error.field !== 'age').concat(validation.errors));
              setAge(safeParseFloat(e.target.value, 18, 100));
            }}
            onBlur={(e) => {
              const validation = validateInput('age', e.target.value);
              setValidationErrors(prev => prev.filter(error => error.field !== 'age').concat(validation.errors));
            }}
            aria-describedby={getValidationError('age') ? 'age-error' : 'age-help'}
            aria-invalid={getValidationError('age') ? "true" : "false"}
            className={`w-full px-3 py-2 border ${getValidationError('age') ? 'border-red-500' : theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-blue-500 ${theme.textColors.primary} bg-slate-800`}
            min="18"
            max="100"
          />
          <div id="age-help" className={`mt-1 text-xs ${theme.textColors.muted}`}>
            Age 18-100 (affects allocation strategy)
          </div>
          {getValidationError('age') && (
            <div id="age-error" role="alert" className="mt-1 text-sm text-red-500">
              {getValidationError('age')}
            </div>
          )}
        </div>

        <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-4`}>
          <label 
            htmlFor="risk-level-select"
            className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}
          >
            Risk Level
          </label>
          <select
            id="risk-level-select"
            value={riskLevel}
            onChange={(e) => setRiskLevel(e.target.value as 'conservative' | 'moderate' | 'aggressive')}
            aria-describedby="risk-level-help"
            className={`w-full px-3 py-2 border ${theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-blue-500 ${theme.textColors.primary} bg-slate-800`}
          >
            <option value="conservative">Conservative</option>
            <option value="moderate">Moderate</option>
            <option value="aggressive">Aggressive</option>
          </select>
          <div id="risk-level-help" className={`mt-1 text-xs ${theme.textColors.muted}`}>
            Conservative = Lower risk, Aggressive = Higher risk
          </div>
        </div>

        <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-4`}>
          <label 
            htmlFor="rebalance-threshold-input"
            className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}
          >
            Rebalance Threshold
          </label>
          <div className="relative">
            <input
              id="rebalance-threshold-input"
              type="number"
              value={rebalanceThreshold}
              onChange={(e) => {
                const validation = validateInput('rebalanceThreshold', e.target.value);
                setValidationErrors(prev => prev.filter(error => error.field !== 'rebalanceThreshold').concat(validation.errors));
                setRebalanceThreshold(safeParseFloat(e.target.value, 1, 50));
              }}
              onBlur={(e) => {
                const validation = validateInput('rebalanceThreshold', e.target.value);
                setValidationErrors(prev => prev.filter(error => error.field !== 'rebalanceThreshold').concat(validation.errors));
              }}
              aria-describedby={getValidationError('rebalanceThreshold') ? 'rebalance-threshold-error' : 'rebalance-threshold-help'}
              aria-invalid={getValidationError('rebalanceThreshold') ? "true" : "false"}
              className={`w-full pl-3 pr-8 py-2 border ${getValidationError('rebalanceThreshold') ? 'border-red-500' : theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-blue-500 ${theme.textColors.primary} bg-slate-800`}
              min="1"
              max="50"
            />
            <span className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted}`} aria-hidden="true">%</span>
          </div>
          <div id="rebalance-threshold-help" className={`mt-1 text-xs ${theme.textColors.muted}`}>
            Trigger rebalancing when assets drift by this %
          </div>
          {getValidationError('rebalanceThreshold') && (
            <div id="rebalance-threshold-error" role="alert" className="mt-1 text-sm text-red-500">
              {getValidationError('rebalanceThreshold')}
            </div>
          )}
        </div>
      </div>

      {/* Current Allocation vs Target */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Current Allocation */}
        <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-6`}>
          <h3 className={`${theme.typography.heading3} ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
            <BarChart3 className="w-5 h-5" />
            Current Allocation
          </h3>
          
          <div className="space-y-4">
            {assetClasses.map((asset) => (
              <div key={asset.id}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-medium ${theme.textColors.primary}`}>{asset.name}</span>
                  <span className={`font-bold ${theme.textColors.primary}`}>
                    {asset.percentage.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={asset.percentage}
                    onChange={(e) => updateAssetPercentage(asset.id, Number(e.target.value))}
                    className={`flex-1 ${getAssetColorClass(asset.id, 'accent')}`}
                    aria-label={`${asset.name} allocation percentage slider`}
                  />
                  <input
                    type="number"
                    value={asset.percentage.toFixed(1)}
                    onChange={(e) => updateAssetPercentage(asset.id, Number(e.target.value))}
                    className={`w-16 px-2 py-1 border ${theme.borderColors.primary} rounded text-sm`}
                    min="0"
                    max="100"
                    step="0.1"
                    aria-label={`${asset.name} allocation percentage input`}
                  />
                </div>
                <p className={`text-xs ${theme.textColors.muted} mt-1`}>
                  {asset.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className={`font-medium ${theme.textColors.secondary}`}>Total:</span>
              <span className={`font-bold ${totalPercentage === 100 ? 'text-green-600' : 'text-red-600'}`}>
                {totalPercentage.toFixed(1)}%
              </span>
            </div>
            
            {totalPercentage !== 100 && (
              <div className="mt-2">
                <button
                  onClick={normalizePercentages}
                  className={`${theme.buttons.primary} px-4 py-2 rounded-lg text-sm transition-all hover-lift`}
                >
                  Normalize to 100%
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Target Allocation */}
        <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-6`}>
          <h3 className={`${theme.typography.heading3} ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
            <Target className="w-5 h-5" />
            Recommended Target
          </h3>
          
          <div className="space-y-4">
            {assetClasses.map((asset) => {
              const targetWeight = targetAllocation[asset.id as keyof typeof targetAllocation] || 0;
              const difference = asset.percentage - targetWeight;
              
              return (
                <div key={asset.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`font-medium ${theme.textColors.primary}`}>{asset.name}</span>
                      <span className={`font-bold ${theme.textColors.primary}`}>
                        {targetWeight.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div 
                        className="h-2 bg-gray-200 rounded-full flex-1"
                      >
                        <div 
                          className={`h-2 rounded-full dynamic-width ${getAssetColorClass(asset.id, 'bg')}`}
                          style={{ "--dynamic-width": `${targetWeight}%` } as React.CSSProperties}
                        ></div>
                      </div>
                      {Math.abs(difference) >= rebalanceThreshold && (
                        <span className={`text-xs px-2 py-1 rounded ${
                          difference > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {difference > 0 ? '-' : '+'}{Math.abs(difference).toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4">
            <button
              onClick={applyTargetAllocation}
              className={`w-full ${theme.buttons.primary} px-4 py-2 rounded-lg transition-all hover-lift`}
            >
              Apply Target Allocation
            </button>
          </div>
        </div>
      </div>

      {/* Portfolio Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className={`${theme.status.success.bg} border ${theme.status.success.border} rounded-lg p-4 text-center`}>
          <h4 className={`font-semibold ${theme.status.success.text} mb-2`}>Expected Return</h4>
          <p className={`text-2xl font-bold ${theme.textColors.primary}`}>
            {metrics.expectedReturn.toFixed(1)}%
          </p>
          <p className={`text-xs ${theme.textColors.secondary}`}>Annual average</p>
        </div>

        <div className={`${theme.status.warning.bg} border ${theme.status.warning.border} rounded-lg p-4 text-center`}>
          <h4 className={`font-semibold ${theme.status.warning.text} mb-2`}>Volatility</h4>
          <p className={`text-2xl font-bold ${theme.textColors.primary}`}>
            {metrics.volatility.toFixed(1)}%
          </p>
          <p className={`text-xs ${theme.textColors.secondary}`}>Standard deviation</p>
        </div>

        <div className={`${theme.status.info.bg} border ${theme.status.info.border} rounded-lg p-4 text-center`}>
          <h4 className={`font-semibold ${theme.status.info.text} mb-2`}>Sharpe Ratio</h4>
          <p className={`text-2xl font-bold ${theme.textColors.primary}`}>
            {metrics.sharpeRatio.toFixed(2)}
          </p>
          <p className={`text-xs ${theme.textColors.secondary}`}>Risk-adjusted return</p>
        </div>

        <div className={`${theme.status.error.bg} border ${theme.status.error.border} rounded-lg p-4 text-center`}>
          <h4 className={`font-semibant ${theme.status.error.text} mb-2`}>Max Drawdown</h4>
          <p className={`text-2xl font-bold ${theme.textColors.primary}`}>
            -{metrics.maxDrawdown.toFixed(1)}%
          </p>
          <p className={`text-xs ${theme.textColors.secondary}`}>Estimated worst case</p>
        </div>
      </div>

      {/* Rebalancing Suggestions */}
      {rebalancingSuggestions.length > 0 && (
        <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-6 mb-6`}>
          <h3 className={`${theme.typography.heading3} ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
            <RefreshCw className="w-5 h-5" />
            Rebalancing Suggestions
          </h3>
          
          <div className="space-y-3">
            {rebalancingSuggestions.map((suggestion, index) => (
              <div key={index} className={`p-4 ${theme.status.warning.bg} border ${theme.status.warning.border} rounded-lg`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className={`font-semibold ${theme.status.warning.text}`}>
                      {suggestion.action === 'buy' ? '📈 Buy' : '📉 Sell'} {suggestion.asset}
                    </h4>
                    <p className={`text-sm ${theme.textColors.secondary}`}>
                      Current: {suggestion.currentWeight.toFixed(1)}% → Target: {suggestion.targetWeight.toFixed(1)}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${theme.textColors.primary}`}>
                      ${suggestion.amount.toLocaleString()}
                    </p>
                    <p className={`text-xs ${theme.textColors.muted}`}>
                      {suggestion.action === 'buy' ? 'to purchase' : 'to sell'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Investment Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-6`}>
          <h3 className={`${theme.typography.heading4} ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
            <Shield className="w-5 h-5" />
            Portfolio Management Tips
          </h3>
          <ul className={`space-y-3 text-sm ${theme.textColors.secondary}`}>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              Rebalance annually or when allocations drift 5%+ from targets
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              Use tax-advantaged accounts for less tax-efficient assets
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              Consider low-cost index funds for each asset class
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              Increase stock allocation when young, decrease as you age
            </li>
          </ul>
        </div>

        <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-6`}>
          <h3 className={`${theme.typography.heading4} ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
            <Globe className="w-5 h-5" />
            Long-Term Projections
          </h3>
          <div className="space-y-3">
            <div className={`p-3 ${theme.status.success.bg} border ${theme.status.success.border} rounded-lg`}>
              <h4 className={`font-semibold ${theme.status.success.text} mb-1`}>10 Years</h4>
              <p className={`text-lg font-bold ${theme.textColors.primary}`}>
                ${(portfolioValue * Math.pow(1 + metrics.expectedReturn/100, 10)).toLocaleString()}
              </p>
            </div>
            <div className={`p-3 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg`}>
              <h4 className={`font-semibold ${theme.status.info.text} mb-1`}>20 Years</h4>
              <p className={`text-lg font-bold ${theme.textColors.primary}`}>
                ${(portfolioValue * Math.pow(1 + metrics.expectedReturn/100, 20)).toLocaleString()}
              </p>
            </div>
            <div className={`p-3 ${theme.status.warning.bg} border ${theme.status.warning.border} rounded-lg`}>
              <h4 className={`font-semibold ${theme.status.warning.text} mb-1`}>30 Years</h4>
              <p className={`text-lg font-bold ${theme.textColors.primary}`}>
                ${(portfolioValue * Math.pow(1 + metrics.expectedReturn/100, 30)).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
