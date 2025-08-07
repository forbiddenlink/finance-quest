'use client';

import { useState, useEffect } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  DollarSign,
  Calculator,
  Zap,
  BarChart3,
  Info,
  Play,
  Pause,
  RotateCcw,
  Settings
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import toast from 'react-hot-toast';

interface InvestmentScenario {
  name: string;
  description: string;
  initialAmount: number;
  monthlyContribution: number;
  annualReturn: number;
  timeYears: number;
  color: string;
}

interface DataPoint {
  year: number;
  scenario1: number;
  scenario2: number;
  scenario3: number;
  contributions1: number;
  contributions2: number;
  contributions3: number;
}

const defaultScenarios: InvestmentScenario[] = [
  {
    name: 'Conservative Start',
    description: 'Start small, build gradually',
    initialAmount: 1000,
    monthlyContribution: 200,
    annualReturn: 7,
    timeYears: 30,
    color: '#3B82F6' // Blue
  },
  {
    name: 'Aggressive Growth',
    description: 'Higher contributions, higher returns',
    initialAmount: 5000,
    monthlyContribution: 500,
    annualReturn: 10,
    timeYears: 30,
    color: '#10B981' // Green
  },
  {
    name: 'Late Starter',
    description: 'Start later, contribute more',
    initialAmount: 10000,
    monthlyContribution: 1000,
    annualReturn: 8,
    timeYears: 20,
    color: '#F59E0B' // Yellow
  }
];

