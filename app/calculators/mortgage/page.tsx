'use client';

import MortgageCalculator from '@/components/shared/calculators/MortgageCalculator';
import QASystem from '@/components/shared/QASystem';
import { Home, DollarSign, Calculator, TrendingUp, Target, AlertTriangle } from 'lucide-react';
import { theme } from '@/lib/theme';

export default function MortgageCalculatorPage() {
  return (
    <div className={`min-h-screen ${theme.backgrounds.primary}`}>
      {/* Header */}
      <div className={`${theme.backgrounds.header} border-b ${theme.borderColors.primary}`}>
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
            <div className={`p-2.5 sm:p-3 ${theme.status.warning.bg} rounded-lg sm:rounded-xl flex-shrink-0`}>
              <Home className={`w-6 h-6 sm:w-8 sm:h-8 ${theme.textColors.primary}`} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">Mortgage Calculator</h1>
              <p className="text-sm sm:text-base text-gray-300">Make informed home buying decisions with detailed payment analysis</p>
            </div>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="flex items-center gap-2.5 bg-blue-500/20 border border-blue-500/30 rounded-lg p-2.5 sm:p-3 backdrop-blur-sm">
              <Calculator className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-blue-300">Professional Calculations</span>
            </div>
            <div className="flex items-center gap-2.5 bg-amber-500/20 border border-amber-500/30 rounded-lg p-2.5 sm:p-3 backdrop-blur-sm">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-amber-300">Affordability Analysis</span>
            </div>
            <div className="flex items-center gap-2.5 bg-slate-500/20 border border-slate-500/30 rounded-lg p-2.5 sm:p-3 backdrop-blur-sm">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-slate-300">Payment Breakdown</span>
            </div>
            <div className="flex items-center gap-2.5 bg-blue-500/20 border border-blue-500/30 rounded-lg p-2.5 sm:p-3 backdrop-blur-sm">
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium text-blue-300">Educational Insights</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {/* Calculator */}
          <div className="lg:col-span-2 xl:col-span-3">
            <MortgageCalculator />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Educational Tips */}
            <div className={`${theme.backgrounds.glass}/5 backdrop-blur-xl border border-white/10 rounded-lg sm:rounded-xl p-4 sm:p-6`}>
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 flex-shrink-0" />
                Key Considerations
              </h3>
              <div className="space-y-3 sm:space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold text-amber-300 mb-1">Pre-Approval First</h4>
                  <p className="text-gray-300 text-xs sm:text-sm">Get pre-approved to understand your actual borrowing capacity before house hunting.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-amber-300 mb-1">Total Monthly Cost</h4>
                  <p className="text-gray-300 text-xs sm:text-sm">Remember PITI: Principal, Interest, Taxes, Insurance, plus HOA fees.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-amber-300 mb-1">Emergency Fund</h4>
                  <p className="text-gray-300 text-xs sm:text-sm">Maintain 3-6 months of expenses even after your down payment.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-amber-300 mb-1">Market Timing</h4>
                  <p className="text-gray-300 text-xs sm:text-sm">Don&apos;t try to time the market perfectly. Buy when you&apos;re financially ready.</p>
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
