'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import {
  Home,
  DollarSign,
  Calculator,
  TrendingUp,
  PiggyBank,
  AlertTriangle,
  Info,
  Percent,
  Clock,
  Users,
  Wrench,
  ShieldCheck,
  Building
} from 'lucide-react';

interface RentalAnalysis {
  monthlyGrossIncome: number;
  monthlyNetIncome: number;
  annualGrossIncome: number;
  annualNetIncome: number;
  monthlyExpenses: number;
  annualExpenses: number;
  expenseRatio: number;
  capRate: number;
  grossRentMultiplier: number;
  cashOnCashReturn: number;
  onePercentRule: boolean;
  twoPercentRule: boolean;
  fiftyPercentRule: boolean;
  profitability: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  breakdownExpenses: {
    category: string;
    monthly: number;
    annual: number;
    percentage: number;
  }[];
  recommendations: string[];
  warnings: string[];
}

export default function RentalPropertyCalculator() {
  const { recordCalculatorUsage } = useProgressStore();

  // Property Information
  const [propertyValue, setPropertyValue] = useState<number>(350000);
  const [monthlyRent, setMonthlyRent] = useState<number>(2800);
  const [parkingFees, setParkingFees] = useState<number>(100);
  const [storageFees, setStorageFees] = useState<number>(50);
  const [laundryIncome, setLaundryIncome] = useState<number>(0);

  // Operating Expenses (Monthly)
  const [mortgage, setMortgage] = useState<number>(1800);
  const [propertyTaxes, setPropertyTaxes] = useState<number>(400);
  const [insurance, setInsurance] = useState<number>(150);
  const [maintenance, setMaintenance] = useState<number>(200);
  const [utilities, setUtilities] = useState<number>(80);
  const [propertyManagement, setPropertyManagement] = useState<number>(280);
  const [advertising, setAdvertising] = useState<number>(50);
  const [legal, setLegal] = useState<number>(30);
  const [accounting, setAccounting] = useState<number>(25);
  const [hoaFees, setHoaFees] = useState<number>(0);
  const [capitalExpenditures, setCapitalExpenditures] = useState<number>(150);
  const [otherExpenses, setOtherExpenses] = useState<number>(50);

  // Vacancy and Market Assumptions
  const [vacancyRate, setVacancyRate] = useState<number>(6);
  const [turnoverRate, setTurnoverRate] = useState<number>(20);

  // Investment Details
  const [downPayment, setDownPayment] = useState<number>(70000);
  const [closingCosts, setClosingCosts] = useState<number>(8000);
  const [initialRepairs, setInitialRepairs] = useState<number>(5000);

  const [analysis, setAnalysis] = useState<RentalAnalysis | null>(null);

  useEffect(() => {
    recordCalculatorUsage('rental-property-calculator');
  }, [recordCalculatorUsage]);

  const analyzeRental = useCallback(() => {
    // Income Calculations
    const baseMonthlyRent = monthlyRent;
    const otherMonthlyIncome = parkingFees + storageFees + laundryIncome;
    const monthlyGrossIncome = baseMonthlyRent + otherMonthlyIncome;
    
    // Account for vacancy
    const effectiveMonthlyIncome = monthlyGrossIncome * (1 - vacancyRate / 100);
    
    // Expense Calculations
    const monthlyExpenses = 
      mortgage + propertyTaxes + insurance + maintenance + utilities +
      propertyManagement + advertising + legal + accounting + hoaFees +
      capitalExpenditures + otherExpenses;
    
    // Turnover costs (annual, divided by 12)
    const monthlyTurnoverCosts = (turnoverRate / 100) * (advertising * 3 + maintenance * 2) / 12;
    
    const totalMonthlyExpenses = monthlyExpenses + monthlyTurnoverCosts;
    
    // Net Income
    const monthlyNetIncome = effectiveMonthlyIncome - totalMonthlyExpenses;
    const annualGrossIncome = monthlyGrossIncome * 12;
    const annualNetIncome = monthlyNetIncome * 12;
    const annualExpenses = totalMonthlyExpenses * 12;
    
    // Key Ratios
    const expenseRatio = (totalMonthlyExpenses / monthlyGrossIncome) * 100;
    const capRate = propertyValue > 0 ? ((annualNetIncome + mortgage * 12) / propertyValue) * 100 : 0;
    const grossRentMultiplier = propertyValue > 0 ? propertyValue / annualGrossIncome : 0;
    
    // Cash Investment
    const totalCashInvested = downPayment + closingCosts + initialRepairs;
    const cashOnCashReturn = totalCashInvested > 0 ? (annualNetIncome / totalCashInvested) * 100 : 0;
    
    // Investment Rules
    const onePercentRule = monthlyRent >= (propertyValue * 0.01);
    const twoPercentRule = monthlyRent >= (propertyValue * 0.02);
    const fiftyPercentRule = totalMonthlyExpenses <= (monthlyGrossIncome * 0.5);
    
    // Expense Breakdown
    const expenseCategories = [
      { category: 'Mortgage/Debt Service', monthly: mortgage, annual: mortgage * 12 },
      { category: 'Property Taxes', monthly: propertyTaxes, annual: propertyTaxes * 12 },
      { category: 'Insurance', monthly: insurance, annual: insurance * 12 },
      { category: 'Maintenance & Repairs', monthly: maintenance, annual: maintenance * 12 },
      { category: 'Utilities', monthly: utilities, annual: utilities * 12 },
      { category: 'Property Management', monthly: propertyManagement, annual: propertyManagement * 12 },
      { category: 'Marketing & Advertising', monthly: advertising, annual: advertising * 12 },
      { category: 'Legal & Professional', monthly: legal, annual: legal * 12 },
      { category: 'Accounting & Bookkeeping', monthly: accounting, annual: accounting * 12 },
      { category: 'HOA Fees', monthly: hoaFees, annual: hoaFees * 12 },
      { category: 'Capital Expenditures', monthly: capitalExpenditures, annual: capitalExpenditures * 12 },
      { category: 'Turnover Costs', monthly: monthlyTurnoverCosts, annual: monthlyTurnoverCosts * 12 },
      { category: 'Other Expenses', monthly: otherExpenses, annual: otherExpenses * 12 }
    ];

    const breakdownExpenses = expenseCategories
      .filter(exp => exp.monthly > 0)
      .map(exp => ({
        ...exp,
        percentage: (exp.monthly / totalMonthlyExpenses) * 100
      }))
      .sort((a, b) => b.monthly - a.monthly);

    // Profitability Assessment
    let profitability: 'Excellent' | 'Good' | 'Fair' | 'Poor' = 'Poor';
    let score = 0;

    if (cashOnCashReturn >= 15) score += 3;
    else if (cashOnCashReturn >= 10) score += 2;
    else if (cashOnCashReturn >= 6) score += 1;

    if (capRate >= 8) score += 2;
    else if (capRate >= 6) score += 1;

    if (monthlyNetIncome >= 300) score += 2;
    else if (monthlyNetIncome >= 100) score += 1;

    if (expenseRatio <= 50) score += 1;
    if (onePercentRule) score += 1;
    if (vacancyRate <= 8) score += 1;

    if (score >= 8) profitability = 'Excellent';
    else if (score >= 5) profitability = 'Good';
    else if (score >= 3) profitability = 'Fair';

    // Recommendations
    const recommendations: string[] = [];
    const warnings: string[] = [];

    if (cashOnCashReturn < 8) {
      recommendations.push('Consider increasing rent, reducing expenses, or looking for lower-priced properties');
    }

    if (expenseRatio > 60) {
      warnings.push('High expense ratio - review all operating costs for potential reductions');
    }

    if (monthlyNetIncome < 0) {
      warnings.push('Negative cash flow - this property loses money monthly');
    }

    if (!onePercentRule) {
      recommendations.push('Property does not meet 1% rule - rent may be too low for the price');
    }

    if (vacancyRate > 10) {
      warnings.push('High vacancy rate assumption - verify with local market data');
    }

    if (propertyManagement > monthlyGrossIncome * 0.15) {
      recommendations.push('Property management fees seem high - negotiate or consider self-management');
    }

    if (maintenance < monthlyGrossIncome * 0.05) {
      warnings.push('Maintenance budget may be too low - consider increasing reserves');
    }

    if (capitalExpenditures < monthlyGrossIncome * 0.05) {
      warnings.push('CapEx budget may be insufficient for major repairs and replacements');
    }

    if (capRate < 4) {
      recommendations.push('Low cap rate suggests property may be overpriced for rental income');
    }

    if (grossRentMultiplier > 15) {
      recommendations.push('High GRM indicates expensive property relative to rent - negotiate price');
    }

    if (turnoverRate > 30) {
      warnings.push('High turnover rate will significantly impact profitability');
    }

    // Success recommendations
    if (profitability === 'Excellent') {
      recommendations.push('Strong rental property - consider scaling with similar properties');
    }

    if (monthlyNetIncome >= 500) {
      recommendations.push('Excellent cash flow - property provides strong passive income');
    }

    if (fiftyPercentRule && onePercentRule) {
      recommendations.push('Property meets key investment criteria - good fundamentals');
    }

    const analysisResult: RentalAnalysis = {
      monthlyGrossIncome,
      monthlyNetIncome,
      annualGrossIncome,
      annualNetIncome,
      monthlyExpenses: totalMonthlyExpenses,
      annualExpenses,
      expenseRatio,
      capRate,
      grossRentMultiplier,
      cashOnCashReturn,
      onePercentRule,
      twoPercentRule,
      fiftyPercentRule,
      profitability,
      breakdownExpenses,
      recommendations,
      warnings
    };

    setAnalysis(analysisResult);
  }, [
    propertyValue, monthlyRent,
    parkingFees, storageFees, laundryIncome, mortgage, propertyTaxes, insurance,
    maintenance, utilities, propertyManagement, advertising, legal, accounting,
    hoaFees, capitalExpenditures, otherExpenses, vacancyRate, turnoverRate,
    downPayment, closingCosts, initialRepairs
  ]);

  useEffect(() => {
    analyzeRental();
  }, [analyzeRental]);

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

  const getProfitabilityColor = (profitability: string) => {
    switch (profitability) {
      case 'Excellent': return 'text-green-400';
      case 'Good': return 'text-blue-400';
      case 'Fair': return 'text-yellow-400';
      case 'Poor': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className={`p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
      <div className="flex items-center gap-3 mb-6">
        <Building className="w-6 h-6 text-green-400" />
        <h2 className={`text-xl font-bold ${theme.textColors.primary}`}>
          Rental Property Calculator
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Property & Income */}
          <div>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Property & Income
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Property Value
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    value={propertyValue}
                    onChange={(e) => setPropertyValue(Number(e.target.value))}
                    className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Monthly Base Rent
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                    Parking Fees
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      value={parkingFees}
                      onChange={(e) => setParkingFees(Number(e.target.value))}
                      className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none text-sm`}
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                    Storage Fees
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      value={storageFees}
                      onChange={(e) => setStorageFees(Number(e.target.value))}
                      className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none text-sm`}
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                  Laundry Income (Monthly)
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    value={laundryIncome}
                    onChange={(e) => setLaundryIncome(Number(e.target.value))}
                    className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none`}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                    Vacancy Rate %
                  </label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      value={vacancyRate}
                      onChange={(e) => setVacancyRate(Number(e.target.value))}
                      className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none text-sm`}
                      min="0"
                      max="100"
                    />
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                    Turnover Rate %
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="number"
                      value={turnoverRate}
                      onChange={(e) => setTurnoverRate(Number(e.target.value))}
                      className={`w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg ${theme.textColors.primary} focus:border-blue-500 focus:outline-none text-sm`}
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Operating Expenses */}
          <div>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Monthly Operating Expenses
            </h3>
            
            <div className="space-y-3">
              {[
                { label: 'Mortgage Payment', value: mortgage, setter: setMortgage, icon: Home },
                { label: 'Property Taxes', value: propertyTaxes, setter: setPropertyTaxes, icon: Calculator },
                { label: 'Insurance', value: insurance, setter: setInsurance, icon: ShieldCheck },
                { label: 'Maintenance & Repairs', value: maintenance, setter: setMaintenance, icon: Wrench },
                { label: 'Utilities (if paid)', value: utilities, setter: setUtilities, icon: Clock },
                { label: 'Property Management', value: propertyManagement, setter: setPropertyManagement, icon: Building },
                { label: 'Advertising & Marketing', value: advertising, setter: setAdvertising, icon: TrendingUp },
                { label: 'Legal & Professional', value: legal, setter: setLegal, icon: Info },
                { label: 'Accounting & Bookkeeping', value: accounting, setter: setAccounting, icon: Calculator },
                { label: 'HOA Fees', value: hoaFees, setter: setHoaFees, icon: Home },
                { label: 'Capital Expenditures', value: capitalExpenditures, setter: setCapitalExpenditures, icon: TrendingUp },
                { label: 'Other Expenses', value: otherExpenses, setter: setOtherExpenses, icon: DollarSign }
              ].map((expense, index) => (
                <div key={index}>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-1`}>
                    {expense.label}
                  </label>
                  <div className="relative">
                    <expense.icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
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

          {/* Investment Details */}
          <div>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Initial Investment
            </h3>
            
            <div className="space-y-4">
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
                  Initial Repairs
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    value={initialRepairs}
                    onChange={(e) => setInitialRepairs(Number(e.target.value))}
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
                  analysis.monthlyNetIncome >= 200 ? 'bg-green-900/20' : 
                  analysis.monthlyNetIncome >= 0 ? 'bg-yellow-900/20' : 'bg-red-900/20'
                } border ${theme.borderColors.primary} rounded-lg`}>
                  <div className="flex items-center gap-2 mb-2">
                    <PiggyBank className={`w-5 h-5 ${
                      analysis.monthlyNetIncome >= 200 ? 'text-green-400' : 
                      analysis.monthlyNetIncome >= 0 ? 'text-yellow-400' : 'text-red-400'
                    }`} />
                    <h4 className={`font-semibold ${theme.textColors.primary}`}>Monthly Net Income</h4>
                  </div>
                  <div className={`text-xl font-bold ${
                    analysis.monthlyNetIncome >= 200 ? 'text-green-400' : 
                    analysis.monthlyNetIncome >= 0 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {formatCurrency(analysis.monthlyNetIncome)}
                  </div>
                </div>

                <div className={`p-4 bg-blue-900/20 border ${theme.borderColors.primary} rounded-lg`}>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                    <h4 className={`font-semibold ${theme.textColors.primary}`}>Cash-on-Cash Return</h4>
                  </div>
                  <div className="text-xl font-bold text-blue-400">
                    {formatPercent(analysis.cashOnCashReturn)}
                  </div>
                </div>

                <div className={`p-4 bg-purple-900/20 border ${theme.borderColors.primary} rounded-lg`}>
                  <div className="flex items-center gap-2 mb-2">
                    <Calculator className="w-5 h-5 text-purple-400" />
                    <h4 className={`font-semibold ${theme.textColors.primary}`}>Cap Rate</h4>
                  </div>
                  <div className="text-xl font-bold text-purple-400">
                    {formatPercent(analysis.capRate)}
                  </div>
                </div>
              </div>

              {/* Income vs Expenses */}
              <div className={`p-4 border ${theme.borderColors.primary} rounded-lg bg-slate-800/50`}>
                <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
                  Income vs Expenses Analysis
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className={`font-medium ${theme.textColors.primary} mb-3`}>Monthly Income</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className={`${theme.textColors.secondary}`}>Gross Rent Income:</span>
                        <span className={`${theme.textColors.primary} font-medium`}>
                          {formatCurrency(analysis.monthlyGrossIncome)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`${theme.textColors.secondary}`}>Less: Vacancy ({vacancyRate}%):</span>
                        <span className="text-red-400">
                          -{formatCurrency(analysis.monthlyGrossIncome * (vacancyRate / 100))}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-slate-600 pt-2">
                        <span className={`${theme.textColors.primary} font-medium`}>Effective Income:</span>
                        <span className={`${theme.textColors.primary} font-medium`}>
                          {formatCurrency(analysis.monthlyGrossIncome * (1 - vacancyRate / 100))}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className={`font-medium ${theme.textColors.primary} mb-3`}>Monthly Expenses</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className={`${theme.textColors.secondary}`}>Total Operating Expenses:</span>
                        <span className="text-red-400">
                          {formatCurrency(analysis.monthlyExpenses)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`${theme.textColors.secondary}`}>Expense Ratio:</span>
                        <span className={`${
                          analysis.expenseRatio <= 50 ? 'text-green-400' : 
                          analysis.expenseRatio <= 65 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {formatPercent(analysis.expenseRatio)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-600">
                  <div className="flex justify-between items-center">
                    <span className={`text-lg font-semibold ${theme.textColors.primary}`}>
                      Net Cash Flow:
                    </span>
                    <span className={`text-xl font-bold ${
                      analysis.monthlyNetIncome >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {formatCurrency(analysis.monthlyNetIncome)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Investment Rules Check */}
              <div className={`p-4 border ${theme.borderColors.primary} rounded-lg bg-slate-800/50`}>
                <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
                  Investment Rules Analysis
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${analysis.onePercentRule ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <div>
                      <div className={`font-medium ${theme.textColors.primary}`}>1% Rule</div>
                      <div className={`text-xs ${theme.textColors.secondary}`}>
                        Rent ≥ 1% of price
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${analysis.twoPercentRule ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <div>
                      <div className={`font-medium ${theme.textColors.primary}`}>2% Rule</div>
                      <div className={`text-xs ${theme.textColors.secondary}`}>
                        Rent ≥ 2% of price
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${analysis.fiftyPercentRule ? 'bg-green-400' : 'bg-red-400'}`}></div>
                    <div>
                      <div className={`font-medium ${theme.textColors.primary}`}>50% Rule</div>
                      <div className={`text-xs ${theme.textColors.secondary}`}>
                        Expenses ≤ 50% of income
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className={`${theme.textColors.primary}`}>Overall Profitability:</span>
                  <span className={`font-bold ${getProfitabilityColor(analysis.profitability)}`}>
                    {analysis.profitability}
                  </span>
                </div>
              </div>

              {/* Expense Breakdown */}
              <div className={`border ${theme.borderColors.primary} rounded-lg overflow-hidden`}>
                <div className={`bg-slate-800 px-4 py-3 border-b ${theme.borderColors.primary}`}>
                  <h3 className={`font-semibold ${theme.textColors.primary}`}>
                    Expense Breakdown
                  </h3>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className={`bg-slate-700/50 ${theme.textColors.secondary}`}>
                      <tr>
                        <th className="px-4 py-3 text-left">Category</th>
                        <th className="px-4 py-3 text-left">Monthly</th>
                        <th className="px-4 py-3 text-left">Annual</th>
                        <th className="px-4 py-3 text-left">% of Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analysis.breakdownExpenses.map((expense, index) => (
                        <tr key={index} className={`border-t ${theme.borderColors.primary}`}>
                          <td className={`px-4 py-3 ${theme.textColors.primary} font-medium`}>
                            {expense.category}
                          </td>
                          <td className={`px-4 py-3 ${theme.textColors.primary}`}>
                            {formatCurrency(expense.monthly)}
                          </td>
                          <td className={`px-4 py-3 ${theme.textColors.primary}`}>
                            {formatCurrency(expense.annual)}
                          </td>
                          <td className={`px-4 py-3 ${theme.textColors.primary}`}>
                            {formatPercent(expense.percentage)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recommendations */}
              {analysis.recommendations.length > 0 && (
                <div className={`p-4 bg-blue-900/20 border ${theme.borderColors.primary} rounded-lg`}>
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-400 mt-0.5" />
                    <div>
                      <h4 className={`font-semibold ${theme.textColors.primary} mb-2`}>
                        Recommendations
                      </h4>
                      <ul className={`space-y-1 text-sm ${theme.textColors.secondary}`}>
                        {analysis.recommendations.map((recommendation, index) => (
                          <li key={index}>• {recommendation}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Warnings */}
              {analysis.warnings.length > 0 && (
                <div className={`p-4 bg-red-900/20 border border-red-500/20 rounded-lg`}>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5" />
                    <div>
                      <h4 className={`font-semibold text-red-400 mb-2`}>
                        Warning Signs
                      </h4>
                      <ul className={`space-y-1 text-sm ${theme.textColors.secondary}`}>
                        {analysis.warnings.map((warning, index) => (
                          <li key={index}>• {warning}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Educational Notes */}
              <div className={`p-4 bg-yellow-900/20 border border-yellow-500/20 rounded-lg`}>
                <h4 className={`font-semibold text-yellow-400 mb-2`}>
                  Rental Property Investment Tips
                </h4>
                <ul className={`space-y-1 text-sm ${theme.textColors.secondary}`}>
                  <li>• <strong>1% Rule:</strong> Monthly rent should be at least 1% of property value</li>
                  <li>• <strong>50% Rule:</strong> Operating expenses typically consume ~50% of rental income</li>
                  <li>• <strong>Cap Rate:</strong> Net Operating Income ÷ Property Value (unleveraged return)</li>
                  <li>• <strong>Cash-on-Cash:</strong> Annual cash flow ÷ Total cash invested</li>
                  <li>• <strong>CapEx Reserve:</strong> Budget 5-10% of income for major repairs/replacements</li>
                  <li>• <strong>Vacancy Buffer:</strong> Account for 5-10% vacancy even in strong markets</li>
                </ul>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
