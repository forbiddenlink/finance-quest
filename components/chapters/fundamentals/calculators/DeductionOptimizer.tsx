'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import { LucideIcon } from 'lucide-react';
import {
  DollarSign,
  Home,
  Heart,
  GraduationCap,
  Briefcase,
  Receipt,
  Target,
  TrendingUp,
  Info
} from 'lucide-react';

interface DeductionCategory {
  id: string;
  name: string;
  amount: number;
  icon: LucideIcon;
  description: string;
  limit?: number;
}

interface DeductionAnalysis {
  standardDeduction: number;
  totalItemized: number;
  recommendedMethod: 'standard' | 'itemized';
  potentialSavings: number;
  missingDeductions: string[];
}

export default function DeductionOptimizer() {
  const { recordCalculatorUsage } = useProgressStore();
  
  const [filingStatus, setFilingStatus] = useState<'single' | 'marriedJoint' | 'marriedSeparate' | 'headOfHousehold'>('single');
  const [marginalTaxRate, setMarginalTaxRate] = useState<number>(22);
  
  const [deductions, setDeductions] = useState<DeductionCategory[]>([
    {
      id: 'mortgage',
      name: 'Mortgage Interest',
      amount: 0,
      icon: Home,
      description: 'Interest paid on primary and secondary residence mortgages',
      limit: 750000 // mortgage debt limit for deduction
    },
    {
      id: 'salt',
      name: 'State & Local Taxes (SALT)',
      amount: 0,
      icon: Receipt,
      description: 'State income, local, and property taxes',
      limit: 10000
    },
    {
      id: 'charity',
      name: 'Charitable Contributions',
      amount: 0,
      icon: Heart,
      description: 'Donations to qualified charitable organizations',
      limit: undefined // varies by AGI
    },
    {
      id: 'medical',
      name: 'Medical Expenses',
      amount: 0,
      icon: Heart,
      description: 'Medical expenses exceeding 7.5% of AGI',
      limit: undefined
    },
    {
      id: 'business',
      name: 'Business Expenses',
      amount: 0,
      icon: Briefcase,
      description: 'Unreimbursed business expenses (limited for employees)',
      limit: undefined
    },
    {
      id: 'education',
      name: 'Student Loan Interest',
      amount: 0,
      icon: GraduationCap,
      description: 'Interest paid on qualified student loans',
      limit: 2500
    }
  ]);

  const [analysis, setAnalysis] = useState<DeductionAnalysis | null>(null);

  const standardDeductions = useMemo(() => ({
    single: 13850,
    marriedJoint: 27700,
    marriedSeparate: 13850,
    headOfHousehold: 20800
  }), []);

  useEffect(() => {
    recordCalculatorUsage('deduction-optimizer');
  }, [recordCalculatorUsage]);

  const updateDeduction = (id: string, amount: number) => {
    setDeductions(prev => prev.map(deduction => 
      deduction.id === id ? { ...deduction, amount } : deduction
    ));
  };

  const analyzeDeductions = useCallback(() => {
    const standardDeduction = standardDeductions[filingStatus];
    const totalItemized = deductions.reduce((sum, deduction) => {
      // Apply limits where applicable
      let actualAmount = deduction.amount;
      if (deduction.limit && actualAmount > deduction.limit) {
        actualAmount = deduction.limit;
      }
      return sum + actualAmount;
    }, 0);

    const recommendedMethod = totalItemized > standardDeduction ? 'itemized' : 'standard';
    const potentialSavings = Math.abs(totalItemized - standardDeduction) * (marginalTaxRate / 100);

    // Identify missing deductions that could be valuable
    const missingDeductions: string[] = [];
    deductions.forEach(deduction => {
      if (deduction.amount === 0) {
        missingDeductions.push(deduction.name);
      }
    });

    const analysisResult: DeductionAnalysis = {
      standardDeduction,
      totalItemized,
      recommendedMethod,
      potentialSavings,
      missingDeductions
    };

    setAnalysis(analysisResult);
  }, [deductions, filingStatus, marginalTaxRate, standardDeductions]);

  useEffect(() => {
    analyzeDeductions();
  }, [analyzeDeductions]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getOptimizationTips = (): string[] => {
    const tips: string[] = [];
    
    if (analysis?.recommendedMethod === 'standard') {
      tips.push("Consider bunching deductible expenses into alternating years to exceed the standard deduction");
      tips.push("Pre-pay state and local taxes (up to $10K limit) if beneficial");
      tips.push("Time charitable contributions to maximize tax benefit");
    } else {
      tips.push("Track all deductible expenses throughout the year");
      tips.push("Keep detailed records and receipts for all claimed deductions");
      tips.push("Consider tax-loss harvesting for investment losses");
    }

    if (deductions.find(d => d.id === 'salt')?.amount === 10000) {
      tips.push("You've reached the SALT deduction limit of $10,000");
    }

    if (deductions.find(d => d.id === 'charity')?.amount === 0) {
      tips.push("Charitable contributions can provide significant tax benefits");
    }

    return tips;
  };

  return (
    <div className={`p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
      <div className="flex items-center gap-3 mb-6">
        <Target className="w-6 h-6 text-purple-400" />
        <h2 className={`text-xl font-bold ${theme.textColors.primary}`}>
          Deduction Optimizer
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                Filing Status
              </label>
              <select
                value={filingStatus}
                onChange={(e) => setFilingStatus(e.target.value as 'single' | 'marriedJoint' | 'marriedSeparate' | 'headOfHousehold')}
                className={`w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
              >
                <option value="single">Single</option>
                <option value="marriedJoint">Married Filing Jointly</option>
                <option value="marriedSeparate">Married Filing Separately</option>
                <option value="headOfHousehold">Head of Household</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                Marginal Tax Rate (%)
              </label>
              <input
                type="number"
                value={marginalTaxRate}
                onChange={(e) => setMarginalTaxRate(Number(e.target.value))}
                className={`w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                placeholder="22"
                min="10"
                max="37"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>
              Itemized Deductions
            </h3>

            {deductions.map((deduction) => {
              const Icon = deduction.icon;
              const isAtLimit = deduction.limit && deduction.amount >= deduction.limit;
              
              return (
                <div key={deduction.id} className={`p-4 bg-slate-800/50 border ${theme.borderColors.primary} rounded-lg`}>
                  <div className="flex items-start gap-3 mb-3">
                    <Icon className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`font-medium ${theme.textColors.primary}`}>
                          {deduction.name}
                        </h4>
                        {deduction.limit && (
                          <span className={`text-xs ${theme.textColors.secondary}`}>
                            Limit: {formatCurrency(deduction.limit)}
                          </span>
                        )}
                      </div>
                      <p className={`text-sm ${theme.textColors.secondary} mb-3`}>
                        {deduction.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      value={deduction.amount}
                      onChange={(e) => updateDeduction(deduction.id, Number(e.target.value))}
                      className={`w-full pl-10 pr-4 py-2 bg-slate-800 border ${
                        isAtLimit ? 'border-yellow-500' : 'border-slate-600'
                      } rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                      placeholder="0"
                    />
                  </div>
                  
                  {isAtLimit && (
                    <p className="text-xs text-yellow-400 mt-1">
                      At deduction limit
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {analysis && (
            <>
              {/* Recommendation Card */}
              <div className={`p-6 bg-gradient-to-r ${
                analysis.recommendedMethod === 'itemized' 
                  ? 'from-green-900/20 to-blue-900/20' 
                  : 'from-blue-900/20 to-purple-900/20'
              } border ${theme.borderColors.primary} rounded-lg`}>
                <div className="flex items-center gap-3 mb-4">
                  <TrendingUp className={`w-6 h-6 ${
                    analysis.recommendedMethod === 'itemized' ? 'text-green-400' : 'text-blue-400'
                  }`} />
                  <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>
                    Recommendation
                  </h3>
                </div>
                
                <div className="text-center mb-4">
                  <div className={`text-2xl font-bold ${
                    analysis.recommendedMethod === 'itemized' ? 'text-green-400' : 'text-blue-400'
                  } mb-2`}>
                    {analysis.recommendedMethod === 'itemized' ? 'Itemize Deductions' : 'Take Standard Deduction'}
                  </div>
                  <p className={`text-sm ${theme.textColors.secondary}`}>
                    {analysis.recommendedMethod === 'itemized' 
                      ? `Save ${formatCurrency(analysis.potentialSavings)} by itemizing`
                      : `Standard deduction is ${formatCurrency(analysis.standardDeduction - analysis.totalItemized)} higher`
                    }
                  </p>
                </div>
              </div>

              {/* Comparison Table */}
              <div className={`border ${theme.borderColors.primary} rounded-lg overflow-hidden`}>
                <div className={`bg-slate-800 px-4 py-3 border-b ${theme.borderColors.primary}`}>
                  <h3 className={`font-semibold ${theme.textColors.primary}`}>
                    Deduction Comparison
                  </h3>
                </div>
                
                <div className="p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className={`${theme.textColors.primary}`}>Standard Deduction</span>
                    <span className={`font-semibold ${
                      analysis.recommendedMethod === 'standard' ? 'text-green-400' : theme.textColors.primary
                    }`}>
                      {formatCurrency(analysis.standardDeduction)}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className={`${theme.textColors.primary}`}>Total Itemized Deductions</span>
                    <span className={`font-semibold ${
                      analysis.recommendedMethod === 'itemized' ? 'text-green-400' : theme.textColors.primary
                    }`}>
                      {formatCurrency(analysis.totalItemized)}
                    </span>
                  </div>
                  
                  <div className={`border-t ${theme.borderColors.primary} pt-4`}>
                    <div className="flex justify-between items-center">
                      <span className={`font-semibold ${theme.textColors.primary}`}>
                        Recommended Deduction
                      </span>
                      <span className="font-bold text-green-400">
                        {formatCurrency(Math.max(analysis.standardDeduction, analysis.totalItemized))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Itemized Breakdown */}
              {analysis.totalItemized > 0 && (
                <div className={`border ${theme.borderColors.primary} rounded-lg overflow-hidden`}>
                  <div className={`bg-slate-800 px-4 py-3 border-b ${theme.borderColors.primary}`}>
                    <h3 className={`font-semibold ${theme.textColors.primary}`}>
                      Itemized Deduction Breakdown
                    </h3>
                  </div>
                  
                  <div className="p-4 space-y-3">
                    {deductions.filter(d => d.amount > 0).map(deduction => {
                      const Icon = deduction.icon;
                      const actualAmount = deduction.limit && deduction.amount > deduction.limit 
                        ? deduction.limit 
                        : deduction.amount;
                      const percentage = (actualAmount / analysis.totalItemized) * 100;
                      
                      return (
                        <div key={deduction.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Icon className="w-4 h-4 text-blue-400" />
                            <span className={`${theme.textColors.primary}`}>
                              {deduction.name}
                            </span>
                          </div>
                          <div className="text-right">
                            <div className={`font-semibold ${theme.textColors.primary}`}>
                              {formatCurrency(actualAmount)}
                            </div>
                            <div className={`text-xs ${theme.textColors.secondary}`}>
                              {percentage.toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Optimization Tips */}
              <div className={`p-4 bg-blue-900/20 border ${theme.borderColors.primary} rounded-lg`}>
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>
                      Optimization Tips
                    </h4>
                    <ul className={`space-y-1 text-sm ${theme.textColors.secondary}`}>
                      {getOptimizationTips().map((tip, index) => (
                        <li key={index}>• {tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