export default function CompoundGrowthVisualizer() {
  const { recordCalculatorUsage } = useProgressStore();
  const [scenarios, setScenarios] = useState<InvestmentScenario[]>(defaultScenarios);
  const [activeScenarios, setActiveScenarios] = useState<boolean[]>([true, true, true]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentYear, setCurrentYear] = useState(0);
  const [viewMode, setViewMode] = useState<'growth' | 'contributions'>('growth');

  useEffect(() => {
    recordCalculatorUsage('compound-growth-visualizer');
  }, [recordCalculatorUsage]);

  // Animation timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAnimating && currentYear < Math.max(...scenarios.map(s => s.timeYears))) {
      interval = setInterval(() => {
        setCurrentYear(prev => prev + 1);
      }, 200);
    } else if (isAnimating) {
      setIsAnimating(false);
    }
    return () => clearInterval(interval);
  }, [isAnimating, currentYear, scenarios]);

  const calculateGrowth = (scenario: InvestmentScenario, years: number): { total: number; contributions: number } => {
    const { initialAmount, monthlyContribution, annualReturn } = scenario;
    const monthlyRate = annualReturn / 100 / 12;
    
    let total = initialAmount;
    let contributions = initialAmount;
    
    for (let year = 1; year <= years; year++) {
      for (let month = 1; month <= 12; month++) {
        total = total * (1 + monthlyRate) + monthlyContribution;
        contributions += monthlyContribution;
      }
    }
    
    return { total, contributions };
  };

  const generateChartData = (): DataPoint[] => {
    const maxYears = Math.max(...scenarios.map(s => s.timeYears));
    const data: DataPoint[] = [];
    
    for (let year = 0; year <= maxYears; year++) {
      const dataPoint: DataPoint = { 
        year,
        scenario1: 0,
        scenario2: 0,
        scenario3: 0,
        contributions1: 0,
        contributions2: 0,
        contributions3: 0
      };
      
      scenarios.forEach((scenario, index) => {
        if (year <= scenario.timeYears && year <= currentYear) {
          const result = calculateGrowth(scenario, year);
          dataPoint[`scenario${index + 1}` as keyof DataPoint] = result.total;
          dataPoint[`contributions${index + 1}` as keyof DataPoint] = result.contributions;
        }
      });
      
      data.push(dataPoint);
    }
    
    return data;
  };

  const updateScenario = (index: number, field: keyof InvestmentScenario, value: number | string) => {
    const newScenarios = [...scenarios];
    newScenarios[index] = { ...newScenarios[index], [field]: value };
    setScenarios(newScenarios);
  };

  const toggleScenario = (index: number) => {
    const newActive = [...activeScenarios];
    newActive[index] = !newActive[index];
    setActiveScenarios(newActive);
  };

  const resetAnimation = () => {
    setCurrentYear(0);
    setIsAnimating(false);
  };

  const startAnimation = () => {
    if (currentYear >= Math.max(...scenarios.map(s => s.timeYears))) {
      setCurrentYear(0);
    }
    setIsAnimating(!isAnimating);
  };

  const resetToDefaults = () => {
    setScenarios(defaultScenarios);
    setActiveScenarios([true, true, true]);
    resetAnimation();
    toast.success('Reset to default scenarios! 🔄');
  };

  const chartData = generateChartData();
  const maxYears = Math.max(...scenarios.map(s => s.timeYears));

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{ color: string; value: number }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg p-4 shadow-lg`}>
          <p className={`${theme.textColors.primary} font-medium mb-2`}>Year {label}</p>
          {payload.map((entry: { color: string; value: number }, index: number) => (
            <p key={index} className={`text-sm text-blue-400`}>
              {`${scenarios[index]?.name}: ${formatCurrency(entry.value)}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
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
            <div className={`${theme.status.success.bg} p-3 rounded-lg`}>
              <TrendingUp className={`w-6 h-6 ${theme.status.success.text}`} />
            </div>
            <div>
              <h2 className={`text-2xl font-bold ${theme.textColors.primary}`}>
                Compound Growth Visualizer
              </h2>
              <p className={`${theme.textColors.secondary}`}>
                Compare investment scenarios and watch compound interest work its magic
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('growth')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  viewMode === 'growth' 
                    ? `${theme.buttons.primary}` 
                    : `border ${theme.borderColors.primary} ${theme.textColors.secondary}`
                }`}
              >
                Growth
              </button>
              <button
                onClick={() => setViewMode('contributions')}
                className={`px-4 py-2 rounded-lg transition-all ${
                  viewMode === 'contributions' 
                    ? `${theme.buttons.primary}` 
                    : `border ${theme.borderColors.primary} ${theme.textColors.secondary}`
                }`}
              >
                vs Contributions
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={startAnimation}
                className={`flex items-center gap-2 px-4 py-2 ${theme.buttons.primary} rounded-lg transition-all`}
              >
                {isAnimating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isAnimating ? 'Pause' : 'Animate'}
              </button>
              <button
                onClick={resetAnimation}
                className={`flex items-center gap-2 px-4 py-2 border ${theme.borderColors.primary} ${theme.textColors.secondary} rounded-lg hover:${theme.borderColors.accent} transition-all`}
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
              <button
                onClick={resetToDefaults}
                className={`flex items-center gap-2 px-4 py-2 border ${theme.borderColors.primary} ${theme.textColors.secondary} rounded-lg hover:${theme.borderColors.accent} transition-all`}
              >
                <Settings className="w-4 h-4" />
                Defaults
              </button>
            </div>
          </div>
        </div>

        {/* Animation Progress */}
        {isAnimating && (
          <div className={`mb-4 p-3 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg`}>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium ${theme.status.info.text}`}>
                Animating: Year {currentYear} of {maxYears}
              </span>
              <span className={`text-sm ${theme.textColors.secondary}`}>
                {((currentYear / maxYears) * 100).toFixed(0)}% Complete
              </span>
            </div>
            <div className={`w-full ${theme.backgrounds.glass} rounded-full h-2`}>
              <div className={`h-2 bg-blue-500 rounded-full transition-all duration-200`} 
                style={{ width: `${(currentYear / maxYears) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Chart Visualization */}
      <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-lg font-semibold ${theme.textColors.primary} flex items-center gap-2`}>
            <BarChart3 className="w-5 h-5" />
            {viewMode === 'growth' ? 'Investment Growth Over Time' : 'Growth vs Contributions'}
          </h3>
          
          <div className="flex items-center gap-4">
            {scenarios.map((scenario, index) => (
              <button
                key={index}
                onClick={() => toggleScenario(index)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all border-2 border-blue-400 ${
                  activeScenarios[index] 
                    ? 'opacity-100 bg-blue-400 bg-opacity-20' 
                    : 'opacity-50 hover:opacity-75'
                }`}
                title={`Toggle ${scenario.name} visibility`}
              >
                <div className={`w-3 h-3 rounded-full bg-blue-400`} />
                <span className={`text-sm font-medium ${theme.textColors.primary}`}>
                  {scenario.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            {viewMode === 'growth' ? (
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="year" 
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                  tickFormatter={formatCurrency}
                />
                <Tooltip content={<CustomTooltip />} />
                
                {activeScenarios[0] && (
                  <Area
                    type="monotone"
                    dataKey="scenario1"
                    stackId="1"
                    stroke={scenarios[0].color}
                    fill={scenarios[0].color}
                    fillOpacity={0.3}
                  />
                )}
                {activeScenarios[1] && (
                  <Area
                    type="monotone"
                    dataKey="scenario2"
                    stackId="2"
                    stroke={scenarios[1].color}
                    fill={scenarios[1].color}
                    fillOpacity={0.3}
                  />
                )}
                {activeScenarios[2] && (
                  <Area
                    type="monotone"
                    dataKey="scenario3"
                    stackId="3"
                    stroke={scenarios[2].color}
                    fill={scenarios[2].color}
                    fillOpacity={0.3}
                  />
                )}
              </AreaChart>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="year" 
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  tick={{ fill: '#9CA3AF' }}
                  tickFormatter={formatCurrency}
                />
                <Tooltip content={<CustomTooltip />} />
                
                {/* Growth lines */}
                {activeScenarios[0] && (
                  <>
                    <Line
                      type="monotone"
                      dataKey="scenario1"
                      stroke={scenarios[0].color}
                      strokeWidth={3}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="contributions1"
                      stroke={scenarios[0].color}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  </>
                )}
                {activeScenarios[1] && (
                  <>
                    <Line
                      type="monotone"
                      dataKey="scenario2"
                      stroke={scenarios[1].color}
                      strokeWidth={3}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="contributions2"
                      stroke={scenarios[1].color}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  </>
                )}
                {activeScenarios[2] && (
                  <>
                    <Line
                      type="monotone"
                      dataKey="scenario3"
                      stroke={scenarios[2].color}
                      strokeWidth={3}
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="contributions3"
                      stroke={scenarios[2].color}
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={false}
                    />
                  </>
                )}
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {viewMode === 'contributions' && (
          <div className={`mt-4 p-3 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg`}>
            <div className="flex items-center gap-2 mb-2">
              <Info className={`w-4 h-4 ${theme.status.info.text}`} />
              <span className={`text-sm font-medium ${theme.status.info.text}`}>Chart Legend</span>
            </div>
            <p className={`text-sm ${theme.textColors.secondary}`}>
              <span className="font-medium">Solid lines</span>: Total investment value | 
              <span className="font-medium"> Dashed lines</span>: Total contributions (money you put in)
            </p>
          </div>
        )}
      </div>

      {/* Scenario Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {scenarios.map((scenario, index) => (
          <motion.div
            key={index}
            className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6 ${
              !activeScenarios[index] ? 'opacity-50' : ''
            }`}
            style={{ borderColor: activeScenarios[index] ? scenario.color : undefined }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full bg-blue-400`} />
                <input
                  type="text"
                  value={scenario.name}
                  onChange={(e) => updateScenario(index, 'name', e.target.value)}
                  className={`font-semibold ${theme.textColors.primary} bg-transparent border-none outline-none`}
                  title={`Edit scenario ${index + 1} name`}
                  aria-label={`Scenario ${index + 1} name`}
                />
              </div>
              <button
                onClick={() => toggleScenario(index)}
                className={`px-3 py-1 text-xs rounded ${
                  activeScenarios[index] 
                    ? `${theme.status.success.bg} ${theme.status.success.text}` 
                    : `${theme.status.error.bg} ${theme.status.error.text}`
                }`}
              >
                {activeScenarios[index] ? 'Active' : 'Hidden'}
              </button>
            </div>

            <textarea
              value={scenario.description}
              onChange={(e) => updateScenario(index, 'description', e.target.value)}
              className={`w-full ${theme.textColors.secondary} text-sm bg-transparent border-none outline-none mb-4 resize-none`}
              rows={2}
              title={`Edit scenario ${index + 1} description`}
              aria-label={`Scenario ${index + 1} description`}
            />

            <div className="space-y-4">
              <div>
                <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                  Initial Amount
                </label>
                <div className="relative">
                  <DollarSign className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${theme.textColors.muted}`} />
                  <input
                    type="number"
                    value={scenario.initialAmount}
                    onChange={(e) => updateScenario(index, 'initialAmount', parseFloat(e.target.value) || 0)}
                    className={`w-full pl-10 pr-4 py-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary}`}
                    title={`Initial investment amount for scenario ${index + 1}`}
                    aria-label={`Initial amount for ${scenario.name}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                  Monthly Contribution
                </label>
                <div className="relative">
                  <DollarSign className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${theme.textColors.muted}`} />
                  <input
                    type="number"
                    value={scenario.monthlyContribution}
                    onChange={(e) => updateScenario(index, 'monthlyContribution', parseFloat(e.target.value) || 0)}
                    className={`w-full pl-10 pr-4 py-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary}`}
                    title={`Monthly contribution amount for scenario ${index + 1}`}
                    aria-label={`Monthly contribution for ${scenario.name}`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                  Annual Return (%)
                </label>
                <input
                  type="number"
                  value={scenario.annualReturn}
                  onChange={(e) => updateScenario(index, 'annualReturn', parseFloat(e.target.value) || 0)}
                  className={`w-full px-4 py-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary}`}
                  step="0.1"
                  min="0"
                  max="20"
                  title={`Annual return percentage for scenario ${index + 1}`}
                  aria-label={`Annual return for ${scenario.name}`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
                  Time Period (Years)
                </label>
                <input
                  type="number"
                  value={scenario.timeYears}
                  onChange={(e) => updateScenario(index, 'timeYears', parseInt(e.target.value) || 1)}
                  className={`w-full px-4 py-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary}`}
                  min="1"
                  max="50"
                  title={`Investment time period for scenario ${index + 1}`}
                  aria-label={`Time period for ${scenario.name}`}
                />
              </div>
            </div>

            {/* Results */}
            {activeScenarios[index] && (
              <div className={`mt-4 p-4 ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg`}>
                <h4 className={`font-medium ${theme.textColors.primary} mb-3 flex items-center gap-2`}>
                  <Calculator className="w-4 h-4" />
                  Final Results
                </h4>
                
                {(() => {
                  const result = calculateGrowth(scenario, scenario.timeYears);
                  const growth = result.total - result.contributions;
                  const multiple = result.total / result.contributions;
                  
                  return (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className={`${theme.textColors.secondary}`}>Total Value:</span>
                        <span className={`font-bold ${theme.textColors.primary}`}>
                          {formatCurrency(result.total)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`${theme.textColors.secondary}`}>Contributions:</span>
                        <span className={`font-medium ${theme.textColors.secondary}`}>
                          {formatCurrency(result.contributions)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`${theme.textColors.secondary}`}>Growth:</span>
                        <span className={`font-bold text-green-400`}>
                          {formatCurrency(growth)}
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 border-t border-gray-600">
                        <span className={`${theme.textColors.secondary}`}>Multiple:</span>
                        <span className={`font-bold ${theme.textColors.primary}`}>
                          {multiple.toFixed(1)}x
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Key Insights */}
      <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}>
        <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
          <Zap className="w-5 h-5" />
          Compound Interest Insights
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`p-4 ${theme.status.info.bg} rounded-lg`}>
            <h4 className={`font-medium ${theme.status.info.text} mb-2`}>Time is Your Greatest Asset</h4>
            <p className={`text-sm ${theme.textColors.secondary}`}>
              Starting early, even with small amounts, often beats starting late with larger amounts due to compound growth.
            </p>
          </div>
          
          <div className={`p-4 ${theme.status.success.bg} rounded-lg`}>
            <h4 className={`font-medium ${theme.status.success.text} mb-2`}>Consistency Beats Perfection</h4>
            <p className={`text-sm ${theme.textColors.secondary}`}>
              Regular monthly contributions create a steady wealth-building habit that compounds dramatically over time.
            </p>
          </div>
          
          <div className={`p-4 ${theme.status.warning.bg} rounded-lg`}>
            <h4 className={`font-medium ${theme.status.warning.text} mb-2`}>Returns Make the Difference</h4>
            <p className={`text-sm ${theme.textColors.secondary}`}>
              Higher returns dramatically increase final wealth. Even 2-3% difference compounds to hundreds of thousands.
            </p>
          </div>
        </div>
      </div>

      {/* Educational Note */}
      <div className={`${theme.status.info.bg} border ${theme.status.info.border} rounded-lg p-4 text-center`}>
        <p className={`text-sm ${theme.status.info.text} font-medium`}>
          💡 These projections assume consistent returns and contributions. Actual results will vary due to market volatility, but the power of compound growth remains the key to long-term wealth building.
        </p>
      </div>
    </motion.div>
  );
}
