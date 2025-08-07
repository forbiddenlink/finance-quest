'use client';

import { useState, useEffect } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import { motion } from 'framer-motion';
import {
  Target,
  PiggyBank,
  BarChart3,
  AlertTriangle,
  Zap,
  Settings,
  Calculator,
  Clock
} from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';
import toast from 'react-hot-toast';

interface RetirementScenario {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  monthlyContribution: number;
  expectedReturn: number;
  inflationRate: number;
  desiredIncome: number;
  socialSecurityIncome: number;
  otherIncome: number;
}

interface RetirementProjection {
  age: number;
  year: number;
  balance: number;
  totalContributions: number;
  growthFromReturns: number;
  realValue: number;
  withdrawalAmount: number;
  remainingBalance: number;
  incomeGap: number;
}

const defaultScenario: RetirementScenario = {
  currentAge: 30,
  retirementAge: 65,
  currentSavings: 25000,
  monthlyContribution: 1000,
  expectedReturn: 7.0,
  inflationRate: 2.5,
  desiredIncome: 80000,
  socialSecurityIncome: 24000,
  otherIncome: 0
};

const scenarioPresets = {
  conservative: {
    name: 'Conservative',
    expectedReturn: 5.5,
    inflationRate: 2.5,
    color: '#10B981'
  },
  moderate: {
    name: 'Moderate',
    expectedReturn: 7.0,
    inflationRate: 2.5,
    color: '#F59E0B'
  },
  aggressive: {
    name: 'Aggressive',
    expectedReturn: 8.5,
    inflationRate: 2.5,
    color: '#EF4444'
  }
};

