'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import {
  TrendingDown,
  DollarSign,
  Percent,
  PieChart,
  AlertTriangle,
  Info
} from 'lucide-react';

interface Investment {
  id: string;
  name: string;
  purchasePrice: number;
  currentPrice: number;
  shares: number;
  purchaseDate: string;
  type: 'stock' | 'bond' | 'etf' | 'mutual_fund';
}

interface HarvestingAnalysis {
  totalGains: number;
  totalLosses: number;
  harvestableShortTerm: number;
  harvestableLongTerm: number;
  taxSavings: number;
  washSaleRisk: boolean;
  recommendations: string[];
}

export default function TaxLossHarvestingCalculator() {
  const { recordCalculatorUsage } = useProgressStore();
  
  const [marginalTaxRate, setMarginalTaxRate] = useState<number>(24);
  const [capitalGainsRate, setCapitalGainsRate] = useState<number>(15);
  const [realizedGains, setRealizedGains] = useState<number>(0);
  
  const [investments, setInvestments] = useState<Investment[]>([
    {
      id: '1',
      name: 'Tech Stock A',
      purchasePrice: 100,
      currentPrice: 85,
      shares: 50,
      purchaseDate: '2024-03-15',
      type: 'stock'
    },
    {
      id: '2',
      name: 'Growth ETF',
      purchasePrice: 200,
      currentPrice: 180,
      shares: 25,
      purchaseDate: '2023-08-20',
      type: 'etf'
    },
    {
      id: '3',
      name: 'Bond Fund',
      purchasePrice: 50,
      currentPrice: 55,
      shares: 100,
      purchaseDate: '2023-01-10',
      type: 'mutual_fund'
    }
  ]);

  const [analysis, setAnalysis] = useState<HarvestingAnalysis | null>(null);

  useEffect(() => {
    recordCalculatorUsage('tax-loss-harvesting-calculator');
  }, [recordCalculatorUsage]);

  const addInvestment = () => {
    const newInvestment: Investment = {
      id: Date.now().toString(),
      name: `Investment ${investments.length + 1}`,
      purchasePrice: 100,
      currentPrice: 90,
      shares: 10,
      purchaseDate: new Date().toISOString().split('T')[0],
      type: 'stock'
    };
    setInvestments([...investments, newInvestment]);
  };

  const updateInvestment = (id: string, field: keyof Investment, value: string | number) => {
    setInvestments(prev => prev.map(inv => 
      inv.id === id ? { ...inv, [field]: value } : inv
    ));
  };

  const removeInvestment = (id: string) => {
    setInvestments(prev => prev.filter(inv => inv.id !== id));
  };

  const calculateHoldingPeriod = (purchaseDate: string): number => {
    const purchase = new Date(purchaseDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - purchase.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const analyzeHarvesting = useCallback(() => {
    let totalGains = 0;
    let totalLosses = 0;
    let harvestableShortTerm = 0;
    let harvestableLongTerm = 0;
    let washSaleRisk = false;
    const recommendations: string[] = [];

    investments.forEach(investment => {
      const gainLoss = (investment.currentPrice - investment.purchasePrice) * investment.shares;
      const holdingDays = calculateHoldingPeriod(investment.purchaseDate);
      const isLongTerm = holdingDays > 365;

      if (gainLoss > 0) {
        totalGains += gainLoss;
      } else {
        totalLosses += Math.abs(gainLoss);
        if (isLongTerm) {
          harvestableLongTerm += Math.abs(gainLoss);
        } else {
          harvestableShortTerm += Math.abs(gainLoss);
        }
      }

      // Check for potential wash sale violations
      if (gainLoss < 0) {
        const daysSincePurchase = holdingDays;
        if (daysSincePurchase < 31) {
          washSaleRisk = true;
        }
      }
    });

    // Calculate tax savings
    const shortTermTaxSavings = harvestableShortTerm * (marginalTaxRate / 100);
    const longTermTaxSavings = harvestableLongTerm * (capitalGainsRate / 100);
    const totalTaxSavings = shortTermTaxSavings + longTermTaxSavings;

    // Generate recommendations
    if (harvestableShortTerm > 0 || harvestableLongTerm > 0) {
      recommendations.push("Consider harvesting losses to offset current year gains");
    }

    if (harvestableShortTerm > harvestableLongTerm) {
      recommendations.push("Prioritize harvesting short-term losses (higher tax rate)");
    }

    if (realizedGains > 0) {
      const maxOffset = Math.min(realizedGains, totalLosses);
      recommendations.push(`You can offset up to $${maxOffset.toLocaleString()} in realized gains`);
    }

    if (totalLosses > realizedGains) {
      const excessLoss = totalLosses - realizedGains;
      const carryForward = Math.max(0, excessLoss - 3000);
      if (carryForward > 0) {
        recommendations.push(`$${carryForward.toLocaleString()} in losses can be carried forward to future years`);
      }
    }

    if (washSaleRisk) {
      recommendations.push("⚠️ Wash sale rule may apply - wait 31 days before repurchasing");
    }

    const analysisResult: HarvestingAnalysis = {
      totalGains,
      totalLosses,
      harvestableShortTerm,
      harvestableLongTerm,
      taxSavings: totalTaxSavings,
      washSaleRisk,
      recommendations
    };

    setAnalysis(analysisResult);
  }, [investments, marginalTaxRate, capitalGainsRate, realizedGains]);

  useEffect(() => {
    analyzeHarvesting();
  }, [analyzeHarvesting]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getGainLossColor = (gainLoss: number): string => {
    if (gainLoss > 0) return 'text-green-400';
    if (gainLoss < 0) return 'text-red-400';
    return theme.textColors.primary;
  };

  return (
    <div className={`p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
      <div className="flex items-center gap-3 mb-6">
        <TrendingDown className="w-6 h-6 text-red-400" />
        <h2 className={`text-xl font-bold ${theme.textColors.primary}`}>
          Tax-Loss Harvesting Calculator
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration Section */}
        <div className="space-y-6">
          <div>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Tax Settings
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Marginal Tax Rate (%)
                </label>
                <div className="relative">
                  <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    value={marginalTaxRate}
                    onChange={(e) => setMarginalTaxRate(Number(e.target.value))}
                    className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    placeholder="24"
                    min="10"
                    max="37"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Capital Gains Rate (%)
                </label>
                <div className="relative">
                  <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    value={capitalGainsRate}
                    onChange={(e) => setCapitalGainsRate(Number(e.target.value))}
                    className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    placeholder="15"
                    min="0"
                    max="20"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Realized Gains This Year
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    value={realizedGains}
                    onChange={(e) => setRealizedGains(Number(e.target.value))}
                    className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>
                Portfolio Holdings
              </h3>
              <button
                onClick={addInvestment}
                className={`px-3 py-1 text-sm ${theme.buttons.secondary} rounded`}
              >
                Add Investment
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {investments.map((investment) => {
                const gainLoss = (investment.currentPrice - investment.purchasePrice) * investment.shares;
                const holdingDays = calculateHoldingPeriod(investment.purchaseDate);
                const isLongTerm = holdingDays > 365;
                
                return (
                  <div key={investment.id} className={`p-3 bg-slate-800/50 border ${theme.borderColors.primary} rounded-lg`}>
                    <div className="flex items-center justify-between mb-2">
                      <input
                        type="text"
                        value={investment.name}
                        onChange={(e) => updateInvestment(investment.id, 'name', e.target.value)}
                        className={`bg-transparent ${theme.textColors.primary} font-medium border-none outline-none`}
                      />
                      <button
                        onClick={() => removeInvestment(investment.id)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className={`${theme.textColors.secondary}`}>Purchase Price</label>
                        <input
                          type="number"
                          value={investment.purchasePrice}
                          onChange={(e) => updateInvestment(investment.id, 'purchasePrice', Number(e.target.value))}
                          className={`w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded ${theme.textColors.primary} text-xs`}
                        />
                      </div>
                      <div>
                        <label className={`${theme.textColors.secondary}`}>Current Price</label>
                        <input
                          type="number"
                          value={investment.currentPrice}
                          onChange={(e) => updateInvestment(investment.id, 'currentPrice', Number(e.target.value))}
                          className={`w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded ${theme.textColors.primary} text-xs`}
                        />
                      </div>
                      <div>
                        <label className={`${theme.textColors.secondary}`}>Shares</label>
                        <input
                          type="number"
                          value={investment.shares}
                          onChange={(e) => updateInvestment(investment.id, 'shares', Number(e.target.value))}
                          className={`w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded ${theme.textColors.primary} text-xs`}
                        />
                      </div>
                      <div>
                        <label className={`${theme.textColors.secondary}`}>Purchase Date</label>
                        <input
                          type="date"
                          value={investment.purchaseDate}
                          onChange={(e) => updateInvestment(investment.id, 'purchaseDate', e.target.value)}
                          className={`w-full px-2 py-1 bg-slate-700 border border-slate-600 rounded ${theme.textColors.primary} text-xs`}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-2 pt-2 border-t border-slate-600">
                      <div className="flex justify-between items-center">
                        <span className={`text-xs ${theme.textColors.secondary}`}>
                          {isLongTerm ? 'Long-term' : 'Short-term'} ({holdingDays} days)
                        </span>
                        <span className={`text-sm font-semibold ${getGainLossColor(gainLoss)}`}>
                          {gainLoss >= 0 ? '+' : ''}{formatCurrency(gainLoss)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Analysis Section */}
        <div className="lg:col-span-2 space-y-6">
          {analysis && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 bg-red-900/20 border ${theme.borderColors.primary} rounded-lg`}>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="w-5 h-5 text-red-400" />
                    <h4 className={`font-semibold ${theme.textColors.primary}`}>Total Losses</h4>
                  </div>
                  <div className="text-xl font-bold text-red-400">
                    {formatCurrency(analysis.totalLosses)}
                  </div>
                </div>

                <div className={`p-4 bg-green-900/20 border ${theme.borderColors.primary} rounded-lg`}>
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    <h4 className={`font-semibold ${theme.textColors.primary}`}>Tax Savings</h4>
                  </div>
                  <div className="text-xl font-bold text-green-400">
                    {formatCurrency(analysis.taxSavings)}
                  </div>
                </div>

                <div className={`p-4 bg-blue-900/20 border ${theme.borderColors.primary} rounded-lg`}>
                  <div className="flex items-center gap-2 mb-2">
                    <PieChart className="w-5 h-5 text-blue-400" />
                    <h4 className={`font-semibold ${theme.textColors.primary}`}>Net Position</h4>
                  </div>
                  <div className={`text-xl font-bold ${getGainLossColor(analysis.totalGains - analysis.totalLosses)}`}>
                    {formatCurrency(analysis.totalGains - analysis.totalLosses)}
                  </div>
                </div>
              </div>

              {/* Harvesting Breakdown */}
              <div className={`border ${theme.borderColors.primary} rounded-lg overflow-hidden`}>
                <div className={`bg-slate-800 px-4 py-3 border-b ${theme.borderColors.primary}`}>
                  <h3 className={`font-semibold ${theme.textColors.primary}`}>
                    Harvestable Losses Breakdown
                  </h3>
                </div>
                
                <div className="p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className={`${theme.textColors.primary}`}>Short-term Losses</span>
                    <div className="text-right">
                      <div className={`font-semibold ${theme.textColors.primary}`}>
                        {formatCurrency(analysis.harvestableShortTerm)}
                      </div>
                      <div className={`text-xs ${theme.textColors.secondary}`}>
                        Tax savings: {formatCurrency(analysis.harvestableShortTerm * (marginalTaxRate / 100))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className={`${theme.textColors.primary}`}>Long-term Losses</span>
                    <div className="text-right">
                      <div className={`font-semibold ${theme.textColors.primary}`}>
                        {formatCurrency(analysis.harvestableLongTerm)}
                      </div>
                      <div className={`text-xs ${theme.textColors.secondary}`}>
                        Tax savings: {formatCurrency(analysis.harvestableLongTerm * (capitalGainsRate / 100))}
                      </div>
                    </div>
                  </div>
                  
                  <div className={`border-t ${theme.borderColors.primary} pt-4`}>
                    <div className="flex justify-between items-center">
                      <span className={`font-semibold ${theme.textColors.primary}`}>Total Tax Savings</span>
                      <span className="font-bold text-green-400">
                        {formatCurrency(analysis.taxSavings)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className={`p-4 bg-blue-900/20 border ${theme.borderColors.primary} rounded-lg`}>
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>
                      Tax-Loss Harvesting Recommendations
                    </h4>
                    <ul className={`space-y-1 text-sm ${theme.textColors.secondary}`}>
                      {analysis.recommendations.map((recommendation, index) => (
                        <li key={index}>• {recommendation}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Wash Sale Warning */}
              {analysis.washSaleRisk && (
                <div className={`p-4 bg-yellow-900/20 border border-yellow-500/20 rounded-lg`}>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5" />
                    <div>
                      <h4 className={`font-semibold text-yellow-400 mb-2`}>
                        Wash Sale Rule Warning
                      </h4>
                      <p className={`text-sm ${theme.textColors.secondary}`}>
                        The wash sale rule prohibits claiming a loss if you buy the same or substantially identical 
                        security within 30 days before or after the sale. Consider waiting 31 days before repurchasing 
                        or invest in similar but not identical securities.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
