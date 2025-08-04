'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import {
  Home,
  DollarSign,
  Calculator,
  TrendingUp,
  RefreshCw,
  Hammer,
  Target,
  PiggyBank,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react';

interface BRRRRAnalysis {
  totalCashInvested: number;
  afterRefinanceValue: number;
  refinanceLoanAmount: number;
  cashRecovered: number;
  cashLeftInDeal: number;
  monthlyRentalIncome: number;
  monthlyNetCashFlow: number;
  annualNetCashFlow: number;
  cashOnCashReturn: number;
  totalROI: number;
  cycleEfficiency: number;
  recommendedNextSteps: string[];
  riskFactors: string[];
  phases: {
    buy: { cost: number; description: string; complete: boolean };
    rehab: { cost: number; description: string; complete: boolean };
    rent: { income: number; description: string; complete: boolean };
    refinance: { proceeds: number; description: string; complete: boolean };
    repeat: { available: number; description: string; complete: boolean };
  };
}

export default function BRRRRStrategyCalculator() {
  const { recordCalculatorUsage } = useProgressStore();

  // Buy Phase
  const [purchasePrice, setPurchasePrice] = useState<number>(180000);
  const [downPayment, setDownPayment] = useState<number>(36000);
  const [closingCosts, setClosingCosts] = useState<number>(5400);
  const [inspectionCosts, setInspectionCosts] = useState<number>(500);

  // Rehab Phase
  const [rehabBudget, setRehabBudget] = useState<number>(25000);
  const [rehabContingency, setRehabContingency] = useState<number>(10);
  const [carryingCosts, setCarryingCosts] = useState<number>(3000);
  const [permitsCosts, setPermitsCosts] = useState<number>(1000);

  // Rent Phase
  const [monthlyRent, setMonthlyRent] = useState<number>(2200);
  const [securityDeposit, setSecurityDeposit] = useState<number>(2200);
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(550);
  const [vacancyRate, setVacancyRate] = useState<number>(5);

  // Refinance Phase
  const [afterRepairValue, setAfterRepairValue] = useState<number>(260000);
  const [refinanceLTV, setRefinanceLTV] = useState<number>(75);
  const [refinanceRate, setRefinanceRate] = useState<number>(7.5);
  const [refinanceTerm, setRefinanceTerm] = useState<number>(30);
  const [refinanceClosingCosts, setRefinanceClosingCosts] = useState<number>(3000);

  // Market Assumptions
  const [rentGrowthRate, setRentGrowthRate] = useState<number>(3);
  const [appreciationRate, setAppreciationRate] = useState<number>(4);

  const [analysis, setAnalysis] = useState<BRRRRAnalysis | null>(null);
  const [activePhase, setActivePhase] = useState<'buy' | 'rehab' | 'rent' | 'refinance' | 'repeat'>('buy');

  useEffect(() => {
    recordCalculatorUsage('brrrr-strategy-calculator');
  }, [recordCalculatorUsage]);

  const calculateMortgagePayment = useMemo(() => {
    const principal = (afterRepairValue * refinanceLTV) / 100;
    const monthlyRate = refinanceRate / 100 / 12;
    const numPayments = refinanceTerm * 12;
    
    if (monthlyRate === 0) return principal / numPayments;
    
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
           (Math.pow(1 + monthlyRate, numPayments) - 1);
  }, [afterRepairValue, refinanceLTV, refinanceRate, refinanceTerm]);

  const analyzeBRRRR = useCallback(() => {
    // Rehab Phase Costs
    const totalRehabCosts = rehabBudget * (1 + rehabContingency / 100) + carryingCosts + permitsCosts;
    
    // Total Initial Investment
    const totalCashInvested = purchasePrice + closingCosts + inspectionCosts + totalRehabCosts;
    
    // Refinance Analysis
    const refinanceLoanAmount = (afterRepairValue * refinanceLTV) / 100;
    const originalLoanPayoff = purchasePrice - downPayment; // Assuming original financing
    const cashRecovered = refinanceLoanAmount - originalLoanPayoff - refinanceClosingCosts;
    const cashLeftInDeal = totalCashInvested - cashRecovered;
    
    // Rental Analysis
    const effectiveMonthlyRent = monthlyRent * (1 - vacancyRate / 100);
    const monthlyMortgagePayment = calculateMortgagePayment;
    const monthlyNetCashFlow = effectiveMonthlyRent - monthlyExpenses - monthlyMortgagePayment;
    const annualNetCashFlow = monthlyNetCashFlow * 12;
    
    // ROI Calculations
    const cashOnCashReturn = cashLeftInDeal > 0 ? (annualNetCashFlow / cashLeftInDeal) * 100 : 0;
    const forcedAppreciation = afterRepairValue - purchasePrice - totalRehabCosts;
    const totalROI = cashLeftInDeal > 0 ? ((annualNetCashFlow + forcedAppreciation) / totalCashInvested) * 100 : 0;
    
    // Cycle Efficiency (how much of original investment recovered)
    const cycleEfficiency = totalCashInvested > 0 ? (cashRecovered / totalCashInvested) * 100 : 0;
    
    // Phase Analysis
    const phases = {
      buy: {
        cost: purchasePrice + downPayment + closingCosts + inspectionCosts,
        description: `Acquired property for ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(purchasePrice)}`,
        complete: true
      },
      rehab: {
        cost: totalRehabCosts,
        description: `Renovated with ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(rehabBudget)} budget`,
        complete: true
      },
      rent: {
        income: effectiveMonthlyRent * 12,
        description: `Rented for ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(monthlyRent)}/month`,
        complete: monthlyRent > 0
      },
      refinance: {
        proceeds: cashRecovered,
        description: `Refinanced at ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(afterRepairValue)} ARV`,
        complete: refinanceLoanAmount > originalLoanPayoff
      },
      repeat: {
        available: Math.max(0, cashRecovered),
        description: `${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(Math.max(0, cashRecovered))} available for next deal`,
        complete: cashRecovered > 0
      }
    };

    // Recommendations
    const recommendedNextSteps: string[] = [];
    const riskFactors: string[] = [];

    if (cycleEfficiency >= 90) {
      recommendedNextSteps.push('Excellent BRRRR execution - scale with additional properties');
    } else if (cycleEfficiency >= 70) {
      recommendedNextSteps.push('Good BRRRR performance - optimize for better capital recovery');
    } else {
      recommendedNextSteps.push('Low capital recovery - review rehab budget and ARV estimates');
    }

    if (cashOnCashReturn >= 15) {
      recommendedNextSteps.push('Strong cash flow - consider accelerating acquisition pace');
    } else if (cashOnCashReturn >= 8) {
      recommendedNextSteps.push('Adequate cash flow - monitor market rent trends');
    } else {
      recommendedNextSteps.push('Improve cash flow through rent increases or expense reduction');
    }

    if (forcedAppreciation >= 30000) {
      recommendedNextSteps.push('Significant value creation - excellent renovation execution');
    }

    // Risk Factors
    if (rehabBudget > purchasePrice * 0.3) {
      riskFactors.push('High rehab-to-purchase ratio increases project risk');
    }

    if (refinanceLTV > 80) {
      riskFactors.push('High LTV may limit refinancing options');
    }

    if (vacancyRate > 10) {
      riskFactors.push('High vacancy assumption impacts cash flow projections');
    }

    if (cashLeftInDeal > totalCashInvested * 0.5) {
      riskFactors.push('Significant capital remains tied up in property');
    }

    if (monthlyNetCashFlow < 200) {
      riskFactors.push('Low monthly cash flow leaves little buffer for unexpected expenses');
    }

    if (afterRepairValue < purchasePrice + totalRehabCosts + 20000) {
      riskFactors.push('Minimal forced appreciation may not justify renovation costs');
    }

    const analysisResult: BRRRRAnalysis = {
      totalCashInvested,
      afterRefinanceValue: afterRepairValue,
      refinanceLoanAmount,
      cashRecovered,
      cashLeftInDeal,
      monthlyRentalIncome: effectiveMonthlyRent,
      monthlyNetCashFlow,
      annualNetCashFlow,
      cashOnCashReturn,
      totalROI,
      cycleEfficiency,
      recommendedNextSteps,
      riskFactors,
      phases
    };

    setAnalysis(analysisResult);
  }, [
    purchasePrice, downPayment, closingCosts, inspectionCosts, rehabBudget,
    rehabContingency, carryingCosts, permitsCosts, monthlyRent,
    monthlyExpenses, vacancyRate, afterRepairValue, refinanceLTV,
    refinanceClosingCosts, calculateMortgagePayment
  ]);

  useEffect(() => {
    analyzeBRRRR();
  }, [analyzeBRRRR]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (percent: number): string => {
    return `${percent.toFixed(2)}%`;
  };

  const getPhaseColor = (phase: keyof BRRRRAnalysis['phases']) => {
    if (!analysis) return 'text-slate-400';
    return analysis.phases[phase].complete ? 'text-green-400' : 'text-yellow-400';
  };

  const getPhaseIcon = (phase: keyof BRRRRAnalysis['phases']) => {
    if (!analysis) return <AlertCircle className="w-4 h-4" />;
    return analysis.phases[phase].complete ? 
      <CheckCircle className="w-4 h-4" /> : 
      <AlertCircle className="w-4 h-4" />;
  };

  return (
    <div className={`p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
      <div className="flex items-center gap-3 mb-6">
        <RefreshCw className="w-6 h-6 text-blue-400" />
        <h2 className={`text-xl font-bold ${theme.textColors.primary}`}>
          BRRRR Strategy Calculator
        </h2>
        <div className={`text-sm ${theme.textColors.secondary} bg-slate-700 px-2 py-1 rounded`}>
          Buy • Rehab • Rent • Refinance • Repeat
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Phase Navigation */}
          <div className="flex flex-wrap gap-2 mb-4">
            {['buy', 'rehab', 'rent', 'refinance', 'repeat'].map((phase) => (
              <button
                key={phase}
                onClick={() => setActivePhase(phase as 'buy' | 'rehab' | 'rent' | 'refinance' | 'repeat')}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                  activePhase === phase
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {phase.charAt(0).toUpperCase() + phase.slice(1)}
              </button>
            ))}
          </div>

          {/* Buy Phase */}
          {activePhase === 'buy' && (
            <div>
              <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                <Home className="w-5 h-5 text-blue-400" />
                Buy Phase
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                    Purchase Price
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      value={purchasePrice}
                      onChange={(e) => setPurchasePrice(Number(e.target.value))}
                      className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                    Down Payment
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      value={downPayment}
                      onChange={(e) => setDownPayment(Number(e.target.value))}
                      className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                    Closing Costs
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      value={closingCosts}
                      onChange={(e) => setClosingCosts(Number(e.target.value))}
                      className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                    Inspection & Due Diligence
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      value={inspectionCosts}
                      onChange={(e) => setInspectionCosts(Number(e.target.value))}
                      className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rehab Phase */}
          {activePhase === 'rehab' && (
            <div>
              <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                <Hammer className="w-5 h-5 text-orange-400" />
                Rehab Phase
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                    Rehab Budget
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      value={rehabBudget}
                      onChange={(e) => setRehabBudget(Number(e.target.value))}
                      className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                    Contingency Reserve %
                  </label>
                  <div className="relative">
                    <Calculator className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      value={rehabContingency}
                      onChange={(e) => setRehabContingency(Number(e.target.value))}
                      className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                      min="0"
                      max="50"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                    Carrying Costs (utilities, insurance, etc.)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      value={carryingCosts}
                      onChange={(e) => setCarryingCosts(Number(e.target.value))}
                      className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                    Permits & Professional Fees
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      value={permitsCosts}
                      onChange={(e) => setPermitsCosts(Number(e.target.value))}
                      className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Rent Phase */}
          {activePhase === 'rent' && (
            <div>
              <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                <PiggyBank className="w-5 h-5 text-green-400" />
                Rent Phase
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                    Monthly Rent
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      value={monthlyRent}
                      onChange={(e) => setMonthlyRent(Number(e.target.value))}
                      className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                    Security Deposit
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      value={securityDeposit}
                      onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                      className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                    Monthly Operating Expenses
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      value={monthlyExpenses}
                      onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                      className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                    Vacancy Rate %
                  </label>
                  <div className="relative">
                    <Calculator className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      value={vacancyRate}
                      onChange={(e) => setVacancyRate(Number(e.target.value))}
                      className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                      min="0"
                      max="50"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Refinance Phase */}
          {activePhase === 'refinance' && (
            <div>
              <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                <BarChart3 className="w-5 h-5 text-purple-400" />
                Refinance Phase
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                    After Repair Value (ARV)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      value={afterRepairValue}
                      onChange={(e) => setAfterRepairValue(Number(e.target.value))}
                      className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                    Refinance LTV %
                  </label>
                  <div className="relative">
                    <Calculator className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      value={refinanceLTV}
                      onChange={(e) => setRefinanceLTV(Number(e.target.value))}
                      className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                      min="0"
                      max="100"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                    Refinance Interest Rate %
                  </label>
                  <div className="relative">
                    <Calculator className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      step="0.1"
                      value={refinanceRate}
                      onChange={(e) => setRefinanceRate(Number(e.target.value))}
                      className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                    Refinance Term (years)
                  </label>
                  <div className="relative">
                    <Calculator className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                      value={refinanceTerm}
                      onChange={(e) => setRefinanceTerm(Number(e.target.value))}
                      className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    >
                      <option value={15}>15 years</option>
                      <option value={20}>20 years</option>
                      <option value={25}>25 years</option>
                      <option value={30}>30 years</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                    Refinance Closing Costs
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      value={refinanceClosingCosts}
                      onChange={(e) => setRefinanceClosingCosts(Number(e.target.value))}
                      className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Market Assumptions */}
          {activePhase === 'repeat' && (
            <div>
              <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                <Target className="w-5 h-5 text-cyan-400" />
                Future Projections
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                    Annual Rent Growth %
                  </label>
                  <div className="relative">
                    <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      step="0.1"
                      value={rentGrowthRate}
                      onChange={(e) => setRentGrowthRate(Number(e.target.value))}
                      className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                    Annual Appreciation %
                  </label>
                  <div className="relative">
                    <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      step="0.1"
                      value={appreciationRate}
                      onChange={(e) => setAppreciationRate(Number(e.target.value))}
                      className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2 space-y-6">
          {analysis && (
            <>
              {/* BRRRR Overview */}
              <div className={`p-4 border ${theme.borderColors.primary} rounded-lg bg-slate-800/50`}>
                <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
                  BRRRR Strategy Overview
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                  {Object.entries(analysis.phases).map(([phase, data]) => (
                    <div key={phase} className={`text-center p-3 border ${theme.borderColors.primary} rounded-lg`}>
                      <div className={`flex items-center justify-center gap-2 mb-2 ${getPhaseColor(phase as keyof BRRRRAnalysis['phases'])}`}>
                        {getPhaseIcon(phase as keyof BRRRRAnalysis['phases'])}
                        <h4 className="font-semibold text-sm capitalize">
                          {phase}
                        </h4>
                      </div>
                      <div className={`text-xs ${theme.textColors.secondary} mb-1`}>
                        {data.description}
                      </div>
                      <div className={`text-sm font-medium ${theme.textColors.primary}`}>
                        {formatCurrency(
                          'income' in data ? data.income :
                          'cost' in data ? data.cost :
                          'proceeds' in data ? data.proceeds :
                          'available' in data ? data.available : 0
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 ${
                  analysis.cycleEfficiency >= 80 ? 'bg-green-900/20' : 
                  analysis.cycleEfficiency >= 60 ? 'bg-yellow-900/20' : 'bg-red-900/20'
                } border ${theme.borderColors.primary} rounded-lg`}>
                  <div className="flex items-center gap-2 mb-2">
                    <RefreshCw className={`w-5 h-5 ${
                      analysis.cycleEfficiency >= 80 ? 'text-green-400' : 
                      analysis.cycleEfficiency >= 60 ? 'text-yellow-400' : 'text-red-400'
                    }`} />
                    <h4 className={`font-semibold ${theme.textColors.primary}`}>Cycle Efficiency</h4>
                  </div>
                  <div className={`text-xl font-bold ${
                    analysis.cycleEfficiency >= 80 ? 'text-green-400' : 
                    analysis.cycleEfficiency >= 60 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {formatPercent(analysis.cycleEfficiency)}
                  </div>
                  <div className={`text-xs ${theme.textColors.secondary}`}>
                    Capital Recovery Rate
                  </div>
                </div>

                <div className={`p-4 ${
                  analysis.cashOnCashReturn >= 12 ? 'bg-green-900/20' : 
                  analysis.cashOnCashReturn >= 8 ? 'bg-yellow-900/20' : 'bg-red-900/20'
                } border ${theme.borderColors.primary} rounded-lg`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Target className={`w-5 h-5 ${
                      analysis.cashOnCashReturn >= 12 ? 'text-green-400' : 
                      analysis.cashOnCashReturn >= 8 ? 'text-yellow-400' : 'text-red-400'
                    }`} />
                    <h4 className={`font-semibold ${theme.textColors.primary}`}>Cash-on-Cash Return</h4>
                  </div>
                  <div className={`text-xl font-bold ${
                    analysis.cashOnCashReturn >= 12 ? 'text-green-400' : 
                    analysis.cashOnCashReturn >= 8 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {formatPercent(analysis.cashOnCashReturn)}
                  </div>
                  <div className={`text-xs ${theme.textColors.secondary}`}>
                    Annual Return on Cash
                  </div>
                </div>

                <div className={`p-4 ${
                  analysis.monthlyNetCashFlow >= 200 ? 'bg-green-900/20' : 
                  analysis.monthlyNetCashFlow >= 0 ? 'bg-yellow-900/20' : 'bg-red-900/20'
                } border ${theme.borderColors.primary} rounded-lg`}>
                  <div className="flex items-center gap-2 mb-2">
                    <PiggyBank className={`w-5 h-5 ${
                      analysis.monthlyNetCashFlow >= 200 ? 'text-green-400' : 
                      analysis.monthlyNetCashFlow >= 0 ? 'text-yellow-400' : 'text-red-400'
                    }`} />
                    <h4 className={`font-semibold ${theme.textColors.primary}`}>Monthly Cash Flow</h4>
                  </div>
                  <div className={`text-xl font-bold ${
                    analysis.monthlyNetCashFlow >= 200 ? 'text-green-400' : 
                    analysis.monthlyNetCashFlow >= 0 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {formatCurrency(analysis.monthlyNetCashFlow)}
                  </div>
                  <div className={`text-xs ${theme.textColors.secondary}`}>
                    Net Operating Income
                  </div>
                </div>
              </div>

              {/* Financial Summary */}
              <div className={`p-4 border ${theme.borderColors.primary} rounded-lg bg-slate-800/50`}>
                <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
                  Financial Summary
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className={`${theme.textColors.secondary}`}>Total Cash Invested:</span>
                    <div className={`font-semibold ${theme.textColors.primary}`}>
                      {formatCurrency(analysis.totalCashInvested)}
                    </div>
                  </div>
                  <div>
                    <span className={`${theme.textColors.secondary}`}>Cash Recovered:</span>
                    <div className={`font-semibold ${
                      analysis.cashRecovered >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {formatCurrency(analysis.cashRecovered)}
                    </div>
                  </div>
                  <div>
                    <span className={`${theme.textColors.secondary}`}>Cash Left in Deal:</span>
                    <div className={`font-semibold ${theme.textColors.primary}`}>
                      {formatCurrency(analysis.cashLeftInDeal)}
                    </div>
                  </div>
                  <div>
                    <span className={`${theme.textColors.secondary}`}>Total ROI:</span>
                    <div className={`font-semibold ${
                      analysis.totalROI >= 15 ? 'text-green-400' : 
                      analysis.totalROI >= 8 ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {formatPercent(analysis.totalROI)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className={`p-4 bg-blue-900/20 border ${theme.borderColors.primary} rounded-lg`}>
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>
                      Strategy Recommendations
                    </h4>
                    <ul className={`space-y-1 text-sm ${theme.textColors.secondary}`}>
                      {analysis.recommendedNextSteps.map((step, index) => (
                        <li key={index}>• {step}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Risk Factors */}
              {analysis.riskFactors.length > 0 && (
                <div className={`p-4 bg-red-900/20 border border-red-500/20 rounded-lg`}>
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
                    <div>
                      <h4 className={`font-semibold text-red-400 mb-2`}>
                        Risk Factors to Consider
                      </h4>
                      <ul className={`space-y-1 text-sm ${theme.textColors.secondary}`}>
                        {analysis.riskFactors.map((risk, index) => (
                          <li key={index}>• {risk}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* BRRRR Education */}
              <div className={`p-4 bg-yellow-900/20 border border-yellow-500/20 rounded-lg`}>
                <h4 className={`font-semibold text-yellow-400 mb-2`}>
                  BRRRR Strategy Explained
                </h4>
                <ul className={`space-y-1 text-sm ${theme.textColors.secondary}`}>
                  <li>• <strong>Buy:</strong> Purchase undervalued properties with potential for improvement</li>
                  <li>• <strong>Rehab:</strong> Renovate to increase property value and rental income potential</li>
                  <li>• <strong>Rent:</strong> Secure reliable tenants to generate positive cash flow</li>
                  <li>• <strong>Refinance:</strong> Pull out most/all original capital based on new higher value</li>
                  <li>• <strong>Repeat:</strong> Use recovered capital to acquire additional properties</li>
                  <li>• <strong>Goal:</strong> Build portfolio with minimal capital while retaining cash-flowing assets</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
