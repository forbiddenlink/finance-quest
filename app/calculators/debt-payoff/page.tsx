'use client';

import DebtPayoffCalculator from '@/components/shared/calculators/DebtPayoffCalculator';
import QASystem from '@/components/shared/QASystem';
import { CreditCard, Zap, Target, BarChart3, Lightbulb, Rocket, Trophy, Mountain, Snowflake } from 'lucide-react';
import { theme } from '@/lib/theme';

export default function DebtPayoffPage() {
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
              <h1 className={`${theme.typography.heading3} ${theme.textColors.primary}`}>Debt Payoff Calculator</h1>
            </div>
            <div className={`${theme.status.error.bg} border ${theme.status.error.border} px-3 py-1 rounded-full backdrop-blur-sm`}>
              <span className={`${theme.typography.small} font-medium ${theme.status.error.text} flex items-center gap-1`}>
                <CreditCard className="w-4 h-4" />
                Debt Destroyer
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6 bg-orange-500/10 border border-orange-500/20 backdrop-blur-xl rounded-lg p-6">
          <h2 className="text-xl font-bold text-orange-300 mb-2 flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Break Free From Debt Chains
          </h2>
          <p className="text-orange-200 mb-4">
            &quot;The borrower is slave to the lender.&quot; - Proverbs 22:7. Take control with proven debt elimination strategies.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className={`${theme.backgrounds.glass}/10 backdrop-blur-sm border border-white/20 rounded-lg p-3`}>
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Mountain className="w-4 h-4 text-amber-400" />
                Debt Avalanche
              </h3>
              <p className="text-gray-300">Target highest interest rates first - saves the most money mathematically</p>
            </div>
            <div className={`${theme.backgrounds.glass}/10 backdrop-blur-sm border border-white/20 rounded-lg p-3`}>
              <h3 className="font-semibold text-white flex items-center gap-2">
                <Snowflake className="w-4 h-4 text-blue-400" />
                Debt Snowball
              </h3>
              <p className="text-gray-300">Target smallest balances first - builds psychological momentum</p>
            </div>
          </div>
        </div>

        <DebtPayoffCalculator />

        {/* Q&A System */}
        <QASystem
          className="mt-8"
          isQuizMode={false}
        />

        {/* Learning Objectives */}
        <div className={`mt-8 ${theme.backgrounds.glass}/5 backdrop-blur-xl border border-white/10 rounded-lg p-6`}>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-400" />
            What You&apos;ll Master
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-amber-300 mb-2">Debt Strategy Skills:</h4>
              <ul className="text-gray-300 space-y-1 text-sm">
                <li>• Compare avalanche vs snowball methods</li>
                <li>• Calculate total interest costs</li>
                <li>• Understand the power of extra payments</li>
                <li>• Plan realistic payoff timelines</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-orange-800 mb-2">Financial Freedom Planning:</h4>
              <ul className="text-orange-700 space-y-1 text-sm">
                <li>• Prioritize multiple debts effectively</li>
                <li>• Find money for extra debt payments</li>
                <li>• Avoid common debt payoff mistakes</li>
                <li>• Build motivation for long-term success</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Debt Facts */}
        <div className="mt-6 bg-amber-500/10 border border-amber-500/20 backdrop-blur-xl rounded-lg p-6">
          <h3 className="text-lg font-bold text-amber-300 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Eye-Opening Debt Statistics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`${theme.backgrounds.glass}/5 backdrop-blur-xl border border-white/10 rounded-lg p-4 text-center`}>
              <p className="text-2xl font-bold text-amber-400">$6,194</p>
              <p className="text-sm text-gray-300">Average American credit card debt</p>
            </div>
            <div className={`${theme.backgrounds.glass}/5 backdrop-blur-xl border border-white/10 rounded-lg p-4 text-center`}>
              <p className="text-2xl font-bold text-amber-400">18.99%</p>
              <p className="text-sm text-gray-300">Average credit card interest rate</p>
            </div>
            <div className={`${theme.backgrounds.glass}/5 backdrop-blur-xl border border-white/10 rounded-lg p-4 text-center`}>
              <p className="text-2xl font-bold text-amber-400">14.5 years</p>
              <p className="text-sm text-gray-300">Time to pay off $6,194 with minimum payments</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg backdrop-blur-sm">
            <p className="text-sm text-red-300 font-medium">
              <Lightbulb className="w-4 h-4 mr-1 inline" />
              The average person pays $11,931 in interest on that $6,194 debt! Don&apos;t be average.
            </p>
          </div>
        </div>

        {/* Success Stories */}
        <div className="mt-6 bg-blue-500/10 border border-blue-500/20 backdrop-blur-xl rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-300 mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            Debt Freedom Success Stories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`${theme.backgrounds.glass}/5 backdrop-blur-xl border border-white/10 rounded-lg p-4`}>
              <h4 className="font-semibold text-blue-400 mb-2">Jessica&apos;s $47,000 Triumph</h4>
              <p className="text-gray-300 text-sm">
                &quot;I had $47,000 in student loans and credit cards. Using the avalanche method and a side hustle, I became debt-free in 3 years instead of 15!&quot;
              </p>
            </div>
            <div className={`${theme.backgrounds.glass}/5 backdrop-blur-xl border border-white/10 rounded-lg p-4`}>
              <h4 className="font-semibold text-blue-400 mb-2">Mark&apos;s Snowball Victory</h4>
              <p className="text-gray-300 text-sm">
                &quot;The snowball method gave me momentum I needed. Paying off small debts first kept me motivated through the 2-year journey to eliminate $32,000.&quot;
              </p>
            </div>
          </div>
        </div>

        {/* Action Plan */}
        <div className="mt-6 bg-slate-500/10 border border-slate-500/20 backdrop-blur-xl rounded-lg p-6">
          <h3 className="text-lg font-bold text-slate-300 mb-4 flex items-center gap-2">
            <Rocket className="w-5 h-5" />
            Your Debt Freedom Action Plan
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className={`${theme.backgrounds.glass}/5 backdrop-blur-xl border border-white/10 rounded-lg p-4`}>
              <h4 className="font-semibold text-slate-400 mb-2">Week 1: List Everything</h4>
              <p className="text-gray-300 text-sm">
                Gather all statements. List every debt with balance, minimum payment, and interest rate.
              </p>
            </div>
            <div className={`${theme.backgrounds.glass}/5 backdrop-blur-xl border border-white/10 rounded-lg p-4`}>
              <h4 className="font-semibold text-slate-400 mb-2">Week 2: Choose Strategy</h4>
              <p className="text-gray-300 text-sm">
                Pick avalanche (save money) or snowball (build momentum). Use this calculator to compare both.
              </p>
            </div>
            <div className={`${theme.backgrounds.glass}/5 backdrop-blur-xl border border-white/10 rounded-lg p-4`}>
              <h4 className="font-semibold text-slate-400 mb-2">Week 3: Find Extra Money</h4>
              <p className="text-gray-300 text-sm">
                Review budget, sell items, consider side income. Every extra $100/month cuts years off payoff.
              </p>
            </div>
            <div className={`${theme.backgrounds.glass}/5 backdrop-blur-xl border border-white/10 rounded-lg p-4`}>
              <h4 className="font-semibold text-slate-400 mb-2">Week 4: Start Attacking</h4>
              <p className="text-gray-300 text-sm">
                Make first extra payment. Set up automatic payments. Track progress monthly. Celebrate wins!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