export default function RetirementGoalOptimizer() {
  const { recordCalculatorUsage } = useProgressStore();
  const [scenario, setScenario] = useState<RetirementScenario>(defaultScenario);
  const [selectedPreset, setSelectedPreset] = useState<keyof typeof scenarioPresets>('moderate');
  const [analysisView, setAnalysisView] = useState<'projection' | 'comparison' | 'gaps'>('projection');

  useEffect(() => {
    recordCalculatorUsage('retirement-goal-optimizer');
  }, [recordCalculatorUsage]);

  // Calculate retirement projections
  const calculateRetirementProjection = (config: RetirementScenario): RetirementProjection[] => {
    const projections: RetirementProjection[] = [];
    const yearsToRetirement = config.retirementAge - config.currentAge;
    const yearsInRetirement = 30; // Plan for 30 years in retirement
    const monthlyReturn = config.expectedReturn / 100 / 12;
    const annualInflation = config.inflationRate / 100;
    
    let balance = config.currentSavings;
    let totalContributions = config.currentSavings;
    
    // Accumulation phase
    for (let year = 0; year <= yearsToRetirement; year++) {
      const age = config.currentAge + year;
      const currentYear = new Date().getFullYear() + year;
      
      if (year > 0) {
        // Add monthly contributions for the year
        const annualContribution = config.monthlyContribution * 12;
        totalContributions += annualContribution;
        
        // Calculate compound growth with monthly contributions
        for (let month = 0; month < 12; month++) {
          balance = balance * (1 + monthlyReturn) + config.monthlyContribution;
        }
      }
      
      const growthFromReturns = balance - totalContributions;
      const realValue = balance / Math.pow(1 + annualInflation, year);
      
      projections.push({
        age,
        year: currentYear,
        balance,
        totalContributions,
        growthFromReturns,
        realValue,
        withdrawalAmount: 0,
        remainingBalance: balance,
        incomeGap: 0
      });
    }
    
    // Distribution phase
    let retirementBalance = balance;
    const inflationAdjustedIncome = config.desiredIncome * Math.pow(1 + annualInflation, yearsToRetirement);
    const totalRetirementIncome = config.socialSecurityIncome + config.otherIncome;
    
    for (let year = 1; year <= yearsInRetirement; year++) {
      const age = config.retirementAge + year;
      const currentYear = new Date().getFullYear() + yearsToRetirement + year;
      
      // Calculate required withdrawal
      const neededFromSavings = Math.max(0, inflationAdjustedIncome - totalRetirementIncome);
      const withdrawalAmount = Math.min(neededFromSavings, retirementBalance * 0.04); // 4% rule max
      
      // Apply investment growth and withdrawal
      retirementBalance = retirementBalance * (1 + config.expectedReturn / 100) - withdrawalAmount;
      retirementBalance = Math.max(0, retirementBalance);
      
      const incomeGap = Math.max(0, neededFromSavings - withdrawalAmount);
      const realValue = retirementBalance / Math.pow(1 + annualInflation, yearsToRetirement + year);
      
      projections.push({
        age,
        year: currentYear,
        balance: retirementBalance,
        totalContributions,
        growthFromReturns: retirementBalance - totalContributions,
        realValue,
        withdrawalAmount,
        remainingBalance: retirementBalance,
        incomeGap
      });
    }
    
    return projections;
  };

  // Calculate scenarios for different return assumptions
  const calculateScenarioComparison = () => {
    return Object.entries(scenarioPresets).map(([key, preset]) => {
      const scenarioConfig = {
        ...scenario,
        expectedReturn: preset.expectedReturn,
        inflationRate: preset.inflationRate
      };
      const projection = calculateRetirementProjection(scenarioConfig);
      const retirementProjection = projection.find(p => p.age === scenario.retirementAge);
      
      return {
        scenario: preset.name,
        balance: retirementProjection?.balance || 0,
        realValue: retirementProjection?.realValue || 0,
        color: preset.color,
        monthlyIncome: (retirementProjection?.balance || 0) * 0.04 / 12,
        key
      };
    });
  };

  const projections = calculateRetirementProjection(scenario);
  const scenarioComparisons = calculateScenarioComparison();
  const retirementProjection = projections.find(p => p.age === scenario.retirementAge);
  
  // Calculate key metrics
  const yearsToRetirement = scenario.retirementAge - scenario.currentAge;
  const totalNeeded = scenario.desiredIncome * 25; // 4% rule
  const projectedBalance = retirementProjection?.balance || 0;
  const shortfall = Math.max(0, totalNeeded - projectedBalance);
  const surplus = Math.max(0, projectedBalance - totalNeeded);
  const successRate = Math.min(100, (projectedBalance / totalNeeded) * 100);
  
  // Calculate required monthly contribution to reach goal
  const monthlyReturn = scenario.expectedReturn / 100 / 12;
  const numPayments = yearsToRetirement * 12;
  const futureValueOfCurrentSavings = scenario.currentSavings * Math.pow(1 + monthlyReturn, numPayments);
  const stillNeeded = Math.max(0, totalNeeded - futureValueOfCurrentSavings);
  
  const requiredMonthlyContribution = stillNeeded > 0 
    ? stillNeeded / (((Math.pow(1 + monthlyReturn, numPayments) - 1) / monthlyReturn) * (1 + monthlyReturn))
    : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (value: number) => `${value.toFixed(1)}%`;

  const updateScenario = (field: keyof RetirementScenario, value: number) => {
    setScenario(prev => ({ ...prev, [field]: value }));
  };

  const applyPreset = (preset: keyof typeof scenarioPresets) => {
    setSelectedPreset(preset);
    setScenario(prev => ({
      ...prev,
      expectedReturn: scenarioPresets[preset].expectedReturn,
      inflationRate: scenarioPresets[preset].inflationRate
    }));
    toast.success(`Applied ${scenarioPresets[preset].name} scenario! 📊`);
  };

  const getSuccessColor = (rate: number) => {
    if (rate >= 100) return theme.status.success.text;
    if (rate >= 80) return theme.status.warning.text;
    return theme.status.error.text;
  };

  const getSuccessBackground = (rate: number) => {
    if (rate >= 100) return theme.status.success.bg;
    if (rate >= 80) return theme.status.warning.bg;
    return theme.status.error.bg;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`${theme.status.info.bg} p-3 rounded-lg`}>
              <Target className={`w-6 h-6 ${theme.status.info.text}`} />
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${theme.textColors.primary}`}>
                Retirement Goal Optimizer
              </h2>
              <p className={`${theme.textColors.secondary}`}>
                Plan your retirement goals with advanced scenario modeling and projections
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {Object.entries(scenarioPresets).map(([key, preset]) => (
              <button
                key={key}
                onClick={() => applyPreset(key as keyof typeof scenarioPresets)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  selectedPreset === key
                    ? `${theme.buttons.primary}`
                    : `border ${theme.borderColors.primary} ${theme.textColors.secondary} hover:${theme.borderColors.accent}`
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`p-4 ${theme.status.info.bg} rounded-lg text-center`}>
            <PiggyBank className={`w-6 h-6 ${theme.status.info.text} mx-auto mb-2`} />
            <div className={`text-xl font-bold ${theme.status.info.text}`}>
              {formatCurrency(projectedBalance)}
            </div>
            <div className={`text-sm ${theme.textColors.secondary}`}>Projected at {scenario.retirementAge}</div>
          </div>
          
          <div className={`p-4 ${getSuccessBackground(successRate)} rounded-lg text-center`}>
            <Target className={`w-6 h-6 ${getSuccessColor(successRate)} mx-auto mb-2`} />
            <div className={`text-xl font-bold ${getSuccessColor(successRate)}`}>
              {formatPercent(successRate)}
            </div>
            <div className={`text-sm ${theme.textColors.secondary}`}>Success Rate</div>
          </div>
          
          <div className={`p-4 ${shortfall > 0 ? theme.status.error.bg : theme.status.success.bg} rounded-lg text-center`}>
            <AlertTriangle className={`w-6 h-6 ${shortfall > 0 ? theme.status.error.text : theme.status.success.text} mx-auto mb-2`} />
            <div className={`text-xl font-bold ${shortfall > 0 ? theme.status.error.text : theme.status.success.text}`}>
              {formatCurrency(shortfall || surplus)}
            </div>
            <div className={`text-sm ${theme.textColors.secondary}`}>{shortfall > 0 ? 'Shortfall' : 'Surplus'}</div>
          </div>
          
          <div className={`p-4 ${theme.status.warning.bg} rounded-lg text-center`}>
            <Calculator className={`w-6 h-6 ${theme.status.warning.text} mx-auto mb-2`} />
            <div className={`text-xl font-bold ${theme.status.warning.text}`}>
              {formatCurrency(requiredMonthlyContribution)}
            </div>
            <div className={`text-sm ${theme.textColors.secondary}`}>Required Monthly</div>
          </div>
        </div>
      </div>

      {/* Scenario Configuration */}
      <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}>
        <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-6 flex items-center gap-2`}>
          <Settings className="w-5 h-5" />
          Retirement Planning Parameters
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                Current Age
              </label>
              <input
                type="number"
                value={scenario.currentAge}
                onChange={(e) => updateScenario('currentAge', parseInt(e.target.value) || 0)}
                className={`w-full px-4 py-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary}`}
                min="18"
                max="80"
                title="Your current age"
                aria-label="Current age"
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                Retirement Age
              </label>
              <input
                type="number"
                value={scenario.retirementAge}
                onChange={(e) => updateScenario('retirementAge', parseInt(e.target.value) || 0)}
                className={`w-full px-4 py-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary}`}
                min="50"
                max="80"
                title="Planned retirement age"
                aria-label="Retirement age"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                Current Savings ($)
              </label>
              <input
                type="number"
                value={scenario.currentSavings}
                onChange={(e) => updateScenario('currentSavings', parseFloat(e.target.value) || 0)}
                className={`w-full px-4 py-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary}`}
                min="0"
                step="1000"
                title="Current retirement savings balance"
                aria-label="Current savings amount"
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                Monthly Contribution ($)
              </label>
              <input
                type="number"
                value={scenario.monthlyContribution}
                onChange={(e) => updateScenario('monthlyContribution', parseFloat(e.target.value) || 0)}
                className={`w-full px-4 py-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary}`}
                min="0"
                step="50"
                title="Monthly retirement contribution"
                aria-label="Monthly contribution amount"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                Expected Return (%)
              </label>
              <input
                type="number"
                value={scenario.expectedReturn}
                onChange={(e) => updateScenario('expectedReturn', parseFloat(e.target.value) || 0)}
                className={`w-full px-4 py-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary}`}
                min="0"
                max="15"
                step="0.1"
                title="Expected annual return on investments"
                aria-label="Expected return percentage"
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                Inflation Rate (%)
              </label>
              <input
                type="number"
                value={scenario.inflationRate}
                onChange={(e) => updateScenario('inflationRate', parseFloat(e.target.value) || 0)}
                className={`w-full px-4 py-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary}`}
                min="0"
                max="10"
                step="0.1"
                title="Expected annual inflation rate"
                aria-label="Inflation rate percentage"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                Desired Annual Income ($)
              </label>
              <input
                type="number"
                value={scenario.desiredIncome}
                onChange={(e) => updateScenario('desiredIncome', parseFloat(e.target.value) || 0)}
                className={`w-full px-4 py-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary}`}
                min="0"
                step="1000"
                title="Desired annual income in retirement"
                aria-label="Desired retirement income"
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                Social Security Income ($)
              </label>
              <input
                type="number"
                value={scenario.socialSecurityIncome}
                onChange={(e) => updateScenario('socialSecurityIncome', parseFloat(e.target.value) || 0)}
                className={`w-full px-4 py-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary}`}
                min="0"
                step="1000"
                title="Expected annual Social Security income"
                aria-label="Social Security income"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Analysis View Selector */}
      <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-lg font-semibold ${theme.textColors.primary} flex items-center gap-2`}>
            <BarChart3 className="w-5 h-5" />
            Retirement Analysis
          </h3>
          
          <div className="flex gap-2">
            <button
              onClick={() => setAnalysisView('projection')}
              className={`px-4 py-2 rounded-lg transition-all ${
                analysisView === 'projection'
                  ? `${theme.buttons.primary}`
                  : `border ${theme.borderColors.primary} ${theme.textColors.secondary} hover:${theme.borderColors.accent}`
              }`}
            >
              Growth Projection
            </button>
            <button
              onClick={() => setAnalysisView('comparison')}
              className={`px-4 py-2 rounded-lg transition-all ${
                analysisView === 'comparison'
                  ? `${theme.buttons.primary}`
                  : `border ${theme.borderColors.primary} ${theme.textColors.secondary} hover:${theme.borderColors.accent}`
              }`}
            >
              Scenario Comparison
            </button>
          </div>
        </div>

        {analysisView === 'projection' && (
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={projections.slice(0, yearsToRetirement + 1)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="age" stroke="#9CA3AF" />
                <YAxis 
                  stroke="#9CA3AF" 
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Balance']}
                  labelFormatter={(age) => `Age ${age}`}
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.3} 
                />
                <Area 
                  type="monotone" 
                  dataKey="totalContributions" 
                  stroke="#10B981" 
                  fill="#10B981" 
                  fillOpacity={0.2} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {analysisView === 'comparison' && (
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scenarioComparisons}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="scenario" stroke="#9CA3AF" />
                <YAxis 
                  stroke="#9CA3AF" 
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip 
                  formatter={(value: number) => [formatCurrency(value), 'Portfolio Value']}
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                />
                <Bar dataKey="balance" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Retirement Readiness */}
        <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}>
          <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-6 flex items-center gap-2`}>
            <Clock className="w-5 h-5" />
            Retirement Readiness Assessment
          </h3>
          
          <div className="space-y-4">
            <div className={`p-4 ${getSuccessBackground(successRate)} border ${getSuccessColor(successRate) === theme.status.success.text ? theme.status.success.border : getSuccessColor(successRate) === theme.status.warning.text ? theme.status.warning.border : theme.status.error.border} rounded-lg`}>
              <h4 className={`font-semibold ${getSuccessColor(successRate)} mb-2`}>
                Overall Assessment: {successRate >= 100 ? 'On Track' : successRate >= 80 ? 'Needs Improvement' : 'Behind Goal'}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className={`${theme.textColors.secondary}`}>Goal Amount Needed:</span>
                  <span className={`font-medium ${theme.textColors.primary}`}>{formatCurrency(totalNeeded)}</span>
                </div>
                <div className="flex justify-between">
                  <span className={`${theme.textColors.secondary}`}>Projected Amount:</span>
                  <span className={`font-medium ${theme.textColors.primary}`}>{formatCurrency(projectedBalance)}</span>
                </div>
                <div className="flex justify-between">
                  <span className={`${theme.textColors.secondary}`}>{shortfall > 0 ? 'Shortfall:' : 'Surplus:'}</span>
                  <span className={`font-medium ${shortfall > 0 ? theme.status.error.text : theme.status.success.text}`}>
                    {formatCurrency(shortfall || surplus)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className={`p-4 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg`}>
              <h4 className={`font-semibold ${theme.status.info.text} mb-2`}>
                Time Advantage
              </h4>
              <p className={`text-sm ${theme.textColors.secondary} mb-2`}>
                You have {yearsToRetirement} years until retirement
              </p>
              <ul className={`text-sm ${theme.textColors.secondary} space-y-1`}>
                <li>• Total contributions: {formatCurrency(scenario.monthlyContribution * 12 * yearsToRetirement)}</li>
                <li>• Growth from compound interest: {formatCurrency(projectedBalance - scenario.currentSavings - (scenario.monthlyContribution * 12 * yearsToRetirement))}</li>
                <li>• Monthly income at 4% withdrawal: {formatCurrency(projectedBalance * 0.04 / 12)}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Plan */}
        <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}>
          <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-6 flex items-center gap-2`}>
            <Zap className="w-5 h-5" />
            Optimization Recommendations
          </h3>
          
          <div className="space-y-4">
            {shortfall > 0 && (
              <div className={`p-4 ${theme.status.warning.bg} border ${theme.status.warning.border} rounded-lg`}>
                <h4 className={`font-semibold ${theme.status.warning.text} mb-2`}>
                  Increase Savings Rate
                </h4>
                <p className={`text-sm ${theme.textColors.secondary} mb-2`}>
                  To reach your goal, consider increasing your monthly contribution to {formatCurrency(requiredMonthlyContribution)}.
                </p>
                <div className="text-sm space-y-1">
                  <div>Current: {formatCurrency(scenario.monthlyContribution)}/month</div>
                  <div>Needed: {formatCurrency(requiredMonthlyContribution)}/month</div>
                  <div>Increase: {formatCurrency(requiredMonthlyContribution - scenario.monthlyContribution)}/month</div>
                </div>
              </div>
            )}
            
            <div className={`p-4 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg`}>
              <h4 className={`font-semibold ${theme.status.info.text} mb-2`}>
                Alternative Strategies
              </h4>
              <ul className={`text-sm ${theme.textColors.secondary} space-y-1`}>
                <li>• Work 2 more years: {formatCurrency((projectedBalance * Math.pow(1.07, 2)) + (scenario.monthlyContribution * 24 * Math.pow(1.07, 1)))}</li>
                <li>• Reduce retirement income to {formatCurrency(scenario.desiredIncome * 0.9)}: {formatPercent((projectedBalance / (scenario.desiredIncome * 0.9 * 25)) * 100)} success</li>
                <li>• Part-time work earning {formatCurrency(20000)}/year fills the gap</li>
              </ul>
            </div>
            
            {successRate >= 100 && (
              <div className={`p-4 ${theme.status.success.bg} border ${theme.status.success.border} rounded-lg`}>
                <h4 className={`font-semibold ${theme.status.success.text} mb-2`}>
                  Excellent Progress! 🎉
                </h4>
                <p className={`text-sm ${theme.textColors.secondary} mb-2`}>
                  You&apos;re on track to exceed your retirement goal. Consider:
                </p>
                <ul className={`text-sm ${theme.textColors.secondary} space-y-1`}>
                  <li>• Retiring {Math.floor(Math.log(projectedBalance / totalNeeded) / Math.log(1.07))} years earlier</li>
                  <li>• Increasing retirement lifestyle budget</li>
                  <li>• Contributing to charitable goals or family support</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Educational Note */}
      <div className={`${theme.status.info.bg} border ${theme.status.info.border} rounded-lg p-4 text-center`}>
        <p className={`text-sm ${theme.status.info.text} font-medium`}>
          💡 The 4% rule suggests you need 25 times your annual expenses saved to retire safely. Starting early and staying consistent are the keys to retirement success through the power of compound growth.
        </p>
      </div>
    </motion.div>
  );
}
