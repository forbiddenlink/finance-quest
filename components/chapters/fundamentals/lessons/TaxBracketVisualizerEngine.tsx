'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import { motion } from 'framer-motion';
import {
  Calculator,
  DollarSign,
  Percent,
  Target,
  BarChart3,
  Info
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell } from 'recharts';

interface TaxBracket {
  rate: number;
  min: number;
  max: number;
  color: string;
}

interface TaxCalculation {
  totalTax: number;
  effectiveRate: number;
  marginalRate: number;
  taxByBracket: Array<{
    bracket: number;
    taxOwed: number;
    income: number;
  }>;
  takeHomeIncome: number;
  socialSecurityTax: number;
  medicareTax: number;
}

interface FilingStatusLimits {
  standardDeduction: number;
  brackets: TaxBracket[];
}

const FILING_STATUS_DATA: Record<string, FilingStatusLimits> = {
  single: {
    standardDeduction: 14600,
    brackets: [
      { rate: 10, min: 0, max: 11000, color: '#10B981' },
      { rate: 12, min: 11000, max: 44725, color: '#3B82F6' },
      { rate: 22, min: 44725, max: 95375, color: '#8B5CF6' },
      { rate: 24, min: 95375, max: 182050, color: '#F59E0B' },
      { rate: 32, min: 182050, max: 231250, color: '#EF4444' },
      { rate: 35, min: 231250, max: 578125, color: '#DC2626' },
      { rate: 37, min: 578125, max: Infinity, color: '#991B1B' }
    ]
  },
  marriedJoint: {
    standardDeduction: 29200,
    brackets: [
      { rate: 10, min: 0, max: 22000, color: '#10B981' },
      { rate: 12, min: 22000, max: 89450, color: '#3B82F6' },
      { rate: 22, min: 89450, max: 190750, color: '#8B5CF6' },
      { rate: 24, min: 190750, max: 364200, color: '#F59E0B' },
      { rate: 32, min: 364200, max: 462500, color: '#EF4444' },
      { rate: 35, min: 462500, max: 693750, color: '#DC2626' },
      { rate: 37, min: 693750, max: Infinity, color: '#991B1B' }
    ]
  },
  marriedSeparate: {
    standardDeduction: 14600,
    brackets: [
      { rate: 10, min: 0, max: 11000, color: '#10B981' },
      { rate: 12, min: 11000, max: 44725, color: '#3B82F6' },
      { rate: 22, min: 44725, max: 95375, color: '#8B5CF6' },
      { rate: 24, min: 95375, max: 182100, color: '#F59E0B' },
      { rate: 32, min: 182100, max: 231250, color: '#EF4444' },
      { rate: 35, min: 231250, max: 346875, color: '#DC2626' },
      { rate: 37, min: 346875, max: Infinity, color: '#991B1B' }
    ]
  },
  headOfHousehold: {
    standardDeduction: 21900,
    brackets: [
      { rate: 10, min: 0, max: 15700, color: '#10B981' },
      { rate: 12, min: 15700, max: 59850, color: '#3B82F6' },
      { rate: 22, min: 59850, max: 95350, color: '#8B5CF6' },
      { rate: 24, min: 95350, max: 182050, color: '#F59E0B' },
      { rate: 32, min: 182050, max: 231250, color: '#EF4444' },
      { rate: 35, min: 231250, max: 578100, color: '#DC2626' },
      { rate: 37, min: 578100, max: Infinity, color: '#991B1B' }
    ]
  }
};

const SCENARIOS = [
  { label: 'Entry Level', income: 35000, description: 'College graduate starting career' },
  { label: 'Mid Career', income: 75000, description: 'Experienced professional' },
  { label: 'Senior Professional', income: 125000, description: 'Management or specialized role' },
  { label: 'High Earner', income: 200000, description: 'Executive or senior specialist' },
  { label: 'Top Bracket', income: 500000, description: 'High-income professional' }
];

