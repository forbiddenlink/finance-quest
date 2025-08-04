'use client';

import React, { useState, useCallback, useEffect } from 'react';
import CalculatorWrapper from '@/components/shared/calculators/CalculatorWrapper';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Sparkles, TrendingUp } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { theme } from '@/lib/theme';

interface CompoundData {
  year: number;
  principal: number;
  interest: number;
  total: number;
}

export default function CompoundInterestCalculator() {
    // Form inputs
    const [principal, setPrincipal] = useState('10000');
    const [rate, setRate] = useState('7');
    const [time, setTime] = useState('30');
    const [monthlyContribution, setMonthlyContribution] = useState('500');

    const [data, setData] = useState<CompoundData[]>([]);
    const [totalContributed, setTotalContributed] = useState(0);
    const [totalInterest, setTotalInterest] = useState(0);
    const [finalAmount, setFinalAmount] = useState(0);

    const calculateCompoundInterest = useCallback(() => {
        const P = parseFloat(principal) || 0;
        const r = (parseFloat(rate) || 0) / 100;
        const t = parseInt(time) || 0;
        const monthlyAdd = parseFloat(monthlyContribution) || 0;

        if (P < 0 || r < 0 || t < 0 || monthlyAdd < 0) return;

        const compoundData: CompoundData[] = [];
        let totalContributions = P;

        for (let year = 0; year <= t; year++) {
            let yearEndValue: number;

            if (year === 0) {
                // Initial year - just the principal
                yearEndValue = P;
                totalContributions = P;
            } else {
                // For subsequent years, we need to account for monthly contributions
                // Start with previous year's value
                const startValue = compoundData[year - 1]?.total || P;
                
                // Add monthly contributions throughout the year with compound growth
                let runningTotal = startValue;
                for (let month = 1; month <= 12; month++) {
                    // Add interest for the month
                    runningTotal *= (1 + r / 12);
                    // Add monthly contribution at end of month
                    runningTotal += monthlyAdd;
                }
                
                yearEndValue = runningTotal;
                totalContributions = P + (monthlyAdd * 12 * year);
            }

            const interestEarned = yearEndValue - totalContributions;

            compoundData.push({
                year,
                principal: totalContributions,
                interest: interestEarned,
                total: yearEndValue
            });
        }

        setData(compoundData);
        
        if (compoundData.length > 0) {
            const finalData = compoundData[compoundData.length - 1];
            setFinalAmount(finalData.total);
            setTotalContributed(finalData.principal);
            setTotalInterest(finalData.interest);
        }
    }, [principal, rate, time, monthlyContribution]);

    useEffect(() => {
        calculateCompoundInterest();
    }, [calculateCompoundInterest]);

    const handleReset = () => {
        setPrincipal('10000');
        setRate('7');
        setTime('30');
        setMonthlyContribution('500');
    };

    // Calculator metadata
    const metadata = {
        id: 'compound-interest-calculator',
        title: 'Compound Interest Calculator',
        description: 'Calculate the power of compound interest with regular contributions over time',
        category: 'basic' as const,
        icon: Sparkles,
        tags: ['investing', 'compound interest', 'growth', 'savings', 'retirement'],
        educationalNotes: [
            {
                title: 'The Power of Compound Interest',
                content: 'Compound interest is earning interest on both your original investment and previously earned interest. Albert Einstein allegedly called it "the eighth wonder of the world." The key is time - starting early gives your money more time to grow exponentially.',
                tips: [
                    'Start investing as early as possible, even with small amounts',
                    'Consistency matters more than timing the market',
                    'Higher interest rates and longer time periods dramatically increase returns',
                    'Regular contributions can significantly boost your final amount'
                ]
            },
            {
                title: 'Investment Strategy Insights',
                content: 'The "Rule of 72" provides a quick way to estimate doubling time: divide 72 by your annual return rate. At 7%, your money doubles approximately every 10.3 years.',
                tips: [
                    'Diversify investments to manage risk while seeking growth',
                    'Consider tax-advantaged accounts like 401(k)s and IRAs',
                    'Automate contributions to ensure consistency',
                    'Review and adjust your strategy regularly as life changes'
                ]
            }
        ]
    };

    // Results formatting
    const results = {
        primary: {
            label: 'Final Amount',
            value: finalAmount,
            format: 'currency' as const
        },
        secondary: [
            {
                label: 'Total Contributed',
                value: totalContributed,
                format: 'currency' as const
            },
            {
                label: 'Interest Earned',
                value: totalInterest,
                format: 'currency' as const
            },
            {
                label: 'Interest Rate of Return',
                value: totalInterest > 0 ? ((totalInterest / totalContributed) * 100) : 0,
                format: 'percentage' as const
            }
        ]
    };

    return (
        <CalculatorWrapper
            metadata={metadata}
            results={results}
            onReset={handleReset}
        >
            <div className="space-y-6">
                {/* Investment Parameters */}
                <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-6`}>
                    <h4 className={`${theme.typography.heading5} ${theme.textColors.primary} mb-4`}>Investment Parameters</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="principal" className={`${theme.textColors.primary}`}>
                                Initial Investment
                            </Label>
                            <div className="relative">
                                <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted}`}>$</span>
                                <input
                                    id="principal"
                                    type="number"
                                    value={principal}
                                    onChange={(e) => setPrincipal(e.target.value)}
                                    placeholder="Enter initial amount"
                                    min="0"
                                    max="1000000"
                                    step="100"
                                    className={`w-full pl-8 pr-4 py-3 border ${theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-yellow-500 focus:${theme.status.warning.border}`}
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="monthlyContribution" className={`${theme.textColors.primary}`}>
                                Monthly Contribution
                            </Label>
                            <div className="relative">
                                <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted}`}>$</span>
                                <input
                                    id="monthlyContribution"
                                    type="number"
                                    value={monthlyContribution}
                                    onChange={(e) => setMonthlyContribution(e.target.value)}
                                    placeholder="Enter monthly amount"
                                    min="0"
                                    max="10000"
                                    step="25"
                                    className={`w-full pl-8 pr-4 py-3 border ${theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-yellow-500 focus:${theme.status.warning.border}`}
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="rate" className={`${theme.textColors.primary}`}>
                                Annual Interest Rate (%)
                            </Label>
                            <input
                                id="rate"
                                type="number"
                                value={rate}
                                onChange={(e) => setRate(e.target.value)}
                                placeholder="Enter annual rate"
                                min="0"
                                max="30"
                                step="0.1"
                                className={`w-full px-4 py-3 border ${theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-yellow-500 focus:${theme.status.warning.border}`}
                            />
                        </div>

                        <div>
                            <Label htmlFor="time" className={`${theme.textColors.primary}`}>
                                Investment Period (years)
                            </Label>
                            <input
                                id="time"
                                type="number"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                placeholder="Enter number of years"
                                min="1"
                                max="50"
                                step="1"
                                className={`w-full px-4 py-3 border ${theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-yellow-500 focus:${theme.status.warning.border}`}
                            />
                        </div>
                    </div>
                </div>

                {/* Growth Visualization */}
                {data.length > 0 && (
                    <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-6`}>
                        <h4 className={`${theme.typography.heading5} ${theme.textColors.primary} mb-4`}>Investment Growth Over Time</h4>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.slate[700]} />
                                    <XAxis 
                                        dataKey="year" 
                                        stroke={theme.colors.slate[400]}
                                        tick={{ fill: theme.colors.slate[400] }}
                                    />
                                    <YAxis 
                                        stroke={theme.colors.slate[400]}
                                        tick={{ fill: theme.colors.slate[400] }}
                                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                                    />
                                    <Tooltip 
                                        contentStyle={{
                                            backgroundColor: theme.colors.slate[800],
                                            border: `1px solid ${theme.colors.slate[700]}`,
                                            borderRadius: '8px',
                                            color: theme.colors.slate[100]
                                        }}
                                        formatter={(value: number, name: string) => [
                                            `$${value.toLocaleString()}`,
                                            name === 'principal' ? 'Total Contributed' : 
                                            name === 'interest' ? 'Interest Earned' : 'Total Value'
                                        ]}
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="principal" 
                                        stroke={theme.colors.blue[400]} 
                                        strokeWidth={2}
                                        name="principal"
                                    />
                                    <Line 
                                        type="monotone" 
                                        dataKey="total" 
                                        stroke={theme.colors.emerald[400]} 
                                        strokeWidth={3}
                                        name="total"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                        
                        {/* Key Insights */}
                        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className={`${theme.status.info.bg} border ${theme.status.info.border} rounded-lg p-4 text-center`}>
                                <TrendingUp className={`w-6 h-6 ${theme.status.info.text} mx-auto mb-2`} />
                                <div className={`text-sm ${theme.status.info.text} mb-1`}>Effective Annual Return</div>
                                <div className={`text-lg font-bold ${theme.textColors.primary}`}>
                                    {totalContributed > 0 ? ((finalAmount / totalContributed - 1) * 100).toFixed(1) : 0}%
                                </div>
                            </div>
                            
                            <div className={`${theme.status.success.bg} border ${theme.status.success.border} rounded-lg p-4 text-center`}>
                                <Sparkles className={`w-6 h-6 ${theme.status.success.text} mx-auto mb-2`} />
                                <div className={`text-sm ${theme.status.success.text} mb-1`}>Interest Multiplier</div>
                                <div className={`text-lg font-bold ${theme.textColors.primary}`}>
                                    {totalContributed > 0 ? (totalInterest / totalContributed).toFixed(1) : 0}x
                                </div>
                            </div>
                            
                            <div className={`${theme.status.warning.bg} border ${theme.status.warning.border} rounded-lg p-4 text-center`}>
                                <div className={`text-sm ${theme.status.warning.text} mb-1`}>Years to Double</div>
                                <div className={`text-lg font-bold ${theme.textColors.primary}`}>
                                    {parseFloat(rate) > 0 ? Math.round(72 / parseFloat(rate)) : 0} years
                                </div>
                                <div className={`text-xs ${theme.textColors.muted}`}>Rule of 72</div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </CalculatorWrapper>
    );
}
