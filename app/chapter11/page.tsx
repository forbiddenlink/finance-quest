'use client';

import { useState } from 'react';
import PortfolioAnalyzerCalculator from '@/components/shared/calculators/PortfolioAnalyzerCalculator';
import QASystem from '@/components/shared/QASystem';
import { BookOpen, Calculator, FileText, Bot, TrendingUp, PieChart, Target, Award, Shield } from 'lucide-react';
import { theme } from '@/lib/theme';

type TabType = 'lesson' | 'calculator' | 'quiz' | 'assistant';

export default function Chapter11Page() {
    const [activeTab, setActiveTab] = useState<TabType>('lesson');

    const tabs = [
        { id: 'lesson' as TabType, label: 'Lessons', icon: BookOpen },
        { id: 'calculator' as TabType, label: 'Calculator', icon: Calculator },
        { id: 'quiz' as TabType, label: 'Quiz', icon: FileText },
        { id: 'assistant' as TabType, label: 'AI Coach', icon: Bot }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900">
            {/* Header */}
            <header className={`${theme.backgrounds.header} border-b border-emerald-500/20`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => window.history.back()}
                                className={`${theme.textColors.primary} hover:${theme.textColors.primary} font-medium transition-colors`}
                            >
                                ← Back to Home
                            </button>
                            <h1 className={`${theme.typography.heading2} ${theme.textColors.primary}`}>Chapter 11: Investment Fundamentals</h1>
                        </div>
                        <div className={`${theme.status.success.bg} border ${theme.status.success.border} px-3 py-1 rounded-full backdrop-blur-sm`}>
                            <span className={`text-sm font-medium ${theme.status.success.text}`}>Investment Track</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Tab Navigation */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className={`${theme.backgrounds.header} backdrop-blur-xl border ${theme.borderColors.primary} rounded-lg p-1 mb-6`}>
                    <nav className="flex space-x-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center px-6 py-3 rounded-md font-medium transition-all duration-200 ${activeTab === tab.id
                                    ? `${theme.status.success.bg} ${theme.textColors.primary} shadow-lg`
                                    : `${theme.textColors.secondary} hover:${theme.textColors.primary} hover:${theme.backgrounds.cardHover}`
                                    }`}
                            >
                                <tab.icon className="w-4 h-4 mr-2" />
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content */}
                <div className={`${theme.backgrounds.glass}/5 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden`}>
                    {activeTab === 'lesson' && (
                        <div className="p-8">
                            <div className="mb-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <TrendingUp className={`w-8 h-8 ${theme.status.success.text}`} />
                                    <h2 className={`text-2xl font-bold ${theme.textColors.primary}`}>Investment Fundamentals</h2>
                                </div>
                                <p className={`${theme.textColors.secondary} text-lg`}>
                                    Master the essentials of investing: from stocks and bonds to portfolio construction, risk management,
                                    and long-term wealth building strategies that grow your money faster than inflation.
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-slate-800/50 rounded-xl p-6">
                                    <h3 className={`text-xl font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                                        <Award className={`w-6 h-6 ${theme.status.success.text}`} />
                                        🎯 Learning Objectives
                                    </h3>
                                    <ul className={`space-y-2 ${theme.textColors.secondary}`}>
                                        <li>• Understand different investment types (stocks, bonds, ETFs, mutual funds)</li>
                                        <li>• Learn risk vs. return fundamentals and portfolio theory</li>
                                        <li>• Master asset allocation and diversification strategies</li>
                                        <li>• Calculate investment returns and understand compound growth</li>
                                        <li>• Build your first investment portfolio with proper risk management</li>
                                        <li>• Develop long-term investing mindset and avoid common mistakes</li>
                                    </ul>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className={`${theme.status.success.bg} border ${theme.status.success.border} rounded-xl p-6`}>
                                        <h3 className={`text-xl font-semibold ${theme.status.success.text} mb-4`}>💡 Chapter Preview</h3>
                                        <p className={`${theme.textColors.secondary}`}>
                                            Begin the Investment Track with foundational knowledge that powers all successful investing.
                                            This chapter builds on your budgeting and debt management skills to start building
                                            real wealth through intelligent investing strategies.
                                        </p>
                                    </div>

                                    <div className={`${theme.status.warning.bg} border ${theme.status.warning.border} rounded-xl p-6`}>
                                        <h3 className={`text-xl font-semibold ${theme.status.warning.text} mb-4`}>🚧 Coming Soon</h3>
                                        <p className={`${theme.textColors.secondary}`}>
                                            Interactive lessons are in development! This chapter will include:
                                        </p>
                                        <ul className={`mt-3 space-y-1 text-sm ${theme.textColors.primary}`}>
                                            <li>• Asset class deep dives with real examples</li>
                                            <li>• Risk assessment and portfolio construction</li>
                                            <li>• Investment account types (401k, IRA, taxable)</li>
                                            <li>• Market dynamics and economic indicators</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className={`${theme.backgrounds.card} rounded-xl p-6`}>
                                        <PieChart className={`w-8 h-8 ${theme.status.info.text} mb-3`} />
                                        <h4 className={`text-lg font-semibold ${theme.textColors.primary} mb-2`}>Asset Allocation</h4>
                                        <p className={`${theme.textColors.secondary} text-sm`}>
                                            Learn how to balance stocks, bonds, and other investments based on your goals,
                                            timeline, and risk tolerance for optimal returns.
                                        </p>
                                    </div>

                                    <div className={`${theme.backgrounds.card} rounded-xl p-6`}>
                                        <Shield className={`w-8 h-8 ${theme.status.success.text} mb-3`} />
                                        <h4 className={`text-lg font-semibold ${theme.textColors.primary} mb-2`}>Risk Management</h4>
                                        <p className={`${theme.textColors.secondary} text-sm`}>
                                            Understand different types of investment risk and how diversification,
                                            time horizon, and asset allocation protect your wealth.
                                        </p>
                                    </div>

                                    <div className={`${theme.backgrounds.card} rounded-xl p-6`}>
                                        <Target className={`w-8 h-8 ${theme.textColors.primary} mb-3`} />
                                        <h4 className={`text-lg font-semibold ${theme.textColors.primary} mb-2`}>Portfolio Building</h4>
                                        <p className={`${theme.textColors.secondary} text-sm`}>
                                            Construct your first investment portfolio using modern portfolio theory
                                            principles and low-cost, diversified investment options.
                                        </p>
                                    </div>
                                </div>

                                {/* Investment Track Overview */}
                                <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-xl p-6">
                                    <h3 className={`text-xl font-semibold ${theme.textColors.primary} mb-4`}>🚀 Investment Track Journey</h3>
                                    <p className={`${theme.textColors.secondary} mb-4`}>
                                        This is the first chapter in the comprehensive Investment Track (Chapters 11-16).
                                        You&apos;ll progress through increasingly sophisticated investing topics:
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <h4 className={`font-medium ${theme.status.success.text} mb-2`}>Foundation Chapters</h4>
                                            <ul className={`space-y-1 ${theme.textColors.secondary}`}>
                                                <li>• Ch 11: Investment Fundamentals</li>
                                                <li>• Ch 12: Stock Market Mastery</li>
                                                <li>• Ch 13: Bond & Fixed Income</li>
                                            </ul>
                                        </div>
                                        <div>
                                            <h4 className={`font-medium ${theme.status.success.text} mb-2`}>Advanced Topics</h4>
                                            <ul className={`space-y-1 ${theme.textColors.secondary}`}>
                                                <li>• Ch 14: Advanced Portfolio Theory</li>
                                                <li>• Ch 15: Alternative Investments</li>
                                                <li>• Ch 16: Tax-Efficient Strategies</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Interactive Preview */}
                                <div className="bg-gradient-to-r from-emerald-500/10 to-purple-500/10 border border-emerald-500/20 rounded-xl p-6">
                                    <h3 className={`text-xl font-semibold ${theme.textColors.primary} mb-4`}>📊 Try the Portfolio Analyzer</h3>
                                    <p className={`${theme.textColors.secondary} mb-4`}>
                                        While the full lesson is in development, start analyzing investment portfolios right now!
                                        Use our professional Portfolio Analyzer to understand asset allocation, diversification,
                                        and get personalized recommendations for optimizing your investments.
                                    </p>
                                    <button
                                        onClick={() => setActiveTab('calculator')}
                                        className={`bg-emerald-600 hover:bg-emerald-700 ${theme.textColors.primary} px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2`}
                                    >
                                        <Calculator className="w-4 h-4" />
                                        Open Portfolio Analyzer
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'calculator' && (
                        <div className="p-8">
                            <div className="mb-6">
                                <h2 className={`text-2xl font-bold ${theme.textColors.primary} mb-2`}>Portfolio Analyzer</h2>
                                <p className={`${theme.textColors.secondary}`}>
                                    Analyze your investment portfolio&apos;s allocation, diversification, and get optimization recommendations.
                                </p>
                            </div>
                            <PortfolioAnalyzerCalculator />
                        </div>
                    )}

                    {activeTab === 'quiz' && (
                        <div className="p-8">
                            <div className="mb-6">
                                <h2 className={`text-2xl font-bold ${theme.textColors.primary} mb-2`}>Investment Fundamentals Assessment</h2>
                                <p className={`${theme.textColors.secondary}`}>
                                    Test your understanding of investment basics, portfolio construction, and risk management principles.
                                </p>
                            </div>

                            <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-xl p-6">
                                <h3 className={`text-xl font-semibold ${theme.status.success.text} mb-4`}>🚧 Assessment Coming Soon</h3>
                                <p className={`${theme.textColors.secondary}`}>
                                    The Chapter 11 assessment is in development. This comprehensive quiz will test your mastery of:
                                </p>
                                <ul className={`mt-4 space-y-2 ${theme.textColors.secondary}`}>
                                    <li>• Investment types and characteristics (stocks, bonds, ETFs, mutual funds)</li>
                                    <li>• Risk vs. return relationships and portfolio theory</li>
                                    <li>• Asset allocation strategies by age and risk tolerance</li>
                                    <li>• Diversification principles and implementation</li>
                                    <li>• Investment account types and tax implications</li>
                                    <li>• Long-term investing strategies and common mistakes to avoid</li>
                                </ul>
                                <div className="mt-6 bg-amber-500/20 border border-amber-500/30 rounded-lg p-4">
                                    <p className={`${theme.status.warning.text} font-medium`}>
                                        💡 Get Ready: Practice with the Portfolio Analyzer calculator and ask our AI coach about investment concepts!
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'assistant' && (
                        <div className="p-8">
                            <div className="mb-6">
                                <h2 className={`text-2xl font-bold ${theme.textColors.primary} mb-2`}>AI Investment Coach</h2>
                                <p className={`${theme.textColors.secondary}`}>
                                    Get expert guidance on investment fundamentals, portfolio construction, and wealth building strategies.
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