export default function TaxBracketVisualizerEngine() {
  const { recordCalculatorUsage } = useProgressStore();
  
  const [grossIncome, setGrossIncome] = useState(75000);
  const [filingStatus, setFilingStatus] = useState<keyof typeof FILING_STATUS_DATA>('single');
  const [stateRate, setStateRate] = useState(5);
  const [retirement401k, setRetirement401k] = useState(0);
  const [retirementIRA, setRetirementIRA] = useState(0);
  const [hsaContribution, setHsaContribution] = useState(0);
  const [selectedScenario, setSelectedScenario] = useState<number | null>(null);

  useEffect(() => {
    recordCalculatorUsage('tax-bracket-visualizer-engine');
  }, [recordCalculatorUsage]);

  const taxCalculation = useMemo((): TaxCalculation => {
    const statusData = FILING_STATUS_DATA[filingStatus];
    const taxableIncome = Math.max(0, grossIncome - statusData.standardDeduction - retirement401k - retirementIRA - hsaContribution);
    
    let totalFederalTax = 0;
    let marginalRate = 0;
    const taxByBracket: Array<{ bracket: number; taxOwed: number; income: number }> = [];

    // Calculate federal tax by bracket
    for (const bracket of statusData.brackets) {
      if (taxableIncome > bracket.min) {
        const incomeInBracket = Math.min(taxableIncome, bracket.max) - bracket.min;
        const taxInBracket = incomeInBracket * (bracket.rate / 100);
        totalFederalTax += taxInBracket;
        marginalRate = bracket.rate;
        
        if (incomeInBracket > 0) {
          taxByBracket.push({
            bracket: bracket.rate,
            taxOwed: taxInBracket,
            income: incomeInBracket
          });
        }
      }
    }

    // Calculate payroll taxes
    const socialSecurityTax = Math.min(grossIncome, 160200) * 0.062; // 2024 SS wage base
    const medicareTax = grossIncome * 0.0145;
    const additionalMedicareTax = Math.max(0, grossIncome - (filingStatus === 'marriedJoint' ? 250000 : 200000)) * 0.009;

    // Calculate state tax
    const stateTax = taxableIncome * (stateRate / 100);

    const totalTax = totalFederalTax + stateTax + socialSecurityTax + medicareTax + additionalMedicareTax;
    const effectiveRate = grossIncome > 0 ? (totalTax / grossIncome) * 100 : 0;
    const takeHomeIncome = grossIncome - totalTax;

    return {
      totalTax,
      effectiveRate,
      marginalRate,
      taxByBracket,
      takeHomeIncome,
      socialSecurityTax: socialSecurityTax + medicareTax + additionalMedicareTax,
      medicareTax: stateTax
    };
  }, [grossIncome, filingStatus, stateRate, retirement401k, retirementIRA, hsaContribution]);

  const bracketChartData = useMemo(() => {
    const statusData = FILING_STATUS_DATA[filingStatus];
    const taxableIncome = Math.max(0, grossIncome - statusData.standardDeduction - retirement401k - retirementIRA - hsaContribution);
    
    return statusData.brackets.map(bracket => {
      const incomeInBracket = Math.max(0, Math.min(taxableIncome, bracket.max) - bracket.min);
      const isActive = taxableIncome > bracket.min;
      
      return {
        bracket: `${bracket.rate}%`,
        rate: bracket.rate,
        income: incomeInBracket,
        range: bracket.max === Infinity ? `$${bracket.min.toLocaleString()}+` : `$${bracket.min.toLocaleString()} - $${bracket.max.toLocaleString()}`,
        color: bracket.color,
        isActive,
        opacity: isActive ? 1 : 0.3
      };
    }).filter(d => d.income > 0 || d.isActive);
  }, [grossIncome, filingStatus, retirement401k, retirementIRA, hsaContribution]);

  const taxBreakdownData = [
    { name: 'Federal Income Tax', value: taxCalculation.taxByBracket.reduce((sum, b) => sum + b.taxOwed, 0), color: '#3B82F6' },
    { name: 'State Income Tax', value: taxCalculation.medicareTax, color: '#8B5CF6' },
    { name: 'Payroll Taxes', value: taxCalculation.socialSecurityTax, color: '#10B981' },
    { name: 'Take Home Pay', value: taxCalculation.takeHomeIncome, color: '#F59E0B' }
  ].filter(item => item.value > 0);

  const handleScenarioSelect = (scenarioIndex: number) => {
    const scenario = SCENARIOS[scenarioIndex];
    setGrossIncome(scenario.income);
    setSelectedScenario(scenarioIndex);
  };

  return (
    <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}>
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <div className={`w-10 h-10 ${theme.status.info.bg} rounded-lg flex items-center justify-center mr-3`}>
            <BarChart3 className={`w-5 h-5 ${theme.status.info.text}`} />
          </div>
          <div>
            <h3 className={`text-xl font-semibold ${theme.textColors.primary}`}>
              Tax Bracket Visualizer Engine
            </h3>
            <p className={`text-sm ${theme.textColors.muted}`}>
              Interactive tax bracket exploration with real-time calculations
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Controls */}
        <div className="space-y-6">
          <div>
            <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
              Quick Scenarios
            </label>
            <div className="grid grid-cols-1 gap-2">
              {SCENARIOS.map((scenario, index) => (
                <button
                  key={index}
                  onClick={() => handleScenarioSelect(index)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    selectedScenario === index
                      ? `${theme.status.info.bg} ${theme.status.info.border} ${theme.status.info.text}`
                      : `${theme.backgrounds.glass} ${theme.borderColors.primary} ${theme.textColors.secondary} hover:${theme.borderColors.accent}`
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-medium">{scenario.label}</div>
                      <div className="text-xs opacity-75">{scenario.description}</div>
                    </div>
                    <div className="text-lg font-bold">${scenario.income.toLocaleString()}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
              Annual Gross Income
            </label>
            <div className="relative">
              <DollarSign className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${theme.textColors.muted}`} />
              <input
                type="number"
                value={grossIncome}
                onChange={(e) => setGrossIncome(Number(e.target.value))}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${theme.borderColors.primary} bg-slate-800/50 ${theme.textColors.primary} focus:border-blue-400 focus:ring-1 focus:ring-blue-400`}
                placeholder="75000"
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
              Filing Status
            </label>
            <select
              value={filingStatus}
              onChange={(e) => setFilingStatus(e.target.value as keyof typeof FILING_STATUS_DATA)}
              className={`w-full p-3 rounded-lg border ${theme.borderColors.primary} bg-slate-800/50 ${theme.textColors.primary}`}
              aria-label="Filing Status"
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
              <Percent className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${theme.textColors.muted}`} />
              <input
                type="number"
                value={stateRate}
                onChange={(e) => setStateRate(Number(e.target.value))}
                step="0.1"
                min="0"
                max="15"
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${theme.borderColors.primary} bg-slate-800/50 ${theme.textColors.primary} focus:border-blue-400 focus:ring-1 focus:ring-blue-400`}
                placeholder="5.0"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className={`text-lg font-semibold ${theme.textColors.primary}`}>
              Tax-Advantaged Contributions
            </h4>
            
            <div>
              <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                401(k) Contribution
              </label>
              <div className="relative">
                <DollarSign className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${theme.textColors.muted}`} />
                <input
                  type="number"
                  value={retirement401k}
                  onChange={(e) => setRetirement401k(Number(e.target.value))}
                  max="23500"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${theme.borderColors.primary} bg-slate-800/50 ${theme.textColors.primary} focus:border-blue-400 focus:ring-1 focus:ring-blue-400`}
                  placeholder="0"
                />
              </div>
              <p className={`text-xs ${theme.textColors.muted} mt-1`}>
                2024 limit: $23,500 (+ $7,500 catch-up if 50+)
              </p>
            </div>

            <div>
              <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                Traditional IRA Contribution
              </label>
              <div className="relative">
                <DollarSign className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${theme.textColors.muted}`} />
                <input
                  type="number"
                  value={retirementIRA}
                  onChange={(e) => setRetirementIRA(Number(e.target.value))}
                  max="7000"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${theme.borderColors.primary} bg-slate-800/50 ${theme.textColors.primary} focus:border-blue-400 focus:ring-1 focus:ring-blue-400`}
                  placeholder="0"
                />
              </div>
              <p className={`text-xs ${theme.textColors.muted} mt-1`}>
                2024 limit: $7,000 (+ $1,000 catch-up if 50+)
              </p>
            </div>

            <div>
              <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                HSA Contribution
              </label>
              <div className="relative">
                <DollarSign className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${theme.textColors.muted}`} />
                <input
                  type="number"
                  value={hsaContribution}
                  onChange={(e) => setHsaContribution(Number(e.target.value))}
                  max="4300"
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${theme.borderColors.primary} bg-slate-800/50 ${theme.textColors.primary} focus:border-blue-400 focus:ring-1 focus:ring-blue-400`}
                  placeholder="0"
                />
              </div>
              <p className={`text-xs ${theme.textColors.muted} mt-1`}>
                2024 limit: $4,300 individual / $8,550 family
              </p>
            </div>
          </div>
        </div>

        {/* Visualizations and Results */}
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div 
              className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-4`}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-2">
                <Target className={`w-5 h-5 ${theme.status.success.text}`} />
                <span className={`text-sm ${theme.textColors.muted}`}>Effective Rate</span>
              </div>
              <div className={`text-2xl font-bold ${theme.textColors.primary}`}>
                {taxCalculation.effectiveRate.toFixed(1)}%
              </div>
            </motion.div>

            <motion.div 
              className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-4`}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-2">
                <Target className={`w-5 h-5 ${theme.status.warning.text}`} />
                <span className={`text-sm ${theme.textColors.muted}`}>Marginal Rate</span>
              </div>
              <div className={`text-2xl font-bold ${theme.textColors.primary}`}>
                {taxCalculation.marginalRate}%
              </div>
            </motion.div>

            <motion.div 
              className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-4`}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-2">
                <DollarSign className={`w-5 h-5 ${theme.status.error.text}`} />
                <span className={`text-sm ${theme.textColors.muted}`}>Total Tax</span>
              </div>
              <div className={`text-2xl font-bold ${theme.textColors.primary}`}>
                ${taxCalculation.totalTax.toLocaleString()}
              </div>
            </motion.div>

            <motion.div 
              className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-4`}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-2">
                <Calculator className={`w-5 h-5 ${theme.status.info.text}`} />
                <span className={`text-sm ${theme.textColors.muted}`}>Take Home</span>
              </div>
              <div className={`text-2xl font-bold ${theme.textColors.primary}`}>
                ${taxCalculation.takeHomeIncome.toLocaleString()}
              </div>
            </motion.div>
          </div>

          {/* Tax Bracket Chart */}
          <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-4`}>
            <h4 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Income by Tax Bracket
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={bracketChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="bracket" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  fontSize={12}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, 'Income in Bracket']}
                  labelFormatter={(label) => `Tax Bracket: ${label}`}
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="income" 
                  fill="#3B82F6"
                />
                {bracketChartData.map((entry, index) => (
                  <Bar key={index} fill={entry.color} fillOpacity={entry.opacity} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Tax Breakdown Pie Chart */}
          <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-4`}>
            <h4 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Tax & Income Breakdown
            </h4>
            <ResponsiveContainer width="100%" height={200}>
              <RechartsPieChart>
                <RechartsPieChart data={taxBreakdownData} cx="50%" cy="50%" outerRadius={80}>
                  {taxBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </RechartsPieChart>
                <Tooltip 
                  formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {taxBreakdownData.map((item, index) => {
                const colorClass = item.color === '#3B82F6' ? 'bg-blue-500' :
                                 item.color === '#8B5CF6' ? 'bg-purple-500' :
                                 item.color === '#10B981' ? 'bg-green-500' :
                                 'bg-amber-500';
                return (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${colorClass}`} />
                      <span className={`text-sm ${theme.textColors.secondary}`}>{item.name}</span>
                    </div>
                    <span className={`text-sm font-medium ${theme.textColors.primary}`}>
                      ${item.value.toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Educational Insights */}
          <div className={`${theme.status.info.bg}/10 border ${theme.status.info.border} rounded-lg p-4`}>
            <div className="flex items-center mb-3">
              <Info className={`w-5 h-5 ${theme.status.info.text} mr-2`} />
              <h4 className={`font-semibold ${theme.textColors.primary}`}>Tax Insights</h4>
            </div>
            <div className="space-y-2">
              <p className={`text-sm ${theme.textColors.secondary}`}>
                • Your effective tax rate ({taxCalculation.effectiveRate.toFixed(1)}%) is your total tax divided by gross income
              </p>
              <p className={`text-sm ${theme.textColors.secondary}`}>
                • Your marginal tax rate ({taxCalculation.marginalRate}%) is the tax on your next dollar of income
              </p>
              <p className={`text-sm ${theme.textColors.secondary}`}>
                • Tax-advantaged contributions reduce your taxable income and current taxes
              </p>
              {taxCalculation.marginalRate >= 22 && (
                <p className={`text-sm ${theme.status.warning.text}`}>
                  • Consider maximizing retirement contributions to reduce your tax burden
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
