import { useState, useCallback, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useProgressStore } from '@/lib/store/progressStore';
import { formatCurrency } from '@/lib/utils/financial';
import {
  ViewMode,
  SavingsCalculatorProps,
  ChartDataPoint,
  BankRate,
  ScenarioComparison,
  MonteCarloResult,
  SavingsResults,
  PresetScenario,
  CalculatorResults
} from './types';
import {
  calculateSavings,
  generateChartData,
  generateScenarioComparisons,
  runMonteCarloSimulation,
  generateInsights,
  getMockBankRates
} from './utils';

export const useSavingsCalculator = (props: SavingsCalculatorProps = {}) => {
  const { recordCalculatorUsage } = useProgressStore();

  // Form inputs
  const [initialDeposit, setInitialDeposit] = useState(props.initialDeposit || '1000');
  const [monthlyDeposit, setMonthlyDeposit] = useState(props.monthlyDeposit || '100');
  const [interestRate, setInterestRate] = useState(props.interestRate || '4.5');
  const [timeYears, setTimeYears] = useState(props.timeYears || '5');
  const [showCelebration, setShowCelebration] = useState(false);
  const [lastCalculation, setLastCalculation] = useState<Date | null>(null);
  
  // Advanced features
  const [viewMode, setViewMode] = useState<ViewMode>('basic');
  const [liveBankRates, setLiveBankRates] = useState<BankRate[]>([]);
  const [inflationRate, setInflationRate] = useState(props.inflationRate || '3.2');
  const [monteCarloRuns] = useState(1000);
  const [riskProfile, setRiskProfile] = useState(props.riskProfile || 'moderate');

  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [scenarioData, setScenarioData] = useState<ScenarioComparison[]>([]);
  const [monteCarloResults, setMonteCarloResults] = useState<MonteCarloResult[]>([]);
  const [results, setResults] = useState<SavingsResults>({
    futureValue: 0,
    totalDeposited: 0,
    interestEarned: 0,
    effectiveRate: 0,
    realValue: 0,
    monthsToGoal: 0,
    compoundingPower: 0
  });

  // Fetch live banking rates
  const fetchLiveBankRates = useCallback(async () => {
    try {
      // In production, this would call real banking APIs
      const mockRates = getMockBankRates();
      setLiveBankRates(mockRates);
    } catch {
      console.warn('Failed to fetch live rates, using defaults');
    }
  }, []);

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

  const calculateResults = useCallback(() => {
    const initial = parseFloat(initialDeposit) || 0;
    const monthly = parseFloat(monthlyDeposit) || 0;
    const rate = parseFloat(interestRate) || 0;
    const years = parseInt(timeYears) || 0;
    const inflation = parseFloat(inflationRate) || 0;

    if (initial < 0 || monthly < 0 || rate < 0 || years < 0) return;

    const newResults = calculateSavings(initial, monthly, rate, years, inflation);
    setResults(newResults);

    // Generate chart data
    const data = generateChartData(initial, monthly, rate, years);
    setChartData(data);

    // Trigger celebration for significant milestones
    const now = new Date();
    if (lastCalculation === null || now.getTime() - lastCalculation.getTime() > 2000) {
      if (newResults.futureValue >= 100000 && rate >= 4) {
        setShowCelebration(true);
        toast.success('🎉 Amazing! You\'re on track to build serious wealth with high-yield savings!', {
          duration: 4000,
          position: 'top-center',
        });
        setTimeout(() => setShowCelebration(false), 3000);
      } else if (newResults.interestEarned >= 10000) {
        toast.success('💰 Excellent! You\'ll earn over $10,000 in interest!', {
          duration: 3000,
          position: 'top-center',
        });
      }
      setLastCalculation(now);
    }
  }, [initialDeposit, monthlyDeposit, interestRate, timeYears, inflationRate, lastCalculation]);

  useEffect(() => {
    recordCalculatorUsage('savings-calculator');
  }, [recordCalculatorUsage]);

  useEffect(() => {
    calculateResults();
  }, [calculateResults]);

  useEffect(() => {
    fetchLiveBankRates();
  }, [fetchLiveBankRates]);

  useEffect(() => {
    if (viewMode === 'comparison') {
      const initial = parseFloat(initialDeposit) || 0;
      const monthly = parseFloat(monthlyDeposit) || 0;
      const years = parseInt(timeYears) || 0;
      const scenarios = generateScenarioComparisons(initial, monthly, years);
      setScenarioData(scenarios);
    }
  }, [viewMode, initialDeposit, monthlyDeposit, timeYears]);

  useEffect(() => {
    if (viewMode === 'monte-carlo') {
      const initial = parseFloat(initialDeposit) || 0;
      const monthly = parseFloat(monthlyDeposit) || 0;
      const rate = parseFloat(interestRate) || 0;
      const years = parseInt(timeYears) || 0;
      const results = runMonteCarloSimulation(initial, monthly, rate, years, riskProfile, monteCarloRuns);
      setMonteCarloResults(results);
    }
  }, [viewMode, initialDeposit, monthlyDeposit, interestRate, timeYears, riskProfile, monteCarloRuns]);

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
    const shareText = `💰 My savings plan: ${formatCurrency(results.futureValue)} in ${timeYears} years with ${interestRate}% APY!`;
    
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

  const applyPreset = (preset: PresetScenario) => {
    setInitialDeposit(preset.initial.toString());
    setMonthlyDeposit(preset.monthly.toString());
    setInterestRate(preset.rate.toString());
    setTimeYears(preset.years.toString());
  };

  const getCalculatorResults = (): CalculatorResults => ({
    primary: {
      label: 'Future Value',
      value: results.futureValue,
      format: 'currency',
      variant: 'success',
      description: `Your money after ${timeYears} years of growth`
    },
    secondary: [
      {
        label: 'Total Deposited',
        value: results.totalDeposited,
        format: 'currency',
        description: 'All your contributions over time'
      },
      {
        label: 'Interest Earned',
        value: results.interestEarned,
        format: 'currency',
        variant: 'success',
        description: 'Free money from compound interest'
      },
      {
        label: 'Effective Annual Return',
        value: results.effectiveRate,
        format: 'percentage',
        description: 'Your average yearly growth rate'
      }
    ]
  });

  return {
    // State
    initialDeposit,
    monthlyDeposit,
    interestRate,
    timeYears,
    showCelebration,
    viewMode,
    liveBankRates,
    inflationRate,
    riskProfile,
    chartData,
    scenarioData,
    monteCarloResults,
    results,

    // Setters
    setInitialDeposit,
    setMonthlyDeposit,
    setInterestRate,
    setTimeYears,
    setViewMode,
    setInflationRate,
    setRiskProfile,

    // Actions
    handleReset,
    shareResults,
    applyPreset,
    exportToPDF,
    exportToCSV,
    shareToSocial,

    // Computed
    insights: generateInsights(
      parseFloat(interestRate) || 0,
      parseInt(timeYears) || 0,
      parseFloat(monthlyDeposit) || 0,
      results
    ),
    calculatorResults: getCalculatorResults()
  };
};

