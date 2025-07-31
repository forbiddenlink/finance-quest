'use client';

import React, { useState } from 'react';
import BudgetBuilderCalculator from '@/components/shared/calculators/BudgetBuilderCalculator';
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
                            <h1 className="text-2xl font-bold text-white">Chapter 6: Budgeting Mastery & Cash Flow</h1>
                        </div>
                        <div className="bg-amber-500/20 border border-amber-500/30 px-3 py-1 rounded-full backdrop-blur-sm">
                            <span className="text-sm font-medium text-amber-300">Foundation Track Complete</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Tab Navigation */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-lg p-1 mb-6">
                    <nav className="flex space-x-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center px-6 py-3 rounded-md font-medium transition-all duration-200 ${activeTab === tab.id
                                    ? 'bg-amber-500 text-slate-900 shadow-lg'
                                    : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
                                    }`}
                            >
                                <tab.icon className="w-4 h-4 mr-2" />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                    {activeTab === 'lesson' && (
                        <div className="p-8">
                            <div className="mb-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <PiggyBank className="w-8 h-8 text-amber-400" />
                                    <h2 className="text-2xl font-bold text-white">Budgeting Mastery & Cash Flow Management</h2>
                                </div>
                                <p className="text-gray-300 text-lg">
                                    Master zero-based budgeting, cash flow optimization, and automated savings systems to take complete control of your financial future.
                                </p>
                            </div>

                            {/* Placeholder for actual lesson component */}
                            <div className="space-y-6">
                                <div className="bg-slate-800/50 rounded-xl p-6">
                                    <h3 className="text-xl font-semibold text-white mb-4">🎯 Learning Objectives</h3>
                                    <ul className="space-y-2 text-gray-300">
                                        <li>• Master zero-based budgeting methodology</li>
                                        <li>• Optimize cash flow timing and management</li>
                                        <li>• Implement automated savings systems</li>
                                        <li>• Design sustainable spending frameworks</li>
                                        <li>• Build advanced tracking and monitoring systems</li>
                                        <li>• Create flexible budgets that adapt to life changes</li>
                                    </ul>
                                </div>

                                <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl p-6">
                                    <h3 className={`text-xl font-semibold ${theme.textColors.accentSecondary} mb-4`}>💡 Chapter Preview</h3>
                                    <p className="text-gray-300">
                                        This advanced budgeting chapter completes your Foundation Track education. You&apos;ll learn professional-grade
                                        cash flow management techniques used by financial planners and successful investors. Master these skills
                                        to unlock the Credit & Lending Track!
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-slate-800/50 rounded-xl p-6">
                                        <Target className="w-8 h-8 text-amber-400 mb-3" />
                                        <h4 className="text-lg font-semibold text-white mb-2">Zero-Based Budgeting</h4>
                                        <p className="text-gray-300 text-sm">
                                            Give every dollar a purpose. Learn the professional methodology where income minus expenses equals zero,
                                            ensuring maximum efficiency and intentional spending.
                                        </p>
                                    </div>

                                    <div className="bg-slate-800/50 rounded-xl p-6">
                                        <Calculator className={`w-8 h-8 ${theme.textColors.accent} mb-3`} />
                                        <h4 className="text-lg font-semibold text-white mb-2">Cash Flow Optimization</h4>
                                        <p className="text-gray-300 text-sm">
                                            Master timing strategies, automated systems, and advanced techniques to maximize your financial
                                            efficiency and create sustainable wealth-building habits.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'calculator' && (
                        <div className="p-8">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-white mb-2">Advanced Budget Builder</h2>
                                <p className="text-gray-300">
                                    Use our professional-grade budget calculator with zero-based methodology and automation features.
                                </p>
                            </div>
                            <BudgetBuilderCalculator />
                        </div>
                    )}

                    {activeTab === 'quiz' && (
                        <div className="p-8">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-white mb-2">Budgeting Mastery Assessment</h2>
                                <p className="text-gray-300">
                                    Complete this assessment to unlock the Credit & Lending Track and advance your financial education.
                                </p>
                            </div>

                            {/* Placeholder for quiz component */}
                            <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl p-6">
                                <h3 className="text-xl font-semibold text-amber-300 mb-4">🚧 Quiz Coming Soon</h3>
                                <p className="text-gray-300">
                                    The Chapter 6 assessment is in development. This quiz will test your understanding of:
                                </p>
                                <ul className="mt-4 space-y-2 text-gray-300">
                                    <li>• Zero-based budgeting principles</li>
                                    <li>• Cash flow timing optimization</li>
                                    <li>• Automated savings systems</li>
                                    <li>• Spending framework design</li>
                                    <li>• Budget monitoring and adjustment</li>
                                </ul>
                                <p className="mt-4 text-amber-300 font-medium">
                                    Complete the lesson and practice with the calculator to prepare for the assessment!
                                </p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'assistant' && (
                        <div className="p-8">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-white mb-2">AI Budgeting Coach</h2>
                                <p className="text-gray-300">
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
