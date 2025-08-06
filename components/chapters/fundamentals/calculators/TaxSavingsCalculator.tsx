'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import {
  Calculator,
  DollarSign,
  Percent,
  TrendingDown,
  Info
} from 'lucide-react';

interface TaxBracket {
  rate: number;
  min: number;
  max: number;
}

interface TaxCalculation {
  grossIncome: number;
  taxableIncome: number;
  federalTax: number;
  stateTax: number;
  totalTax: number;
  effectiveRate: number;
  marginalRate: number;
  savings: number;
}

export default function TaxSavingsCalculator() {
  const { recordCalculatorUsage } = useProgressStore();
  
  const [grossIncome, setGrossIncome] = useState<number>(75000);
  const [filingStatus, setFilingStatus] = useState<'single' | 'marriedJoint' | 'marriedSeparate' | 'headOfHousehold'>('single');
  const [stateRate, setStateRate] = useState<number>(5);
  const [retirement401k, setRetirement401k] = useState<number>(0);
  const [retirementIRA, setRetirementIRA] = useState<number>(0);
  const [hsaContribution, setHsaContribution] = useState<number>(0);
  const [standardDeduction, setStandardDeduction] = useState<number>(13850);
  const [itemizedDeductions, setItemizedDeductions] = useState<number>(0);
  
  const [currentTax, setCurrentTax] = useState<TaxCalculation | null>(null);
  const [optimizedTax, setOptimizedTax] = useState<TaxCalculation | null>(null);

  // 2024 Federal Tax Brackets
  const federalBrackets = useMemo((): Record<string, TaxBracket[]> => ({
    single: [
      { rate: 10, min: 0, max: 11000 },
      { rate: 12, min: 11000, max: 44725 },
      { rate: 22, min: 44725, max: 95375 },
      { rate: 24, min: 95375, max: 182050 },
      { rate: 32, min: 182050, max: 231250 },
      { rate: 35, min: 231250, max: 578125 },
      { rate: 37, min: 578125, max: Infinity }
    ],
    marriedJoint: [
      { rate: 10, min: 0, max: 22000 },
      { rate: 12, min: 22000, max: 89450 },
      { rate: 22, min: 89450, max: 190750 },
      { rate: 24, min: 190750, max: 364200 },
      { rate: 32, min: 364200, max: 462500 },
      { rate: 35, min: 462500, max: 693750 },
      { rate: 37, min: 693750, max: Infinity }
    ],
    marriedSeparate: [
      { rate: 10, min: 0, max: 11000 },
      { rate: 12, min: 11000, max: 44725 },
      { rate: 22, min: 44725, max: 95375 },
      { rate: 24, min: 95375, max: 182100 },
      { rate: 32, min: 182100, max: 231250 },
      { rate: 35, min: 231250, max: 346875 },
      { rate: 37, min: 346875, max: Infinity }
    ],
    headOfHousehold: [
      { rate: 10, min: 0, max: 15700 },
      { rate: 12, min: 15700, max: 59850 },
      { rate: 22, min: 59850, max: 95350 },
      { rate: 24, min: 95350, max: 182050 },
      { rate: 32, min: 182050, max: 231250 },
      { rate: 35, min: 231250, max: 578100 },
      { rate: 37, min: 578100, max: Infinity }
    ]
  }), []);

  const standardDeductions = useMemo(() => ({
    single: 13850,
    marriedJoint: 27700,
    marriedSeparate: 13850,
    headOfHousehold: 20800
  }), []);

  useEffect(() => {
    recordCalculatorUsage('tax-savings-calculator');
  }, [recordCalculatorUsage]);

  useEffect(() => {
    setStandardDeduction(standardDeductions[filingStatus]);
  }, [filingStatus, standardDeductions]);

  const calculateFederalTax = useCallback((taxableIncome: number): { tax: number; marginalRate: number } => {
    const brackets = federalBrackets[filingStatus];
    let tax = 0;
    let marginalRate = 0;

    for (const bracket of brackets) {
      if (taxableIncome > bracket.min) {
        const taxableAtBracket = Math.min(taxableIncome - bracket.min, bracket.max - bracket.min);
        tax += taxableAtBracket * (bracket.rate / 100);
        marginalRate = bracket.rate;
      }
    }

    return { tax, marginalRate };
  }, [filingStatus, federalBrackets]);

  const calculateTax = useCallback((
    income: number, 
    preeTaxContributions: number, 
    deductions: number
  ): TaxCalculation => {
    const adjustedGrossIncome = income - preeTaxContributions;
    const taxableIncome = Math.max(0, adjustedGrossIncome - deductions);
    
    const { tax: federalTax, marginalRate } = calculateFederalTax(taxableIncome);
    const stateTax = taxableIncome * (stateRate / 100);
    const totalTax = federalTax + stateTax;
    const effectiveRate = adjustedGrossIncome > 0 ? (totalTax / adjustedGrossIncome) * 100 : 0;

    return {
      grossIncome: income,
      taxableIncome,
      federalTax,
      stateTax,
      totalTax,
      effectiveRate,
      marginalRate,
      savings: 0
    };
  }, [calculateFederalTax, stateRate]);

  useEffect(() => {
    // Current situation (no optimization)
    const currentDeduction = Math.max(standardDeduction, itemizedDeductions);
    const current = calculateTax(grossIncome, 0, currentDeduction);
    setCurrentTax(current);

    // Optimized situation (with tax-advantaged contributions)
    const totalPreTaxContributions = retirement401k + retirementIRA + hsaContribution;
    const optimizedDeduction = Math.max(standardDeduction, itemizedDeductions);
    const optimized = calculateTax(grossIncome, totalPreTaxContributions, optimizedDeduction);
    optimized.savings = current.totalTax - optimized.totalTax;
    setOptimizedTax(optimized);
  }, [grossIncome, retirement401k, retirementIRA, hsaContribution, standardDeduction, itemizedDeductions, calculateTax]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const maxContributions = {
    '401k': filingStatus === 'marriedJoint' ? 46000 : 23000,
    'ira': 7000,
    'hsa': filingStatus === 'marriedJoint' ? 8300 : 4150
  };

  return (
    <div className={`p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="w-6 h-6 text-blue-400" />
        <h2 className={`text-xl font-bold ${theme.textColors.primary}`}>
          Tax Savings Calculator
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div>
            <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
              Annual Gross Income
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="number"
                value={grossIncome}
                onChange={(e) => setGrossIncome(Number(e.target.value))}
                className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                placeholder="75000"
              />
            </div>
          </div>

          <div>
            <label htmlFor="filing-status" className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
              Filing Status
            </label>
            <select
              id="filing-status"
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
              State Tax Rate (%)
            </label>
            <div className="relative">
              <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="number"
                value={stateRate}
                onChange={(e) => setStateRate(Number(e.target.value))}
                className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                placeholder="5"
                step="0.1"
              />
            </div>
          </div>

          <div className="border-t border-slate-600 pt-6">
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Tax-Advantaged Contributions
            </h3>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  401(k) Contribution (Max: {formatCurrency(maxContributions['401k'])})
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    value={retirement401k}
                    onChange={(e) => setRetirement401k(Math.min(Number(e.target.value), maxContributions['401k']))}
                    className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Traditional IRA Contribution (Max: {formatCurrency(maxContributions.ira)})
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    value={retirementIRA}
                    onChange={(e) => setRetirementIRA(Math.min(Number(e.target.value), maxContributions.ira))}
                    className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  HSA Contribution (Max: {formatCurrency(maxContributions.hsa)})
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    value={hsaContribution}
                    onChange={(e) => setHsaContribution(Math.min(Number(e.target.value), maxContributions.hsa))}
                    className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-600 pt-6">
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Deductions
            </h3>

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Standard Deduction: {formatCurrency(standardDeduction)}
                </label>
                <p className={`text-xs ${theme.textColors.secondary}`}>
                  Automatically applied based on filing status
                </p>
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Itemized Deductions (Optional)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    value={itemizedDeductions}
                    onChange={(e) => setItemizedDeductions(Number(e.target.value))}
                    className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    placeholder="0"
                  />
                </div>
                <p className={`text-xs ${theme.textColors.secondary} mt-1`}>
                  Only used if higher than standard deduction
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {currentTax && optimizedTax && (
            <>
              {/* Tax Savings Summary */}
              <div className={`p-6 bg-gradient-to-r from-green-900/20 to-blue-900/20 border ${theme.borderColors.primary} rounded-lg`}>
                <div className="flex items-center gap-3 mb-4">
                  <TrendingDown className="w-6 h-6 text-green-400" />
                  <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>
                    Annual Tax Savings
                  </h3>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {formatCurrency(optimizedTax.savings)}
                  </div>
                  <p className={`text-sm ${theme.textColors.secondary}`}>
                    by maximizing tax-advantaged contributions
                  </p>
                </div>
              </div>

              {/* Comparison Table */}
              <div className={`border ${theme.borderColors.primary} rounded-lg overflow-hidden`}>
                <div className={`bg-slate-800 px-4 py-3 border-b ${theme.borderColors.primary}`}>
                  <h3 className={`font-semibold ${theme.textColors.primary}`}>
                    Tax Comparison
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className={`bg-slate-800/50 border-b ${theme.borderColors.primary}`}>
                        <th className={`px-4 py-3 text-left ${theme.textColors.secondary} font-medium`}>
                          Scenario
                        </th>
                        <th className={`px-4 py-3 text-right ${theme.textColors.secondary} font-medium`}>
                          Current
                        </th>
                        <th className={`px-4 py-3 text-right ${theme.textColors.secondary} font-medium`}>
                          Optimized
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className={`border-b ${theme.borderColors.primary}`}>
                        <td className={`px-4 py-3 ${theme.textColors.primary}`}>Gross Income</td>
                        <td className={`px-4 py-3 text-right ${theme.textColors.primary}`}>
                          {formatCurrency(currentTax.grossIncome)}
                        </td>
                        <td className={`px-4 py-3 text-right ${theme.textColors.primary}`}>
                          {formatCurrency(optimizedTax.grossIncome)}
                        </td>
                      </tr>
                      <tr className={`border-b ${theme.borderColors.primary}`}>
                        <td className={`px-4 py-3 ${theme.textColors.primary}`}>Taxable Income</td>
                        <td className={`px-4 py-3 text-right ${theme.textColors.primary}`}>
                          {formatCurrency(currentTax.taxableIncome)}
                        </td>
                        <td className={`px-4 py-3 text-right ${theme.textColors.primary}`}>
                          {formatCurrency(optimizedTax.taxableIncome)}
                        </td>
                      </tr>
                      <tr className={`border-b ${theme.borderColors.primary}`}>
                        <td className={`px-4 py-3 ${theme.textColors.primary}`}>Federal Tax</td>
                        <td className={`px-4 py-3 text-right ${theme.textColors.primary}`}>
                          {formatCurrency(currentTax.federalTax)}
                        </td>
                        <td className={`px-4 py-3 text-right ${theme.textColors.primary}`}>
                          {formatCurrency(optimizedTax.federalTax)}
                        </td>
                      </tr>
                      <tr className={`border-b ${theme.borderColors.primary}`}>
                        <td className={`px-4 py-3 ${theme.textColors.primary}`}>State Tax</td>
                        <td className={`px-4 py-3 text-right ${theme.textColors.primary}`}>
                          {formatCurrency(currentTax.stateTax)}
                        </td>
                        <td className={`px-4 py-3 text-right ${theme.textColors.primary}`}>
                          {formatCurrency(optimizedTax.stateTax)}
                        </td>
                      </tr>
                      <tr className={`border-b ${theme.borderColors.primary}`}>
                        <td className={`px-4 py-3 font-semibold ${theme.textColors.primary}`}>Total Tax</td>
                        <td className={`px-4 py-3 text-right font-semibold ${theme.textColors.primary}`}>
                          {formatCurrency(currentTax.totalTax)}
                        </td>
                        <td className={`px-4 py-3 text-right font-semibold text-green-400`}>
                          {formatCurrency(optimizedTax.totalTax)}
                        </td>
                      </tr>
                      <tr>
                        <td className={`px-4 py-3 ${theme.textColors.primary}`}>Effective Rate</td>
                        <td className={`px-4 py-3 text-right ${theme.textColors.primary}`}>
                          {currentTax.effectiveRate.toFixed(1)}%
                        </td>
                        <td className={`px-4 py-3 text-right ${theme.textColors.primary}`}>
                          {optimizedTax.effectiveRate.toFixed(1)}%
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Educational Insights */}
              <div className={`p-4 bg-blue-900/20 border ${theme.borderColors.primary} rounded-lg`}>
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>
                      Tax Optimization Insights
                    </h4>
                    <ul className={`space-y-1 text-sm ${theme.textColors.secondary}`}>
                      <li>• Your current marginal tax rate is {currentTax.marginalRate}%</li>
                      <li>• Contributing to tax-advantaged accounts reduces taxable income</li>
                      <li>• HSA contributions offer triple tax advantage (deductible, growth, withdrawals)</li>
                      <li>• Traditional 401(k) and IRA contributions reduce current year taxes</li>
                      {itemizedDeductions > standardDeduction && (
                        <li>• Itemizing deductions saves more than standard deduction</li>
                      )}
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
