'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { theme } from '@/lib/theme';
import { useProgressStore } from '@/lib/store/progressStore';
import {
  Target,
  Zap,
  Calculator,
  ArrowUp,
  CheckCircle,
  Clock,
  Percent
} from 'lucide-react';

interface SavingsStrategy {
  name: string;
  description: string;
  monthlyAmount: number;
  timeToGoal: number;
  totalInterestEarned: number;
  strategy: string;
}

interface AccountOption {
  name: string;
  apy: number;
  minimumBalance: number;
  features: string[];
  pros: string[];
  cons: string[];
}

export default function EmergencyFundOptimizer() {
  const [targetAmount, setTargetAmount] = useState(15000);
  const [currentSavings, setCurrentSavings] = useState(2000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [selectedAPY, setSelectedAPY] = useState(4.5);
  const [optimizationGoal, setOptimizationGoal] = useState<'speed' | 'interest' | 'balance'>('balance');

  const { recordCalculatorUsage } = useProgressStore();

  useEffect(() => {
    recordCalculatorUsage('emergency-fund-optimizer');
  }, [recordCalculatorUsage]);

  const accountOptions: AccountOption[] = [
    {
      name: 'High-Yield Savings',
      apy: 4.5,
      minimumBalance: 0,
      features: ['FDIC Insured', 'No minimum balance', 'Easy online access'],
      pros: ['Competitive rates', 'Instant liquidity', 'No risk'],
      cons: ['Rate may fluctuate', 'May have transfer limits']
    },
    {
      name: 'Money Market Account',
      apy: 4.8,
      minimumBalance: 1000,
      features: ['FDIC Insured', 'Check writing', 'Debit card access'],
      pros: ['Higher rates', 'Multiple access methods', 'Stable'],
      cons: ['Higher minimum balance', 'Limited transactions']
    },
    {
      name: 'CD Ladder Strategy',
      apy: 5.2,
      minimumBalance: 500,
      features: ['FDIC Insured', 'Fixed rates', 'Systematic access'],
      pros: ['Highest guaranteed returns', 'Disciplined approach', 'Rate protection'],
      cons: ['Less flexible', 'Early withdrawal penalties', 'Complex setup']
    },
    {
      name: 'Treasury I-Bonds',
      apy: 5.0,
      minimumBalance: 25,
      features: ['Government backed', 'Inflation protection', '$10k annual limit'],
      pros: ['Inflation adjusted', 'Tax advantages', 'Zero default risk'],
      cons: ['Purchase limits', '1-year lock-up', 'Interest rate changes']
    }
  ];

  // Calculate compound interest
  const calculateFutureValue = (principal: number, monthlyPayment: number, annualRate: number, months: number) => {
    const monthlyRate = annualRate / 100 / 12;
    
    // Future value of current principal
    const fvPrincipal = principal * Math.pow(1 + monthlyRate, months);
    
    // Future value of monthly payments (annuity)
    const fvPayments = monthlyPayment * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;
    
    return fvPrincipal + fvPayments;
  };

  // Calculate time to reach goal
  const calculateTimeToGoal = (current: number, target: number, monthly: number, apy: number) => {
    if (monthly <= 0) return Infinity;
    
    const monthlyRate = apy / 100 / 12;
    const remaining = target - current;
    
    if (remaining <= 0) return 0;
    if (monthlyRate === 0) return remaining / monthly;
    
    // Use logarithmic formula for compound interest
    const months = Math.log(1 + (remaining * monthlyRate) / monthly) / Math.log(1 + monthlyRate);
    return Math.max(0, months);
  };

  // Generate optimized strategies
  const generateStrategies = (): SavingsStrategy[] => {
    const strategies: SavingsStrategy[] = [];
    
    // Conservative Strategy (Higher monthly, lower risk)
    const conservativeMonthly = monthlyContribution * 1.2;
    const conservativeTime = calculateTimeToGoal(currentSavings, targetAmount, conservativeMonthly, 4.0);
    const conservativeFV = calculateFutureValue(currentSavings, conservativeMonthly, 4.0, conservativeTime);
    
    strategies.push({
      name: 'Conservative Approach',
      description: 'Higher monthly contributions, traditional savings account',
      monthlyAmount: conservativeMonthly,
      timeToGoal: conservativeTime,
      totalInterestEarned: conservativeFV - currentSavings - (conservativeMonthly * conservativeTime),
      strategy: 'Increase monthly savings by 20%, use traditional high-yield savings'
    });

    // Aggressive Strategy (Current monthly, higher yield)
    const aggressiveTime = calculateTimeToGoal(currentSavings, targetAmount, monthlyContribution, 5.2);
    const aggressiveFV = calculateFutureValue(currentSavings, monthlyContribution, 5.2, aggressiveTime);
    
    strategies.push({
      name: 'Yield Optimization',
      description: 'Current contributions, maximize interest with CD ladder',
      monthlyAmount: monthlyContribution,
      timeToGoal: aggressiveTime,
      totalInterestEarned: aggressiveFV - currentSavings - (monthlyContribution * aggressiveTime),
      strategy: 'Use CD ladder strategy for maximum returns while maintaining liquidity'
    });

    // Balanced Strategy
    const balancedMonthly = monthlyContribution * 1.1;
    const balancedTime = calculateTimeToGoal(currentSavings, targetAmount, balancedMonthly, 4.8);
    const balancedFV = calculateFutureValue(currentSavings, balancedMonthly, 4.8, balancedTime);
    
    strategies.push({
      name: 'Balanced Approach',
      description: 'Moderate increase in contributions, money market account',
      monthlyAmount: balancedMonthly,
      timeToGoal: balancedTime,
      totalInterestEarned: balancedFV - currentSavings - (balancedMonthly * balancedTime),
      strategy: 'Increase monthly by 10%, use money market for balance of yield and access'
    });

    return strategies.sort((a, b) => {
      if (optimizationGoal === 'speed') return a.timeToGoal - b.timeToGoal;
      if (optimizationGoal === 'interest') return b.totalInterestEarned - a.totalInterestEarned;
      return (a.timeToGoal * 0.6) + (-b.totalInterestEarned * 0.4) - (b.timeToGoal * 0.6) - (-a.totalInterestEarned * 0.4);
    });
  };

  const strategies = generateStrategies();
  const currentTime = calculateTimeToGoal(currentSavings, targetAmount, monthlyContribution, selectedAPY);
  const currentInterest = calculateFutureValue(currentSavings, monthlyContribution, selectedAPY, currentTime) - currentSavings - (monthlyContribution * currentTime);

  const formatTime = (months: number) => {
    if (months === Infinity) return 'Never';
    const years = Math.floor(months / 12);
    const remainingMonths = Math.round(months % 12);
    
    if (years === 0) return `${remainingMonths} months`;
    if (remainingMonths === 0) return `${years} year${years > 1 ? 's' : ''}`;
    return `${years}y ${remainingMonths}m`;
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Goal Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}
          >
            <div className="flex items-center gap-3 mb-6">
              <Target className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-bold text-white">Emergency Fund Goal</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Target Emergency Fund Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                    $
                  </span>
                  <input
                    type="number"
                    min="1000"
                    step="1000"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(parseFloat(e.target.value) || 1000)}
                    className="pl-8 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/5 border-white/10 text-white"
                    placeholder="15000"
                    aria-label="Target emergency fund amount"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Current Savings
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                    $
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(parseFloat(e.target.value) || 0)}
                    className="pl-8 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/5 border-white/10 text-white"
                    placeholder="2000"
                    aria-label="Current savings amount"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Monthly Contribution
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400">
                    $
                  </span>
                  <input
                    type="number"
                    min="50"
                    step="50"
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(parseFloat(e.target.value) || 50)}
                    className="pl-8 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/5 border-white/10 text-white"
                    placeholder="500"
                    aria-label="Monthly contribution amount"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Optimization Priority
                </label>
                <select
                  value={optimizationGoal}
                  onChange={(e) => setOptimizationGoal(e.target.value as 'speed' | 'interest' | 'balance')}
                  className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/5 border-white/10 text-white"
                  aria-label="Optimization priority"
                >
                  <option value="speed">Fastest Time to Goal</option>
                  <option value="interest">Maximum Interest Earned</option>
                  <option value="balance">Balanced Approach</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Account Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}
          >
            <div className="flex items-center gap-3 mb-6">
              <Percent className="w-6 h-6 text-green-400" />
              <h3 className="text-xl font-bold text-white">Account Options</h3>
            </div>

            <div className="space-y-4">
              {accountOptions.map((account) => (
                <div
                  key={account.name}
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-green-400/50 ${
                    selectedAPY === account.apy 
                      ? 'border-green-400 bg-green-400/5' 
                      : 'border-slate-600 bg-slate-700/20'
                  }`}
                  onClick={() => setSelectedAPY(account.apy)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-white">{account.name}</h4>
                    <div className="text-right">
                      <div className="text-green-400 font-bold text-lg">{account.apy}% APY</div>
                      <div className="text-xs text-slate-400">
                        Min: ${account.minimumBalance.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <div className="text-green-400 font-medium mb-1">Pros:</div>
                      <ul className="text-slate-300 space-y-1">
                        {account.pros.map((pro, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle className="w-3 h-3 text-green-400 flex-shrink-0" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <div className="text-yellow-400 font-medium mb-1">Considerations:</div>
                      <ul className="text-slate-300 space-y-1">
                        {account.cons.map((con, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <Clock className="w-3 h-3 text-yellow-400 flex-shrink-0" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {/* Current Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}
          >
            <div className="flex items-center gap-3 mb-6">
              <Calculator className="w-6 h-6 text-purple-400" />
              <h3 className="text-xl font-bold text-white">Your Current Plan</h3>
            </div>

            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">
                  {formatTime(currentTime)}
                </div>
                <div className="text-white">to reach ${targetAmount.toLocaleString()}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                  <div className="text-white font-semibold">${monthlyContribution.toLocaleString()}</div>
                  <div className="text-xs text-slate-400">Monthly Payment</div>
                </div>
                <div className="text-center p-3 bg-slate-700/30 rounded-lg">
                  <div className="text-green-400 font-semibold">${Math.round(currentInterest).toLocaleString()}</div>
                  <div className="text-xs text-slate-400">Interest Earned</div>
                </div>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <div className="text-blue-400 font-medium mb-2">Progress Breakdown:</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Remaining to save:</span>
                    <span className="text-white">${(targetAmount - currentSavings).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Total payments:</span>
                    <span className="text-white">${Math.round(monthlyContribution * currentTime).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Interest earned:</span>
                    <span className="text-green-400">${Math.round(currentInterest).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Optimized Strategies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}
          >
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-6 h-6 text-yellow-400" />
              <h3 className="text-xl font-bold text-white">Optimized Strategies</h3>
            </div>

            <div className="space-y-4">
              {strategies.map((strategy, index) => (
                <div
                  key={strategy.name}
                  className={`p-4 border rounded-lg transition-all ${
                    index === 0 
                      ? 'border-yellow-400 bg-yellow-400/5' 
                      : 'border-slate-600 bg-slate-700/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-white flex items-center gap-2">
                        {index === 0 && <ArrowUp className="w-4 h-4 text-yellow-400" />}
                        {strategy.name}
                      </h4>
                      <p className="text-sm text-slate-300">{strategy.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-400 font-bold">
                        {formatTime(strategy.timeToGoal)}
                      </div>
                      <div className="text-xs text-slate-400">to goal</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="text-center p-2 bg-slate-700/30 rounded">
                      <div className="text-white font-semibold text-sm">
                        ${strategy.monthlyAmount.toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-400">Monthly</div>
                    </div>
                    <div className="text-center p-2 bg-slate-700/30 rounded">
                      <div className="text-green-400 font-semibold text-sm">
                        ${Math.round(strategy.totalInterestEarned).toLocaleString()}
                      </div>
                      <div className="text-xs text-slate-400">Interest</div>
                    </div>
                    <div className="text-center p-2 bg-slate-700/30 rounded">
                      <div className="text-blue-400 font-semibold text-sm">
                        {formatTime(currentTime - strategy.timeToGoal)}
                      </div>
                      <div className="text-xs text-slate-400">Faster</div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 bg-slate-800/50 p-3 rounded">
                    <strong>Strategy:</strong> {strategy.strategy}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Optimization Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}
          >
            <h3 className="text-lg font-bold text-white mb-4">💡 Optimization Tips</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-slate-300">
                  Automate transfers to make saving effortless and consistent
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-slate-300">
                  Review rates quarterly - online banks often offer competitive APYs
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-slate-300">
                  Consider splitting funds across multiple account types for optimal liquidity
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                <p className="text-slate-300">
                  Increase contributions when you get raises or windfalls
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
