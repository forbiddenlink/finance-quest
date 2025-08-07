'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lock, TrendingUp, Clock, DollarSign, AlertTriangle, CheckCircle, Shield } from 'lucide-react';
import { theme } from '@/lib/theme';
import { useProgressStore } from '@/lib/store/progressStore';

interface CDOption {
  term: number; // months
  apy: number;
  minimumDeposit: number;
  penaltyMonths: number;
  name: string;
  type: 'standard' | 'jumbo' | 'promotional';
}

interface CDLadderRung {
  term: number;
  amount: number;
  maturityDate: Date;
  interestEarned: number;
}

export default function CertificateOfDepositCalculator() {
  const [depositAmount, setDepositAmount] = useState(10000);
  const [selectedTerm, setSelectedTerm] = useState(12);
  const [ladderStrategy, setLadderStrategy] = useState(false);
  const [ladderRungs, setLadderRungs] = useState(5);
  const [emergencyWithdrawal, setEmergencyWithdrawal] = useState(false);
  const [withdrawalMonth, setWithdrawalMonth] = useState(6);
  const { recordCalculatorUsage } = useProgressStore();

  useEffect(() => {
    recordCalculatorUsage('certificate-of-deposit-calculator');
  }, [recordCalculatorUsage]);

  const cdOptions: CDOption[] = [
    { term: 3, apy: 4.2, minimumDeposit: 1000, penaltyMonths: 3, name: '3-Month CD', type: 'standard' },
    { term: 6, apy: 4.5, minimumDeposit: 1000, penaltyMonths: 3, name: '6-Month CD', type: 'standard' },
    { term: 12, apy: 5.0, minimumDeposit: 1000, penaltyMonths: 6, name: '1-Year CD', type: 'standard' },
    { term: 18, apy: 4.8, minimumDeposit: 1000, penaltyMonths: 6, name: '18-Month CD', type: 'standard' },
    { term: 24, apy: 4.6, minimumDeposit: 1000, penaltyMonths: 6, name: '2-Year CD', type: 'standard' },
    { term: 36, apy: 4.4, minimumDeposit: 1000, penaltyMonths: 12, name: '3-Year CD', type: 'standard' },
    { term: 60, apy: 4.2, minimumDeposit: 1000, penaltyMonths: 12, name: '5-Year CD', type: 'standard' },
    { term: 12, apy: 5.2, minimumDeposit: 100000, penaltyMonths: 6, name: 'Jumbo 1-Year CD', type: 'jumbo' },
    { term: 15, apy: 5.5, minimumDeposit: 1000, penaltyMonths: 6, name: '15-Month Promotional CD', type: 'promotional' }
  ];

  const currentCD = cdOptions.find(cd => cd.term === selectedTerm) || cdOptions[2];

  const calculateCDReturn = (principal: number, apy: number, termMonths: number) => {
    const annualRate = apy / 100;
    const compoundingPeriods = 12; // Monthly compounding
    const years = termMonths / 12;
    
    const finalAmount = principal * Math.pow(1 + annualRate / compoundingPeriods, compoundingPeriods * years);
    const interestEarned = finalAmount - principal;
    
    return { finalAmount, interestEarned };
  };

  const calculateEarlyWithdrawalPenalty = (principal: number, apy: number, termMonths: number, withdrawalMonth: number, penaltyMonths: number) => {
    const monthlyRate = apy / 100 / 12;
    let balance = principal;
    let totalInterest = 0;

    // Calculate interest earned up to withdrawal
    for (let month = 1; month <= withdrawalMonth; month++) {
      const monthlyInterest = balance * monthlyRate;
      balance += monthlyInterest;
      totalInterest += monthlyInterest;
    }

    // Calculate penalty (typically several months of interest)
    const penaltyAmount = Math.min(totalInterest, principal * (apy / 100) * (penaltyMonths / 12));
    const finalAmount = balance - penaltyAmount;

    return {
      balanceAtWithdrawal: balance,
      penalty: penaltyAmount,
      finalAmount,
      effectiveReturn: finalAmount - principal
    };
  };

  const createCDLadder = (totalAmount: number, rungs: number) => {
    const amountPerRung = totalAmount / rungs;
    const ladder: CDLadderRung[] = [];
    const today = new Date();

    for (let i = 0; i < rungs; i++) {
      const termMonths = 12 * (i + 1); // 1, 2, 3, 4, 5 year terms
      const cdOption = cdOptions.find(cd => cd.term === 12) || cdOptions[2]; // Use 1-year rate for simplicity
      const { interestEarned } = calculateCDReturn(amountPerRung, cdOption.apy, termMonths);
      
      const maturityDate = new Date(today);
      maturityDate.setMonth(maturityDate.getMonth() + termMonths);

      ladder.push({
        term: termMonths,
        amount: amountPerRung,
        maturityDate,
        interestEarned
      });
    }

    return ladder;
  };

  const { finalAmount, interestEarned } = calculateCDReturn(depositAmount, currentCD.apy, currentCD.term);
  const effectiveAPY = ((finalAmount / depositAmount) ** (12 / currentCD.term) - 1) * 100;

  const penaltyScenario = emergencyWithdrawal ? 
    calculateEarlyWithdrawalPenalty(depositAmount, currentCD.apy, currentCD.term, withdrawalMonth, currentCD.penaltyMonths) : null;

  const ladder = ladderStrategy ? createCDLadder(depositAmount, ladderRungs) : [];

  // Compare with high-yield savings (4.5% APY)
  const savingsComparison = calculateCDReturn(depositAmount, 4.5, currentCD.term);
  const cdAdvantage = interestEarned - savingsComparison.interestEarned;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Lock className="w-8 h-8 text-purple-400" />
          <h2 className={`text-3xl font-bold ${theme.textColors.primary}`}>
            Certificate of Deposit Calculator
          </h2>
        </div>
        <p className={`text-lg ${theme.textColors.secondary} max-w-2xl mx-auto`}>
          Analyze CD returns, compare terms, and explore laddering strategies. Calculate the trade-offs 
          between guaranteed returns and liquidity with early withdrawal penalty scenarios.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-xl p-6 space-y-6`}
        >
          <h3 className={`text-xl font-semibold ${theme.textColors.primary} flex items-center gap-2`}>
            <DollarSign className="w-5 h-5" />
            CD Configuration
          </h3>

          {/* Deposit Amount */}
          <div>
            <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
              Initial Deposit
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-400" />
              <input
                type="number"
                min="0"
                step="1000"
                value={depositAmount}
                onChange={(e) => setDepositAmount(parseInt(e.target.value) || 0)}
                className="pl-10 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white/5 border-white/10 text-white"
                placeholder="10000"
                aria-label="Initial deposit amount"
              />
            </div>
          </div>

          {/* CD Term Selection */}
          <div>
            <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
              CD Term & Rate
            </label>
            <div className="grid grid-cols-1 gap-2">
              {cdOptions.filter(cd => cd.type === 'standard').map((cd) => (
                <button
                  key={cd.term}
                  onClick={() => setSelectedTerm(cd.term)}
                  className={`p-3 rounded-md transition-all text-left ${
                    selectedTerm === cd.term
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/5 text-slate-300 hover:bg-white/10'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{cd.name}</span>
                    <span className="text-sm font-semibold">{cd.apy}% APY</span>
                  </div>
                  <div className="text-xs opacity-75 mt-1">
                    Min: ${cd.minimumDeposit.toLocaleString()} • Penalty: {cd.penaltyMonths} months interest
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Strategy Options */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="ladder"
                checked={ladderStrategy}
                onChange={(e) => setLadderStrategy(e.target.checked)}
                className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
              />
              <label htmlFor="ladder" className={`${theme.textColors.primary} font-medium`}>
                Create CD Ladder Strategy
              </label>
            </div>

            {ladderStrategy && (
              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Number of Ladder Rungs
                </label>
                <select
                  value={ladderRungs}
                  onChange={(e) => setLadderRungs(parseInt(e.target.value))}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/5 border-white/10 text-white"
                  aria-label="Number of ladder rungs"
                >
                  <option value={3}>3 Rungs (1, 2, 3 years)</option>
                  <option value={4}>4 Rungs (1, 2, 3, 4 years)</option>
                  <option value={5}>5 Rungs (1, 2, 3, 4, 5 years)</option>
                </select>
              </div>
            )}

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="emergency"
                checked={emergencyWithdrawal}
                onChange={(e) => setEmergencyWithdrawal(e.target.checked)}
                className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
              />
              <label htmlFor="emergency" className={`${theme.textColors.primary} font-medium`}>
                Simulate Early Withdrawal
              </label>
            </div>

            {emergencyWithdrawal && (
              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Withdrawal Month (1-{currentCD.term})
                </label>
                <input
                  type="number"
                  min="1"
                  max={currentCD.term}
                  value={withdrawalMonth}
                  onChange={(e) => setWithdrawalMonth(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/5 border-white/10 text-white"
                  aria-label="Withdrawal month"
                />
              </div>
            )}
          </div>
        </motion.div>

        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          {/* Standard CD Results */}
          <div className={`${theme.backgrounds.glass} border border-purple-500/30 rounded-xl p-6`}>
            <div className="flex items-center gap-2 mb-4">
              <Lock className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-purple-400">CD Performance</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className={theme.textColors.secondary}>Initial Deposit:</span>
                <span className={`font-semibold ${theme.textColors.primary}`}>
                  ${depositAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={theme.textColors.secondary}>Term:</span>
                <span className={`font-semibold ${theme.textColors.primary}`}>
                  {currentCD.term} months ({(currentCD.term / 12).toFixed(1)} years)
                </span>
              </div>
              <div className="flex justify-between">
                <span className={theme.textColors.secondary}>Annual Percentage Yield:</span>
                <span className="text-purple-400 font-semibold">
                  {currentCD.apy}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className={theme.textColors.secondary}>Interest Earned:</span>
                <span className="text-green-400 font-semibold">
                  ${interestEarned.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span className={theme.textColors.primary}>Final Amount:</span>
                <span className="text-green-400">
                  ${finalAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={theme.textColors.secondary}>Effective APY:</span>
                <span className="text-purple-400 font-semibold">
                  {effectiveAPY.toFixed(2)}%
                </span>
              </div>
            </div>
          </div>

          {/* Comparison with Savings */}
          <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-xl p-6`}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-blue-400">vs High-Yield Savings</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className={theme.textColors.secondary}>Savings Account (4.5% APY):</span>
                <span className="text-blue-400 font-semibold">
                  ${savingsComparison.finalAmount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={theme.textColors.secondary}>CD Advantage:</span>
                <span className={`font-semibold ${cdAdvantage > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  ${Math.abs(cdAdvantage).toLocaleString()} {cdAdvantage > 0 ? 'more' : 'less'}
                </span>
              </div>
            </div>
            <div className={`mt-4 p-3 ${cdAdvantage > 0 ? 'bg-green-500/10' : 'bg-red-500/10'} rounded-lg`}>
              <p className={`text-sm ${cdAdvantage > 0 ? 'text-green-200' : 'text-red-200'}`}>
                {cdAdvantage > 0 
                  ? `The CD earns ${((cdAdvantage / savingsComparison.interestEarned) * 100).toFixed(1)}% more than a high-yield savings account`
                  : 'High-yield savings offers better returns with full liquidity'
                }
              </p>
            </div>
          </div>

          {/* Early Withdrawal Penalty */}
          {emergencyWithdrawal && penaltyScenario && (
            <div className={`${theme.backgrounds.glass} border border-red-500/30 rounded-xl p-6`}>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <h3 className="text-lg font-semibold text-red-400">Early Withdrawal Impact</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className={theme.textColors.secondary}>Balance at Month {withdrawalMonth}:</span>
                  <span className={`font-semibold ${theme.textColors.primary}`}>
                    ${penaltyScenario.balanceAtWithdrawal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={theme.textColors.secondary}>Early Withdrawal Penalty:</span>
                  <span className="text-red-400 font-semibold">
                    -${penaltyScenario.penalty.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span className={theme.textColors.primary}>Final Amount:</span>
                  <span className={penaltyScenario.effectiveReturn >= 0 ? 'text-green-400' : 'text-red-400'}>
                    ${penaltyScenario.finalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={theme.textColors.secondary}>Net Return:</span>
                  <span className={penaltyScenario.effectiveReturn >= 0 ? 'text-green-400' : 'text-red-400'}>
                    ${penaltyScenario.effectiveReturn.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* CD Ladder Strategy */}
      {ladderStrategy && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-xl p-6`}
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-yellow-400" />
            <h3 className="text-xl font-semibold text-yellow-400">CD Ladder Strategy</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ladder.map((rung, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <h4 className={`font-semibold ${theme.textColors.primary}`}>
                    Rung {index + 1}
                  </h4>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className={theme.textColors.secondary}>Amount:</span>
                    <span className={theme.textColors.primary}>
                      ${rung.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={theme.textColors.secondary}>Term:</span>
                    <span className={theme.textColors.primary}>
                      {rung.term / 12} years
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={theme.textColors.secondary}>Maturity:</span>
                    <span className="text-green-400">
                      {rung.maturityDate.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className={theme.textColors.secondary}>Interest:</span>
                    <span className="text-green-400 font-semibold">
                      ${rung.interestEarned.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 p-4 bg-yellow-500/10 rounded-lg">
            <h4 className="font-semibold text-yellow-400 mb-2">Ladder Benefits:</h4>
            <ul className={`space-y-1 ${theme.textColors.secondary} text-sm`}>
              <li>• Regular access to funds as CDs mature</li>
              <li>• Protection against interest rate changes</li>
              <li>• Higher average yields than short-term CDs</li>
              <li>• Systematic reinvestment strategy</li>
            </ul>
          </div>
        </motion.div>
      )}

      {/* Educational Context */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-xl p-6`}
      >
        <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-4`}>
          When to Choose CDs
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <h4 className={`font-semibold ${theme.textColors.primary}`}>Good for CDs</h4>
            </div>
            <ul className={`space-y-1 ${theme.textColors.secondary} text-sm`}>
              <li>• Money you won&apos;t need for months/years</li>
              <li>• Guaranteed return requirements</li>
              <li>• Conservative investment approach</li>
              <li>• Laddering for regular income</li>
              <li>• FDIC insurance protection needed</li>
            </ul>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h4 className={`font-semibold ${theme.textColors.primary}`}>Better Alternatives</h4>
            </div>
            <ul className={`space-y-1 ${theme.textColors.secondary} text-sm`}>
              <li>• Emergency funds (use high-yield savings)</li>
              <li>• Long-term growth goals (consider investing)</li>
              <li>• When rates are expected to rise significantly</li>
              <li>• If you might need early access</li>
              <li>• For inflation protection (real assets better)</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
