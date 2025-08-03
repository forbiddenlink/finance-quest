'use client';

import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { useProgress } from '@/lib/store/progressHooks';
import { theme } from '@/lib/theme';
import {
    Home,
    ShoppingCart,
    Zap,
    Car,
    Shield,
    Lightbulb,
    Film,
    Pizza,
    ShoppingBag,
    Palette,
    AlertTriangle,
    Umbrella,
    TrendingUp,
    Target,
    LucideIcon,
    DollarSign,
    AlertCircle
} from 'lucide-react';

interface BudgetCategory {
    id: string;
    name: string;
    budgeted: number;
    actual: number;
    color: string;
    type: 'need' | 'want' | 'savings';
    icon: LucideIcon;
}

interface BudgetSummary {
    totalIncome: number;
    totalBudgeted: number;
    totalActual: number;
    needs: number;
    wants: number;
    savings: number;
    remaining: number;
}

export default function BudgetBuilderCalculator() {
    const [monthlyIncome, setMonthlyIncome] = useState(5000);
    const [categories, setCategories] = useState<BudgetCategory[]>([
        // Needs (50%)
        { id: 'housing', name: 'Housing', budgeted: 1500, actual: 1500, color: '#ef4444', type: 'need', icon: Home },
        { id: 'food', name: 'Groceries', budgeted: 400, actual: 450, color: '#f97316', type: 'need', icon: ShoppingCart },
        { id: 'utilities', name: 'Utilities', budgeted: 200, actual: 180, color: '#eab308', type: 'need', icon: Zap },
        { id: 'transportation', name: 'Transportation', budgeted: 300, actual: 320, color: '#dc2626', type: 'need', icon: Car },
        { id: 'insurance', name: 'Insurance', budgeted: 200, actual: 200, color: '#b91c1c', type: 'need', icon: Shield },

        // Wants (30%)
        { id: 'entertainment', name: 'Entertainment', budgeted: 300, actual: 350, color: '#8b5cf6', type: 'want', icon: Film },
        { id: 'dining_out', name: 'Dining Out', budgeted: 250, actual: 280, color: '#a855f7', type: 'want', icon: Pizza },
        { id: 'shopping', name: 'Shopping', budgeted: 200, actual: 180, color: '#c084fc', type: 'want', icon: ShoppingBag },
        { id: 'hobbies', name: 'Hobbies', budgeted: 150, actual: 120, color: '#ddd6fe', type: 'want', icon: Palette },

        // Savings (20%)
        { id: 'emergency', name: 'Emergency Fund', budgeted: 500, actual: 500, color: '#10b981', type: 'savings', icon: AlertTriangle },
        { id: 'retirement', name: 'Retirement', budgeted: 400, actual: 400, color: '#059669', type: 'savings', icon: Umbrella },
        { id: 'investments', name: 'Investments', budgeted: 300, actual: 250, color: '#047857', type: 'savings', icon: TrendingUp },
        { id: 'goals', name: 'Financial Goals', budgeted: 200, actual: 180, color: '#065f46', type: 'savings', icon: Target },
    ]);

    const progress = useProgress();

    useEffect(() => {
        // Track calculator usage
        progress.recordCalculatorUsage('budget-builder');
    }, [progress]);

    const updateCategory = (id: string, field: 'budgeted' | 'actual', value: number) => {
        setCategories(prev => prev.map(cat =>
            cat.id === id ? { ...cat, [field]: value } : cat
        ));
    };

    const calculateSummary = (): BudgetSummary => {
        const totalBudgeted = categories.reduce((sum, cat) => sum + cat.budgeted, 0);
        const totalActual = categories.reduce((sum, cat) => sum + cat.actual, 0);
        const needs = categories.filter(cat => cat.type === 'need').reduce((sum, cat) => sum + cat.actual, 0);
        const wants = categories.filter(cat => cat.type === 'want').reduce((sum, cat) => sum + cat.actual, 0);
        const savings = categories.filter(cat => cat.type === 'savings').reduce((sum, cat) => sum + cat.actual, 0);

        return {
            totalIncome: monthlyIncome,
            totalBudgeted,
            totalActual,
            needs,
            wants,
            savings,
            remaining: monthlyIncome - totalActual
        };
    };

    const summary = calculateSummary();

    // Calculate 50/30/20 percentages
    const needsPercentage = Math.round((summary.needs / summary.totalIncome) * 100);
    const wantsPercentage = Math.round((summary.wants / summary.totalIncome) * 100);
    const savingsPercentage = Math.round((summary.savings / summary.totalIncome) * 100);

    // Determine budget health
    const getBudgetHealth = () => {
        if (summary.remaining < 0) return { status: 'Over Budget', color: theme.status.error.text, bg: theme.status.error.bg };
        if (savingsPercentage < 20) return { status: 'Needs More Savings', color: theme.status.warning.text, bg: theme.status.warning.bg };
        if (needsPercentage <= 50 && wantsPercentage <= 30 && savingsPercentage >= 20) {
            return { status: 'Excellent Budget!', color: theme.status.success.text, bg: theme.status.success.bg };
        }
        return { status: 'Good Progress', color: theme.status.info.text, bg: theme.status.info.bg };
    };

    const budgetHealth = getBudgetHealth();

    // Data for pie chart
    const pieData = [
        { name: 'Needs', value: summary.needs, color: '#ef4444' },
        { name: 'Wants', value: summary.wants, color: '#8b5cf6' },
        { name: 'Savings', value: summary.savings, color: '#10b981' },
        { name: 'Remaining', value: Math.max(summary.remaining, 0), color: '#6b7280' }
    ];

    // Data for comparison chart
    const comparisonData = [
        { category: 'Needs', budgeted: categories.filter(c => c.type === 'need').reduce((s, c) => s + c.budgeted, 0), actual: summary.needs },
        { category: 'Wants', budgeted: categories.filter(c => c.type === 'want').reduce((s, c) => s + c.budgeted, 0), actual: summary.wants },
        { category: 'Savings', budgeted: categories.filter(c => c.type === 'savings').reduce((s, c) => s + c.budgeted, 0), actual: summary.savings }
    ];

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className={`max-w-7xl mx-auto ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg shadow-lg p-6`}>
            <div className="mb-6">
                <h2 className={`${theme.typography.heading2} ${theme.textColors.primary} mb-2`}>
                    Budget Builder Calculator
                </h2>
                <p className={theme.textColors.secondary}>
                    Create your personal budget using the proven 50/30/20 rule: 50% needs, 30% wants, 20% savings
                </p>
            </div>

            {/* Monthly Income Input */}
            <div className={`mb-8 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg p-6`}>
                <label className={`block ${theme.typography.heading4} ${theme.status.info.text} mb-3`}>
                    Monthly Take-Home Income
                </label>
                <div className="relative max-w-md">
                    <span className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${theme.textColors.secondary} text-lg`}>$</span>
                    <input
                        type="number"
                        value={monthlyIncome}
                        onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                        className={`w-full pl-10 pr-4 py-3 ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 ${theme.textColors.primary} ${theme.typography.heading4} transition-all`}
                        min="0"
                        step="100"
                    />
                </div>
                <p className={`text-sm ${theme.textColors.secondary} mt-2`}>
                    Enter your monthly after-tax income (what you actually receive in your bank account)
                </p>
            </div>

            {/* Budget Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className={`${budgetHealth.bg.replace('bg-', theme.status.info.bg + ' ')} border ${theme.borderColors.primary} rounded-lg p-4 text-center`}>
                    <p className={`text-sm font-medium ${theme.textColors.secondary}`}>Budget Status</p>
                    <p className={`text-lg font-bold ${budgetHealth.color.replace('text-', theme.textColors.primary + ' ')}`}>{budgetHealth.status}</p>
                </div>
                <div className={`${theme.status.error.bg} border ${theme.status.error.border} rounded-lg p-4 text-center`}>
                    <p className={`text-sm font-medium ${theme.status.error.text}`}>Needs ({needsPercentage}%)</p>
                    <p className={`text-xl font-bold ${theme.textColors.primary}`}>{formatCurrency(summary.needs)}</p>
                    <p className={`text-xs ${theme.textColors.muted}`}>Target: 50%</p>
                </div>
                <div className={`${theme.status.info.bg} border ${theme.status.info.border} rounded-lg p-4 text-center`}>
                    <p className={`text-sm font-medium ${theme.status.info.text}`}>Wants ({wantsPercentage}%)</p>
                    <p className={`text-xl font-bold ${theme.textColors.primary}`}>{formatCurrency(summary.wants)}</p>
                    <p className={`text-xs ${theme.textColors.muted}`}>Target: 30%</p>
                </div>
                <div className={`${theme.status.success.bg} border ${theme.status.success.border} rounded-lg p-4 text-center`}>
                    <p className={`text-sm font-medium ${theme.status.success.text}`}>Savings ({savingsPercentage}%)</p>
                    <p className={`text-xl font-bold ${theme.textColors.primary}`}>{formatCurrency(summary.savings)}</p>
                    <p className={`text-xs ${theme.textColors.muted}`}>Target: 20%</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Budget Categories */}
                <div className="space-y-6">
                    <h3 className={`${theme.typography.heading4} ${theme.textColors.primary}`}>Monthly Budget Categories</h3>

                    {/* Needs Section */}
                    <div className={`${theme.status.error.bg} rounded-lg p-4`}>
                        <h4 className={`font-semibold ${theme.status.error.text} mb-3 flex items-center`}>
                            <Home className="mr-2 w-5 h-5" />
                            Needs (Essential Expenses)
                        </h4>
                        <div className="space-y-3">
                            {categories.filter(cat => cat.type === 'need').map(category => (
                                <div key={category.id} className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-3`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`font-medium ${theme.textColors.primary} flex items-center`}>
                                            <category.icon className="mr-2 w-4 h-4" style={{ color: category.color }} />
                                            {category.name}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className={`text-xs ${theme.textColors.secondary}`}>Budgeted</label>
                                            <div className="relative">
                                                <span className={`absolute left-2 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted} text-xs`}>$</span>
                                                <input
                                                    type="number"
                                                    value={category.budgeted}
                                                    onChange={(e) => updateCategory(category.id, 'budgeted', Number(e.target.value))}
                                                    className={`w-full pl-6 pr-2 py-1 border ${theme.borderColors.primary} rounded text-sm`}
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className={`text-xs ${theme.textColors.secondary}`}>Actual</label>
                                            <div className="relative">
                                                <span className={`absolute left-2 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted} text-xs`}>$</span>
                                                <input
                                                    type="number"
                                                    value={category.actual}
                                                    onChange={(e) => updateCategory(category.id, 'actual', Number(e.target.value))}
                                                    className={`w-full pl-6 pr-2 py-1 border ${theme.borderColors.primary} rounded text-sm`}
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Wants Section */}
                    <div className={`${theme.status.info.bg} rounded-lg p-4`}>
                        <h4 className={`font-semibold ${theme.status.info.text} mb-3 flex items-center`}>
                            <Film className="mr-2 w-5 h-5" />
                            Wants (Lifestyle Expenses)
                        </h4>
                        <div className="space-y-3">
                            {categories.filter(cat => cat.type === 'want').map(category => (
                                <div key={category.id} className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-3`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`font-medium ${theme.textColors.primary} flex items-center`}>
                                            <category.icon className="mr-2 w-4 h-4" style={{ color: category.color }} />
                                            {category.name}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className={`text-xs ${theme.textColors.secondary}`}>Budgeted</label>
                                            <div className="relative">
                                                <span className={`absolute left-2 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted} text-xs`}>$</span>
                                                <input
                                                    type="number"
                                                    value={category.budgeted}
                                                    onChange={(e) => updateCategory(category.id, 'budgeted', Number(e.target.value))}
                                                    className={`w-full pl-6 pr-2 py-1 border ${theme.borderColors.primary} rounded text-sm`}
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className={`text-xs ${theme.textColors.secondary}`}>Actual</label>
                                            <div className="relative">
                                                <span className={`absolute left-2 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted} text-xs`}>$</span>
                                                <input
                                                    type="number"
                                                    value={category.actual}
                                                    onChange={(e) => updateCategory(category.id, 'actual', Number(e.target.value))}
                                                    className={`w-full pl-6 pr-2 py-1 border ${theme.borderColors.primary} rounded text-sm`}
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Savings Section */}
                    <div className={`${theme.status.success.bg} rounded-lg p-4`}>
                        <h4 className={`font-semibold ${theme.status.success.text} mb-3 flex items-center`}>
                            <TrendingUp className="mr-2 w-5 h-5" />
                            Savings & Investments
                        </h4>
                        <div className="space-y-3">
                            {categories.filter(cat => cat.type === 'savings').map(category => (
                                <div key={category.id} className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-3`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`font-medium ${theme.textColors.primary} flex items-center`}>
                                            <category.icon className="mr-2 w-4 h-4" style={{ color: category.color }} />
                                            {category.name}
                                        </span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className={`text-xs ${theme.textColors.secondary}`}>Budgeted</label>
                                            <div className="relative">
                                                <span className={`absolute left-2 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted} text-xs`}>$</span>
                                                <input
                                                    type="number"
                                                    value={category.budgeted}
                                                    onChange={(e) => updateCategory(category.id, 'budgeted', Number(e.target.value))}
                                                    className={`w-full pl-6 pr-2 py-1 border ${theme.borderColors.primary} rounded text-sm`}
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className={`text-xs ${theme.textColors.secondary}`}>Actual</label>
                                            <div className="relative">
                                                <span className={`absolute left-2 top-1/2 transform -translate-y-1/2 ${theme.textColors.muted} text-xs`}>$</span>
                                                <input
                                                    type="number"
                                                    value={category.actual}
                                                    onChange={(e) => updateCategory(category.id, 'actual', Number(e.target.value))}
                                                    className={`w-full pl-6 pr-2 py-1 border ${theme.borderColors.primary} rounded text-sm`}
                                                    min="0"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Charts and Analysis */}
                <div className="space-y-6">
                    <h3 className={`${theme.typography.heading4} ${theme.textColors.primary}`}>Budget Analysis</h3>

                    {/* Budget Breakdown Pie Chart */}
                    <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-4`}>
                        <h4 className={`font-semibold ${theme.textColors.primary} mb-4`}>Spending Breakdown</h4>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={40}
                                        outerRadius={80}
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Budget vs Actual Comparison */}
                    <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-4`}>
                        <h4 className={`font-semibold ${theme.textColors.primary} mb-4`}>Budget vs Actual</h4>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={comparisonData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                                    <XAxis dataKey="category" tick={{ fill: "#94a3b8" }} />
                                    <YAxis tickFormatter={(value: number) => `$${(value / 1000).toFixed(1)}k`} tick={{ fill: "#94a3b8" }} />
                                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                    <Legend />
                                    <Bar dataKey="budgeted" fill="#94A3B8" name="Budgeted" />
                                    <Bar dataKey="actual" fill="#3B82F6" name="Actual" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Remaining Budget */}
                    <div className={`rounded-lg p-4 ${summary.remaining >= 0 ? '${theme.status.success.bg} border ${theme.status.success.border}' : '${theme.status.error.bg} border ${theme.status.error.border}'}`}>
                        <h4 className={`font-semibold mb-2 flex items-center ${summary.remaining >= 0 ? '${theme.status.success.text}' : '${theme.status.error.text}'}`}>
                            {summary.remaining >= 0 ? (
                                <>
                                    <DollarSign className="w-5 h-5 mr-2" />
                                    Remaining Budget
                                </>
                            ) : (
                                <>
                                    <AlertCircle className="w-5 h-5 mr-2" />
                                    Over Budget
                                </>
                            )}
                        </h4>
                        <p className={`${theme.typography.heading2} ${summary.remaining >= 0 ? '${theme.textColors.primary}' : '${theme.textColors.primary}'}`}>
                            {formatCurrency(Math.abs(summary.remaining))}
                        </p>
                        <p className={`text-sm mt-1 ${summary.remaining >= 0 ? '${theme.textColors.secondary}' : '${theme.textColors.secondary}'}`}>
                            {summary.remaining >= 0
                                ? 'Great job staying within budget!'
                                : 'Consider reducing expenses or increasing income.'
                            }
                        </p>
                    </div>

                    {/* Tips and Insights */}
                    <div className={`${theme.status.info.bg} border ${theme.status.info.border} rounded-lg p-4`}>
                        <h4 className={`font-semibold ${theme.status.info.text} mb-3 flex items-center gap-2`}>
                            <Lightbulb className="w-4 h-4" />
                            Budgeting Tips
                        </h4>
                        <ul className={`text-sm ${theme.textColors.secondary} space-y-2`}>
                            <li>• <strong>Track everything:</strong> Use apps or spreadsheets to monitor actual spending</li>
                            <li>• <strong>Pay yourself first:</strong> Set aside savings before spending on wants</li>
                            <li>• <strong>Review monthly:</strong> Adjust categories based on actual spending patterns</li>
                            <li>• <strong>Emergency buffer:</strong> Keep a small buffer for unexpected expenses</li>
                            <li>• <strong>Automate savings:</strong> Set up automatic transfers to savings accounts</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
