'use client';

import React, { useState, useCallback, useEffect } from 'react';
import CalculatorWrapper from '@/components/shared/calculators/CalculatorWrapper';
import { CurrencyInput, NumberInput } from '@/components/shared/calculators/FormFields';
import { ResultCard } from '@/components/shared/calculators/ResultComponents';
import { calculateCompoundInterest, formatCurrency, formatPercentage } from '@/lib/utils/financial';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Sparkles, TrendingUp } from 'lucide-react';
import { theme } from '@/lib/theme';

interface CompoundData {
  year: number;
  principal: number;
  interest: number;
  total: number;
}

export default function CompoundInterestCalculator() {
    // Form inputs - keeping as strings for form fields
    const [principal, setPrincipal] = useState('10000');
    const [rate, setRate] = useState('7');
    const [time, setTime] = useState('30');
    const [monthlyContribution, setMonthlyContribution] = useState('500');

    const [data, setData] = useState<CompoundData[]>([]);
    const [results, setResults] = useState({
      finalAmount: 0,
      totalContributed: 0,
      totalInterest: 0
    });

    const calculateGrowth = useCallback(() => {
        const P = parseFloat(principal) || 0;
        const r = parseFloat(rate) || 0;
        const t = parseInt(time) || 0;
        const monthlyAdd = parseFloat(monthlyContribution) || 0;

        if (P < 0 || r < 0 || t < 0 || monthlyAdd < 0) return;

        const compoundData: CompoundData[] = [];
        let totalContributions = P;

        for (let year = 0; year <= t; year++) {
            let yearEndValue: number;

            if (year === 0) {
                yearEndValue = P;
                totalContributions = P;
            } else {
                // Calculate year-end value with monthly contributions
                const startValue = compoundData[year - 1]?.total || P;
                let runningTotal = startValue;
                
                for (let month = 1; month <= 12; month++) {
                    runningTotal *= (1 + r / 100 / 12);
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
            setResults({
              finalAmount: finalData.total,
              totalContributed: finalData.principal,
              totalInterest: finalData.interest
            });
        }
    }, [principal, rate, time, monthlyContribution]);

    useEffect(() => {
        calculateGrowth();
    }, [calculateGrowth]);

    const handleReset = () => {
        setPrincipal('10000');
        setRate('7');
        setTime('30');
        setMonthlyContribution('500');
    };

    // Generate insights based on calculations
    const generateInsights = () => {
        const insights = [];
        
        const rateNum = parseFloat(rate) || 0;
        const timeNum = parseInt(time) || 0;
        const monthlyContributionNum = parseFloat(monthlyContribution) || 0;
        const principalNum = parseFloat(principal) || 0;
        
        const effectiveReturn = results.totalContributed > 0 ? 
            ((results.finalAmount / results.totalContributed - 1) * 100) : 0;
        
        const interestMultiplier = results.totalContributed > 0 ? 
            (results.totalInterest / results.totalContributed) : 0;

        // High growth insight
        if (effectiveReturn > 200) {
            insights.push({
                type: 'success' as const,
                title: 'Excellent Growth Potential',
                message: `Your investments could grow by ${effectiveReturn.toFixed(0)}% over ${timeNum} years. The power of compound interest is working strongly in your favor!`
            });
        }

        // Time advantage insight
        if (timeNum >= 25) {
            insights.push({
                type: 'info' as const,
                title: 'Time Is Your Greatest Asset',
                message: `With ${timeNum} years of growth, you're giving compound interest maximum power. Each extra year of investing significantly increases your wealth.`
            });
        }

        // Regular contributions insight
        if (monthlyContributionNum > principalNum * 0.01) {
            insights.push({
                type: 'success' as const,
                title: 'Smart Contribution Strategy',
                message: `Your monthly contributions of ${formatCurrency(monthlyContributionNum)} will add ${formatCurrency(monthlyContributionNum * 12 * timeNum)} over time, significantly boosting your final amount.`
            });
        }

        // Low rate warning
        if (rateNum < 4) {
            insights.push({
                type: 'warning' as const,
                title: 'Consider Higher-Yield Investments',
                message: `At ${rateNum}% annual return, consider exploring diversified index funds or other investments that historically average 7-10% annually.`
            });
        }

        return insights;
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

    // Results formatting for the wrapper
    const calculatorResults = {
        primary: {
            label: 'Final Amount',
            value: results.finalAmount,
            format: 'currency' as const,
            variant: 'success' as const,
            description: `After ${time} years of ${rate}% annual growth`
        },
        secondary: [
            {
                label: 'Total Contributed',
                value: results.totalContributed,
                format: 'currency' as const,
                description: 'Your initial investment plus monthly contributions'
            },
            {
                label: 'Interest Earned',
                value: results.totalInterest,
                format: 'currency' as const,
                variant: 'success' as const,
                description: 'Pure profit from compound growth'
            },
            {
                label: 'Effective Return',
                value: results.totalContributed > 0 ? ((results.finalAmount / results.totalContributed - 1) * 100) : 0,
                format: 'percentage' as const,
                description: 'Total return on your investment'
            }
        ]
    };

    return (
        <CalculatorWrapper
            metadata={metadata}
            results={calculatorResults}
            insights={generateInsights()}
            onReset={handleReset}
        >
            <div className="space-y-6">
                {/* Investment Parameters */}
                <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-6`}>
                    <h4 className={`${theme.typography.heading5} ${theme.textColors.primary} mb-4`}>Investment Parameters</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CurrencyInput
                            id="principal"
                            label="Initial Investment"
                            value={principal}
                            onChange={setPrincipal}
                            min={0}
                            max={1000000}
                            step={100}
                            placeholder="Enter initial amount"
                        />

                        <CurrencyInput
                            id="monthlyContribution"
                            label="Monthly Contribution"
                            value={monthlyContribution}
                            onChange={setMonthlyContribution}
                            min={0}
                            max={10000}
                            step={25}
                            placeholder="Enter monthly amount"
                        />

                        <NumberInput
                            id="rate"
                            label="Annual Interest Rate (%)"
                            value={rate}
                            onChange={setRate}
                            min={0}
                            max={30}
                            step={0.1}
                            placeholder="Enter annual rate"
                        />

                        <NumberInput
                            id="time"
                            label="Investment Period (years)"
                            value={time}
                            onChange={setTime}
                            min={1}
                            max={50}
                            step={1}
                            placeholder="Enter number of years"
                        />
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
                            <ResultCard
                                icon={TrendingUp}
                                label="Effective Annual Return"
                                value={results.totalContributed > 0 ? ((results.finalAmount / results.totalContributed - 1) * 100) : 0}
                                format="percentage"
                                variant="info"
                            />
                            
                            <ResultCard
                                icon={Sparkles}
                                label="Interest Multiplier"
                                value={results.totalContributed > 0 ? (results.totalInterest / results.totalContributed) : 0}
                                format="number"
                                variant="success"
                            />
                            
                            <ResultCard
                                label="Years to Double"
                                value={parseFloat(rate) > 0 ? Math.round(72 / parseFloat(rate)) : 0}
                                format="number"
                                variant="warning"
                                description="Rule of 72"
                            />
                        </div>
                    </div>
                )}
            </div>
        </CalculatorWrapper>
    );
}
