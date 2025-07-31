'use client';

import { useState } from 'react';
import RewardsOptimizerCalculator from '@/components/shared/calculators/RewardsOptimizerCalculator';
import QASystem from '@/components/shared/QASystem';
import { BookOpen, Calculator, FileText, Bot, CreditCard, Star, Zap, Award } from 'lucide-react';
import { theme } from '@/lib/theme';

type TabType = 'lesson' | 'calculator' | 'quiz' | 'assistant';

export default function Chapter8Page() {
    const [activeTab, setActiveTab] = useState<TabType>('lesson');

    const tabs = [
        { id: 'lesson' as TabType, label: 'Lessons', icon: BookOpen },
        { id: 'calculator' as TabType, label: 'Calculator', icon: Calculator },
        { id: 'quiz' as TabType, label: 'Quiz', icon: FileText },
        { id: 'assistant' as TabType, label: 'AI Coach', icon: Bot }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
            {/* Header */}
            <header className={`${theme.backgrounds.header} border-b border-amber-500/20`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => window.history.back()}
                                className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
                            >
                                ← Back to Home
                            </button>
                            <h1 className={`${theme.typography.heading2} ${theme.textColors.primary}`}>Chapter 8: Credit Cards Mastery</h1>
                        </div>
                        <div className="bg-purple-500/20 border border-purple-500/30 px-3 py-1 rounded-full backdrop-blur-sm">
                            <span className="text-sm font-medium text-purple-300">Credit & Lending Track</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Tab Navigation */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.muted} rounded-lg p-1 mb-6`}>
                    <nav className="flex space-x-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center px-6 py-3 rounded-md font-medium transition-all duration-200 ${activeTab === tab.id
                                    ? 'bg-purple-500 text-slate-900 shadow-lg'
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
                                    <CreditCard className="w-8 h-8 text-purple-400" />
                                    <h2 className="text-2xl font-bold text-white">Credit Cards Mastery</h2>
                                </div>
                                <p className="text-gray-300 text-lg">
                                    Master credit card strategies, maximize rewards, and build excellent credit while avoiding common pitfalls that cost Americans billions annually.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-slate-800/50 rounded-xl p-6">
                                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                                        <Award className="w-6 h-6 text-purple-400" />
                                        🎯 Learning Objectives
                                    </h3>
                                    <ul className="space-y-2 text-gray-300">
                                        <li>• Master credit card reward strategies and optimization techniques</li>
                                        <li>• Understand different card types and their optimal use cases</li>
                                        <li>• Learn to avoid interest charges and maximize benefits</li>
                                        <li>• Develop responsible credit utilization strategies</li>
                                        <li>• Build systems for tracking and maximizing rewards</li>
                                        <li>• Protect yourself from fraud and identity theft</li>
                                    </ul>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-6">
                                        <h3 className="text-xl font-semibold text-purple-300 mb-4">💡 Chapter Preview</h3>
                                        <p className="text-gray-300">
                                            This advanced credit card chapter builds on your Foundation Track knowledge. Learn professional-grade
                                            strategies that can earn you hundreds or thousands in rewards annually while building excellent credit.
                                            Master the tools and techniques used by credit optimization experts!
                                        </p>
                                    </div>

                                    <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl p-6">
                                        <h3 className="text-xl font-semibold text-amber-300 mb-4">🚧 Coming Soon</h3>
                                        <p className="text-gray-300">
                                            Interactive lessons are in development! This chapter will include:
                                        </p>
                                        <ul className="mt-3 space-y-1 text-sm text-amber-200">
                                            <li>• Reward category optimization strategies</li>
                                            <li>• Signup bonus maximization techniques</li>
                                            <li>• Credit card churning fundamentals</li>
                                            <li>• Annual fee vs. reward calculation methods</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-slate-800/50 rounded-xl p-6">
                                        <Star className="w-8 h-8 text-amber-400 mb-3" />
                                        <h4 className="text-lg font-semibold text-white mb-2">Rewards Mastery</h4>
                                        <p className="text-gray-300 text-sm">
                                            Learn to earn 2-6% back on every purchase through strategic card selection,
                                            category optimization, and smart spending timing.
                                        </p>
                                    </div>

                                    <div className="bg-slate-800/50 rounded-xl p-6">
                                        <Zap className={`w-8 h-8 ${theme.textColors.accent} mb-3`} />
                                        <h4 className="text-lg font-semibold text-white mb-2">Credit Building</h4>
                                        <p className={`${theme.textColors.secondary} text-sm`}>
                                            Use credit cards as powerful tools for building excellent credit scores while
                                            earning rewards and protecting your finances.
                                        </p>
                                    </div>

                                    <div className="bg-slate-800/50 rounded-xl p-6">
                                        <Award className="w-8 h-8 text-green-400 mb-3" />
                                        <h4 className="text-lg font-semibold text-white mb-2">Advanced Strategies</h4>
                                        <p className="text-gray-300 text-sm">
                                            Master professional techniques like manufactured spending, balance transfer
                                            optimization, and travel hacking for maximum benefit.
                                        </p>
                                    </div>
                                </div>

                                {/* Interactive Preview */}
                                <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-6">
                                    <h3 className="text-xl font-semibold text-white mb-4">🚀 Try the Rewards Optimizer</h3>
                                    <p className="text-gray-300 mb-4">
                                        While the full lesson is in development, you can start optimizing your rewards right now!
                                        Use our professional Rewards Optimizer calculator to see which credit cards will maximize
                                        your earnings based on your specific spending patterns.
                                    </p>
                                    <button
                                        onClick={() => setActiveTab('calculator')}
                                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                                    >
                                        <Calculator className="w-4 h-4" />
                                        Open Rewards Calculator
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'calculator' && (
                        <div className="p-8">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-white mb-2">Rewards Optimizer Calculator</h2>
                                <p className="text-gray-300">
                                    Maximize your credit card rewards with personalized recommendations based on your spending patterns.
                                </p>
                            </div>
                            <RewardsOptimizerCalculator />
                        </div>
                    )}

                    {activeTab === 'quiz' && (
                        <div className="p-8">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-white mb-2">Credit Cards Mastery Assessment</h2>
                                <p className="text-gray-300">
                                    Test your understanding of credit card optimization strategies and advanced techniques.
                                </p>
                            </div>

                            <div className="bg-purple-500/20 border border-purple-500/30 rounded-xl p-6">
                                <h3 className="text-xl font-semibold text-purple-300 mb-4">🚧 Assessment Coming Soon</h3>
                                <p className="text-gray-300">
                                    The Chapter 8 assessment is in development. This comprehensive quiz will test your mastery of:
                                </p>
                                <ul className="mt-4 space-y-2 text-gray-300">
                                    <li>• Credit card reward optimization strategies</li>
                                    <li>• Annual fee vs. reward calculations</li>
                                    <li>• Signup bonus maximization techniques</li>
                                    <li>• Responsible credit utilization methods</li>
                                    <li>• Fraud protection and security best practices</li>
                                    <li>• Advanced credit building strategies</li>
                                </ul>
                                <div className="mt-6 bg-amber-500/20 border border-amber-500/30 rounded-lg p-4">
                                    <p className="text-amber-300 font-medium">
                                        💡 Get Ready: Practice with the Rewards Optimizer calculator and ask our AI coach questions to prepare!
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'assistant' && (
                        <div className="p-8">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-white mb-2">AI Credit Card Coach</h2>
                                <p className="text-gray-300">
                                    Get expert guidance on credit card strategies, reward optimization, and advanced techniques.
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
