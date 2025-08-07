'use client';

import React, { useState, useMemo } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Calendar,
  DollarSign,
  Target,
  BarChart3,
  Info,
  Lightbulb,
  AlertCircle
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface InvestmentData {
  month: number;
  monthName: string;
  marketPrice: number;
  investment: number;
  sharesPurchased: number;
  totalShares: number;
  totalInvested: number;
  portfolioValue: number;
  profit: number;
}

interface Scenario {
  id: string;
  name: string;
  description: string;
  marketPattern: 'bull' | 'bear' | 'volatile' | 'steady';
  icon: string;
}

const DollarCostAveragingCalculator: React.FC = () => {
  const { recordCalculatorUsage } = useProgressStore();
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(500);
  const [investmentPeriod, setInvestmentPeriod] = useState<number>(24);
  const [selectedScenario, setSelectedScenario] = useState<string>('volatile');
  const [lumpSumComparison, setLumpSumComparison] = useState<boolean>(true);

  React.useEffect(() => {
    recordCalculatorUsage('dollar-cost-averaging-calculator');
  }, [recordCalculatorUsage]);

  const scenarios: Scenario[] = [
    {
      id: 'bull',
      name: 'Bull Market',
      description: 'Steadily rising market with minor fluctuations',
      marketPattern: 'bull',
      icon: '📈'
    },
    {
      id: 'bear',
      name: 'Bear Market',
      description: 'Declining market with occasional rallies',
      marketPattern: 'bear',
      icon: '📉'
    },
    {
      id: 'volatile',
      name: 'Volatile Market',
      description: 'High volatility with significant ups and downs',
      marketPattern: 'volatile',
      icon: '🎢'
    },
    {
      id: 'steady',
      name: 'Steady Growth',
      description: 'Consistent moderate growth with low volatility',
      marketPattern: 'steady',
      icon: '📊'
    }
  ];

  // Generate market price data based on scenario
  const generateMarketData = (scenario: string, periods: number): number[] => {
    const prices: number[] = [];
    const basePrice = 100;
    let currentPrice = basePrice;

    for (let i = 0; i < periods; i++) {
      switch (scenario) {
        case 'bull':
          // Upward trend with small fluctuations
          const bullGrowth = 1 + (Math.random() * 0.08 + 0.02); // 2-10% monthly growth
          currentPrice *= bullGrowth;
          break;

        case 'bear':
          // Downward trend with occasional rebounds
          const bearChange = Math.random() < 0.3 ?
            1 + (Math.random() * 0.1) : // 30% chance of rebound
            1 - (Math.random() * 0.08 + 0.02); // 70% chance of decline
          currentPrice *= bearChange;
          break;

        case 'volatile':
          // High volatility
          const volatileChange = 1 + (Math.random() - 0.5) * 0.3; // ±15% swings
          currentPrice *= volatileChange;
          break;

        case 'steady':
          // Steady growth
          const steadyGrowth = 1 + (Math.random() * 0.04 + 0.005); // 0.5-4.5% monthly
          currentPrice *= steadyGrowth;
          break;

        default:
          currentPrice *= 1.02;
      }
      prices.push(Math.max(currentPrice, basePrice * 0.3)); // Floor at 30% of base
    }
    return prices;
  };

  const calculationData = useMemo(() => {
    const marketPrices = generateMarketData(selectedScenario, investmentPeriod);
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    let totalShares = 0;
    let totalInvested = 0;

    const data: InvestmentData[] = marketPrices.map((price, index) => {
      const sharesPurchased = monthlyInvestment / price;
      totalShares += sharesPurchased;
      totalInvested += monthlyInvestment;
      const portfolioValue = totalShares * price;
      const profit = portfolioValue - totalInvested;

      return {
        month: index + 1,
        monthName: monthNames[index % 12],
        marketPrice: price,
        investment: monthlyInvestment,
        sharesPurchased,
        totalShares,
        totalInvested,
        portfolioValue,
        profit
      };
    });

    // Calculate lump sum comparison
    const lumpSumAmount = monthlyInvestment * investmentPeriod;
    const lumpSumShares = lumpSumAmount / marketPrices[0];
    const lumpSumFinalValue = lumpSumShares * marketPrices[marketPrices.length - 1];

    const dcaFinalValue = data[data.length - 1].portfolioValue;
    const dcaAdvantage = dcaFinalValue - lumpSumFinalValue;
    const dcaReturn = ((dcaFinalValue - totalInvested) / totalInvested) * 100;
    const lumpSumReturn = ((lumpSumFinalValue - lumpSumAmount) / lumpSumAmount) * 100;

    return {
      data,
      lumpSum: {
        shares: lumpSumShares,
        finalValue: lumpSumFinalValue,
        return: lumpSumReturn,
        advantage: dcaAdvantage
      },
      dca: {
        finalValue: dcaFinalValue,
        return: dcaReturn,
        averageCost: totalInvested / totalShares,
        totalShares
      }
    };
  }, [monthlyInvestment, investmentPeriod, selectedScenario]);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatShares = (shares: number): string => {
    return shares.toFixed(3);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
        <div className="flex items-center gap-4 mb-4">
          <div className={`${theme.status.info.bg} p-3 rounded-full`}>
            <Calendar className={`w-8 h-8 ${theme.status.info.text}`} />
          </div>
          <div>
            <h1 className={`text-2xl font-bold ${theme.textColors.primary}`}>
              Dollar Cost Averaging Calculator
            </h1>
            <p className={`${theme.textColors.secondary}`}>
              Discover how consistent investing smooths market volatility and builds wealth
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Controls */}
        <div className={`lg:col-span-1 ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6 space-y-6`}>
          <h2 className={`text-xl font-semibold ${theme.textColors.primary} mb-4`}>
            Investment Parameters
          </h2>

          {/* Monthly Investment */}
          <div>
            <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
              Monthly Investment Amount
            </label>
            <div className="relative">
              <DollarSign className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${theme.textColors.secondary}`} />
              <input
                type="number"
                min="50"
                max="10000"
                step="50"
                value={monthlyInvestment}
                onChange={(e) => setMonthlyInvestment(Math.max(50, Number(e.target.value)))}
                className={`w-full pl-10 pr-4 py-3 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                aria-label="Monthly investment amount in dollars"
              />
            </div>
            <p className={`text-xs ${theme.textColors.secondary} mt-1`}>
              Range: $50 - $10,000 per month
            </p>
          </div>

          {/* Investment Period */}
          <div>
            <label className={`block text-sm font-medium ${theme.textColors.primary} mb-2`}>
              Investment Period (Months)
            </label>
            <div className="relative">
              <Calendar className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${theme.textColors.secondary}`} />
              <input
                type="number"
                min="6"
                max="120"
                value={investmentPeriod}
                onChange={(e) => setInvestmentPeriod(Math.max(6, Math.min(120, Number(e.target.value))))}
                className={`w-full pl-10 pr-4 py-3 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary} focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                aria-label="Investment period in months"
              />
            </div>
            <p className={`text-xs ${theme.textColors.secondary} mt-1`}>
              {investmentPeriod} months = {(investmentPeriod / 12).toFixed(1)} years
            </p>
          </div>

          {/* Market Scenario */}
          <div>
            <label className={`block text-sm font-medium ${theme.textColors.primary} mb-3`}>
              Market Scenario
            </label>
            <div className="space-y-2">
              {scenarios.map((scenario) => (
                <button
                  key={scenario.id}
                  onClick={() => setSelectedScenario(scenario.id)}
                  className={`w-full p-3 rounded-lg border text-left transition-all ${selectedScenario === scenario.id
                      ? `${theme.buttons.primary} border-blue-500 shadow-md`
                      : `${theme.backgrounds.card} border ${theme.borderColors.primary} hover:${theme.backgrounds.cardHover}`
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{scenario.icon}</span>
                    <div>
                      <div className={`font-medium ${theme.textColors.primary}`}>
                        {scenario.name}
                      </div>
                      <div className={`text-xs ${theme.textColors.secondary}`}>
                        {scenario.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Lump Sum Comparison Toggle */}
          <div className="flex items-center justify-between">
            <label className={`text-sm font-medium ${theme.textColors.primary}`}>
              Compare with Lump Sum
            </label>
            <button
              onClick={() => setLumpSumComparison(!lumpSumComparison)}
              className={`relative inline-flex w-11 h-6 rounded-full transition-colors ${lumpSumComparison ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              aria-pressed={lumpSumComparison ? 'true' : 'false'}
              aria-label={`Toggle lump sum comparison ${lumpSumComparison ? 'off' : 'on'}`}
              title={`${lumpSumComparison ? 'Disable' : 'Enable'} lump sum comparison`}
            >
              <span
                className={`inline-block w-4 h-4 rounded-full bg-white transition-transform transform ${lumpSumComparison ? 'translate-x-6' : 'translate-x-1'
                  } mt-1`}
              />
            </button>
          </div>
        </div>

        {/* Results and Chart */}
        <div className="lg:col-span-2 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${theme.status.success.bg} border ${theme.status.success.border} rounded-lg p-4 text-center`}
            >
              <Target className={`w-8 h-8 ${theme.status.success.text} mx-auto mb-2`} />
              <h3 className={`font-semibold ${theme.status.success.text} mb-1`}>Final Portfolio Value</h3>
              <p className={`text-2xl font-bold ${theme.textColors.primary}`}>
                {formatCurrency(calculationData.dca.finalValue)}
              </p>
              <p className={`text-sm ${theme.textColors.secondary}`}>
                Total Return: {calculationData.dca.return.toFixed(1)}%
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`${theme.status.info.bg} border ${theme.status.info.border} rounded-lg p-4 text-center`}
            >
              <DollarSign className={`w-8 h-8 ${theme.status.info.text} mx-auto mb-2`} />
              <h3 className={`font-semibold ${theme.status.info.text} mb-1`}>Total Invested</h3>
              <p className={`text-2xl font-bold ${theme.textColors.primary}`}>
                {formatCurrency(monthlyInvestment * investmentPeriod)}
              </p>
              <p className={`text-sm ${theme.textColors.secondary}`}>
                {monthlyInvestment} × {investmentPeriod} months
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`${theme.status.warning.bg} border ${theme.status.warning.border} rounded-lg p-4 text-center`}
            >
              <BarChart3 className={`w-8 h-8 ${theme.status.warning.text} mx-auto mb-2`} />
              <h3 className={`font-semibold ${theme.status.warning.text} mb-1`}>Average Cost/Share</h3>
              <p className={`text-2xl font-bold ${theme.textColors.primary}`}>
                ${calculationData.dca.averageCost.toFixed(2)}
              </p>
              <p className={`text-sm ${theme.textColors.secondary}`}>
                Total Shares: {formatShares(calculationData.dca.totalShares)}
              </p>
            </motion.div>
          </div>

          {/* Chart */}
          <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
            <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4`}>
              Portfolio Growth Over Time
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={calculationData.data}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme.borderColors.primary} />
                  <XAxis
                    dataKey="monthName"
                    stroke={theme.textColors.secondary}
                    fontSize={12}
                  />
                  <YAxis
                    stroke={theme.textColors.secondary}
                    fontSize={12}
                    tickFormatter={(value) => formatCurrency(value)}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme.backgrounds.card,
                      border: `1px solid ${theme.borderColors.primary}`,
                      borderRadius: '8px',
                      color: theme.textColors.primary
                    }}
                    formatter={(value: number, name: string) => [
                      name === 'portfolioValue' ? formatCurrency(value) :
                        name === 'marketPrice' ? `$${value.toFixed(2)}` :
                          formatCurrency(value),
                      name === 'portfolioValue' ? 'Portfolio Value' :
                        name === 'marketPrice' ? 'Market Price' :
                          name === 'totalInvested' ? 'Total Invested' : name
                    ]}
                  />
                  <Line
                    type="monotone"
                    dataKey="portfolioValue"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={false}
                    name="portfolioValue"
                  />
                  <Line
                    type="monotone"
                    dataKey="totalInvested"
                    stroke="#6B7280"
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                    name="totalInvested"
                  />
                  <Line
                    type="monotone"
                    dataKey="marketPrice"
                    stroke="#3B82F6"
                    strokeWidth={1}
                    dot={false}
                    name="marketPrice"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Lump Sum Comparison */}
          {lumpSumComparison && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}
            >
              <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
                <TrendingUp className="w-5 h-5" />
                DCA vs. Lump Sum Comparison
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className={`font-medium ${theme.textColors.primary} mb-3`}>Dollar Cost Averaging</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={theme.textColors.secondary}>Final Value:</span>
                      <span className={`font-bold ${theme.textColors.primary}`}>
                        {formatCurrency(calculationData.dca.finalValue)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={theme.textColors.secondary}>Total Return:</span>
                      <span className={`font-bold ${calculationData.dca.return >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {calculationData.dca.return.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={theme.textColors.secondary}>Shares Owned:</span>
                      <span className={`font-bold ${theme.textColors.primary}`}>
                        {formatShares(calculationData.dca.totalShares)}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className={`font-medium ${theme.textColors.primary} mb-3`}>Lump Sum Investment</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className={theme.textColors.secondary}>Final Value:</span>
                      <span className={`font-bold ${theme.textColors.primary}`}>
                        {formatCurrency(calculationData.lumpSum.finalValue)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={theme.textColors.secondary}>Total Return:</span>
                      <span className={`font-bold ${calculationData.lumpSum.return >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {calculationData.lumpSum.return.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className={theme.textColors.secondary}>Shares Owned:</span>
                      <span className={`font-bold ${theme.textColors.primary}`}>
                        {formatShares(calculationData.lumpSum.shares)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className={`mt-4 p-4 rounded-lg ${calculationData.lumpSum.advantage > 0
                  ? theme.status.warning.bg + ' border ' + theme.status.warning.border
                  : theme.status.success.bg + ' border ' + theme.status.success.border
                }`}>
                <div className="flex items-center gap-2">
                  {calculationData.lumpSum.advantage > 0 ? (
                    <AlertCircle className={`w-5 h-5 ${theme.status.warning.text}`} />
                  ) : (
                    <Info className={`w-5 h-5 ${theme.status.success.text}`} />
                  )}
                  <span className={`font-semibold ${calculationData.lumpSum.advantage > 0 ? theme.status.warning.text : theme.status.success.text
                    }`}>
                    {calculationData.lumpSum.advantage > 0
                      ? `Lump sum would have been better by ${formatCurrency(Math.abs(calculationData.lumpSum.advantage))}`
                      : `DCA performed better by ${formatCurrency(Math.abs(calculationData.lumpSum.advantage))}`
                    }
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Educational Content */}
      <div className={`${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg p-6`}>
        <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
          <Lightbulb className="w-5 h-5" />
          Dollar Cost Averaging Benefits
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className={`font-medium ${theme.textColors.primary} mb-2`}>🎯 Reduces Timing Risk</h4>
            <p className={`text-sm ${theme.textColors.secondary}`}>
              By investing regularly, you avoid the risk of investing all your money at market peaks.
              You&apos;ll buy more shares when prices are low and fewer when prices are high.
            </p>
          </div>
          <div>
            <h4 className={`font-medium ${theme.textColors.primary} mb-2`}>📈 Smooths Volatility</h4>
            <p className={`text-sm ${theme.textColors.secondary}`}>
              Market ups and downs become less impactful on your portfolio. Consistent investing
              helps you stay disciplined and avoid emotional investment decisions.
            </p>
          </div>
          <div>
            <h4 className={`font-medium ${theme.textColors.primary} mb-2`}>💪 Builds Discipline</h4>
            <p className={`text-sm ${theme.textColors.secondary}`}>
              Automatic monthly investments create a habit of saving and investing. This systematic
              approach often leads to better long-term outcomes than sporadic large investments.
            </p>
          </div>
        </div>

        <div className={`mt-6 p-4 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg`}>
          <h4 className={`font-medium ${theme.status.info.text} mb-2 flex items-center gap-2`}>
            <Info className="w-4 h-4" />
            Pro Tip: When to Use DCA vs. Lump Sum
          </h4>
          <p className={`text-sm ${theme.textColors.secondary}`}>
            <strong>Use DCA when:</strong> You receive regular income and want to invest over time,
            you&apos;re nervous about market timing, or you want to build consistent investment habits.<br />
            <strong>Use Lump Sum when:</strong> You have a large amount available (like inheritance or bonus),
            markets are clearly undervalued, or you want maximum time in market for compound growth.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DollarCostAveragingCalculator;
