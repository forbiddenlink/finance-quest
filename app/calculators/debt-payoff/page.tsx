'use client';

import DebtPayoffCalculator from '@/components/shared/calculators/DebtPayoffCalculator';
import QASystem from '@/components/shared/QASystem';

export default function DebtPayoffPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
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
              <h1 className="text-2xl font-bold text-gray-900">Debt Payoff Calculator</h1>
            </div>
            <div className="bg-red-100 px-3 py-1 rounded-full">
              <span className="text-sm font-medium text-red-800">💳 Debt Destroyer</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-900 mb-2">⚡ Break Free From Debt Chains</h2>
          <p className="text-red-800 mb-4">
            "The borrower is slave to the lender." - Proverbs 22:7. Take control with proven debt elimination strategies.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white bg-opacity-50 rounded-lg p-3">
              <h3 className="font-semibold text-red-900">🏔️ Debt Avalanche</h3>
              <p className="text-red-700">Target highest interest rates first - saves the most money mathematically</p>
            </div>
            <div className="bg-white bg-opacity-50 rounded-lg p-3">
              <h3 className="font-semibold text-red-900">❄️ Debt Snowball</h3>
              <p className="text-red-700">Target smallest balances first - builds psychological momentum</p>
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
        <div className="mt-8 bg-orange-50 border border-orange-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-orange-900 mb-4">🎯 What You'll Master</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-orange-800 mb-2">Debt Strategy Skills:</h4>
              <ul className="text-orange-700 space-y-1 text-sm">
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
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-yellow-900 mb-4">📊 Eye-Opening Debt Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white bg-opacity-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-yellow-800">$6,194</p>
              <p className="text-sm text-yellow-700">Average American credit card debt</p>
            </div>
            <div className="bg-white bg-opacity-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-yellow-800">18.99%</p>
              <p className="text-sm text-yellow-700">Average credit card interest rate</p>
            </div>
            <div className="bg-white bg-opacity-50 rounded-lg p-4 text-center">
              <p className="text-2xl font-bold text-yellow-800">14.5 years</p>
              <p className="text-sm text-yellow-700">Time to pay off $6,194 with minimum payments</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-red-100 rounded-lg">
            <p className="text-sm text-red-800 font-medium">
              💡 The average person pays $11,931 in interest on that $6,194 debt! Don't be average.
            </p>
          </div>
        </div>

        {/* Success Stories */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-green-900 mb-4">🏆 Debt Freedom Success Stories</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white bg-opacity-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Jessica's $47,000 Triumph</h4>
              <p className="text-green-700 text-sm">
                "I had $47,000 in student loans and credit cards. Using the avalanche method and a side hustle, I became debt-free in 3 years instead of 15!"
              </p>
            </div>
            <div className="bg-white bg-opacity-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Mark's Snowball Victory</h4>
              <p className="text-green-700 text-sm">
                "The snowball method gave me momentum I needed. Paying off small debts first kept me motivated through the 2-year journey to eliminate $32,000."
              </p>
            </div>
          </div>
        </div>

        {/* Action Plan */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-4">🚀 Your Debt Freedom Action Plan</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white bg-opacity-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Week 1: List Everything</h4>
              <p className="text-blue-700 text-sm">
                Gather all statements. List every debt with balance, minimum payment, and interest rate.
              </p>
            </div>
            <div className="bg-white bg-opacity-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Week 2: Choose Strategy</h4>
              <p className="text-blue-700 text-sm">
                Pick avalanche (save money) or snowball (build momentum). Use this calculator to compare both.
              </p>
            </div>
            <div className="bg-white bg-opacity-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Week 3: Find Extra Money</h4>
              <p className="text-blue-700 text-sm">
                Review budget, sell items, consider side income. Every extra $100/month cuts years off payoff.
              </p>
            </div>
            <div className="bg-white bg-opacity-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Week 4: Start Attacking</h4>
              <p className="text-blue-700 text-sm">
                Make first extra payment. Set up automatic payments. Track progress monthly. Celebrate wins!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
