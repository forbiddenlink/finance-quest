'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, DollarSign, Calculator, TrendingDown, CheckCircle } from 'lucide-react';
import { theme } from '@/lib/theme';
import { useProgressStore } from '@/lib/store/progressStore';

interface FeeInput {
  name: string;
  monthlyFee: number;
  enabled: boolean;
}

export default function BankFeeImpactCalculator() {
  const [monthlyIncome, setMonthlyIncome] = useState(4000);
  const [fees, setFees] = useState<FeeInput[]>([
    { name: 'Monthly Maintenance Fee', monthlyFee: 12, enabled: true },
    { name: 'ATM Fees (Out-of-Network)', monthlyFee: 8, enabled: true },
    { name: 'Overdraft Fees', monthlyFee: 35, enabled: false },
    { name: 'Wire Transfer Fees', monthlyFee: 15, enabled: false },
    { name: 'Paper Statement Fee', monthlyFee: 3, enabled: true },
    { name: 'Foreign Transaction Fee', monthlyFee: 5, enabled: false }
  ]);
  const { recordCalculatorUsage } = useProgressStore();

  useEffect(() => {
    recordCalculatorUsage('bank-fee-impact-calculator');
  }, [recordCalculatorUsage]);

  const updateFee = (index: number, field: keyof FeeInput, value: number | boolean) => {
    const updatedFees = [...fees];
    updatedFees[index] = { ...updatedFees[index], [field]: value };
    setFees(updatedFees);
  };

  const totalMonthlyFees = fees
    .filter(fee => fee.enabled)
    .reduce((sum, fee) => sum + fee.monthlyFee, 0);

  const annualFees = totalMonthlyFees * 12;
  const fiveYearFees = annualFees * 5;
  const tenYearFees = annualFees * 10;
  const feePercentageOfIncome = (totalMonthlyFees / monthlyIncome) * 100;

  // Calculate opportunity cost if fees were invested at 7% return
  const opportunityCost5Years = totalMonthlyFees * 
    ((Math.pow(1 + 0.07/12, 5 * 12) - 1) / (0.07/12));
  const opportunityCost10Years = totalMonthlyFees * 
    ((Math.pow(1 + 0.07/12, 10 * 12) - 1) / (0.07/12));

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Shield className="w-8 h-8 text-red-400" />
          <h2 className={`text-3xl font-bold ${theme.textColors.primary}`}>
            Bank Fee Impact Calculator
          </h2>
        </div>
        <p className={`text-lg ${theme.textColors.secondary} max-w-2xl mx-auto`}>
          Banking fees are wealth destroyers that compound over time. Calculate how much your current 
          bank fees cost you annually and discover the true opportunity cost of staying with expensive banks.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Fee Configuration */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-xl p-6 space-y-6`}
        >
          <h3 className={`text-xl font-semibold ${theme.textColors.primary} flex items-center gap-2`}>
            <Calculator className="w-5 h-5" />
            Your Current Banking Fees
          </h3>

          {/* Monthly Income */}
          <div>
            <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
              Monthly Income
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-400" />
              <input
                type="number"
                min="0"
                step="100"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(parseInt(e.target.value) || 0)}
                className="pl-10 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white/5 border-white/10 text-white"
                placeholder="4000"
                aria-label="Monthly income"
              />
            </div>
          </div>

          {/* Fee Inputs */}
          <div className="space-y-4">
            <h4 className={`font-medium ${theme.textColors.primary}`}>Monthly Banking Fees</h4>
            {fees.map((fee, index) => (
              <div key={fee.name} className="flex items-center gap-4 p-3 bg-white/5 rounded-lg">
                <input
                  type="checkbox"
                  checked={fee.enabled}
                  onChange={(e) => updateFee(index, 'enabled', e.target.checked)}
                  className="w-4 h-4 text-red-600 bg-gray-100 border-gray-300 rounded focus:ring-red-500"
                  aria-label={`Enable ${fee.name}`}
                />
                <div className="flex-1">
                  <label className={`text-sm ${theme.textColors.primary}`}>
                    {fee.name}
                  </label>
                </div>
                <div className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3 text-red-400" />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={fee.monthlyFee}
                    onChange={(e) => updateFee(index, 'monthlyFee', parseFloat(e.target.value) || 0)}
                    className="w-20 px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white/5 border-white/10 text-white"
                    disabled={!fee.enabled}
                    aria-label={`${fee.name} monthly fee`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className={`p-4 bg-red-500/10 border border-red-500/20 rounded-lg`}>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span className={`font-semibold ${theme.textColors.primary}`}>
                Total Monthly Fees: ${totalMonthlyFees.toFixed(2)}
              </span>
            </div>
            <p className={`text-sm ${theme.textColors.secondary}`}>
              That&apos;s {feePercentageOfIncome.toFixed(2)}% of your monthly income going to bank fees
            </p>
          </div>
        </motion.div>

        {/* Fee Impact Analysis */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          {/* Annual Impact */}
          <div className={`${theme.backgrounds.glass} border border-red-500/30 rounded-xl p-6`}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingDown className="w-5 h-5 text-red-400" />
              <h3 className="text-lg font-semibold text-red-400">Annual Fee Impact</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className={theme.textColors.secondary}>Monthly Fees:</span>
                <span className="text-red-400 font-semibold">
                  ${totalMonthlyFees.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={theme.textColors.secondary}>Annual Cost:</span>
                <span className="text-red-400 font-semibold">
                  ${annualFees.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span className={theme.textColors.primary}>5-Year Cost:</span>
                <span className="text-red-400">
                  ${fiveYearFees.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span className={theme.textColors.primary}>10-Year Cost:</span>
                <span className="text-red-400">
                  ${tenYearFees.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Opportunity Cost */}
          <div className={`${theme.backgrounds.glass} border border-yellow-500/30 rounded-xl p-6`}>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-semibold text-yellow-400">Opportunity Cost Analysis</h3>
            </div>
            <p className={`text-sm ${theme.textColors.secondary} mb-4`}>
              If you invested these fees instead at 7% annual return:
            </p>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className={theme.textColors.secondary}>5-Year Investment Value:</span>
                <span className="text-yellow-400 font-semibold">
                  ${opportunityCost5Years.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={theme.textColors.secondary}>10-Year Investment Value:</span>
                <span className="text-yellow-400 font-semibold">
                  ${opportunityCost10Years.toLocaleString()}
                </span>
              </div>
              <div className="mt-4 p-3 bg-yellow-500/10 rounded-lg">
                <p className="text-yellow-200 text-sm">
                  <strong>Lost Wealth:</strong> ${(opportunityCost10Years - tenYearFees).toLocaleString()} 
                  in potential investment growth over 10 years
                </p>
              </div>
            </div>
          </div>

          {/* Solution */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className={`${theme.backgrounds.primary} rounded-xl p-6 text-center`}
          >
            <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <h3 className="text-xl font-bold text-white mb-2">
              Switch to Fee-Free Banking
            </h3>
            <p className="text-green-200">
              Credit unions and online banks offer the same services with zero fees
            </p>
            <p className="text-green-100 text-sm mt-2">
              Save ${annualFees.toFixed(2)}/year and invest the difference for wealth building
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Educational Context */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-xl p-6`}
      >
        <h3 className={`text-xl font-bold ${theme.textColors.primary} mb-4`}>
          Fee-Free Banking Alternatives
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>Online Banks</h4>
            <ul className={`space-y-1 ${theme.textColors.secondary} text-sm`}>
              <li>• No monthly maintenance fees</li>
              <li>• ATM fee reimbursement programs</li>
              <li>• Higher interest rates (4-5% vs 0.01%)</li>
              <li>• Same FDIC insurance protection</li>
            </ul>
          </div>
          <div>
            <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>Credit Unions</h4>
            <ul className={`space-y-1 ${theme.textColors.secondary} text-sm`}>
              <li>• Member-owned, not-for-profit institutions</li>
              <li>• Lower fees and better rates</li>
              <li>• Shared branching network access</li>
              <li>• Personalized customer service</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
