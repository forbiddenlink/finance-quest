'use client';

import { useState, useMemo } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { motion } from 'framer-motion';
import { theme } from '@/lib/theme';
import { DollarSign, TrendingUp, Clock, Target, Lightbulb, Play, Pause } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface InteractiveCompoundVisualizationProps {
  initialAmount?: number;
  initialYears?: number;
  initialRate?: number;
}

export default function InteractiveCompoundVisualization({
  initialAmount = 180,
  initialYears = 20,
  initialRate = 7
}: InteractiveCompoundVisualizationProps) {
  const [monthlyAmount, setMonthlyAmount] = useState(initialAmount);
  const [timeframe, setTimeframe] = useState(initialYears);
  const [returnRate, setReturnRate] = useState(initialRate);
  const [animationYear, setAnimationYear] = useState(timeframe);
  const [isAnimating, setIsAnimating] = useState(false);

  // Calculate compound growth data
  const data = useMemo(() => {
    const monthlyRate = returnRate / 100 / 12;
    const result = [];
    
    for (let year = 1; year <= timeframe; year++) {
      const months = year * 12;
      
      // Simple savings (no compound interest)
      const simpleSavings = monthlyAmount * months;
      
      // Compound growth calculation using PMT formula
      const compoundValue = monthlyAmount * (
        (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate
      );
      
      // Interest earned
      const interestEarned = compoundValue - simpleSavings;
      
      result.push({
        year,
        simpleSavings,
        compoundValue,
        interestEarned,
        difference: compoundValue - simpleSavings
      });
    }
    
    return result;
  }, [monthlyAmount, timeframe, returnRate]);

  // Animation data (up to current animation year)
  const animatedData = useMemo(() => {
    return data.slice(0, animationYear);
  }, [data, animationYear]);

  // Key metrics for the final year
  const finalYear = data[data.length - 1];
  const totalContributed = finalYear?.simpleSavings || 0;
  const totalValue = finalYear?.compoundValue || 0;
  const totalInterest = finalYear?.interestEarned || 0;
  const opportunityCostMultiplier = totalValue / totalContributed;

  // Start animation
  const startAnimation = () => {
    setIsAnimating(true);
    setAnimationYear(1);
    
    const interval = setInterval(() => {
      setAnimationYear(prev => {
        if (prev >= timeframe) {
          clearInterval(interval);
          setIsAnimating(false);
          return timeframe;
        }
        return prev + 1;
      });
    }, 300); // 300ms per year
  };

  const resetAnimation = () => {
    setIsAnimating(false);
    setAnimationYear(timeframe);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${theme.backgrounds.card} rounded-xl border ${theme.borderColors.primary} p-6 lg:p-8`}
    >
      {/* Header */}
      <div className="mb-6">
        <h3 className={`${theme.typography.heading3} ${theme.textColors.primary} mb-2 flex items-center gap-2`}>
          <TrendingUp className="w-6 h-6 text-emerald-400" />
          Interactive Compound Growth Visualizer
        </h3>
        <p className={`${theme.textColors.secondary} text-sm`}>
          See how small amounts grow exponentially over time with compound returns
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className={`${theme.backgrounds.cardHover} rounded-lg p-4 border ${theme.borderColors.primary}`}>
          <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2 flex items-center gap-2`}>
            <DollarSign className="w-4 h-4" />
            Monthly Investment
          </label>
          <div className="space-y-3">
            <Slider
              value={[monthlyAmount]}
              onValueChange={(value: number[]) => setMonthlyAmount(value[0])}
              max={1000}
              min={50}
              step={10}
              className="w-full"
            />
            <div className="flex items-center justify-between">
              <span className={`text-xs ${theme.textColors.muted}`}>$50</span>
              <span className={`text-lg font-bold ${theme.textColors.primary}`}>
                {formatCurrency(monthlyAmount)}
              </span>
              <span className={`text-xs ${theme.textColors.muted}`}>$1,000</span>
            </div>
          </div>
        </div>

        <div className={`${theme.backgrounds.cardHover} rounded-lg p-4 border ${theme.borderColors.primary}`}>
          <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2 flex items-center gap-2`}>
            <Clock className="w-4 h-4" />
            Time Period
          </label>
          <div className="space-y-3">
            <Slider
              value={[timeframe]}
              onValueChange={(value: number[]) => setTimeframe(value[0])}
              max={40}
              min={5}
              step={1}
              className="w-full"
            />
            <div className="flex items-center justify-between">
              <span className={`text-xs ${theme.textColors.muted}`}>5 years</span>
              <span className={`text-lg font-bold ${theme.textColors.primary}`}>
                {timeframe} years
              </span>
              <span className={`text-xs ${theme.textColors.muted}`}>40 years</span>
            </div>
          </div>
        </div>

        <div className={`${theme.backgrounds.cardHover} rounded-lg p-4 border ${theme.borderColors.primary}`}>
          <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2 flex items-center gap-2`}>
            <Target className="w-4 h-4" />
            Annual Return
          </label>
          <div className="space-y-3">
            <Slider
              value={[returnRate]}
              onValueChange={(value: number[]) => setReturnRate(value[0])}
              max={15}
              min={1}
              step={0.5}
              className="w-full"
            />
            <div className="flex items-center justify-between">
              <span className={`text-xs ${theme.textColors.muted}`}>1%</span>
              <span className={`text-lg font-bold ${theme.textColors.primary}`}>
                {returnRate}%
              </span>
              <span className={`text-xs ${theme.textColors.muted}`}>15%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Animation Controls */}
      <div className="flex justify-center mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={startAnimation}
            disabled={isAnimating}
            className={`flex items-center gap-2 px-4 py-2 ${theme.buttons.primary} rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <Play className="w-4 h-4" />
            {isAnimating ? 'Animating...' : 'Watch Growth'}
          </button>
          <button
            onClick={resetAnimation}
            className={`flex items-center gap-2 px-4 py-2 ${theme.buttons.ghost} rounded-lg font-medium transition-all`}
          >
            <Pause className="w-4 h-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className={`${theme.backgrounds.cardHover} rounded-lg p-4 border ${theme.borderColors.primary} mb-6`}>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={animatedData}>
              <defs>
                <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCompound" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="year" 
                stroke="#9ca3af"
                tick={{ fill: '#9ca3af' }}
              />
              <YAxis 
                stroke="#9ca3af"
                tick={{ fill: '#9ca3af' }}
                tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
              />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  formatCurrency(value), 
                  name === 'simpleSavings' ? 'Just Saving' : 'With Compound Growth'
                ]}
                labelFormatter={(year) => `Year ${year}`}
                contentStyle={{
                  backgroundColor: '#1f2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#f9fafb'
                }}
              />
              <Area 
                type="monotone" 
                dataKey="simpleSavings" 
                stroke="#ef4444" 
                strokeWidth={2}
                fillOpacity={0.3}
                fill="url(#colorSavings)"
                name="simpleSavings"
              />
              <Area 
                type="monotone" 
                dataKey="compoundValue" 
                stroke="#10b981" 
                strokeWidth={3}
                fillOpacity={0.4}
                fill="url(#colorCompound)"
                name="compoundValue"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {isAnimating && (
          <div className="text-center mt-4">
            <p className={`text-sm ${theme.textColors.secondary}`}>
              Year {animationYear} of {timeframe} • Watching compound growth in action
            </p>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className={`text-center p-4 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg`}
        >
          <div className={`text-2xl font-bold ${theme.status.info.text} mb-1`}>
            {formatCurrency(totalContributed)}
          </div>
          <p className={`text-sm ${theme.textColors.secondary}`}>Total Contributed</p>
          <p className={`text-xs ${theme.textColors.muted} mt-1`}>
            {formatCurrency(monthlyAmount)} × {timeframe * 12} months
          </p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={`text-center p-4 ${theme.status.success.bg} border ${theme.status.success.border} rounded-lg`}
        >
          <div className={`text-2xl font-bold ${theme.status.success.text} mb-1`}>
            {formatCurrency(totalValue)}
          </div>
          <p className={`text-sm ${theme.textColors.secondary}`}>Final Value</p>
          <p className={`text-xs ${theme.textColors.muted} mt-1`}>
            With {returnRate}% annual returns
          </p>
        </motion.div>

        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`text-center p-4 ${theme.status.warning.bg} border ${theme.status.warning.border} rounded-lg`}
        >
          <div className={`text-2xl font-bold ${theme.status.warning.text} mb-1`}>
            {formatCurrency(totalInterest)}
          </div>
          <p className={`text-sm ${theme.textColors.secondary}`}>Interest Earned</p>
          <p className={`text-xs ${theme.textColors.muted} mt-1`}>
            Free money from compound growth!
          </p>
        </motion.div>
      </div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className={`${theme.status.info.bg} border ${theme.status.info.border} rounded-lg p-6`}
      >
        <h4 className={`font-bold ${theme.status.info.text} mb-3 flex items-center gap-2`}>
          <Lightbulb className="w-5 h-5" />
          Key Insights
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className={`${theme.textColors.secondary} mb-2`}>
              <strong>Compound Multiplier:</strong> Your money grows {opportunityCostMultiplier.toFixed(1)}x through compound returns
            </p>
            <p className={`${theme.textColors.secondary}`}>
              <strong>Monthly vs Final:</strong> {formatCurrency(monthlyAmount)}/month becomes {formatCurrency(totalValue / (timeframe * 12))}/month in future value
            </p>
          </div>
          <div>
            <p className={`${theme.textColors.secondary} mb-2`}>
              <strong>Time Power:</strong> {Math.round((totalInterest / totalContributed) * 100)}% of your final value comes from compound growth
            </p>
            <p className={`${theme.textColors.secondary}`}>
              <strong>Early Start Bonus:</strong> Starting 5 years earlier could add ~{formatCurrency(monthlyAmount * 60 * Math.pow(1 + returnRate/100, 5))} more
            </p>
          </div>
        </div>
      </motion.div>

      {/* Scenarios */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => {
            setMonthlyAmount(180);
            setTimeframe(20);
            setReturnRate(7);
          }}
          className={`p-3 text-left ${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg hover:${theme.borderColors.accent} transition-all`}
        >
          <div className="text-sm font-medium text-amber-400">Coffee Scenario</div>
          <div className={`text-xs ${theme.textColors.muted}`}>$180/month • 20 years • 7%</div>
        </button>
        <button
          onClick={() => {
            setMonthlyAmount(500);
            setTimeframe(30);
            setReturnRate(8);
          }}
          className={`p-3 text-left ${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg hover:${theme.borderColors.accent} transition-all`}
        >
          <div className="text-sm font-medium text-emerald-400">Retirement Fund</div>
          <div className={`text-xs ${theme.textColors.muted}`}>$500/month • 30 years • 8%</div>
        </button>
        <button
          onClick={() => {
            setMonthlyAmount(1000);
            setTimeframe(15);
            setReturnRate(10);
          }}
          className={`p-3 text-left ${theme.backgrounds.cardHover} border ${theme.borderColors.primary} rounded-lg hover:${theme.borderColors.accent} transition-all`}
        >
          <div className="text-sm font-medium text-blue-400">Aggressive Growth</div>
          <div className={`text-xs ${theme.textColors.muted}`}>$1000/month • 15 years • 10%</div>
        </button>
      </div>
    </motion.div>
  );
}
