'use client';

import React, { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import CalculatorWrapper, { CalculatorMetadata, CalculatorInsight } from './CalculatorWrapper';
import { CurrencyInput, NumberInput } from './FormFields';
import { theme } from '@/lib/theme';
import {
    Home,
    ShoppingCart,
    Zap,
    Car,
    Shield,
    Film,
    Pizza,
    ShoppingBag,
    Palette,
    AlertTriangle,
    Umbrella,
    TrendingUp,
    Target,
    LucideIcon,
    Calculator
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
    const metadata: CalculatorMetadata = {
        id: 'budget-builder-calculator',
        title: 'Budget Builder Calculator',
        description: 'Create your personal budget using the proven 50/30/20 rule: 50% needs, 30% wants, 20% savings',
        category: 'intermediate',
        icon: Calculator,
        tags: ['Budgeting', '50/30/20 Rule', 'Personal Finance', 'Expense Tracking'],
        educationalNotes: [
            {
                title: '50/30/20 Budget Rule',
                content: 'This proven budgeting method allocates 50% of after-tax income to needs, 30% to wants, and 20% to savings and debt repayment. It provides a simple framework for financial balance.',
                tips: [
                    'Needs include housing, utilities, groceries, transportation, and minimum debt payments',
                    'Wants include entertainment, dining out, hobbies, and non-essential shopping',
                    'Savings should include emergency fund, retirement, and debt repayment beyond minimums',
                    'Adjust percentages based on your situation - high earners may save more than 20%'
                ]
            },
            {
                title: 'Budget Categories Explained',
                content: 'Understanding the difference between needs and wants is crucial for successful budgeting. Needs are essential for survival and basic functioning, while wants enhance your lifestyle.',
                tips: [
                    'Review and categorize all expenses monthly',
                    'Track actual spending to identify patterns and problem areas',
                    'Use the envelope method or budgeting apps for better control',
                    'Build in a small buffer for unexpected expenses'
                ]
            }
        ]
    };

    // Use regular useState for complex data structures
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

    const updateCategory = (id: string, field: 'budgeted' | 'actual', value: number) => {
        setCategories(prev => prev.map(cat =>
            cat.id === id ? { ...cat, [field]: value } : cat
        ));
    };

    const handleReset = () => {
        setMonthlyIncome(5000);
        setCategories([
            // Reset to default values
            { id: 'housing', name: 'Housing', budgeted: 1500, actual: 1500, color: '#ef4444', type: 'need', icon: Home },
            { id: 'food', name: 'Groceries', budgeted: 400, actual: 450, color: '#f97316', type: 'need', icon: ShoppingCart },
            { id: 'utilities', name: 'Utilities', budgeted: 200, actual: 180, color: '#eab308', type: 'need', icon: Zap },
            { id: 'transportation', name: 'Transportation', budgeted: 300, actual: 320, color: '#dc2626', type: 'need', icon: Car },
            { id: 'insurance', name: 'Insurance', budgeted: 200, actual: 200, color: '#b91c1c', type: 'need', icon: Shield },
            { id: 'entertainment', name: 'Entertainment', budgeted: 300, actual: 350, color: '#8b5cf6', type: 'want', icon: Film },
            { id: 'dining_out', name: 'Dining Out', budgeted: 250, actual: 280, color: '#a855f7', type: 'want', icon: Pizza },
            { id: 'shopping', name: 'Shopping', budgeted: 200, actual: 180, color: '#c084fc', type: 'want', icon: ShoppingBag },
            { id: 'hobbies', name: 'Hobbies', budgeted: 150, actual: 120, color: '#ddd6fe', type: 'want', icon: Palette },
            { id: 'emergency', name: 'Emergency Fund', budgeted: 500, actual: 500, color: '#10b981', type: 'savings', icon: AlertTriangle },
            { id: 'retirement', name: 'Retirement', budgeted: 400, actual: 400, color: '#059669', type: 'savings', icon: Umbrella },
            { id: 'investments', name: 'Investments', budgeted: 300, actual: 250, color: '#047857', type: 'savings', icon: TrendingUp },
            { id: 'goals', name: 'Financial Goals', budgeted: 200, actual: 180, color: '#065f46', type: 'savings', icon: Target },
        ]);
    };

    // Calculate budget summary
    const summary = useMemo((): BudgetSummary => {
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
    }, [categories, monthlyIncome]);

    // Calculate 50/30/20 percentages
    const needsPercentage = Math.round((summary.needs / summary.totalIncome) * 100);
    const wantsPercentage = Math.round((summary.wants / summary.totalIncome) * 100);
    const savingsPercentage = Math.round((summary.savings / summary.totalIncome) * 100);

    // Generate results
    const results = useMemo(() => {
        if (!monthlyIncome) return undefined;

        return {
            primary: {
                label: 'Remaining Budget',
                value: summary.remaining,
                format: 'currency' as const,
                variant: summary.remaining >= 0 ? ('success' as const) : ('error' as const),
                description: summary.remaining >= 0 
                    ? 'Great job staying within budget!'
                    : 'Consider reducing expenses or increasing income.'
            },
            secondary: [
                {
                    label: `Needs (${needsPercentage}% - Target: 50%)`,
                    value: summary.needs,
                    format: 'currency' as const,
                    variant: needsPercentage <= 50 ? ('success' as const) : ('warning' as const)
                },
                {
                    label: `Wants (${wantsPercentage}% - Target: 30%)`,
                    value: summary.wants,
                    format: 'currency' as const,
                    variant: wantsPercentage <= 30 ? ('success' as const) : ('warning' as const)
                },
                {
                    label: `Savings (${savingsPercentage}% - Target: 20%)`,
                    value: summary.savings,
                    format: 'currency' as const,
                    variant: savingsPercentage >= 20 ? ('success' as const) : ('warning' as const)
                }
            ]
        };
    }, [summary, needsPercentage, wantsPercentage, savingsPercentage, monthlyIncome]);

    // Generate insights
    const insights = useMemo((): CalculatorInsight[] => {
        const insights: CalculatorInsight[] = [];

        if (summary.remaining < 0) {
            insights.push({
                type: 'error',
                title: 'Over Budget',
                message: `You're spending $${Math.abs(summary.remaining).toLocaleString()} more than your income. Consider reducing expenses or finding additional income sources.`
            });
        }

        if (savingsPercentage < 20) {
            insights.push({
                type: 'warning',
                title: 'Low Savings Rate',
                message: `Your savings rate is ${savingsPercentage}%, below the recommended 20%. Try to reduce wants or optimize needs to increase savings.`
            });
        }

        if (needsPercentage > 50) {
            insights.push({
                type: 'warning',
                title: 'High Essential Expenses',
                message: `Your needs account for ${needsPercentage}% of income (target: 50%). Look for ways to reduce housing, transportation, or other essential costs.`
            });
        }

        if (wantsPercentage > 30) {
            insights.push({
                type: 'info',
                title: 'Lifestyle Spending Alert',
                message: `Your wants consume ${wantsPercentage}% of income (target: 30%). Consider which discretionary expenses provide the most value.`
            });
        }

        if (needsPercentage <= 50 && wantsPercentage <= 30 && savingsPercentage >= 20) {
            insights.push({
                type: 'success',
                title: 'Excellent Budget Balance!',
                message: 'Your budget follows the 50/30/20 rule perfectly. You have a sustainable financial plan that balances current needs with future security.'
            });
        }

        return insights;
    }, [summary, needsPercentage, wantsPercentage, savingsPercentage]);

    // Data for charts
    const pieData = [
        { name: 'Needs', value: summary.needs, color: '#ef4444' },
        { name: 'Wants', value: summary.wants, color: '#8b5cf6' },
        { name: 'Savings', value: summary.savings, color: '#10b981' },
        { name: 'Remaining', value: Math.max(summary.remaining, 0), color: '#6b7280' }
    ];

    const comparisonData = [
        { 
            category: 'Needs', 
            budgeted: categories.filter(c => c.type === 'need').reduce((s, c) => s + c.budgeted, 0), 
            actual: summary.needs 
        },
        { 
            category: 'Wants', 
            budgeted: categories.filter(c => c.type === 'want').reduce((s, c) => s + c.budgeted, 0), 
            actual: summary.wants 
        },
        { 
            category: 'Savings', 
            budgeted: categories.filter(c => c.type === 'savings').reduce((s, c) => s + c.budgeted, 0), 
            actual: summary.savings 
        }
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
        <CalculatorWrapper
            metadata={metadata}
            results={results}
            insights={insights}
            onReset={handleReset}
        >
            <div className="space-y-6">
                {/* Monthly Income Input */}
                <CurrencyInput
                    id="monthly-income"
                    label="Monthly Take-Home Income"
                    value={monthlyIncome.toString()}
                    onChange={(value) => setMonthlyIncome(parseFloat(value) || 0)}
                    placeholder="Enter your monthly after-tax income"
                    helpText="Enter your monthly after-tax income (what you actually receive in your bank account)"
                />

                {/* Budget Categories */}
                <div className="space-y-6">
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
                                        <NumberInput
                                            id={`${category.id}-budgeted`}
                                            label="Budgeted"
                                            value={category.budgeted.toString()}
                                            onChange={(value) => updateCategory(category.id, 'budgeted', parseFloat(value) || 0)}
                                            min={0}
                                            prefix="$"
                                        />
                                        <NumberInput
                                            id={`${category.id}-actual`}
                                            label="Actual"
                                            value={category.actual.toString()}
                                            onChange={(value) => updateCategory(category.id, 'actual', parseFloat(value) || 0)}
                                            min={0}
                                            prefix="$"
                                        />
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
                                        <NumberInput
                                            id={`${category.id}-budgeted-want`}
                                            label="Budgeted"
                                            value={category.budgeted.toString()}
                                            onChange={(value) => updateCategory(category.id, 'budgeted', parseFloat(value) || 0)}
                                            min={0}
                                            prefix="$"
                                        />
                                        <NumberInput
                                            id={`${category.id}-actual-want`}
                                            label="Actual"
                                            value={category.actual.toString()}
                                            onChange={(value) => updateCategory(category.id, 'actual', parseFloat(value) || 0)}
                                            min={0}
                                            prefix="$"
                                        />
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
                                        <NumberInput
                                            id={`${category.id}-budgeted-savings`}
                                            label="Budgeted"
                                            value={category.budgeted.toString()}
                                            onChange={(value) => updateCategory(category.id, 'budgeted', parseFloat(value) || 0)}
                                            min={0}
                                            prefix="$"
                                        />
                                        <NumberInput
                                            id={`${category.id}-actual-savings`}
                                            label="Actual"
                                            value={category.actual.toString()}
                                            onChange={(value) => updateCategory(category.id, 'actual', parseFloat(value) || 0)}
                                            min={0}
                                            prefix="$"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                </div>
            </div>
        </CalculatorWrapper>
    );
}
