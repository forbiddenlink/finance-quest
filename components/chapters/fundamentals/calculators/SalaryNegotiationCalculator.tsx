'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Calculator, Target, Award, Briefcase } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const SalaryNegotiationCalculator = () => {
  const [currentSalary, setCurrentSalary] = useState<number>(60000);
  const [requestedIncrease, setRequestedIncrease] = useState<number>(15);
  const [yearsAtJob, setYearsAtJob] = useState<number>(2);
  const [performanceRating, setPerformanceRating] = useState<number>(4.5);
  const [marketRate, setMarketRate] = useState<number>(65000);
  const [results, setResults] = useState<any>(null);
  const [lifetimeImpact, setLifetimeImpact] = useState<any[]>([]);

  useEffect(() => {
    calculateNegotiation();
  }, [currentSalary, requestedIncrease, yearsAtJob, performanceRating, marketRate]);

  const calculateNegotiation = () => {
    const requestedSalary = currentSalary * (1 + requestedIncrease / 100);
    const marketComparison = ((marketRate - currentSalary) / currentSalary) * 100;
    
    // Calculate negotiation success probability based on various factors
    let successProbability = 65; // Base probability
    
    // Adjust based on performance
    if (performanceRating >= 4.5) successProbability += 20;
    else if (performanceRating >= 4.0) successProbability += 10;
    else if (performanceRating < 3.5) successProbability -= 15;
    
    // Adjust based on market rate
    if (marketRate > currentSalary) successProbability += 15;
    else if (marketRate < currentSalary) successProbability -= 10;
    
    // Adjust based on tenure
    if (yearsAtJob >= 3) successProbability += 10;
    else if (yearsAtJob < 1) successProbability -= 10;
    
    // Adjust based on request size
    if (requestedIncrease > 25) successProbability -= 20;
    else if (requestedIncrease > 15) successProbability -= 10;
    else if (requestedIncrease < 5) successProbability += 5;
    
    successProbability = Math.max(15, Math.min(95, successProbability));
    
    const likelyIncrease = Math.min(requestedIncrease * 0.7, 20); // Assume you get 70% of ask, max 20%
    const likelySalary = currentSalary * (1 + likelyIncrease / 100);
    
    // Calculate lifetime impact (30 year career)
    const yearlyDifference = likelySalary - currentSalary;
    const lifetimeValue = yearlyDifference * 30 * 1.03; // Assume 3% annual growth
    
    setResults({
      requestedSalary,
      marketComparison,
      successProbability,
      likelyIncrease,
      likelySalary,
      yearlyDifference,
      lifetimeValue
    });

    // Generate lifetime impact chart
    const lifetimeData = [];
    let currentScenario = currentSalary;
    let negotiatedScenario = likelySalary;
    
    for (let year = 0; year <= 30; year += 5) {
      lifetimeData.push({
        year,
        withoutNegotiation: Math.round(currentScenario),
        withNegotiation: Math.round(negotiatedScenario),
        difference: Math.round(negotiatedScenario - currentScenario)
      });
      
      // Apply 3% annual growth
      currentScenario *= Math.pow(1.03, 5);
      negotiatedScenario *= Math.pow(1.03, 5);
    }
    
    setLifetimeImpact(lifetimeData);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getSuccessColor = (probability: number) => {
    if (probability >= 80) return 'text-green-600';
    if (probability >= 60) return 'text-blue-600';
    if (probability >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSuccessMessage = (probability: number) => {
    if (probability >= 80) return 'Excellent chance! You have strong leverage.';
    if (probability >= 60) return 'Good prospects! Prepare your case well.';
    if (probability >= 40) return 'Moderate chance. Consider timing and approach.';
    return 'Challenging situation. Focus on performance first.';
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-lg overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div 
        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6"
        variants={itemVariants}
      >
        <div className="flex items-center space-x-3 mb-4">
          <TrendingUp className="w-8 h-8" />
          <h2 className="text-3xl font-bold">Salary Negotiation Calculator</h2>
        </div>
        <p className="text-lg opacity-90">
          Calculate your negotiation success probability and lifetime earnings impact
        </p>
      </motion.div>

      <div className="p-6">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Situation</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Salary
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={currentSalary}
                    onChange={(e) => setCurrentSalary(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="20000"
                    step="1000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Market Rate for Your Role
                </label>
                <div className="relative">
                  <Target className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={marketRate}
                    onChange={(e) => setMarketRate(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="20000"
                    step="1000"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Research on Glassdoor, PayScale, or LinkedIn Salary Insights
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requested Increase (%)
                </label>
                <div className="relative">
                  <TrendingUp className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={requestedIncrease}
                    onChange={(e) => setRequestedIncrease(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    max="50"
                    step="1"
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Conservative: 5-10%</span>
                  <span>Aggressive: 15-25%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years at Current Job
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={yearsAtJob}
                    onChange={(e) => setYearsAtJob(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    max="20"
                    step="0.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Performance Rating (1-5)
                </label>
                <div className="relative">
                  <Award className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="number"
                    value={performanceRating}
                    onChange={(e) => setPerformanceRating(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    max="5"
                    step="0.1"
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Below Expectations: 1-2</span>
                  <span>Exceeds: 4-5</span>
                </div>
              </div>
            </div>

            {/* Quick Scenarios */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-3">Quick Scenarios</h4>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { label: 'New Graduate (1yr)', salary: 45000, market: 48000, increase: 8, years: 1, rating: 3.8 },
                  { label: 'Mid-Career (5yrs)', salary: 75000, market: 82000, increase: 12, years: 5, rating: 4.2 },
                  { label: 'Senior Professional', salary: 95000, market: 105000, increase: 15, years: 3, rating: 4.6 },
                  { label: 'Underpaid Talent', salary: 55000, market: 70000, increase: 20, years: 2, rating: 4.4 }
                ].map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentSalary(preset.salary);
                      setMarketRate(preset.market);
                      setRequestedIncrease(preset.increase);
                      setYearsAtJob(preset.years);
                      setPerformanceRating(preset.rating);
                    }}
                    className="text-left text-xs p-2 bg-white border border-gray-200 rounded hover:bg-blue-50 hover:border-blue-300 transition-colors"
                  >
                    <div className="font-medium">{preset.label}</div>
                    <div className="text-gray-500">{formatCurrency(preset.salary)} → {preset.increase}% increase</div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Results Section */}
          <motion.div variants={itemVariants} className="space-y-6">
            {results && (
              <>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Negotiation Analysis</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <motion.div 
                    className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Target className="w-5 h-5 text-blue-600" />
                      <span className="text-xs text-blue-600 font-medium">SUCCESS PROBABILITY</span>
                    </div>
                    <div className={`text-2xl font-bold ${getSuccessColor(results.successProbability)}`}>
                      {Math.round(results.successProbability)}%
                    </div>
                  </motion.div>

                  <motion.div 
                    className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <span className="text-xs text-green-600 font-medium">LIKELY NEW SALARY</span>
                    </div>
                    <div className="text-2xl font-bold text-green-700">
                      {formatCurrency(results.likelySalary)}
                    </div>
                  </motion.div>

                  <motion.div 
                    className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <TrendingUp className="w-5 h-5 text-purple-600" />
                      <span className="text-xs text-purple-600 font-medium">YEARLY INCREASE</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-700">
                      {formatCurrency(results.yearlyDifference)}
                    </div>
                  </motion.div>

                  <motion.div 
                    className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Award className="w-5 h-5 text-orange-600" />
                      <span className="text-xs text-orange-600 font-medium">LIFETIME VALUE</span>
                    </div>
                    <div className="text-2xl font-bold text-orange-700">
                      {formatCurrency(results.lifetimeValue)}
                    </div>
                  </motion.div>
                </div>

                {/* Market Comparison */}
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Market Position</h4>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Current vs Market Rate</span>
                    <span className={`font-bold ${results.marketComparison > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {results.marketComparison > 0 ? '-' : '+'}{Math.abs(results.marketComparison).toFixed(1)}%
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {results.marketComparison > 0 
                      ? `You're ${Math.abs(results.marketComparison).toFixed(1)}% below market rate`
                      : `You're ${Math.abs(results.marketComparison).toFixed(1)}% above market rate`
                    }
                  </div>
                </div>

                {/* Success Factors */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">💡 Analysis & Tips</h4>
                  <p className="text-sm text-blue-700 mb-2">{getSuccessMessage(results.successProbability)}</p>
                  <ul className="text-sm text-blue-700 space-y-1">
                    {results.marketComparison > 5 && (
                      <li>• Strong leverage: You're significantly underpaid vs market</li>
                    )}
                    {performanceRating >= 4.5 && (
                      <li>• Excellent performance rating strengthens your case</li>
                    )}
                    {yearsAtJob >= 2 && (
                      <li>• Good tenure shows commitment and value to company</li>
                    )}
                    {requestedIncrease > 20 && (
                      <li>• Consider a more modest request for higher success probability</li>
                    )}
                    <li>• Best time: After successful project completion or annual review</li>
                  </ul>
                </div>
              </>
            )}
          </motion.div>
        </div>

        {/* Lifetime Impact Chart */}
        {lifetimeImpact.length > 0 && (
          <motion.div 
            variants={itemVariants}
            className="mt-8 bg-gray-50 p-6 rounded-lg"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">30-Year Career Impact</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lifetimeImpact}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="year" 
                    label={{ value: 'Years from now', position: 'insideBottom', offset: -10 }}
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    label={{ value: 'Salary ($)', angle: -90, position: 'insideLeft' }}
                  />
                  <Tooltip 
                    formatter={(value: number, name: string) => [formatCurrency(value), name]}
                    labelFormatter={(label) => `Year ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="withoutNegotiation" 
                    stroke="#8884d8" 
                    strokeWidth={2}
                    name="Without Negotiation"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="withNegotiation" 
                    stroke="#82ca9d" 
                    strokeWidth={3}
                    name="With Negotiation"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex justify-center space-x-6 mt-4 text-sm">
              <div className="flex items-center">
                <div className="w-4 h-1 bg-blue-500 mr-2"></div>
                <span>Without Negotiation</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-1 bg-green-500 mr-2"></div>
                <span>With Successful Negotiation</span>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-gray-600">
                A successful salary negotiation today could be worth{' '}
                <span className="font-bold text-green-600">
                  {formatCurrency(results?.lifetimeValue || 0)}
                </span>{' '}
                over your career!
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default SalaryNegotiationCalculator;
