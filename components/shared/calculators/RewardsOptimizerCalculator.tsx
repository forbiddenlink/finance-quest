'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { CreditCard, Star, Zap, ShoppingCart, Car, Plane, DollarSign, Award, Trophy } from 'lucide-react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';

interface SpendingCategory {
    name: string;
    amount: number;
    color: string;
    icon: React.ReactNode;
}

interface CreditCard {
    id: string;
    name: string;
    annualFee: number;
    categories: {
        [key: string]: number | undefined; // category -> reward rate %
    };
    signupBonus: number;
    signupSpend: number;
    color: string;
}

interface RewardProjection {
    cardName: string;
    totalRewards: number;
    annualValue: number;
    signupBonus: number;
    netValue: number;
    color: string;
}

export default function RewardsOptimizerCalculator() {
    // Spending inputs
    const [groceries, setGroceries] = useState<string>('800');
    const [gasoline, setGasoline] = useState<string>('200');
    const [dining, setDining] = useState<string>('400');
    const [travel, setTravel] = useState<string>('300');
    const [entertainment, setEntertainment] = useState<string>('200');
    const [shopping, setShopping] = useState<string>('500');
    const [utilities, setUtilities] = useState<string>('150');
    const [other, setOther] = useState<string>('450');

    // Settings
    const [timeHorizon, setTimeHorizon] = useState<string>('12'); // months
    const [includeAnnualFees, setIncludeAnnualFees] = useState<boolean>(true);
    const [includeSignupBonus, setIncludeSignupBonus] = useState<boolean>(true);

    // Results
    const [spendingBreakdown, setSpendingBreakdown] = useState<SpendingCategory[]>([]);
    const [cardRecommendations, setCardRecommendations] = useState<RewardProjection[]>([]);
    const [totalMonthlySpend, setTotalMonthlySpend] = useState<number>(0);
    const [bestCard, setBestCard] = useState<RewardProjection | null>(null);

    // Track calculator usage
    const recordCalculatorUsage = useProgressStore((state) => state.recordCalculatorUsage);

    useEffect(() => {
        recordCalculatorUsage('rewards-optimizer');
    }, [recordCalculatorUsage]);

    // Credit card database
    const creditCards: CreditCard[] = useMemo(() => [
        {
            id: 'chase-sapphire-preferred',
            name: 'Chase Sapphire Preferred',
            annualFee: 95,
            categories: {
                travel: 2,
                dining: 2,
                other: 1
            },
            signupBonus: 60000,
            signupSpend: 4000,
            color: '#1E40AF'
        },
        {
            id: 'chase-freedom-unlimited',
            name: 'Chase Freedom Unlimited',
            annualFee: 0,
            categories: {
                other: 1.5
            },
            signupBonus: 20000,
            signupSpend: 500,
            color: '#059669'
        },
        {
            id: 'discover-it-cash-back',
            name: 'Discover it Cash Back',
            annualFee: 0,
            categories: {
                groceries: 5, // rotating category
                gasoline: 5,  // rotating category
                other: 1
            },
            signupBonus: 0,
            signupSpend: 0,
            color: '#dc2626'
        },
        {
            id: 'blue-cash-preferred',
            name: 'Blue Cash Preferred',
            annualFee: 95,
            categories: {
                groceries: 6,
                gasoline: 3,
                other: 1
            },
            signupBonus: 30000,
            signupSpend: 3000,
            color: '#7C3AED'
        },
        {
            id: 'capital-one-savor',
            name: 'Capital One Savor',
            annualFee: 95,
            categories: {
                dining: 4,
                entertainment: 4,
                groceries: 2,
                other: 1
            },
            signupBonus: 30000,
            signupSpend: 3000,
            color: '#EA580C'
        },
        {
            id: 'citi-double-cash',
            name: 'Citi Double Cash',
            annualFee: 0,
            categories: {
                other: 2
            },
            signupBonus: 20000,
            signupSpend: 1500,
            color: '#6b7280'
        }
    ], []); // Empty dependency array since card data is static

    const calculateRewards = useCallback(() => {
        const spending = {
            groceries: parseFloat(groceries) || 0,
            gasoline: parseFloat(gasoline) || 0,
            dining: parseFloat(dining) || 0,
            travel: parseFloat(travel) || 0,
            entertainment: parseFloat(entertainment) || 0,
            shopping: parseFloat(shopping) || 0,
            utilities: parseFloat(utilities) || 0,
            other: parseFloat(other) || 0
        };

        const monthlyTotal = Object.values(spending).reduce((sum, amount) => sum + amount, 0);
        setTotalMonthlySpend(monthlyTotal);

        // Spending breakdown for pie chart
        const breakdown: SpendingCategory[] = [
            { name: 'Groceries', amount: spending.groceries, color: '#10b981', icon: <ShoppingCart className="w-4 h-4" /> },
            { name: 'Gasoline', amount: spending.gasoline, color: '#F59E0B', icon: <Car className="w-4 h-4" /> },
            { name: 'Dining', amount: spending.dining, color: '#ef4444', icon: <Star className="w-4 h-4" /> },
            { name: 'Travel', amount: spending.travel, color: '#3B82F6', icon: <Plane className="w-4 h-4" /> },
            { name: 'Entertainment', amount: spending.entertainment, color: '#8b5cf6', icon: <Zap className="w-4 h-4" /> },
            { name: 'Shopping', amount: spending.shopping, color: '#EC4899', icon: <ShoppingCart className="w-4 h-4" /> },
            { name: 'Utilities', amount: spending.utilities, color: '#6b7280', icon: <DollarSign className="w-4 h-4" /> },
            { name: 'Other', amount: spending.other, color: '#14B8A6', icon: <DollarSign className="w-4 h-4" /> }
        ].filter(category => category.amount > 0);

        setSpendingBreakdown(breakdown);

        // Calculate rewards for each card
        const projections: RewardProjection[] = creditCards.map(card => {
            let monthlyRewards = 0;

            // Calculate rewards based on spending categories
            Object.entries(spending).forEach(([category, amount]) => {
                const rate = card.categories[category] || card.categories.other || 0;
                monthlyRewards += (amount * rate) / 100;
            });

            const annualRewards = monthlyRewards * 12;
            const timeHorizonMonths = parseFloat(timeHorizon);
            const totalRewards = monthlyRewards * timeHorizonMonths;

            // Annual fee calculation
            const annualFeeCost = includeAnnualFees ? (card.annualFee * (timeHorizonMonths / 12)) : 0;

            // Signup bonus calculation
            let signupBonusValue = 0;
            if (includeSignupBonus && card.signupBonus > 0) {
                const monthlySpendForBonus = card.signupSpend / 3; // 3 months to meet spending requirement
                if (monthlyTotal >= monthlySpendForBonus) {
                    // Convert points to cash value (assuming 1 point = $0.01 for simplicity)
                    signupBonusValue = card.signupBonus * 0.01;
                }
            }

            const netValue = totalRewards + signupBonusValue - annualFeeCost;

            return {
                cardName: card.name,
                totalRewards: totalRewards,
                annualValue: annualRewards,
                signupBonus: signupBonusValue,
                netValue: netValue,
                color: card.color
            };
        });

        // Sort by net value
        projections.sort((a, b) => b.netValue - a.netValue);
        setCardRecommendations(projections);
        setBestCard(projections[0] || null);

    }, [groceries, gasoline, dining, travel, entertainment, shopping, utilities, other, timeHorizon, includeAnnualFees, includeSignupBonus, creditCards]);

    useEffect(() => {
        calculateRewards();
    }, [calculateRewards]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const getRewardCategory = (amount: number) => {
        if (amount >= 500) return { color: `${theme.status.success.text}`, label: 'Excellent' };
        if (amount >= 300) return { color: `${theme.textColors.accent}`, label: 'Good' };
        if (amount >= 150) return { color: `${theme.status.warning.text}`, label: 'Fair' };
        return { color: `${theme.textColors.muted}`, label: 'Basic' };
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
            {/* Header */}
            <div className="bg-slate-900/80 backdrop-blur-xl border-b border-amber-500/20">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="text-center">
                        <h2 className={`${theme.typography.heading2} ${theme.textColors.primary} mb-2 flex items-center justify-center gap-3`}>
                            <Award className={`w-8 h-8 ${theme.textColors.accent}`} />
                            Credit Card Rewards Optimizer
                        </h2>
                        <p className={`${theme.textColors.secondary}`}>
                            Maximize your credit card rewards with personalized recommendations based on your spending
                        </p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    {/* Input Controls */}
                    <div className="xl:col-span-1 space-y-6">
                        {/* Monthly Spending */}
                        <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary}/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg p-6`}>
                            <h3 className={`${theme.typography.heading4} ${theme.textColors.primary} mb-4`}>Monthly Spending by Category</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                                        🛒 Groceries
                                    </label>
                                    <div className="relative">
                                        <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted}`}>$</span>
                                        <input
                                            type="number"
                                            value={groceries}
                                            onChange={(e) => setGroceries(e.target.value)}
                                            className={`pl-8 w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-md ${theme.textColors.primary} placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                                            placeholder="800"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                                        ⛽ Gas & Fuel
                                    </label>
                                    <div className="relative">
                                        <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted}`}>$</span>
                                        <input
                                            type="number"
                                            value={gasoline}
                                            onChange={(e) => setGasoline(e.target.value)}
                                            className="pl-8 w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                            placeholder="200"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                                        🍽️ Dining & Restaurants
                                    </label>
                                    <div className="relative">
                                        <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted}`}>$</span>
                                        <input
                                            type="number"
                                            value={dining}
                                            onChange={(e) => setDining(e.target.value)}
                                            className="pl-8 w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                            placeholder="400"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                                        ✈️ Travel & Hotels
                                    </label>
                                    <div className="relative">
                                        <span className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted}`}>$</span>
                                        <input
                                            type="number"
                                            value={travel}
                                            onChange={(e) => setTravel(e.target.value)}
                                            className="pl-8 w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                            placeholder="300"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        🎬 Entertainment
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                                        <input
                                            type="number"
                                            value={entertainment}
                                            onChange={(e) => setEntertainment(e.target.value)}
                                            className="pl-8 w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                            placeholder="200"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        🛍️ Shopping & Retail
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                                        <input
                                            type="number"
                                            value={shopping}
                                            onChange={(e) => setShopping(e.target.value)}
                                            className="pl-8 w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                            placeholder="500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        🔌 Utilities & Bills
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                                        <input
                                            type="number"
                                            value={utilities}
                                            onChange={(e) => setUtilities(e.target.value)}
                                            className="pl-8 w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                            placeholder="150"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        💳 Other Purchases
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">$</span>
                                        <input
                                            type="number"
                                            value={other}
                                            onChange={(e) => setOther(e.target.value)}
                                            className="pl-8 w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                            placeholder="450"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Settings */}
                        <div className="${theme.backgrounds.glass} border ${theme.borderColors.primary}/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg p-6">
                            <h3 className="${theme.typography.heading4} text-white mb-4">Optimization Settings</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Time Horizon</label>
                                    <select
                                        value={timeHorizon}
                                        onChange={(e) => setTimeHorizon(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-md text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    >
                                        <option value="6">6 months</option>
                                        <option value="12">1 year</option>
                                        <option value="24">2 years</option>
                                        <option value="36">3 years</option>
                                    </select>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        id="include-fees"
                                        checked={includeAnnualFees}
                                        onChange={(e) => setIncludeAnnualFees(e.target.checked)}
                                        className="w-4 h-4 text-amber-600 bg-slate-800 border-slate-600 rounded focus:ring-amber-500"
                                    />
                                    <label htmlFor="include-fees" className="text-sm text-gray-300">
                                        Include annual fees in calculation
                                    </label>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <input
                                        type="checkbox"
                                        id="include-signup"
                                        checked={includeSignupBonus}
                                        onChange={(e) => setIncludeSignupBonus(e.target.checked)}
                                        className="w-4 h-4 text-amber-600 bg-slate-800 border-slate-600 rounded focus:ring-amber-500"
                                    />
                                    <label htmlFor="include-signup" className="text-sm text-gray-300">
                                        Include signup bonuses
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results and Charts */}
                    <div className="xl:col-span-2 space-y-8">
                        {/* Best Recommendation */}
                        {bestCard && (
                            <div className="bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/30 rounded-xl p-6">
                                <h3 className="${theme.typography.heading4} text-amber-300 mb-4 flex items-center gap-2">
                                    <Trophy className="w-6 h-6" />
                                    Best Card for Your Spending
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <h4 className="font-medium text-white mb-1">{bestCard.cardName}</h4>
                                        <p className="text-sm text-gray-300">Top recommendation</p>
                                    </div>
                                    <div>
                                        <p className="${theme.typography.heading2} text-amber-300">
                                            {formatCurrency(bestCard.netValue)}
                                        </p>
                                        <p className="text-sm text-gray-300">Total value over {timeHorizon} months</p>
                                    </div>
                                    <div>
                                        <p className={`${theme.typography.heading4} ${getRewardCategory(bestCard.netValue).color}`}>
                                            {getRewardCategory(bestCard.netValue).label}
                                        </p>
                                        <p className="text-sm text-gray-300">Reward optimization</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Spending Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="${theme.backgrounds.glass} border ${theme.borderColors.primary}/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg p-6">
                                <h3 className="${theme.typography.heading4} text-white mb-4">Monthly Spending</h3>
                                <div className="text-center">
                                    <p className="${theme.typography.heading2} text-blue-300">{formatCurrency(totalMonthlySpend)}</p>
                                    <p className="text-sm text-gray-300">Total monthly spending</p>
                                    <p className="text-lg font-medium text-blue-400 mt-2">
                                        {formatCurrency(totalMonthlySpend * 12)}/year
                                    </p>
                                </div>
                            </div>

                            <div className="${theme.backgrounds.glass} border ${theme.borderColors.primary}/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg p-6">
                                <h3 className="${theme.typography.heading4} text-white mb-4">Spending Breakdown</h3>
                                <div className="h-40">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={spendingBreakdown}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={30}
                                                outerRadius={60}
                                                dataKey="amount"
                                                nameKey="name"
                                            >
                                                {spendingBreakdown.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Card Comparison */}
                        <div className="${theme.backgrounds.glass} border ${theme.borderColors.primary}/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg p-6">
                            <h3 className="${theme.typography.heading4} text-white mb-4">Card Recommendations</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={cardRecommendations}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                        <XAxis
                                            dataKey="cardName"
                                            stroke="#9CA3AF"
                                            angle={-45}
                                            textAnchor="end"
                                            height={80}
                                            fontSize={12}
                                            tick={{ fill: "#94a3b8" }}
                                        />
                                        <YAxis
                                            stroke="#9CA3AF"
                                            label={{ value: 'Net Value ($)', angle: -90, position: 'insideLeft' }}
                                            tick={{ fill: "#94a3b8" }}
                                        />
                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: '#1F2937',
                                                border: '1px solid #374151',
                                                borderRadius: '8px'
                                            }}
                                            formatter={(value: number) => [formatCurrency(value), 'Net Value']}
                                        />
                                        <Bar dataKey="netValue" fill="#3B82F6" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Detailed Comparison */}
                        <div className="${theme.backgrounds.glass} border ${theme.borderColors.primary}/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg p-6">
                            <h3 className="${theme.typography.heading4} text-white mb-4">Detailed Comparison</h3>
                            <div className="space-y-3">
                                {cardRecommendations.map((card, index) => (
                                    <div
                                        key={card.cardName}
                                        className={`p-4 rounded-lg border-2 ${index === 0
                                            ? 'bg-amber-500/20 border-amber-500/30'
                                            : 'bg-slate-800/50 border-slate-600'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: card.color }}></div>
                                                <div>
                                                    <h4 className={`font-medium ${index === 0 ? 'text-amber-300' : 'text-white'}`}>
                                                        {card.cardName}
                                                    </h4>
                                                    <div className="flex gap-4 text-sm text-gray-300">
                                                        <span>Rewards: {formatCurrency(card.totalRewards)}</span>
                                                        {card.signupBonus > 0 && (
                                                            <span>Bonus: {formatCurrency(card.signupBonus)}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`text-lg font-bold ${index === 0 ? 'text-amber-300' : 'text-white'}`}>
                                                    {formatCurrency(card.netValue)}
                                                </div>
                                                <div className="text-sm text-gray-400">Net value</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Optimization Tips */}
                <div className="mt-8 ${theme.backgrounds.glass} border ${theme.borderColors.primary}/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-lg p-6">
                    <h3 className="${theme.typography.heading4} text-white mb-4">💡 Reward Optimization Tips</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                        <div className="${theme.status.info.bg}0/20 border border-blue-500/30 rounded-lg p-4">
                            <h4 className="font-semibold mb-2 text-blue-300">📊 Track Your Spending</h4>
                            <p className="text-gray-300">
                                Monitor your actual spending patterns quarterly. Your categories may change, requiring different cards for optimal rewards.
                            </p>
                        </div>

                        <div className="${theme.status.success.bg}0/20 border border-green-500/30 rounded-lg p-4">
                            <h4 className="font-semibold mb-2 text-green-300">🎯 Maximize Signup Bonuses</h4>
                            <p className="text-gray-300">
                                Plan large purchases around new card applications to easily meet minimum spending requirements for signup bonuses.
                            </p>
                        </div>

                        <div className="bg-amber-500/20 border border-amber-500/30 rounded-lg p-4">
                            <h4 className="font-semibold mb-2 text-amber-300">💳 Consider Multiple Cards</h4>
                            <p className="text-gray-300">
                                Use different cards for different categories to maximize rewards. Just ensure you can manage multiple payments responsibly.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
