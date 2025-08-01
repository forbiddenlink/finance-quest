'use client';

import RetirementPlannerCalculator from '@/components/shared/calculators/RetirementPlannerCalculator';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { theme } from '@/lib/theme';

export default function RetirementPlannerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* Header */}
      <header className={`${theme.backgrounds.glass}/80 backdrop-blur-xl border-b ${theme.borderColors.primary}/50 sticky top-0 z-10`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/calculators"
                className="flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Calculators
              </Link>
              <h1 className={`text-2xl font-bold ${theme.textColors.primary}`}>Retirement Planner</h1>
            </div>
            <div className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
              Investment Track
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RetirementPlannerCalculator />
      </main>
    </div>
  );
}
