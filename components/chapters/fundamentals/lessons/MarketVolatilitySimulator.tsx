'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, Play, Pause, RotateCcw, DollarSign, AlertTriangle, CheckCircle, Zap, Brain } from 'lucide-react';
import { theme } from '@/lib/theme';
import GradientCard from '@/components/shared/ui/GradientCard';
import { Decimal } from 'decimal.js';

interface MarketVolatilitySimulatorProps {
  className?: string;
}

interface MarketEvent {
  id: string;
  name: string;
  description: string;
  duration: number; // months
  impact: number; // percentage change
  emotionalTrigger: string;
  correctResponse: string;
  wrongResponse: string;
  historicalExample: string;
  recoveryTime: number; // months
}

interface SimulationData {
  month: number;
  portfolioValue: number;
  marketReturn: number;
  cumulativeReturn: number;
  event?: string;
}

interface Strategy {
  id: string;
  name: string;
  description: string;
  implementation: (event: MarketEvent, currentValue: number) => number;
  color: string;
}

const marketEvents: MarketEvent[] = [
  {
    id: 'covid-crash',
    name: 'Pandemic Market Crash',
    description: 'Global pandemic causes 35% market decline in 6 weeks',
    duration: 2,
    impact: -35,
    emotionalTrigger: 'Fear: "This time is different, the economy will never recover"',
    correctResponse: 'Continue regular investing or increase contributions during the decline',
    wrongResponse: 'Sell everything and wait for "clarity" before reinvesting',
    historicalExample: 'COVID-19 (March 2020): Markets fell 35% then recovered to new highs within 6 months',
    recoveryTime: 6
  },
  {
    id: 'tech-bubble',
    name: 'Technology Bubble Burst',
    description: 'Overvalued tech stocks crash 70%, broad market down 45%',
    duration: 24,
    impact: -45,
    emotionalTrigger: 'Despair: "Technology investing is dead, growth stocks are finished"',
    correctResponse: 'Rebalance portfolio, continue systematic investing in diversified funds',
    wrongResponse: 'Abandon all growth/tech investments, move to "safe" assets only',
    historicalExample: 'Dot-com crash (2000-2002): Tech fell 78%, but Amazon rose 21,000% over next 20 years',
    recoveryTime: 36
  },
  {
    id: 'financial-crisis',
    name: 'Global Financial Crisis',
    description: 'Banking system collapse, housing crash, unemployment soars',
    duration: 18,
    impact: -55,
    emotionalTrigger: 'Panic: "The entire financial system is collapsing permanently"',
    correctResponse: 'Maintain or increase equity allocation, focus on fundamentals',
    wrongResponse: 'Move everything to cash and gold, avoid all financial assets',
    historicalExample: '2008 Financial Crisis: 55% decline followed by 400% recovery over next decade',
    recoveryTime: 60
  },
  {
    id: 'inflation-shock',
    name: 'Inflation Shock',
    description: 'Inflation surges to 15%, interest rates spike, growth stocks crash',
    duration: 12,
    impact: -25,
    emotionalTrigger: 'Confusion: "Inflation will destroy all investments forever"',
    correctResponse: 'Shift toward value stocks, REITs, and inflation-protected securities',
    wrongResponse: 'Hold only cash, assuming inflation makes all investments worthless',
    historicalExample: '1970s Inflation: Despite high inflation, diversified portfolios still generated positive real returns',
    recoveryTime: 24
  },
  {
    id: 'geopolitical-crisis',
    name: 'Geopolitical Crisis',
    description: 'Major military conflict disrupts global trade and energy markets',
    duration: 6,
    impact: -20,
    emotionalTrigger: 'Anxiety: "War will destroy the global economy"',
    correctResponse: 'Stay diversified globally, minor tactical adjustments only',
    wrongResponse: 'Sell international investments, retreat to domestic-only portfolio',
    historicalExample: 'Gulf War (1991): Initial 15% decline recovered within 3 months as conflict resolved quickly',
    recoveryTime: 12
  }
];

