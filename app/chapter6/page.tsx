'use client';

import React, { useState } from 'react';
import BudgetBuilderCalculator from '@/components/shared/calculators/BudgetBuilderCalculator';
import BudgetingMasteryQuiz from '@/components/chapters/fundamentals/assessments/BudgetingMasteryQuiz';
import BudgetingMasteryLesson from '@/components/chapters/fundamentals/lessons/BudgetingMasteryLesson';
import QASystem from '@/components/shared/QASystem';
import { theme } from '@/lib/theme';
import { BookOpen, Calculator, FileText, Bot } from 'lucide-react';

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
                                className={`${theme.textColors.accent} hover:${theme.textColors.primary} font-medium transition-colors`}
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
                            <BudgetingMasteryLesson onComplete={() => {
                                // Handle lesson completion - could trigger achievement unlock
                                console.log('Chapter 6 lesson completed!');
                            }} />
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
