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

  useEffect(() => {
    recordCalculatorUsage('portfolio-rebalancing-calculator');
  }, [recordCalculatorUsage]);

  const calculateRebalancing = React.useCallback(() => {
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
  }, [holdings, totalPortfolioValue, rebalanceThreshold]);

  useEffect(() => {
    calculateRebalancing();
  }, [calculateRebalancing]); // Remove calculateRebalancing from dependencies

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
          <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
            Total Portfolio Value
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="number"
              value={totalPortfolioValue}
              onChange={(e) => setTotalPortfolioValue(Number(e.target.value))}
              className={`pl-10 w-full px-3 py-2 border rounded-lg ${theme.backgrounds.card} ${theme.textColors.primary}`}
              placeholder="100000"
            />
          </div>
        </div>
        
        <div>
          <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
            Rebalance Threshold (%)
          </label>
          <input
            type="number"
            value={rebalanceThreshold}
            onChange={(e) => setRebalanceThreshold(Number(e.target.value))}
            className={`w-full px-3 py-2 border rounded-lg ${theme.backgrounds.card} ${theme.textColors.primary}`}
            placeholder="5"
            min="1"
            max="20"
          />
          <p className={`text-xs ${theme.textColors.secondary} mt-1`}>
            Rebalance when allocation deviates by this percentage
          </p>
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
          >
            Add Asset
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className={`border-b ${theme.borderColors.primary}`}>
                <th className={`text-left p-3 ${theme.textColors.secondary} font-medium`}>Asset</th>
                <th className={`text-left p-3 ${theme.textColors.secondary} font-medium`}>Current Value</th>
                <th className={`text-left p-3 ${theme.textColors.secondary} font-medium`}>Current %</th>
                <th className={`text-left p-3 ${theme.textColors.secondary} font-medium`}>Target %</th>
                <th className={`text-left p-3 ${theme.textColors.secondary} font-medium`}>Deviation</th>
                <th className={`text-left p-3 ${theme.textColors.secondary} font-medium`}>Action</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((holding, index) => (
                <tr key={index} className={`border-b ${theme.borderColors.primary}`}>
                  <td className="p-3">
                    <input
                      type="text"
                      value={holding.name}
                      onChange={(e) => updateHolding(index, 'name', e.target.value)}
                      className={`w-full px-2 py-1 border rounded ${theme.backgrounds.card} ${theme.textColors.primary}`}
                    />
                  </td>
                  <td className="p-3">
                    <div className="relative">
                      <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-400" />
                      <input
                        type="number"
                        value={holding.currentValue}
                        onChange={(e) => updateHolding(index, 'currentValue', Number(e.target.value))}
                        className={`pl-6 w-full px-2 py-1 border rounded ${theme.backgrounds.card} ${theme.textColors.primary}`}
                      />
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`font-medium ${theme.textColors.primary}`}>
                      {holding.currentPercentage.toFixed(1)}%
                    </span>
                  </td>
                  <td className="p-3">
                    <input
                      type="number"
                      value={holding.targetPercentage}
                      onChange={(e) => updateHolding(index, 'targetPercentage', Number(e.target.value))}
                      className={`w-16 px-2 py-1 border rounded ${theme.backgrounds.card} ${theme.textColors.primary}`}
                      min="0"
                      max="100"
                    />
                  </td>
                  <td className="p-3">
                    <span className={`font-semibold ${getDeviationColor(holding.deviation)}`}>
                      {holding.deviation > 0 ? '+' : ''}{holding.deviation.toFixed(1)}%
                    </span>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => removeHolding(index)}
                      className={`px-2 py-1 ${theme.status.error.bg} ${theme.status.error.text} rounded hover:opacity-80 transition-opacity`}
                      disabled={holdings.length <= 1}
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
        <div className="mb-8">
          <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
            <Target className="w-5 h-5" />
            Recommended Rebalancing Actions
          </h3>
          
          <div className="space-y-3">
            {rebalanceActions.map((action, index) => (
              <div key={index} className={`p-4 rounded-lg border ${action.action === 'buy' ? theme.status.success.bg : theme.status.warning.bg}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`font-semibold ${action.action === 'buy' ? theme.status.success.text : theme.status.warning.text} capitalize`}>
                      {action.action} ${action.amount.toFixed(0)} of {action.holding}
                    </span>
                    <p className={`text-sm ${theme.textColors.secondary} mt-1`}>
                      {action.reason}
                    </p>
                  </div>
                  <div className={`text-2xl ${action.action === 'buy' ? theme.status.success.text : theme.status.warning.text}`}>
                    {action.action === 'buy' ? '+' : '-'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className={`mt-4 p-3 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg`}>
            <p className={`text-sm ${theme.status.info.text} font-medium`}>
              💡 <strong>Rebalancing Strategy:</strong> Consider tax implications and transaction costs. 
              For taxable accounts, use new contributions to rebalance rather than selling appreciated assets.
            </p>
          </div>
        </div>
      )}

      {/* Rebalancing Education */}
      <div className={`p-4 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
        <h4 className={`font-semibold ${theme.textColors.primary} mb-3 flex items-center gap-2`}>
          <Calendar className="w-4 h-4" />
          Rebalancing Best Practices
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>When to Rebalance:</h5>
            <ul className={`space-y-1 ${theme.textColors.secondary}`}>
              <li>• Quarterly or semi-annually</li>
              <li>• When deviation exceeds 5-10%</li>
              <li>• During major life changes</li>
              <li>• After significant market moves</li>
            </ul>
          </div>
          <div>
            <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>Cost Considerations:</h5>
            <ul className={`space-y-1 ${theme.textColors.secondary}`}>
              <li>• Transaction fees and spreads</li>
              <li>• Tax implications (capital gains)</li>
              <li>• Market impact on large trades</li>
              <li>• Use new contributions first</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortfolioRebalancingCalculator;
