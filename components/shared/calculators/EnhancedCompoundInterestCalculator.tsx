'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import CalculatorWrapper, { CalculatorMetadata } from './CalculatorWrapper';
import { CurrencyInput, NumberInput, PercentageInput } from './FormFields';
import { formatCurrency } from '@/lib/utils/financial';
import { AreaChart, MultiLineChart, BarChart } from '@/components/shared/charts/ProfessionalCharts';
import { useLearningAnalytics } from '@/lib/algorithms/learningAnalytics';
import { Calculator, Brain, Lightbulb, Target } from 'lucide-react';
import { theme } from '@/lib/theme';
import { useProgressStore } from '@/lib/store/progressStore';

interface CompoundInterestValues {
    principal: string;
    monthlyContribution: string;
    annualRate: string;
    years: string;
    compoundingFrequency: string;
}

interface CompoundInterestResult {
    finalAmount: number;
    totalContributions: number;
    totalInterest: number;
    effectiveRate: number;
    monthlyData: Array<{
        month: number;
        year: number;
        principal: number;
        interest: number;
        total: number;
    }>;
}

export default function EnhancedCompoundInterestCalculator() {
    const { recordCalculatorUsage } = useProgressStore();
    const learningAnalytics = useLearningAnalytics();

    const [values, setValues] = useState<CompoundInterestValues>({
        principal: '10000',
        monthlyContribution: '500',
        annualRate: '7',
        years: '10',
        compoundingFrequency: '12'
    });

    const updateField = useCallback((field: keyof CompoundInterestValues, value: string) => {
        setValues(prev => ({ ...prev, [field]: value }));
    }, []);

    useEffect(() => {
        recordCalculatorUsage('enhanced-compound-interest-calculator');
    }, [recordCalculatorUsage]);

    // Enhanced calculation with detailed monthly breakdown
    const result = useMemo((): CompoundInterestResult | null => {
        const principal = parseFloat(values.principal) || 0;
        const monthlyContribution = parseFloat(values.monthlyContribution) || 0;
        const annualRate = parseFloat(values.annualRate) || 0;
        const years = parseInt(values.years) || 0;

        if (principal <= 0 || years <= 0 || annualRate <= 0) return null;

        const monthlyRate = annualRate / 100 / 12;
        const totalMonths = years * 12;

        let currentAmount = principal;
        const monthlyData = [];

        for (let month = 1; month <= totalMonths; month++) {
            // Calculate interest earned this month
            const interestEarned = currentAmount * monthlyRate;

            // Add monthly contribution and interest
            currentAmount += interestEarned + monthlyContribution;

            const totalContributedSoFar = principal + (monthlyContribution * month);
            const totalInterestSoFar = currentAmount - totalContributedSoFar;

            monthlyData.push({
                month,
                year: Math.ceil(month / 12),
                principal: totalContributedSoFar,
                interest: totalInterestSoFar,
                total: currentAmount
            });
        }

        const finalAmount = currentAmount;
        const totalContributions = principal + (monthlyContribution * totalMonths);
        const totalInterest = finalAmount - totalContributions;
        const effectiveRate = totalContributions > 0 ?
            (Math.pow(finalAmount / totalContributions, 1 / years) - 1) * 100 : 0;

        return {
            finalAmount,
            totalContributions,
            totalInterest,
            effectiveRate,
            monthlyData
        };
    }, [values]);

    const reset = useCallback(() => {
        setValues({
            principal: '10000',
            monthlyContribution: '500',
            annualRate: '7',
            years: '10',
            compoundingFrequency: '12'
        });
    }, []);

    // Generate insights based on calculations
    const insights = useMemo(() => {
        if (!result) return [];

        const insights = [];
        const { totalContributions, totalInterest, effectiveRate } = result;
        const years = parseInt(values.years) || 0;
        const annualRate = parseFloat(values.annualRate) || 0;

        // Interest vs contributions ratio
        const interestRatio = totalContributions > 0 ? (totalInterest / totalContributions) * 100 : 0;

        if (interestRatio > 100) {
            insights.push({
                type: 'success' as const,
                title: 'Compound Interest Power',
                message: `Interest earned (${formatCurrency(totalInterest)}) exceeds your total contributions! This is the magic of compound growth.`
            });
        }

        if (years >= 20 && annualRate >= 7) {
            insights.push({
                type: 'success' as const,
                title: 'Long-term Wealth Building',
                message: `Your long-term approach with ${years} years gives compound interest maximum power to work.`
            });
        }

        if (effectiveRate > annualRate) {
            insights.push({
                type: 'info' as const,
                title: 'Effective vs Nominal Rate',
                message: `Your effective annual return (${effectiveRate.toFixed(2)}%) is higher than the nominal rate due to regular contributions.`
            });
        }

        const monthlyContribution = parseFloat(values.monthlyContribution) || 0;
        if (monthlyContribution > 0) {
            const contributionImpact = (monthlyContribution * years * 12) / totalContributions * 100;
            if (contributionImpact > 50) {
                insights.push({
                    type: 'info' as const,
                    title: 'Contribution Impact',
                    message: `Regular monthly contributions make up ${contributionImpact.toFixed(1)}% of your wealth building strategy.`
                });
            }
        }

        return insights;
    }, [result, values]);

    // Generate chart data for professional visualization
    const chartData = useMemo(() => {
        if (!result) return { yearlyData: [], contributionBreakdown: [], growthProjection: [] };

        // Yearly aggregated data for area chart
        const yearlyData = [];
        const years = parseInt(values.years) || 0;

        for (let year = 1; year <= years; year++) {
            const yearEndData = result.monthlyData.find(d => d.month === year * 12);
            if (yearEndData) {
                yearlyData.push({
                    x: new Date(2024 + year - 1, 11, 31), // Year end
                    y: yearEndData.total
                });
            }
        }

        // Contribution vs Interest breakdown for bar chart
        const contributionBreakdown = [
            {
                category: 'Your Contributions',
                value: result.totalContributions,
                color: theme.colors.blue[500]
            },
            {
                category: 'Interest Earned',
                value: result.totalInterest,
                color: theme.colors.emerald[500]
            }
        ];

        // Multi-line growth projection
        const growthProjection = [
            {
                name: 'Total Value',
                data: yearlyData,
                color: theme.colors.blue[500]
            },
            {
                name: 'Contributions Only',
                data: yearlyData.map((d, index) => ({
                    x: d.x,
                    y: parseFloat(values.principal) + (parseFloat(values.monthlyContribution) * 12 * (index + 1))
                })),
                color: theme.colors.slate[400]
            }
        ];

        return { yearlyData, contributionBreakdown, growthProjection };
    }, [result, values]);

    const metadata: CalculatorMetadata = {
        id: 'enhanced-compound-interest-calculator',
        title: 'AI-Enhanced Compound Interest Calculator',
        description: 'Professional compound interest calculator with advanced visualizations and AI insights',
        category: 'intermediate',
        tags: ['compound interest', 'investing', 'wealth building', 'retirement planning']
    };

    const calculatorResults = result ? {
        primary: {
            label: 'Final Amount',
            value: formatCurrency(result.finalAmount),
            helpText: 'Total value after compound growth'
        },
        secondary: [
            {
                label: 'Total Contributions',
                value: formatCurrency(result.totalContributions)
            },
            {
                label: 'Interest Earned',
                value: formatCurrency(result.totalInterest)
            },
            {
                label: 'Effective Annual Return',
                value: `${result.effectiveRate.toFixed(2)}%`
            }
        ]
    } : undefined;

    return (
        <CalculatorWrapper
            metadata={metadata}
            results={calculatorResults}
            insights={insights}
            onReset={reset}
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Input Controls */}
                <div className="space-y-6">
                    <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
                        <h3 className={`text-lg font-semibold mb-4 ${theme.textColors.primary} flex items-center`}>
                            <Calculator className="mr-2 w-5 h-5" />
                            Investment Parameters
                        </h3>
                        <div className="space-y-4">
                            <CurrencyInput
                                id="principal"
                                label="Initial Investment"
                                value={values.principal}
                                onChange={(value) => updateField('principal', value)}
                                helpText="Starting amount to invest"
                            />
                            <CurrencyInput
                                id="monthlyContribution"
                                label="Monthly Contribution"
                                value={values.monthlyContribution}
                                onChange={(value) => updateField('monthlyContribution', value)}
                                helpText="Amount added each month"
                            />
                            <PercentageInput
                                id="annualRate"
                                label="Annual Interest Rate"
                                value={values.annualRate}
                                onChange={(value) => updateField('annualRate', value)}
                                helpText="Expected annual return (e.g., 7% for S&P 500 average)"
                            />
                            <NumberInput
                                id="years"
                                label="Investment Period (Years)"
                                value={values.years}
                                onChange={(value) => updateField('years', value)}
                                min={1}
                                max={50}
                                helpText="How long you plan to invest"
                            />
                        </div>
                    </div>

                    {/* AI Learning Insights */}
                    {learningAnalytics && (
                        <div className={`${theme.backgrounds.glass} border ${theme.borderColors.accent} rounded-lg p-6`}>
                            <h3 className={`text-lg font-semibold mb-4 ${theme.textColors.primary} flex items-center`}>
                                <Brain className="mr-2 w-5 h-5 text-amber-400" />
                                AI Learning Progress
                            </h3>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className={`text-sm ${theme.textColors.secondary}`}>Compound Interest Mastery</span>
                                    <span className={`text-lg font-bold ${theme.textColors.primary}`}>
                                        {(learningAnalytics.predictedMastery * 100).toFixed(1)}%
                                    </span>
                                </div>

                                {learningAnalytics.recommendedPath.length > 0 && (
                                    <div className="bg-amber-500/15 border border-amber-500/30 rounded-lg p-3">
                                        <div className="text-amber-400 text-sm font-medium mb-2 flex items-center">
                                            <Lightbulb className="w-4 h-4 mr-1" />
                                            Next Learning Steps
                                        </div>
                                        <ul className="text-xs text-amber-300 space-y-1">
                                            {learningAnalytics.recommendedPath.slice(0, 3).map((step, index) => (
                                                <li key={index}>• {step}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Results and Visualizations */}
                <div className="space-y-6">

                    {/* Key Results Summary */}
                    {result && (
                        <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
                            <h3 className={`text-lg font-semibold mb-4 ${theme.textColors.primary} flex items-center`}>
                                <Target className="mr-2 w-5 h-5" />
                                Investment Results
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                                    <div className={`text-2xl font-bold ${theme.textColors.primary} mb-1`}>
                                        {formatCurrency(result.finalAmount)}
                                    </div>
                                    <div className={`text-sm ${theme.textColors.secondary}`}>Final Amount</div>
                                </div>
                                <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                                    <div className={`text-2xl font-bold text-emerald-400 mb-1`}>
                                        {formatCurrency(result.totalInterest)}
                                    </div>
                                    <div className={`text-sm ${theme.textColors.secondary}`}>Interest Earned</div>
                                </div>
                                <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                                    <div className={`text-2xl font-bold text-blue-400 mb-1`}>
                                        {formatCurrency(result.totalContributions)}
                                    </div>
                                    <div className={`text-sm ${theme.textColors.secondary}`}>Your Contributions</div>
                                </div>
                                <div className="text-center p-4 bg-slate-800/50 rounded-lg">
                                    <div className={`text-2xl font-bold text-amber-400 mb-1`}>
                                        {result.effectiveRate.toFixed(2)}%
                                    </div>
                                    <div className={`text-sm ${theme.textColors.secondary}`}>Effective Return</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Professional Growth Chart */}
                    {result && chartData.yearlyData.length > 0 && (
                        <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
                            <h4 className={`text-lg font-semibold mb-4 ${theme.textColors.primary}`}>Investment Growth Over Time</h4>
                            <AreaChart
                                data={chartData.yearlyData}
                                title="Portfolio Value Growth"
                                color={theme.colors.blue[500]}
                                height={300}
                                fillGradient={true}
                            />
                        </div>
                    )}

                    {/* Contribution vs Interest Breakdown */}
                    {result && chartData.contributionBreakdown.length > 0 && (
                        <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
                            <h4 className={`text-lg font-semibold mb-4 ${theme.textColors.primary}`}>Wealth Building Breakdown</h4>
                            <BarChart
                                data={chartData.contributionBreakdown}
                                title="Your Money vs Compound Interest"
                                height={250}
                            />
                        </div>
                    )}

                    {/* Professional Multi-Line Projection */}
                    {result && chartData.growthProjection.length > 0 && (
                        <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
                            <h4 className={`text-lg font-semibold mb-4 ${theme.textColors.primary}`}>Growth Comparison</h4>
                            <MultiLineChart
                                series={chartData.growthProjection}
                                title="Compound Interest vs Simple Contributions"
                                yAxisFormatter={formatCurrency}
                                height={300}
                            />
                        </div>
                    )}
                </div>
            </div>
        </CalculatorWrapper>
    );
}
