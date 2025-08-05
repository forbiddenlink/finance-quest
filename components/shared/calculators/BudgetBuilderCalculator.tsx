'use client';

import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import CalculatorWrapper, { CalculatorMetadata } from './CalculatorWrapper';
import { CurrencyInput, NumberInput } from './FormFields';
import { theme } from '@/lib/theme';
import {
    BudgetCategory
} from '@/lib/utils/calculatorHooks';
import { useProgressStore } from '@/lib/store/progressStore';
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
    Calculator
} from 'lucide-react';

const DEFAULT_CATEGORIES: BudgetCategory[] = [
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
];

interface BudgetSectionProps {
    title: string;
    icon: React.ElementType;
    categories: BudgetCategory[];
    type: 'need' | 'want' | 'savings';
    bgColor: string;
    textColor: string;
    onUpdateCategory: (id: string, field: 'budgeted' | 'actual', value: number) => void;
}

const BudgetSection: React.FC<BudgetSectionProps> = ({
    title,
    icon: Icon,
    categories,
    type,
    bgColor,
    textColor,
    onUpdateCategory
}) => (
    <div className={`${bgColor} rounded-lg p-4`}>
        <h4 className={`font-semibold ${textColor} mb-3 flex items-center text-lg`}>
            <Icon className="mr-2 w-5 h-5" />
            {title}
        </h4>
        <div className="space-y-3">
            {categories.filter(cat => cat.type === type).map(category => (
                <div key={category.id} className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-3 transition-all duration-200`}>
                    <div className="flex items-center justify-between mb-2">
                        <span className={`font-medium ${theme.textColors.primary} flex items-center`}>
                            {category.icon && <category.icon className="mr-2 w-4 h-4" style={{ color: category.color }} />}
                            {category.name}
                        </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <NumberInput
                            id={`${category.id}-budgeted`}
                            label="Budgeted"
                            value={(category.budgeted || 0).toString()}
                            onChange={(value) => onUpdateCategory(category.id, 'budgeted', parseFloat(value) || 0)}
                            min={0}
                            prefix="$"
                        />
                        <NumberInput
                            id={`${category.id}-actual`}
                            label="Actual"
                            value={(category.actual || 0).toString()}
                            onChange={(value) => onUpdateCategory(category.id, 'actual', parseFloat(value) || 0)}
                            min={0}
                            prefix="$"
                        />
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default function BudgetBuilderCalculator() {
    const { recordCalculatorUsage } = useProgressStore();

    React.useEffect(() => {
        recordCalculatorUsage('budget-builder-calculator');
    }, [recordCalculatorUsage]);

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

    const [monthlyIncome, setMonthlyIncome] = useState(5000);
    const [categories, setCategories] = useState<BudgetCategory[]>(DEFAULT_CATEGORIES);

    const updateCategory = (id: string, field: 'budgeted' | 'actual', value: number) => {
        setCategories(prev => prev.map(cat =>
            cat.id === id ? { ...cat, [field]: value } : cat
        ));
    };

    const handleReset = () => {
        setMonthlyIncome(5000);
        setCategories(DEFAULT_CATEGORIES);
    };

    // Calculate totals from categories and create summary
    const summary = React.useMemo(() => {
        const needs = categories.filter(c => c.type === 'need').reduce((sum, c) => sum + (c.budgeted || 0), 0);
        const wants = categories.filter(c => c.type === 'want').reduce((sum, c) => sum + (c.budgeted || 0), 0);
        const savings = categories.filter(c => c.type === 'savings').reduce((sum, c) => sum + (c.budgeted || 0), 0);

        return {
            income: monthlyIncome,
            expenses: needs + wants + savings,
            remaining: monthlyIncome - (needs + wants + savings),
            needs,
            wants,
            savings,
            needsPercentage: monthlyIncome > 0 ? Math.round((needs / monthlyIncome) * 100) : 0,
            wantsPercentage: monthlyIncome > 0 ? Math.round((wants / monthlyIncome) * 100) : 0,
            savingsPercentage: monthlyIncome > 0 ? Math.round((savings / monthlyIncome) * 100) : 0
        };
    }, [categories, monthlyIncome]);

    interface PieDataEntry {
        name: string;
        value: number;
        color: string;
    }

    interface ComparisonDataEntry {
        category: string;
        budgeted: number;
        actual: number;
    }

    interface InsightEntry {
        type: 'success' | 'warning' | 'error' | 'info';
        title: string;
        message: string;
    }

    const pieData: PieDataEntry[] = [];
    const comparisonData: ComparisonDataEntry[] = [];
    const insights: InsightEntry[] = [];

    // Generate results for CalculatorWrapper
    const results = React.useMemo(() => {
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
                    label: `Needs (${summary.needsPercentage}% - Target: 50%)`,
                    value: summary.needs,
                    format: 'currency' as const,
                    variant: summary.needsPercentage <= 50 ? ('success' as const) : ('warning' as const)
                },
                {
                    label: `Wants (${summary.wantsPercentage}% - Target: 30%)`,
                    value: summary.wants,
                    format: 'currency' as const,
                    variant: summary.wantsPercentage <= 30 ? ('success' as const) : ('warning' as const)
                },
                {
                    label: `Savings (${summary.savingsPercentage}% - Target: 20%)`,
                    value: summary.savings,
                    format: 'currency' as const,
                    variant: summary.savingsPercentage >= 20 ? ('success' as const) : ('warning' as const)
                }
            ]
        };
    }, [summary, monthlyIncome]);

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
                <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-4`}>
                    <CurrencyInput
                        id="monthly-income"
                        label="Monthly Take-Home Income"
                        value={monthlyIncome.toString()}
                        onChange={(value) => setMonthlyIncome(parseFloat(value) || 0)}
                        placeholder="Enter your monthly after-tax income"
                        helpText="Enter your monthly after-tax income (what you actually receive in your bank account)"
                    />
                </div>

                {/* Budget Categories Sections */}
                <div className="space-y-6">
                    <BudgetSection
                        title="Needs (Essential Expenses)"
                        icon={Home}
                        categories={categories}
                        type="need"
                        bgColor={theme.status.error.bg}
                        textColor={theme.status.error.text}
                        onUpdateCategory={updateCategory}
                    />

                    <BudgetSection
                        title="Wants (Lifestyle Expenses)"
                        icon={Film}
                        categories={categories}
                        type="want"
                        bgColor={theme.status.info.bg}
                        textColor={theme.status.info.text}
                        onUpdateCategory={updateCategory}
                    />

                    <BudgetSection
                        title="Savings & Investments"
                        icon={TrendingUp}
                        categories={categories}
                        type="savings"
                        bgColor={theme.status.success.bg}
                        textColor={theme.status.success.text}
                        onUpdateCategory={updateCategory}
                    />
                </div>

                {/* Enhanced Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Budget Breakdown Pie Chart */}
                    <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-4 transition-all duration-200`}>
                        <h4 className={`font-semibold ${theme.textColors.primary} mb-4 text-lg`}>Spending Breakdown</h4>
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
                                    <Tooltip
                                        formatter={(value: number) => formatCurrency(value)}
                                        labelStyle={{ color: theme.colors.slate[300] }}
                                        contentStyle={{
                                            backgroundColor: theme.colors.slate[800],
                                            border: `1px solid ${theme.colors.slate[600]}`,
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Budget vs Actual Comparison */}
                    <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-4 transition-all duration-200`}>
                        <h4 className={`font-semibold ${theme.textColors.primary} mb-4 text-lg`}>Budget vs Actual</h4>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={comparisonData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.slate[600]} opacity={0.3} />
                                    <XAxis dataKey="category" tick={{ fill: theme.colors.slate[400] }} />
                                    <YAxis
                                        tickFormatter={(value: number) => `$${(value / 1000).toFixed(1)}k`}
                                        tick={{ fill: theme.colors.slate[400] }}
                                    />
                                    <Tooltip
                                        formatter={(value: number) => formatCurrency(value)}
                                        labelStyle={{ color: theme.colors.slate[300] }}
                                        contentStyle={{
                                            backgroundColor: theme.colors.slate[800],
                                            border: `1px solid ${theme.colors.slate[600]}`,
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Legend />
                                    <Bar dataKey="budgeted" fill={theme.colors.slate[400]} name="Budgeted" />
                                    <Bar dataKey="actual" fill={theme.colors.blue[500]} name="Actual" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* 50/30/20 Rule Progress */}
                <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
                    <h4 className={`font-semibold ${theme.textColors.primary} mb-4 text-lg`}>50/30/20 Rule Progress</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                            <div className={`text-2xl font-bold ${summary.needsPercentage <= 50 ? theme.textColors.success : theme.textColors.warning}`}>
                                {summary.needsPercentage}%
                            </div>
                            <div className={`text-sm ${theme.textColors.secondary}`}>Needs (Target: 50%)</div>
                            <div className={`w-full bg-gray-700 rounded-full h-2 mt-2`}>
                                <div
                                    className={`h-2 rounded-full ${summary.needsPercentage <= 50 ? 'bg-green-500' : 'bg-red-500'}`}
                                    style={{ width: `${Math.min(summary.needsPercentage, 100)}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="text-center">
                            <div className={`text-2xl font-bold ${summary.wantsPercentage <= 30 ? theme.textColors.success : theme.textColors.warning}`}>
                                {summary.wantsPercentage}%
                            </div>
                            <div className={`text-sm ${theme.textColors.secondary}`}>Wants (Target: 30%)</div>
                            <div className={`w-full bg-gray-700 rounded-full h-2 mt-2`}>
                                <div
                                    className={`h-2 rounded-full ${summary.wantsPercentage <= 30 ? 'bg-green-500' : 'bg-yellow-500'}`}
                                    style={{ width: `${Math.min(summary.wantsPercentage, 100)}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="text-center">
                            <div className={`text-2xl font-bold ${summary.savingsPercentage >= 20 ? theme.textColors.success : theme.textColors.warning}`}>
                                {summary.savingsPercentage}%
                            </div>
                            <div className={`text-sm ${theme.textColors.secondary}`}>Savings (Target: 20%)</div>
                            <div className={`w-full bg-gray-700 rounded-full h-2 mt-2`}>
                                <div
                                    className={`h-2 rounded-full ${summary.savingsPercentage >= 20 ? 'bg-green-500' : 'bg-yellow-500'}`}
                                    style={{ width: `${Math.min(summary.savingsPercentage, 100)}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CalculatorWrapper>
    );
}
