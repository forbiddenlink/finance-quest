'use client';

import BudgetBuilderCalculator from '@/components/shared/calculators/BudgetBuilderCalculator';
import QASystem from '@/components/shared/QASystem';
import { BarChart3, Home, Gamepad2, DollarSign, Target, Rocket, Sparkles } from 'lucide-react';

export default function BudgetBuilderPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-xl border-b border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="text-amber-400 hover:text-amber-300 font-medium transition-colors"
              >
                ← Back
              </button>
              <h1 className="text-2xl font-bold text-white">Budget Builder Calculator</h1>
            </div>
            <div className="bg-blue-500/20 border border-blue-500/30 px-3 py-1 rounded-full backdrop-blur-sm">
              <span className="text-sm font-medium text-blue-300 flex items-center gap-1">
                <BarChart3 className="w-3 h-3" />
                50/30/20 Rule
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6 bg-blue-500/10 border border-blue-500/20 backdrop-blur-xl rounded-lg p-6">
          <h2 className="text-xl font-bold text-blue-300 mb-2 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Master the 50/30/20 Budgeting Rule
          </h2>
          <p className="text-blue-200 mb-4">
            The proven budgeting method that helps millions of people take control of their finances
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3">
              <h3 className="font-semibold text-amber-300 flex items-center gap-2">
                <Home className="w-4 h-4" />
                50% - Needs
              </h3>
              <p className="text-gray-300">Essential expenses like housing, food, utilities, and transportation</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3">
              <h3 className="font-semibold text-blue-300 flex items-center gap-2">
                <Gamepad2 className="w-4 h-4" />
                30% - Wants
              </h3>
              <p className="text-gray-300">Entertainment, dining out, hobbies, and lifestyle choices</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-3">
              <h3 className="font-semibold text-amber-300 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                20% - Savings
              </h3>
              <p className="text-gray-300">Emergency fund, retirement, investments, and financial goals</p>
            </div>
          </div>
        </div>

        <BudgetBuilderCalculator />

        {/* Q&A System */}
        <QASystem
          className="mt-8"
          isQuizMode={false}
        />

        {/* Learning Objectives */}
        <div className="mt-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-amber-400" />
            What You&apos;ll Learn
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-amber-300 mb-2">Core Budgeting Skills:</h4>
              <ul className="text-gray-300 space-y-1 text-sm">
                <li>• How to categorize expenses effectively</li>
                <li>• The difference between needs and wants</li>
                <li>• How to allocate income using the 50/30/20 rule</li>
                <li>• Tracking actual vs budgeted spending</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-300 mb-2">Financial Planning:</h4>
              <ul className="text-gray-300 space-y-1 text-sm">
                <li>• Setting realistic savings goals</li>
                <li>• Building an emergency fund strategy</li>
                <li>• Balancing present enjoyment with future security</li>
                <li>• Identifying areas for spending optimization</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Success Stories */}
        <div className="mt-6 bg-blue-500/10 border border-blue-500/20 backdrop-blur-xl rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-300 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            Success Stories
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-4">
              <h4 className="font-semibold text-amber-400 mb-2">Sarah&apos;s Transformation</h4>
              <p className="text-gray-300 text-sm">
                &quot;I was spending 70% on wants and had no savings. Using the 50/30/20 rule, I built a $5,000 emergency fund in just 8 months while still enjoying life!&quot;
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-4">
              <h4 className="font-semibold text-amber-400 mb-2">Mike&apos;s Early Retirement</h4>
              <p className="text-gray-300 text-sm">
                &quot;Starting with 20% savings at age 25, I increased to 40% over time. Now I&apos;m on track to retire at 50 thanks to disciplined budgeting and investing.&quot;
              </p>
            </div>
          </div>
        </div>

        {/* Action Steps */}
        <div className="mt-6 bg-slate-500/10 border border-slate-500/20 backdrop-blur-xl rounded-lg p-6">
          <h3 className="text-lg font-bold text-slate-300 mb-4 flex items-center gap-2">
            <Rocket className="w-5 h-5" />
            Your Next Steps
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-4">
              <h4 className="font-semibold text-blue-400 mb-2">1. Track for One Month</h4>
              <p className="text-gray-300 text-sm">
                Use apps like Mint, YNAB, or even a simple spreadsheet to track every expense for 30 days.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-4">
              <h4 className="font-semibold text-blue-400 mb-2">2. Set Up Automatic Savings</h4>
              <p className="text-gray-300 text-sm">
                Open a high-yield savings account and set up automatic transfers for your 20% savings goal.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-lg p-4">
              <h4 className="font-semibold text-blue-400 mb-2">3. Review and Adjust Monthly</h4>
              <p className="text-gray-300 text-sm">
                Budget is a living document. Review your spending patterns and adjust categories as needed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
