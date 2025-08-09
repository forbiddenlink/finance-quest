'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import {
  Shield,
  DollarSign,
  Calendar,
  TrendingDown,
  Briefcase,
  AlertTriangle,
  Info,
  Calculator
} from 'lucide-react';

interface DisabilityAnalysis {
  currentIncome: number;
  recommendedCoverage: number;
  monthlyCoverage: number;
  existingCoverage: number;
  coverageGap: number;
  estimatedPremium: number;
  benefitPeriod: string;
  waitingPeriod: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

interface ExpenseCategory {
  id: string;
  name: string;
  amount: number;
  essential: boolean;
}

export default function DisabilityInsuranceCalculator() {
  const { recordCalculatorUsage } = useProgressStore();
  
  const [grossIncome, setGrossIncome] = useState<number>(75000);
  const [currentAge, setCurrentAge] = useState<number>(35);
  const [occupation, setOccupation] = useState<string>('office-worker');
  const [existingDisabilityCoverage, setExistingDisabilityCoverage] = useState<number>(0);
  const [emergencyFund, setEmergencyFund] = useState<number>(25000);
  const [hasWorkersComp, setHasWorkersComp] = useState<boolean>(true);
  const [hasSocialSecurity, setHasSocialSecurity] = useState<boolean>(true);
  const [preferredBenefitPeriod, setPreferredBenefitPeriod] = useState<string>('age-65');
  const [preferredWaitingPeriod, setPreferredWaitingPeriod] = useState<string>('90-days');
  
  const [monthlyExpenses, setMonthlyExpenses] = useState<ExpenseCategory[]>([
    { id: '1', name: 'Housing (Rent/Mortgage)', amount: 2000, essential: true },
    { id: '2', name: 'Food & Groceries', amount: 600, essential: true },
    { id: '3', name: 'Transportation', amount: 500, essential: true },
    { id: '4', name: 'Insurance (Health, Auto)', amount: 400, essential: true },
    { id: '5', name: 'Utilities', amount: 250, essential: true },
    { id: '6', name: 'Minimum Debt Payments', amount: 300, essential: true },
    { id: '7', name: 'Entertainment', amount: 300, essential: false },
    { id: '8', name: 'Dining Out', amount: 250, essential: false },
    { id: '9', name: 'Shopping', amount: 200, essential: false }
  ]);

  const [analysis, setAnalysis] = useState<DisabilityAnalysis | null>(null);

  useEffect(() => {
    recordCalculatorUsage('disability-insurance-calculator');
  }, [recordCalculatorUsage]);

  const occupationRiskLevels = useMemo(() => ({
    'office-worker': { risk: 'Low' as const, multiplier: 1.0 },
    'teacher': { risk: 'Low' as const, multiplier: 1.0 },
    'healthcare': { risk: 'Medium' as const, multiplier: 1.2 },
    'retail': { risk: 'Medium' as const, multiplier: 1.1 },
    'manufacturing': { risk: 'High' as const, multiplier: 1.5 },
    'construction': { risk: 'High' as const, multiplier: 1.8 },
    'transportation': { risk: 'High' as const, multiplier: 1.6 },
    'public-safety': { risk: 'High' as const, multiplier: 2.0 }
  }), []);

  const updateExpense = (id: string, field: keyof ExpenseCategory, value: string | number | boolean) => {
    setMonthlyExpenses(prev => prev.map(expense => 
      expense.id === id ? { ...expense, [field]: value } : expense
    ));
  };

  const addExpense = () => {
    const newExpense: ExpenseCategory = {
      id: Date.now().toString(),
      name: 'New Expense',
      amount: 0,
      essential: false
    };
    setMonthlyExpenses([...monthlyExpenses, newExpense]);
  };

  const removeExpense = (id: string) => {
    setMonthlyExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const calculateDisabilityNeeds = useCallback(() => {
    const monthlyIncome = grossIncome / 12;
    // Calculate essential expenses
    const essentialExpenses = monthlyExpenses
      .filter(expense => expense.essential)
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    // Recommended coverage is 60-80% of gross income, but should cover essential expenses at minimum
    const recommendedPercentage = 0.70; // 70% of gross income
    const recommendedCoverage = monthlyIncome * recommendedPercentage;
    const adjustedCoverage = Math.max(recommendedCoverage, essentialExpenses);
    
    // Calculate coverage gap
    const coverageGap = Math.max(0, adjustedCoverage - existingDisabilityCoverage);
    
    // Get occupation risk data
    const occupationData = occupationRiskLevels[occupation as keyof typeof occupationRiskLevels] || 
                          occupationRiskLevels['office-worker'];
    
    // Calculate estimated premium (simplified)
    // Premium is typically 1-3% of annual income for individual policies
    let premiumRate = 0.02; // Base 2% of annual income
    premiumRate *= occupationData.multiplier; // Adjust for occupation risk
    
    // Age adjustments
    if (currentAge > 45) premiumRate += 0.005;
    if (currentAge > 55) premiumRate += 0.01;
    
    // Waiting period adjustments
    const waitingPeriodMultiplier = {
      '30-days': 1.3,
      '60-days': 1.1,
      '90-days': 1.0,
      '180-days': 0.8,
      '365-days': 0.6
    }[preferredWaitingPeriod] || 1.0;
    
    premiumRate *= waitingPeriodMultiplier;
    
    const estimatedPremium = (adjustedCoverage * 12) * premiumRate;
    
    const analysisResult: DisabilityAnalysis = {
      currentIncome: grossIncome,
      recommendedCoverage: adjustedCoverage * 12, // Annual coverage
      monthlyCoverage: adjustedCoverage,
      existingCoverage: existingDisabilityCoverage * 12, // Convert to annual
      coverageGap: coverageGap * 12, // Convert to annual
      estimatedPremium,
      benefitPeriod: preferredBenefitPeriod,
      waitingPeriod: preferredWaitingPeriod,
      riskLevel: occupationData.risk
    };
    
    setAnalysis(analysisResult);
  }, [
    grossIncome,
    currentAge,
    occupation,
    existingDisabilityCoverage,
    monthlyExpenses,
    preferredBenefitPeriod,
    preferredWaitingPeriod,
    occupationRiskLevels
  ]);

  useEffect(() => {
    calculateDisabilityNeeds();
  }, [calculateDisabilityNeeds]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getDisabilityRiskByAge = (age: number): string => {
    if (age < 30) return 'Low - Focus on building emergency fund first';
    if (age < 45) return 'Moderate - Consider basic coverage';
    if (age < 55) return 'High - Essential protection period';
    return 'Very High - Maximum protection needed';
  };

  const getSocialSecurityEstimate = (income: number): number => {
    // Simplified SSDI calculation - actual is more complex
    const monthlyIncome = income / 12;
    if (monthlyIncome <= 1115) return monthlyIncome * 0.9;
    if (monthlyIncome <= 6721) return 1115 * 0.9 + (monthlyIncome - 1115) * 0.32;
    return 1115 * 0.9 + (6721 - 1115) * 0.32 + (monthlyIncome - 6721) * 0.15;
  };

  return (
    <div className={`p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
      <div className="flex items-start sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
        <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 flex-shrink-0" />
        <h2 className={`text-lg sm:text-xl font-bold ${theme.textColors.primary} leading-tight`}>
          Disability Insurance Calculator
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Personal Information
            </h3>
            
            <div className="space-y-4">
              <div>
                <label 
                  htmlFor="gross-annual-income"
                  className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}
                >
                  Gross Annual Income
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="gross-annual-income"
                    type="number"
                    value={grossIncome}
                    onChange={(e) => setGrossIncome(Number(e.target.value))}
                    className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    placeholder="75000"
                  />
                </div>
              </div>

              <div>
                <label 
                  htmlFor="current-age"
                  className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}
                >
                  Current Age
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="current-age"
                    type="number"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(Number(e.target.value))}
                    className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    placeholder="35"
                  />
                </div>
              </div>

              <div>
                <label 
                  htmlFor="occupation-category"
                  className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}
                >
                  Occupation Category
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select
                    id="occupation-category"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                  >
                    <option value="office-worker">Office Worker</option>
                    <option value="teacher">Teacher/Education</option>
                    <option value="healthcare">Healthcare Worker</option>
                    <option value="retail">Retail/Sales</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="construction">Construction</option>
                    <option value="transportation">Transportation</option>
                    <option value="public-safety">Public Safety</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Existing Monthly Disability Coverage
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    value={existingDisabilityCoverage}
                    onChange={(e) => setExistingDisabilityCoverage(Number(e.target.value))}
                    className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Emergency Fund
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    value={emergencyFund}
                    onChange={(e) => setEmergencyFund(Number(e.target.value))}
                    className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    placeholder="25000"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Policy Preferences
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Benefit Period
                </label>
                <select
                  value={preferredBenefitPeriod}
                  onChange={(e) => setPreferredBenefitPeriod(e.target.value)}
                  className={`w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                >
                  <option value="2-years">2 Years</option>
                  <option value="5-years">5 Years</option>
                  <option value="10-years">10 Years</option>
                  <option value="age-65">Until Age 65</option>
                  <option value="age-67">Until Age 67</option>
                </select>
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Waiting Period (Elimination Period)
                </label>
                <select
                  value={preferredWaitingPeriod}
                  onChange={(e) => setPreferredWaitingPeriod(e.target.value)}
                  className={`w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                >
                  <option value="30-days">30 Days</option>
                  <option value="60-days">60 Days</option>
                  <option value="90-days">90 Days</option>
                  <option value="180-days">180 Days</option>
                  <option value="365-days">365 Days</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={hasWorkersComp}
                    onChange={(e) => setHasWorkersComp(e.target.checked)}
                    className="mr-2"
                  />
                  <span className={`text-sm ${theme.textColors.primary}`}>Have Workers&apos; Compensation</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={hasSocialSecurity}
                    onChange={(e) => setHasSocialSecurity(e.target.checked)}
                    className="mr-2"
                  />
                  <span className={`text-sm ${theme.textColors.primary}`}>Eligible for Social Security Disability</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>
                Monthly Expenses
              </h3>
              <button
                onClick={addExpense}
                className={`px-3 py-1 text-sm ${theme.buttons.secondary} rounded`}
              >
                Add Expense
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {monthlyExpenses.map((expense) => (
                <div key={expense.id} className={`p-2 sm:p-3 bg-slate-800/50 border ${theme.borderColors.primary} rounded-lg`}>
                  <div className="flex items-center justify-between mb-1 sm:mb-2">
                    <input
                      type="text"
                      value={expense.name}
                      onChange={(e) => updateExpense(expense.id, 'name', e.target.value)}
                      className={`bg-transparent ${theme.textColors.primary} text-xs sm:text-sm font-medium border-none outline-none flex-1`}
                    />
                    <button
                      onClick={() => removeExpense(expense.id)}
                      className="text-red-400 hover:text-red-300 text-[10px] sm:text-xs ml-2"
                    >
                      Remove
                    </button>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="relative flex-1">
                      <DollarSign className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-slate-400" />
                      <input
                        type="number"
                        value={expense.amount}
                        onChange={(e) => updateExpense(expense.id, 'amount', Number(e.target.value))}
                        className={`w-full pl-6 pr-2 py-1.5 sm:py-1 bg-slate-700 border border-slate-600 rounded ${theme.textColors.primary} text-xs sm:text-sm`}
                      />
                    </div>
                    <label className="flex items-center text-[10px] sm:text-xs">
                      <input
                        type="checkbox"
                        checked={expense.essential}
                        onChange={(e) => updateExpense(expense.id, 'essential', e.target.checked)}
                        className="mr-1"
                      />
                      <span className={`${theme.textColors.secondary}`}>Essential</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2 space-y-6">
          {analysis && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                <div className={`p-3 sm:p-4 bg-blue-900/20 border ${theme.borderColors.primary} rounded-lg`}>
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                    <Calculator className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                    <h4 className={`font-semibold text-sm sm:text-base ${theme.textColors.primary}`}>Monthly Coverage</h4>
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-blue-400">
                    {formatCurrency(analysis.monthlyCoverage)}
                  </div>
                </div>

                <div className={`p-3 sm:p-4 bg-red-900/20 border ${theme.borderColors.primary} rounded-lg`}>
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                    <TrendingDown className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                    <h4 className={`font-semibold text-sm sm:text-base ${theme.textColors.primary}`}>Coverage Gap</h4>
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-red-400">
                    {formatCurrency(analysis.coverageGap)}
                  </div>
                </div>

                <div className={`p-3 sm:p-4 bg-green-900/20 border ${theme.borderColors.primary} rounded-lg sm:col-span-2 md:col-span-1`}>
                  <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                    <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
                    <h4 className={`font-semibold text-sm sm:text-base ${theme.textColors.primary}`}>Est. Premium</h4>
                  </div>
                  <div className="text-lg sm:text-xl font-bold text-green-400">
                    {formatCurrency(analysis.estimatedPremium)}
                  </div>
                  <div className={`text-[10px] sm:text-xs ${theme.textColors.secondary}`}>per year</div>
                </div>
              </div>

              {/* Risk Assessment */}
              <div className={`p-4 border ${theme.borderColors.primary} rounded-lg ${
                analysis.riskLevel === 'High' ? 'bg-red-900/20' :
                analysis.riskLevel === 'Medium' ? 'bg-yellow-900/20' : 'bg-green-900/20'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className={`w-5 h-5 ${
                    analysis.riskLevel === 'High' ? 'text-red-400' :
                    analysis.riskLevel === 'Medium' ? 'text-yellow-400' : 'text-green-400'
                  }`} />
                  <h4 className={`font-semibold ${theme.textColors.primary}`}>Risk Assessment</h4>
                </div>
                <div className={`text-sm ${theme.textColors.secondary} space-y-1`}>
                  <div>
                    <span className="font-medium">Occupation Risk: </span>
                    <span className={
                      analysis.riskLevel === 'High' ? 'text-red-400' :
                      analysis.riskLevel === 'Medium' ? 'text-yellow-400' : 'text-green-400'
                    }>{analysis.riskLevel}</span>
                  </div>
                  <div>
                    <span className="font-medium">Age-Based Risk: </span>
                    <span>{getDisabilityRiskByAge(currentAge)}</span>
                  </div>
                  <div>
                    <span className="font-medium">Emergency Fund Coverage: </span>
                    <span>{Math.round(emergencyFund / (monthlyExpenses.reduce((sum, e) => sum + e.amount, 0)))} months</span>
                  </div>
                </div>
              </div>

              {/* Expense Breakdown */}
              <div className={`border ${theme.borderColors.primary} rounded-lg overflow-hidden`}>
                <div className={`bg-slate-800 px-4 py-3 border-b ${theme.borderColors.primary}`}>
                  <h3 className={`font-semibold ${theme.textColors.primary}`}>
                    Monthly Expense Analysis
                  </h3>
                </div>
                
                <div className="p-3 sm:p-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <h4 className={`font-semibold text-sm sm:text-base ${theme.textColors.primary} mb-2 sm:mb-3`}>Essential Expenses</h4>
                      <div className="space-y-1">
                        {monthlyExpenses
                          .filter(expense => expense.essential)
                          .map(expense => (
                            <div key={expense.id} className="flex justify-between text-xs sm:text-sm">
                              <span className={`${theme.textColors.secondary} truncate mr-2`}>{expense.name}</span>
                              <span className={`${theme.textColors.primary} flex-shrink-0`}>
                                {formatCurrency(expense.amount)}
                              </span>
                            </div>
                          ))}
                        <div className={`border-t ${theme.borderColors.primary} pt-1 mt-2`}>
                          <div className="flex justify-between font-semibold text-xs sm:text-sm">
                            <span className={`${theme.textColors.primary}`}>Total Essential</span>
                            <span className={`${theme.textColors.primary}`}>
                              {formatCurrency(
                                monthlyExpenses
                                  .filter(expense => expense.essential)
                                  .reduce((sum, expense) => sum + expense.amount, 0)
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className={`font-semibold text-sm sm:text-base ${theme.textColors.primary} mb-2 sm:mb-3`}>Non-Essential Expenses</h4>
                      <div className="space-y-1">
                        {monthlyExpenses
                          .filter(expense => !expense.essential)
                          .map(expense => (
                            <div key={expense.id} className="flex justify-between text-xs sm:text-sm">
                              <span className={`${theme.textColors.secondary} truncate mr-2`}>{expense.name}</span>
                              <span className={`${theme.textColors.primary} flex-shrink-0`}>
                                {formatCurrency(expense.amount)}
                              </span>
                            </div>
                          ))}
                        <div className={`border-t ${theme.borderColors.primary} pt-1 mt-2`}>
                          <div className="flex justify-between font-semibold text-xs sm:text-sm">
                            <span className={`${theme.textColors.primary}`}>Total Non-Essential</span>
                            <span className={`${theme.textColors.primary}`}>
                              {formatCurrency(
                                monthlyExpenses
                                  .filter(expense => !expense.essential)
                                  .reduce((sum, expense) => sum + expense.amount, 0)
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Security & Other Benefits */}
              <div className={`p-4 bg-blue-900/20 border ${theme.borderColors.primary} rounded-lg`}>
                <h4 className={`font-semibold ${theme.textColors.primary} mb-3`}>Other Disability Benefits</h4>
                <div className={`text-sm ${theme.textColors.secondary} space-y-2`}>
                  {hasSocialSecurity && (
                    <div>
                      <span className="font-medium">Estimated Social Security Disability: </span>
                      <span>{formatCurrency(getSocialSecurityEstimate(grossIncome))}/month</span>
                      <div className="text-xs mt-1">
                        Note: SSDI has a 5-month waiting period and strict disability requirements
                      </div>
                    </div>
                  )}
                  {hasWorkersComp && (
                    <div>
                      <span className="font-medium">Workers&apos; Compensation: </span>
                      <span>Available for work-related injuries only</span>
                    </div>
                  )}
                  <div>
                    <span className="font-medium">Short-term Disability: </span>
                    <span>Check if available through employer (typically 3-6 months)</span>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className={`p-4 bg-green-900/20 border ${theme.borderColors.primary} rounded-lg`}>
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-green-400 mt-0.5" />
                  <div>
                    <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>
                      Disability Insurance Recommendations
                    </h4>
                    <ul className={`space-y-1 text-sm ${theme.textColors.secondary}`}>
                      <li>• Recommended monthly benefit: {formatCurrency(analysis.monthlyCoverage)}</li>
                      <li>• Consider &quot;own occupation&quot; coverage if available for your profession</li>
                      <li>• Include cost of living adjustment (COLA) rider for inflation protection</li>
                      <li>• Longer waiting periods reduce premiums but require larger emergency fund</li>
                      <li>• Group policies through employers are often cheaper but less comprehensive</li>
                      <li>• Individual policies are portable if you change jobs</li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
