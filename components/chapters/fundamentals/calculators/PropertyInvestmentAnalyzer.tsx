'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import {
  Home,
  DollarSign,
  TrendingUp,
  Percent,
  Calendar,
  Info,
  BarChart3,
  PiggyBank,
  Target
} from 'lucide-react';

interface PropertyAnalysis {
  monthlyNetCashFlow: number;
  annualNetCashFlow: number;
  cashOnCashReturn: number;
  capRate: number;
  totalCashNeeded: number;
  monthlyMortgagePayment: number;
  netOperatingIncome: number;
  onePercentRule: boolean;
  twoPercentRule: boolean;
  fiftyPercentRule: boolean;
  debtServiceCoverageRatio: number;
  breakEvenRatio: number;
  yearlyAnalysis: {
    year: number;
    grossRent: number;
    netCashFlow: number;
    cumulativeCashFlow: number;
    propertyValue: number;
    equity: number;
    totalReturn: number;
  }[];
  investmentGrade: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  recommendations: string[];
}

export default function PropertyInvestmentAnalyzer() {
  const { recordCalculatorUsage } = useProgressStore();

  // Property Details
  const [purchasePrice, setPurchasePrice] = useState<number>(300000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(7.0);
  const [loanTerm, setLoanTerm] = useState<number>(30);
  const [closingCosts, setClosingCosts] = useState<number>(8000);
  const [rehabCosts, setRehabCosts] = useState<number>(0);
  
  // Income
  const [monthlyRent, setMonthlyRent] = useState<number>(2500);
  const [vacancyRate, setVacancyRate] = useState<number>(5);
  const [otherIncome, setOtherIncome] = useState<number>(0);
  
  // Operating Expenses
  const [propertyTaxes, setPropertyTaxes] = useState<number>(3600);
  const [insurance, setInsurance] = useState<number>(1200);
  const [maintenance, setMaintenance] = useState<number>(1800);
  const [propertyManagement, setPropertyManagement] = useState<number>(0);
  const [utilities, setUtilities] = useState<number>(0);
  const [hoaFees, setHoaFees] = useState<number>(0);
  const [otherExpenses, setOtherExpenses] = useState<number>(600);
  
  // Market Assumptions
  const [rentGrowthRate, setRentGrowthRate] = useState<number>(3.0);
  const [propertyAppreciationRate, setPropertyAppreciationRate] = useState<number>(3.5);
  const [expenseGrowthRate, setExpenseGrowthRate] = useState<number>(2.5);
  
  const [analysis, setAnalysis] = useState<PropertyAnalysis | null>(null);

  useEffect(() => {
    recordCalculatorUsage('property-investment-analyzer');
  }, [recordCalculatorUsage]);

  const calculateMortgagePayment = useMemo(() => {
    const principal = purchasePrice * (1 - downPaymentPercent / 100);
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm * 12;
    
    if (monthlyRate === 0) return principal / numPayments;
    
    return principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
           (Math.pow(1 + monthlyRate, numPayments) - 1);
  }, [purchasePrice, downPaymentPercent, interestRate, loanTerm]);

  const analyzeProperty = useCallback(() => {
    // Basic Financial Calculations
    const downPayment = purchasePrice * (downPaymentPercent / 100);
    const totalCashNeeded = downPayment + closingCosts + rehabCosts;
    const loanAmount = purchasePrice - downPayment;
    const monthlyMortgagePayment = calculateMortgagePayment;
    
    // Monthly Income & Expenses
    const effectiveMonthlyRent = monthlyRent * (1 - vacancyRate / 100);
    const totalMonthlyIncome = effectiveMonthlyRent + otherIncome / 12;
    
    const monthlyExpenses = (propertyTaxes + insurance + maintenance + 
                           propertyManagement + utilities + hoaFees + otherExpenses) / 12;
    
    const netOperatingIncome = (totalMonthlyIncome * 12) - (monthlyExpenses * 12);
    const monthlyNetCashFlow = totalMonthlyIncome - monthlyExpenses - monthlyMortgagePayment;
    const annualNetCashFlow = monthlyNetCashFlow * 12;
    
    // Key Investment Metrics
    const cashOnCashReturn = totalCashNeeded > 0 ? (annualNetCashFlow / totalCashNeeded) * 100 : 0;
    const capRate = (netOperatingIncome / purchasePrice) * 100;
    const debtServiceCoverageRatio = netOperatingIncome / (monthlyMortgagePayment * 12);
    const breakEvenRatio = (monthlyExpenses + monthlyMortgagePayment) / (monthlyRent * (1 - vacancyRate / 100));
    
    // Investment Rules Analysis
    const onePercentRule = monthlyRent >= purchasePrice * 0.01;
    const twoPercentRule = monthlyRent >= purchasePrice * 0.02;
    const fiftyPercentRule = monthlyExpenses <= totalMonthlyIncome * 0.5;
    
    // 10-Year Projection
    const yearlyAnalysis = [];
    let currentRent = monthlyRent * 12;
    let currentExpenses = monthlyExpenses * 12;
    let currentPropertyValue = purchasePrice;
    let cumulativeCashFlow = 0;
    
    for (let year = 1; year <= 10; year++) {
      currentRent *= (1 + rentGrowthRate / 100);
      currentExpenses *= (1 + expenseGrowthRate / 100);
      currentPropertyValue *= (1 + propertyAppreciationRate / 100);
      
      const yearNetCashFlow = (currentRent * (1 - vacancyRate / 100)) - currentExpenses - (monthlyMortgagePayment * 12);
      cumulativeCashFlow += yearNetCashFlow;
      
      // Calculate remaining loan balance (simplified)
      const remainingBalance = loanAmount * Math.pow(1 + interestRate / 100 / 12, loanTerm * 12 - year * 12) - 
                              monthlyMortgagePayment * ((Math.pow(1 + interestRate / 100 / 12, year * 12) - 1) / (interestRate / 100 / 12));
      const equity = currentPropertyValue - Math.max(0, remainingBalance);
      const totalReturn = cumulativeCashFlow + equity - totalCashNeeded;
      
      yearlyAnalysis.push({
        year,
        grossRent: currentRent,
        netCashFlow: yearNetCashFlow,
        cumulativeCashFlow,
        propertyValue: currentPropertyValue,
        equity,
        totalReturn
      });
    }
    
    // Investment Grade Assessment
    let investmentGrade: 'Excellent' | 'Good' | 'Fair' | 'Poor' = 'Poor';
    let score = 0;
    
    if (cashOnCashReturn >= 12) score += 3;
    else if (cashOnCashReturn >= 8) score += 2;
    else if (cashOnCashReturn >= 5) score += 1;
    
    if (capRate >= 8) score += 3;
    else if (capRate >= 6) score += 2;
    else if (capRate >= 4) score += 1;
    
    if (monthlyNetCashFlow >= 200) score += 2;
    else if (monthlyNetCashFlow >= 0) score += 1;
    
    if (onePercentRule) score += 1;
    if (fiftyPercentRule) score += 1;
    if (debtServiceCoverageRatio >= 1.25) score += 1;
    
    if (score >= 9) investmentGrade = 'Excellent';
    else if (score >= 6) investmentGrade = 'Good';
    else if (score >= 3) investmentGrade = 'Fair';
    
    // Generate Recommendations
    const recommendations: string[] = [];
    
    if (cashOnCashReturn < 8) {
      recommendations.push('Consider increasing down payment or finding higher rent to improve cash-on-cash return');
    }
    
    if (capRate < 6) {
      recommendations.push('Cap rate is below market average - negotiate purchase price or find higher-yield properties');
    }
    
    if (monthlyNetCashFlow < 0) {
      recommendations.push('Negative cash flow detected - reduce expenses, increase rent, or reconsider investment');
    }
    
    if (!onePercentRule) {
      recommendations.push('Property does not meet 1% rule - rent may be too low relative to purchase price');
    }
    
    if (!fiftyPercentRule) {
      recommendations.push('Expenses exceed 50% of income - look for ways to reduce operating costs');
    }
    
    if (debtServiceCoverageRatio < 1.25) {
      recommendations.push('Low debt service coverage ratio - consider larger down payment or negotiate better terms');
    }
    
    if (vacancyRate > 8) {
      recommendations.push('High vacancy rate assumption - research local market conditions');
    }
    
    if (propertyTaxes > totalMonthlyIncome * 12 * 0.15) {
      recommendations.push('High property taxes - verify assessment and consider tax appeals');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Strong investment opportunity with solid fundamentals');
      recommendations.push('Consider leveraging equity for additional properties');
    }

    const analysisResult: PropertyAnalysis = {
      monthlyNetCashFlow,
      annualNetCashFlow,
      cashOnCashReturn,
      capRate,
      totalCashNeeded,
      monthlyMortgagePayment,
      netOperatingIncome,
      onePercentRule,
      twoPercentRule,
      fiftyPercentRule,
      debtServiceCoverageRatio,
      breakEvenRatio,
      yearlyAnalysis,
      investmentGrade,
      recommendations
    };

    setAnalysis(analysisResult);
  }, [
    purchasePrice, downPaymentPercent, interestRate, loanTerm, closingCosts, rehabCosts,
    monthlyRent, vacancyRate, otherIncome, propertyTaxes, insurance, maintenance,
    propertyManagement, utilities, hoaFees, otherExpenses, rentGrowthRate,
    propertyAppreciationRate, expenseGrowthRate, calculateMortgagePayment
  ]);

  useEffect(() => {
    analyzeProperty();
  }, [analyzeProperty]);

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

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'Excellent': return 'text-green-400';
      case 'Good': return 'text-blue-400';
      case 'Fair': return 'text-yellow-400';
      case 'Poor': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div role="main" className={`p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg grid`}>
      <div className="flex items-center gap-3 mb-6">
        <Home className="w-6 h-6 text-emerald-400" />
        <h2 className={`text-xl font-bold ${theme.textColors.primary}`}>
          Property Investment Analyzer
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Property Details
            </h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="purchase-price" className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Purchase Price
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="purchase-price"
                    type="number"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(Number(e.target.value))}
                    className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    placeholder="300000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="down-payment-percent" className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                    Down Payment %
                  </label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="down-payment-percent"
                      type="number"
                      value={downPaymentPercent}
                      onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                      className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                      min="0"
                      max="100"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="interest-rate" className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                    Interest Rate %
                  </label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="interest-rate"
                      type="number"
                      step="0.1"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="loan-term" className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                    Loan Term (years)
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                      id="loan-term"
                      value={loanTerm}
                      onChange={(e) => setLoanTerm(Number(e.target.value))}
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
                  <label htmlFor="closing-costs" className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                    Closing Costs
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="closing-costs"
                      type="number"
                      value={closingCosts}
                      onChange={(e) => setClosingCosts(Number(e.target.value))}
                      className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="rehab-costs" className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Rehab/Renovation Costs
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="rehab-costs"
                    type="number"
                    value={rehabCosts}
                    onChange={(e) => setRehabCosts(Number(e.target.value))}
                    className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Income
            </h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="monthly-rent" className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Monthly Rent
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="monthly-rent"
                    type="number"
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(Number(e.target.value))}
                    className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="vacancy-rate" className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                    Vacancy Rate %
                  </label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="vacancy-rate"
                      type="number"
                      value={vacancyRate}
                      onChange={(e) => setVacancyRate(Number(e.target.value))}
                      className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                      min="0"
                      max="100"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="other-income" className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                    Other Income (Annual)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="other-income"
                      type="number"
                      value={otherIncome}
                      onChange={(e) => setOtherIncome(Number(e.target.value))}
                      className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Operating Expenses (Annual)
            </h3>
            
            <div className="space-y-3">
              {[
                { label: 'Property Taxes', value: propertyTaxes, setter: setPropertyTaxes, id: 'property-taxes' },
                { label: 'Insurance', value: insurance, setter: setInsurance, id: 'insurance' },
                { label: 'Maintenance & Repairs', value: maintenance, setter: setMaintenance, id: 'maintenance' },
                { label: 'Property Management', value: propertyManagement, setter: setPropertyManagement, id: 'property-management' },
                { label: 'Utilities (if paid)', value: utilities, setter: setUtilities, id: 'utilities' },
                { label: 'HOA Fees', value: hoaFees, setter: setHoaFees, id: 'hoa-fees' },
                { label: 'Other Expenses', value: otherExpenses, setter: setOtherExpenses, id: 'other-expenses' }
              ].map((expense, index) => (
                <div key={index}>
                  <label htmlFor={expense.id} className={`block text-sm font-medium ${theme.textColors.primary} mb-1`}>
                    {expense.label}
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id={expense.id}
                      type="number"
                      value={expense.value}
                      onChange={(e) => expense.setter(Number(e.target.value))}
                      className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none text-sm`}
                      placeholder="0"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Market Assumptions
            </h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="rent-growth-rate" className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Rent Growth Rate % (Annual)
                </label>
                <div className="relative">
                  <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="rent-growth-rate"
                    type="number"
                    step="0.1"
                    value={rentGrowthRate}
                    onChange={(e) => setRentGrowthRate(Number(e.target.value))}
                    className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="property-appreciation-rate" className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Property Appreciation % (Annual)
                </label>
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="property-appreciation-rate"
                    type="number"
                    step="0.1"
                    value={propertyAppreciationRate}
                    onChange={(e) => setPropertyAppreciationRate(Number(e.target.value))}
                    className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="expense-growth-rate" className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Expense Growth Rate % (Annual)
                </label>
                <div className="relative">
                  <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="expense-growth-rate"
                    type="number"
                    step="0.1"
                    value={expenseGrowthRate}
                    onChange={(e) => setExpenseGrowthRate(Number(e.target.value))}
                    className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2 space-y-6">
          {analysis && (
            <>
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className={`p-4 ${
                  analysis.monthlyNetCashFlow >= 0 ? 'bg-green-900/20' : 'bg-red-900/20'
                } border ${theme.borderColors.primary} rounded-lg`}>
                  <div className="flex items-center gap-2 mb-2">
                    <PiggyBank className={`w-5 h-5 ${
                      analysis.monthlyNetCashFlow >= 0 ? 'text-green-400' : 'text-red-400'
                    }`} />
                    <h4 className={`font-semibold ${theme.textColors.primary}`}>Monthly Cash Flow</h4>
                  </div>
                  <div className={`text-xl font-bold ${
                    analysis.monthlyNetCashFlow >= 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {formatCurrency(analysis.monthlyNetCashFlow)}
                  </div>
                </div>

                <div className={`p-4 bg-blue-900/20 border ${theme.borderColors.primary} rounded-lg`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-blue-400" />
                    <h4 className={`font-semibold ${theme.textColors.primary}`}>Cash-on-Cash Return</h4>
                  </div>
                  <div className="text-xl font-bold text-blue-400">
                    {formatPercent(analysis.cashOnCashReturn)}
                  </div>
                </div>

                <div className={`p-4 bg-purple-900/20 border ${theme.borderColors.primary} rounded-lg`}>
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="w-5 h-5 text-purple-400" />
                    <h4 className={`font-semibold ${theme.textColors.primary}`}>Cap Rate</h4>
                  </div>
                  <div className="text-xl font-bold text-purple-400">
                    {formatPercent(analysis.capRate)}
                  </div>
                </div>
              </div>

              {/* Investment Grade */}
              <div className={`p-4 border ${theme.borderColors.primary} rounded-lg bg-slate-800/50`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-semibold ${theme.textColors.primary}`}>
                    Investment Analysis
                  </h3>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(analysis.investmentGrade)} bg-slate-700`}>
                    {analysis.investmentGrade}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className={`${theme.textColors.secondary}`}>Total Cash Needed:</span>
                    <div className={`font-semibold ${theme.textColors.primary}`}>
                      {formatCurrency(analysis.totalCashNeeded)}
                    </div>
                  </div>
                  <div>
                    <span className={`${theme.textColors.secondary}`}>NOI:</span>
                    <div className={`font-semibold ${theme.textColors.primary}`}>
                      {formatCurrency(analysis.netOperatingIncome)}
                    </div>
                  </div>
                  <div>
                    <span className={`${theme.textColors.secondary}`}>DSCR:</span>
                    <div className={`font-semibold ${theme.textColors.primary}`}>
                      {analysis.debtServiceCoverageRatio.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <span className={`${theme.textColors.secondary}`}>Break-even Ratio:</span>
                    <div className={`font-semibold ${theme.textColors.primary}`}>
                      {formatPercent(analysis.breakEvenRatio * 100)}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${analysis.onePercentRule ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <span className={`${theme.textColors.secondary}`}>1% Rule</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${analysis.twoPercentRule ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <span className={`${theme.textColors.secondary}`}>2% Rule</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${analysis.fiftyPercentRule ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <span className={`${theme.textColors.secondary}`}>50% Rule</span>
                  </div>
                </div>
              </div>

              {/* 10-Year Projection */}
              <div className={`border ${theme.borderColors.primary} rounded-lg overflow-hidden`}>
                <div className={`bg-slate-800 px-4 py-3 border-b ${theme.borderColors.primary}`}>
                  <h3 className={`font-semibold ${theme.textColors.primary}`}>
                    10-Year Investment Projection
                  </h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className={`bg-slate-700/50 ${theme.textColors.secondary}`}>
                      <tr>
                        <th className="px-4 py-3 text-left">Year</th>
                        <th className="px-4 py-3 text-left">Gross Rent</th>
                        <th className="px-4 py-3 text-left">Net Cash Flow</th>
                        <th className="px-4 py-3 text-left">Cumulative CF</th>
                        <th className="px-4 py-3 text-left">Property Value</th>
                        <th className="px-4 py-3 text-left">Equity</th>
                        <th className="px-4 py-3 text-left">Total Return</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysis.yearlyAnalysis.slice(0, 5).map((year) => (
                        <tr key={year.year} className={`border-t ${theme.borderColors.primary}`}>
                          <td className={`px-4 py-3 ${theme.textColors.primary} font-medium`}>
                            {year.year}
                          </td>
                          <td className={`px-4 py-3 ${theme.textColors.primary}`}>
                            {formatCurrency(year.grossRent)}
                          </td>
                          <td className={`px-4 py-3 ${
                            year.netCashFlow >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {formatCurrency(year.netCashFlow)}
                          </td>
                          <td className={`px-4 py-3 ${theme.textColors.primary}`}>
                            {formatCurrency(year.cumulativeCashFlow)}
                          </td>
                          <td className={`px-4 py-3 ${theme.textColors.primary}`}>
                            {formatCurrency(year.propertyValue)}
                          </td>
                          <td className={`px-4 py-3 ${theme.textColors.primary}`}>
                            {formatCurrency(year.equity)}
                          </td>
                          <td className={`px-4 py-3 ${
                            year.totalReturn >= 0 ? 'text-green-400' : 'text-red-400'
                          } font-semibold`}>
                            {formatCurrency(year.totalReturn)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recommendations */}
              <div className={`p-4 bg-blue-900/20 border ${theme.borderColors.primary} rounded-lg`}>
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                  <div>
                    <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>
                      Investment Recommendations
                    </h4>
                    <ul className={`space-y-1 text-sm ${theme.textColors.secondary}`}>
                      {analysis.recommendations.map((recommendation, index) => (
                        <li key={index}>• {recommendation}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Educational Notes */}
              <div className={`p-4 bg-yellow-900/20 border border-yellow-500/20 rounded-lg`}>
                <h4 className={`font-semibold text-yellow-400 mb-2`}>
                  Key Investment Metrics Explained
                </h4>
                <ul className={`space-y-1 text-sm ${theme.textColors.secondary}`}>
                  <li>• <strong>Cash-on-Cash Return:</strong> Annual cash flow divided by total cash invested</li>
                  <li>• <strong>Cap Rate:</strong> Net Operating Income divided by property value (unleveraged return)</li>
                  <li>• <strong>1% Rule:</strong> Monthly rent should be at least 1% of purchase price</li>
                  <li>• <strong>50% Rule:</strong> Operating expenses typically consume ~50% of rental income</li>
                  <li>• <strong>DSCR:</strong> Debt Service Coverage Ratio - NOI divided by debt payments</li>
                  <li>• <strong>NOI:</strong> Net Operating Income - rental income minus operating expenses</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
