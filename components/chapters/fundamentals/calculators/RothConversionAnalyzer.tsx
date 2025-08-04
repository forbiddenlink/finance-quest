'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import {
  RefreshCw,
  DollarSign,
  Calendar,
  Percent,
  TrendingUp,
  AlertCircle,
  Calculator,
  PiggyBank
} from 'lucide-react';

interface ConversionScenario {
  conversionAmount: number;
  taxesPaid: number;
  taxRate: number;
  remainingTraditionalIRA: number;
  totalRothValue: number;
  netBenefit: number;
}

interface ConversionAnalysis {
  scenarios: ConversionScenario[];
  optimalConversion: number;
  breakEvenYears: number;
  totalTaxSavings: number;
  recommendations: string[];
}

const TAX_BRACKETS_2024 = [
  { min: 0, max: 23200, rate: 10 },
  { min: 23200, max: 94300, rate: 12 },
  { min: 94300, max: 201050, rate: 22 },
  { min: 201050, max: 383900, rate: 24 },
  { min: 383900, max: 487450, rate: 32 },
  { min: 487450, max: 731200, rate: 35 },
  { min: 731200, max: Infinity, rate: 37 }
];

export default function RothConversionAnalyzer() {
  const { recordCalculatorUsage } = useProgressStore();
  
  const [traditionalIRABalance, setTraditionalIRABalance] = useState<number>(100000);
  const [currentAge, setCurrentAge] = useState<number>(45);
  const [currentIncome, setCurrentIncome] = useState<number>(80000);
  const [retirementAge, setRetirementAge] = useState<number>(65);
  const [retirementIncome, setRetirementIncome] = useState<number>(50000);
  const [expectedReturn, setExpectedReturn] = useState<number>(7);
  const [conversionAmounts, setConversionAmounts] = useState<number[]>([10000, 25000, 50000, 75000]);
  
  const [analysis, setAnalysis] = useState<ConversionAnalysis | null>(null);

  useEffect(() => {
    recordCalculatorUsage('roth-conversion-analyzer');
  }, [recordCalculatorUsage]);

  const calculateMarginalTaxRate = (income: number): number => {
    for (const bracket of TAX_BRACKETS_2024) {
      if (income >= bracket.min && income < bracket.max) {
        return bracket.rate;
      }
    }
    return 37; // Highest bracket
  };

  const calculateTotalTax = (income: number): number => {
    let totalTax = 0;
    let remainingIncome = income;

    for (const bracket of TAX_BRACKETS_2024) {
      if (remainingIncome <= 0) break;
      
      const taxableAtThisBracket = Math.min(
        remainingIncome,
        Math.max(0, bracket.max - bracket.min)
      );
      
      totalTax += taxableAtThisBracket * (bracket.rate / 100);
      remainingIncome -= taxableAtThisBracket;
    }

    return totalTax;
  };

  const analyzeConversion = useCallback(() => {
    const yearsToRetirement = retirementAge - currentAge;
    const currentMarginalRate = calculateMarginalTaxRate(currentIncome);
    const retirementMarginalRate = calculateMarginalTaxRate(retirementIncome);
    
    const scenarios: ConversionScenario[] = conversionAmounts.map(conversionAmount => {
      // Calculate taxes on conversion
      const taxesOnConversion = calculateTotalTax(currentIncome + conversionAmount) - calculateTotalTax(currentIncome);
      const effectiveTaxRate = (taxesOnConversion / conversionAmount) * 100;
      
      // Calculate future value of converted amount (tax-free growth)
      const futureValueRoth = conversionAmount * Math.pow(1 + expectedReturn / 100, yearsToRetirement);
      
      // Calculate future value if left in traditional IRA
      const futureValueTraditional = conversionAmount * Math.pow(1 + expectedReturn / 100, yearsToRetirement);
      const futureTraditionalTax = futureValueTraditional * (retirementMarginalRate / 100);
      const netFutureTraditional = futureValueTraditional - futureTraditionalTax;
      
      // Calculate net benefit
      const netBenefit = futureValueRoth - netFutureTraditional - taxesOnConversion;
      
      return {
        conversionAmount,
        taxesPaid: taxesOnConversion,
        taxRate: effectiveTaxRate,
        remainingTraditionalIRA: traditionalIRABalance - conversionAmount,
        totalRothValue: futureValueRoth,
        netBenefit
      };
    });

    // Find optimal conversion
    const optimalScenario = scenarios.reduce((best, current) => 
      current.netBenefit > best.netBenefit ? current : best
    );

    // Calculate break-even years (simplified)
    const breakEvenYears = Math.log(2) / Math.log(1 + expectedReturn / 100);

    // Calculate total tax savings
    const totalTaxSavings = optimalScenario.netBenefit;

    // Generate recommendations
    const recommendations: string[] = [];

    if (currentMarginalRate < retirementMarginalRate) {
      recommendations.push("✅ Roth conversion is favorable - you're in a lower tax bracket now");
    } else if (currentMarginalRate > retirementMarginalRate) {
      recommendations.push("⚠️ Consider if conversion makes sense - you may be in a higher bracket now");
    } else {
      recommendations.push("🤔 Tax rates are similar - consider other factors like tax-free growth");
    }

    if (yearsToRetirement > 10) {
      recommendations.push("📈 Long time horizon favors Roth conversion for tax-free growth");
    } else {
      recommendations.push("⏰ Short time horizon - conversion benefits may be limited");
    }

    if (optimalScenario.conversionAmount < traditionalIRABalance * 0.5) {
      recommendations.push("🎯 Consider partial conversions over multiple years to manage tax impact");
    }

    recommendations.push(`💡 Optimal conversion amount: $${optimalScenario.conversionAmount.toLocaleString()}`);
    recommendations.push(`🏆 Estimated net benefit: $${totalTaxSavings.toLocaleString()}`);

    const analysisResult: ConversionAnalysis = {
      scenarios,
      optimalConversion: optimalScenario.conversionAmount,
      breakEvenYears,
      totalTaxSavings,
      recommendations
    };

    setAnalysis(analysisResult);
  }, [
    traditionalIRABalance,
    currentAge,
    currentIncome,
    retirementAge,
    retirementIncome,
    expectedReturn,
    conversionAmounts
  ]);

  useEffect(() => {
    analyzeConversion();
  }, [analyzeConversion]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const addConversionAmount = () => {
    setConversionAmounts([...conversionAmounts, 20000]);
  };

  const updateConversionAmount = (index: number, value: number) => {
    const newAmounts = [...conversionAmounts];
    newAmounts[index] = value;
    setConversionAmounts(newAmounts);
  };

  const removeConversionAmount = (index: number) => {
    if (conversionAmounts.length > 1) {
      setConversionAmounts(conversionAmounts.filter((_, i) => i !== index));
    }
  };

  return (
    <div className={`p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
      <div className="flex items-center gap-3 mb-6">
        <RefreshCw className="w-6 h-6 text-blue-400" />
        <h2 className={`text-xl font-bold ${theme.textColors.primary}`}>
          Roth Conversion Analyzer
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Current Situation
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Traditional IRA Balance
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    value={traditionalIRABalance}
                    onChange={(e) => setTraditionalIRABalance(Number(e.target.value))}
                    className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    placeholder="100000"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Current Age
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(Number(e.target.value))}
                    className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    placeholder="45"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Current Annual Income
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    value={currentIncome}
                    onChange={(e) => setCurrentIncome(Number(e.target.value))}
                    className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    placeholder="80000"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Retirement Projections
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Retirement Age
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(Number(e.target.value))}
                    className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    placeholder="65"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Expected Retirement Income
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    value={retirementIncome}
                    onChange={(e) => setRetirementIncome(Number(e.target.value))}
                    className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    placeholder="50000"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Expected Annual Return (%)
                </label>
                <div className="relative">
                  <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(Number(e.target.value))}
                    className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    placeholder="7"
                    step="0.1"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>
                Conversion Scenarios
              </h3>
              <button
                onClick={addConversionAmount}
                className={`px-3 py-1 text-sm ${theme.buttons.secondary} rounded`}
              >
                Add Scenario
              </button>
            </div>

            <div className="space-y-2">
              {conversionAmounts.map((amount, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => updateConversionAmount(index, Number(e.target.value))}
                      className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    />
                  </div>
                  {conversionAmounts.length > 1 && (
                    <button
                      onClick={() => removeConversionAmount(index)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2 space-y-6">
          {analysis && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 bg-blue-900/20 border ${theme.borderColors.primary} rounded-lg`}>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    <h4 className={`font-semibold ${theme.textColors.primary}`}>Optimal Conversion</h4>
                  </div>
                  <div className="text-xl font-bold text-blue-400">
                    {formatCurrency(analysis.optimalConversion)}
                  </div>
                </div>

                <div className={`p-4 bg-green-900/20 border ${theme.borderColors.primary} rounded-lg`}>
                  <div className="flex items-center gap-2 mb-2">
                    <PiggyBank className="w-5 h-5 text-green-400" />
                    <h4 className={`font-semibold ${theme.textColors.primary}`}>Tax Savings</h4>
                  </div>
                  <div className="text-xl font-bold text-green-400">
                    {formatCurrency(analysis.totalTaxSavings)}
                  </div>
                </div>

                <div className={`p-4 bg-purple-900/20 border ${theme.borderColors.primary} rounded-lg`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Calculator className="w-5 h-5 text-purple-400" />
                    <h4 className={`font-semibold ${theme.textColors.primary}`}>Break-even</h4>
                  </div>
                  <div className="text-xl font-bold text-purple-400">
                    {analysis.breakEvenYears.toFixed(1)} years
                  </div>
                </div>
              </div>

              {/* Scenario Comparison */}
              <div className={`border ${theme.borderColors.primary} rounded-lg overflow-hidden`}>
                <div className={`bg-slate-800 px-4 py-3 border-b ${theme.borderColors.primary}`}>
                  <h3 className={`font-semibold ${theme.textColors.primary}`}>
                    Conversion Scenario Analysis
                  </h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className={`bg-slate-700/50 ${theme.textColors.secondary}`}>
                      <tr>
                        <th className="px-4 py-3 text-left">Conversion Amount</th>
                        <th className="px-4 py-3 text-left">Taxes Paid</th>
                        <th className="px-4 py-3 text-left">Tax Rate</th>
                        <th className="px-4 py-3 text-left">Future Roth Value</th>
                        <th className="px-4 py-3 text-left">Net Benefit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysis.scenarios.map((scenario, index) => (
                        <tr 
                          key={index} 
                          className={`border-t ${theme.borderColors.primary} ${
                            scenario.conversionAmount === analysis.optimalConversion 
                              ? 'bg-blue-900/20' 
                              : ''
                          }`}
                        >
                          <td className={`px-4 py-3 ${theme.textColors.primary} font-medium`}>
                            {formatCurrency(scenario.conversionAmount)}
                            {scenario.conversionAmount === analysis.optimalConversion && (
                              <span className="ml-2 text-blue-400 text-xs">✓ Optimal</span>
                            )}
                          </td>
                          <td className={`px-4 py-3 ${theme.textColors.primary}`}>
                            {formatCurrency(scenario.taxesPaid)}
                          </td>
                          <td className={`px-4 py-3 ${theme.textColors.primary}`}>
                            {scenario.taxRate.toFixed(1)}%
                          </td>
                          <td className={`px-4 py-3 ${theme.textColors.primary}`}>
                            {formatCurrency(scenario.totalRothValue)}
                          </td>
                          <td className={`px-4 py-3 font-medium ${
                            scenario.netBenefit >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {scenario.netBenefit >= 0 ? '+' : ''}{formatCurrency(scenario.netBenefit)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Current Tax Rates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 bg-slate-800/50 border ${theme.borderColors.primary} rounded-lg`}>
                  <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>
                    Current Tax Situation
                  </h4>
                  <div className={`text-sm ${theme.textColors.secondary} space-y-1`}>
                    <div>Marginal Rate: {calculateMarginalTaxRate(currentIncome)}%</div>
                    <div>Years to Retirement: {retirementAge - currentAge}</div>
                  </div>
                </div>

                <div className={`p-4 bg-slate-800/50 border ${theme.borderColors.primary} rounded-lg`}>
                  <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>
                    Retirement Tax Situation
                  </h4>
                  <div className={`text-sm ${theme.textColors.secondary} space-y-1`}>
                    <div>Expected Marginal Rate: {calculateMarginalTaxRate(retirementIncome)}%</div>
                    <div>Tax Rate Difference: {calculateMarginalTaxRate(retirementIncome) - calculateMarginalTaxRate(currentIncome)}%</div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className={`p-4 bg-blue-900/20 border ${theme.borderColors.primary} rounded-lg`}>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>
                      Roth Conversion Recommendations
                    </h4>
                    <ul className={`space-y-1 text-sm ${theme.textColors.secondary}`}>
                      {analysis.recommendations.map((recommendation, index) => (
                        <li key={index}>{recommendation}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Important Considerations */}
              <div className={`p-4 bg-yellow-900/20 border border-yellow-500/20 rounded-lg`}>
                <h4 className={`font-semibold text-yellow-400 mb-2`}>
                  Important Considerations
                </h4>
                <ul className={`space-y-1 text-sm ${theme.textColors.secondary}`}>
                  <li>• Roth conversions are irreversible after the tax year</li>
                  <li>• Consider spreading conversions over multiple years to manage tax brackets</li>
                  <li>• Ensure you can pay conversion taxes from non-retirement accounts</li>
                  <li>• State taxes may also apply to conversions</li>
                  <li>• Future tax law changes could affect the analysis</li>
                  <li>• Consult a tax professional before making large conversions</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
