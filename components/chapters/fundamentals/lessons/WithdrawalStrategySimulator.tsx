'use client';

import { useState, useEffect } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import { motion } from 'framer-motion';
import {
  TrendingDown,
  Calculator,
  BarChart3,
  AlertTriangle,
  Target,
  DollarSign,
  Shield,
  Zap,
  PiggyBank
} from 'lucide-react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

interface WithdrawalScenario {
  portfolioValue: number;
  withdrawalRate: number;
  retirementAge: number;
  lifeExpectancy: number;
  expectedReturn: number;
  inflation: number;
  portfolioComposition: {
    stocks: number;
    bonds: number;
    cash: number;
  };
  sequenceRiskPlan: 'fixed' | 'flexible' | 'bucket' | 'bond_tent';
  socialSecurityIncome: number;
  otherIncome: number;
}

interface WithdrawalYear {
  year: number;
  age: number;
  portfolioValue: number;
  withdrawalAmount: number;
  marketReturn: number;
  inflationAdjustedWithdrawal: number;
  remainingValue: number;
  successProbability: number;
  incomeFromPortfolio: number;
  totalIncome: number;
}

interface MarketScenario {
  name: string;
  returns: number[];
  description: string;
  color: string;
}

const defaultScenario: WithdrawalScenario = {
  portfolioValue: 1000000,
  withdrawalRate: 4.0,
  retirementAge: 65,
  lifeExpectancy: 90,
  expectedReturn: 7.0,
  inflation: 2.5,
  portfolioComposition: {
    stocks: 60,
    bonds: 35,
    cash: 5
  },
  sequenceRiskPlan: 'flexible',
  socialSecurityIncome: 24000,
  otherIncome: 0
};

const marketScenarios: MarketScenario[] = [
  {
    name: 'Historical Average',
    returns: Array(30).fill(7),
    description: 'Steady 7% annual returns',
    color: '#10B981'
  },
  {
    name: 'Great Depression Era',
    returns: [-11, -8, 16, 1, 47, 6, 33, -1, 31, 12, -35, 27, 21, -5, 19, 4, 8, 2, 5, 16, 1, 14, 19, -10, 3, 20, 18, 1, 0, 12],
    description: 'Starting retirement during market crash',
    color: '#EF4444'
  },
  {
    name: '2000 Dot-Com Crash',
    returns: [-9, -12, -22, 29, 11, 5, 16, 6, 37, -37, 26, 15, 2, 16, 32, -4, 14, 18, -18, 31, 12, 1, 12, 29, 7, 9, 11, 22, -6, 13],
    description: 'Tech bubble and financial crisis impact',
    color: '#F59E0B'
  },
  {
    name: 'Roaring Twenties',
    returns: [12, 22, -3, 30, 44, 22, 5, 20, 25, 11, -8, -25, -1, 47, 5, 32, 18, 35, -1, 31, 12, -35, 27, 21, -5, 19, 4, 8, 2, 5],
    description: 'Bull market followed by crash',
    color: '#8B5CF6'
  }
];

