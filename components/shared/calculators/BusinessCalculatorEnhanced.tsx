'use client'

import React, { useEffect } from 'react';
import { Building, TrendingUp, DollarSign, BarChart3, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { theme } from '@/lib/theme';
import CalculatorWrapper, { CalculatorMetadata } from './CalculatorWrapper';
import { useBusinessCalculator } from '@/lib/utils/calculatorHooks';
import { CurrencyInput, PercentageInput } from './FormFields';
import { InputGroup } from './FormFields';
import { ResultCard } from './ResultComponents';
import { formatCurrency, formatPercentage } from '@/lib/utils/financial';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useProgressStore } from '@/lib/store/progressStore';

/**
 * BusinessCalculatorEnhanced - Comprehensive business financial analysis tool
 * 
 * Features:
 * - Break-even analysis with contribution margin calculations
 * - Financial ratio analysis (liquidity, leverage, profitability)
 * - Cash flow projections with growth scenarios
 * - Business health scoring with recommendations
 * - Interactive visualizations and insights
 */

export default function BusinessCalculatorEnhanced() {
    const { recordCalculatorUsage } = useProgressStore();

    const {
        values,
        errors,
        result,
        updateField,
        reset
    } = useBusinessCalculator();

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
                title: 'Break-even Analysis',
                content: 'Break-even analysis helps determine the minimum sales needed to cover costs',
                tips: ['Monitor fixed vs variable costs', 'Track contribution margin', 'Plan for growth scenarios']
            },
            {
                title: 'Financial Ratios',
                content: 'Financial ratios provide insights into business health and performance',
                tips: ['Current ratio shows liquidity', 'Debt-to-equity shows leverage', 'ROE measures profitability']
            },
            {
                title: 'Cash Flow Projections',
                content: 'Cash flow projections help plan for future financial needs',
                tips: ['Plan for seasonal variations', 'Consider growth scenarios', 'Monitor burn rate']
            },
            {
                title: 'Business Monitoring',
                content: 'Regular monitoring of these metrics is crucial for business success',
                tips: ['Review monthly', 'Set target benchmarks', 'Track trends over time']
            }
        ]
    };

    return (
        <CalculatorWrapper metadata={metadata}>
            <div className="space-y-8">
                {/* Input Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Break-even Analysis */}
                    <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className={`p-2 rounded-lg ${theme.backgrounds.card}`}>
                                <TrendingUp className="w-5 h-5 text-amber-400" />
                            </div>
                            <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>
                                Break-even Analysis
                            </h3>
                        </div>

                        <div className="space-y-4">
                            <CurrencyInput
                                id="fixedCosts"
                                label="Fixed Costs (Monthly)"
                                value={values.fixedCosts}
                                onChange={(value: string) => updateField('fixedCosts', value)}
                                error={errors.fixedCosts}
                                placeholder="Enter monthly fixed costs"
                            />

                            <CurrencyInput
                                id="variableCostPerUnit"
                                label="Variable Cost Per Unit"
                                value={values.variableCostPerUnit}
                                onChange={(value: string) => updateField('variableCostPerUnit', value)}
                                error={errors.variableCostPerUnit}
                                placeholder="Enter cost per unit"
                            />

                            <CurrencyInput
                                id="pricePerUnit"
                                label="Price Per Unit"
                                value={values.pricePerUnit}
                                onChange={(value: string) => updateField('pricePerUnit', value)}
                                error={errors.pricePerUnit}
                                placeholder="Enter selling price per unit"
                            />
                        </div>
                    </div>

                    {/* Financial Position */}
                    <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className={`p-2 rounded-lg ${theme.backgrounds.card}`}>
                                <BarChart3 className="w-5 h-5 text-blue-400" />
                            </div>
                            <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>
                                Financial Position
                            </h3>
                        </div>

                        <div className="space-y-6">
                            <InputGroup title="Liquidity">
                                <CurrencyInput
                                    id="currentAssets"
                                    label="Current Assets"
                                    value={values.currentAssets}
                                    onChange={(value: string) => updateField('currentAssets', value)}
                                    error={errors.currentAssets}
                                />

                                <CurrencyInput
                                    id="currentLiabilities"
                                    label="Current Liabilities"
                                    value={values.currentLiabilities}
                                    onChange={(value: string) => updateField('currentLiabilities', value)}
                                    error={errors.currentLiabilities}
                                />
                            </InputGroup>

                            <InputGroup title="Capital Structure">
                                <CurrencyInput
                                    id="totalDebt"
                                    label="Total Debt"
                                    value={values.totalDebt}
                                    onChange={(value: string) => updateField('totalDebt', value)}
                                    error={errors.totalDebt}
                                />

                                <CurrencyInput
                                    id="totalEquity"
                                    label="Total Equity"
                                    value={values.totalEquity}
                                    onChange={(value: string) => updateField('totalEquity', value)}
                                    error={errors.totalEquity}
                                />
                            </InputGroup>

                            <InputGroup title="Performance">
                                <CurrencyInput
                                    id="revenue"
                                    label="Annual Revenue"
                                    value={values.revenue}
                                    onChange={(value: string) => updateField('revenue', value)}
                                    error={errors.revenue}
                                />

                                <CurrencyInput
                                    id="netIncome"
                                    label="Net Income"
                                    value={values.netIncome}
                                    onChange={(value: string) => updateField('netIncome', value)}
                                    error={errors.netIncome}
                                />
                            </InputGroup>
                        </div>
                    </div>

                    {/* Cash Flow Projections */}
                    <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6 lg:col-span-2`}>
                        <div className="flex items-center gap-3 mb-6">
                            <div className={`p-2 rounded-lg ${theme.backgrounds.card}`}>
                                <DollarSign className="w-5 h-5 text-emerald-400" />
                            </div>
                            <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>
                                Cash Flow Projections
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <CurrencyInput
                                id="monthlyRevenue"
                                label="Monthly Revenue"
                                value={values.monthlyRevenue}
                                onChange={(value: string) => updateField('monthlyRevenue', value)}
                                error={errors.monthlyRevenue}
                            />

                            <CurrencyInput
                                id="monthlyExpenses"
                                label="Monthly Expenses"
                                value={values.monthlyExpenses}
                                onChange={(value: string) => updateField('monthlyExpenses', value)}
                                error={errors.monthlyExpenses}
                            />

                            <CurrencyInput
                                id="initialCash"
                                label="Initial Cash"
                                value={values.initialCash}
                                onChange={(value: string) => updateField('initialCash', value)}
                                error={errors.initialCash}
                            />

                            <PercentageInput
                                id="revenueGrowthRate"
                                label="Revenue Growth Rate"
                                value={values.revenueGrowthRate}
                                onChange={(value: string) => updateField('revenueGrowthRate', value)}
                                error={errors.revenueGrowthRate}
                            />

                            <PercentageInput
                                id="expenseGrowthRate"
                                label="Expense Growth Rate"
                                value={values.expenseGrowthRate}
                                onChange={(value: string) => updateField('expenseGrowthRate', value)}
                                error={errors.expenseGrowthRate}
                            />
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                {result && (
                    <div className="space-y-8">
                        {/* Business Health Overview */}
                        <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
                            <h3 className={`text-xl font-semibold ${theme.textColors.primary} mb-6`}>
                                Business Health Overview
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <ResultCard
                                    label="Business Health Score"
                                    value={result.businessHealthScore}
                                    format="number"
                                    description={`Overall Rating: ${result.businessHealthScore >= 80 ? 'Excellent' : result.businessHealthScore >= 60 ? 'Good' : 'Needs Improvement'}`}
                                    variant={result.businessHealthScore >= 80 ? 'success' : result.businessHealthScore >= 60 ? 'warning' : 'error'}
                                    icon={result.businessHealthScore >= 80 ? CheckCircle : result.businessHealthScore >= 60 ? Info : AlertTriangle}
                                />

                                <ResultCard
                                    label="Risk Level"
                                    value={result.riskLevel === 'Low' ? 3 : result.riskLevel === 'Medium' ? 2 : 1}
                                    format="number"
                                    description={`Risk Assessment: ${result.riskLevel === 'Low' ? 'Stable Operations' : result.riskLevel === 'Medium' ? 'Monitor Closely' : 'Immediate Action Required'}`}
                                    variant={result.riskLevel === 'Low' ? 'success' : result.riskLevel === 'Medium' ? 'warning' : 'error'}
                                    icon={result.riskLevel === 'Low' ? CheckCircle : result.riskLevel === 'Medium' ? Info : AlertTriangle}
                                />

                                <ResultCard
                                    label="Cash Runway"
                                    value={result.runwayMonths}
                                    format="months"
                                    description={`Cash will last: ${result.runwayMonths >= 12 ? 'Well positioned' : result.runwayMonths >= 6 ? 'Monitor closely' : 'Critical'}`}
                                    variant={result.runwayMonths >= 12 ? 'success' : result.runwayMonths >= 6 ? 'warning' : 'error'}
                                />

                                <ResultCard
                                    label="Monthly Burn Rate"
                                    value={result.burnRate}
                                    format="currency"
                                    description={`Burn rate: ${result.burnRate > 0 ? 'Burning cash' : 'Generating cash'}`}
                                    variant={result.burnRate > 0 ? 'error' : 'success'}
                                />
                            </div>

                            {/* Recommendations */}
                            <div className="mt-8">
                                <h4 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
                                    Key Recommendations
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {result.recommendations?.map((rec: string, index: number) => (
                                        <div key={index} className={`p-3 rounded-lg ${theme.backgrounds.card} border-l-4 ${theme.borderColors.primary}`}>
                                            <div className="flex items-start gap-3">
                                                <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                                                <p className={`text-sm ${theme.textColors.secondary}`}>{rec}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Break-even Analysis Results */}
                        <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
                            <h3 className={`text-xl font-semibold ${theme.textColors.primary} mb-6`}>
                                Break-even Analysis
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <ResultCard
                                    label="Break-even Units"
                                    value={result.breakEvenUnits}
                                    format="number"
                                    description="Units needed to break even"
                                    icon={TrendingUp}
                                />

                                <ResultCard
                                    label="Break-even Revenue"
                                    value={result.breakEvenRevenue}
                                    format="currency"
                                />

                                <ResultCard
                                    label="Contribution Margin"
                                    value={result.contributionMargin}
                                    format="currency"
                                />

                                <ResultCard
                                    label="Margin of Safety"
                                    value={result.marginOfSafety}
                                    format="percentage"
                                    description={result.marginOfSafety > 20 ? 'Strong safety margin' : result.marginOfSafety > 10 ? 'Moderate safety margin' : 'Low safety margin'}
                                    variant={result.marginOfSafety > 20 ? 'success' : result.marginOfSafety > 10 ? 'warning' : 'error'}
                                />
                            </div>
                        </div>

                        {/* Financial Ratios */}
                        <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
                            <h3 className={`text-xl font-semibold ${theme.textColors.primary} mb-6`}>
                                Financial Ratios
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className={`p-4 rounded-lg ${theme.backgrounds.card}`}>
                                    <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>Liquidity</h4>
                                    <p className={`text-2xl font-bold ${theme.textColors.primary}`}>
                                        {result.currentRatio.toFixed(2)}
                                    </p>
                                    <p className={`text-sm ${theme.textColors.secondary}`}>
                                        Current Ratio {result.currentRatio >= 2 ? '(Excellent)' : result.currentRatio >= 1 ? '(Good)' : '(Poor)'}
                                    </p>
                                </div>

                                <div className={`p-4 rounded-lg ${theme.backgrounds.card}`}>
                                    <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>Leverage</h4>
                                    <p className={`text-2xl font-bold ${theme.textColors.primary}`}>
                                        {result.debtToEquityRatio.toFixed(2)}
                                    </p>
                                    <p className={`text-sm ${theme.textColors.secondary}`}>
                                        Debt-to-Equity {result.debtToEquityRatio <= 0.5 ? '(Conservative)' : result.debtToEquityRatio <= 1 ? '(Moderate)' : '(High Risk)'}
                                    </p>
                                </div>

                                <div className={`p-4 rounded-lg ${theme.backgrounds.card}`}>
                                    <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>Profitability</h4>
                                    <p className={`text-2xl font-bold ${theme.textColors.primary}`}>
                                        {formatPercentage(result.netProfitMargin)}
                                    </p>
                                    <p className={`text-sm ${theme.textColors.secondary}`}>
                                        Net Profit Margin {result.netProfitMargin >= 0.15 ? '(Excellent)' : result.netProfitMargin >= 0.05 ? '(Good)' : '(Poor)'}
                                    </p>
                                </div>

                                <div className={`p-4 rounded-lg ${theme.backgrounds.card}`}>
                                    <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>Efficiency</h4>
                                    <p className={`text-2xl font-bold ${theme.textColors.primary}`}>
                                        {formatPercentage(result.roe)}
                                    </p>
                                    <p className={`text-sm ${theme.textColors.secondary}`}>
                                        Return on Equity {result.roe >= 0.15 ? '(Excellent)' : result.roe >= 0.10 ? '(Good)' : '(Poor)'}
                                    </p>
                                </div>

                                <div className={`p-4 rounded-lg ${theme.backgrounds.card}`}>
                                    <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>Asset Utilization</h4>
                                    <p className={`text-2xl font-bold ${theme.textColors.primary}`}>
                                        {formatPercentage(result.roa)}
                                    </p>
                                    <p className={`text-sm ${theme.textColors.secondary}`}>
                                        Return on Assets {result.roa >= 0.10 ? '(Excellent)' : result.roa >= 0.05 ? '(Good)' : '(Poor)'}
                                    </p>
                                </div>

                                <div className={`p-4 rounded-lg ${theme.backgrounds.card}`}>
                                    <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>Working Capital</h4>
                                    <p className={`text-2xl font-bold ${theme.textColors.primary}`}>
                                        {formatCurrency(result.workingCapital)}
                                    </p>
                                    <p className={`text-sm ${theme.textColors.secondary}`}>
                                        Available for operations {result.workingCapital > 0 ? '(Positive)' : '(Negative)'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Cash Flow Projection Chart */}
                        <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
                            <h3 className={`text-xl font-semibold ${theme.textColors.primary} mb-6`}>
                                12-Month Cash Flow Projection
                            </h3>

                            <div className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={result.cashFlowProjection}
                                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                        <XAxis
                                            dataKey="month"
                                            stroke="#94a3b8"
                                            tick={{ fill: '#94a3b8' }}
                                        />
                                        <YAxis
                                            stroke="#94a3b8"
                                            tick={{ fill: '#94a3b8' }}
                                            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#1e293b',
                                                border: '1px solid #334155',
                                                borderRadius: '8px',
                                                color: '#f8fafc'
                                            }}
                                            formatter={(value: number) => [formatCurrency(value), 'Cash Balance']}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="cumulativeCash"
                                            stroke="#3b82f6"
                                            strokeWidth={2}
                                            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="revenue"
                                            stroke="#10b981"
                                            strokeWidth={2}
                                            dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="expenses"
                                            stroke="#f59e0b"
                                            strokeWidth={2}
                                            dot={{ fill: '#f59e0b', strokeWidth: 2, r: 4 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                                    <span className={theme.textColors.secondary}>Cash Balance</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-emerald-500 rounded"></div>
                                    <span className={theme.textColors.secondary}>Revenue Growth: {formatPercentage(Number(values.revenueGrowthRate) / 100)} monthly</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-amber-500 rounded"></div>
                                    <span className={theme.textColors.secondary}>Expense Growth: {formatPercentage(Number(values.expenseGrowthRate) / 100)} monthly</span>
                                </div>
                            </div>
                        </div>

                        {/* Key Performance Metrics */}
                        <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
                            <h3 className={`text-xl font-semibold ${theme.textColors.primary} mb-6`}>
                                Key Performance Metrics
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {result.cashFlowProjection && result.cashFlowProjection.length > 0 && (
                                    <>
                                        <div className="text-center">
                                            <div className={`text-2xl font-bold ${theme.textColors.primary}`}>
                                                {formatCurrency(result.cashFlowProjection[result.cashFlowProjection.length - 1]?.cumulativeCash)}
                                            </div>
                                            <div className={`text-sm ${theme.textColors.secondary} mt-1`}>
                                                Year-end Cash Balance
                                            </div>
                                        </div>

                                        <div className="text-center">
                                            <div className={`text-2xl font-bold ${theme.textColors.primary}`}>
                                                {formatCurrency(result.cashFlowProjection.reduce((sum, month) => sum + month.revenue, 0))}
                                            </div>
                                            <div className={`text-sm ${theme.textColors.secondary} mt-1`}>
                                                Total Revenue Projected
                                            </div>
                                        </div>

                                        <div className="text-center">
                                            <div className={`text-2xl font-bold ${theme.textColors.primary}`}>
                                                {formatCurrency(result.cashFlowProjection.reduce((sum, month) => sum + month.expenses, 0))}
                                            </div>
                                            <div className={`text-sm ${theme.textColors.secondary} mt-1`}>
                                                Total Expenses Projected
                                            </div>
                                        </div>

                                        <div className="text-center">
                                            <div className={`text-2xl font-bold ${theme.textColors.primary}`}>
                                                {formatCurrency(result.cashFlowProjection.reduce((sum, month) => sum + month.netCashFlow, 0))}
                                            </div>
                                            <div className={`text-sm ${theme.textColors.secondary} mt-1`}>
                                                Net Cash Flow
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={reset}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${theme.buttons.secondary} hover:scale-105`}
                    >
                        Reset Calculator
                    </button>
                </div>
            </div>
        </CalculatorWrapper>
    );
}
