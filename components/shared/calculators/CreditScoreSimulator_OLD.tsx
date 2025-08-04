'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Target, CreditCard, Calendar } from 'lucide-react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';

interface CreditFactor {
    name: string;
    current: number;
    target: number;
    weight: number;
    impact: number;
}

interface CreditScoreProjection {
    month: number;
    score: number;
    description: string;
}

export default function CreditScoreSimulator() {
    // Current credit profile
    const [paymentHistory, setPaymentHistory] = useState<string>('95'); // % on-time payments
    const [creditUtilization, setCreditUtilization] = useState<string>('30'); // % utilization
    const [creditAge, setCreditAge] = useState<string>('3'); // years
    const [creditMix, setCreditMix] = useState<string>('3'); // number of account types
    const [newCredit, setNewCredit] = useState<string>('2'); // inquiries in last 2 years
    const [currentScore, setCurrentScore] = useState<number>(650);

    // Target improvements
    const [targetPaymentHistory, setTargetPaymentHistory] = useState<string>('100');
    const [targetUtilization, setTargetUtilization] = useState<string>('10');
    const [targetCreditAge, setTargetCreditAge] = useState<string>('5');
    const [targetCreditMix, setTargetCreditMix] = useState<string>('4');
    const [targetNewCredit, setTargetNewCredit] = useState<string>('0');

    // Results
    const [projectedScore, setProjectedScore] = useState<number>(650);
    const [scoreIncrease, setScoreIncrease] = useState<number>(0);
    const [timeToTarget, setTimeToTarget] = useState<number>(12);
    const [creditFactors, setCreditFactors] = useState<CreditFactor[]>([]);
    const [monthlyProjections, setMonthlyProjections] = useState<CreditScoreProjection[]>([]);

    // Track calculator usage
    const recordCalculatorUsage = useProgressStore((state) => state.recordCalculatorUsage);

    useEffect(() => {
        recordCalculatorUsage('credit-score-simulator');
    }, [recordCalculatorUsage]);

    const calculateCreditScore = useCallback((
        payment: number,
        utilization: number,
        age: number,
        mix: number,
        inquiries: number
    ): number => {
        let score = 300; // Base FICO score

        // Payment History (35% weight)
        score += (payment / 100) * 245;

        // Credit Utilization (30% weight)
        const utilizationImpact = Math.max(0, (100 - utilization) / 100) * 210;
        score += utilizationImpact;

        // Length of Credit History (15% weight)
        const ageImpact = Math.min(age / 10, 1) * 105;
        score += ageImpact;

        // Credit Mix (10% weight)
        const mixImpact = Math.min(mix / 5, 1) * 70;
        score += mixImpact;

        // New Credit (10% weight)
        const inquiryImpact = Math.max(0, (6 - inquiries) / 6) * 70;
        score += inquiryImpact;

        return Math.round(Math.min(850, Math.max(300, score)));
    }, []);

    const calculateProjections = useCallback(() => {
        const currentScoreCalc = calculateCreditScore(
            parseFloat(paymentHistory),
            parseFloat(creditUtilization),
            parseFloat(creditAge),
            parseFloat(creditMix),
            parseFloat(newCredit)
        );

        const targetScoreCalc = calculateCreditScore(
            parseFloat(targetPaymentHistory),
            parseFloat(targetUtilization),
            parseFloat(targetCreditAge),
            parseFloat(targetCreditMix),
            parseFloat(targetNewCredit)
        );

        setCurrentScore(currentScoreCalc);
        setProjectedScore(targetScoreCalc);
        setScoreIncrease(targetScoreCalc - currentScoreCalc);

        // Calculate time to reach target
        const scoreDiff = targetScoreCalc - currentScoreCalc;
        const timeMonths = Math.max(1, Math.ceil(scoreDiff / 10)); // ~10 points per month improvement
        setTimeToTarget(timeMonths);

        // Calculate factor impacts
        const factors: CreditFactor[] = [
            {
                name: 'Payment History',
                current: parseFloat(paymentHistory),
                target: parseFloat(targetPaymentHistory),
                weight: 35,
                impact: (parseFloat(targetPaymentHistory) - parseFloat(paymentHistory)) * 2.45
            },
            {
                name: 'Credit Utilization',
                current: parseFloat(creditUtilization),
                target: parseFloat(targetUtilization),
                weight: 30,
                impact: (parseFloat(creditUtilization) - parseFloat(targetUtilization)) * 2.1
            },
            {
                name: 'Credit Age',
                current: parseFloat(creditAge),
                target: parseFloat(targetCreditAge),
                weight: 15,
                impact: (parseFloat(targetCreditAge) - parseFloat(creditAge)) * 10.5
            },
            {
                name: 'Credit Mix',
                current: parseFloat(creditMix),
                target: parseFloat(targetCreditMix),
                weight: 10,
                impact: (parseFloat(targetCreditMix) - parseFloat(creditMix)) * 14
            },
            {
                name: 'New Credit',
                current: parseFloat(newCredit),
                target: parseFloat(targetNewCredit),
                weight: 10,
                impact: (parseFloat(newCredit) - parseFloat(targetNewCredit)) * 11.67
            }
        ];

        setCreditFactors(factors);

        // Monthly projections
        const projections: CreditScoreProjection[] = [];
        for (let month = 0; month <= timeMonths; month++) {
            const progress = month / timeMonths;
            const monthScore = currentScoreCalc + (scoreDiff * progress);

            let description = 'Starting point';
            if (month === 3) description = 'Pay down high balances';
            if (month === 6) description = 'Remove negative marks';
            if (month === 9) description = 'Optimize credit mix';
            if (month === timeMonths) description = 'Target achieved!';

            projections.push({
                month,
                score: Math.round(monthScore),
                description
            });
        }

        setMonthlyProjections(projections);
    }, [
        paymentHistory, creditUtilization, creditAge, creditMix, newCredit,
        targetPaymentHistory, targetUtilization, targetCreditAge, targetCreditMix, targetNewCredit,
        calculateCreditScore
    ]);

    useEffect(() => {
        calculateProjections();
    }, [calculateProjections]);

    const getScoreColor = (score: number) => {
        if (score >= 800) return theme.status.success.text;
        if (score >= 740) return theme.status.info.text;
        if (score >= 670) return theme.status.warning.text;
        if (score >= 580) return theme.status.warning.text;
        return theme.status.error.text;
    };

    const getScoreGrade = (score: number) => {
        if (score >= 800) return 'Exceptional';
        if (score >= 740) return 'Very Good';
        if (score >= 670) return 'Good';
        if (score >= 580) return 'Fair';
        return 'Poor';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
            {/* Header */}
            <div className={`${theme.backgrounds.glass} backdrop-blur-xl border-b ${theme.borderColors.primary}`}>
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="text-center">
                        <h2 className={`${theme.typography.heading2} ${theme.textColors.primary} mb-2 flex items-center justify-center gap-3`}>
                            <CreditCard className={`w-8 h-8 ${theme.textColors.primary}`} />
                            Credit Score Simulator
                        </h2>
                        <p className={`${theme.textColors.secondary}`}>
                            Model credit score improvements and create your optimization strategy
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Input Controls */}
                    <div className="xl:col-span-1 space-y-6">
                        {/* Current Credit Profile */}
                        <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}/5 backdrop-blur-xl border ${theme.borderColors.muted}/10 rounded-xl shadow-lg p-6`}>
                            <h3 className={`${theme.typography.heading4} ${theme.textColors.primary} mb-4`}>Current Credit Profile</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                                        Payment History (35% weight)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={paymentHistory}
                                            onChange={(e) => setPaymentHistory(e.target.value)}
                                            min="0"
                                            max="100"
                                            className={`w-full px-4 py-3 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-md ${theme.textColors.primary} placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
                                        />
                                        <span className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted}`}>%</span>
                                    </div>
                                    <p className={`text-xs ${theme.textColors.muted} mt-1`}>% of payments made on time</p>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                                        Credit Utilization (30% weight)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={creditUtilization}
                                            onChange={(e) => setCreditUtilization(e.target.value)}
                                            min="0"
                                            max="100"
                                            className={`w-full px-4 py-3 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-md ${theme.textColors.primary} placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
                                        />
                                        <span className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted}`}>%</span>
                                    </div>
                                    <p className={`text-xs ${theme.textColors.muted} mt-1`}>% of credit limits used</p>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                                        Credit History Length (15% weight)
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={creditAge}
                                            onChange={(e) => setCreditAge(e.target.value)}
                                            min="0"
                                            max="30"
                                            step="0.5"
                                            className={`w-full px-4 py-3 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-md ${theme.textColors.primary} placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
                                        />
                                        <span className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted}`}>years</span>
                                    </div>
                                    <p className={`text-xs ${theme.textColors.muted} mt-1`}>Average age of accounts</p>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                                        Credit Mix (10% weight)
                                    </label>
                                    <select
                                        value={creditMix}
                                        onChange={(e) => setCreditMix(e.target.value)}
                                        className={`w-full px-4 py-3 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-md ${theme.textColors.primary} focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
                                    >
                                        <option value="1">1 type (credit cards only)</option>
                                        <option value="2">2 types (cards + loan)</option>
                                        <option value="3">3 types (cards + auto + mortgage)</option>
                                        <option value="4">4+ types (diverse mix)</option>
                                    </select>
                                    <p className={`text-xs ${theme.textColors.muted} mt-1`}>Types of credit accounts</p>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                                        New Credit (10% weight)
                                    </label>
                                    <input
                                        type="number"
                                        value={newCredit}
                                        onChange={(e) => setNewCredit(e.target.value)}
                                        min="0"
                                        max="10"
                                        className={`w-full px-4 py-3 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-md ${theme.textColors.primary} placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-transparent`}
                                    />
                                    <p className={`text-xs ${theme.textColors.muted} mt-1`}>Hard inquiries in last 2 years</p>
                                </div>
                            </div>
                        </div>

                        {/* Target Profile */}
                        <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}/5 backdrop-blur-xl border ${theme.borderColors.muted}/10 rounded-xl shadow-lg p-6`}>
                            <h3 className={`${theme.typography.heading4} ${theme.textColors.primary} mb-4`}>Target Improvements</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>Payment History Goal</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={targetPaymentHistory}
                                            onChange={(e) => setTargetPaymentHistory(e.target.value)}
                                            min="0"
                                            max="100"
                                            className={`w-full px-4 py-3 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-md ${theme.textColors.primary} placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all`}
                                        />
                                        <span className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted}`}>%</span>
                                    </div>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>Target Utilization</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={targetUtilization}
                                            onChange={(e) => setTargetUtilization(e.target.value)}
                                            min="0"
                                            max="100"
                                            className={`w-full px-4 py-3 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-md ${theme.textColors.primary} placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all`}
                                        />
                                        <span className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted}`}>%</span>
                                    </div>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>Credit Age Goal</label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={targetCreditAge}
                                            onChange={(e) => setTargetCreditAge(e.target.value)}
                                            min="0"
                                            max="30"
                                            step="0.5"
                                            className={`w-full px-4 py-3 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-md ${theme.textColors.primary} placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all`}
                                        />
                                        <span className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted}`}>years</span>
                                    </div>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>Target Credit Mix</label>
                                    <select
                                        value={targetCreditMix}
                                        onChange={(e) => setTargetCreditMix(e.target.value)}
                                        className={`w-full px-4 py-3 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-md ${theme.textColors.primary} focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all`}
                                    >
                                        <option value="1">1 type</option>
                                        <option value="2">2 types</option>
                                        <option value="3">3 types</option>
                                        <option value="4">4+ types</option>
                                    </select>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>Target Inquiries</label>
                                    <input
                                        type="number"
                                        value={targetNewCredit}
                                        onChange={(e) => setTargetNewCredit(e.target.value)}
                                        min="0"
                                        max="10"
                                        className={`w-full px-4 py-3 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-md ${theme.textColors.primary} placeholder-gray-400 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all`}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results and Charts */}
                    <div className="xl:col-span-2 space-y-8">
                        {/* Score Comparison */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}/5 backdrop-blur-xl border ${theme.borderColors.muted}/10 rounded-xl shadow-lg p-6 text-center`}>
                                <Target className={`w-8 h-8 mx-auto mb-3 ${theme.status.warning.text}`} />
                                <h3 className={`${theme.typography.heading4} ${theme.textColors.primary}`}>Current Score</h3>
                                <p className={`${theme.typography.heading2} ${getScoreColor(currentScore)}`}>{currentScore}</p>
                                <p className={`text-sm ${theme.textColors.secondary}`}>{getScoreGrade(currentScore)}</p>
                            </div>

                            <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}/5 backdrop-blur-xl border ${theme.borderColors.muted}/10 rounded-xl shadow-lg p-6 text-center`}>
                                <TrendingUp className={`w-8 h-8 mx-auto mb-3 ${theme.textColors.primary}`} />
                                <h3 className={`${theme.typography.heading4} ${theme.textColors.primary}`}>Projected Score</h3>
                                <p className={`${theme.typography.heading2} ${getScoreColor(projectedScore)}`}>{projectedScore}</p>
                                <p className={`text-sm ${theme.textColors.secondary}`}>{getScoreGrade(projectedScore)}</p>
                            </div>

                            <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}/5 backdrop-blur-xl border ${theme.borderColors.muted}/10 rounded-xl shadow-lg p-6 text-center`}>
                                <Calendar className={`w-8 h-8 mx-auto mb-3 ${theme.textColors.muted}`} />
                                <h3 className={`${theme.typography.heading4} ${theme.textColors.primary}`}>Time to Goal</h3>
                                <p className={`${theme.typography.heading2} ${theme.textColors.secondary}`}>{timeToTarget}</p>
                                <p className={`text-sm ${theme.textColors.secondary}`}>months</p>
                            </div>
                        </div>

                        {/* Score Improvement Chart */}
                        <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}/5 backdrop-blur-xl border ${theme.borderColors.muted}/10 rounded-xl shadow-lg p-6`}>
                            <h3 className={`${theme.typography.heading4} ${theme.textColors.primary} mb-4`}>Credit Score Projection</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={monthlyProjections}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                        <XAxis
                                            dataKey="month"
                                            stroke="#9CA3AF"
                                            label={{ value: 'Months', position: 'insideBottom', offset: -5 }}
                                            tick={{ fill: "#94a3b8" }}
                                        />
                                        <YAxis
                                            stroke="#9CA3AF"
                                            domain={[300, 850]}
                                            label={{ value: 'Credit Score', angle: -90, position: 'insideLeft' }}
                                            tick={{ fill: "#94a3b8" }}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#1F2937',
                                                border: '1px solid #374151',
                                                borderRadius: '8px'
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="score"
                                            stroke="#60a5fa"
                                            strokeWidth={3}
                                            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Factor Impact Analysis */}
                        <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}/5 backdrop-blur-xl border ${theme.borderColors.muted}/10 rounded-xl shadow-lg p-6`}>
                            <h3 className={`${theme.typography.heading4} ${theme.textColors.primary} mb-4`}>Impact by Factor</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={creditFactors}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                        <XAxis
                                            dataKey="name"
                                            stroke="#9CA3AF"
                                            angle={-45}
                                            textAnchor="end"
                                            height={80}
                                            tick={{ fill: "#94a3b8" }}
                                        />
                                        <YAxis
                                            stroke="#9CA3AF"
                                            label={{ value: 'Point Impact', angle: -90, position: 'insideLeft' }}
                                            tick={{ fill: "#94a3b8" }}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#1F2937',
                                                border: '1px solid #374151',
                                                borderRadius: '8px'
                                            }}
                                        />
                                        <Bar dataKey="impact" fill="#8b5cf6" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Steps */}
                <div className={`mt-8 ${theme.backgrounds.glass} border ${theme.borderColors.primary}/5 backdrop-blur-xl border ${theme.borderColors.muted}/10 rounded-xl shadow-lg p-6`}>
                    <h3 className={`${theme.typography.heading4} ${theme.textColors.primary} mb-4`}>🎯 Optimization Strategy</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {scoreIncrease > 0 && (
                            <>
                                {parseFloat(targetUtilization) < parseFloat(creditUtilization) && (
                                    <div className={`${theme.status.info.bg}/20 border ${theme.borderColors.primary}/30 rounded-lg p-4`}>
                                        <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>💳 Reduce Credit Utilization</h4>
                                        <p className={`text-sm ${theme.textColors.secondary}`}>
                                            Pay down balances to {targetUtilization}% utilization. This is often the fastest way to improve your score.
                                        </p>
                                    </div>
                                )}

                                {parseFloat(targetPaymentHistory) > parseFloat(paymentHistory) && (
                                    <div className={`${theme.status.success.bg}/20 border ${theme.status.success.border}/30 rounded-lg p-4`}>
                                        <h4 className={`font-semibold ${theme.status.success.text} mb-2`}>✅ Perfect Payment History</h4>
                                        <p className={`text-sm ${theme.textColors.secondary}`}>
                                            Set up automatic payments to ensure 100% on-time payment history going forward.
                                        </p>
                                    </div>
                                )}

                                {parseFloat(targetNewCredit) < parseFloat(newCredit) && (
                                    <div className={`${theme.status.warning.bg}/20 border ${theme.status.warning.border} rounded-lg p-4`}>
                                        <h4 className={`font-semibold ${theme.status.warning.text} mb-2`}>🛑 Limit New Credit</h4>
                                        <p className={`text-sm ${theme.textColors.secondary}`}>
                                            Avoid new credit applications for the next 12-24 months to let inquiries age off.
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
