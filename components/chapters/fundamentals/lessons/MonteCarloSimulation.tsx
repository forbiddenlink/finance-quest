'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line } from 'recharts';
import { BarChart, Play, RefreshCw, TrendingUp, Info } from 'lucide-react';
import { theme } from '@/lib/theme';
import GradientCard from '@/components/shared/ui/GradientCard';

interface MonteCarloSimulationProps {
  className?: string;
}

interface SimulationResult {
  year: number;
  percentile10: number;
  percentile25: number;
  percentile50: number;
  percentile75: number;
  percentile90: number;
  median: number;
}

interface PortfolioInput {
  stocks: number;
  bonds: number;
  initialAmount: number;
  monthlyContribution: number;
  timeHorizon: number;
  withdrawalRate: number;
}

export default function MonteCarloSimulation({ className = '' }: MonteCarloSimulationProps) {
  const [portfolioConfig, setPortfolioConfig] = useState<PortfolioInput>({
    stocks: 80,
    bonds: 20,
    initialAmount: 100000,
    monthlyContribution: 1000,
    timeHorizon: 30,
    withdrawalRate: 4
  });
  
  const [simulationResults, setSimulationResults] = useState<SimulationResult[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [successRate, setSuccessRate] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // Monte Carlo parameters
  const SIMULATIONS = 1000;
  const STOCK_RETURN_MEAN = 0.10; // 10% historical average
  const STOCK_VOLATILITY = 0.20; // 20% standard deviation
  const BOND_RETURN_MEAN = 0.04; // 4% historical average
  const BOND_VOLATILITY = 0.05; // 5% standard deviation
  const CORRELATION = 0.15; // Low correlation between stocks and bonds

  // Generate random return using Box-Muller transformation
  const generateRandomReturn = (mean: number, volatility: number): number => {
    const u1 = Math.random();
    const u2 = Math.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + volatility * z0;
  };

  // Generate correlated returns for stocks and bonds
  const generateCorrelatedReturns = (): [number, number] => {
    const stockReturn = generateRandomReturn(STOCK_RETURN_MEAN, STOCK_VOLATILITY);
    const independentBondReturn = generateRandomReturn(BOND_RETURN_MEAN, BOND_VOLATILITY);
    
    // Apply correlation
    const correlatedBondReturn = CORRELATION * stockReturn + 
      Math.sqrt(1 - CORRELATION * CORRELATION) * independentBondReturn;
    
    return [stockReturn, correlatedBondReturn];
  };

  // Run Monte Carlo simulation
  const runSimulation = async () => {
    setIsSimulating(true);
    setShowResults(false);
    
    // Simulate in batches to keep UI responsive
    const batchSize = 50;
    const allSimulations: number[][] = [];
    
    for (let batch = 0; batch < SIMULATIONS / batchSize; batch++) {
      await new Promise(resolve => setTimeout(resolve, 10)); // Keep UI responsive
      
      for (let sim = 0; sim < batchSize; sim++) {
        const simulation = runSingleSimulation();
        allSimulations.push(simulation);
      }
    }
    
    // Calculate percentiles for each year
    const results: SimulationResult[] = [];
    for (let year = 0; year <= portfolioConfig.timeHorizon; year++) {
      const yearValues = allSimulations.map(sim => sim[year]).sort((a, b) => a - b);
      
      results.push({
        year,
        percentile10: yearValues[Math.floor(0.10 * SIMULATIONS)],
        percentile25: yearValues[Math.floor(0.25 * SIMULATIONS)],
        percentile50: yearValues[Math.floor(0.50 * SIMULATIONS)],
        percentile75: yearValues[Math.floor(0.75 * SIMULATIONS)],
        percentile90: yearValues[Math.floor(0.90 * SIMULATIONS)],
        median: yearValues[Math.floor(0.50 * SIMULATIONS)]
      });
    }
    
    // Calculate success rate (portfolios that meet withdrawal goals)
    const finalYearValues = allSimulations.map(sim => sim[portfolioConfig.timeHorizon]);
    const withdrawalGoal = portfolioConfig.withdrawalRate * 
      (portfolioConfig.initialAmount + portfolioConfig.monthlyContribution * 12 * portfolioConfig.timeHorizon) / 100;
    const successfulSimulations = finalYearValues.filter(value => 
      value * portfolioConfig.withdrawalRate / 100 >= withdrawalGoal
    ).length;
    
    setSimulationResults(results);
    setSuccessRate((successfulSimulations / SIMULATIONS) * 100);
    setIsSimulating(false);
    setShowResults(true);
  };

  // Run single simulation path
  const runSingleSimulation = (): number[] => {
    const path: number[] = [portfolioConfig.initialAmount];
    let currentValue = portfolioConfig.initialAmount;
    
    for (let year = 1; year <= portfolioConfig.timeHorizon; year++) {
      const [stockReturn, bondReturn] = generateCorrelatedReturns();
      
      // Calculate weighted portfolio return
      const portfolioReturn = (portfolioConfig.stocks / 100) * stockReturn + 
                             (portfolioConfig.bonds / 100) * bondReturn;
      
      // Apply return to current value
      currentValue *= (1 + portfolioReturn);
      
      // Add monthly contributions throughout the year
      currentValue += portfolioConfig.monthlyContribution * 12;
      
      path.push(Math.max(0, currentValue)); // Prevent negative values
    }
    
    return path;
  };

  const handleConfigChange = (field: keyof PortfolioInput, value: number) => {
    setPortfolioConfig(prev => {
      const updated = { ...prev, [field]: value };
      
      // Ensure stocks + bonds = 100%
      if (field === 'stocks') {
        updated.bonds = 100 - value;
      } else if (field === 'bonds') {
        updated.stocks = 100 - value;
      }
      
      return updated;
    });
  };

  const getSuccessRateMessage = (rate: number) => {
    if (rate >= 95) return 'Excellent probability of success';
    if (rate >= 90) return 'Very good probability of success';
    if (rate >= 80) return 'Good probability of success';
    if (rate >= 70) return 'Moderate probability of success';
    if (rate >= 50) return 'Below average probability of success';
    return 'Low probability of success - consider adjusting strategy';
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <GradientCard variant="glass" gradient="purple" className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className={`${theme.status.info.bg} p-3 rounded-lg`}>
              <BarChart className={`w-6 h-6 ${theme.status.info.text}`} />
            </div>
            <div>
              <h3 className={`text-2xl font-bold ${theme.textColors.primary}`}>
                Monte Carlo Portfolio Simulation
              </h3>
              <p className={`${theme.textColors.secondary}`}>
                Run 1,000 simulations to test your portfolio strategy against market uncertainty
              </p>
            </div>
          </div>

          {/* Configuration Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div>
              <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                Stock Allocation (%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={portfolioConfig.stocks}
                onChange={(e) => handleConfigChange('stocks', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                aria-label={`Stock allocation: ${portfolioConfig.stocks}%`}
              />
              <div className="flex justify-between text-sm mt-1">
                <span className={theme.textColors.muted}>0%</span>
                <span className={`font-semibold ${theme.textColors.primary}`}>
                  {portfolioConfig.stocks}%
                </span>
                <span className={theme.textColors.muted}>100%</span>
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                Bond Allocation (%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={portfolioConfig.bonds}
                onChange={(e) => handleConfigChange('bonds', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                aria-label={`Bond allocation: ${portfolioConfig.bonds}%`}
              />
              <div className="flex justify-between text-sm mt-1">
                <span className={theme.textColors.muted}>0%</span>
                <span className={`font-semibold ${theme.textColors.primary}`}>
                  {portfolioConfig.bonds}%
                </span>
                <span className={theme.textColors.muted}>100%</span>
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                Initial Investment ($)
              </label>
              <input
                type="number"
                value={portfolioConfig.initialAmount}
                onChange={(e) => handleConfigChange('initialAmount', parseInt(e.target.value) || 0)}
                min="1000"
                max="10000000"
                step="1000"
                placeholder="100000"
                aria-label="Initial investment amount"
                className={`w-full px-4 py-2 ${theme.backgrounds.card} border ${theme.borderColors.muted} rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${theme.textColors.primary}`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                Monthly Contribution ($)
              </label>
              <input
                type="number"
                value={portfolioConfig.monthlyContribution}
                onChange={(e) => handleConfigChange('monthlyContribution', parseInt(e.target.value) || 0)}
                min="0"
                max="50000"
                step="100"
                placeholder="1000"
                aria-label="Monthly contribution amount"
                className={`w-full px-4 py-2 ${theme.backgrounds.card} border ${theme.borderColors.muted} rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 ${theme.textColors.primary}`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                Time Horizon (years)
              </label>
              <input
                type="range"
                min="5"
                max="50"
                value={portfolioConfig.timeHorizon}
                onChange={(e) => handleConfigChange('timeHorizon', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                aria-label={`Investment time horizon: ${portfolioConfig.timeHorizon} years`}
              />
              <div className="flex justify-between text-sm mt-1">
                <span className={theme.textColors.muted}>5 years</span>
                <span className={`font-semibold ${theme.textColors.primary}`}>
                  {portfolioConfig.timeHorizon} years
                </span>
                <span className={theme.textColors.muted}>50 years</span>
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
                Withdrawal Rate (%)
              </label>
              <input
                type="range"
                min="1"
                max="10"
                step="0.5"
                value={portfolioConfig.withdrawalRate}
                onChange={(e) => handleConfigChange('withdrawalRate', parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer"
                aria-label={`Annual withdrawal rate: ${portfolioConfig.withdrawalRate}%`}
              />
              <div className="flex justify-between text-sm mt-1">
                <span className={theme.textColors.muted}>1%</span>
                <span className={`font-semibold ${theme.textColors.primary}`}>
                  {portfolioConfig.withdrawalRate}%
                </span>
                <span className={theme.textColors.muted}>10%</span>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={runSimulation}
            disabled={isSimulating}
            className={`w-full md:w-auto px-8 py-3 ${theme.buttons.primary} rounded-xl transition-all hover-lift flex items-center justify-center mx-auto ${
              isSimulating ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSimulating ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                Running Simulation...
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Run Monte Carlo Simulation
              </>
            )}
          </motion.button>
        </GradientCard>
      </motion.div>

      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Success Rate */}
            <GradientCard variant="glass" gradient="green" className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className={`w-6 h-6 ${theme.status.success.text}`} />
                <h4 className={`text-xl font-bold ${theme.textColors.primary}`}>
                  Simulation Results Summary
                </h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <p className={`text-4xl font-bold mb-2 ${
                    successRate >= 90 ? theme.status.success.text :
                    successRate >= 75 ? theme.status.warning.text :
                    theme.status.error.text
                  }`}>
                    {successRate.toFixed(1)}%
                  </p>
                  <p className={`text-sm ${theme.textColors.secondary} mb-2`}>
                    Success Rate
                  </p>
                  <p className={`text-xs ${theme.textColors.muted}`}>
                    {getSuccessRateMessage(successRate)}
                  </p>
                </div>
                
                <div className="text-center">
                  <p className={`text-2xl font-bold ${theme.textColors.primary} mb-2`}>
                    ${simulationResults[simulationResults.length - 1]?.percentile50.toLocaleString() || 0}
                  </p>
                  <p className={`text-sm ${theme.textColors.secondary}`}>
                    Median Final Value
                  </p>
                </div>
                
                <div className="text-center">
                  <p className={`text-2xl font-bold ${theme.textColors.primary} mb-2`}>
                    ${((simulationResults[simulationResults.length - 1]?.percentile90 || 0) - 
                       (simulationResults[simulationResults.length - 1]?.percentile10 || 0)).toLocaleString()}
                  </p>
                  <p className={`text-sm ${theme.textColors.secondary}`}>
                    Range (10th-90th percentile)
                  </p>
                </div>
              </div>
            </GradientCard>

            {/* Simulation Chart */}
            <GradientCard variant="glass" gradient="blue" className="p-6">
              <h4 className={`text-xl font-bold ${theme.textColors.primary} mb-6 text-center`}>
                Portfolio Value Projections (1,000 Simulations)
              </h4>
              
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={simulationResults}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="year" 
                      stroke="#9CA3AF"
                      label={{ value: 'Years', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                      label={{ value: 'Portfolio Value', angle: -90, position: 'insideLeft' }}
                    />
                    <Tooltip 
                      formatter={(value: number, name: string) => [
                        `$${value?.toLocaleString() || 0}`,
                        name === 'percentile90' ? '90th Percentile' :
                        name === 'percentile75' ? '75th Percentile' :
                        name === 'percentile50' ? 'Median (50th)' :
                        name === 'percentile25' ? '25th Percentile' :
                        '10th Percentile'
                      ]}
                      labelFormatter={(year) => `Year: ${year}`}
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Legend />
                    
                    <Area
                      type="monotone"
                      dataKey="percentile90"
                      stackId="1"
                      stroke="#10B981"
                      fill="#10B981"
                      fillOpacity={0.1}
                      name="90th Percentile"
                    />
                    <Area
                      type="monotone"
                      dataKey="percentile75"
                      stackId="2"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.2}
                      name="75th Percentile"
                    />
                    <Line
                      type="monotone"
                      dataKey="percentile50"
                      stroke="#F59E0B"
                      strokeWidth={3}
                      dot={false}
                      name="Median"
                    />
                    <Area
                      type="monotone"
                      dataKey="percentile25"
                      stackId="3"
                      stroke="#EF4444"
                      fill="#EF4444"
                      fillOpacity={0.2}
                      name="25th Percentile"
                    />
                    <Area
                      type="monotone"
                      dataKey="percentile10"
                      stackId="4"
                      stroke="#DC2626"
                      fill="#DC2626"
                      fillOpacity={0.1}
                      name="10th Percentile"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GradientCard>

            {/* Insights and Recommendations */}
            <GradientCard variant="glass" gradient="yellow" className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Info className={`w-6 h-6 ${theme.status.warning.text}`} />
                <h4 className={`text-xl font-bold ${theme.textColors.primary}`}>
                  Key Insights & Recommendations
                </h4>
              </div>
              
              <div className="space-y-4">
                {successRate < 75 && (
                  <div className={`p-4 ${theme.status.warning.bg} border-l-4 ${theme.status.warning.border} rounded-lg`}>
                    <h5 className={`font-semibold ${theme.status.warning.text} mb-2`}>
                      Success Rate Below Target
                    </h5>
                    <p className={`${theme.textColors.secondary} text-sm`}>
                      Consider: Increasing contributions, extending time horizon, reducing withdrawal rate, 
                      or increasing stock allocation for higher expected returns.
                    </p>
                  </div>
                )}
                
                {portfolioConfig.stocks < 60 && portfolioConfig.timeHorizon > 20 && (
                  <div className={`p-4 ${theme.status.info.bg} border-l-4 ${theme.status.info.border} rounded-lg`}>
                    <h5 className={`font-semibold ${theme.status.info.text} mb-2`}>
                      Conservative Allocation for Long Timeline
                    </h5>
                    <p className={`${theme.textColors.secondary} text-sm`}>
                      With {portfolioConfig.timeHorizon} years until withdrawal, consider increasing stock allocation 
                      to capture growth potential. Historical data suggests higher equity allocations 
                      improve outcomes over long periods.
                    </p>
                  </div>
                )}
                
                {portfolioConfig.withdrawalRate > 4 && (
                  <div className={`p-4 ${theme.status.error.bg} border-l-4 ${theme.status.error.border} rounded-lg`}>
                    <h5 className={`font-semibold ${theme.status.error.text} mb-2`}>
                      High Withdrawal Rate
                    </h5>
                    <p className={`${theme.textColors.secondary} text-sm`}>
                      {portfolioConfig.withdrawalRate}% withdrawal rate significantly increases failure risk. 
                      The 4% rule suggests safer withdrawal rates. Consider reducing to 3.5-4% for better outcomes.
                    </p>
                  </div>
                )}
                
                {successRate >= 90 && (
                  <div className={`p-4 ${theme.status.success.bg} border-l-4 ${theme.status.success.border} rounded-lg`}>
                    <h5 className={`font-semibold ${theme.status.success.text} mb-2`}>
                      Excellent Portfolio Strategy
                    </h5>
                    <p className={`${theme.textColors.secondary} text-sm`}>
                      Your portfolio configuration shows strong probability of success. Consider this 
                      allocation as a foundation, with periodic rebalancing and review as circumstances change.
                    </p>
                  </div>
                )}
              </div>
            </GradientCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
