'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import {
  Heart,
  TrendingUp,
  DollarSign,
  Activity,
  Target,
  Info
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface LifeExpectancyFactors {
  baseAge: number;
  gender: 'male' | 'female';
  smoker: boolean;
  exercise: 'none' | 'light' | 'moderate' | 'heavy';
  diet: 'poor' | 'average' | 'good' | 'excellent';
  familyHistory: 'poor' | 'average' | 'good' | 'excellent';
  stress: 'high' | 'moderate' | 'low';
  income: 'low' | 'middle' | 'high';
  education: 'high-school' | 'college' | 'graduate';
}

interface LongevityProjection {
  age: number;
  survivalProbability: number;
  portfolioNeeded: number;
  totalWithdrawals: number;
  medianOutcome: number;
  percentile25: number;
  percentile75: number;
}

const LongevityRiskAnalyzer: React.FC = () => {
  const { recordCalculatorUsage } = useProgressStore();
  
  const [currentAge, setCurrentAge] = useState<number>(45);
  const [retirementAge, setRetirementAge] = useState<number>(65);
  const [currentPortfolio, setCurrentPortfolio] = useState<number>(500000);
  const [annualSavings, setAnnualSavings] = useState<number>(50000);
  const [desiredIncome, setDesiredIncome] = useState<number>(80000);
  const [inflationRate] = useState<number>(3);
  const [portfolioReturn, setPortfolioReturn] = useState<number>(7);

  // Validation state
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Validation function
  const validateInput = (field: string, value: number, min: number, max: number) => {
    const newErrors = { ...validationErrors };
    
    if (value < min || value > max) {
      newErrors[field] = `Value must be between ${min} and ${max}`;
    } else {
      delete newErrors[field];
    }
    
    setValidationErrors(newErrors);
  };

  const [factors, setFactors] = useState<LifeExpectancyFactors>({
    baseAge: 80,
    gender: 'male',
    smoker: false,
    exercise: 'moderate',
    diet: 'good',
    familyHistory: 'good',
    stress: 'moderate',
    income: 'middle',
    education: 'college'
  });

  const [projections, setProjections] = useState<LongevityProjection[]>([]);
  const [adjustedLifeExpectancy, setAdjustedLifeExpectancy] = useState<number>(80);

  useEffect(() => {
    recordCalculatorUsage('longevity-risk-analyzer');
  }, [recordCalculatorUsage]);

  useEffect(() => {
    calculateAdjustedLifeExpectancy();
  }, [factors]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    calculateProjections();
  }, [currentAge, retirementAge, currentPortfolio, annualSavings, desiredIncome, inflationRate, portfolioReturn, adjustedLifeExpectancy]); // eslint-disable-line react-hooks/exhaustive-deps

  const calculateAdjustedLifeExpectancy = useCallback(() => {
    let adjustedAge = factors.baseAge;
    
    // Gender adjustment (women live longer on average)
    if (factors.gender === 'female') {
      adjustedAge += 5;
    }
    
    // Smoking (major negative impact)
    if (factors.smoker) {
      adjustedAge -= 10;
    }
    
    // Exercise
    const exerciseAdjustments = {
      'none': -3,
      'light': 0,
      'moderate': 2,
      'heavy': 4
    };
    adjustedAge += exerciseAdjustments[factors.exercise];
    
    // Diet
    const dietAdjustments = {
      'poor': -3,
      'average': 0,
      'good': 2,
      'excellent': 4
    };
    adjustedAge += dietAdjustments[factors.diet];
    
    // Family history
    const familyAdjustments = {
      'poor': -4,
      'average': 0,
      'good': 2,
      'excellent': 5
    };
    adjustedAge += familyAdjustments[factors.familyHistory];
    
    // Stress
    const stressAdjustments = {
      'high': -2,
      'moderate': 0,
      'low': 2
    };
    adjustedAge += stressAdjustments[factors.stress];
    
    // Income (correlated with healthcare access)
    const incomeAdjustments = {
      'low': -2,
      'middle': 0,
      'high': 3
    };
    adjustedAge += incomeAdjustments[factors.income];
    
    // Education (correlated with health awareness)
    const educationAdjustments = {
      'high-school': 0,
      'college': 1,
      'graduate': 2
    };
    adjustedAge += educationAdjustments[factors.education];
    
    setAdjustedLifeExpectancy(Math.max(65, Math.round(adjustedAge)));
  }, [factors]);

  const calculateProjections = useCallback(() => {
    const yearsToRetirement = retirementAge - currentAge;
    const portfolioAtRetirement = currentPortfolio * Math.pow(1 + portfolioReturn/100, yearsToRetirement) +
      (annualSavings * (Math.pow(1 + portfolioReturn/100, yearsToRetirement) - 1) / (portfolioReturn/100));

    const newProjections: LongevityProjection[] = [];

    // Calculate projections for different life expectancies
    for (let age = retirementAge + 5; age <= Math.min(adjustedLifeExpectancy + 20, 110); age += 5) {
      const yearsInRetirement = age - retirementAge;
      const survivalProbability = calculateSurvivalProbability(age);
      
      // Calculate required portfolio for this lifespan
      const inflationAdjustedIncome = desiredIncome * Math.pow(1 + inflationRate/100, yearsToRetirement);
      const totalWithdrawals = calculateTotalWithdrawals(inflationAdjustedIncome, yearsInRetirement);
      const portfolioNeeded = calculateRequiredPortfolio(inflationAdjustedIncome, yearsInRetirement);
      
      // Monte Carlo simulation for percentiles
      const outcomes = runMonteCarloSimulation(portfolioAtRetirement, inflationAdjustedIncome, yearsInRetirement, 1000);
      outcomes.sort((a, b) => a - b);
      
      newProjections.push({
        age,
        survivalProbability,
        portfolioNeeded,
        totalWithdrawals,
        medianOutcome: outcomes[Math.floor(outcomes.length * 0.5)],
        percentile25: outcomes[Math.floor(outcomes.length * 0.25)],
        percentile75: outcomes[Math.floor(outcomes.length * 0.75)]
      });
    }

    setProjections(newProjections);
  }, [retirementAge, currentAge, currentPortfolio, portfolioReturn, annualSavings, adjustedLifeExpectancy, desiredIncome, inflationRate]); // eslint-disable-line react-hooks/exhaustive-deps

  const calculateSurvivalProbability = useCallback((targetAge: number): number => {
    // Simplified survival probability based on adjusted life expectancy
    const yearsFromExpected = targetAge - adjustedLifeExpectancy;
    
    if (yearsFromExpected <= 0) {
      return Math.max(50, 90 + yearsFromExpected * 5); // Higher probability for ages before expected
    } else {
      return Math.max(5, 50 - yearsFromExpected * 8); // Lower probability for ages after expected
    }
  }, [adjustedLifeExpectancy]);

  const calculateRequiredPortfolio = useCallback((annualIncome: number, years: number): number => {
    // Present value of annuity calculation
    const realReturn = (portfolioReturn - inflationRate) / 100;
    if (realReturn <= 0) {
      return annualIncome * years;
    }
    return annualIncome * (1 - Math.pow(1 + realReturn, -years)) / realReturn;
  }, [portfolioReturn, inflationRate]);

  const calculateTotalWithdrawals = useCallback((initialIncome: number, years: number): number => {
    let total = 0;
    for (let year = 0; year < years; year++) {
      total += initialIncome * Math.pow(1 + inflationRate/100, year);
    }
    return total;
  }, [inflationRate]);

  const runMonteCarloSimulation = useCallback((initialPortfolio: number, annualIncome: number, years: number, simulations: number): number[] => {
    const outcomes: number[] = [];
    
    for (let sim = 0; sim < simulations; sim++) {
      let portfolio = initialPortfolio;
      let income = annualIncome;
      
      for (let year = 0; year < years; year++) {
        // Random return (normal distribution approximation)
        const randomReturn = portfolioReturn + (Math.random() - 0.5) * 30; // ±15% volatility
        portfolio = portfolio * (1 + randomReturn/100) - income;
        income *= (1 + inflationRate/100);
        
        if (portfolio <= 0) {
          break;
        }
      }
      
      outcomes.push(Math.max(0, portfolio));
    }
    
    return outcomes;
  }, [portfolioReturn, inflationRate]);

  const chartData = useMemo(() => {
    return projections.map(proj => ({
      age: proj.age,
      'Survival Probability': proj.survivalProbability,
      'Portfolio Required (M)': proj.portfolioNeeded / 1000000,
      '25th Percentile': proj.percentile25 / 1000000,
      'Median Outcome': proj.medianOutcome / 1000000,
      '75th Percentile': proj.percentile75 / 1000000
    }));
  }, [projections]);

  const getLifeExpectancyColor = (age: number) => {
    if (age >= adjustedLifeExpectancy + 5) return theme.status.success.text;
    if (age >= adjustedLifeExpectancy) return theme.status.warning.text;
    return theme.status.error.text;
  };

  return (
    <div className={`p-6 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
      <header className="flex items-center gap-3 mb-6">
        <Heart className="w-6 h-6 text-red-400" aria-hidden="true" />
        <h1 className={`text-xl font-bold ${theme.textColors.primary}`}>
          Longevity Risk Analyzer
        </h1>
      </header>

      {/* Life Expectancy Factors */}
      <section className="mb-8">
        <h2 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
          <Activity className="w-5 h-5" aria-hidden="true" />
          Life Expectancy Factors
        </h2>
        
        <form className="grid grid-cols-1 md:grid-cols-3 gap-6" role="group" aria-labelledby="longevity-factors">
          <div className="space-y-4">
            <div>
              <label htmlFor="base-age-input" className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                Base Age
              </label>
              <input
                id="base-age-input"
                type="number"
                value={factors.baseAge}
                onChange={(e) => setFactors({...factors, baseAge: Number(e.target.value)})}
                className={`w-full px-3 py-2 border rounded-lg ${theme.backgrounds.card} ${theme.textColors.primary}`}
                min="65"
                max="100"
                aria-describedby="base-age-help"
              />
              <span id="base-age-help" className="sr-only">
                Enter your anticipated base life expectancy age between 65 and 100 years
              </span>
            </div>

            <div>
              <label htmlFor="gender-select" className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                Gender
              </label>
              <select
                id="gender-select"
                value={factors.gender}
                onChange={(e) => setFactors({...factors, gender: e.target.value as 'male' | 'female'})}
                className={`w-full px-3 py-2 border rounded-lg ${theme.backgrounds.card} ${theme.textColors.primary}`}
                aria-describedby="gender-help"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <span id="gender-help" className="sr-only">
                Gender affects life expectancy calculations based on statistical data
              </span>
            </div>

            <div>
              <label htmlFor="smoking-select" className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                Smoking Status
              </label>
              <select
                id="smoking-select"
                value={factors.smoker.toString()}
                onChange={(e) => setFactors({...factors, smoker: e.target.value === 'true'})}
                className={`w-full px-3 py-2 border rounded-lg ${theme.backgrounds.card} ${theme.textColors.primary}`}
                aria-describedby="smoking-help"
              >
                <option value="false">Non-smoker</option>
                <option value="true">Smoker</option>
              </select>
              <span id="smoking-help" className="sr-only">
                Smoking significantly impacts life expectancy calculations
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="exercise-select" className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                Exercise Level
              </label>
              <select
                id="exercise-select"
                value={factors.exercise}
                onChange={(e) => setFactors({...factors, exercise: e.target.value as LifeExpectancyFactors['exercise']})}
                className={`w-full px-3 py-2 border rounded-lg ${theme.backgrounds.card} ${theme.textColors.primary}`}
                aria-describedby="exercise-help"
              >
                <option value="none">None</option>
                <option value="light">Light (1-2 days/week)</option>
                <option value="moderate">Moderate (3-4 days/week)</option>
                <option value="heavy">Heavy (5+ days/week)</option>
              </select>
              <span id="exercise-help" className="sr-only">
                Regular exercise can significantly improve life expectancy
              </span>
            </div>

            <div>
              <label htmlFor="diet-select" className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                Diet Quality
              </label>
              <select
                id="diet-select"
                value={factors.diet}
                onChange={(e) => setFactors({...factors, diet: e.target.value as LifeExpectancyFactors['diet']})}
                className={`w-full px-3 py-2 border rounded-lg ${theme.backgrounds.card} ${theme.textColors.primary}`}
                aria-describedby="diet-help"
              >
                <option value="poor">Poor</option>
                <option value="average">Average</option>
                <option value="good">Good</option>
                <option value="excellent">Excellent</option>
              </select>
              <span id="diet-help" className="sr-only">
                Healthy diet contributes to increased longevity
              </span>
            </div>

            <div>
              <label htmlFor="family-history-select" className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                Family History
              </label>
              <select
                id="family-history-select"
                value={factors.familyHistory}
                onChange={(e) => setFactors({...factors, familyHistory: e.target.value as LifeExpectancyFactors['familyHistory']})}
                className={`w-full px-3 py-2 border rounded-lg ${theme.backgrounds.card} ${theme.textColors.primary}`}
                aria-describedby="family-history-help"
              >
                <option value="poor">Poor longevity</option>
                <option value="average">Average longevity</option>
                <option value="good">Good longevity</option>
                <option value="excellent">Excellent longevity</option>
              </select>
              <span id="family-history-help" className="sr-only">
                Family history of longevity is a strong genetic predictor
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="stress-select" className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                Stress Level
              </label>
              <select
                id="stress-select"
                value={factors.stress}
                onChange={(e) => setFactors({...factors, stress: e.target.value as LifeExpectancyFactors['stress']})}
                className={`w-full px-3 py-2 border rounded-lg ${theme.backgrounds.card} ${theme.textColors.primary}`}
                aria-describedby="stress-help"
              >
                <option value="high">High stress</option>
                <option value="moderate">Moderate stress</option>
                <option value="low">Low stress</option>
              </select>
              <span id="stress-help" className="sr-only">
                Chronic stress can negatively impact longevity
              </span>
            </div>

            <div>
              <label htmlFor="income-select" className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                Income Level
              </label>
              <select
                id="income-select"
                value={factors.income}
                onChange={(e) => setFactors({...factors, income: e.target.value as LifeExpectancyFactors['income']})}
                className={`w-full px-3 py-2 border rounded-lg ${theme.backgrounds.card} ${theme.textColors.primary}`}
                aria-describedby="income-help"
              >
                <option value="low">Low income</option>
                <option value="middle">Middle income</option>
                <option value="high">High income</option>
              </select>
              <span id="income-help" className="sr-only">
                Higher income is associated with better healthcare access and longevity
              </span>
            </div>

            <div>
              <label htmlFor="education-select" className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                Education Level
              </label>
              <select
                id="education-select"
                value={factors.education}
                onChange={(e) => setFactors({...factors, education: e.target.value as LifeExpectancyFactors['education']})}
                className={`w-full px-3 py-2 border rounded-lg ${theme.backgrounds.card} ${theme.textColors.primary}`}
                aria-describedby="education-help"
              >
                <option value="high-school">High School</option>
                <option value="college">College</option>
                <option value="graduate">Graduate Degree</option>
              </select>
              <span id="education-help" className="sr-only">
                Higher education levels correlate with increased life expectancy
              </span>
            </div>
          </div>
        </form>

        <div className={`mt-6 p-4 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg text-center`} role="status" aria-live="polite">
          <div className={`text-2xl font-bold ${theme.status.info.text} mb-1`}>
            {adjustedLifeExpectancy} years
          </div>
          <div className={`text-sm ${theme.textColors.secondary}`}>Adjusted Life Expectancy</div>
        </div>
      </section>

      {/* Financial Parameters */}
      <section className="mb-8">
        <h2 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
          <DollarSign className="w-5 h-5" aria-hidden="true" />
          Financial Parameters
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="current-age-longevity" className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
              Current Age
            </label>
            <input
              id="current-age-longevity"
              type="number"
              value={currentAge}
              onChange={(e) => {
                const value = Number(e.target.value);
                setCurrentAge(value);
                validateInput('currentAge', value, 18, 80);
              }}
              onBlur={() => {
                validateInput('currentAge', currentAge, 18, 80);
              }}
              className={`w-full px-3 py-2 border rounded-lg ${theme.backgrounds.card} ${theme.textColors.primary}`}
              min="18"
              max="80"
              aria-describedby="current-age-longevity-help"
              {...(validationErrors.currentAge ? { "aria-invalid": "true" } : {})}
            />
            {validationErrors.currentAge && (
              <div className="text-red-500 text-xs mt-1" role="alert">
                {validationErrors.currentAge}
              </div>
            )}
            <span id="current-age-longevity-help" className="sr-only">
              Enter your current age for longevity analysis calculations
            </span>
          </div>

          <div>
            <label htmlFor="retirement-age-longevity" className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
              Retirement Age
            </label>
            <input
              id="retirement-age-longevity"
              type="number"
              value={retirementAge}
              onChange={(e) => {
                const value = Number(e.target.value);
                setRetirementAge(value);
                validateInput('retirementAge', value, 50, 80);
              }}
              onBlur={() => {
                validateInput('retirementAge', retirementAge, 50, 80);
              }}
              className={`w-full px-3 py-2 border rounded-lg ${theme.backgrounds.card} ${theme.textColors.primary}`}
              min="50"
              max="80"
              aria-describedby="retirement-age-longevity-help"
              {...(validationErrors.retirementAge ? { "aria-invalid": "true" } : {})}
            />
            {validationErrors.retirementAge && (
              <div className="text-red-500 text-xs mt-1" role="alert">
                {validationErrors.retirementAge}
              </div>
            )}
            <span id="retirement-age-longevity-help" className="sr-only">
              Enter your planned retirement age
            </span>
          </div>

          <div>
            <label htmlFor="current-portfolio-longevity" className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
              Current Portfolio
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
              <input
                id="current-portfolio-longevity"
                type="number"
                value={currentPortfolio}
                onChange={(e) => setCurrentPortfolio(Number(e.target.value))}
                className={`pl-10 w-full px-3 py-2 border rounded-lg ${theme.backgrounds.card} ${theme.textColors.primary}`}
                min="0"
                step="10000"
                aria-describedby="current-portfolio-longevity-help"
              />
              <span id="current-portfolio-longevity-help" className="sr-only">
                Enter your current retirement portfolio value in dollars
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="annual-savings-longevity" className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
              Annual Savings
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
              <input
                id="annual-savings-longevity"
                type="number"
                value={annualSavings}
                onChange={(e) => setAnnualSavings(Number(e.target.value))}
                className={`pl-10 w-full px-3 py-2 border rounded-lg ${theme.backgrounds.card} ${theme.textColors.primary}`}
                min="0"
                step="5000"
                aria-describedby="annual-savings-longevity-help"
              />
              <span id="annual-savings-longevity-help" className="sr-only">
                Enter your annual retirement savings contribution
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="desired-income-longevity" className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
              Desired Retirement Income
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" aria-hidden="true" />
              <input
                id="desired-income-longevity"
                type="number"
                value={desiredIncome}
                onChange={(e) => setDesiredIncome(Number(e.target.value))}
                className={`pl-10 w-full px-3 py-2 border rounded-lg ${theme.backgrounds.card} ${theme.textColors.primary}`}
                min="0"
                step="5000"
                aria-describedby="desired-income-longevity-help"
              />
              <span id="desired-income-longevity-help" className="sr-only">
                Enter your desired annual retirement income in today&apos;s dollars
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="portfolio-return-longevity" className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
              Expected Portfolio Return (%)
            </label>
            <input
              id="portfolio-return-longevity"
              type="number"
              value={portfolioReturn}
              onChange={(e) => setPortfolioReturn(Number(e.target.value))}
              className={`w-full px-3 py-2 border rounded-lg ${theme.backgrounds.card} ${theme.textColors.primary}`}
              min="0"
              max="15"
              step="0.1"
              aria-describedby="portfolio-return-longevity-help"
            />
            <span id="portfolio-return-longevity-help" className="sr-only">
              Enter expected annual portfolio return as a percentage
            </span>
          </div>
        </div>
      </section>

      {/* Longevity Risk Chart */}
      {chartData.length > 0 && (
        <div className="mb-8">
          <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
            <TrendingUp className="w-5 h-5" />
            Longevity Risk Analysis
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`p-4 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
              <h4 className={`font-medium ${theme.textColors.primary} mb-3`}>Survival Probability by Age</h4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="age" 
                    stroke="#9CA3AF"
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F3F4F6'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Survival Probability" 
                    stroke="#EF4444" 
                    strokeWidth={3}
                    dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className={`p-4 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
              <h4 className={`font-medium ${theme.textColors.primary} mb-3`}>Portfolio Outcomes</h4>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="age" 
                    stroke="#9CA3AF"
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#F3F4F6'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="75th Percentile"
                    stackId="1"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.3}
                  />
                  <Area
                    type="monotone"
                    dataKey="25th Percentile"
                    stackId="2"
                    stroke="#F59E0B"
                    fill="#F59E0B"
                    fillOpacity={0.3}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Median Outcome" 
                    stroke="#3B82F6" 
                    strokeWidth={3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Risk Assessment Summary */}
      <div className="mb-8">
        <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
          <Target className="w-5 h-5" />
          Longevity Risk Assessment
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {projections.slice(0, 3).map((projection, index) => (
            <div key={index} className={`p-4 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
              <div className={`text-lg font-bold ${getLifeExpectancyColor(projection.age)} mb-1`}>
                Age {projection.age}
              </div>
              <div className={`text-sm ${theme.textColors.secondary} mb-2`}>
                {projection.survivalProbability.toFixed(1)}% survival probability
              </div>
              <div className={`text-sm ${theme.textColors.primary}`}>
                Portfolio needed: ${(projection.portfolioNeeded / 1000000).toFixed(1)}M
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Educational Content */}
      <div className={`p-4 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg`}>
        <h4 className={`font-semibold ${theme.textColors.primary} mb-3 flex items-center gap-2`}>
          <Info className="w-4 h-4" />
          Understanding Longevity Risk
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>Risk Factors:</h5>
            <ul className={`space-y-1 ${theme.textColors.secondary}`}>
              <li>• Outliving your retirement savings</li>
              <li>• Healthcare cost inflation</li>
              <li>• Long-term care expenses</li>
              <li>• Market volatility in retirement</li>
            </ul>
          </div>
          <div>
            <h5 className={`font-medium ${theme.textColors.primary} mb-2`}>Mitigation Strategies:</h5>
            <ul className={`space-y-1 ${theme.textColors.secondary}`}>
              <li>• Delay retirement to build larger nest egg</li>
              <li>• Consider annuities for guaranteed income</li>
              <li>• Plan for higher healthcare costs</li>
              <li>• Maintain flexible withdrawal strategy</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Screen Reader Status Updates */}
      <div 
        role="status" 
        aria-live="polite" 
        className="sr-only"
      >
        {projections.length > 0 ? 
          `Longevity analysis complete. Analysis covers ${projections.length} projection years.` :
          'Enter your retirement details to begin longevity analysis.'
        }
      </div>
    </div>
  );
};

export default LongevityRiskAnalyzer;