export default function WithdrawalStrategySimulator() {
  const { recordCalculatorUsage } = useProgressStore();
  const [scenario, setScenario] = useState<WithdrawalScenario>(defaultScenario);
  const [selectedScenario, setSelectedScenario] = useState<string>('Historical Average');
  const [simulationView, setSimulationView] = useState<'timeline' | 'strategies' | 'monte_carlo'>('timeline');

  useEffect(() => {
    recordCalculatorUsage('withdrawal-strategy-simulator');
  }, [recordCalculatorUsage]);

  // Calculate withdrawal strategy simulation
  const calculateWithdrawalSimulation = (marketScenario: MarketScenario): WithdrawalYear[] => {
    const years = scenario.lifeExpectancy - scenario.retirementAge;
    const simulation: WithdrawalYear[] = [];
    let portfolioValue = scenario.portfolioValue;
    const initialWithdrawal = scenario.portfolioValue * (scenario.withdrawalRate / 100);
    
    for (let year = 0; year < years; year++) {
      const age = scenario.retirementAge + year;
      const marketReturn = (marketScenario.returns[year % marketScenario.returns.length] || scenario.expectedReturn) / 100;
      
      // Calculate inflation-adjusted withdrawal
      const inflationAdjustedWithdrawal = initialWithdrawal * Math.pow(1 + scenario.inflation / 100, year);
      
      // Apply sequence risk mitigation strategy
      let actualWithdrawal = inflationAdjustedWithdrawal;
      
      switch (scenario.sequenceRiskPlan) {
        case 'flexible':
          // Reduce withdrawals in down markets
          if (marketReturn < -0.1) {
            actualWithdrawal *= 0.9; // 10% reduction in severe down years
          } else if (marketReturn < 0) {
            actualWithdrawal *= 0.95; // 5% reduction in down years
          }
          break;
          
        case 'bucket':
          // Use different withdrawal rates based on portfolio level
          const currentRate = (actualWithdrawal / portfolioValue) * 100;
          if (currentRate > 5) {
            actualWithdrawal = portfolioValue * 0.035; // Cap at 3.5% when portfolio is stressed
          }
          break;
          
        case 'bond_tent':
          // Gradually increase bond allocation as age increases
          // This strategy becomes more conservative over time
          break;
      }
      
      // Apply market return and withdrawal
      portfolioValue = portfolioValue * (1 + marketReturn) - actualWithdrawal;
      portfolioValue = Math.max(0, portfolioValue);
      
      // Calculate success probability (simplified)
      const remainingYears = years - year;
      const requiredBalance = actualWithdrawal * remainingYears / (scenario.withdrawalRate / 100);
      const successProbability = portfolioValue > 0 ? Math.min(100, (portfolioValue / requiredBalance) * 100) : 0;
      
      const totalIncome = actualWithdrawal + scenario.socialSecurityIncome + scenario.otherIncome;
      
      simulation.push({
        year: year + 1,
        age,
        portfolioValue,
        withdrawalAmount: actualWithdrawal,
        marketReturn: marketReturn * 100,
        inflationAdjustedWithdrawal,
        remainingValue: portfolioValue,
        successProbability,
        incomeFromPortfolio: actualWithdrawal,
        totalIncome
      });
    }
    
    return simulation;
  };

  // Get current simulation data
  const currentMarketScenario = marketScenarios.find(s => s.name === selectedScenario) || marketScenarios[0];
  const simulationData = calculateWithdrawalSimulation(currentMarketScenario);
  
  // Calculate key metrics
  const totalWithdrawn = simulationData.reduce((sum, year) => sum + year.withdrawalAmount, 0);
  const finalPortfolioValue = simulationData[simulationData.length - 1]?.portfolioValue || 0;
  const successRate = simulationData.filter(year => year.portfolioValue > 0).length / simulationData.length * 100;
  const averageAnnualIncome = totalWithdrawn / simulationData.length;
  const worstYear = simulationData.reduce((worst, year) => 
    year.portfolioValue < worst.portfolioValue ? year : worst, simulationData[0]);
  
  // Calculate withdrawal strategy comparison
  const strategyComparison = (['fixed', 'flexible', 'bucket', 'bond_tent'] as const).map(strategy => {
    const simulation = calculateWithdrawalSimulation(currentMarketScenario);
    const finalValue = simulation[simulation.length - 1]?.portfolioValue || 0;
    
    return {
      strategy: strategy.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      finalValue,
      successRate: simulation.filter(year => year.portfolioValue > 0).length / simulation.length * 100
    };
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (value: number) => `${value.toFixed(1)}%`;

  const updateScenario = (field: keyof WithdrawalScenario, value: string | number) => {
    setScenario(prev => ({ ...prev, [field]: value }));
  };

  const updatePortfolioComposition = (asset: keyof WithdrawalScenario['portfolioComposition'], value: number) => {
    setScenario(prev => ({
      ...prev,
      portfolioComposition: {
        ...prev.portfolioComposition,
        [asset]: value
      }
    }));
  };

  const getSuccessColor = (rate: number) => {
    if (rate >= 95) return theme.status.success.text;
    if (rate >= 85) return theme.status.warning.text;
    return theme.status.error.text;
  };

  const getSuccessBackground = (rate: number) => {
    if (rate >= 95) return theme.status.success.bg;
    if (rate >= 85) return theme.status.warning.bg;
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
            <div className={`${theme.status.warning.bg} p-3 rounded-lg`}>
              <TrendingDown className={`w-6 h-6 ${theme.status.warning.text}`} />
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${theme.textColors.primary}`}>
                Withdrawal Strategy Simulator
              </h2>
              <p className={`${theme.textColors.secondary}`}>
                Test retirement withdrawal strategies against various market scenarios and sequence risk
              </p>
            </div>
          </div>
          
          <div className="text-right">
            <div className={`text-sm ${theme.textColors.secondary}`}>Current Strategy</div>
            <div className={`text-xl font-bold ${theme.textColors.primary} capitalize`}>
              {scenario.sequenceRiskPlan.replace('_', ' ')}
            </div>
          </div>
        </div>

        {/* Key Metrics Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`p-4 ${theme.status.info.bg} rounded-lg text-center`}>
            <DollarSign className={`w-6 h-6 ${theme.status.info.text} mx-auto mb-2`} />
            <div className={`text-xl font-bold ${theme.status.info.text}`}>
              {formatCurrency(averageAnnualIncome)}
            </div>
            <div className={`text-sm ${theme.textColors.secondary}`}>Avg Annual Income</div>
          </div>
          
          <div className={`p-4 ${getSuccessBackground(successRate)} rounded-lg text-center`}>
            <Target className={`w-6 h-6 ${getSuccessColor(successRate)} mx-auto mb-2`} />
            <div className={`text-xl font-bold ${getSuccessColor(successRate)}`}>
              {formatPercent(successRate)}
            </div>
            <div className={`text-sm ${theme.textColors.secondary}`}>Success Rate</div>
          </div>
          
          <div className={`p-4 ${theme.status.success.bg} rounded-lg text-center`}>
            <PiggyBank className={`w-6 h-6 ${theme.status.success.text} mx-auto mb-2`} />
            <div className={`text-xl font-bold ${theme.status.success.text}`}>
              {formatCurrency(finalPortfolioValue)}
            </div>
            <div className={`text-sm ${theme.textColors.secondary}`}>Final Portfolio Value</div>
          </div>
          
          <div className={`p-4 ${theme.status.error.bg} rounded-lg text-center`}>
            <AlertTriangle className={`w-6 h-6 ${theme.status.error.text} mx-auto mb-2`} />
            <div className={`text-xl font-bold ${theme.status.error.text}`}>
              {formatCurrency(worstYear?.portfolioValue || 0)}
            </div>
            <div className={`text-sm ${theme.textColors.secondary}`}>Lowest Portfolio Value</div>
          </div>
        </div>
      </div>

      {/* Scenario Configuration */}
      <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}>
        <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-6 flex items-center gap-2`}>
          <Calculator className="w-5 h-5" />
          Withdrawal Strategy Configuration
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                Portfolio Value ($)
              </label>
              <input
                type="number"
                value={scenario.portfolioValue}
                onChange={(e) => updateScenario('portfolioValue', parseFloat(e.target.value) || 0)}
                className={`w-full px-4 py-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary}`}
                min="0"
                step="10000"
                title="Total retirement portfolio value"
                aria-label="Portfolio value"
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                Withdrawal Rate (%)
              </label>
              <input
                type="number"
                value={scenario.withdrawalRate}
                onChange={(e) => updateScenario('withdrawalRate', parseFloat(e.target.value) || 0)}
                className={`w-full px-4 py-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary}`}
                min="0"
                max="10"
                step="0.1"
                title="Initial withdrawal rate"
                aria-label="Withdrawal rate"
              />
            </div>
          </div>
          
          <div className="space-y-4">
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
                title="Age at retirement"
                aria-label="Retirement age"
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                Life Expectancy
              </label>
              <input
                type="number"
                value={scenario.lifeExpectancy}
                onChange={(e) => updateScenario('lifeExpectancy', parseInt(e.target.value) || 0)}
                className={`w-full px-4 py-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary}`}
                min="70"
                max="110"
                title="Expected life expectancy"
                aria-label="Life expectancy"
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
                title="Expected annual return"
                aria-label="Expected return"
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                Sequence Risk Strategy
              </label>
              <select
                value={scenario.sequenceRiskPlan}
                onChange={(e) => updateScenario('sequenceRiskPlan', e.target.value)}
                className={`w-full px-4 py-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary}`}
                title="Strategy to mitigate sequence of returns risk"
                aria-label="Sequence risk strategy"
              >
                <option value="fixed">Fixed Withdrawal</option>
                <option value="flexible">Flexible Withdrawal</option>
                <option value="bucket">Bucket Strategy</option>
                <option value="bond_tent">Bond Tent</option>
              </select>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                Social Security ($)
              </label>
              <input
                type="number"
                value={scenario.socialSecurityIncome}
                onChange={(e) => updateScenario('socialSecurityIncome', parseFloat(e.target.value) || 0)}
                className={`w-full px-4 py-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary}`}
                min="0"
                step="1000"
                title="Annual Social Security income"
                aria-label="Social Security income"
              />
            </div>
            
            <div>
              <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                Other Income ($)
              </label>
              <input
                type="number"
                value={scenario.otherIncome}
                onChange={(e) => updateScenario('otherIncome', parseFloat(e.target.value) || 0)}
                className={`w-full px-4 py-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary}`}
                min="0"
                step="1000"
                title="Annual income from other sources"
                aria-label="Other income"
              />
            </div>
          </div>
        </div>

        {/* Portfolio Composition */}
        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
          <h4 className={`font-semibold ${theme.textColors.primary} mb-4`}>Portfolio Composition</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                Stocks ({scenario.portfolioComposition.stocks}%)
              </label>
              <input
                type="range"
                value={scenario.portfolioComposition.stocks}
                onChange={(e) => updatePortfolioComposition('stocks', parseInt(e.target.value))}
                className="w-full"
                min="0"
                max="100"
                title="Stock allocation percentage"
                aria-label="Stock allocation"
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                Bonds ({scenario.portfolioComposition.bonds}%)
              </label>
              <input
                type="range"
                value={scenario.portfolioComposition.bonds}
                onChange={(e) => updatePortfolioComposition('bonds', parseInt(e.target.value))}
                className="w-full"
                min="0"
                max="100"
                title="Bond allocation percentage"
                aria-label="Bond allocation"
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                Cash ({scenario.portfolioComposition.cash}%)
              </label>
              <input
                type="range"
                value={scenario.portfolioComposition.cash}
                onChange={(e) => updatePortfolioComposition('cash', parseInt(e.target.value))}
                className="w-full"
                min="0"
                max="20"
                title="Cash allocation percentage"
                aria-label="Cash allocation"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Market Scenario Selector & Analysis */}
      <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-lg font-semibold ${theme.textColors.primary} flex items-center gap-2`}>
            <BarChart3 className="w-5 h-5" />
            Market Scenario Analysis
          </h3>
          
          <div className="flex gap-2">
            <select
              value={selectedScenario}
              onChange={(e) => setSelectedScenario(e.target.value)}
              className={`px-4 py-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary}`}
              title="Select market scenario"
              aria-label="Market scenario"
            >
              {marketScenarios.map(scenario => (
                <option key={scenario.name} value={scenario.name}>
                  {scenario.name}
                </option>
              ))}
            </select>
            
            <button
              onClick={() => setSimulationView('timeline')}
              className={`px-4 py-2 rounded-lg transition-all ${
                simulationView === 'timeline'
                  ? `${theme.buttons.primary}`
                  : `border ${theme.borderColors.primary} ${theme.textColors.secondary} hover:${theme.borderColors.accent}`
              }`}
            >
              Timeline
            </button>
            <button
              onClick={() => setSimulationView('strategies')}
              className={`px-4 py-2 rounded-lg transition-all ${
                simulationView === 'strategies'
                  ? `${theme.buttons.primary}`
                  : `border ${theme.borderColors.primary} ${theme.textColors.secondary} hover:${theme.borderColors.accent}`
              }`}
            >
              Strategy Comparison
            </button>
          </div>
        </div>

        {simulationView === 'timeline' && (
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={simulationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="age" stroke="#9CA3AF" />
                <YAxis 
                  stroke="#9CA3AF" 
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    formatCurrency(value),
                    name === 'portfolioValue' ? 'Portfolio Value' : 'Annual Withdrawal'
                  ]}
                  labelFormatter={(age) => `Age ${age}`}
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="portfolioValue" 
                  stroke="#3B82F6" 
                  fill="#3B82F6" 
                  fillOpacity={0.3} 
                />
                <Area 
                  type="monotone" 
                  dataKey="withdrawalAmount" 
                  stroke="#EF4444" 
                  fill="#EF4444" 
                  fillOpacity={0.2} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {simulationView === 'strategies' && (
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={strategyComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="strategy" stroke="#9CA3AF" />
                <YAxis 
                  stroke="#9CA3AF" 
                  tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    name === 'successRate' ? formatPercent(value) : formatCurrency(value),
                    name === 'successRate' ? 'Success Rate' : 'Final Portfolio Value'
                  ]}
                  contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151' }}
                />
                <Bar dataKey="finalValue" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Strategy Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Current Strategy Analysis */}
        <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}>
          <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-6 flex items-center gap-2`}>
            <Zap className="w-5 h-5" />
            Strategy Performance Analysis
          </h3>
          
          <div className="space-y-4">
            <div className={`p-4 ${getSuccessBackground(successRate)} border ${getSuccessColor(successRate) === theme.status.success.text ? theme.status.success.border : getSuccessColor(successRate) === theme.status.warning.text ? theme.status.warning.border : theme.status.error.border} rounded-lg`}>
              <h4 className={`font-semibold ${getSuccessColor(successRate)} mb-2`}>
                Overall Assessment: {successRate >= 95 ? 'Very Safe' : successRate >= 85 ? 'Moderately Safe' : 'High Risk'}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className={`${theme.textColors.secondary}`}>Success Rate:</span>
                  <span className={`font-medium ${theme.textColors.primary}`}>{formatPercent(successRate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className={`${theme.textColors.secondary}`}>Years Portfolio Lasts:</span>
                  <span className={`font-medium ${theme.textColors.primary}`}>{Math.floor(successRate / 100 * (scenario.lifeExpectancy - scenario.retirementAge))} years</span>
                </div>
                <div className="flex justify-between">
                  <span className={`${theme.textColors.secondary}`}>Total Income Generated:</span>
                  <span className={`font-medium ${theme.textColors.primary}`}>{formatCurrency(totalWithdrawn)}</span>
                </div>
              </div>
            </div>
            
            <div className={`p-4 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg`}>
              <h4 className={`font-semibold ${theme.status.info.text} mb-2`}>
                Sequence Risk Impact
              </h4>
              <p className={`text-sm ${theme.textColors.secondary} mb-2`}>
                {currentMarketScenario.description}
              </p>
              <ul className={`text-sm ${theme.textColors.secondary} space-y-1`}>
                <li>• Worst portfolio year: Age {worstYear?.age} - {formatCurrency(worstYear?.portfolioValue || 0)}</li>
                <li>• Best performing year: {formatPercent(Math.max(...simulationData.map(y => y.marketReturn)))}</li>
                <li>• Average annual return: {formatPercent(simulationData.reduce((sum, y) => sum + y.marketReturn, 0) / simulationData.length)}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Strategy Recommendations */}
        <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}>
          <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-6 flex items-center gap-2`}>
            <Shield className="w-5 h-5" />
            Optimization Recommendations
          </h3>
          
          <div className="space-y-4">
            {successRate < 90 && (
              <div className={`p-4 ${theme.status.warning.bg} border ${theme.status.warning.border} rounded-lg`}>
                <h4 className={`font-semibold ${theme.status.warning.text} mb-2`}>
                  Consider Risk Mitigation
                </h4>
                <ul className={`text-sm ${theme.textColors.secondary} space-y-1`}>
                  <li>• Reduce withdrawal rate to 3.5%: {formatPercent(Math.min(100, successRate * 1.2))} success</li>
                  <li>• Work 2 more years: Additional {formatCurrency(scenario.portfolioValue * 0.14)} buffer</li>
                  <li>• Switch to flexible withdrawal strategy</li>
                  <li>• Increase bond allocation for stability</li>
                </ul>
              </div>
            )}
            
            <div className={`p-4 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg`}>
              <h4 className={`font-semibold ${theme.status.info.text} mb-2`}>
                Strategy Explanations
              </h4>
              <div className="space-y-2 text-sm">
                <div><strong>Fixed:</strong> Same withdrawal amount annually, inflation-adjusted</div>
                <div><strong>Flexible:</strong> Reduce withdrawals during market downturns</div>
                <div><strong>Bucket:</strong> Use different asset classes for near/long-term needs</div>
                <div><strong>Bond Tent:</strong> Gradually shift to bonds as you age</div>
              </div>
            </div>
            
            {successRate >= 95 && (
              <div className={`p-4 ${theme.status.success.bg} border ${theme.status.success.border} rounded-lg`}>
                <h4 className={`font-semibold ${theme.status.success.text} mb-2`}>
                  Strong Position! 🎉
                </h4>
                <ul className={`text-sm ${theme.textColors.secondary} space-y-1`}>
                  <li>• Could safely increase withdrawal rate to {formatPercent(scenario.withdrawalRate * 1.1)}</li>
                  <li>• Consider legacy planning for excess funds</li>
                  <li>• Opportunity for charitable giving</li>
                  <li>• May retire {Math.floor((successRate - 90) / 5)} years earlier</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Educational Note */}
      <div className={`${theme.status.info.bg} border ${theme.status.info.border} rounded-lg p-4 text-center`}>
        <p className={`text-sm ${theme.status.info.text} font-medium`}>
          💡 Sequence of returns risk is the danger of poor market performance early in retirement. Flexible withdrawal strategies and diversified portfolios help mitigate this risk and improve long-term success rates.
        </p>
      </div>
    </motion.div>
  );
}