const strategies: Strategy[] = [
  {
    id: 'panic-seller',
    name: 'Panic Seller',
    description: 'Sells during crashes, buys during peaks (emotional investing)',
    implementation: (event, currentValue) => {
      // Sells at worst possible time, often near the bottom
      const sellTiming = Math.random() * 0.5 + 0.7; // Sells when down 70-120% of max decline
      return currentValue * (1 + event.impact * sellTiming);
    },
    color: '#EF4444'
  },
  {
    id: 'market-timer',
    name: 'Market Timer',
    description: 'Tries to time market entries and exits (often wrong)',
    implementation: (event, currentValue) => {
      // Sometimes right, often wrong - gets maybe 30% of timing correct
      const timingAccuracy = Math.random() < 0.3 ? 0.8 : 1.2; // 30% chance of good timing
      return currentValue * (1 + event.impact * timingAccuracy);
    },
    color: '#F59E0B'
  },
  {
    id: 'dollar-cost-averager',
    name: 'Dollar Cost Averager',
    description: 'Continues regular investing regardless of market conditions',
    implementation: (event, currentValue) => {
      // Benefits from consistent investing during downturns
      const additionalBenefit = Math.abs(event.impact) * 0.1; // Benefits 10% more during crashes
      return currentValue * (1 + event.impact - additionalBenefit);
    },
    color: '#10B981'
  },
  {
    id: 'contrarian',
    name: 'Contrarian Investor',
    description: 'Increases investments during crashes, takes profits at peaks',
    implementation: (event, currentValue) => {
      // Invests more during crashes, gets better prices
      const contrarianBonus = Math.abs(event.impact) * 0.2; // 20% better performance during crashes
      return currentValue * (1 + event.impact - contrarianBonus);
    },
    color: '#8B5CF6'
  }
];

