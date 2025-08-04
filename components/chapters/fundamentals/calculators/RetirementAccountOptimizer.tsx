'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import {
  PiggyBank,
  Target,
  DollarSign,
  Calculator,
  CheckCircle
} from 'lucide-react';

interface Account {
  type: 'Traditional 401k' | 'Roth 401k' | 'Traditional IRA' | 'Roth IRA' | 'Taxable' | 'HSA';
  currentBalance: number;
  monthlyContribution: number;
  employerMatch?: number;
  taxTreatment: 'pre-tax' | 'post-tax' | 'tax-free';
  contributionLimit: number;
  catchUpLimit?: number;
}

interface TaxOptimizationResult {
  recommendedStrategy: string;
  currentTaxSavings: number;
  futureProjections: {
    account: string;
    balance: number;
    taxableWithdrawals: number;
    taxFreeWithdrawals: number;
  }[];
  recommendations: string[];
}

const RetirementAccountOptimizer: React.FC = () => {
  const { recordCalculatorUsage } = useProgressStore();
  
  const [currentAge, setCurrentAge] = useState<number>(35);
  const [retirementAge, setRetirementAge] = useState<number>(65);
  const [currentIncome, setCurrentIncome] = useState<number>(100000);
  const [currentTaxBracket, setCurrentTaxBracket] = useState<number>(22);
  const [expectedRetirementTaxBracket, setExpectedRetirementTaxBracket] = useState<number>(15);
  
  const [accounts, setAccounts] = useState<Account[]>([
    {
      type: 'Traditional 401k',
      currentBalance: 50000,
      monthlyContribution: 1000,
      employerMatch: 500,
      taxTreatment: 'pre-tax',
      contributionLimit: 23000,
      catchUpLimit: 7500
    },
    {
      type: 'Roth IRA',
      currentBalance: 15000,
      monthlyContribution: 500,
      taxTreatment: 'post-tax',
      contributionLimit: 7000,
      catchUpLimit: 1000
    }
  ]);

  const [optimization, setOptimization] = useState<TaxOptimizationResult | null>(null);

  useEffect(() => {
    recordCalculatorUsage('retirement-account-optimizer');
  }, [recordCalculatorUsage]);

  useEffect(() => {
    calculateOptimization();
  }, [currentAge, retirementAge, currentIncome, currentTaxBracket, expectedRetirementTaxBracket, accounts]); // eslint-disable-line react-hooks/exhaustive-deps

  const addAccount = () => {
    const newAccount: Account = {
      type: 'Traditional IRA',
      currentBalance: 0,
      monthlyContribution: 0,
      taxTreatment: 'pre-tax',
      contributionLimit: 7000,
      catchUpLimit: 1000
    };
    setAccounts([...accounts, newAccount]);
  };

  const updateAccount = (index: number, field: keyof Account, value: string | number) => {
    const newAccounts = [...accounts];
    newAccounts[index] = { ...newAccounts[index], [field]: value };
    
    // Update tax treatment based on account type
    if (field === 'type') {
      const accountType = value as Account['type'];
      if (accountType.includes('Roth')) {
        newAccounts[index].taxTreatment = 'post-tax';
      } else if (accountType === 'HSA') {
        newAccounts[index].taxTreatment = 'tax-free';
      } else {
        newAccounts[index].taxTreatment = 'pre-tax';
      }
      
      // Update contribution limits
      const limits = getContributionLimits(accountType);
      newAccounts[index].contributionLimit = limits.regular;
      newAccounts[index].catchUpLimit = limits.catchUp;
    }
    
    setAccounts(newAccounts);
  };

  const removeAccount = (index: number) => {
    if (accounts.length > 1) {
      setAccounts(accounts.filter((_, i) => i !== index));
    }
  };

  const getContributionLimits = (accountType: Account['type']) => {
    const limits: { [key in Account['type']]: { regular: number; catchUp: number } } = {
      'Traditional 401k': { regular: 23000, catchUp: 7500 },
      'Roth 401k': { regular: 23000, catchUp: 7500 },
      'Traditional IRA': { regular: 7000, catchUp: 1000 },
      'Roth IRA': { regular: 7000, catchUp: 1000 },
      'Taxable': { regular: Infinity, catchUp: 0 },
      'HSA': { regular: 4300, catchUp: 1000 }
    };
    return limits[accountType];
  };

  const calculateOptimization = useCallback(() => {
    const yearsToRetirement = retirementAge - currentAge;
    const isCatchUpEligible = currentAge >= 50;
    
    // Calculate current tax savings
    const preTaxContributions = accounts
      .filter(acc => acc.taxTreatment === 'pre-tax')
      .reduce((sum, acc) => sum + (acc.monthlyContribution * 12), 0);
    
    const currentTaxSavings = preTaxContributions * (currentTaxBracket / 100);

    // Project future balances
    const futureProjections = accounts.map(account => {
      const annualContribution = account.monthlyContribution * 12;
      const projectedBalance = account.currentBalance * Math.pow(1.07, yearsToRetirement) +
        (annualContribution * (Math.pow(1.07, yearsToRetirement) - 1) / 0.07);

      return {
        account: account.type,
        balance: projectedBalance,
        taxableWithdrawals: account.taxTreatment === 'pre-tax' ? projectedBalance : 0,
        taxFreeWithdrawals: account.taxTreatment === 'post-tax' || account.taxTreatment === 'tax-free' ? projectedBalance : 0
      };
    });

    // Generate recommendations
    const recommendations: string[] = [];
    
    // Check if maximizing employer match
    const has401k = accounts.find(acc => acc.type.includes('401k'));
    if (has401k && has401k.employerMatch) {
      const maxMatch = Math.min(has401k.monthlyContribution * 12, has401k.employerMatch * 12);
      if ((has401k.monthlyContribution * 12) < maxMatch) {
        recommendations.push('Increase 401(k) contribution to maximize employer match - it\'s free money!');
      }
    }

    // Tax diversification
    const hasRoth = accounts.some(acc => acc.taxTreatment === 'post-tax');
    const hasTraditional = accounts.some(acc => acc.taxTreatment === 'pre-tax');
    
    if (!hasRoth) {
      recommendations.push('Consider adding Roth contributions for tax diversification in retirement');
    }
    if (!hasTraditional && currentTaxBracket > expectedRetirementTaxBracket) {
      recommendations.push('Consider traditional (pre-tax) contributions to reduce current tax burden');
    }

    // HSA optimization
    const hasHSA = accounts.some(acc => acc.type === 'HSA');
    if (!hasHSA) {
      recommendations.push('Consider an HSA - triple tax advantage for healthcare and retirement');
    }

    // Contribution limits
    accounts.forEach((account) => {
      const annualContribution = account.monthlyContribution * 12;
      const effectiveLimit = isCatchUpEligible ? 
        account.contributionLimit + (account.catchUpLimit || 0) : 
        account.contributionLimit;
      
      if (annualContribution > effectiveLimit) {
        recommendations.push(`${account.type} contribution exceeds annual limit of $${effectiveLimit.toLocaleString()}`);
      }
    });

    // Determine recommended strategy
    let recommendedStrategy = 'Balanced Traditional/Roth Strategy';
    if (currentTaxBracket > expectedRetirementTaxBracket + 5) {
      recommendedStrategy = 'Traditional (Pre-tax) Focus';
    } else if (expectedRetirementTaxBracket > currentTaxBracket + 5) {
      recommendedStrategy = 'Roth (Post-tax) Focus';
    }

    setOptimization({
      recommendedStrategy,
      currentTaxSavings,
      futureProjections,
      recommendations
    });
  }, [retirementAge, currentAge, accounts, currentTaxBracket, expectedRetirementTaxBracket]);

  const getTaxTreatmentColor = (treatment: Account['taxTreatment']) => {
    switch (treatment) {
      case 'pre-tax': return theme.status.warning.text;
      case 'post-tax': return theme.status.info.text;
      case 'tax-free': return theme.status.success.text;
      default: return theme.textColors.secondary;
    }
  };

  const getTaxTreatmentLabel = (treatment: Account['taxTreatment']) => {
    switch (treatment) {
      case 'pre-tax': return 'Pre-tax (Traditional)';
      case 'post-tax': return 'Post-tax (Roth)';
      case 'tax-free': return 'Tax-free Growth';
      default: return treatment;
    }
  };

  return (
    <div className={`p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
      <div className="flex items-center gap-3 mb-6">
        <Target className="w-6 h-6 text-orange-400" />
        <h2 className={`text-xl font-bold ${theme.textColors.primary}`}>
          Retirement Account Optimizer
        </h2>
      </div>

      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div>
          <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
            Current Age
          </label>
          <input
            type="number"
            value={currentAge}
            onChange={(e) => setCurrentAge(Number(e.target.value))}
            className={`w-full px-3 py-2 border rounded-lg ${theme.backgrounds.card} ${theme.textColors.primary}`}
            min="18"
            max="100"
          />
        </div>

        <div>
          <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
            Retirement Age
          </label>
          <input
            type="number"
            value={retirementAge}
            onChange={(e) => setRetirementAge(Number(e.target.value))}
            className={`w-full px-3 py-2 border rounded-lg ${theme.backgrounds.card} ${theme.textColors.primary}`}
            min="50"
            max="100"
          />
        </div>

        <div>
          <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
            Current Income
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="number"
              value={currentIncome}
              onChange={(e) => setCurrentIncome(Number(e.target.value))}
              className={`pl-10 w-full px-3 py-2 border rounded-lg ${theme.backgrounds.card} ${theme.textColors.primary}`}
            />
          </div>
        </div>
      </div>

      {/* Tax Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
            Current Tax Bracket (%)
          </label>
          <select
            value={currentTaxBracket}
            onChange={(e) => setCurrentTaxBracket(Number(e.target.value))}
            className={`w-full px-3 py-2 border rounded-lg ${theme.backgrounds.card} ${theme.textColors.primary}`}
          >
            <option value={10}>10% - Up to $11,000</option>
            <option value={12}>12% - $11,001 to $44,725</option>
            <option value={22}>22% - $44,726 to $95,375</option>
            <option value={24}>24% - $95,376 to $182,050</option>
            <option value={32}>32% - $182,051 to $231,250</option>
            <option value={35}>35% - $231,251 to $578,125</option>
            <option value={37}>37% - $578,126+</option>
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
            Expected Retirement Tax Bracket (%)
          </label>
          <select
            value={expectedRetirementTaxBracket}
            onChange={(e) => setExpectedRetirementTaxBracket(Number(e.target.value))}
            className={`w-full px-3 py-2 border rounded-lg ${theme.backgrounds.card} ${theme.textColors.primary}`}
          >
            <option value={0}>0% - Very Low Income</option>
            <option value={10}>10% - Low Income</option>
            <option value={12}>12% - Lower-Middle Income</option>
            <option value={22}>22% - Middle Income</option>
            <option value={24}>24% - Upper-Middle Income</option>
            <option value={32}>32% - High Income</option>
            <option value={35}>35% - Very High Income</option>
          </select>
        </div>
      </div>

      {/* Optimization Results */}
      {optimization && (
        <div className="mb-8">
          <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
            Tax Optimization Analysis
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className={`p-4 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg text-center`}>
              <div className={`text-2xl font-bold ${theme.status.info.text} mb-1`}>
                {optimization.recommendedStrategy}
              </div>
              <div className={`text-sm ${theme.textColors.secondary}`}>Recommended Strategy</div>
            </div>
            
            <div className={`p-4 ${theme.status.success.bg} border ${theme.status.success.border} rounded-lg text-center`}>
              <div className={`text-2xl font-bold ${theme.status.success.text} mb-1`}>
                ${optimization.currentTaxSavings.toLocaleString()}
              </div>
              <div className={`text-sm ${theme.textColors.secondary}`}>Annual Tax Savings</div>
            </div>

            <div className={`p-4 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg text-center`}>
              <div className={`text-2xl font-bold ${theme.textColors.primary} mb-1`}>
                {currentAge >= 50 ? 'Eligible' : `${50 - currentAge} years`}
              </div>
              <div className={`text-sm ${theme.textColors.secondary}`}>Catch-up Contributions</div>
            </div>
          </div>
        </div>
      )}

      {/* Account Management */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>Retirement Accounts</h3>
          <button
            onClick={addAccount}
            className={`px-4 py-2 ${theme.buttons.primary} text-white rounded-lg hover:opacity-90 transition-opacity`}
          >
            Add Account
          </button>
        </div>

        <div className="space-y-4">
          {accounts.map((account, index) => (
            <div key={index} className={`p-4 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                <div className="md:col-span-2">
                  <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                    Account Type
                  </label>
                  <select
                    value={account.type}
                    onChange={(e) => updateAccount(index, 'type', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg ${theme.backgrounds.card} ${theme.textColors.primary}`}
                  >
                    <option value="Traditional 401k">Traditional 401(k)</option>
                    <option value="Roth 401k">Roth 401(k)</option>
                    <option value="Traditional IRA">Traditional IRA</option>
                    <option value="Roth IRA">Roth IRA</option>
                    <option value="HSA">HSA</option>
                    <option value="Taxable">Taxable Account</option>
                  </select>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                    Current Balance
                  </label>
                  <input
                    type="number"
                    value={account.currentBalance}
                    onChange={(e) => updateAccount(index, 'currentBalance', Number(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-lg ${theme.backgrounds.card} ${theme.textColors.primary}`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                    Monthly Contribution
                  </label>
                  <input
                    type="number"
                    value={account.monthlyContribution}
                    onChange={(e) => updateAccount(index, 'monthlyContribution', Number(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-lg ${theme.backgrounds.card} ${theme.textColors.primary}`}
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                    Tax Treatment
                  </label>
                  <span className={`px-2 py-1 rounded text-sm font-medium ${getTaxTreatmentColor(account.taxTreatment)}`}>
                    {getTaxTreatmentLabel(account.taxTreatment)}
                  </span>
                </div>

                <div>
                  <button
                    onClick={() => removeAccount(index)}
                    className={`w-full px-3 py-2 ${theme.status.error.bg} ${theme.status.error.text} rounded-lg hover:opacity-80 transition-opacity`}
                    disabled={accounts.length <= 1}
                  >
                    Remove
                  </button>
                </div>
              </div>

              {account.type.includes('401k') && (
                <div className="mt-4">
                  <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                    Monthly Employer Match
                  </label>
                  <input
                    type="number"
                    value={account.employerMatch || 0}
                    onChange={(e) => updateAccount(index, 'employerMatch', Number(e.target.value))}
                    className={`w-32 px-3 py-2 border rounded-lg ${theme.backgrounds.card} ${theme.textColors.primary}`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      {optimization && optimization.recommendations.length > 0 && (
        <div className="mb-8">
          <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
            <Calculator className="w-5 h-5" />
            Optimization Recommendations
          </h3>
          
          <div className="space-y-3">
            {optimization.recommendations.map((recommendation, index) => (
              <div key={index} className={`p-3 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg flex items-start gap-3`}>
                <CheckCircle className={`w-4 h-4 ${theme.status.info.text} mt-0.5 flex-shrink-0`} />
                <p className={`text-sm ${theme.status.info.text}`}>
                  {recommendation}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education Section */}
      <div className={`p-4 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
        <h4 className={`font-semibold ${theme.textColors.primary} mb-3 flex items-center gap-2`}>
          <PiggyBank className="w-4 h-4" />
          Account Type Guide
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>Traditional Accounts:</h5>
            <ul className={`space-y-1 ${theme.textColors.secondary}`}>
              <li>• Tax deduction on contributions</li>
              <li>• Tax-deferred growth</li>
              <li>• Taxed on withdrawals</li>
              <li>• Required distributions at 73</li>
            </ul>
          </div>
          <div>
            <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>Roth Accounts:</h5>
            <ul className={`space-y-1 ${theme.textColors.secondary}`}>
              <li>• No tax deduction on contributions</li>
              <li>• Tax-free growth</li>
              <li>• Tax-free withdrawals in retirement</li>
              <li>• No required distributions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetirementAccountOptimizer;
