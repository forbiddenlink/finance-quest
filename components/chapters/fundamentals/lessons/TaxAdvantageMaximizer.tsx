'use client';

import { useState, useEffect } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import { motion } from 'framer-motion';
import {
  Shield,
  TrendingDown,
  Calculator,
  Percent,
  Target,
  Award,
  AlertCircle,
  CheckCircle,
  BarChart3
} from 'lucide-react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface TaxAccountProfile {
  income: number;
  age: number;
  filingStatus: 'single' | 'married_filing_jointly' | 'married_filing_separately' | 'head_of_household';
  currentTax401k: number;
  currentRothIRA: number;
  currentTraditionalIRA: number;
  employerMatch: number;
  maxEmployerMatch: number;
  state: 'low_tax' | 'medium_tax' | 'high_tax' | 'no_tax';
  expectedRetirementTaxRate: number;
  retirementAge: number;
}

interface TaxOptimizationResult {
  strategy: string;
  allocation: {
    traditional401k: number;
    roth401k: number;
    traditionalIRA: number;
    rothIRA: number;
    employerMatch: number;
  };
  annualTaxSavings: number;
  retirementValue: number;
  netAfterTaxValue: number;
  effectiveTaxRate: number;
  description: string;
  advantages: string[];
  considerations: string[];
}

const defaultProfile: TaxAccountProfile = {
  income: 80000,
  age: 30,
  filingStatus: 'single',
  currentTax401k: 8000,
  currentRothIRA: 3000,
  currentTraditionalIRA: 2000,
  employerMatch: 4000,
  maxEmployerMatch: 4000,
  state: 'medium_tax',
  expectedRetirementTaxRate: 22,
  retirementAge: 65
};

const contributionLimits2024 = {
  '401k': { under50: 23000, over50: 30500 },
  'ira': { under50: 7000, over50: 8000 }
};

const taxBrackets2024 = {
  single: [
    { min: 0, max: 11000, rate: 10 },
    { min: 11000, max: 44725, rate: 12 },
    { min: 44725, max: 95375, rate: 22 },
    { min: 95375, max: 182050, rate: 24 },
    { min: 182050, max: 231250, rate: 32 },
    { min: 231250, max: 578125, rate: 35 },
    { min: 578125, max: Infinity, rate: 37 }
  ],
  married_filing_jointly: [
    { min: 0, max: 22000, rate: 10 },
    { min: 22000, max: 89450, rate: 12 },
    { min: 89450, max: 190750, rate: 22 },
    { min: 190750, max: 364200, rate: 24 },
    { min: 364200, max: 462500, rate: 32 },
    { min: 462500, max: 693750, rate: 35 },
    { min: 693750, max: Infinity, rate: 37 }
  ]
};

const stateTaxRates = {
  no_tax: 0,
  low_tax: 3,
  medium_tax: 6,
  high_tax: 10
};

