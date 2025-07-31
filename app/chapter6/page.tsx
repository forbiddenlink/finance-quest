'use client';

import React, { useState } from 'react';
import BudgetBuilderCalculator from '@/components/shared/calculators/BudgetBuilderCalculator';
import BudgetingMasteryQuiz from '@/components/chapters/fundamentals/assessments/BudgetingMasteryQuiz';
import QASystem from '@/components/shared/QASystem';
import { theme } from '@/lib/theme';
import { BookOpen, Calculator, FileText, Bot, Target, PiggyBank } from 'lucide-react';

type TabType = 'lesson' | 'calculator' | 'quiz' | 'assistant';

export default function Chapter6Page() {
    const [activeTab, setActiveTab] = useState<TabType>('lesson');

    const tabs = [
        { id: 'lesson' as TabType, label: 'Lessons', icon: BookOpen },
        { id: 'calculator' as TabType, label: 'Calculator', icon: Calculator },
        { id: 'quiz' as TabType, label: 'Quiz', icon: FileText },
        { id: 'assistant' as TabType, label: 'AI Coach', icon: Bot }
    ];

    return (
        <div className={theme.backgrounds.primary}>
            {/* Header */}
            <header className={`${theme.backgrounds.header} ${theme.borderColors.accent} border-b`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => window.history.back()}
                                className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
                            >
                                ← Back to Home
                            </button>
                            <h1 className={`${theme.typography.heading2} ${theme.textColors.primary}`}>Chapter 6: Budgeting Mastery & Cash Flow</h1>
                        </div>
                        <div className={`${theme.status.warning.bg} border ${theme.status.warning.border} ${theme.spacing.xs} rounded-full backdrop-blur-sm`}>
                            <span className={`${theme.typography.small} font-medium ${theme.status.warning.text}`}>Foundation Track Complete</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Tab Navigation */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className={`${theme.tabs.container} rounded-lg p-1 mb-6`}>
                    <nav className="flex space-x-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center px-6 py-3 rounded-md font-medium transition-all duration-200 ${activeTab === tab.id
                                    ? theme.tabs.active
                                    : theme.tabs.inactive
                                    }`}
                            >
                                <tab.icon className="w-4 h-4 mr-2" />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl ${theme.shadows.xl} overflow-hidden`}>
                    {activeTab === 'lesson' && (
                        <div className={theme.spacing.lg}>
                            <div className="mb-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <PiggyBank className={`w-8 h-8 ${theme.textColors.accent}`} />
                                    <h2 className={`${theme.typography.heading2} ${theme.textColors.primary}`}>Budgeting Mastery & Cash Flow Management</h2>
                                </div>
                                <p className={`${theme.textColors.secondary} text-lg`}>
                                    Master zero-based budgeting, cash flow optimization, and automated savings systems to take complete control of your financial future.
                                </p>
                            </div>

                            {/* Placeholder for actual lesson component */}
                            <div className="space-y-6">
                                <div className={`${theme.backgrounds.card} rounded-xl ${theme.spacing.md}`}>
                                    <h3 className={`${theme.typography.heading4} ${theme.textColors.primary} mb-4`}>🎯 Learning Objectives</h3>
                                    <ul className={`space-y-2 ${theme.textColors.secondary}`}>
                                        <li>• Master zero-based budgeting methodology</li>
                                        <li>• Optimize cash flow timing and management</li>
                                        <li>• Implement automated savings systems</li>
                                        <li>• Design sustainable spending frameworks</li>
                                        <li>• Build advanced tracking and monitoring systems</li>
                                        <li>• Create flexible budgets that adapt to life changes</li>
                                    </ul>
                                </div>

                                <div className={`${theme.status.warning.bg} border ${theme.status.warning.border} rounded-xl ${theme.spacing.md}`}>
                                    <h3 className={`${theme.typography.heading4} ${theme.textColors.accentSecondary} mb-4`}>💡 Chapter Preview</h3>
                                    <p className={theme.textColors.secondary}>
                                        This advanced budgeting chapter completes your Foundation Track education. You&apos;ll learn professional-grade
                                        cash flow management techniques used by financial planners and successful investors. Master these skills
                                        to unlock the Credit & Lending Track!
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className={`${theme.backgrounds.card} rounded-xl ${theme.spacing.md}`}>
                                        <Target className={`w-8 h-8 ${theme.textColors.accent} mb-3`} />
                                        <h4 className={`${theme.typography.heading4} ${theme.textColors.primary} mb-2`}>Zero-Based Budgeting</h4>
                                        <p className={`${theme.textColors.secondary} ${theme.typography.small}`}>
                                            Give every dollar a purpose. Learn the professional methodology where income minus expenses equals zero,
                                            ensuring maximum efficiency and intentional spending.
                                        </p>
                                    </div>

                                    <div className={`${theme.backgrounds.card} rounded-xl ${theme.spacing.md}`}>
                                        <Calculator className={`w-8 h-8 ${theme.textColors.accent} mb-3`} />
                                        <h4 className={`${theme.typography.heading4} ${theme.textColors.primary} mb-2`}>Cash Flow Optimization</h4>
                                        <p className={`${theme.textColors.secondary} ${theme.typography.small}`}>
                                            Master timing strategies, automated systems, and advanced techniques to maximize your financial
                                            efficiency and create sustainable wealth-building habits.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'calculator' && (
                        <div className={theme.spacing.lg}>
                            <div className="mb-6">
                                <h2 className={`${theme.typography.heading2} ${theme.textColors.primary} mb-2`}>Advanced Budget Builder</h2>
                                <p className={theme.textColors.secondary}>
                                    Use our professional-grade budget calculator with zero-based methodology and automation features.
                                </p>
                            </div>
                            <BudgetBuilderCalculator />
                        </div>
                    )}

                    {activeTab === 'quiz' && (
                        <div className={theme.spacing.lg}>
                            <div className="mb-6">
                                <h2 className={`${theme.typography.heading2} ${theme.textColors.primary} mb-2`}>Budgeting Mastery Assessment</h2>
                                <p className={theme.textColors.secondary}>
                                    Complete this assessment to unlock the Credit & Lending Track and advance your financial education.
                                </p>
                            </div>

                            <BudgetingMasteryQuiz onComplete={(score, total) => {
                                console.log(`Quiz completed with score: ${score}/${total}`);
                            }} />
                        </div>
                    )}

                    {activeTab === 'assistant' && (
                        <div className={theme.spacing.lg}>
                            <div className="mb-6">
                                <h2 className={`${theme.typography.heading2} ${theme.textColors.primary} mb-2`}>AI Budgeting Coach</h2>
                                <p className={theme.textColors.secondary}>
                                    Get personalized guidance on budgeting strategies, cash flow optimization, and automated savings systems.
                                </p>
                            </div>
                            <QASystem />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
