import { ChartDataPoint, SavingsResults, ScenarioComparison, MonteCarloResult, Insight } from './types';

export const calculateSavings = (
  initialDeposit: number,
  monthlyDeposit: number,
  interestRate: number,
  years: number,
  inflationRate: number
): SavingsResults => {
  if (initialDeposit < 0 || monthlyDeposit < 0 || interestRate < 0 || years < 0) {
    throw new Error('Invalid input: negative values are not allowed');
  }

  const monthlyRate = interestRate / 100 / 12;
  const totalMonths = years * 12;

  // Calculate future value of initial deposit (lump sum)
  const initialDepositFV = initialDeposit * Math.pow(1 + monthlyRate, totalMonths);

  // Calculate future value of monthly deposits (annuity)
  let monthlyDepositsFV = 0;
  if (monthlyRate === 0) {
    monthlyDepositsFV = monthlyDeposit * totalMonths;
  } else {
    monthlyDepositsFV = monthlyDeposit * (Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate;
  }

  const totalFutureValue = initialDepositFV + monthlyDepositsFV;
  const totalDeposited = initialDeposit + (monthlyDeposit * totalMonths);
  const totalInterestEarned = totalFutureValue - totalDeposited;
  
  // Calculate inflation-adjusted real value
  const inflationRateDecimal = inflationRate / 100;
  const realValue = totalFutureValue / Math.pow(1 + inflationRateDecimal, years);
  
  // Calculate compounding power (how much compound interest contributed)
  const simpleInterestValue = totalDeposited * (1 + interestRate * years);
  const compoundingPower = totalFutureValue - simpleInterestValue;
  
  // Calculate months to reach common goals
  const emergencyGoal = monthlyDeposit * 6; // 6 months expenses
  const monthsToGoal = emergencyGoal > 0 ? Math.ceil(emergencyGoal / monthlyDeposit) : 0;

  return {
    futureValue: totalFutureValue,
    totalDeposited: totalDeposited,
    interestEarned: totalInterestEarned,
    effectiveRate: years > 0 ? ((totalFutureValue / totalDeposited - 1) / years) * 100 : 0,
    realValue: realValue,
    monthsToGoal: monthsToGoal,
    compoundingPower: compoundingPower
  };
};

export const generateChartData = (
  initialDeposit: number,
  monthlyDeposit: number,
  interestRate: number,
  years: number
): ChartDataPoint[] => {
  const monthlyRate = interestRate / 100 / 12;
  const data: ChartDataPoint[] = [];

  for (let year = 0; year <= years; year++) {
    const yearMonths = year * 12;

    const yearInitialFV = year === 0 ? initialDeposit :
      initialDeposit * Math.pow(1 + monthlyRate, yearMonths);

    let yearMonthlyFV = 0;
    if (year > 0) {
      if (monthlyRate === 0) {
        yearMonthlyFV = monthlyDeposit * yearMonths;
      } else {
        yearMonthlyFV = monthlyDeposit * (Math.pow(1 + monthlyRate, yearMonths) - 1) / monthlyRate;
      }
    }

    const yearTotalDeposited = initialDeposit + (monthlyDeposit * yearMonths);
    const yearTotalValue = yearInitialFV + yearMonthlyFV;

    data.push({
      year,
      deposited: yearTotalDeposited,
      total: yearTotalValue,
      interest: yearTotalValue - yearTotalDeposited
    });
  }

  return data;
};

export const generateScenarioComparisons = (
  initialDeposit: number,
  monthlyDeposit: number,
  years: number
): ScenarioComparison[] => {
  const scenarios: ScenarioComparison[] = [];
  
  const scenarioConfigs = [
    { name: 'Big Bank (0.01%)', rate: 0.01, color: '#ef4444' },
    { name: 'Credit Union (2.5%)', rate: 2.5, color: '#f97316' },
    { name: 'Online Bank (4.5%)', rate: 4.5, color: '#10b981' },
    { name: 'Best Rate (5.2%)', rate: 5.2, color: '#3b82f6' }
  ];
  
  scenarioConfigs.forEach(config => {
    const monthlyRate = config.rate / 100 / 12;
    const totalMonths = years * 12;
    
    const initialFV = initialDeposit * Math.pow(1 + monthlyRate, totalMonths);
    const monthlyFV = monthlyRate === 0 ? monthlyDeposit * totalMonths :
      monthlyDeposit * (Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate;
    
    const futureValue = initialFV + monthlyFV;
    const totalDeposited = initialDeposit + (monthlyDeposit * totalMonths);
    const interestEarned = futureValue - totalDeposited;
    
    scenarios.push({
      scenario: config.name,
      futureValue,
      totalDeposited,
      interestEarned,
      color: config.color
    });
  });
  
  return scenarios;
};

export const runMonteCarloSimulation = (
  initialDeposit: number,
  monthlyDeposit: number,
  baseRate: number,
  years: number,
  riskProfile: 'conservative' | 'moderate' | 'aggressive',
  runs: number = 1000
): MonteCarloResult[] => {
  const results: number[] = [];
  
  // Risk profile determines volatility
  const volatility = riskProfile === 'conservative' ? 0.5 : 
                    riskProfile === 'moderate' ? 1.0 : 1.5;
  
  for (let i = 0; i < runs; i++) {
    let currentValue = initialDeposit;
    
    for (let year = 0; year < years; year++) {
      // Add random variation to interest rate
      const randomRate = baseRate + (Math.random() - 0.5) * volatility;
      const effectiveRate = Math.max(0, randomRate / 100); // Don't allow negative rates
      
      // Compound existing value
      currentValue *= (1 + effectiveRate);
      
      // Add monthly deposits with compounding
      for (let month = 0; month < 12; month++) {
        currentValue += monthlyDeposit;
        currentValue *= (1 + effectiveRate / 12);
      }
    }
    
    results.push(currentValue);
  }
  
  results.sort((a, b) => a - b);
  
  return [
    { percentile: 10, value: results[Math.floor(results.length * 0.1)] },
    { percentile: 25, value: results[Math.floor(results.length * 0.25)] },
    { percentile: 50, value: results[Math.floor(results.length * 0.5)] },
    { percentile: 75, value: results[Math.floor(results.length * 0.75)] },
    { percentile: 90, value: results[Math.floor(results.length * 0.9)] }
  ];
};

export const generateInsights = (
  interestRate: number,
  years: number,
  monthlyDeposit: number,
  results: SavingsResults
): Insight[] => {
  const insights: Insight[] = [];
  
  // Low interest rate warning
  if (interestRate < 1) {
    insights.push({
      type: 'warning',
      title: 'Very Low Interest Rate',
      message: `At ${interestRate}% interest, you're barely beating inflation. Consider high-yield savings accounts offering 4-5% APY.`
    });
  }

  // Great rate insight
  if (interestRate >= 4) {
    insights.push({
      type: 'success',
      title: 'Excellent Savings Rate',
      message: `Your ${interestRate}% rate is competitive! You'll earn $${results.interestEarned.toFixed(2)} in interest over ${years} years.`
    });
  }

  // Emergency fund goal insight
  if (monthlyDeposit >= 300 && years <= 3) {
    const emergencyFund = monthlyDeposit * 6; // 6 months of expenses
    insights.push({
      type: 'info',
      title: 'Emergency Fund Progress',
      message: `At $${monthlyDeposit}/month, you could build a $${emergencyFund} emergency fund in ${Math.ceil(emergencyFund / monthlyDeposit)} months.`
    });
  }

  // Big vs online bank comparison
  if (interestRate > 0.5) {
    const bigBankInterest = results.totalDeposited * 0.0001 * years;
    const savings = results.interestEarned - bigBankInterest;
    if (savings > 100) {
      insights.push({
        type: 'success',
        title: 'Smart Banking Choice',
        message: `Compared to big banks (0.01% APY), you'll earn $${savings.toFixed(2)} more with your current rate!`
      });
    }
  }

  return insights;
};

export const getMockBankRates = (): { bank: string; type: string; apy: number; lastUpdated: string }[] => {
  return [
    { bank: 'Marcus by Goldman Sachs', type: 'High-Yield Savings', apy: 4.50, lastUpdated: new Date().toISOString() },
    { bank: 'Ally Bank', type: 'Online Savings', apy: 4.25, lastUpdated: new Date().toISOString() },
    { bank: 'Capital One 360', type: 'Performance Savings', apy: 4.30, lastUpdated: new Date().toISOString() },
    { bank: 'Discover Bank', type: 'Online Savings', apy: 4.35, lastUpdated: new Date().toISOString() },
    { bank: 'American Express', type: 'Personal Savings', apy: 4.25, lastUpdated: new Date().toISOString() },
    { bank: 'Chase Bank', type: 'Traditional Savings', apy: 0.01, lastUpdated: new Date().toISOString() },
    { bank: 'Bank of America', type: 'Advantage Savings', apy: 0.02, lastUpdated: new Date().toISOString() },
    { bank: 'Wells Fargo', type: 'Way2Save', apy: 0.05, lastUpdated: new Date().toISOString() }
  ];
};

