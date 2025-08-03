'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { theme } from '@/lib/theme';
import { Building2, DollarSign, AlertTriangle, CheckCircle, X, Calculator } from 'lucide-react';

interface BankOption {
  id: string;
  name: string;
  type: 'big-bank' | 'credit-union' | 'online-bank';
  savingsAPY: number;
  checkingFee: number;
  overdraftFee: number;
  atmFees: number;
  minimumBalance: number;
  pros: string[];
  cons: string[];
  bestFor: string;
}

const bankOptions: BankOption[] = [
  {
    id: 'big-bank',
    name: 'National Big Bank',
    type: 'big-bank',
    savingsAPY: 0.01,
    checkingFee: 15,
    overdraftFee: 35,
    atmFees: 3,
    minimumBalance: 1500,
    pros: ['Many ATMs and branches', 'Full-service banking', 'Advanced mobile app'],
    cons: ['High fees', 'Low interest rates', 'Poor customer service'],
    bestFor: 'People who need many physical branches'
  },
  {
    id: 'credit-union',
    name: 'Local Credit Union',
    type: 'credit-union',
    savingsAPY: 2.5,
    checkingFee: 0,
    overdraftFee: 25,
    atmFees: 0,
    minimumBalance: 25,
    pros: ['No monthly fees', 'Better rates', 'Personal service', 'Lower fees'],
    cons: ['Fewer locations', 'Limited hours', 'Basic technology'],
    bestFor: 'People who value personal service and lower fees'
  },
  {
    id: 'online-bank',
    name: 'High-Yield Online Bank',
    type: 'online-bank',
    savingsAPY: 4.5,
    checkingFee: 0,
    overdraftFee: 0,
    atmFees: 0,
    minimumBalance: 0,
    pros: ['Highest rates', 'No fees', 'Great mobile app', 'ATM fee reimbursement'],
    cons: ['No physical branches', 'Check deposits take longer', 'Limited cash access'],
    bestFor: 'Digital-savvy savers who rarely need branches'
  }
];

interface ComparisonScenario {
  name: string;
  description: string;
  savingsBalance: number;
  monthlyDeposits: number;
  atmUsage: number;
  overdrafts: number;
}

const scenarios: ComparisonScenario[] = [
  {
    name: 'College Student',
    description: 'Low balance, occasional overdrafts',
    savingsBalance: 500,
    monthlyDeposits: 50,
    atmUsage: 4,
    overdrafts: 2
  },
  {
    name: 'Young Professional',
    description: 'Building emergency fund, rare fees',
    savingsBalance: 5000,
    monthlyDeposits: 200,
    atmUsage: 2,
    overdrafts: 0
  },
  {
    name: 'Established Saver',
    description: 'High balance, fee-conscious',
    savingsBalance: 25000,
    monthlyDeposits: 500,
    atmUsage: 1,
    overdrafts: 0
  }
];

