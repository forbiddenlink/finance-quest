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
  
  // Validation state
  const [validationErrors, setValidationErrors] = useState<{[key: string]: string}>({});
  
  const validateInput = (field: string, value: number, min: number, max: number) => {
    const errors = { ...validationErrors };
    if (value < min || value > max) {
      errors[field] = `Value must be between ${min} and ${max}`;
    } else {
      delete errors[field];
    }
    setValidationErrors(errors);
  };
  
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
      <header className="flex items-center gap-3 mb-6">
        <Target className="w-6 h-6 text-orange-400" aria-hidden="true" />
        <h1 className={`text-xl font-bold ${theme.textColors.primary}`}>
          Retirement Account Optimizer
        </h1>
      </header>

      {/* Personal Information */}
      <section aria-labelledby="personal-info-heading">
        <h2 id="personal-info-heading" className="sr-only">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div>
            <label htmlFor="current-age-input" className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
              Current Age
            </label>
            <input
              id="current-age-input"
              type="number"
              value={currentAge}
              onChange={(e) => {
                const value = Number(e.target.value);
                setCurrentAge(value);
                validateInput('currentAge', value, 18, 100);
              }}
              onBlur={(e) => {
                const value = Number(e.target.value);
                validateInput('currentAge', value, 18, 100);
              }}
              className={`w-full px-3 py-2 border rounded-lg ${theme.backgrounds.card} ${theme.textColors.primary}`}
              min="18"
              max="100"
              aria-describedby="current-age-help"
              aria-invalid={validationErrors.currentAge ? 'true' : 'false'}
            />
            <div id="current-age-help" className="sr-only">Enter your current age for retirement calculations</div>
            {validationErrors.currentAge && (
              <div className="text-red-500 text-xs mt-1" role="alert">
                {validationErrors.currentAge}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="retirement-age-input" className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
              Retirement Age
            </label>
            <input
              id="retirement-age-input"
              type="number"
              value={retirementAge}
              onChange={(e) => {
                const value = Number(e.target.value);
                setRetirementAge(value);
                validateInput('retirementAge', value, 50, 100);
              }}
              onBlur={(e) => {
                const value = Number(e.target.value);
                validateInput('retirementAge', value, 50, 100);
              }}
              className={`w-full px-3 py-2 border rounded-lg ${theme.backgrounds.card} ${theme.textColors.primary}`}
              min="50"
              max="100"
              aria-describedby="retirement-age-help"
              aria-invalid={validationErrors.retirementAge ? 'true' : 'false'}
            />
            <div id="retirement-age-help" className="sr-only">Enter your planned retirement age</div>
            {validationErrors.retirementAge && (
              <div className="text-red-500 text-xs mt-1" role="alert">
                {validationErrors.retirementAge}
              </div>
            )}
          </div>

          <div>
            <label htmlFor="current-income-input" className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
              Current Income
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
              <input
                id="current-income-input"
                type="number"
                value={currentIncome}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setCurrentIncome(value);
                  validateInput('currentIncome', value, 0, 1000000);
                }}
                onBlur={(e) => {
                  const value = Number(e.target.value);
                  validateInput('currentIncome', value, 0, 1000000);
                }}
                className={`pl-10 w-full px-3 py-2 border rounded-lg ${theme.backgrounds.card} ${theme.textColors.primary}`}
                aria-describedby="current-income-help"
                aria-invalid={validationErrors.currentIncome ? 'true' : 'false'}
                step="1000"
              />
            </div>
            <div id="current-income-help" className="sr-only">Enter your current annual income for tax optimization</div>
            {validationErrors.currentIncome && (
              <div className="text-red-500 text-xs mt-1" role="alert">
                {validationErrors.currentIncome}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Tax Information */}
      <section aria-labelledby="tax-info-heading">
        <h2 id="tax-info-heading" className="sr-only">Tax Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label htmlFor="current-tax-bracket" className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
              Current Tax Bracket (%)
            </label>
            <select
              id="current-tax-bracket"
              value={currentTaxBracket}
              onChange={(e) => setCurrentTaxBracket(Number(e.target.value))}
              className={`w-full px-3 py-2 border rounded-lg ${theme.backgrounds.card} ${theme.textColors.primary}`}
              aria-describedby="current-tax-bracket-help"
            >
              <option value={10}>10% - Up to $11,000</option>
              <option value={12}>12% - $11,001 to $44,725</option>
              <option value={22}>22% - $44,726 to $95,375</option>
              <option value={24}>24% - $95,376 to $182,050</option>
              <option value={32}>32% - $182,051 to $231,250</option>
              <option value={35}>35% - $231,251 to $578,125</option>
              <option value={37}>37% - $578,126+</option>
            </select>
            <div id="current-tax-bracket-help" className="sr-only">Select your current marginal tax bracket for optimization</div>
          </div>

          <div>
            <label htmlFor="retirement-tax-bracket" className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
              Expected Retirement Tax Bracket (%)
            </label>
            <select
              id="retirement-tax-bracket"
              value={expectedRetirementTaxBracket}
              onChange={(e) => setExpectedRetirementTaxBracket(Number(e.target.value))}
              className={`w-full px-3 py-2 border rounded-lg ${theme.backgrounds.card} ${theme.textColors.primary}`}
              aria-describedby="retirement-tax-bracket-help"
            >
              <option value={0}>0% - Very Low Income</option>
              <option value={10}>10% - Low Income</option>
              <option value={12}>12% - Lower-Middle Income</option>
              <option value={22}>22% - Middle Income</option>
              <option value={24}>24% - Upper-Middle Income</option>
              <option value={32}>32% - High Income</option>
              <option value={35}>35% - Very High Income</option>
            </select>
            <div id="retirement-tax-bracket-help" className="sr-only">Select your expected tax bracket in retirement</div>
          </div>
        </div>
      </section>

      {/* Optimization Results */}
      {optimization && (
        <section aria-labelledby="optimization-results-heading">
          <h2 id="optimization-results-heading" className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
            Tax Optimization Analysis
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6" role="group" aria-labelledby="optimization-summary">
            <h3 id="optimization-summary" className="sr-only">Optimization Summary</h3>
            
            <div className={`p-4 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg text-center`}>
              <div className={`text-2xl font-bold ${theme.status.info.text} mb-1`} aria-label={`Recommended strategy: ${optimization.recommendedStrategy}`}>
                {optimization.recommendedStrategy}
              </div>
              <div className={`text-sm ${theme.textColors.secondary}`}>Recommended Strategy</div>
            </div>
            
            <div className={`p-4 ${theme.status.success.bg} border ${theme.status.success.border} rounded-lg text-center`}>
              <div className={`text-2xl font-bold ${theme.status.success.text} mb-1`} aria-label={`Annual tax savings: $${optimization.currentTaxSavings.toLocaleString()}`}>
                ${optimization.currentTaxSavings.toLocaleString()}
              </div>
              <div className={`text-sm ${theme.textColors.secondary}`}>Annual Tax Savings</div>
            </div>

            <div className={`p-4 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg text-center`}>
              <div className={`text-2xl font-bold ${theme.textColors.primary} mb-1`} aria-label={`Catch-up contributions eligibility: ${currentAge >= 50 ? 'Eligible' : `${50 - currentAge} years until eligible`}`}>
                {currentAge >= 50 ? 'Eligible' : `${50 - currentAge} years`}
              </div>
              <div className={`text-sm ${theme.textColors.secondary}`}>Catch-up Contributions</div>
            </div>
          </div>
        </section>
      )}

      {/* Account Management */}
      <section aria-labelledby="account-management-heading">
        <header className="flex items-center justify-between mb-4">
          <h2 id="account-management-heading" className={`text-lg font-semibold ${theme.textColors.primary}`}>
            Retirement Accounts
          </h2>
          <button
            onClick={addAccount}
            className={`px-4 py-2 ${theme.buttons.primary} text-white rounded-lg hover:opacity-90 transition-opacity`}
            aria-describedby="add-account-desc"
          >
            Add Account
          </button>
          <div id="add-account-desc" className="sr-only">Add a new retirement account to your optimization analysis</div>
        </header>

        <div className="space-y-4" role="group" aria-labelledby="account-list-heading">
          <h3 id="account-list-heading" className="sr-only">Your Retirement Accounts</h3>
          {accounts.map((account, index) => (
            <div key={index} className={`p-4 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
              <fieldset className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
                <legend className="sr-only">Account {index + 1} details</legend>
                
                <div className="md:col-span-2">
                  <label htmlFor={`account-type-${index}`} className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                    Account Type
                  </label>
                  <select
                    id={`account-type-${index}`}
                    value={account.type}
                    onChange={(e) => updateAccount(index, 'type', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg ${theme.backgrounds.card} ${theme.textColors.primary}`}
                    aria-describedby={`account-type-desc-${index}`}
                  >
                    <option value="Traditional 401k">Traditional 401(k)</option>
                    <option value="Roth 401k">Roth 401(k)</option>
                    <option value="Traditional IRA">Traditional IRA</option>
                    <option value="Roth IRA">Roth IRA</option>
                    <option value="HSA">HSA</option>
                    <option value="Taxable">Taxable Account</option>
                  </select>
                  <div id={`account-type-desc-${index}`} className="sr-only">
                    Select the type of retirement account for optimization analysis
                  </div>
                </div>

                <div>
                  <label htmlFor={`current-balance-${index}`} className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                    Current Balance
                  </label>
                  <input
                    id={`current-balance-${index}`}
                    type="number"
                    min="0"
                    step="1000"
                    value={account.currentBalance}
                    onChange={(e) => updateAccount(index, 'currentBalance', Number(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-lg ${theme.backgrounds.card} ${theme.textColors.primary}`}
                    aria-describedby={`current-balance-desc-${index}`}
                  />
                  <div id={`current-balance-desc-${index}`} className="sr-only">
                    Enter current account balance for projection calculations
                  </div>
                </div>

                <div>
                  <label htmlFor={`monthly-contribution-${index}`} className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                    Monthly Contribution
                  </label>
                  <input
                    id={`monthly-contribution-${index}`}
                    type="number"
                    min="0"
                    step="50"
                    value={account.monthlyContribution}
                    onChange={(e) => updateAccount(index, 'monthlyContribution', Number(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-lg ${theme.backgrounds.card} ${theme.textColors.primary}`}
                    aria-describedby={`monthly-contribution-desc-${index}`}
                  />
                  <div id={`monthly-contribution-desc-${index}`} className="sr-only">
                    Enter monthly contribution amount for this account
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                    Tax Treatment
                  </label>
                  <span 
                    className={`px-2 py-1 rounded text-sm font-medium ${getTaxTreatmentColor(account.taxTreatment)}`}
                    aria-label={`Tax treatment: ${getTaxTreatmentLabel(account.taxTreatment)}`}
                  >
                    {getTaxTreatmentLabel(account.taxTreatment)}
                  </span>
                </div>

                <div>
                  <button
                    onClick={() => removeAccount(index)}
                    className={`w-full px-3 py-2 ${theme.status.error.bg} ${theme.status.error.text} rounded-lg hover:opacity-80 transition-opacity`}
                    disabled={accounts.length <= 1}
                    aria-label={`Remove account ${index + 1}`}
                    aria-describedby={`remove-account-desc-${index}`}
                  >
                    Remove
                  </button>
                  <div id={`remove-account-desc-${index}`} className="sr-only">
                    Remove this retirement account from the analysis
                  </div>
                </div>
              </fieldset>

              {account.type.includes('401k') && (
                <div className="mt-4">
                  <label htmlFor={`employer-match-${index}`} className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                    Monthly Employer Match
                  </label>
                  <input
                    id={`employer-match-${index}`}
                    type="number"
                    min="0"
                    step="50"
                    value={account.employerMatch || 0}
                    onChange={(e) => updateAccount(index, 'employerMatch', Number(e.target.value))}
                    className={`w-32 px-3 py-2 border rounded-lg ${theme.backgrounds.card} ${theme.textColors.primary}`}
                    aria-describedby={`employer-match-desc-${index}`}
                  />
                  <div id={`employer-match-desc-${index}`} className="sr-only">
                    Enter monthly employer matching contribution amount
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Recommendations */}
      {optimization && optimization.recommendations.length > 0 && (
        <section aria-labelledby="recommendations-heading">
          <h2 id="recommendations-heading" className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
            <Calculator className="w-5 h-5" aria-hidden="true" />
            Optimization Recommendations
          </h2>
          
          <div className="space-y-3" role="list" aria-label="Retirement account optimization recommendations">
            {optimization.recommendations.map((recommendation, index) => (
              <div key={index} className={`p-3 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg flex items-start gap-3`} role="listitem">
                <CheckCircle className={`w-4 h-4 ${theme.status.info.text} mt-0.5 flex-shrink-0`} aria-hidden="true" />
                <p className={`text-sm ${theme.status.info.text}`}>
                  {recommendation}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education Section */}
      <section aria-labelledby="education-heading" className={`p-4 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
        <h2 id="education-heading" className={`font-semibold ${theme.textColors.primary} mb-3 flex items-center gap-2`}>
          <PiggyBank className="w-4 h-4" aria-hidden="true" />
          Account Type Guide
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className={`font-medium ${theme.textColors.primary} mb-2`}>Traditional Accounts:</h3>
            <ul className={`space-y-1 ${theme.textColors.secondary}`} role="list">
              <li role="listitem">• Tax deduction on contributions</li>
              <li role="listitem">• Tax-deferred growth</li>
              <li role="listitem">• Taxed on withdrawals</li>
              <li role="listitem">• Required distributions at 73</li>
            </ul>
          </div>
          <div>
            <h3 className={`font-medium ${theme.textColors.primary} mb-2`}>Roth Accounts:</h3>
            <ul className={`space-y-1 ${theme.textColors.secondary}`} role="list">
              <li role="listitem">• No tax deduction on contributions</li>
              <li role="listitem">• Tax-free growth</li>
              <li role="listitem">• Tax-free withdrawals in retirement</li>
              <li role="listitem">• No required distributions</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Screen Reader Status Updates */}
      <div 
        role="status" 
        aria-live="polite" 
        className="sr-only"
      >
        {optimization ? 
          `Optimization analysis complete. ${optimization.recommendations.length} recommendations available.` :
          'Enter your retirement information to begin analysis.'
        }
      </div>
    </div>
  );
};

export default RetirementAccountOptimizer;
