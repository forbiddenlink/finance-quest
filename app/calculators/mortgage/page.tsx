'use client';

import MortgageCalculator from '@/components/shared/calculators/MortgageCalculator';
import QASystem from '@/components/shared/QASystem';
import { Home, DollarSign, Calculator, TrendingUp, Target, AlertTriangle } from 'lucide-react';
import { theme } from '@/lib/theme';

export default function MortgageCalculatorPage() {
  return (
    <div className={`min-h-screen ${theme.backgrounds.primary}`}>
      {/* Header */}
      <div className={`${theme.backgrounds.header} border-b ${theme.borderColors.accent}`}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-3 ${theme.status.warning.bg} rounded-xl`}>
              <Home className={`w-8 h-8 ${theme.textColors.accent}`} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Mortgage Calculator</h1>
              <p className="text-gray-300">Make informed home buying decisions with detailed payment analysis</p>
            </div>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 bg-blue-500/20 border border-blue-500/30 rounded-lg p-3 backdrop-blur-sm">
              <Calculator className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-medium text-blue-300">Professional Calculations</span>
            </div>
            <div className="flex items-center gap-3 bg-amber-500/20 border border-amber-500/30 rounded-lg p-3 backdrop-blur-sm">
              <DollarSign className="w-5 h-5 text-amber-400" />
              <span className="text-sm font-medium text-amber-300">Affordability Analysis</span>
            </div>
            <div className="flex items-center gap-3 bg-slate-500/20 border border-slate-500/30 rounded-lg p-3 backdrop-blur-sm">
              <TrendingUp className="w-5 h-5 text-slate-400" />
              <span className="text-sm font-medium text-slate-300">Payment Breakdown</span>
            </div>
            <div className="flex items-center gap-3 bg-blue-500/20 border border-blue-500/30 rounded-lg p-3 backdrop-blur-sm">
              <Target className="w-5 h-5 text-blue-400" />
              <span className="text-sm font-medium text-blue-300">Educational Insights</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Calculator */}
          <div className="xl:col-span-3">
            <MortgageCalculator />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Educational Tips */}
            <div className={`${theme.backgrounds.glass}/5 backdrop-blur-xl border border-white/10 rounded-xl p-6`}>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                Key Considerations
              </h3>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold text-amber-300">Pre-Approval First</h4>
                  <p className="text-gray-300">Get pre-approved to understand your actual borrowing capacity before house hunting.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-amber-300">Total Monthly Cost</h4>
                  <p className="text-gray-300">Remember PITI: Principal, Interest, Taxes, Insurance, plus HOA fees.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-amber-300">Emergency Fund</h4>
                  <p className="text-gray-300">Maintain 3-6 months of expenses even after your down payment.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-amber-300">Market Timing</h4>
                  <p className="text-gray-300">Don&apos;t try to time the market perfectly. Buy when you&apos;re financially ready.</p>
                </div>
              </div>
            </div>

            {/* Q&A System */}
            <QASystem
              isQuizMode={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
