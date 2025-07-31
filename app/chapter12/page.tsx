'use client';

import { useState } from 'react';
import RetirementPlannerCalculator from '@/components/shared/calculators/RetirementPlannerCalculator';
import QASystem from '@/components/shared/QASystem';
import { BookOpen, Calculator, FileText, Bot, TrendingUp, BarChart3, DollarSign, Award, Target } from 'lucide-react';

type TabType = 'lesson' | 'calculator' | 'quiz' | 'assistant';

export default function Chapter12Page() {
  const [activeTab, setActiveTab] = useState<TabType>('lesson');

  const tabs = [
    { id: 'lesson' as TabType, label: 'Lessons', icon: BookOpen },
    { id: 'calculator' as TabType, label: 'Calculator', icon: Calculator },
    { id: 'quiz' as TabType, label: 'Quiz', icon: FileText },
    { id: 'assistant' as TabType, label: 'AI Coach', icon: Bot }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900 to-blue-900">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-xl border-b border-green-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="text-green-400 hover:text-green-300 font-medium transition-colors"
              >
                ← Back to Home
              </button>
              <h1 className="text-2xl font-bold text-white">Chapter 12: Stock Market Mastery</h1>
            </div>
            <div className="bg-green-500/20 border border-green-500/30 px-3 py-1 rounded-full backdrop-blur-sm">
              <span className="text-sm font-medium text-green-300">Investment Track</span>
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
                className={`flex items-center px-6 py-3 rounded-md font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-green-500 text-slate-900 shadow-lg'
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
                  <TrendingUp className="w-8 h-8 text-green-400" />
                  <h2 className="text-2xl font-bold text-white">Stock Market Mastery</h2>
                </div>
                <p className="text-gray-300 text-lg">
                  Master stock investing with confidence: from fundamental analysis and valuation methods to 
                  building a diversified stock portfolio that grows wealth over the long term.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="bg-slate-800/50 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Award className="w-6 h-6 text-green-400" />
                    🎯 Learning Objectives
                  </h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Understand stock fundamentals: ownership, dividends, and growth potential</li>
                    <li>• Master valuation methods (P/E ratios, DCF, comparative analysis)</li>
                    <li>• Learn sector analysis and market timing strategies</li>
                    <li>• Build a diversified stock portfolio across industries and market caps</li>
                    <li>• Develop long-term wealth building strategies through equity investing</li>
                    <li>• Manage risk with position sizing and stop-loss strategies</li>
                  </ul>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-green-300 mb-4">💡 Chapter Preview</h3>
                    <p className="text-gray-300">
                      Building on Investment Fundamentals (Chapter 11), this advanced chapter dives deep into 
                      stock market investing. Learn the strategies used by successful long-term investors to 
                      build wealth through equity ownership in growing companies.
                    </p>
                  </div>

                  <div className="bg-amber-500/20 border border-amber-500/30 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-amber-300 mb-4">🚧 Coming Soon</h3>
                    <p className="text-gray-300">
                      Interactive lessons are in development! This chapter will include:
                    </p>
                    <ul className="mt-3 space-y-1 text-sm text-amber-200">
                      <li>• Stock analysis tools and screening methods</li>
                      <li>• Value vs. growth investing strategies</li>
                      <li>• Dividend investing and DRIP programs</li>
                      <li>• Market psychology and behavioral finance</li>
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-800/50 rounded-xl p-6">
                    <BarChart3 className="w-8 h-8 text-blue-400 mb-3" />
                    <h4 className="text-lg font-semibold text-white mb-2">Stock Analysis</h4>
                    <p className="text-gray-300 text-sm">
                      Learn to evaluate companies using fundamental analysis, reading financial statements, 
                      and understanding competitive advantages (moats).
                    </p>
                  </div>

                  <div className="bg-slate-800/50 rounded-xl p-6">
                    <DollarSign className="w-8 h-8 text-green-400 mb-3" />
                    <h4 className="text-lg font-semibold text-white mb-2">Valuation Methods</h4>
                    <p className="text-gray-300 text-sm">
                      Master key valuation techniques including P/E ratios, PEG ratios, 
                      discounted cash flow models, and relative valuation methods.
                    </p>
                  </div>

                  <div className="bg-slate-800/50 rounded-xl p-6">
                    <Target className="w-8 h-8 text-purple-400 mb-3" />
                    <h4 className="text-lg font-semibold text-white mb-2">Portfolio Construction</h4>
                    <p className="text-gray-300 text-sm">
                      Build a balanced stock portfolio with proper diversification across 
                      sectors, market caps, and geographic regions for optimal risk-adjusted returns.
                    </p>
                  </div>
                </div>

                {/* Stock Market Strategies */}
                <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">📈 Investment Strategies Overview</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium text-green-300 mb-2">Value Investing</h4>
                      <ul className="space-y-1 text-gray-300">
                        <li>• Buy undervalued companies with strong fundamentals</li>
                        <li>• Focus on low P/E ratios and strong balance sheets</li>
                        <li>• Long-term hold strategy (Warren Buffett approach)</li>
                        <li>• Emphasis on dividend-paying, established companies</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-green-300 mb-2">Growth Investing</h4>
                      <ul className="space-y-1 text-gray-300">
                        <li>• Invest in rapidly growing companies and sectors</li>
                        <li>• Focus on revenue growth and market expansion</li>
                        <li>• Higher risk but higher potential returns</li>
                        <li>• Technology, biotech, and emerging industries</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                    <h4 className="font-medium text-blue-300 mb-2">💡 Pro Tip: Diversified Approach</h4>
                    <p className="text-gray-300 text-sm">
                      Most successful investors use a blend of value and growth strategies, adjusting their approach 
                      based on market conditions, personal goals, and risk tolerance. The key is consistency and 
                      long-term thinking rather than trying to time the market.
                    </p>
                  </div>
                </div>

                {/* Interactive Preview */}
                <div className="bg-gradient-to-r from-green-500/10 to-purple-500/10 border border-green-500/20 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">🛠️ Try the Retirement Planner</h3>
                  <p className="text-gray-300 mb-4">
                    While the full lesson is in development, explore how stock market investing fits into your 
                    long-term retirement strategy! Use our Retirement Planner to see how consistent stock market 
                    investing can build substantial wealth over time through compound growth.
                  </p>
                  <button
                    onClick={() => setActiveTab('calculator')}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                  >
                    <Calculator className="w-4 h-4" />
                    Open Retirement Planner
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'calculator' && (
            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Retirement Planner</h2>
                <p className="text-gray-300">
                  Plan your retirement with confidence and see how stock market investing builds long-term wealth.
                </p>
              </div>
              <RetirementPlannerCalculator />
            </div>
          )}

          {activeTab === 'quiz' && (
            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Stock Market Mastery Assessment</h2>
                <p className="text-gray-300">
                  Test your understanding of stock analysis, valuation methods, and portfolio construction strategies.
                </p>
              </div>
              
              <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-6">
                <h3 className="text-xl font-semibold text-green-300 mb-4">🚧 Assessment Coming Soon</h3>
                <p className="text-gray-300">
                  The Chapter 12 assessment is in development. This comprehensive quiz will test your mastery of:
                </p>
                <ul className="mt-4 space-y-2 text-gray-300">
                  <li>• Stock fundamentals and ownership concepts</li>
                  <li>• Valuation methods (P/E, PEG, DCF analysis)</li>
                  <li>• Fundamental vs. technical analysis approaches</li>
                  <li>• Value vs. growth investing strategies</li>
                  <li>• Portfolio diversification and risk management</li>
                  <li>• Market psychology and behavioral finance principles</li>
                </ul>
                <div className="mt-6 bg-amber-500/20 border border-amber-500/30 rounded-lg p-4">
                  <p className="text-amber-300 font-medium">
                    💡 Get Ready: Practice with the Retirement Planner to understand long-term stock investing returns!
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'assistant' && (
            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">AI Stock Market Coach</h2>
                <p className="text-gray-300">
                  Get expert guidance on stock analysis, investment strategies, and portfolio construction.
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