export default function MarketVolatilitySimulator({ className = '' }: MarketVolatilitySimulatorProps) {
  const [selectedStrategy, setSelectedStrategy] = useState(strategies[0]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(0);
  const [simulationData, setSimulationData] = useState<SimulationData[]>([]);
  const [currentEvent, setCurrentEvent] = useState<MarketEvent | null>(null);
  const [portfolioValue, setPortfolioValue] = useState(100000);
  const [totalMonths] = useState(240); // 20 years
  const [emotionalState, setEmotionalState] = useState<'calm' | 'fear' | 'greed' | 'panic'>('calm');
  const [eventPhase, setEventPhase] = useState<'normal' | 'crisis' | 'recovery'>('normal');

  const generateMarketReturn = (month: number, event: MarketEvent | null): number => {
    const baseReturn = 0.007; // ~8.4% annual average
    const volatility = 0.04; // Monthly volatility
    
    // Random normal return
    let monthlyReturn = baseReturn + (Math.random() - 0.5) * volatility * 2;
    
    // Apply event impact if in crisis
    if (event && eventPhase === 'crisis') {
      const eventProgress = (currentMonth % event.duration) / event.duration;
      const eventImpact = event.impact * eventProgress / event.duration; // Spread impact over duration
      monthlyReturn += eventImpact;
    }
    
    // Recovery phase - slightly better returns
    if (event && eventPhase === 'recovery') {
      monthlyReturn += 0.003; // Slight recovery boost
    }
    
    return monthlyReturn;
  };

  const triggerRandomEvent = () => {
    if (Math.random() < 0.02 && !currentEvent) { // 2% chance per month
      const randomEvent = marketEvents[Math.floor(Math.random() * marketEvents.length)];
      setCurrentEvent(randomEvent);
      setEventPhase('crisis');
      setEmotionalState('panic');
    }
  };

  const updateSimulation = () => {
    if (currentMonth >= totalMonths) {
      setIsSimulating(false);
      return;
    }

    const marketReturn = generateMarketReturn(currentMonth, currentEvent);
    let newPortfolioValue = portfolioValue;

    // Apply strategy during events
    if (currentEvent && eventPhase === 'crisis') {
      newPortfolioValue = selectedStrategy.implementation(currentEvent, portfolioValue);
    } else {
      // Normal market performance
      newPortfolioValue = portfolioValue * (1 + marketReturn);
    }

    // Add regular contributions (simulate monthly investing)
    const monthlyContribution = 1000;
    newPortfolioValue += monthlyContribution;

    const cumulativeReturn = ((newPortfolioValue - 100000 - (currentMonth * monthlyContribution)) / 100000) * 100;

    const newDataPoint: SimulationData = {
      month: currentMonth,
      portfolioValue: newPortfolioValue,
      marketReturn: marketReturn * 100,
      cumulativeReturn,
      event: currentEvent?.name
    };

    setSimulationData(prev => [...prev, newDataPoint]);
    setPortfolioValue(newPortfolioValue);
    
    // Handle event phases
    if (currentEvent) {
      if (eventPhase === 'crisis' && currentMonth % currentEvent.duration === 0) {
        setEventPhase('recovery');
        setEmotionalState('fear');
      } else if (eventPhase === 'recovery' && currentMonth % currentEvent.recoveryTime === 0) {
        setCurrentEvent(null);
        setEventPhase('normal');
        setEmotionalState('calm');
      }
    }

    // Check for new events
    triggerRandomEvent();
    
    setCurrentMonth(prev => prev + 1);
  };

  useEffect(() => {
    if (isSimulating) {
      const interval = setInterval(updateSimulation, 200); // Faster simulation
      return () => clearInterval(interval);
    }
  }, [isSimulating, currentMonth, portfolioValue, currentEvent, eventPhase]);

  const resetSimulation = () => {
    setIsSimulating(false);
    setCurrentMonth(0);
    setSimulationData([]);
    setCurrentEvent(null);
    setPortfolioValue(100000);
    setEmotionalState('calm');
    setEventPhase('normal');
  };

  const getEmotionalColor = () => {
    switch (emotionalState) {
      case 'panic': return 'text-red-400';
      case 'fear': return 'text-orange-400';
      case 'greed': return 'text-green-400';
      default: return 'text-blue-400';
    }
  };

  const getPerformanceComparison = () => {
    if (simulationData.length === 0) return null;
    
    const finalValue = simulationData[simulationData.length - 1]?.portfolioValue || portfolioValue;
    const totalContributions = 100000 + (currentMonth * 1000);
    const totalReturn = ((finalValue - totalContributions) / totalContributions) * 100;
    
    return {
      finalValue,
      totalContributions,
      totalReturn,
      years: currentMonth / 12
    };
  };

  const performance = getPerformanceComparison();

  return (
    <div className={`space-y-6 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <GradientCard variant="glass" gradient="blue" className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className={`${theme.status.info.bg} p-3 rounded-lg`}>
              <TrendingUp className={`w-6 h-6 ${theme.status.info.text}`} />
            </div>
            <div>
              <h3 className={`text-2xl font-bold ${theme.textColors.primary}`}>
                Market Volatility Simulator
              </h3>
              <p className={`${theme.textColors.secondary}`}>
                Test different investment strategies during market crises
              </p>
            </div>
          </div>

          {/* Strategy Selection */}
          <div className="mb-6">
            <h4 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Choose Your Investment Strategy
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {strategies.map((strategy) => (
                <motion.button
                  key={strategy.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedStrategy(strategy)}
                  className={`p-4 border-2 rounded-lg transition-all text-left ${
                    selectedStrategy.id === strategy.id
                      ? `border-[${strategy.color}] bg-[${strategy.color}]/10`
                      : `${theme.borderColors.muted} hover:${theme.borderColors.primary}`
                  }`}
                >
                  <h5 className={`font-semibold ${theme.textColors.primary} mb-2`}>
                    {strategy.name}
                  </h5>
                  <p className={`text-sm ${theme.textColors.secondary}`}>
                    {strategy.description}
                  </p>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 mb-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsSimulating(!isSimulating)}
              className={`flex items-center px-6 py-3 ${theme.buttons.primary} rounded-xl transition-all hover-lift`}
            >
              {isSimulating ? (
                <>
                  <Pause className="w-5 h-5 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" />
                  Start Simulation
                </>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={resetSimulation}
              className={`flex items-center px-6 py-3 ${theme.buttons.secondary} rounded-xl transition-all hover-lift`}
            >
              <RotateCcw className="w-5 h-5 mr-2" />
              Reset
            </motion.button>

            <div className={`flex items-center ${getEmotionalColor()}`}>
              <Brain className="w-5 h-5 mr-2" />
              <span className="font-medium capitalize">{emotionalState}</span>
            </div>
          </div>

          {/* Current Status */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className={`p-4 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg`}>
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className={`w-5 h-5 ${theme.status.info.text}`} />
                <span className={`font-semibold ${theme.status.info.text}`}>Portfolio Value</span>
              </div>
              <p className={`text-2xl font-bold ${theme.textColors.primary}`}>
                ${portfolioValue.toLocaleString()}
              </p>
            </div>

            <div className={`p-4 ${theme.status.warning.bg} border ${theme.status.warning.border} rounded-lg`}>
              <div className="flex items-center gap-2 mb-2">
                <Zap className={`w-5 h-5 ${theme.status.warning.text}`} />
                <span className={`font-semibold ${theme.status.warning.text}`}>Time Elapsed</span>
              </div>
              <p className={`text-2xl font-bold ${theme.textColors.primary}`}>
                {Math.floor(currentMonth / 12)} years {currentMonth % 12} months
              </p>
            </div>

            {performance && (
              <>
                <div className={`p-4 ${performance.totalReturn >= 0 ? theme.status.success.bg : theme.status.error.bg} border ${performance.totalReturn >= 0 ? theme.status.success.border : theme.status.error.border} rounded-lg`}>
                  <div className="flex items-center gap-2 mb-2">
                    {performance.totalReturn >= 0 ? (
                      <TrendingUp className={`w-5 h-5 ${theme.status.success.text}`} />
                    ) : (
                      <TrendingDown className={`w-5 h-5 ${theme.status.error.text}`} />
                    )}
                    <span className={`font-semibold ${performance.totalReturn >= 0 ? theme.status.success.text : theme.status.error.text}`}>
                      Total Return
                    </span>
                  </div>
                  <p className={`text-2xl font-bold ${theme.textColors.primary}`}>
                    {performance.totalReturn.toFixed(1)}%
                  </p>
                </div>

                <div className={`p-4 ${theme.status.success.bg} border ${theme.status.success.border} rounded-lg`}>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className={`w-5 h-5 ${theme.status.success.text}`} />
                    <span className={`font-semibold ${theme.status.success.text}`}>Contributions</span>
                  </div>
                  <p className={`text-2xl font-bold ${theme.textColors.primary}`}>
                    ${performance.totalContributions.toLocaleString()}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Current Event Alert */}
          <AnimatePresence>
            {currentEvent && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`mb-6 p-4 ${theme.status.error.bg} border ${theme.status.error.border} rounded-lg`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className={`w-5 h-5 ${theme.status.error.text}`} />
                  <h5 className={`font-semibold ${theme.status.error.text}`}>
                    Market Crisis: {currentEvent.name}
                  </h5>
                </div>
                <p className={`${theme.textColors.secondary} text-sm mb-3`}>
                  {currentEvent.description}
                </p>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <h6 className={`font-medium ${theme.textColors.primary} mb-1`}>Emotional Trigger:</h6>
                    <p className={`text-sm ${theme.status.error.text}`}>{currentEvent.emotionalTrigger}</p>
                  </div>
                  <div>
                    <h6 className={`font-medium ${theme.textColors.primary} mb-1`}>Historical Example:</h6>
                    <p className={`text-sm ${theme.textColors.secondary}`}>{currentEvent.historicalExample}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Portfolio Chart */}
          {simulationData.length > 0 && (
            <div className="h-64 mb-6">
              <h4 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
                Portfolio Performance Over Time
              </h4>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={simulationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#9CA3AF"
                    tickFormatter={(value) => `${Math.floor(value / 12)}y`}
                  />
                  <YAxis 
                    stroke="#9CA3AF"
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1F2937',
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Portfolio Value']}
                    labelFormatter={(value) => `Month ${value}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="portfolioValue" 
                    stroke={selectedStrategy.color}
                    fill={`${selectedStrategy.color}20`}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Strategy Results Summary */}
          {performance && performance.years >= 5 && (
            <div className={`p-4 ${theme.status.success.bg} border ${theme.status.success.border} rounded-lg`}>
              <h5 className={`font-semibold ${theme.status.success.text} mb-2`}>
                Strategy Performance Analysis
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className={`${theme.textColors.secondary}`}>
                    <strong>Strategy:</strong> {selectedStrategy.name}
                  </p>
                  <p className={`${theme.textColors.secondary}`}>
                    <strong>Time Period:</strong> {performance.years.toFixed(1)} years
                  </p>
                </div>
                <div>
                  <p className={`${theme.textColors.secondary}`}>
                    <strong>Total Invested:</strong> ${performance.totalContributions.toLocaleString()}
                  </p>
                  <p className={`${theme.textColors.secondary}`}>
                    <strong>Final Value:</strong> ${performance.finalValue.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className={`${theme.textColors.secondary}`}>
                    <strong>Total Gain:</strong> ${(performance.finalValue - performance.totalContributions).toLocaleString()}
                  </p>
                  <p className={`${theme.textColors.secondary}`}>
                    <strong>Annualized Return:</strong> {(performance.totalReturn / performance.years).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          )}
        </GradientCard>
      </motion.div>
    </div>
  );
}
