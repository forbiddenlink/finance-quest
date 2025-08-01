'use client';

import CompoundInterestCalculator from '@/components/shared/calculators/CompoundInterestCalculator';
import QASystem from '@/components/shared/QASystem';
import { DollarSign, Sprout, TrendingUp, Target, Rocket, Clock, RotateCcw } from 'lucide-react';
import { theme } from '@/lib/theme';

export default function CompoundInterestPage() {
  return (
    <div className={`min-h-screen ${theme.backgrounds.primary}`}>
      {/* Header */}
      <header className={`${theme.backgrounds.header} border-b ${theme.borderColors.accent}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className={`${theme.textColors.accent} hover:${theme.textColors.accentSecondary} font-medium transition-colors`}
              >
                ← Back
              </button>
              <h1 className={`${theme.typography.heading3} ${theme.textColors.primary}`}>Compound Interest Calculator</h1>
            </div>
            <div className={`${theme.status.warning.bg} border ${theme.status.warning.border} px-3 py-1 rounded-full backdrop-blur-sm`}>
              <span className={`${theme.typography.small} font-medium ${theme.textColors.accentSecondary} flex items-center gap-1`}>
                <DollarSign className="w-4 h-4" />
                Wealth Builder
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className={`mb-6 ${theme.status.warning.bg} border ${theme.status.warning.border} backdrop-blur-xl rounded-lg ${theme.spacing.md}`}>
          <h2 className={`${theme.typography.heading4} ${theme.textColors.accentSecondary} mb-2 flex items-center gap-2`}>
            <Sprout className="w-5 h-5" />
            The Eighth Wonder of the World
          </h2>
          <p className={`${theme.textColors.accentSecondary} mb-4`}>
            &quot;Compound interest is the most powerful force in the universe.&quot; - Albert Einstein
          </p>
          <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${theme.typography.small}`}>
            <div className={`${theme.backgrounds.cardHover} backdrop-blur-sm border ${theme.borderColors.primary} rounded-lg p-3`}>
              <h3 className={`font-semibold ${theme.textColors.primary} flex items-center gap-2`}>
                <Clock className={`w-4 h-4 ${theme.textColors.accent}`} />
                Time Advantage
              </h3>
              <p className={theme.textColors.secondary}>Starting 10 years earlier can double your final balance</p>
            </div>
            <div className={`${theme.backgrounds.glass}/10 backdrop-blur-sm border border-white/20 rounded-lg p-3`}>
              <h3 className="font-semibold text-white flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-blue-400" />
                Compounding Effect
              </h3>
              <p className="text-gray-300">Your money earns money, which earns more money</p>
            </div>
            <div className={`${theme.backgrounds.glass}/10 backdrop-blur-sm border border-white/20 rounded-lg p-3`}>
              <h3 className="font-semibold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                Exponential Growth
              </h3>
              <p className="text-gray-300">Small amounts become large sums over time</p>
            </div>
          </div>
        </div>

        <CompoundInterestCalculator />

        {/* Q&A System */}
        <QASystem
          className="mt-8"
          isQuizMode={false}
        />

        {/* Learning Objectives */}
        <div className={`mt-8 ${theme.backgrounds.glass}/5 backdrop-blur-xl border border-white/10 rounded-lg p-6`}>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-400" />
            What You&apos;ll Learn
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-amber-300 mb-2">Core Concepts:</h4>
              <ul className="text-gray-300 space-y-1 text-sm">
                <li>• How compound interest works mathematically</li>
                <li>• The importance of starting early</li>
                <li>• Impact of different interest rates</li>
                <li>• Power of consistent contributions</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-400 mb-2">Real-World Applications:</h4>
              <ul className="text-gray-300 space-y-1 text-sm">
                <li>• Retirement account planning (401k, IRA)</li>
                <li>• Investment strategy development</li>
                <li>• Understanding loan costs and debt</li>
                <li>• Setting realistic financial goals</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Steps */}
        <div className={`mt-6 ${theme.backgrounds.glass}/5 backdrop-blur-xl border border-white/10 rounded-lg p-6`}>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Rocket className="w-5 h-5 text-amber-400" />
            Next Steps
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`${theme.backgrounds.glass}/10 backdrop-blur-sm border border-white/20 rounded-lg p-4`}>
              <h4 className="font-semibold text-amber-300 mb-2">1. Start Now</h4>
              <p className="text-gray-300 text-sm">
                Even $25/month makes a difference. Open a high-yield savings account or investment account today.
              </p>
            </div>
            <div className={`${theme.backgrounds.glass}/10 backdrop-blur-sm border border-white/20 rounded-lg p-4`}>
              <h4 className="font-semibold text-amber-300 mb-2">2. Automate</h4>
              <p className="text-gray-300 text-sm">
                Set up automatic transfers to make saving effortless. Pay yourself first every month.
              </p>
            </div>
            <div className={`${theme.backgrounds.glass}/10 backdrop-blur-sm border border-white/20 rounded-lg p-4`}>
              <h4 className="font-semibold text-amber-300 mb-2">3. Increase Gradually</h4>
              <p className="text-gray-300 text-sm">
                Raise your contribution by 1% each year or whenever you get a raise. Small increases compound too!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