export default function BankComparisonTool() {
  const [selectedScenario, setSelectedScenario] = useState<ComparisonScenario>(scenarios[1]);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);

  const calculateAnnualCost = (bank: BankOption, scenario: ComparisonScenario): number => {
    const interestEarned = scenario.savingsBalance * (bank.savingsAPY / 100);
    const monthlyFees = bank.checkingFee;
    const overdraftCosts = scenario.overdrafts * bank.overdraftFee * 12; // per year
    const atmCosts = scenario.atmUsage * bank.atmFees * 12; // per year
    
    const totalFees = (monthlyFees * 12) + overdraftCosts + atmCosts;
    const netCost = totalFees - interestEarned;
    
    return netCost;
  };

  const getBestBank = (): BankOption => {
    return bankOptions.reduce((best, current) => {
      const bestCost = calculateAnnualCost(best, selectedScenario);
      const currentCost = calculateAnnualCost(current, selectedScenario);
      return currentCost < bestCost ? current : best;
    });
  };

  const getWorstBank = (): BankOption => {
    return bankOptions.reduce((worst, current) => {
      const worstCost = calculateAnnualCost(worst, selectedScenario);
      const currentCost = calculateAnnualCost(current, selectedScenario);
      return currentCost > worstCost ? current : worst;
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  const bestBank = getBestBank();
  const worstBank = getWorstBank();
  const savings = calculateAnnualCost(worstBank, selectedScenario) - calculateAnnualCost(bestBank, selectedScenario);

  return (
    <div className={`p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
      <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
        <Calculator className="w-6 h-6" />
        Interactive Bank Comparison Tool
      </h3>
      
      <p className={`${theme.textColors.secondary} mb-6`}>
        See how different banking choices affect your wealth. Choose a scenario that matches your situation:
      </p>

      {/* Scenario Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {scenarios.map((scenario) => (
          <motion.button
            key={scenario.name}
            onClick={() => setSelectedScenario(scenario)}
            className={`p-4 border-2 rounded-lg text-left transition-all ${
              selectedScenario.name === scenario.name
                ? `${theme.borderColors.primary} ${theme.status.info.bg}`
                : `${theme.borderColors.muted} hover:${theme.borderColors.primary}`
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <h4 className={`font-bold ${theme.textColors.primary} mb-2`}>{scenario.name}</h4>
            <p className={`text-sm ${theme.textColors.secondary} mb-3`}>{scenario.description}</p>
            <div className={`text-xs ${theme.textColors.muted} space-y-1`}>
              <div>Balance: {formatCurrency(scenario.savingsBalance)}</div>
              <div>Monthly saves: {formatCurrency(scenario.monthlyDeposits)}</div>
              <div>ATM uses: {scenario.atmUsage}/month</div>
              <div>Overdrafts: {scenario.overdrafts}/year</div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Bank Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {bankOptions.map((bank) => {
          const annualCost = calculateAnnualCost(bank, selectedScenario);
          const isBest = bank.id === bestBank.id;
          const isWorst = bank.id === worstBank.id;
          
          return (
            <motion.div
              key={bank.id}
              className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedBank === bank.id
                  ? `${theme.borderColors.primary} ${theme.status.info.bg}`
                  : `${theme.borderColors.muted} hover:${theme.borderColors.primary}`
              } ${
                isBest ? `ring-2 ring-green-400` : isWorst ? `ring-2 ring-red-400` : ''
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedBank(selectedBank === bank.id ? null : bank.id)}
            >
              {/* Best/Worst Badge */}
              {isBest && (
                <div className={`absolute -top-2 -right-2 ${theme.status.success.bg} ${theme.status.success.text} px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1`}>
                  <CheckCircle className="w-3 h-3" />
                  BEST
                </div>
              )}
              {isWorst && (
                <div className={`absolute -top-2 -right-2 ${theme.status.error.bg} ${theme.status.error.text} px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1`}>
                  <AlertTriangle className="w-3 h-3" />
                  WORST
                </div>
              )}

              <div className="flex items-center justify-between mb-3">
                <h4 className={`font-bold ${theme.textColors.primary}`}>{bank.name}</h4>
                <Building2 className={`w-5 h-5 ${theme.textColors.muted}`} />
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className={`text-sm ${theme.textColors.secondary}`}>Savings APY:</span>
                  <span className={`font-bold ${bank.savingsAPY >= 4 ? theme.status.success.text : bank.savingsAPY >= 2 ? theme.status.warning.text : theme.status.error.text}`}>
                    {bank.savingsAPY}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={`text-sm ${theme.textColors.secondary}`}>Monthly Fee:</span>
                  <span className={`font-bold ${bank.checkingFee === 0 ? theme.status.success.text : theme.status.error.text}`}>
                    {bank.checkingFee === 0 ? 'FREE' : `$${bank.checkingFee}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className={`text-sm ${theme.textColors.secondary}`}>Overdraft Fee:</span>
                  <span className={`font-bold ${bank.overdraftFee === 0 ? theme.status.success.text : theme.status.error.text}`}>
                    {bank.overdraftFee === 0 ? 'FREE' : `$${bank.overdraftFee}`}
                  </span>
                </div>
              </div>

              <div className={`p-3 ${annualCost < 0 ? theme.status.success.bg : theme.status.error.bg} rounded-lg text-center`}>
                <div className={`text-xs ${annualCost < 0 ? theme.status.success.text : theme.status.error.text} mb-1`}>
                  Annual Net {annualCost < 0 ? 'Earnings' : 'Cost'}
                </div>
                <div className={`text-lg font-bold ${annualCost < 0 ? theme.status.success.text : theme.status.error.text}`}>
                  {annualCost < 0 ? '+' : '-'}{formatCurrency(annualCost)}
                </div>
              </div>

              <p className={`text-xs ${theme.textColors.muted} mt-3 italic text-center`}>
                {bank.bestFor}
              </p>

              {/* Expanded Details */}
              <AnimatePresence>
                {selectedBank === bank.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 pt-4 border-t border-gray-300"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h5 className={`font-bold ${theme.status.success.text} mb-2 flex items-center gap-1`}>
                          <CheckCircle className="w-4 h-4" />
                          Pros
                        </h5>
                        <ul className={`text-xs ${theme.textColors.secondary} space-y-1`}>
                          {bank.pros.map((pro, index) => (
                            <li key={index}>• {pro}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h5 className={`font-bold ${theme.status.error.text} mb-2 flex items-center gap-1`}>
                          <X className="w-4 h-4" />
                          Cons
                        </h5>
                        <ul className={`text-xs ${theme.textColors.secondary} space-y-1`}>
                          {bank.cons.map((con, index) => (
                            <li key={index}>• {con}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {/* Results Summary */}
      <div className={`p-4 ${theme.status.info.bg} border-l-4 ${theme.status.info.border} rounded-lg`}>
        <h4 className={`font-bold ${theme.status.info.text} mb-3 flex items-center gap-2`}>
          <DollarSign className="w-5 h-5" />
          Smart Banking Impact for {selectedScenario.name}
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className={`text-sm ${theme.textColors.secondary} mb-1`}>Best Choice</div>
            <div className={`font-bold ${theme.status.success.text}`}>{bestBank.name}</div>
            <div className={`text-xs ${theme.textColors.muted}`}>
              {calculateAnnualCost(bestBank, selectedScenario) < 0 ? 'Earns' : 'Costs'} {formatCurrency(calculateAnnualCost(bestBank, selectedScenario))}/year
            </div>
          </div>
          <div>
            <div className={`text-sm ${theme.textColors.secondary} mb-1`}>Worst Choice</div>
            <div className={`font-bold ${theme.status.error.text}`}>{worstBank.name}</div>
            <div className={`text-xs ${theme.textColors.muted}`}>
              Costs {formatCurrency(calculateAnnualCost(worstBank, selectedScenario))}/year
            </div>
          </div>
          <div>
            <div className={`text-sm ${theme.textColors.secondary} mb-1`}>Annual Savings</div>
            <div className={`text-2xl font-bold ${theme.status.success.text}`}>{formatCurrency(savings)}</div>
            <div className={`text-xs ${theme.textColors.muted}`}>
              {formatCurrency(savings * 20)} over 20 years
            </div>
          </div>
        </div>

        <div className={`mt-4 p-3 ${theme.backgrounds.card} rounded-lg`}>
          <p className={`text-sm ${theme.textColors.primary} text-center font-bold`}>
            💡 Smart banking choice saves you {formatCurrency(savings)} annually - that&apos;s {formatCurrency(savings * 20)} over 20 years!
          </p>
        </div>
      </div>
    </div>
  );
}
