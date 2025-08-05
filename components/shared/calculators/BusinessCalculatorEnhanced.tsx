'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import { useBusinessCalculator } from '@/lib/utils/calculatorHooks';
import CalculatorWrapper, { CalculatorMetadata } from './CalculatorWrapper';
import { CurrencyInput, PercentageInput, NumberInput } from './FormFields';
import { InputGroup } from './FormFields';
import { ResultCard } from './ResultComponents';
import { formatCurrency, formatPercentage } from '@/lib/utils/financial';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import {
  Building,
  Calculator,
  DollarSign,
  TrendingUp,
  Target,
  BarChart3,
  PieChart,
  Activity,
  AlertTriangle,
  CheckCircle,
  Zap,
  Info,
  TrendingDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

export default function BusinessCalculatorEnhanced() {
  const { recordCalculatorUsage } = useProgressStore();
  const {
    values,
    result,
    validation,
    isValid,
    updateField,
    reset,
    errors
  } = useBusinessCalculator();

  // Track calculator usage
  useEffect(() => {
    recordCalculatorUsage('business-calculator');
  }, [recordCalculatorUsage]);

  const metadata: CalculatorMetadata = {
    id: 'business-calculator',
    title: 'Business Finance Calculator',
    description: 'Comprehensive business analysis including break-even, financial ratios, cash flow projections, and health metrics.',
    category: 'intermediate',
    icon: Building,
    tags: ['Business Finance', 'Break-even Analysis', 'Financial Ratios', 'Cash Flow', 'Business Health'],
    educationalNotes: [
      {
        title: 'Break-Even Analysis',
        content: 'Understanding your break-even point is crucial for pricing decisions and business viability assessment.',
        tips: [
          'Lower break-even point means faster profitability',
          'Higher contribution margin provides more flexibility',
          'Monitor margin of safety to assess business risk',
          'Fixed costs should be carefully managed to improve break-even'
        ]
      },
      {
        title: 'Financial Ratios',
        content: 'Key ratios help assess business financial health and compare performance against industry benchmarks.',
        tips: [
          'Current ratio > 1.5 indicates good liquidity',
          'Debt-to-equity < 1.0 shows conservative financing',
          'ROE > 15% is considered excellent',
          'Gross margin varies by industry but should be stable'
        ]
      },
      {
        title: 'Cash Flow Management',
        content: 'Cash flow is the lifeblood of business. Positive cash flow ensures operational continuity and growth funding.',
        tips: [
          'Maintain 3-6 months of operating expenses in cash',
          'Invoice promptly and follow up on collections',
          'Negotiate favorable payment terms with suppliers',
          'Plan for seasonal cash flow variations'
        ]
      }
    ]
  };

  if (!result) {
    return (
      <CalculatorWrapper metadata={metadata}>
        <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Controls */}
            <div className="space-y-6">
              <div>
                <h3 className={`${theme.typography.heading4} ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                  <Calculator className={`w-5 h-5 ${theme.textColors.primary}`} />
                  Business Parameters
                </h3>
                
                <div className="space-y-4">
                  <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-4 backdrop-blur-sm`}>
                    <h4 className={`font-semibold ${theme.textColors.secondary} mb-3`}>Break-Even Analysis</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <CurrencyInput
                        label="Fixed Costs"
                        value={values.fixedCosts.toString()}
                        onChange={(value) => updateField('fixedCosts', value)}
                        error={errors.fixedCosts}
                        placeholder="10000"
                      />
                      
                      <CurrencyInput
                        label="Variable Cost/Unit"
                        value={values.variableCostPerUnit.toString()}
                        onChange={(value) => updateField('variableCostPerUnit', value)}
                        error={errors.variableCostPerUnit}
                        placeholder="15"
                      />

                      <CurrencyInput
                        label="Price Per Unit"
                        value={values.pricePerUnit.toString()}
                        onChange={(value) => updateField('pricePerUnit', value)}
                        error={errors.pricePerUnit}
                        placeholder="25"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Placeholder for Results */}
            <div className="space-y-6">
              <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-6 backdrop-blur-sm`}>
                <h3 className={`${theme.typography.heading4} ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                  <BarChart3 className={`w-5 h-5 ${theme.textColors.primary}`} />
                  Business Analysis
                </h3>
                <p className={`${theme.textColors.secondary} text-center py-8`}>
                  Enter business parameters to see comprehensive financial analysis
                </p>
              </div>
            </div>
          </div>
        </div>
      </CalculatorWrapper>
    );
  }

  return (
    <CalculatorWrapper metadata={metadata}>
      <div className="space-y-8">
        {/* Input Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Break-Even Analysis */}
            <div className="space-y-4">
              <h3 className={`${theme.typography.heading4} ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                <Target className={`w-5 h-5 ${theme.textColors.primary}`} />
                Break-Even Analysis
              </h3>
              
              <InputGroup>
                <CurrencyInput
                  label="Fixed Costs"
                  value={values.fixedCosts.toString()}
                  onChange={(value) => updateField('fixedCosts', value)}
                  error={errors.fixedCosts}
                />
                
                <CurrencyInput
                  label="Variable Cost/Unit"
                  value={values.variableCostPerUnit.toString()}
                  onChange={(value) => updateField('variableCostPerUnit', value)}
                  error={errors.variableCostPerUnit}
                />

                <CurrencyInput
                  label="Price Per Unit"
                  value={values.pricePerUnit.toString()}
                  onChange={(value) => updateField('pricePerUnit', value)}
                  error={errors.pricePerUnit}
                />
              </InputGroup>
            </div>

            {/* Financial Ratios */}
            <div className="space-y-4">
              <h3 className={`${theme.typography.heading4} ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                <BarChart3 className={`w-5 h-5 ${theme.textColors.primary}`} />
                Financial Ratios
              </h3>
              
              <InputGroup>
                <CurrencyInput
                  label="Current Assets"
                  value={values.currentAssets.toString()}
                  onChange={(value) => updateField('currentAssets', value)}
                  error={errors.currentAssets}
                />
                
                <CurrencyInput
                  label="Current Liabilities"
                  value={values.currentLiabilities.toString()}
                  onChange={(value) => updateField('currentLiabilities', value)}
                  error={errors.currentLiabilities}
                />

                <CurrencyInput
                  label="Total Debt"
                  value={values.totalDebt.toString()}
                  onChange={(value) => updateField('totalDebt', value)}
                  error={errors.totalDebt}
                />

                <CurrencyInput
                  label="Total Equity"
                  value={values.totalEquity.toString()}
                  onChange={(value) => updateField('totalEquity', value)}
                  error={errors.totalEquity}
                />

                <CurrencyInput
                  label="Annual Revenue"
                  value={values.revenue.toString()}
                  onChange={(value) => updateField('revenue', value)}
                  error={errors.revenue}
                />

                <CurrencyInput
                  label="Net Income"
                  value={values.netIncome.toString()}
                  onChange={(value) => updateField('netIncome', value)}
                  error={errors.netIncome}
                />
              </InputGroup>
            </div>

            {/* Cash Flow & Growth */}
            <div className="space-y-4">
              <h3 className={`${theme.typography.heading4} ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                <Activity className={`w-5 h-5 ${theme.textColors.primary}`} />
                Cash Flow & Growth
              </h3>
              
              <InputGroup>
                <CurrencyInput
                  label="Monthly Revenue"
                  value={values.monthlyRevenue.toString()}
                  onChange={(value) => updateField('monthlyRevenue', value)}
                  error={errors.monthlyRevenue}
                />
                
                <CurrencyInput
                  label="Monthly Expenses"
                  value={values.monthlyExpenses.toString()}
                  onChange={(value) => updateField('monthlyExpenses', value)}
                  error={errors.monthlyExpenses}
                />

                <CurrencyInput
                  label="Initial Cash"
                  value={values.initialCash.toString()}
                  onChange={(value) => updateField('initialCash', value)}
                  error={errors.initialCash}
                />

                <PercentageInput
                  label="Revenue Growth Rate"
                  value={values.revenueGrowthRate.toString()}
                  onChange={(value) => updateField('revenueGrowthRate', value)}
                  error={errors.revenueGrowthRate}
                />

                <PercentageInput
                  label="Expense Growth Rate"
                  value={values.expenseGrowthRate.toString()}
                  onChange={(value) => updateField('expenseGrowthRate', value)}
                  error={errors.expenseGrowthRate}
                />
              </InputGroup>
            </div>
          </div>
        </motion.div>

        {/* Business Health Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}
        >
          <h3 className={`${theme.typography.heading4} ${theme.textColors.primary} mb-6 flex items-center gap-2`}>
            <Zap className={`w-5 h-5 ${theme.textColors.primary}`} />
            Business Health Overview
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <ResultCard
              title="Health Score"
              value={`${result.businessHealthScore.toFixed(0)}%`}
              subtitle="Overall health"
              icon={result.businessHealthScore >= 75 ? CheckCircle : result.businessHealthScore >= 50 ? AlertTriangle : TrendingDown}
              variant={result.businessHealthScore >= 75 ? "success" : result.businessHealthScore >= 50 ? "warning" : "danger"}
            />
            
            <ResultCard
              title="Risk Level"
              value={result.riskLevel}
              subtitle="Business risk"
              icon={result.riskLevel === 'Low' ? CheckCircle : result.riskLevel === 'Medium' ? AlertTriangle : TrendingDown}
              variant={result.riskLevel === 'Low' ? "success" : result.riskLevel === 'Medium' ? "warning" : "danger"}
            />

            <ResultCard
              title="Runway"
              value={result.runwayMonths === Infinity ? "Profitable" : `${result.runwayMonths.toFixed(1)} months`}
              subtitle="Cash runway"
              icon={result.runwayMonths >= 12 ? CheckCircle : result.runwayMonths >= 6 ? AlertTriangle : TrendingDown}
              variant={result.runwayMonths >= 12 ? "success" : result.runwayMonths >= 6 ? "warning" : "danger"}
            />
            
            <ResultCard
              title="Monthly Burn"
              value={formatCurrency(result.burnRate)}
              subtitle="Net cash burn"
              icon={result.burnRate <= 0 ? TrendingUp : TrendingDown}
              variant={result.burnRate <= 0 ? "success" : "danger"}
            />
          </div>

          {/* Recommendations */}
          {result.recommendations.length > 0 && (
            <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-4 backdrop-blur-sm`}>
              <h4 className={`font-semibold ${theme.textColors.secondary} mb-3 flex items-center gap-2`}>
                <Info className="w-4 h-4" />
                Recommendations
              </h4>
              <ul className="space-y-2">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className={`text-sm ${theme.textColors.secondary} flex items-start gap-2`}>
                    <ArrowUp className="w-3 h-3 mt-0.5 text-blue-400 flex-shrink-0" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>

        {/* Break-Even Analysis */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}
        >
          <h3 className={`${theme.typography.heading4} ${theme.textColors.primary} mb-6 flex items-center gap-2`}>
            <Target className={`w-5 h-5 ${theme.textColors.primary}`} />
            Break-Even Analysis
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <ResultCard
              title="Break-Even Units"
              value={result.breakEvenUnits.toFixed(0)}
              subtitle="Units to break even"
              icon={Target}
            />
            
            <ResultCard
              title="Break-Even Revenue"
              value={formatCurrency(result.breakEvenRevenue)}
              subtitle="Revenue to break even"
              icon={DollarSign}
            />

            <ResultCard
              title="Contribution Margin"
              value={formatCurrency(result.contributionMargin)}
              subtitle="Per unit contribution"
              icon={TrendingUp}
            />
            
            <ResultCard
              title="Margin of Safety"
              value={`${result.marginOfSafety.toFixed(1)}%`}
              subtitle="Safety buffer"
              icon={result.marginOfSafety >= 20 ? CheckCircle : AlertTriangle}
              variant={result.marginOfSafety >= 20 ? "success" : "warning"}
            />
          </div>
        </motion.div>

        {/* Financial Ratios */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}
        >
          <h3 className={`${theme.typography.heading4} ${theme.textColors.primary} mb-6 flex items-center gap-2`}>
            <BarChart3 className={`w-5 h-5 ${theme.textColors.primary}`} />
            Financial Ratios
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Liquidity Ratios */}
            <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-4 backdrop-blur-sm`}>
              <h4 className={`font-semibold ${theme.textColors.secondary} mb-3`}>Liquidity</h4>
              <div className="space-y-3">
                <div className={`flex justify-between ${theme.textColors.secondary}`}>
                  <span>Current Ratio:</span>
                  <span className={`font-medium ${result.currentRatio >= 1.5 ? 'text-green-400' : result.currentRatio >= 1 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {result.currentRatio.toFixed(2)}
                  </span>
                </div>
                <div className={`flex justify-between ${theme.textColors.secondary}`}>
                  <span>Working Capital:</span>
                  <span className={`font-medium ${result.workingCapital >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatCurrency(result.workingCapital)}
                  </span>
                </div>
              </div>
            </div>

            {/* Leverage Ratios */}
            <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-4 backdrop-blur-sm`}>
              <h4 className={`font-semibold ${theme.textColors.secondary} mb-3`}>Leverage</h4>
              <div className="space-y-3">
                <div className={`flex justify-between ${theme.textColors.secondary}`}>
                  <span>Debt-to-Equity:</span>
                  <span className={`font-medium ${result.debtToEquityRatio <= 1 ? 'text-green-400' : result.debtToEquityRatio <= 2 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {result.debtToEquityRatio.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Profitability Ratios */}
            <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-4 backdrop-blur-sm`}>
              <h4 className={`font-semibold ${theme.textColors.secondary} mb-3`}>Profitability</h4>
              <div className="space-y-3">
                <div className={`flex justify-between ${theme.textColors.secondary}`}>
                  <span>Net Profit Margin:</span>
                  <span className={`font-medium ${result.netProfitMargin >= 10 ? 'text-green-400' : result.netProfitMargin >= 5 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {result.netProfitMargin.toFixed(1)}%
                  </span>
                </div>
                <div className={`flex justify-between ${theme.textColors.secondary}`}>
                  <span>ROE:</span>
                  <span className={`font-medium ${result.roe >= 15 ? 'text-green-400' : result.roe >= 10 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {result.roe.toFixed(1)}%
                  </span>
                </div>
                <div className={`flex justify-between ${theme.textColors.secondary}`}>
                  <span>ROA:</span>
                  <span className={`font-medium ${result.roa >= 10 ? 'text-green-400' : result.roa >= 5 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {result.roa.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Cash Flow Projection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}
        >
          <h3 className={`${theme.typography.heading4} ${theme.textColors.primary} mb-6 flex items-center gap-2`}>
            <Activity className={`w-5 h-5 ${theme.textColors.primary}`} />
            12-Month Cash Flow Projection
          </h3>

          <div className="h-80 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={result.cashFlowProjection}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="month" 
                  stroke="rgba(255,255,255,0.7)"
                  tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                  tickFormatter={(value) => `M${value}`}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.7)"
                  tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                  tickFormatter={(value) => `$${(value/1000).toFixed(0)}K`}
                />
                <Tooltip 
                  labelFormatter={(value) => `Month ${value}`}
                  formatter={(value: any, name: string) => {
                    const formattedValue = formatCurrency(Number(value));
                    return [formattedValue, name === 'cumulativeCash' ? 'Cumulative Cash' : 
                            name === 'revenue' ? 'Revenue' : 
                            name === 'expenses' ? 'Expenses' : 'Net Cash Flow'];
                  }}
                  contentStyle={{
                    backgroundColor: 'rgba(17, 24, 39, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="revenue"
                />
                <Line 
                  type="monotone" 
                  dataKey="expenses" 
                  stroke="#ef4444" 
                  strokeWidth={2}
                  name="expenses"
                />
                <Line 
                  type="monotone" 
                  dataKey="cumulativeCash" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  name="cumulativeCash"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-4 backdrop-blur-sm text-center`}>
              <TrendingUp className={`w-6 h-6 text-green-400 mx-auto mb-2`} />
              <div className={`text-sm font-medium ${theme.textColors.secondary}`}>Revenue Growth</div>
              <div className={`text-xs ${theme.textColors.secondary}`}>
                {formatPercentage(values.revenueGrowthRate)}
              </div>
            </div>

            <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-4 backdrop-blur-sm text-center`}>
              <TrendingDown className={`w-6 h-6 text-red-400 mx-auto mb-2`} />
              <div className={`text-sm font-medium ${theme.textColors.secondary}`}>Expense Growth</div>
              <div className={`text-xs ${theme.textColors.secondary}`}>
                {formatPercentage(values.expenseGrowthRate)}
              </div>
            </div>

            <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-4 backdrop-blur-sm text-center`}>
              <DollarSign className={`w-6 h-6 text-blue-400 mx-auto mb-2`} />
              <div className={`text-sm font-medium ${theme.textColors.secondary}`}>Year-End Cash</div>
              <div className={`text-xs ${theme.textColors.secondary}`}>
                {formatCurrency(result.cashFlowProjection[11]?.cumulativeCash || 0)}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </CalculatorWrapper>
  );
}
