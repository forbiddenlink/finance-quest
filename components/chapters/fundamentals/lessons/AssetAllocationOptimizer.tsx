'use client';

import { useState, useEffect } from 'react';
import { useProgressStore } from '@/lib/store/progressStore';
import { theme } from '@/lib/theme';
import { motion } from 'framer-motion';
import {
  PieChart,
  TrendingUp,
  TrendingDown,
  BarChart3,
  DollarSign,
  Target,
  AlertTriangle,
  Info,
  RefreshCw,
  Settings,
  Zap,
  Shield,
  Star
} from 'lucide-react';
import toast from 'react-hot-toast';

interface AssetClass {
  name: string;
  symbol: string;
  allocation: number;
  expectedReturn: number;
  volatility: number;
  description: string;
  color: string;
}

interface PortfolioMetrics {
  expectedReturn: number;
  volatility: number;
  sharpeRatio: number;
  maxDrawdown: number;
  diversificationRatio: number;
}

const assetClasses: AssetClass[] = [
  {
    name: 'US Large Cap Stocks',
    symbol: 'VTI',
    allocation: 40,
    expectedReturn: 10.0,
    volatility: 16.0,
    description: 'S&P 500 and large US companies - core growth engine',
    color: 'bg-blue-500'
  },
  {
    name: 'International Stocks',
    symbol: 'VTIAX',
    allocation: 20,
    expectedReturn: 8.5,
    volatility: 18.0,
    description: 'Developed and emerging international markets',
    color: 'bg-green-500'
  },
  {
    name: 'US Bonds',
    symbol: 'BND',
    allocation: 25,
    expectedReturn: 4.5,
    volatility: 4.0,
    description: 'Government and corporate bonds for stability',
    color: 'bg-yellow-500'
  },
  {
    name: 'Real Estate (REITs)',
    symbol: 'VNQ',
    allocation: 10,
    expectedReturn: 9.0,
    volatility: 20.0,
    description: 'Real estate investment trusts for inflation protection',
    color: 'bg-purple-500'
  },
  {
    name: 'Commodities',
    symbol: 'VDE',
    allocation: 5,
    expectedReturn: 6.0,
    volatility: 22.0,
    description: 'Gold, oil, and commodities for diversification',
    color: 'bg-orange-500'
  }
];

const presetAllocations = {
  conservative: {
    name: 'Conservative',
    description: 'Low risk, steady income, capital preservation',
    allocations: [25, 10, 55, 8, 2],
    riskLevel: 'Low',
    idealFor: 'Near retirement, risk-averse investors'
  },
  moderate: {
    name: 'Moderate',
    description: 'Balanced growth and stability',
    allocations: [45, 20, 25, 8, 2],
    riskLevel: 'Medium',
    idealFor: 'Medium-term goals, balanced approach'
  },
  aggressive: {
    name: 'Aggressive',
    description: 'Maximum growth potential, higher volatility',
    allocations: [55, 25, 10, 8, 2],
    riskLevel: 'High',
    idealFor: 'Long-term wealth building, young investors'
  },
  growth: {
    name: 'Growth',
    description: 'Very high growth, maximum risk tolerance',
    allocations: [65, 20, 5, 7, 3],
    riskLevel: 'Very High',
    idealFor: 'Maximum wealth building, very long timeline'
  }
};

