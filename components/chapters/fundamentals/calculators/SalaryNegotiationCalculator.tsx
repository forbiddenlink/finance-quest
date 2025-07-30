'use client';

import React, { useState, useEffect } from 'react';
import { useProgressActions } from '@/lib/context/ProgressContext';
import { TrendingUp, DollarSign, Target } from 'lucide-react';

interface NegotiationAnalysis {
  currentSalary: number;
  requestedSalary: number;
  increaseAmount: number;
  increasePercentage: number;
  lifetimeImpact: number;
  confidenceScore: number;
}

export default function SalaryNegotiationCalculator() {
  const { useCalculator } = useProgressActions();
  const [currentSalary, setCurrentSalary] = useState<string>('');
  const [targetSalary, setTargetSalary] = useState<string>('');
  const [yearsOfService, setYearsOfService] = useState<string>('');
  const [marketResearch, setMarketResearch] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<NegotiationAnalysis | null>(null);
  const [hasUsedCalculator, setHasUsedCalculator] = useState(false);

  const calculateNegotiation = () => {
    const current = parseFloat(currentSalary);
    const target = parseFloat(targetSalary);
    const years = parseFloat(yearsOfService);

    if (isNaN(current) || isNaN(target) || current <= 0 || target <= 0) return;

    const increaseAmount = target - current;
    const increasePercentage = (increaseAmount / current) * 100;
    const lifetimeImpact = increaseAmount * 30; // Rough 30-year career estimate
    
    // Simple confidence scoring based on various factors
    let confidenceScore = 50;
    if (increasePercentage <= 10) confidenceScore += 20;
    if (increasePercentage <= 5) confidenceScore += 10;
    if (years >= 1) confidenceScore += 10;
    if (marketResearch) confidenceScore += 10;

    setAnalysis({
      currentSalary: current,
      requestedSalary: target,
      increaseAmount,
      increasePercentage,
      lifetimeImpact,
      confidenceScore: Math.min(confidenceScore, 100)
    });
  };

  // Track calculator usage
  useEffect(() => {
    if (analysis && !hasUsedCalculator) {
      useCalculator('salary-negotiation-calculator');
      setHasUsedCalculator(true);
    }
  }, [analysis, hasUsedCalculator, useCalculator]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <TrendingUp className="w-6 h-6 text-green-600" />
        Salary Negotiation Calculator
      </h2>
      <p className="text-gray-600 mb-6">
        Plan your salary negotiation with data-driven insights and confidence scoring
      </p>

      {/* Input Section */}
      <div className="space-y-4 mb-6">
        <div>
          <label htmlFor="currentSalary" className="block text-sm font-medium text-gray-700 mb-2">
            Current Annual Salary
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              id="currentSalary"
              value={currentSalary}
              onChange={(e) => setCurrentSalary(e.target.value)}
              placeholder="65000"
              className="pl-8 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label htmlFor="targetSalary" className="block text-sm font-medium text-gray-700 mb-2">
            Target Annual Salary
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
            <input
              type="number"
              id="targetSalary"
              value={targetSalary}
              onChange={(e) => setTargetSalary(e.target.value)}
              placeholder="75000"
              className="pl-8 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label htmlFor="yearsOfService" className="block text-sm font-medium text-gray-700 mb-2">
            Years in Current Role
          </label>
          <input
            type="number"
            id="yearsOfService"
            value={yearsOfService}
            onChange={(e) => setYearsOfService(e.target.value)}
            placeholder="2"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="marketResearch"
            checked={marketResearch}
            onChange={(e) => setMarketResearch(e.target.checked)}
            className="mr-3 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
          />
          <label htmlFor="marketResearch" className="text-sm text-gray-700">
            I have researched market rates for my position
          </label>
        </div>

        <button
          onClick={calculateNegotiation}
          className="w-full bg-green-500 text-white py-3 px-4 rounded-md hover:bg-green-600 transition-colors font-semibold"
        >
          Calculate Negotiation Strategy
        </button>
      </div>

      {/* Results Section */}
      {analysis && (
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-green-600" />
            Your Negotiation Analysis
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-2">Salary Increase</h4>
              <p className="text-2xl font-bold text-green-600">
                ${analysis.increaseAmount.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                {analysis.increasePercentage.toFixed(1)}% increase
              </p>
            </div>

            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-2">Lifetime Impact</h4>
              <p className="text-2xl font-bold text-blue-600">
                ${analysis.lifetimeImpact.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                Additional career earnings
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 mb-4">
            <h4 className="font-medium text-gray-700 mb-2">Confidence Score</h4>
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${
                    analysis.confidenceScore >= 70
                      ? 'bg-green-500'
                      : analysis.confidenceScore >= 50
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${analysis.confidenceScore}%` }}
                ></div>
              </div>
              <span className="font-semibold text-gray-900">
                {analysis.confidenceScore}%
              </span>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">💡 Negotiation Tips</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              {analysis.increasePercentage > 15 && (
                <li>• Your request is above 15% - consider a phased approach over 2 years</li>
              )}
              {analysis.increasePercentage <= 10 && (
                <li>• Your request is reasonable - highlight your achievements and market data</li>
              )}
              {!marketResearch && (
                <li>• Research salary data from Glassdoor, PayScale, or industry reports</li>
              )}
              <li>• Schedule the conversation at the right time (after successful projects)</li>
              <li>• Focus on value you bring, not personal financial needs</li>
              <li>• Be prepared to negotiate other benefits if salary is fixed</li>
            </ul>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
        <h4 className="font-medium text-yellow-900 mb-2">📈 Remember</h4>
        <p className="text-sm text-yellow-800">
          Salary negotiations compound over your entire career. A successful negotiation today impacts every future salary, promotion, and even retirement savings. Don&apos;t leave money on the table!
        </p>
      </div>
    </div>
  );
}
