'use client';

import TaxOptimizerCalculator from '@/components/shared/calculators/TaxOptimizerCalculator';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TaxOptimizerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-10">
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
              <h1 className="text-2xl font-bold text-gray-900">Tax Optimizer</h1>
            </div>
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              Tax Planning
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TaxOptimizerCalculator />
      </main>
    </div>
  );
}