export default function AssetAllocationOptimizer() {
  const { recordCalculatorUsage } = useProgressStore();
  const [assets, setAssets] = useState<AssetClass[]>(assetClasses);
  const [investmentAmount, setInvestmentAmount] = useState(100000);
  const [timeHorizon, setTimeHorizon] = useState(20);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  useEffect(() => {
    recordCalculatorUsage('asset-allocation-optimizer');
  }, [recordCalculatorUsage]);

  const calculatePortfolioMetrics = (): PortfolioMetrics => {
    const totalAllocation = assets.reduce((sum, asset) => sum + asset.allocation, 0);
    
    // Normalize allocations to 100%
    const normalizedAssets = assets.map(asset => ({
      ...asset,
      allocation: asset.allocation / totalAllocation
    }));

    // Expected portfolio return (weighted average)
    const expectedReturn = normalizedAssets.reduce(
      (sum, asset) => sum + (asset.allocation * asset.expectedReturn / 100), 0
    ) * 100;

    // Portfolio volatility (simplified correlation model)
    const volatility = Math.sqrt(
      normalizedAssets.reduce((sum, asset) => 
        sum + Math.pow(asset.allocation * asset.volatility / 100, 2), 0
      )
    ) * 100;

    // Sharpe ratio (assuming 2% risk-free rate)
    const riskFreeRate = 2.0;
    const sharpeRatio = (expectedReturn - riskFreeRate) / volatility;

    // Estimated max drawdown (simplified model)
    const maxDrawdown = volatility * 2.5; // Rule of thumb: ~2.5x volatility

    // Diversification ratio (number of meaningful positions)
    const diversificationRatio = normalizedAssets.filter(asset => asset.allocation > 0.05).length / normalizedAssets.length;

    return {
      expectedReturn,
      volatility,
      sharpeRatio,
      maxDrawdown,
      diversificationRatio
    };
  };

  const updateAllocation = (index: number, newAllocation: number) => {
    const newAssets = [...assets];
    newAssets[index].allocation = Math.max(0, Math.min(100, newAllocation));
    setAssets(newAssets);
    setSelectedPreset(null);
  };

  const applyPreset = (presetKey: string) => {
    const preset = presetAllocations[presetKey as keyof typeof presetAllocations];
    const newAssets = assets.map((asset, index) => ({
      ...asset,
      allocation: preset.allocations[index]
    }));
    setAssets(newAssets);
    setSelectedPreset(presetKey);
    toast.success(`Applied ${preset.name} allocation! 📊`);
  };

  const rebalanceToTarget = () => {
    const totalAllocation = assets.reduce((sum, asset) => sum + asset.allocation, 0);
    if (Math.abs(totalAllocation - 100) < 0.1) {
      toast.success('Portfolio is already balanced! ✅');
      return;
    }

    const factor = 100 / totalAllocation;
    const newAssets = assets.map(asset => ({
      ...asset,
      allocation: parseFloat((asset.allocation * factor).toFixed(1))
    }));
    setAssets(newAssets);
    toast.success('Portfolio rebalanced to 100%! ⚖️');
  };

  const resetToEqual = () => {
    const equalAllocation = 100 / assets.length;
    const newAssets = assets.map(asset => ({
      ...asset,
      allocation: equalAllocation
    }));
    setAssets(newAssets);
    setSelectedPreset(null);
    toast.success('Reset to equal allocation! 🔄');
  };

  const metrics = calculatePortfolioMetrics();
  const totalAllocation = assets.reduce((sum, asset) => sum + asset.allocation, 0);
  const isBalanced = Math.abs(totalAllocation - 100) < 0.1;

  // Future value calculation
  const futureValue = investmentAmount * Math.pow(1 + metrics.expectedReturn / 100, timeHorizon);
  const totalGain = futureValue - investmentAmount;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}>
        <div className="flex items-center gap-3 mb-4">
          <div className={`${theme.status.info.bg} p-3 rounded-lg`}>
            <PieChart className={`w-6 h-6 ${theme.status.info.text}`} />
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${theme.textColors.primary}`}>
              Asset Allocation Optimizer
            </h2>
            <p className={`${theme.textColors.secondary}`}>
              Build and optimize your investment portfolio across asset classes
            </p>
          </div>
        </div>

        {/* Input Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
              Investment Amount
            </label>
            <div className="relative">
              <DollarSign className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${theme.textColors.muted}`} />
              <input
                type="number"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(parseFloat(e.target.value) || 0)}
                className={`w-full pl-10 pr-4 py-3 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${theme.textColors.primary}`}
                placeholder="100000"
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${theme.textColors.secondary} mb-2`}>
              Time Horizon (Years)
            </label>
            <input
              type="range"
              min="1"
              max="40"
              value={timeHorizon}
              onChange={(e) => setTimeHorizon(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              aria-label="Investment time horizon in years"
              title={`Time horizon: ${timeHorizon} years`}
            />
            <div className="flex justify-between text-sm text-gray-400 mt-1">
              <span>1yr</span>
              <span className={`font-medium ${theme.textColors.primary}`}>{timeHorizon} years</span>
              <span>40yr</span>
            </div>
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={rebalanceToTarget}
              disabled={isBalanced}
              className={`flex items-center gap-2 px-4 py-3 ${
                isBalanced 
                  ? `${theme.backgrounds.card} border ${theme.borderColors.primary} ${theme.textColors.muted} cursor-not-allowed`
                  : `${theme.buttons.primary}`
              } rounded-lg transition-all`}
            >
              <RefreshCw className="w-4 h-4" />
              Rebalance
            </button>
            <button
              onClick={resetToEqual}
              className={`flex items-center gap-2 px-4 py-3 border-2 ${theme.borderColors.primary} ${theme.textColors.secondary} rounded-lg hover:${theme.borderColors.accent} hover:${theme.textColors.primary} transition-all`}
            >
              <Settings className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>

        {/* Allocation Status */}
        {!isBalanced && (
          <div className={`mt-4 p-3 ${theme.status.warning.bg} border ${theme.status.warning.border} rounded-lg flex items-center gap-2`}>
            <AlertTriangle className={`w-5 h-5 ${theme.status.warning.text}`} />
            <span className={`${theme.status.warning.text} font-medium`}>
              Total allocation: {totalAllocation.toFixed(1)}% - Click &quot;Rebalance&quot; to normalize to 100%
            </span>
          </div>
        )}
      </div>

      {/* Preset Allocations */}
      <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}>
        <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-4 flex items-center gap-2`}>
          <Star className="w-5 h-5" />
          Quick Allocation Presets
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(presetAllocations).map(([key, preset]) => (
            <motion.button
              key={key}
              onClick={() => applyPreset(key)}
              aria-label={`Apply ${preset.name} allocation preset`}
              aria-pressed={selectedPreset === key}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                selectedPreset === key
                  ? `${theme.status.success.bg} ${theme.status.success.border} ${theme.status.success.text}`
                  : `${theme.backgrounds.glass} ${theme.borderColors.primary} hover:${theme.borderColors.accent}`
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`font-semibold ${theme.textColors.primary} mb-1`}>
                {preset.name}
              </div>
              <div className={`text-sm ${theme.textColors.secondary} mb-2`}>
                {preset.description}
              </div>
              <div className={`text-xs ${theme.textColors.muted}`}>
                Risk: {preset.riskLevel}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Asset Allocation Sliders */}
      <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}>
        <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-6 flex items-center gap-2`}>
          <BarChart3 className="w-5 h-5" />
          Portfolio Allocation
        </h3>

        <div className="space-y-6">
          {assets.map((asset, index) => (
            <div key={asset.symbol} className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-4 h-4 ${asset.color} rounded`} />
                  <div>
                    <div className={`font-medium ${theme.textColors.primary}`}>
                      {asset.name} ({asset.symbol})
                    </div>
                    <div className={`text-sm ${theme.textColors.secondary}`}>
                      {asset.description}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${theme.textColors.primary}`}>
                    {asset.allocation.toFixed(1)}%
                  </div>
                  <div className={`text-sm ${theme.textColors.secondary}`}>
                    ${((investmentAmount * asset.allocation / 100) / 1000).toFixed(0)}K
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.5"
                  value={asset.allocation}
                  onChange={(e) => updateAllocation(index, parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  aria-label={`${asset.name} allocation percentage`}
                  title={`${asset.name}: ${asset.allocation}%`}
                />
                <input
                  type="number"
                  value={asset.allocation}
                  onChange={(e) => updateAllocation(index, parseFloat(e.target.value) || 0)}
                  className={`w-20 px-3 py-2 ${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-lg ${theme.textColors.primary} text-center`}
                  min="0"
                  max="100"
                  step="0.5"
                  aria-label={`${asset.name} allocation percentage input`}
                  title={`Enter ${asset.name} allocation percentage`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className={`flex justify-between ${theme.textColors.secondary}`}>
                  <span>Expected Return:</span>
                  <span className="font-medium">{asset.expectedReturn}%</span>
                </div>
                <div className={`flex justify-between ${theme.textColors.secondary}`}>
                  <span>Volatility:</span>
                  <span className="font-medium">{asset.volatility}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Portfolio Metrics & Projections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Portfolio Metrics */}
        <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}>
          <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-6 flex items-center gap-2`}>
            <Shield className="w-5 h-5" />
            Portfolio Analysis
          </h3>

          <div className="space-y-4">
            <div className={`p-4 ${theme.status.success.bg} rounded-lg flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <TrendingUp className={`w-5 h-5 ${theme.status.success.text}`} />
                <span className={`font-medium ${theme.status.success.text}`}>Expected Return</span>
              </div>
              <span className={`text-xl font-bold ${theme.status.success.text}`}>
                {metrics.expectedReturn.toFixed(1)}%
              </span>
            </div>

            <div className={`p-4 ${theme.status.warning.bg} rounded-lg flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <BarChart3 className={`w-5 h-5 ${theme.status.warning.text}`} />
                <span className={`font-medium ${theme.status.warning.text}`}>Volatility</span>
              </div>
              <span className={`text-xl font-bold ${theme.status.warning.text}`}>
                {metrics.volatility.toFixed(1)}%
              </span>
            </div>

            <div className={`p-4 ${theme.status.info.bg} rounded-lg flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <Zap className={`w-5 h-5 ${theme.status.info.text}`} />
                <span className={`font-medium ${theme.status.info.text}`}>Sharpe Ratio</span>
              </div>
              <span className={`text-xl font-bold ${theme.status.info.text}`}>
                {metrics.sharpeRatio.toFixed(2)}
              </span>
            </div>

            <div className={`p-4 ${theme.status.error.bg} rounded-lg flex items-center justify-between`}>
              <div className="flex items-center gap-2">
                <TrendingDown className={`w-5 h-5 ${theme.status.error.text}`} />
                <span className={`font-medium ${theme.status.error.text}`}>Est. Max Drawdown</span>
              </div>
              <span className={`text-xl font-bold ${theme.status.error.text}`}>
                -{metrics.maxDrawdown.toFixed(1)}%
              </span>
            </div>
          </div>

          <div className={`mt-4 p-3 ${theme.status.info.bg} border ${theme.status.info.border} rounded-lg`}>
            <div className="flex items-center gap-2 mb-2">
              <Info className={`w-4 h-4 ${theme.status.info.text}`} />
              <span className={`text-sm font-medium ${theme.status.info.text}`}>Risk Assessment</span>
            </div>
            <p className={`text-sm ${theme.textColors.secondary}`}>
              {metrics.volatility < 10 && 'Conservative portfolio with low volatility and steady returns.'}
              {metrics.volatility >= 10 && metrics.volatility < 15 && 'Moderate portfolio balancing growth and stability.'}
              {metrics.volatility >= 15 && metrics.volatility < 20 && 'Aggressive portfolio with high growth potential and higher risk.'}
              {metrics.volatility >= 20 && 'Very aggressive portfolio optimized for maximum long-term growth.'}
            </p>
          </div>
        </div>

        {/* Growth Projection */}
        <div className={`${theme.backgrounds.card} border ${theme.borderColors.primary} rounded-xl p-6`}>
          <h3 className={`text-lg font-semibold ${theme.textColors.primary} mb-6 flex items-center gap-2`}>
            <Target className="w-5 h-5" />
            Growth Projection
          </h3>

          <div className="space-y-4">
            <div className={`p-4 ${theme.status.info.bg} rounded-lg text-center`}>
              <div className={`text-sm ${theme.textColors.secondary} mb-1`}>
                Initial Investment
              </div>
              <div className={`text-2xl font-bold ${theme.status.info.text}`}>
                ${investmentAmount.toLocaleString()}
              </div>
            </div>

            <div className={`p-4 ${theme.status.success.bg} rounded-lg text-center`}>
              <div className={`text-sm ${theme.textColors.secondary} mb-1`}>
                Value After {timeHorizon} Years
              </div>
              <div className={`text-3xl font-bold ${theme.status.success.text}`}>
                ${Math.round(futureValue).toLocaleString()}
              </div>
              <div className={`text-sm ${theme.textColors.secondary} mt-1`}>
                Total Gain: ${Math.round(totalGain).toLocaleString()}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className={`p-3 ${theme.backgrounds.glass} rounded-lg text-center`}>
                <div className={`text-sm ${theme.textColors.secondary} mb-1`}>
                  Annual Return
                </div>
                <div className={`text-lg font-bold ${theme.textColors.primary}`}>
                  {metrics.expectedReturn.toFixed(1)}%
                </div>
              </div>
              <div className={`p-3 ${theme.backgrounds.glass} rounded-lg text-center`}>
                <div className={`text-sm ${theme.textColors.secondary} mb-1`}>
                  Total Multiple
                </div>
                <div className={`text-lg font-bold ${theme.textColors.primary}`}>
                  {(futureValue / investmentAmount).toFixed(1)}x
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Investment Projection */}
          <div className={`mt-6 p-4 ${theme.backgrounds.glass} border ${theme.borderColors.primary} rounded-lg`}>
            <h4 className={`font-medium ${theme.textColors.primary} mb-3`}>
              Monthly Investment Plan
            </h4>
            <div className="space-y-2">
              {[500, 1000, 2000].map(monthly => {
                const rate = metrics.expectedReturn / 100;
                const futureValueMonthly = monthly * 12 * (Math.pow(1 + rate, timeHorizon) - 1) / rate;                return (
                  <div key={monthly} className="flex justify-between text-sm">
                    <span className={`${theme.textColors.secondary}`}>
                      ${monthly}/month:
                    </span>
                    <span className={`font-medium ${theme.textColors.primary}`}>
                      ${Math.round(futureValueMonthly / 1000)}K
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Educational Note */}
      <div className={`${theme.status.info.bg} border ${theme.status.info.border} rounded-lg p-4 text-center`}>
        <p className={`text-sm ${theme.status.info.text} font-medium`}>
          💡 This tool provides estimates based on historical averages. Actual returns will vary. Consider rebalancing annually to maintain target allocations.
        </p>
      </div>
    </motion.div>
  );
}
