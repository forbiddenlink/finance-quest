'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProgressStore } from '@/lib/store/progressStore';
;
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calculator, DollarSign, Target, TrendingDown, Shield, FileText, Zap } from 'lucide-react';
import { theme } from '@/lib/theme';

interface TaxOptimizationResult {
  currentTaxes: number;
  optimizedTaxes: number;
  taxSavings: number;
  effectiveRate: number;
  optimizedRate: number;
  recommendations: string[];
  strategies: TaxStrategy[];
}

interface TaxStrategy {
  name: string;
  description: string;
  potentialSavings: number;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  category: string;
}

const TAX_BRACKETS_2024 = [
  { min: 0, max: 11600, rate: 0.10 },
  { min: 11600, max: 47150, rate: 0.12 },
  { min: 47150, max: 100525, rate: 0.22 },
  { min: 100525, max: 191950, rate: 0.24 },
  { min: 191950, max: 243725, rate: 0.32 },
  { min: 243725, max: 609350, rate: 0.35 },
  { min: 609350, max: Infinity, rate: 0.37 }
];

const COLORS = ['#3B82F6', '#10b981', '#F59E0B', '#ef4444', '#8b5cf6', '#06B6D4'];

export default function TaxOptimizerCalculator() {
  const { recordCalculatorUsage } = useProgressStore();
  
  // Input states
  const [income, setIncome] = useState<string>('75000');
  const [filingStatus, setFilingStatus] = useState<string>('single');
  const [currentDeductions, setCurrentDeductions] = useState<string>('13850');
  const [retirement401k, setRetirement401k] = useState<string>('6000');
  const [retirementIra, setRetirementIra] = useState<string>('3000');
  const [hsaContribution, setHsaContribution] = useState<string>('2000');
  const [studentLoanInterest, setStudentLoanInterest] = useState<string>('1500');
  const [stateIncomeTax, setStateIncomeTax] = useState<string>('5');
  const [dependents, setDependents] = useState<string>('0');
  
  // Results state
  const [results, setResults] = useState<TaxOptimizationResult | null>(null);

  useEffect(() => {
    recordCalculatorUsage('tax-optimizer');
  }, [recordCalculatorUsage]);

  const calculateFederalTax = (taxableIncome: number): number => {
    let tax = 0;
    for (const bracket of TAX_BRACKETS_2024) {
      if (taxableIncome > bracket.min) {
        const taxableAtThisBracket = Math.min(taxableIncome - bracket.min, bracket.max - bracket.min);
        tax += taxableAtThisBracket * bracket.rate;
      }
    }
    return tax;
  };

  const getStandardDeduction = (status: string): number => {
    switch (status) {
      case 'single': return 13850;
      case 'marriedJoint': return 27700;
      case 'marriedSeparate': return 13850;
      case 'headOfHousehold': return 20800;
      default: return 13850;
    }
  };

  const optimizeTaxes = () => {
    const incomeNum = parseFloat(income) || 0;
    const currentDeductionsNum = parseFloat(currentDeductions) || getStandardDeduction(filingStatus);
    const retirement401kNum = parseFloat(retirement401k) || 0;
    const retirementIraNum = parseFloat(retirementIra) || 0;
    const hsaContributionNum = parseFloat(hsaContribution) || 0;
    const studentLoanInterestNum = parseFloat(studentLoanInterest) || 0;
    const stateIncomeTaxNum = parseFloat(stateIncomeTax) || 0;

    // Current situation
    const currentAdjustedIncome = incomeNum - retirement401kNum - retirementIraNum - hsaContributionNum - studentLoanInterestNum;
    const currentTaxableIncome = Math.max(0, currentAdjustedIncome - currentDeductionsNum);
    const currentFederalTax = calculateFederalTax(currentTaxableIncome);
    const currentStateTax = (incomeNum * stateIncomeTaxNum) / 100;
    const currentTotalTax = currentFederalTax + currentStateTax;

    // Optimization strategies
    const strategies: TaxStrategy[] = [];
    let optimizedIncome = currentAdjustedIncome;
    let optimizedDeductions = currentDeductionsNum;
    let additionalSavings = 0;

    // Strategy 1: Max out 401(k)
    const max401k = 23000; // 2024 limit
    const additional401k = Math.max(0, max401k - retirement401kNum);
    if (additional401k > 0) {
      const taxSavings = additional401k * 0.22; // Assume 22% tax bracket
      strategies.push({
        name: 'Maximize 401(k) Contributions',
        description: `Contribute additional $${additional401k.toLocaleString()} to reach the $23,000 annual limit`,
        potentialSavings: taxSavings,
        difficulty: 'Easy',
        category: 'Retirement'
      });
      additionalSavings += taxSavings;
      optimizedIncome -= additional401k;
    }

    // Strategy 2: Max out IRA
    const maxIra = 7000; // 2024 limit
    const additionalIra = Math.max(0, maxIra - retirementIraNum);
    if (additionalIra > 0) {
      const taxSavings = additionalIra * 0.22;
      strategies.push({
        name: 'Maximize IRA Contributions',
        description: `Contribute additional $${additionalIra.toLocaleString()} to reach the $7,000 annual limit`,
        potentialSavings: taxSavings,
        difficulty: 'Easy',
        category: 'Retirement'
      });
      additionalSavings += taxSavings;
      optimizedIncome -= additionalIra;
    }

    // Strategy 3: HSA optimization
    const maxHsa = 4150; // 2024 individual limit
    const additionalHsa = Math.max(0, maxHsa - hsaContributionNum);
    if (additionalHsa > 0) {
      const taxSavings = additionalHsa * 0.22;
      strategies.push({
        name: 'Maximize HSA Contributions',
        description: `Contribute additional $${additionalHsa.toLocaleString()} for triple tax advantage`,
        potentialSavings: taxSavings,
        difficulty: 'Easy',
        category: 'Healthcare'
      });
      additionalSavings += taxSavings;
      optimizedIncome -= additionalHsa;
    }

    // Strategy 4: Tax-loss harvesting
    if (incomeNum > 50000) {
      const taxLossHarvesting = Math.min(3000, incomeNum * 0.02);
      strategies.push({
        name: 'Tax-Loss Harvesting',
        description: 'Realize investment losses to offset capital gains',
        potentialSavings: taxLossHarvesting * 0.22,
        difficulty: 'Medium',
        category: 'Investments'
      });
      additionalSavings += taxLossHarvesting * 0.22;
    }

    // Strategy 5: Charitable giving
    if (incomeNum > 100000) {
      const charitableGiving = incomeNum * 0.05;
      strategies.push({
        name: 'Strategic Charitable Giving',
        description: 'Donate appreciated securities for tax deduction',
        potentialSavings: charitableGiving * 0.24,
        difficulty: 'Medium',
        category: 'Deductions'
      });
      additionalSavings += charitableGiving * 0.24;
      optimizedDeductions += charitableGiving;
    }

    // Calculate optimized taxes
    const optimizedTaxableIncome = Math.max(0, optimizedIncome - optimizedDeductions);
    const optimizedFederalTax = calculateFederalTax(optimizedTaxableIncome);
    const optimizedStateTax = (optimizedIncome * stateIncomeTaxNum) / 100;
    const optimizedTotalTax = optimizedFederalTax + optimizedStateTax;

    const taxSavings = currentTotalTax - optimizedTotalTax + additionalSavings;
    const effectiveRate = (currentTotalTax / incomeNum) * 100;
    const optimizedRate = (optimizedTotalTax / incomeNum) * 100;

    // Generate recommendations
    const recommendations: string[] = [];
    
    if (retirement401kNum < max401k) {
      recommendations.push('Increase 401(k) contributions to reduce taxable income');
    }
    
    if (retirementIraNum < maxIra) {
      recommendations.push('Consider maxing out Traditional IRA for tax deduction');
    }
    
    if (hsaContributionNum < maxHsa) {
      recommendations.push('HSA contributions offer triple tax advantage - deductible, growth tax-free, withdrawals tax-free for medical expenses');
    }
    
    if (incomeNum > 75000) {
      recommendations.push('Consider Roth conversion strategies for tax diversification');
    }
    
    recommendations.push('Track all deductible expenses throughout the year');
    recommendations.push('Review tax strategy quarterly, not just at year-end');

    setResults({
      currentTaxes: currentTotalTax,
      optimizedTaxes: optimizedTotalTax,
      taxSavings,
      effectiveRate,
      optimizedRate,
      recommendations,
      strategies: strategies.slice(0, 6) // Limit to top 6 strategies
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return `${theme.status.success.text} ${theme.status.success.bg}`;
      case 'Medium': return `${theme.status.warning.text} ${theme.status.warning.bg}`;
      case 'Advanced': return `${theme.status.error.text} ${theme.status.error.bg}`;
      default: return `${theme.textColors.secondary} ${theme.backgrounds.disabled}`;
    }
  };

  const taxBreakdownData = results ? [
    { name: 'Current Taxes', amount: results.currentTaxes },
    { name: 'Optimized Taxes', amount: results.optimizedTaxes },
    { name: 'Potential Savings', amount: results.taxSavings }
  ] : [];

  const strategiesData = results ? results.strategies.map(strategy => ({
    name: strategy.name,
    savings: strategy.potentialSavings
  })) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className={`${theme.typography.heading2} ${theme.textColors.primary} mb-2`}>Tax Optimizer</h2>
        <p className={`${theme.textColors.secondary} max-w-2xl mx-auto`}>
          Minimize your tax burden with personalized strategies. Discover legal ways to reduce taxes 
          and keep more of your hard-earned money working for you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className={`w-5 h-5 ${theme.status.info.text}`} />
              Tax Information
            </CardTitle>
            <CardDescription>
              Enter your current tax situation for personalized optimization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-1`}>
                  Annual Income ($)
                </label>
                <Input
                  type="number"
                  value={income}
                  onChange={(e) => setIncome(e.target.value)}
                  placeholder="75000"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-1`}>
                  Filing Status
                </label>
                <select
                  className={`w-full p-3 border ${theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-yellow-500`}
                  value={filingStatus}
                  onChange={(e) => setFilingStatus(e.target.value)}
                >
                  <option value="single">Single</option>
                  <option value="marriedJoint">Married Filing Jointly</option>
                  <option value="marriedSeparate">Married Filing Separately</option>
                  <option value="headOfHousehold">Head of Household</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-1`}>
                  Current Deductions ($)
                </label>
                <Input
                  type="number"
                  value={currentDeductions}
                  onChange={(e) => setCurrentDeductions(e.target.value)}
                  placeholder="13850"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-1`}>
                  Dependents
                </label>
                <Input
                  type="number"
                  value={dependents}
                  onChange={(e) => setDependents(e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-1`}>
                  401(k) Contributions ($)
                </label>
                <Input
                  type="number"
                  value={retirement401k}
                  onChange={(e) => setRetirement401k(e.target.value)}
                  placeholder="6000"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-1`}>
                  IRA Contributions ($)
                </label>
                <Input
                  type="number"
                  value={retirementIra}
                  onChange={(e) => setRetirementIra(e.target.value)}
                  placeholder="3000"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-1`}>
                  HSA Contributions ($)
                </label>
                <Input
                  type="number"
                  value={hsaContribution}
                  onChange={(e) => setHsaContribution(e.target.value)}
                  placeholder="2000"
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-1`}>
                  State Income Tax (%)
                </label>
                <Input
                  type="number"
                  step="0.1"
                  value={stateIncomeTax}
                  onChange={(e) => setStateIncomeTax(e.target.value)}
                  placeholder="5"
                />
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${theme.textColors.primary} mb-1`}>
                Student Loan Interest ($)
              </label>
              <Input
                type="number"
                value={studentLoanInterest}
                onChange={(e) => setStudentLoanInterest(e.target.value)}
                placeholder="1500"
              />
            </div>

            <Button onClick={optimizeTaxes} className="w-full">
              Optimize My Taxes
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className={`w-5 h-5 ${theme.status.success.text}`} />
              Tax Optimization Results
            </CardTitle>
            <CardDescription>
              Your potential tax savings and strategies
            </CardDescription>
          </CardHeader>
          <CardContent>
            {results ? (
              <div className="space-y-6">
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className={`text-center p-4 ${theme.status.error.bg} rounded-lg`}>
                    <div className={`${theme.typography.heading2} ${theme.status.error.text}`}>
                      {formatCurrency(results.currentTaxes)}
                    </div>
                    <div className={`text-sm ${theme.textColors.secondary}`}>Current Taxes</div>
                    <div className={`text-xs ${theme.textColors.muted}`}>
                      {formatPercentage(results.effectiveRate)} effective rate
                    </div>
                  </div>
                  <div className={`text-center p-4 ${theme.status.success.bg} rounded-lg`}>
                    <div className={`${theme.typography.heading2} ${theme.status.success.text}`}>
                      {formatCurrency(results.taxSavings)}
                    </div>
                    <div className={`text-sm ${theme.textColors.secondary}`}>Potential Savings</div>
                    <div className={`text-xs ${theme.textColors.muted}`}>
                      {formatPercentage(results.optimizedRate)} optimized rate
                    </div>
                  </div>
                </div>

                {/* Top Strategies */}
                <div>
                  <h4 className={`font-medium ${theme.textColors.primary} mb-3`}>Top Tax Strategies</h4>
                  <div className="space-y-2">
                    {results.strategies.slice(0, 3).map((strategy, index) => (
                      <div key={index} className={`flex items-center justify-between p-3 ${theme.status.info.bg} rounded-lg`}>
                        <div className="flex-1">
                          <div className={`font-medium ${theme.textColors.primary}`}>{strategy.name}</div>
                          <div className={`text-sm ${theme.textColors.secondary}`}>{strategy.description}</div>
                          <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${getDifficultyColor(strategy.difficulty)}`}>
                            {strategy.difficulty}
                          </div>
                        </div>
                        <div className={`${theme.status.success.text} font-semibold`}>
                          {formatCurrency(strategy.potentialSavings)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendations */}
                <div>
                  <h4 className={`font-medium ${theme.textColors.primary} mb-2 flex items-center gap-2`}>
                    <Zap className={`w-4 h-4 ${theme.status.warning.text}`} />
                    Key Recommendations
                  </h4>
                  <ul className={`space-y-1 text-sm ${theme.textColors.secondary}`}>
                    {results.recommendations.slice(0, 4).map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className={`${theme.status.info.text} mt-1`}>•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className={`text-center py-8 ${theme.textColors.muted}`}>
                <Calculator className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Enter your tax information to see optimization strategies</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      {results && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tax Comparison */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className={`w-5 h-5 ${theme.status.success.text}`} />
                Tax Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={taxBreakdownData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="name" tick={{ fill: "#94a3b8" }} />
                  <YAxis tickFormatter={(value: number) => `$${(value / 1000).toFixed(1)}k`} tick={{ fill: "#94a3b8" }} />
                  <Tooltip formatter={(value: number) => [formatCurrency(value), '']} />
                  <Bar dataKey="amount" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Strategy Savings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className={`w-5 h-5 ${theme.textColors.primary}`} />
                Strategy Savings Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={strategiesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({name, value}) => `${name}: ${formatCurrency(value || 0)}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="savings"
                  >
                    {strategiesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [formatCurrency(value), 'Savings']} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Educational Content */}
      <Card className="bg-gradient-to-r from-slate-50 to-emerald-50">
        <CardContent className="p-6">
          <h3 className={`${theme.typography.heading4} ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
            <Shield className={`w-5 h-5 ${theme.status.info.text}`} />
            Tax Optimization Strategies
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className={`font-medium ${theme.textColors.primary} mb-2`}>Pre-Tax Contributions</h4>
              <p className={`${theme.textColors.primary}`}>
                401(k), Traditional IRA, and HSA contributions reduce your taxable income dollar-for-dollar. 
                Maximize these accounts first for immediate tax savings.
              </p>
            </div>
            <div>
              <h4 className={`font-medium ${theme.textColors.primary} mb-2`}>Tax-Loss Harvesting</h4>
              <p className={`${theme.textColors.primary}`}>
                Realize investment losses to offset capital gains. You can deduct up to $3,000 
                in net losses against ordinary income annually.
              </p>
            </div>
            <div>
              <h4 className={`font-medium ${theme.textColors.primary} mb-2`}>Strategic Timing</h4>
              <p className={`${theme.textColors.primary}`}>
                Time income and deductions strategically. Consider accelerating deductions into 
                high-income years and deferring income when possible.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
