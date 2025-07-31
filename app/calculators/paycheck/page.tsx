'use client';

import PaycheckCalculator from '@/components/chapters/fundamentals/calculators/PaycheckCalculator';
import QASystem from '@/components/shared/QASystem';
import { Calculator, DollarSign, BarChart3, Target, Lightbulb, Rocket, TrendingDown } from 'lucide-react';

export default function PaycheckCalculatorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.history.back()}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Back
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Paycheck Calculator</h1>
            </div>
            <div className="bg-blue-100 px-3 py-1 rounded-full">
              <span className="text-sm font-medium text-blue-800 flex items-center gap-1">
                <Calculator className="w-4 h-4" />
                Take-Home Pay
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6 bg-gradient-to-r from-blue-900/20 to-slate-800/30 border border-blue-600/30 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-xl font-bold text-blue-900 mb-2 flex items-center gap-2">
            <DollarSign className="w-5 h-5" />
            Understand Your Take-Home Pay
          </h2>
          <p className="text-blue-800 mb-4">
            Your salary isn&apos;t what you actually receive. Learn the difference between gross and net pay.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white bg-opacity-50 rounded-lg p-3">
              <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Gross Pay
              </h3>
              <p className="text-blue-700">Your total salary before any deductions</p>
            </div>
            <div className="bg-white bg-opacity-50 rounded-lg p-3">
              <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Deductions
              </h3>
              <p className="text-blue-700">Taxes, insurance, retirement contributions</p>
            </div>
            <div className="bg-white bg-opacity-50 rounded-lg p-3">
              <h3 className="font-semibold text-blue-900 flex items-center gap-2">
                <TrendingDown className="w-4 h-4" />
                Net Pay
              </h3>
              <p className="text-blue-700">What actually hits your bank account</p>
            </div>
          </div>
        </div>

        <PaycheckCalculator />

        {/* Q&A System */}
        <QASystem
          className="mt-8"
          isQuizMode={false}
        />

        {/* Learning Objectives */}
        <div className="mt-8 bg-cyan-50 border border-cyan-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-cyan-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5" />
            What You&apos;ll Learn
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-cyan-800 mb-2">Paycheck Basics:</h4>
              <ul className="text-cyan-700 space-y-1 text-sm">
                <li>• Difference between gross and net pay</li>
                <li>• Common payroll deductions and their purposes</li>
                <li>• How tax withholdings work</li>
                <li>• Impact of pre-tax vs post-tax deductions</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-cyan-800 mb-2">Financial Planning:</h4>
              <ul className="text-cyan-700 space-y-1 text-sm">
                <li>• Budget based on actual take-home pay</li>
                <li>• Optimize tax withholdings</li>
                <li>• Maximize employer benefits</li>
                <li>• Plan for salary negotiations</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Paycheck Tips */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-yellow-900 mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            Paycheck Optimization Tips
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white bg-opacity-50 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">Max Out Pre-Tax Benefits</h4>
              <p className="text-yellow-700 text-sm">
                Contribute to 401k, HSA, and flexible spending accounts to reduce taxable income and save on taxes.
              </p>
            </div>
            <div className="bg-white bg-opacity-50 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">Review Your W-4</h4>
              <p className="text-yellow-700 text-sm">
                Adjust tax withholdings annually to avoid big refunds (you&apos;re lending money to the government interest-free).
              </p>
            </div>
          </div>
        </div>

        {/* Action Steps */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-green-900 mb-4 flex items-center gap-2">
            <Rocket className="w-5 h-5" />
            Your Next Steps
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white bg-opacity-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">1. Calculate Your Real Hourly Rate</h4>
              <p className="text-green-700 text-sm">
                Divide your annual take-home pay by total hours worked to see what you really earn per hour.
              </p>
            </div>
            <div className="bg-white bg-opacity-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">2. Review All Deductions</h4>
              <p className="text-green-700 text-sm">
                Look at your pay stub. Are you enrolled in all beneficial programs like employer 401k match?
              </p>
            </div>
            <div className="bg-white bg-opacity-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">3. Budget on Net Pay</h4>
              <p className="text-green-700 text-sm">
                Always base your budget on take-home pay, not gross salary. This prevents overspending.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
