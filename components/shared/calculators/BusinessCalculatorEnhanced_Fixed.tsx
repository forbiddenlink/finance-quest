'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import { useBusinessCalculator } from '@/lib/utils/calculatorHooks';
import CalculatorWrapper, { CalculatorMetadata } from './CalculatorWrapper';
import { CurrencyInput, PercentageInput } from './FormFields';
import { InputGroup } from './FormFields';
import { ResultCard } from './ResultComponents';
import { formatCurrency, formatPercentage } from '@/lib/utils/financial';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
    Building,
    Calculator,
    DollarSign,
    TrendingUp,
    Target,
    BarChart3,
    Activity,
    AlertTriangle,
    CheckCircle,
    Zap,
    Info,
    TrendingDown,
    ArrowUp
} from 'lucide-react';

export default function BusinessCalculatorEnhanced() {
    const { recordCalculatorUsage } = useProgressStore();
    const {
        values,
        result,
        updateField,
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
            'Break-even analysis helps determine the minimum sales needed to cover costs',
            'Financial ratios provide insights into business health and performance',
            'Cash flow projections help plan for future financial needs',
            'Regular monitoring of these metrics is crucial for business success'
        ]
    };

    return (
        <CalculatorWrapper metadata={metadata}>
            <div className="space-y-8">
                {/* Input Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Break-even Analysis */}
                    <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
                        <InputGroup title="Break-even Analysis">
                            <CurrencyInput
                                id="fixedCosts"
                                label="Fixed Costs (Monthly)"
                                value={values.fixedCosts || ''}
                                onChange={(value: string) => updateField('fixedCosts', value)}
                                error={errors.fixedCosts || ''}
                                placeholder="10000"
                            />
                            <CurrencyInput
                                id="variableCostPerUnit"
                                label="Variable Cost per Unit"
                                value={values.variableCostPerUnit || ''}
                                onChange={(value: string) => updateField('variableCostPerUnit', value)}
                                error={errors.variableCostPerUnit || ''}
                                placeholder="25"
                            />
                            <CurrencyInput
                                id="pricePerUnit"
                                label="Price per Unit"
                                value={values.pricePerUnit || ''}
                                onChange={(value: string) => updateField('pricePerUnit', value)}
                                error={errors.pricePerUnit || ''}
                                placeholder="50"
                            />
                        </InputGroup>
                    </div>

                    {/* Financial Position */}
                    <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
                        <InputGroup title="Financial Position">
                            <CurrencyInput
                                id="currentAssets"
                                label="Current Assets"
                                value={values.currentAssets || ''}
                                onChange={(value: string) => updateField('currentAssets', value)}
                                error={errors.currentAssets || ''}
                            />
                            <CurrencyInput
                                id="currentLiabilities"
                                label="Current Liabilities"
                                value={values.currentLiabilities || ''}
                                onChange={(value: string) => updateField('currentLiabilities', value)}
                                error={errors.currentLiabilities || ''}
                            />
                            <CurrencyInput
                                id="totalDebt"
                                label="Total Debt"
                                value={values.totalDebt || ''}
                                onChange={(value: string) => updateField('totalDebt', value)}
                                error={errors.totalDebt || ''}
                            />
                            <CurrencyInput
                                id="totalEquity"
                                label="Total Equity"
                                value={values.totalEquity || ''}
                                onChange={(value: string) => updateField('totalEquity', value)}
                                error={errors.totalEquity || ''}
                            />
                        </InputGroup>
                    </div>

                    {/* Performance Metrics */}
                    <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
                        <InputGroup title="Performance Metrics">
                            <CurrencyInput
                                id="revenue"
                                label="Annual Revenue"
                                value={values.revenue || ''}
                                onChange={(value: string) => updateField('revenue', value)}
                                error={errors.revenue || ''}
                            />
                            <CurrencyInput
                                id="netIncome"
                                label="Annual Net Income"
                                value={values.netIncome || ''}
                                onChange={(value: string) => updateField('netIncome', value)}
                                error={errors.netIncome || ''}
                            />
                        </InputGroup>
                    </div>

                    {/* Cash Flow Analysis */}
                    <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
                        <InputGroup title="Cash Flow Analysis">
                            <CurrencyInput
                                id="monthlyRevenue"
                                label="Monthly Revenue"
                                value={values.monthlyRevenue || ''}
                                onChange={(value: string) => updateField('monthlyRevenue', value)}
                                error={errors.monthlyRevenue || ''}
                            />
                            <CurrencyInput
                                id="monthlyExpenses"
                                label="Monthly Expenses"
                                value={values.monthlyExpenses || ''}
                                onChange={(value: string) => updateField('monthlyExpenses', value)}
                                error={errors.monthlyExpenses || ''}
                            />
                            <CurrencyInput
                                id="initialCash"
                                label="Current Cash Position"
                                value={values.initialCash || ''}
                                onChange={(value: string) => updateField('initialCash', value)}
                                error={errors.initialCash || ''}
                            />
                            <PercentageInput
                                id="revenueGrowthRate"
                                label="Revenue Growth Rate (Annual)"
                                value={values.revenueGrowthRate || ''}
                                onChange={(value: string) => updateField('revenueGrowthRate', value)}
                                error={errors.revenueGrowthRate || ''}
                            />
                            <PercentageInput
                                id="expenseGrowthRate"
                                label="Expense Growth Rate (Annual)"
                                value={values.expenseGrowthRate || ''}
                                onChange={(value: string) => updateField('expenseGrowthRate', value)}
                                error={errors.expenseGrowthRate || ''}
                            />
                        </InputGroup>
                    </div>
                </div>

                {/* Results Section */}
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        {/* Business Health Score */}
                        <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
                            <h3 className={`text-xl font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                                <Activity className="w-5 h-5" />
                                Business Health Overview
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <ResultCard
                                    label="Business Health Score"
                                    value={result.businessHealthScore}
                                    format="number"
                                    variant={result.businessHealthScore >= 75 ? 'success' : result.businessHealthScore >= 50 ? 'warning' : 'error'}
                                    description={`Score: ${result.businessHealthScore}/100`}
                                />
                                <ResultCard
                                    label="Risk Level"
                                    value={0}
                                    format="number"
                                    variant={result.riskLevel === 'Low' ? 'success' : result.riskLevel === 'Medium' ? 'warning' : 'error'}
                                    description={`Risk: ${result.riskLevel}`}
                                />
                                <ResultCard
                                    label="Cash Runway"
                                    value={result.runwayMonths > 999 ? 999 : result.runwayMonths}
                                    format="number"
                                    variant={result.runwayMonths > 12 ? 'success' : result.runwayMonths > 6 ? 'warning' : 'error'}
                                    description={`${result.runwayMonths > 999 ? 'Infinite' : result.runwayMonths.toFixed(1)} months`}
                                />
                                <ResultCard
                                    label="Monthly Burn Rate"
                                    value={result.burnRate}
                                    format="currency"
                                    variant={result.burnRate <= 0 ? 'success' : 'error'}
                                    description={result.burnRate <= 0 ? 'Positive cash flow' : 'Cash burn'}
                                />
                            </div>
                        </div>

                        {/* Recommendations */}
                        {result.recommendations && result.recommendations.length > 0 && (
                            <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
                                <h3 className={`text-xl font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                                    <Info className="w-5 h-5" />
                                    Recommendations
                                </h3>
                                <div className="space-y-3">
                                    {result.recommendations.map((rec: string, index: number) => (
                                        <div key={index} className={`p-3 rounded-lg ${theme.backgrounds.secondary} border-l-4 ${theme.borderColors.primary}`}>
                                            <p className={theme.textColors.secondary}>{rec}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Break-even Analysis Results */}
                        <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
                            <h3 className={`text-xl font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                                <Target className="w-5 h-5" />
                                Break-even Analysis
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <ResultCard
                                    label="Break-even Units"
                                    value={result.breakEvenUnits}
                                    format="number"
                                    description="Units needed to break even"
                                    icon={Target}
                                />
                                <ResultCard
                                    label="Break-even Revenue"
                                    value={result.breakEvenRevenue}
                                    format="currency"
                                />
                                <ResultCard
                                    label="Contribution Margin"
                                    value={result.contributionMargin}
                                    format="percentage"
                                />
                                <ResultCard
                                    label="Margin of Safety"
                                    value={result.marginOfSafety}
                                    format="percentage"
                                    description={result.marginOfSafety > 20 ? 'Good safety margin' : 'Consider increasing sales'}
                                    variant={result.marginOfSafety > 20 ? 'success' : 'warning'}
                                />
                            </div>
                        </div>

                        {/* Financial Ratios */}
                        <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
                            <h3 className={`text-xl font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                                <BarChart3 className="w-5 h-5" />
                                Financial Ratios
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className={`p-4 rounded-lg ${theme.backgrounds.secondary}`}>
                                    <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>Liquidity</h4>
                                    <p className={`text-2xl font-bold ${theme.textColors.primary}`}>
                                        {result.currentRatio.toFixed(2)}
                                    </p>
                                    <p className={`text-sm ${theme.textColors.secondary}`}>
                                        Current Ratio {result.currentRatio >= 2 ? '(Excellent)' : result.currentRatio >= 1 ? '(Good)' : '(Poor)'}
                                    </p>
                                </div>
                                <div className={`p-4 rounded-lg ${theme.backgrounds.secondary}`}>
                                    <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>Working Capital</h4>
                                    <p className={`text-2xl font-bold ${theme.textColors.primary}`}>
                                        {formatCurrency(result.workingCapital)}
                                    </p>
                                    <p className={`text-sm ${theme.textColors.secondary}`}>
                                        Available funds {result.workingCapital > 0 ? '(Positive)' : '(Negative)'}
                                    </p>
                                </div>
                                <div className={`p-4 rounded-lg ${theme.backgrounds.secondary}`}>
                                    <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>Leverage</h4>
                                    <p className={`text-2xl font-bold ${theme.textColors.primary}`}>
                                        {result.debtToEquityRatio.toFixed(2)}
                                    </p>
                                    <p className={`text-sm ${theme.textColors.secondary}`}>
                                        Debt-to-Equity {result.debtToEquityRatio < 0.5 ? '(Conservative)' : result.debtToEquityRatio < 1 ? '(Moderate)' : '(High)'}
                                    </p>
                                </div>
                                <div className={`p-4 rounded-lg ${theme.backgrounds.secondary}`}>
                                    <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>Profitability</h4>
                                    <p className={`text-2xl font-bold ${theme.textColors.primary}`}>
                                        {result.netProfitMargin.toFixed(1)}%
                                    </p>
                                    <p className={`text-sm ${theme.textColors.secondary}`}>
                                        Net Profit Margin {result.netProfitMargin > 15 ? '(Excellent)' : result.netProfitMargin > 5 ? '(Good)' : '(Poor)'}
                                    </p>
                                </div>
                                <div className={`p-4 rounded-lg ${theme.backgrounds.secondary}`}>
                                    <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>Return on Equity</h4>
                                    <p className={`text-2xl font-bold ${theme.textColors.primary}`}>
                                        {result.roe.toFixed(1)}%
                                    </p>
                                    <p className={`text-sm ${theme.textColors.secondary}`}>
                                        ROE {result.roe > 20 ? '(Excellent)' : result.roe > 10 ? '(Good)' : '(Below Average)'}
                                    </p>
                                </div>
                                <div className={`p-4 rounded-lg ${theme.backgrounds.secondary}`}>
                                    <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>Return on Assets</h4>
                                    <p className={`text-2xl font-bold ${theme.textColors.primary}`}>
                                        {result.roa.toFixed(1)}%
                                    </p>
                                    <p className={`text-sm ${theme.textColors.secondary}`}>
                                        ROA {result.roa > 10 ? '(Excellent)' : result.roa > 5 ? '(Good)' : '(Below Average)'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Cash Flow Projection Chart */}
                        {result.cashFlowProjection && result.cashFlowProjection.length > 0 && (
                            <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
                                <h3 className={`text-xl font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                                    <TrendingUp className="w-5 h-5" />
                                    12-Month Cash Flow Projection
                                </h3>
                                <div className="h-64">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={result.cashFlowProjection}>
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis
                                                dataKey="month"
                                                tickFormatter={(value) => `Month ${value}`}
                                            />
                                            <YAxis tickFormatter={(value) => formatCurrency(value)} />
                                            <Tooltip
                                                formatter={(value: any, name: string) => [
                                                    formatCurrency(value),
                                                    name === 'revenue' ? 'Revenue' :
                                                        name === 'expenses' ? 'Expenses' :
                                                            name === 'netCashFlow' ? 'Net Cash Flow' : 'Cumulative Cash'
                                                ]}
                                                labelFormatter={(value) => `Month ${value}`}
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
                                <div className="mt-4 text-sm text-center">
                                    <p className={theme.textColors.secondary}>
                                        Growth assumptions: Revenue {values.revenueGrowthRate || 5}% annually,
                                        Expenses {values.expenseGrowthRate || 3}% annually
                                    </p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </CalculatorWrapper>
    );
}