export default function TaxAdvantageMaximizer() {
  const { recordCalculatorUsage } = useProgressStore();
  const [profile, setProfile] = useState<TaxAccountProfile>(defaultProfile);
  const [analysisView, setAnalysisView] = useState<'optimization' | 'comparison' | 'timeline'>('optimization');
  const [selectedStrategy, setSelectedStrategy] = useState<string>('balanced');

  useEffect(() => {
    recordCalculatorUsage('tax-advantage-maximizer');
  }, [recordCalculatorUsage]);

  // Calculate marginal tax rate
  const calculateMarginalTaxRate = (income: number, filingStatus: string): number => {
    const brackets = taxBrackets2024[filingStatus as keyof typeof taxBrackets2024] || taxBrackets2024.single;
    
    for (const bracket of brackets) {
      if (income <= bracket.max) {
        return bracket.rate;
      }
    }
    return 37; // Highest bracket
  };

  // Calculate effective tax rate
  const calculateEffectiveTaxRate = (income: number, filingStatus: string): number => {
    const brackets = taxBrackets2024[filingStatus as keyof typeof taxBrackets2024] || taxBrackets2024.single;
    let totalTax = 0;
    let remainingIncome = income;

    for (const bracket of brackets) {
      if (remainingIncome <= 0) break;
      
      const taxableAtThisBracket = Math.min(remainingIncome, bracket.max - bracket.min);
      totalTax += taxableAtThisBracket * (bracket.rate / 100);
      remainingIncome -= taxableAtThisBracket;
    }

    return (totalTax / income) * 100;
  };

  // Calculate tax optimization strategies
  const calculateOptimizationStrategies = (): TaxOptimizationResult[] => {
    const marginalRate = calculateMarginalTaxRate(profile.income, profile.filingStatus);
    const stateTaxRate = stateTaxRates[profile.state];
    const totalMarginalRate = marginalRate + stateTaxRate;
    
    const max401k = profile.age >= 50 ? contributionLimits2024['401k'].over50 : contributionLimits2024['401k'].under50;
    const maxIRA = profile.age >= 50 ? contributionLimits2024.ira.over50 : contributionLimits2024.ira.under50;
    
    const yearsToRetirement = profile.retirementAge - profile.age;
    const growthRate = 0.07; // 7% annual growth assumption

    const strategies: TaxOptimizationResult[] = [
      // Traditional Heavy Strategy
      {
        strategy: 'Traditional Heavy',
        allocation: {
          traditional401k: Math.min(max401k, profile.income * 0.2),
          roth401k: 0,
          traditionalIRA: maxIRA,
          rothIRA: 0,
          employerMatch: profile.maxEmployerMatch
        },
        annualTaxSavings: 0,
        retirementValue: 0,
        netAfterTaxValue: 0,
        effectiveTaxRate: 0,
        description: 'Maximize current tax deductions with traditional accounts',
        advantages: [
          'Maximum current tax savings',
          'Lower current taxable income',
          'Ideal if expecting lower retirement tax rate'
        ],
        considerations: [
          'All withdrawals taxed in retirement',
          'Required minimum distributions at 73',
          'Risk of higher future tax rates'
        ]
      },
      
      // Roth Heavy Strategy
      {
        strategy: 'Roth Heavy',
        allocation: {
          traditional401k: Math.max(0, profile.maxEmployerMatch), // Just enough for match
          roth401k: Math.min(max401k - profile.maxEmployerMatch, profile.income * 0.15),
          traditionalIRA: 0,
          rothIRA: maxIRA,
          employerMatch: profile.maxEmployerMatch
        },
        annualTaxSavings: 0,
        retirementValue: 0,
        netAfterTaxValue: 0,
        effectiveTaxRate: 0,
        description: 'Focus on tax-free growth with Roth accounts',
        advantages: [
          'Tax-free retirement withdrawals',
          'No required minimum distributions',
          'Tax diversification benefits'
        ],
        considerations: [
          'No current tax deduction',
          'Higher current tax bill',
          'Income limits may apply'
        ]
      },
      
      // Balanced Strategy
      {
        strategy: 'Balanced',
        allocation: {
          traditional401k: Math.min(max401k * 0.6, profile.income * 0.12),
          roth401k: Math.min(max401k * 0.4, profile.income * 0.08),
          traditionalIRA: maxIRA * 0.5,
          rothIRA: maxIRA * 0.5,
          employerMatch: profile.maxEmployerMatch
        },
        annualTaxSavings: 0,
        retirementValue: 0,
        netAfterTaxValue: 0,
        effectiveTaxRate: 0,
        description: 'Mix of traditional and Roth for tax diversification',
        advantages: [
          'Tax diversification',
          'Moderate current tax savings',
          'Flexibility in retirement'
        ],
        considerations: [
          'More complex to manage',
          'May not optimize for specific tax situations',
          'Requires regular rebalancing'
        ]
      },
      
      // Tax Bracket Management
      {
        strategy: 'Tax Bracket Management',
        allocation: {
          traditional401k: Math.max(0, Math.min(max401k, profile.income - 89450)), // Keep in 12% bracket
          roth401k: Math.min(3000, max401k),
          traditionalIRA: maxIRA * 0.3,
          rothIRA: maxIRA * 0.7,
          employerMatch: profile.maxEmployerMatch
        },
        annualTaxSavings: 0,
        retirementValue: 0,
        netAfterTaxValue: 0,
        effectiveTaxRate: 0,
        description: 'Optimize contributions to stay in favorable tax brackets',
        advantages: [
          'Minimizes marginal tax rate',
          'Strategic tax positioning',
          'Maximizes after-tax income'
        ],
        considerations: [
          'Complex to calculate annually',
          'May limit retirement savings',
          'Requires tax law knowledge'
        ]
      }
    ];

    // Calculate detailed metrics for each strategy
    return strategies.map(strategy => {
      const totalTraditional = strategy.allocation.traditional401k + strategy.allocation.traditionalIRA;
      const totalRoth = strategy.allocation.roth401k + strategy.allocation.rothIRA;
      const totalContributions = totalTraditional + totalRoth + strategy.allocation.employerMatch;
      
      const annualTaxSavings = totalTraditional * (totalMarginalRate / 100);
      const futureValue = totalContributions * Math.pow(1 + growthRate, yearsToRetirement);
      
      // Calculate net after-tax value considering future taxes
      const traditionalFutureValue = (totalTraditional + strategy.allocation.employerMatch) * Math.pow(1 + growthRate, yearsToRetirement);
      const rothFutureValue = totalRoth * Math.pow(1 + growthRate, yearsToRetirement);
      const traditionalAfterTax = traditionalFutureValue * (1 - profile.expectedRetirementTaxRate / 100);
      const netAfterTaxValue = traditionalAfterTax + rothFutureValue;

      return {
        ...strategy,
        annualTaxSavings,
        retirementValue: futureValue,
        netAfterTaxValue,
        effectiveTaxRate: calculateEffectiveTaxRate(profile.income - totalTraditional, profile.filingStatus)
      };
    });
  };

  const optimizationResults = calculateOptimizationStrategies();
  const bestStrategy = optimizationResults.reduce((best, current) => 
    current.netAfterTaxValue > best.netAfterTaxValue ? current : best
  );

  // Prepare data for visualizations
  const allocationData = optimizationResults.map(result => ({
    name: result.strategy,
    traditional: result.allocation.traditional401k + result.allocation.traditionalIRA,
    roth: result.allocation.roth401k + result.allocation.rothIRA,
    employerMatch: result.allocation.employerMatch,
    taxSavings: result.annualTaxSavings,
    netValue: result.netAfterTaxValue
  }));

  const pieData = optimizationResults.find(r => r.strategy === selectedStrategy)?.allocation || optimizationResults[0].allocation;
  const pieChartData = [
    { name: 'Traditional 401(k)', value: pieData.traditional401k, color: '#3B82F6' },
    { name: 'Roth 401(k)', value: pieData.roth401k, color: '#10B981' },
    { name: 'Traditional IRA', value: pieData.traditionalIRA, color: '#F59E0B' },
    { name: 'Roth IRA', value: pieData.rothIRA, color: '#EF4444' },
    { name: 'Employer Match', value: pieData.employerMatch, color: '#8B5CF6' }
  ].filter(item => item.value > 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (value: number) => `${value.toFixed(1)}%`;

  const updateProfile = (field: keyof TaxAccountProfile, value: string | number) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const marginalTaxRate = calculateMarginalTaxRate(profile.income, profile.filingStatus);
  const stateTaxRate = stateTaxRates[profile.state];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`${theme.status.success.bg} p-3 rounded-lg`}>
              <Shield className={`w-6 h-6 ${theme.status.success.text}`} />
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${theme.textColors.primary}`}>
                Tax Advantage Maximizer
              </h2>
              <p className={`${theme.textColors.secondary}`}>
                Optimize your tax-advantaged retirement account strategy for maximum benefit
              </p>
            </div>
          </div>
          
          <div className={`text-right`}>
            <div className={`text-sm ${theme.textColors.secondary}`}>Current Tax Rate</div>
            <div className={`text-2xl font-bold ${theme.status.warning.text}`}>
              {formatPercent(marginalTaxRate + stateTaxRate)}
            </div>
          </div>
        </div>

        {/* Tax Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`p-4 ${theme.status.info.bg} rounded-lg text-center`}>
            <Percent className={`w-6 h-6 ${theme.status.info.text} mx-auto mb-2`} />
            <div className={`text-xl font-bold ${theme.status.info.text}`}>
              {formatPercent(marginalTaxRate)}
            </div>
            <div className={`text-sm ${theme.textColors.secondary}`}>Federal Marginal</div>
          </div>
          
          <div className={`p-4 ${theme.status.warning.bg} rounded-lg text-center`}>
            <TrendingDown className={`w-6 h-6 ${theme.status.warning.text} mx-auto mb-2`} />
            <div className={`text-xl font-bold ${theme.status.warning.text}`}>
              {formatPercent(stateTaxRate)}
            </div>
            <div className={`text-sm ${theme.textColors.secondary}`}>State Tax</div>
          </div>
          
          <div className={`p-4 ${theme.status.success.bg} rounded-lg text-center`}>
            <Target className={`w-6 h-6 ${theme.status.success.text} mx-auto mb-2`} />
            <div className={`text-xl font-bold ${theme.status.success.text}`}>
              {formatCurrency(bestStrategy.annualTaxSavings)}
            </div>
            <div className={`text-sm ${theme.textColors.secondary}`}>Max Tax Savings</div>
          </div>
          
          <div className={`p-4 ${theme.status.error.bg} rounded-lg text-center`}>
            <Award className={`w-6 h-6 ${theme.status.error.text} mx-auto mb-2`} />
            <div className={`text-xl font-bold ${theme.status.error.text}`}>
              {formatCurrency(bestStrategy.netAfterTaxValue)}
            </div>
            <div className={`text-sm ${theme.textColors.secondary}`}>Projected Value</div>
          </div>
        </div>
      </div>

      {/* Profile Configuration */}
      <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}>
        <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-6 flex items-center gap-2`}>
          <Calculator className="w-5 h-5" />
          Tax Profile Configuration
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                Annual Income ($)
              </label>
              <input
                type="number"
                value={profile.income}
                onChange={(e) => updateProfile('income', parseFloat(e.target.value) || 0)}
                className={`w-full px-4 py-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary}`}
                min="0"
                step="1000"
                title="Your gross annual income"
                aria-label="Annual income"
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                Age
              </label>
              <input
                type="number"
                value={profile.age}
                onChange={(e) => updateProfile('age', parseInt(e.target.value) || 0)}
                className={`w-full px-4 py-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary}`}
                min="18"
                max="80"
                title="Your current age"
                aria-label="Current age"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                Filing Status
              </label>
              <select
                value={profile.filingStatus}
                onChange={(e) => updateProfile('filingStatus', e.target.value)}
                className={`w-full px-4 py-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary}`}
                title="Tax filing status"
                aria-label="Filing status"
              >
                <option value="single">Single</option>
                <option value="married_filing_jointly">Married Filing Jointly</option>
                <option value="married_filing_separately">Married Filing Separately</option>
                <option value="head_of_household">Head of Household</option>
              </select>
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                State Tax Level
              </label>
              <select
                value={profile.state}
                onChange={(e) => updateProfile('state', e.target.value)}
                className={`w-full px-4 py-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary}`}
                title="State tax environment"
                aria-label="State tax level"
              >
                <option value="no_tax">No State Tax (0%)</option>
                <option value="low_tax">Low Tax State (~3%)</option>
                <option value="medium_tax">Medium Tax State (~6%)</option>
                <option value="high_tax">High Tax State (~10%)</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                Current 401(k) Contribution ($)
              </label>
              <input
                type="number"
                value={profile.currentTax401k}
                onChange={(e) => updateProfile('currentTax401k', parseFloat(e.target.value) || 0)}
                className={`w-full px-4 py-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary}`}
                min="0"
                step="500"
                title="Annual 401(k) contributions"
                aria-label="Current 401k contribution"
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                Employer Match ($)
              </label>
              <input
                type="number"
                value={profile.maxEmployerMatch}
                onChange={(e) => updateProfile('maxEmployerMatch', parseFloat(e.target.value) || 0)}
                className={`w-full px-4 py-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary}`}
                min="0"
                step="500"
                title="Maximum employer match available"
                aria-label="Employer match amount"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                Retirement Age
              </label>
              <input
                type="number"
                value={profile.retirementAge}
                onChange={(e) => updateProfile('retirementAge', parseInt(e.target.value) || 0)}
                className={`w-full px-4 py-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary}`}
                min="50"
                max="80"
                title="Planned retirement age"
                aria-label="Retirement age"
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                Expected Retirement Tax Rate (%)
              </label>
              <input
                type="number"
                value={profile.expectedRetirementTaxRate}
                onChange={(e) => updateProfile('expectedRetirementTaxRate', parseFloat(e.target.value) || 0)}
                className={`w-full px-4 py-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary}`}
                min="0"
                max="50"
                step="1"
                title="Expected tax rate in retirement"
                aria-label="Expected retirement tax rate"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Analysis View Selector */}
      <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-lg font-semibold ${theme.textColors.primary} flex items-center gap-2`}>
            <BarChart3 className="w-5 h-5" />
            Optimization Analysis
          </h3>
          
          <div className="flex gap-2">
            <button
              onClick={() => setAnalysisView('optimization')}
              className={`px-4 py-2 rounded-lg transition-all ${
                analysisView === 'optimization'
                  ? `${theme.buttons.primary}`
                  : `border ${theme.borderColors.primary} ${theme.textColors.secondary} hover:${theme.borderColors.accent}`
              }`}
            >
              Strategy Comparison
            </button>
            <button
              onClick={() => setAnalysisView('comparison')}
              className={`px-4 py-2 rounded-lg transition-all ${
                analysisView === 'comparison'
                  ? `${theme.buttons.primary}`
                  : `border ${theme.borderColors.primary} ${theme.textColors.secondary} hover:${theme.borderColors.accent}`
              }`}
            >
              Allocation Details
            </button>
          </div>
        </div>

        {analysisView === 'optimization' && (
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={allocationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis 
                  stroke="#9CA3AF" 
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    name === 'netValue' ? formatCurrency(value) : formatCurrency(value),
                    name === 'netValue' ? 'Net Retirement Value' : 
                    name === 'taxSavings' ? 'Annual Tax Savings' :
                    name === 'traditional' ? 'Traditional Contributions' :
                    name === 'roth' ? 'Roth Contributions' : 'Employer Match'
                  ]}
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                />
                <Bar dataKey="traditional" stackId="contributions" fill="#3B82F6" name="Traditional" />
                <Bar dataKey="roth" stackId="contributions" fill="#10B981" name="Roth" />
                <Bar dataKey="employerMatch" stackId="contributions" fill="#8B5CF6" name="Employer Match" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {analysisView === 'comparison' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-80">
              <h4 className={`text-md font-semibold ${theme.textColors.primary} mb-4 text-center`}>
                Account Allocation
              </h4>
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number, name: string) => [formatCurrency(value), name]}
                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                  Select Strategy to View
                </label>
                <select
                  value={selectedStrategy}
                  onChange={(e) => setSelectedStrategy(e.target.value)}
                  className={`w-full px-4 py-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary}`}
                  title="Select optimization strategy"
                  aria-label="Strategy selection"
                >
                  {optimizationResults.map(result => (
                    <option key={result.strategy} value={result.strategy}>
                      {result.strategy}
                    </option>
                  ))}
                </select>
              </div>
              
              {optimizationResults.map(result => (
                result.strategy === selectedStrategy && (
                  <div key={result.strategy} className={`p-4 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg`}>
                    <h4 className={`font-semibold ${theme.status.info.text} mb-2`}>
                      {result.strategy}
                    </h4>
                    <p className={`text-sm ${theme.textColors.secondary} mb-3`}>
                      {result.description}
                    </p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className={`${theme.textColors.secondary}`}>Annual Tax Savings:</span>
                        <span className={`font-medium ${theme.textColors.primary}`}>{formatCurrency(result.annualTaxSavings)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`${theme.textColors.secondary}`}>Retirement Value:</span>
                        <span className={`font-medium ${theme.textColors.primary}`}>{formatCurrency(result.retirementValue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`${theme.textColors.secondary}`}>Net After-Tax Value:</span>
                        <span className={`font-medium ${theme.textColors.primary}`}>{formatCurrency(result.netAfterTaxValue)}</span>
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Strategy Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {optimizationResults.slice(0, 2).map((result) => (
          <div key={result.strategy} className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>
                {result.strategy}
              </h3>
              {result.strategy === bestStrategy.strategy && (
                <div className={`${theme.status.success.bg} px-3 py-1 rounded-full`}>
                  <span className={`text-sm font-medium ${theme.status.success.text}`}>Recommended</span>
                </div>
              )}
            </div>
            
            <p className={`text-sm ${theme.textColors.secondary} mb-4`}>
              {result.description}
            </p>
            
            <div className="space-y-3">
              <div className={`p-3 ${theme.status.success.bg} rounded-lg`}>
                <h4 className={`font-semibold ${theme.status.success.text} mb-2 flex items-center gap-2`}>
                  <CheckCircle className="w-4 h-4" />
                  Advantages
                </h4>
                <ul className={`text-sm ${theme.textColors.secondary} space-y-1`}>
                  {result.advantages.map((advantage, i) => (
                    <li key={i}>• {advantage}</li>
                  ))}
                </ul>
              </div>
              
              <div className={`p-3 ${theme.status.warning.bg} rounded-lg`}>
                <h4 className={`font-semibold ${theme.status.warning.text} mb-2 flex items-center gap-2`}>
                  <AlertCircle className="w-4 h-4" />
                  Considerations
                </h4>
                <ul className={`text-sm ${theme.textColors.secondary} space-y-1`}>
                  {result.considerations.map((consideration, i) => (
                    <li key={i}>• {consideration}</li>
                  ))}
                </ul>
              </div>
              
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className={`text-center p-2 ${theme.status.info.bg} rounded`}>
                  <div className={`text-sm ${theme.textColors.secondary}`}>Tax Savings</div>
                  <div className={`font-semibold ${theme.status.info.text}`}>{formatCurrency(result.annualTaxSavings)}</div>
                </div>
                <div className={`text-center p-2 ${theme.status.info.bg} rounded`}>
                  <div className={`text-sm ${theme.textColors.secondary}`}>Net Value</div>
                  <div className={`font-semibold ${theme.status.info.text}`}>{formatCurrency(result.netAfterTaxValue)}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Educational Note */}
      <div className={`${theme.status.info.bg} border ${theme.status.info.border} rounded-lg p-4 text-center`}>
        <p className={`text-sm ${theme.status.info.text} font-medium`}>
          💡 Tax-advantaged accounts can save thousands annually. Traditional accounts reduce current taxes, while Roth accounts provide tax-free retirement income. The optimal mix depends on your current vs. expected future tax rates.
        </p>
      </div>
    </motion.div>
  );
}
