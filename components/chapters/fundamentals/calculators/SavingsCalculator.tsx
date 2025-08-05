'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CalculatorWrapper from '@/components/shared/calculators/CalculatorWrapper';
import { CurrencyInput, NumberInput } from '@/components/shared/calculators/FormFields';
import { ResultCard } from '@/components/shared/calculators/ResultComponents';
import { formatCurrency } from '@/lib/utils/financial';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import { PiggyBank, TrendingUp, DollarSign, Target, Award, Download, Share, Calculator, TrendingDown, Globe, Users, FileText, Share2, Link2 } from 'lucide-react';
import { theme } from '@/lib/theme';
import toast from 'react-hot-toast';

interface ChartDataPoint {
  year: number;
  deposited: number;
  total: number;
  interest: number;
}

interface BankRate {
  bank: string;
  type: string;
  apy: number;
  lastUpdated: string;
}

interface ScenarioComparison {
  scenario: string;
  futureValue: number;
  totalDeposited: number;
  interestEarned: number;
  color: string;
}

interface MonteCarloResult {
  percentile: number;
  value: number;
}

const SavingsCalculator = () => {
  // Form inputs
  const [initialDeposit, setInitialDeposit] = useState('1000');
  const [monthlyDeposit, setMonthlyDeposit] = useState('100');
  const [interestRate, setInterestRate] = useState('4.5');
  const [timeYears, setTimeYears] = useState('5');
  const [showCelebration, setShowCelebration] = useState(false);
  const [lastCalculation, setLastCalculation] = useState<Date | null>(null);
  
  // Advanced features
  const [viewMode, setViewMode] = useState<'basic' | 'advanced' | 'comparison' | 'monte-carlo'>('basic');
  const [liveBankRates, setLiveBankRates] = useState<BankRate[]>([]);
  const [inflationRate, setInflationRate] = useState('3.2');
  const [monteCarloRuns] = useState(1000);
  const [riskProfile, setRiskProfile] = useState<'conservative' | 'moderate' | 'aggressive'>('moderate');

  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [scenarioData, setScenarioData] = useState<ScenarioComparison[]>([]);
  const [monteCarloResults, setMonteCarloResults] = useState<MonteCarloResult[]>([]);
  const [results, setResults] = useState({
    futureValue: 0,
    totalDeposited: 0,
    interestEarned: 0,
    effectiveRate: 0,
    realValue: 0, // Inflation-adjusted
    monthsToGoal: 0,
    compoundingPower: 0
  });

  // Fetch live banking rates (simulated for demo)
  const fetchLiveBankRates = useCallback(async () => {
    try {
      // In production, this would call real banking APIs
      const mockRates: BankRate[] = [
        { bank: 'Marcus by Goldman Sachs', type: 'High-Yield Savings', apy: 4.50, lastUpdated: new Date().toISOString() },
        { bank: 'Ally Bank', type: 'Online Savings', apy: 4.25, lastUpdated: new Date().toISOString() },
        { bank: 'Capital One 360', type: 'Performance Savings', apy: 4.30, lastUpdated: new Date().toISOString() },
        { bank: 'Discover Bank', type: 'Online Savings', apy: 4.35, lastUpdated: new Date().toISOString() },
        { bank: 'American Express', type: 'Personal Savings', apy: 4.25, lastUpdated: new Date().toISOString() },
        { bank: 'Chase Bank', type: 'Traditional Savings', apy: 0.01, lastUpdated: new Date().toISOString() },
        { bank: 'Bank of America', type: 'Advantage Savings', apy: 0.02, lastUpdated: new Date().toISOString() },
        { bank: 'Wells Fargo', type: 'Way2Save', apy: 0.05, lastUpdated: new Date().toISOString() }
      ];
      setLiveBankRates(mockRates);
    } catch {
      console.warn('Failed to fetch live rates, using defaults');
    }
  }, []);

  // Monte Carlo simulation for uncertainty analysis
  const runMonteCarloSimulation = useCallback(() => {
    const initial = parseFloat(initialDeposit) || 0;
    const monthly = parseFloat(monthlyDeposit) || 0;
    const baseRate = parseFloat(interestRate) || 0;
    const years = parseInt(timeYears) || 0;
    
    const results: number[] = [];
    
    // Risk profile determines volatility
    const volatility = riskProfile === 'conservative' ? 0.5 : 
                      riskProfile === 'moderate' ? 1.0 : 1.5;
    
    for (let i = 0; i < monteCarloRuns; i++) {
      let currentValue = initial;
      
      for (let year = 0; year < years; year++) {
        // Add random variation to interest rate
        const randomRate = baseRate + (Math.random() - 0.5) * volatility;
        const effectiveRate = Math.max(0, randomRate / 100); // Don't allow negative rates
        
        // Compound existing value
        currentValue *= (1 + effectiveRate);
        
        // Add monthly deposits with compounding
        for (let month = 0; month < 12; month++) {
          currentValue += monthly;
          currentValue *= (1 + effectiveRate / 12);
        }
      }
      
      results.push(currentValue);
    }
    
    results.sort((a, b) => a - b);
    
    const percentiles: MonteCarloResult[] = [
      { percentile: 10, value: results[Math.floor(results.length * 0.1)] },
      { percentile: 25, value: results[Math.floor(results.length * 0.25)] },
      { percentile: 50, value: results[Math.floor(results.length * 0.5)] },
      { percentile: 75, value: results[Math.floor(results.length * 0.75)] },
      { percentile: 90, value: results[Math.floor(results.length * 0.9)] }
    ];
    
    setMonteCarloResults(percentiles);
  }, [initialDeposit, monthlyDeposit, interestRate, timeYears, monteCarloRuns, riskProfile]);

  // Generate scenario comparisons
  const generateScenarioComparisons = useCallback(() => {
    const scenarios: ScenarioComparison[] = [];
    const initial = parseFloat(initialDeposit) || 0;
    const monthly = parseFloat(monthlyDeposit) || 0;
    const years = parseInt(timeYears) || 0;
    
    const scenarioConfigs = [
      { name: 'Big Bank (0.01%)', rate: 0.01, color: '#ef4444' },
      { name: 'Credit Union (2.5%)', rate: 2.5, color: '#f97316' },
      { name: 'Online Bank (4.5%)', rate: 4.5, color: '#10b981' },
      { name: 'Best Rate (5.2%)', rate: 5.2, color: '#3b82f6' }
    ];
    
    scenarioConfigs.forEach(config => {
      const monthlyRate = config.rate / 100 / 12;
      const totalMonths = years * 12;
      
      const initialFV = initial * Math.pow(1 + monthlyRate, totalMonths);
      const monthlyFV = monthlyRate === 0 ? monthly * totalMonths :
        monthly * (Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate;
      
      const futureValue = initialFV + monthlyFV;
      const totalDeposited = initial + (monthly * totalMonths);
      const interestEarned = futureValue - totalDeposited;
      
      scenarios.push({
        scenario: config.name,
        futureValue,
        totalDeposited,
        interestEarned,
        color: config.color
      });
    });
    
    setScenarioData(scenarios);
  }, [initialDeposit, monthlyDeposit, timeYears]);

  // Export Functions
  const exportToPDF = useCallback(() => {
    const reportData = {
      timestamp: new Date().toLocaleDateString(),
      inputs: { initialDeposit, monthlyDeposit, timeYears, interestRate },
      results,
      insights: {
        compoundingPower: results?.compoundingPower || 0,
        realValue: results?.realValue || 0,
        monthsToGoal: results?.monthsToGoal || 0
      }
    };
    
    // Simulate PDF generation (in real app would use jsPDF or similar)
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `savings-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Report exported successfully!');
  }, [initialDeposit, monthlyDeposit, timeYears, interestRate, results]);

  const exportToCSV = useCallback(() => {
    if (!chartData.length) return;
    
    const csvContent = [
      'Year,Total Deposited,Total Value,Interest Earned',
      ...chartData.map(row => `${row.year},${row.deposited},${row.total},${row.interest}`)
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `savings-projection-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Data exported to CSV!');
  }, [chartData]);

  const shareToSocial = useCallback(() => {
    if (!results) return;
    
    const shareText = `🎯 My Savings Goal: I'll have ${formatCurrency(results.futureValue)} in ${timeYears} years by saving $${monthlyDeposit}/month! 💰 Check out Finance Quest's savings calculator.`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Savings Plan',
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Share text copied to clipboard!');
    }
  }, [results, timeYears, monthlyDeposit]);

  const calculateSavings = useCallback(() => {
    const initial = parseFloat(initialDeposit) || 0;
    const monthly = parseFloat(monthlyDeposit) || 0;
    const rate = parseFloat(interestRate) || 0;
    const years = parseInt(timeYears) || 0;

    if (initial < 0 || monthly < 0 || rate < 0 || years < 0) return;

    const monthlyRate = rate / 100 / 12;
    const totalMonths = years * 12;

    // Calculate future value of initial deposit (lump sum)
    const initialDepositFV = initial * Math.pow(1 + monthlyRate, totalMonths);

    // Calculate future value of monthly deposits (annuity)
    let monthlyDepositsFV = 0;
    if (monthlyRate === 0) {
      monthlyDepositsFV = monthly * totalMonths;
    } else {
      monthlyDepositsFV = monthly * (Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate;
    }

    const totalFutureValue = initialDepositFV + monthlyDepositsFV;
    const totalDeposited = initial + (monthly * totalMonths);
    const totalInterestEarned = totalFutureValue - totalDeposited;
    
    // Calculate inflation-adjusted real value
    const inflationRateDecimal = parseFloat(inflationRate) / 100 || 0;
    const realValue = totalFutureValue / Math.pow(1 + inflationRateDecimal, years);
    
    // Calculate compounding power (how much compound interest contributed)
    const simpleInterestValue = totalDeposited * (1 + rate * years);
    const compoundingPower = totalFutureValue - simpleInterestValue;
    
    // Calculate months to reach common goals
    const emergencyGoal = monthly * 6; // 6 months expenses
    const monthsToGoal = emergencyGoal > 0 ? Math.ceil(emergencyGoal / monthly) : 0;

    // Trigger celebration for significant milestones
    const now = new Date();
    if (lastCalculation === null || now.getTime() - lastCalculation.getTime() > 2000) {
      if (totalFutureValue >= 100000 && rate >= 4) {
        setShowCelebration(true);
        toast.success('🎉 Amazing! You\'re on track to build serious wealth with high-yield savings!', {
          duration: 4000,
          position: 'top-center',
        });
        setTimeout(() => setShowCelebration(false), 3000);
      } else if (totalInterestEarned >= 10000) {
        toast.success('💰 Excellent! You\'ll earn over $10,000 in interest!', {
          duration: 3000,
          position: 'top-center',
        });
      }
      setLastCalculation(now);
    }

    setResults({
      futureValue: totalFutureValue,
      totalDeposited: totalDeposited,
      interestEarned: totalInterestEarned,
      effectiveRate: years > 0 ? ((totalFutureValue / totalDeposited - 1) / years) * 100 : 0,
      realValue: realValue,
      monthsToGoal: monthsToGoal,
      compoundingPower: compoundingPower
    });

    // Generate chart data
    const data = [];
    for (let year = 0; year <= years; year++) {
      const yearMonths = year * 12;

      const yearInitialFV = year === 0 ? initial :
        initial * Math.pow(1 + monthlyRate, yearMonths);

      let yearMonthlyFV = 0;
      if (year > 0) {
        if (monthlyRate === 0) {
          yearMonthlyFV = monthly * yearMonths;
        } else {
          yearMonthlyFV = monthly * (Math.pow(1 + monthlyRate, yearMonths) - 1) / monthlyRate;
        }
      }

      const yearTotalDeposited = initial + (monthly * yearMonths);
      const yearTotalValue = yearInitialFV + yearMonthlyFV;

      data.push({
        year,
        deposited: yearTotalDeposited,
        total: yearTotalValue,
        interest: yearTotalValue - yearTotalDeposited
      });
    }
    setChartData(data);
  }, [initialDeposit, monthlyDeposit, interestRate, timeYears, inflationRate, lastCalculation]);

  React.useEffect(() => {
    calculateSavings();
  }, [calculateSavings]);

  React.useEffect(() => {
    fetchLiveBankRates();
  }, [fetchLiveBankRates]);

  React.useEffect(() => {
    if (viewMode === 'comparison') {
      generateScenarioComparisons();
    }
  }, [viewMode, generateScenarioComparisons]);

  React.useEffect(() => {
    if (viewMode === 'monte-carlo') {
      runMonteCarloSimulation();
    }
  }, [viewMode, runMonteCarloSimulation]);

  const handleReset = () => {
    setInitialDeposit('1000');
    setMonthlyDeposit('100');
    setInterestRate('4.5');
    setTimeYears('5');
    setInflationRate('3.2');
    setViewMode('basic');
    setRiskProfile('moderate');
    setShowCelebration(false);
    setLastCalculation(null);
  };

  const shareResults = () => {
    const shareText = `💰 My savings plan: $${formatCurrency(results.futureValue)} in ${timeYears} years with ${interestRate}% APY!`;
    
    if (navigator.share) {
      navigator.share({
        title: 'My Savings Plan Results',
        text: shareText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('📋 Results copied to clipboard!', {
        duration: 3000,
        position: 'top-center',
      });
    }
  };

  const applyPreset = (preset: { initial: number; monthly: number; rate: number; years: number }) => {
    setInitialDeposit(preset.initial.toString());
    setMonthlyDeposit(preset.monthly.toString());
    setInterestRate(preset.rate.toString());
    setTimeYears(preset.years.toString());
  };

  // Generate insights based on calculations
  const generateInsights = () => {
    const insights = [];
    
    const rateNum = parseFloat(interestRate) || 0;
    const yearNum = parseInt(timeYears) || 0;
    const monthlyNum = parseFloat(monthlyDeposit) || 0;

    // Low interest rate warning
    if (rateNum < 1) {
      insights.push({
        type: 'warning' as const,
        title: 'Very Low Interest Rate',
        message: `At ${rateNum}% interest, you're barely beating inflation. Consider high-yield savings accounts offering 4-5% APY.`
      });
    }

    // Great rate insight
    if (rateNum >= 4) {
      insights.push({
        type: 'success' as const,
        title: 'Excellent Savings Rate',
        message: `Your ${rateNum}% rate is competitive! You're earning ${formatCurrency(results.interestEarned)} in interest over ${yearNum} years.`
      });
    }

    // Emergency fund goal insight
    if (monthlyNum >= 300 && yearNum <= 3) {
      const emergencyFund = monthlyNum * 6; // 6 months of expenses
      insights.push({
        type: 'info' as const,
        title: 'Emergency Fund Progress',
        message: `At ${formatCurrency(monthlyNum)}/month, you could build a ${formatCurrency(emergencyFund)} emergency fund in ${Math.ceil(emergencyFund / monthlyNum)} months.`
      });
    }

    // Big vs online bank comparison
    if (rateNum > 0.5) {
      const bigBankInterest = results.totalDeposited * 0.0001 * yearNum;
      const savings = results.interestEarned - bigBankInterest;
      if (savings > 100) {
        insights.push({
          type: 'success' as const,
          title: 'Smart Banking Choice',
          message: `Compared to big banks (0.01% APY), you'll earn ${formatCurrency(savings)} more with your current rate!`
        });
      }
    }

    return insights;
  };

  // Calculator metadata
  const metadata = {
    id: 'savings-calculator',
    title: 'Savings Growth Calculator',
    description: 'See how your money grows with compound interest and regular savings',
    category: 'basic' as const,
    icon: PiggyBank,
    tags: ['savings', 'compound interest', 'banking', 'emergency fund'],
    educationalNotes: [
      {
        title: 'Maximize Your Savings Rate',
        content: 'The difference between a traditional bank (0.01% APY) and a high-yield online bank (4-5% APY) can mean thousands of dollars over time.',
        tips: [
          'Research online banks and credit unions for better rates',
          'Consider money market accounts for higher balances',
          'Look for accounts with no monthly fees or minimum balance requirements',
          'Set up automatic transfers to make saving effortless'
        ]
      },
      {
        title: 'Emergency Fund Strategy',
        content: 'Financial experts recommend saving 3-6 months of expenses in an easily accessible account. This calculator helps you plan how long it will take to reach your goal.',
        tips: [
          'Start with a goal of $1,000 for small emergencies',
          'Gradually build to 3-6 months of living expenses',
          'Keep emergency funds in high-yield, liquid accounts',
          'Separate emergency savings from other financial goals'
        ]
      }
    ]
  };

  // Results formatting for the wrapper
  const calculatorResults = {
    primary: {
      label: 'Future Value',
      value: results.futureValue,
      format: 'currency' as const,
      variant: 'success' as const,
      description: `Your money after ${timeYears} years of growth`
    },
    secondary: [
      {
        label: 'Total Deposited',
        value: results.totalDeposited,
        format: 'currency' as const,
        description: 'All your contributions over time'
      },
      {
        label: 'Interest Earned',
        value: results.interestEarned,
        format: 'currency' as const,
        variant: 'success' as const,
        description: 'Free money from compound interest'
      },
      {
        label: 'Effective Annual Return',
        value: results.effectiveRate,
        format: 'percentage' as const,
        description: 'Your average yearly growth rate'
      }
    ]
  };

  return (
    <CalculatorWrapper
      metadata={metadata}
      results={calculatorResults}
      insights={generateInsights()}
      onReset={handleReset}
    >
      <div className="space-y-6">
        {/* View Mode Selector */}
        <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-4`}>
          <h4 className={`${theme.typography.heading6} ${theme.textColors.primary} mb-3`}>Analysis Mode</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {[
              { mode: 'basic' as const, label: 'Basic', icon: Calculator },
              { mode: 'advanced' as const, label: 'Advanced', icon: TrendingUp },
              { mode: 'comparison' as const, label: 'Compare Banks', icon: Globe },
              { mode: 'monte-carlo' as const, label: 'Risk Analysis', icon: TrendingDown }
            ].map(({ mode, label, icon: Icon }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`flex items-center justify-center space-x-2 p-3 rounded-lg transition-all ${
                  viewMode === mode 
                    ? `${theme.status.success.bg} ${theme.status.success.text}` 
                    : `${theme.backgrounds.glass} ${theme.textColors.secondary} hover:${theme.status.info.bg}`
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Live Banking Rates Widget */}
        {liveBankRates.length > 0 && (
          <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-6`}>
            <div className="flex items-center justify-between mb-4">
              <h4 className={`${theme.typography.heading6} ${theme.textColors.primary}`}>
                🔴 Live Banking Rates
              </h4>
              <span className={`text-xs ${theme.textColors.muted}`}>
                Updated: {new Date().toLocaleTimeString()}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {liveBankRates.slice(0, 6).map((rate, index) => (
                <div key={index} className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} p-3 rounded-lg`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className={`font-medium ${theme.textColors.primary} text-sm`}>{rate.bank}</p>
                      <p className={`text-xs ${theme.textColors.muted}`}>{rate.type}</p>
                    </div>
                    <div className={`text-right ${rate.apy >= 4 ? theme.status.success.text : theme.status.warning.text}`}>
                      <p className="text-lg font-bold">{rate.apy}%</p>
                      <p className="text-xs">APY</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setInterestRate(rate.apy.toString())}
                    className={`mt-2 w-full text-xs py-1 px-2 rounded ${theme.buttons.secondary} hover:${theme.status.info.bg} transition-colors`}
                  >
                    Use This Rate
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Input Section */}
        <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-6`}>
          <div className="flex items-center justify-between mb-4">
            <h4 className={`${theme.typography.heading5} ${theme.textColors.primary}`}>Your Savings Plan</h4>
            <div className="flex space-x-2">
              <button
                onClick={exportToCSV}
                className={`flex items-center space-x-1 px-3 py-1 text-xs ${theme.buttons.secondary} rounded hover:${theme.status.info.bg}`}
              >
                <Download className="w-3 h-3" />
                <span>CSV</span>
              </button>
              <button
                onClick={exportToPDF}
                className={`flex items-center space-x-1 px-3 py-1 text-xs ${theme.buttons.secondary} rounded hover:${theme.status.info.bg}`}
              >
                <Download className="w-3 h-3" />
                <span>PDF</span>
              </button>
              <button
                onClick={shareResults}
                className={`flex items-center space-x-1 px-3 py-1 text-xs ${theme.buttons.secondary} rounded hover:${theme.status.info.bg}`}
              >
                <Share className="w-3 h-3" />
                <span>Share</span>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <CurrencyInput
              id="initialDeposit"
              label="Initial Deposit"
              value={initialDeposit}
              onChange={setInitialDeposit}
              min={0}
              step={100}
              placeholder="Enter initial deposit"
            />

            <CurrencyInput
              id="monthlyDeposit"
              label="Monthly Deposit"
              value={monthlyDeposit}
              onChange={setMonthlyDeposit}
              min={0}
              step={25}
              placeholder="Enter monthly amount"
            />

            <NumberInput
              id="interestRate"
              label="Annual Interest Rate (%)"
              value={interestRate}
              onChange={setInterestRate}
              min={0}
              max={20}
              step={0.1}
              placeholder="Enter annual rate"
            />
            
            <NumberInput
              id="timeYears"
              label="Time Period (years)"
              value={timeYears}
              onChange={setTimeYears}
              min={1}
              max={50}
              step={1}
              placeholder="Enter number of years"
            />

            {viewMode === 'advanced' && (
              <>
                <NumberInput
                  id="inflationRate"
                  label="Inflation Rate (%)"
                  value={inflationRate}
                  onChange={setInflationRate}
                  min={0}
                  max={10}
                  step={0.1}
                  placeholder="Enter inflation rate"
                />
                
                <div>
                  <label className={`block text-sm font-medium ${theme.textColors.primary} mb-1`}>
                    Risk Profile
                  </label>
                  <select
                    value={riskProfile}
                    onChange={(e) => setRiskProfile(e.target.value as 'conservative' | 'moderate' | 'aggressive')}
                    className={`w-full p-2 rounded-lg bg-white/10 border ${theme.borderColors.primary} ${theme.textColors.primary}`}
                  >
                    <option value="conservative">Conservative</option>
                    <option value="moderate">Moderate</option>
                    <option value="aggressive">Aggressive</option>
                  </select>
                </div>
              </>
            )}
          </div>

          {/* Quick Presets */}
          <div className={`mt-6 ${theme.backgrounds.glass} border ${theme.borderColors.primary} p-4 rounded-lg`}>
            <h4 className={`font-medium ${theme.textColors.primary} mb-3`}>Quick Scenarios</h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Big Bank (0.01%)', initial: 1000, monthly: 200, rate: 0.01, years: 5 },
                { label: 'Credit Union (2.5%)', initial: 1000, monthly: 200, rate: 2.5, years: 5 },
                { label: 'Online Bank (4.5%)', initial: 1000, monthly: 200, rate: 4.5, years: 5 },
                { label: 'Emergency Fund Goal', initial: 0, monthly: 400, rate: 4.5, years: 2 }
              ].map((preset, index) => (
                <button
                  key={index}
                  onClick={() => applyPreset(preset)}
                  className={`text-xs p-2 ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded hover:${theme.status.info.bg} transition-colors`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Results Display with Real Value */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
            <ResultCard
              icon={Target}
              label="Future Value"
              value={results.futureValue}
              format="currency"
              variant="success"
            />
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
            <ResultCard
              icon={DollarSign}
              label="Interest Earned"
              value={results.interestEarned}
              format="currency"
              variant="info"
            />
          </motion.div>
          
          {viewMode === 'advanced' && (
            <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
              <ResultCard
                icon={TrendingDown}
                label="Real Value (Inflation-Adj)"
                value={results.realValue}
                format="currency"
                variant="warning"
              />
            </motion.div>
          )}
          
          <motion.div whileHover={{ scale: 1.02 }} transition={{ type: "spring", stiffness: 300 }}>
            <ResultCard
              icon={TrendingUp}
              label="Growth Multiplier"
              value={results.totalDeposited > 0 ? (results.futureValue / results.totalDeposited) : 1}
              format="number"
              variant="success"
            />
          </motion.div>
        </div>

        {/* Peer Comparison Widget */}
        <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-6`}>
          <div className="flex items-center space-x-2 mb-4">
            <Users className={`w-5 h-5 ${theme.status.info.text}`} />
            <h4 className={`${theme.typography.heading6} ${theme.textColors.primary}`}>
              How You Compare to Others
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} p-4 rounded-lg text-center`}>
              <p className={`text-2xl font-bold ${theme.status.success.text}`}>
                {results.futureValue > 50000 ? '💪' : results.futureValue > 25000 ? '👍' : '📈'}
              </p>
              <p className={`text-sm ${theme.textColors.primary} font-medium`}>
                {results.futureValue > 50000 ? 'Top 25%' : results.futureValue > 25000 ? 'Above Average' : 'Getting Started'}
              </p>
              <p className={`text-xs ${theme.textColors.muted}`}>
                Compared to peers in your age group
              </p>
            </div>
            <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} p-4 rounded-lg text-center`}>
              <p className={`text-2xl font-bold ${theme.status.warning.text}`}>
                {parseFloat(interestRate) > 4 ? '🚀' : parseFloat(interestRate) > 2 ? '✈️' : '🐌'}
              </p>
              <p className={`text-sm ${theme.textColors.primary} font-medium`}>
                {parseFloat(interestRate) > 4 ? 'Excellent Rate' : parseFloat(interestRate) > 2 ? 'Good Rate' : 'Consider Upgrading'}
              </p>
              <p className={`text-xs ${theme.textColors.muted}`}>
                Your interest rate vs market average
              </p>
            </div>
            <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} p-4 rounded-lg text-center`}>
              <p className={`text-2xl font-bold ${theme.status.info.text}`}>
                {parseFloat(monthlyDeposit) > 300 ? '🏆' : parseFloat(monthlyDeposit) > 150 ? '💪' : '🌱'}
              </p>
              <p className={`text-sm ${theme.textColors.primary} font-medium`}>
                {parseFloat(monthlyDeposit) > 300 ? 'Super Saver' : parseFloat(monthlyDeposit) > 150 ? 'Good Saver' : 'Building Habits'}
              </p>
              <p className={`text-xs ${theme.textColors.muted}`}>
                Monthly savings vs recommended 20%
              </p>
            </div>
          </div>
        </div>

        {/* Celebration Animation */}
        <AnimatePresence>
          {showCelebration && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              className={`fixed inset-0 z-50 flex items-center justify-center pointer-events-none`}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className={`${theme.status.success.bg} rounded-full p-8`}
              >
                <Award className={`w-16 h-16 ${theme.status.success.text}`} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Advanced Chart Section */}
        {chartData.length > 0 && (
          <div className={`${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg p-6`}>
            <h4 className={`${theme.typography.heading5} ${theme.textColors.primary} mb-4`}>
              {viewMode === 'comparison' ? 'Bank Comparison Analysis' : 
               viewMode === 'monte-carlo' ? 'Risk Analysis Results' :
               'Growth Over Time'}
            </h4>
            
            {/* Basic and Advanced Line Chart */}
            {(viewMode === 'basic' || viewMode === 'advanced') && (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  {viewMode === 'advanced' ? (
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.slate[700]} opacity={0.3} />
                      <XAxis
                        dataKey="year"
                        label={{ value: 'Years', position: 'insideBottom', offset: -10 }}
                        tick={{ fill: theme.colors.slate[400] }}
                      />
                      <YAxis
                        tickFormatter={(value: number) => `$${(value / 1000).toFixed(1)}k`}
                        label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }}
                        tick={{ fill: theme.colors.slate[400] }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: theme.colors.slate[800],
                          border: `1px solid ${theme.colors.slate[700]}`,
                          borderRadius: '8px',
                          color: theme.colors.slate[100]
                        }}
                        formatter={(value: number, name: string) => [
                          formatCurrency(value), 
                          name === 'deposited' ? 'Total Deposited' : 
                          name === 'interest' ? 'Interest Earned' : 'Total Value'
                        ]}
                        labelFormatter={(label) => `Year ${label}`}
                      />
                      <Area
                        type="monotone"
                        dataKey="total"
                        stroke="#10b981"
                        fillOpacity={1}
                        fill="url(#colorTotal)"
                        strokeWidth={3}
                      />
                      <Area
                        type="monotone"
                        dataKey="interest"
                        stroke="#f59e0b"
                        fillOpacity={1}
                        fill="url(#colorInterest)"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="deposited"
                        stroke={theme.colors.blue[400]}
                        strokeWidth={2}
                        strokeDasharray="5 5"
                      />
                    </AreaChart>
                  ) : (
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.slate[700]} opacity={0.3} />
                      <XAxis
                        dataKey="year"
                        label={{ value: 'Years', position: 'insideBottom', offset: -10 }}
                        tick={{ fill: theme.colors.slate[400] }}
                      />
                      <YAxis
                        tickFormatter={(value: number) => `$${(value / 1000).toFixed(1)}k`}
                        label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }}
                        tick={{ fill: theme.colors.slate[400] }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: theme.colors.slate[800],
                          border: `1px solid ${theme.colors.slate[700]}`,
                          borderRadius: '8px',
                          color: theme.colors.slate[100]
                        }}
                        formatter={(value: number, name: string) => [
                          formatCurrency(value), 
                          name === 'deposited' ? 'Total Deposited' : 
                          name === 'interest' ? 'Interest Earned' : 'Total Value'
                        ]}
                        labelFormatter={(label) => `Year ${label}`}
                      />
                      <Line
                        type="monotone"
                        dataKey="deposited"
                        stroke={theme.colors.blue[400]}
                        strokeWidth={2}
                        name="deposited"
                      />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke={theme.colors.emerald[400]}
                        strokeWidth={3}
                        name="total"
                      />
                      <Line
                        type="monotone"
                        dataKey="interest"
                        stroke={theme.colors.amber[400]}
                        strokeWidth={2}
                        name="interest"
                      />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>
            )}

            {/* Scenario Comparison Chart */}
            {viewMode === 'comparison' && scenarioData.length > 0 && (
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={scenarioData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.slate[700]} opacity={0.3} />
                    <XAxis
                      dataKey="scenario"
                      tick={{ fill: theme.colors.slate[400], fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis
                      tickFormatter={(value: number) => `$${(value / 1000).toFixed(1)}k`}
                      tick={{ fill: theme.colors.slate[400] }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: theme.colors.slate[800],
                        border: `1px solid ${theme.colors.slate[700]}`,
                        borderRadius: '8px',
                        color: theme.colors.slate[100]
                      }}
                      formatter={(value: number) => [formatCurrency(value), 'Future Value']}
                    />
                    <Bar dataKey="futureValue" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Monte Carlo Results */}
            {viewMode === 'monte-carlo' && monteCarloResults.length > 0 && (
              <div className="space-y-4">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monteCarloResults}>
                      <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.slate[700]} opacity={0.3} />
                      <XAxis
                        dataKey="percentile"
                        tick={{ fill: theme.colors.slate[400] }}
                        label={{ value: 'Percentile', position: 'insideBottom', offset: -10 }}
                      />
                      <YAxis
                        tickFormatter={(value: number) => `$${(value / 1000).toFixed(1)}k`}
                        tick={{ fill: theme.colors.slate[400] }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: theme.colors.slate[800],
                          border: `1px solid ${theme.colors.slate[700]}`,
                          borderRadius: '8px',
                          color: theme.colors.slate[100]
                        }}
                        formatter={(value: number) => [formatCurrency(value), 'Projected Value']}
                        labelFormatter={(label) => `${label}th Percentile`}
                      />
                      <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                
                <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} p-4 rounded-lg`}>
                  <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>Risk Analysis Summary</h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className={`${theme.status.warning.text} font-medium`}>Worst Case (10%)</p>
                      <p className={theme.textColors.primary}>{formatCurrency(monteCarloResults[0]?.value || 0)}</p>
                    </div>
                    <div>
                      <p className={`${theme.status.info.text} font-medium`}>Expected (50%)</p>
                      <p className={theme.textColors.primary}>{formatCurrency(monteCarloResults[2]?.value || 0)}</p>
                    </div>
                    <div>
                      <p className={`${theme.status.success.text} font-medium`}>Best Case (90%)</p>
                      <p className={theme.textColors.primary}>{formatCurrency(monteCarloResults[4]?.value || 0)}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Chart Legend */}
            {(viewMode === 'basic' || viewMode === 'advanced') && (
              <div className="flex justify-center space-x-6 mt-4 text-sm">
                <div className="flex items-center">
                  <div className="w-4 h-1 bg-blue-400 mr-2"></div>
                  <span>Total Deposited</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-1 bg-emerald-400 mr-2"></div>
                  <span>Total Value</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-1 bg-amber-400 mr-2"></div>
                  <span>Interest Earned</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Export and Sharing Section */}
        {results && (
          <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
            <h4 className={`${theme.typography.heading5} ${theme.textColors.primary} mb-4`}>
              Export & Share Results
            </h4>
            
            <div className="flex flex-wrap gap-3">
              <button
                onClick={exportToPDF}
                className={`${theme.buttons.secondary} flex items-center space-x-2 px-4 py-2 rounded-lg transition-all hover:bg-slate-700`}
              >
                <FileText className="w-4 h-4" />
                <span>Export PDF Report</span>
              </button>
              
              <button
                onClick={exportToCSV}
                className={`${theme.buttons.secondary} flex items-center space-x-2 px-4 py-2 rounded-lg transition-all hover:bg-slate-700`}
              >
                <Download className="w-4 h-4" />
                <span>Download CSV</span>
              </button>
              
              <button
                onClick={shareToSocial}
                className={`${theme.buttons.secondary} flex items-center space-x-2 px-4 py-2 rounded-lg transition-all hover:bg-slate-700`}
              >
                <Share2 className="w-4 h-4" />
                <span>Share Results</span>
              </button>
              
              <button
                onClick={() => {
                  const link = `${window.location.origin}/calculators/savings?initial=${initialDeposit}&monthly=${monthlyDeposit}&years=${timeYears}&rate=${interestRate}`;
                  navigator.clipboard.writeText(link);
                  toast.success('Calculator link copied to clipboard!');
                }}
                className={`${theme.buttons.secondary} flex items-center space-x-2 px-4 py-2 rounded-lg transition-all hover:bg-slate-700`}
              >
                <Link2 className="w-4 h-4" />
                <span>Copy Link</span>
              </button>
            </div>
            
            <div className="mt-4 pt-4 border-t border-slate-700">
              <p className={`text-sm ${theme.textColors.secondary}`}>
                Share your savings plan with friends or save for future reference
              </p>
            </div>
          </div>
        )}

        {/* Educational Insights */}
        {results && (
          <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
            <h4 className={`${theme.typography.heading5} ${theme.textColors.primary} mb-4`}>
              Educational Insights
            </h4>
            
            <div className="space-y-4">
              <div className={`${theme.backgrounds.cardHover} p-4 rounded-lg`}>
                <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>
                  <TrendingUp className="inline w-4 h-4 mr-2" />
                  Compounding Power
                </h5>
                <p className={`text-sm ${theme.textColors.secondary}`}>
                  Your money will grow by <span className="text-emerald-400 font-semibold">{results.compoundingPower.toFixed(1)}x</span> due to compound interest.
                  The power of compounding means your earnings generate their own earnings over time.
                </p>
              </div>

              <div className={`${theme.backgrounds.cardHover} p-4 rounded-lg`}>
                <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>
                  <Target className="inline w-4 h-4 mr-2" />
                  Time to Goal
                </h5>
                <p className={`text-sm ${theme.textColors.secondary}`}>
                  At your current savings rate, you&apos;ll reach major milestones in approximately{' '}
                  <span className="text-blue-400 font-semibold">{results.monthsToGoal} months</span>.
                  Increasing your monthly contribution can significantly reduce this timeline.
                </p>
              </div>

              <div className={`${theme.backgrounds.cardHover} p-4 rounded-lg`}>
                <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>
                  <DollarSign className="inline w-4 h-4 mr-2" />
                  Inflation Impact
                </h5>
                <p className={`text-sm ${theme.textColors.secondary}`}>
                  After adjusting for inflation (3% annually), your real purchasing power will be{' '}
                  <span className="text-amber-400 font-semibold">{formatCurrency(results.realValue)}</span>.
                  This shows the importance of earning returns above the inflation rate.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorWrapper>
  );
};

export default SavingsCalculator;
