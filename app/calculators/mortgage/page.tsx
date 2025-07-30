'use client';

import MortgageCalculator from '@/components/shared/calculators/MortgageCalculator';
import QASystem from '@/components/shared/QASystem';
import { Home, DollarSign, Calculator, TrendingUp, Target, AlertTriangle } from 'lucide-react';

export default function MortgageCalculatorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Home className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mortgage Calculator</h1>
              <p className="text-gray-600">Make informed home buying decisions with detailed payment analysis</p>
            </div>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 bg-blue-50 rounded-lg p-3">
              <Calculator className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Professional Calculations</span>
            </div>
            <div className="flex items-center gap-3 bg-green-50 rounded-lg p-3">
              <DollarSign className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">Affordability Analysis</span>
            </div>
            <div className="flex items-center gap-3 bg-purple-50 rounded-lg p-3">
              <TrendingUp className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-800">Payment Breakdown</span>
            </div>
            <div className="flex items-center gap-3 bg-orange-50 rounded-lg p-3">
              <Target className="w-5 h-5 text-orange-600" />
              <span className="text-sm font-medium text-orange-800">Educational Insights</span>
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
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Key Considerations
              </h3>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold text-gray-800">Pre-Approval First</h4>
                  <p className="text-gray-600">Get pre-approved to understand your actual borrowing capacity before house hunting.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Total Monthly Cost</h4>
                  <p className="text-gray-600">Remember PITI: Principal, Interest, Taxes, Insurance, plus HOA fees.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Emergency Fund</h4>
                  <p className="text-gray-600">Maintain 3-6 months of expenses even after your down payment.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">Market Timing</h4>
                  <p className="text-gray-600">Don&apos;t try to time the market perfectly. Buy when you&apos;re financially ready.</p>
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
